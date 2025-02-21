<?php

namespace App\Http\Controllers;

use App\Models\Attendance; // Attendanceモデルのインポート
use App\Models\Student;    // Studentモデルのインポート
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\AttendanceTime;

class CheckController extends Controller
{
    public function index()
    {
        try {
            // 本日の日付を取得（形式: YYYY-MM-DD）
            $today = now()->format('Y-m-d');
 
            // attendanceテーブルから本日分のデータを取得
            $attendanceRecords = Attendance::whereDate('updated_at', $today)->get();

            // 各Attendanceレコードに対応するStudent名を取得して整形
            $response = $attendanceRecords->map(function ($attendance) use ($today) {
                // 学生番号に対応する学生情報を取得
                $student = Student::where('student_number', $attendance->student_number)->first();

                // updated_atの日付をチェック
                $attendanceDate = $attendance->updated_at->format('Y-m-d');
                $statusId = $attendanceDate === $today ? $attendance->status_id : 0; // 本日でなければstatus_idを欠席(2)に設定

                // レスポンス用に整形したデータを返す
                return [
                    'attendance_id' => $attendance->attendance_id,
                    'student_number' => $attendance->student_number,
                    'name' => $student ? $student->name : '不明', // 学生が見つからなければ「不明」を返す
                    'updated_at' => $attendance->updated_at,
                    'status_id' => $statusId, // ステータスIDを返す
                    'attendance_time' => $attendance->attendance_time,
                    'attendance_setting_id' => $attendance->attendance_setting_id // attendance_setting_id を追加
                ];
            });

            // JSON形式でレスポンスを返す
            return response()->json($response);
        } catch (\Exception $e) {
            // エラーが発生した場合、エラーメッセージとともに500を返す
            return response()->json([
                'error' => 'データの取得に失敗しました',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
