<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use Carbon\Carbon;
use DB;

class ChangeController extends Controller
{
    public function change(Request $request)
    {
        // リクエストデータの検証
        $validated = $request->validate([
            'student_number' => 'required|string',
            'status_id' => 'required|integer',
            'attendance_time' => 'required|date',
            'attendance_setting_id' => 'required|integer',
        ]);

        // 出席設定の取得
        $attendanceSetting = DB::table('attendance_settings')
            ->where('start_time', '<=', Carbon::now()->format('H:i:s'))
            ->orderBy('start_time', 'desc')
            ->select('id', 'start_time')
            ->first();

        if (!$attendanceSetting) {
            return response()->json(['message' => '出席可能な時間帯が設定されていません。'], 400);
        }

        // attendance_time を Carbon でフォーマット変換
        $attendanceTime = Carbon::parse($validated['attendance_time'])->format('Y-m-d H:i:s');

        // 出席データの作成
        $attendance = Attendance::create([
            'student_number' => $validated['student_number'],
            'status_id' => $validated['status_id'],
            'attendance_setting_id' => $validated['attendance_setting_id'],
            'attendance_time' => $attendanceTime,  // 修正した日時を使用
        ]);

        return response()->json(['message' => '出席ステータスが更新されました', 'data' => $attendance]);
    }

    public function Insert(Request $request)
    {
        // リクエストデータの検証
        $validated = $request->validate([
            'student_number' => 'required|string',
            'status_id' => 'required|integer',
            'attendance_setting_id' => 'required|integer',
        ]);

        // attendance_timeが存在しない場合はnullを設定
        $attendanceTime = $validated['attendance_time'] ?? null;

        // 出席データの作成
        $attendance = Attendance::create([
            'student_number' => $validated['student_number'],
            'status_id' => $validated['status_id'],
            'attendance_setting_id' => $validated['attendance_setting_id'],
            'attendance_time' => $attendanceTime,  // attendance_timeがnullの場合はそのままnull
        ]);

        return response()->json(['message' => '出席ステータスが更新されました', 'data' => $attendance]);
    }

    public function updateAttendance(Request $request, $id)
    {
        // リクエストデータの検証
        $validated = $request->validate([
            'student_number' => 'required|string',
            'status_id' => 'required|integer',
            'attendance_setting_id' => 'required|integer',
        ]);

        // 出席データの取得
        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json(['message' => '出席データが見つかりません。'], 404);
        }

        // 出席データの更新
        $attendance->student_number = $validated['student_number'];
        $attendance->status_id = $validated['status_id'];
        $attendance->attendance_setting_id = $validated['attendance_setting_id'];
        $attendance->save();

        return response()->json(['message' => '出席ステータスが更新されました', 'data' => $attendance]);
    }
}
