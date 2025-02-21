<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;

class NewAttendanceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'student_number' => 'required|string',
            'status_id' => 'required|integer',
        ]);

        $attendance = new Attendance();
        $attendance->student_number = $request->input('student_number');
        $attendance->status_id = $request->input('status_id');
        $attendance->updated_at = now();
        $attendance->save();

        return response()->json(['data' => $attendance], 201);
    }
}
