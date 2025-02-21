<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;


class ImageController extends Controller
{
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
            'studentNumber' => 'required|string',
        ]);

        // Base64形式の画像データを取得
        $imageData = $request->input('image');
        $image = base64_decode(explode(',', $imageData)[1]);

        // 学生番号の先頭2文字を取得（学年）
        $studentNumber = $request->input('studentNumber');
        $grade = substr($studentNumber, 0, 2); // 学生番号の先頭2文字を学年とする
        $fileName = $studentNumber . '.jpg'; // ファイル名は学籍番号

        // S3のディレクトリパスとして学年を使用し、その中にファイルを保存
        $path = Storage::disk('s3')->put("{$grade}/{$fileName}", $image);

        // S3のURLを返す
        if ($path) {
            $imageUrl = Storage::disk('s3')->url("{$grade}/{$fileName}");
            return response()->json(['imageUrl' => $imageUrl]);
        } else {
            return response()->json(['message' => '画像のアップロードに失敗しました。'], 500);
        }
    }
}
