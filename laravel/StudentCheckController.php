<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentCheckController extends Controller
{
    public function getStudents()
    {
        try {
            // データベースから students テーブルのデータを取得
            $students = DB::table('students')->get();

            // JSON形式でデータを返す
            return response()->json($students);
        } catch (\Exception $e) {
            // エラー処理
            return response()->json(['error' => 'データ取得エラー: ' . $e->getMessage()], 500);
        }
    }

    //-------------------------------------------------------------getname
    public function getStudentById($externalImageId)
    {
        try {
            // student_number（または face_id）で検索
            $student = DB::table('students')->where('student_number', $externalImageId)->first();
    
            if ($student) {
                return response()->json($student);
            } else {
                return response()->json(['error' => '学生情報が見つかりません。'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'データ取得エラー: ' . $e->getMessage()], 500);
        }
    }
}
