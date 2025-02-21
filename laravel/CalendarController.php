<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;

class CalendarController extends Controller
{
    public function index()
    {
        // attendanceテーブルから必要なカラムを選択し、studentsテーブルのnameカラムを取得
        $attendances = Attendance::with('student:student_number','student:name')  // 'student'リレーションを使い、必要なカラムを取得
            ->select('attendance_id', 'status_id', 'attendance_setting_id', 'student_number', 'attendance_time', 'created_at')  // attendanceテーブルのカラムを選択
            ->get();

        // データを返す（JSON形式）
        return response()->json($attendances);
    }

    // 出席データを更新するメソッド
    public function updateAttendance(Request $request, $attendance_id)
    {
        // 入力データの検証
        $validated = $request->validate([
            'student_number' => 'required|string',
            'status_id' => 'required|integer',
            'attendance_setting_id' => 'required|integer',
            'attendance_time' => 'required|date',
        ]);

        // attendance_id に基づいて該当の出席データを取得
        $attendance = Attendance::find($attendance_id);

        if (!$attendance) {
            return response()->json(['message' => 'Attendance not found'], 404);
        }

        // データを更新
        $attendance->student_number = $validated['student_number'];
        $attendance->status_id = $validated['status_id'];
        $attendance->attendance_setting_id = $validated['attendance_setting_id'];
        $attendance->attendance_time = $validated['attendance_time']; // 修正した日時を使用

        // 保存
        $attendance->save();

        // 更新後のデータを返す
        return response()->json(['message' => 'Attendance updated successfully', 'attendance' => $attendance]);
    }
}
