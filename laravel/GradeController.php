<?php
namespace App\Http\Controllers;

use App\Models\Grade;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'grade' => 'required|string|max:255',
        ]);

        $grade = Grade::create([
            'grade' => $request->grade,
        ]);

        return response()->json($grade, 201);
    }

    public function index()
    {
        $grades = Grade::all();
        return response()->json($grades);
    }
}