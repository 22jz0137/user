<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AttendanceSetting;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log; // この行を追加


class AttendController extends Controller
{
    public function submitData(Request $request)
    {
        $validated = $request->validate([
            'externalImageId' => 'required|string',
        ]);

        // データを受け取って、必要な処理を行う
        $externalImageId = $validated['externalImageId'];
        
        // データをデータベースに保存
        DB::table('attendance')->insert([
            'student_number' => $externalImageId, // 
            'status_id' => 1,                    // 
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 成功レスポンスを返す
        return response()->json(['message' => 'データが正常に保存されました'], 200);
    }


    //---------------------------------------------------------------------------------出席と欠席のみ判定

    public function submitAttendance(Request $request)
    {
        // バリデーション
        $validated = $request->validate([
            'externalImageId' => 'required|string', // 学生の学籍番号または外部ID
        ]);
        
        // 学生の学籍番号を取得
        $studentNumber = $validated['externalImageId'];
    
        // 現在時刻を取得
        $currentTime = Carbon::now();
        Log::info('現在時刻: ' . $currentTime->format('H:i:s'));
        
        // 出席設定を取得
        $attendanceSetting = DB::table('attendance_settings')
            ->where('start_time', '<=', $currentTime->format('H:i:s'))
            ->orderBy('start_time', 'desc')
            ->first();
        
        // 出席設定が見つからない場合
        if (!$attendanceSetting) {
            Log::warning('出席設定が見つからない。');
            return response()->json(['message' => '出席可能な時間帯が設定されていません。'], 400);
        }
        
        // 出席可能時間の計算
        $startTime = Carbon::createFromFormat('H:i:s', $attendanceSetting->start_time);
        $checkInStartTime = $startTime->copy()->subMinutes(10); // 授業開始の10分前
        $allowEndTime = $startTime->copy()->addMinutes($attendanceSetting->attendance_window); // 授業開始後の終了時間
        
        Log::info('出席設定: 授業開始時刻 ' . $startTime->format('H:i:s'));
        Log::info('出席受付開始時刻: ' . $checkInStartTime->format('H:i:s'));
        Log::info('出席受付終了時刻: ' . $allowEndTime->format('H:i:s'));
    
        // 出席可能時間外の判定
        if ($currentTime->lessThan($checkInStartTime)) {
            Log::warning('まだ出席受付の時間ではありません。');
            return response()->json(['message' => 'まだ出席受付の時間ではありません。'], 400);
        }
    
        // 出席受付時間外なら「出席時間外です。」とレスポンス
        if ($currentTime->greaterThan($allowEndTime)) {
            Log::warning('出席時間受付時間外です。');
            return response()->json(['message' => '出席時間受付時間外です。'], 422);
        }
        
        // 重複チェック（同じ学生、同じ日付）
        $exists = DB::table('attendance')
            ->where('student_number', $studentNumber)
            ->where('attendance_setting_id', $attendanceSetting->id)
            ->whereDate('attendance_time', $currentTime->toDateString())
            ->exists();
        
        if ($exists) {
            Log::warning('既に出席記録が存在します。');
            return response()->json(['message' => '既に出席記録が存在します。'], 400);
        }
        
        // 出席記録を挿入
        DB::table('attendance')->insert([
            'student_number' => $studentNumber,
            'status_id' => 1, // 出席
            'attendance_setting_id' => $attendanceSetting->id,
            'attendance_time' => $currentTime->toDateTimeString(),
            'note' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        Log::info('出席が登録されました。');
    
        return response()->json(['message' => '出席が登録されました。'], 200);
    }
    
    //---------------------------------------------------------授業時間取得

    public function edit()
    {
        $settings = AttendanceSetting::all();  // AttendanceTimeモデルを使ってデータを取得
        return response()->json($settings);  // JSON形式で返す
    }
    //----------------------------------------------------------授業時間セッティング
    public function update(Request $request)
{
    \Log::info('受け取ったデータ:', $request->all());

    // 入力バリデーション（複数の時限データが送信されることを想定）
    $request->validate([
        'times' => 'required|array',
        'times.*.id' => 'required|integer|exists:attendance_settings,id',
        'times.*.period' => 'required|string',
        'times.*.start_time' => 'required|date_format:H:i:s', // 秒を含めた形式に変更
        'times.*.end_time' => 'required|date_format:H:i:s',
        'times.*.attendance_window' => 'required|integer|min:1',
    ]);

    // 送信された時限データをループして更新
    foreach ($request->input('times') as $timeData) {
        try {
            // 対象の設定をIDで取得
            $setting = AttendanceSetting::findOrFail($timeData['id']);
    
            // 更新する設定
            $setting->period = $timeData['period'];
            $setting->start_time = $timeData['start_time'];
            $setting->end_time = $timeData['end_time'];
            $setting->attendance_window = $timeData['attendance_window'];  // 分単位で直接保存
            $setting->save();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // 対象の設定が見つからない場合
            return response()->json(['error' => '指定された時限IDが存在しません。'], 404);
        } catch (\Exception $e) {
            // その他のエラー
            return response()->json(['error' => '設定の更新に失敗しました。' . $e->getMessage()], 500);
        }
    }
    

    // 更新が成功したことを返す
    return response()->json(['message' => '設定が更新されました']);
}

    //----------------------------------------------------------------------------------------------
   
    public function gettime(Request $request) {
        // 現在時刻を取得
        $currentTime = Carbon::now();
    
        // 出席設定を取得（現在時刻以前の最新の設定）
        $attendanceSetting = DB::table('attendance_settings')
            ->where('start_time', '<=', $currentTime->format('H:i:s'))
            ->orderBy('start_time', 'desc')
            ->first();
        
        // 出席設定が見つからない場合
        if (!$attendanceSetting) {
            return response()->json(['message' => '出席可能な時間帯が設定されていません。'], 400);
        }
    
        // 現在時刻と一致する出席設定を返す
        return response()->json([
            'start_time' => $attendanceSetting->start_time,
            'message' => '出席設定が取得されました。'
        ]);
    }
    //-----------------------------------------------------------------------------------------------
    public function classsStore(Request $request)
    {
        // バリデーション
        $request->validate([
            'date' => 'required|date', // 日付が必須で、正しい日付形式であること
        ]);

        // 新しい授業日をデータベースに保存
        $classDay = ClassDay::create([
            'date' => $request->date, // 送信された日付を保存
        ]);

        // 成功レスポンスを返す
        return response()->json($classDay, 201);
    }

    //----------------------------------------------------------------------------- CSVアップロードで一括登録
    public function bulkUpload(Request $request)
    {
        // ファイルのバリデーション
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        // アップロードされたCSVファイルを取得
        $file = $request->file('file');
        
        // League\Csvパッケージを使用してCSVを読み込む
        $csv = \League\Csv\Reader::createFromPath($file->getRealPath(), 'r');
        $csv->setHeaderOffset(0); // ヘッダー行を設定

        // レコードを取得
        $records = $csv->getRecords();
        $addedDays = 0;

        foreach ($records as $record) {
            $date = $record['date']; // CSV内の'日付'列を取得
            if (strtotime($date)) {
                ClassDay::create(['date' => $date]); // 日付を保存
                $addedDays++;
            }
        }

        // 成功レスポンスを返す
        return response()->json(['message' => "$addedDays 授業日が追加されました"], 200);
    }

    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'student_number' => 'required|string',
            'date' => 'required|date',
            'period' => 'required|integer',
            'status' => 'required|string',
        ]);

        $attendance = Attendance::where('student_number', $validated['student_number'])
                                ->where('attendance_time', $validated['date'])
                                ->where('attendance_setting_id', $validated['period'])
                                ->first();

        if ($attendance) {
            $attendance->status_id = ($validated['status'] === '出席') ? 1 : 2; // 1: 出席, 2: 欠席
            $attendance->save();

            return response()->json(['message' => 'Attendance status updated successfully.'], 200);
        }

        return response()->json(['error' => 'Attendance not found.'], 404);
    }
}


