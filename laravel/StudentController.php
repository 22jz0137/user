<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Aws\Rekognition\RekognitionClient;
use Aws\Credentials\Credentials;
use App\Models\Student;
use Illuminate\Support\Facades\Log;
// use Aws\Exception\RekognitionException;
use Aws\Exception\AwsException;
use Illuminate\Support\Facades\DB;


class StudentController extends Controller
{
//---------------------------------------------------------------------------------------学生の新規登録
public function register(Request $request)
{
    try {
        // 入力データのバリデーション
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kana' => 'required|string|max:255',
            'student_number' => 'required|string|unique:students,student_number',
            'image' => 'required|string',
        ]);

    
        // Base64形式の画像データを取得
        $imageData = $validated['image'];
        if (!preg_match('/^data:image\/\w+;base64,/', $imageData)) {
            throw new \Exception('画像データが無効です。Base64形式の画像を提供してください。');
        }

        $imageData = substr($imageData, strpos($imageData, ',') + 1);
        $image = base64_decode($imageData);
        if ($image === false) {
            throw new \Exception('画像のデコードに失敗しました。Base64形式が正しいか確認してください。');
        }

        // 学生番号の先頭2文字を取得（学年）
        $studentNumber = $validated['student_number'];
        $grade = substr($studentNumber, 0, 2);
        $fileName = "{$studentNumber}.jpg";

        // S3のディレクトリパスとして学年を使用し、その中にファイルを保存
        Storage::disk('s3')->put("{$grade}/{$fileName}", $image);
        $imageUrl = Storage::disk('s3')->url("{$grade}/{$fileName}");

        // AWS Rekognitionクライアントの初期化
        $rekognitionClient = new RekognitionClient([
            'region' => env('AWS_DEFAULT_REGION', 'ap-northeast-1'),
            'version' => 'latest',
            'credentials' => new Credentials(env('AWS_ACCESS_KEY_ID'), env('AWS_SECRET_ACCESS_KEY')),
        ]);

        // 顔認識リクエストの送信（インデックス化）
        $externalImageId = preg_replace('/[^a-zA-Z0-9_\.\-:]/', '_', $studentNumber);
        $result = $rekognitionClient->indexFaces([
            'CollectionId' => env('REKOGNITION_COLLECTION_ID'),
            'Image' => [
                'S3Object' => [
                    'Bucket' => env('AWS_BUCKET'),
                    'Name' => "{$grade}/{$fileName}",
                ],
            ],
            'ExternalImageId' => $externalImageId,
            'MaxFaces' => 1,
            'QualityFilter' => 'AUTO',
            'DetectionAttributes' => ['DEFAULT'],
        ]);

        Log::info('Rekognition結果:', $result->toArray());

        // 顔情報取得
        $faceRecords = $result['FaceRecords'] ?? [];
        if (empty($faceRecords)) {
            throw new \Exception('顔が見つかりませんでした。画像の品質や顔の向き、明るさを確認してください。');
        }

        // 顔IDを取得
        $faceId = $faceRecords[0]['Face']['FaceId'];

        // 学生情報をデータベースに保存
        $student = Student::create([
            'name' => $validated['name'],
            'name_kana' => $validated['name_kana'],
            'face_id' => $faceId,
            'student_number' => $studentNumber,
            'face_photo_url' => $imageUrl,
        ]);

        Log::info('登録した学生情報:', ['student' => $student]);

        return response()->json([
            'message' => '学生情報と顔写真が登録されました。',
            'student' => $student,
        ], 201);

    } catch (AwsException $e) {
        Log::error('AWS SDKエラー: ' . $e->getMessage());
        return response()->json([
            'message' => 'AWSサービスの利用中にエラーが発生しました。',
            'error' => $e->getAwsErrorMessage(),
        ], 500);
    } catch (\Illuminate\Validation\ValidationException $e) {
        // バリデーションエラーをカスタマイズして返す
        return response()->json([
            'message' => '既に登録されています',
            'error' => $e->errors(),
        ], 400);
    } catch (\Exception $e) {
        Log::error('エラー: ' . $e->getMessage());
        return response()->json([
            'message' => '予期しないエラーが発生しました。',
            'error' => $e->getMessage(),
        ], 500);
    }
}
    //-------------------------------------------------------------------------------------学生情報の削除
    public function delete($studentId, $name, $namekana)
    {

        DB::beginTransaction(); // トランザクションを開始
        
        try {
            $student = Student::where('student_number', $studentId)
            ->where('name', $name)
            ->where('name_kana', $namekana)
            ->first();
        
            if (!$student) {
                return response()->json([
                    'message' => '学生情報が見つかりません。',
                ], 404);
            }
        
            // RekognitionとS3削除の結果を追跡
            $rekognitionResult = null;
            $s3Result = null;
        
            // Rekognitionから顔情報を削除
            if (!empty($student->face_id)) {
                try {
                    $credentials = new Credentials(env('AWS_ACCESS_KEY_ID'), env('AWS_SECRET_ACCESS_KEY'));
                    $rekognitionClient = new RekognitionClient([
                        'region' => env('AWS_DEFAULT_REGION', 'ap-northeast-1'),
                        'version' => 'latest',
                        'credentials' => $credentials,
                    ]);
        
                    $rekognitionResult = $rekognitionClient->deleteFaces([
                        'CollectionId' => env('REKOGNITION_COLLECTION_ID'),
                        'FaceIds' => [$student->face_id],
                    ]);
                } catch (RekognitionException $e) {
                    Log::error('Rekognition削除エラー: ' . $e->getMessage());
                    throw new \Exception('Rekognition削除エラー: ' . $e->getMessage()); // トランザクションをロールバックさせるため
                }
            }
        
            // S3から画像を削除
            if (!empty($student->face_photo_url)) {
                try {
                    $imagePath = str_replace(env('AWS_URL'), '', $student->face_photo_url);
                    $s3Result = Storage::disk('s3')->delete($imagePath);
                } catch (\Exception $e) {
                    Log::error('S3画像削除エラー: ' . $e->getMessage());
                    throw new \Exception('S3画像削除エラー: ' . $e->getMessage()); // トランザクションをロールバックさせるため
                }
            }
        
            // データベースから学生情報を削除
            $student->delete();
        
            DB::commit(); // トランザクションをコミット
        
            Log::info('削除された学生情報:', ['student' => $student]);
        
            return response()->json([
                'message' => '学生情報が削除されました。',
                'rekognition_result' => $rekognitionResult,
                's3_result' => $s3Result,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack(); // トランザクションをロールバック
        
            Log::error('削除処理中のエラー: ' . $e->getMessage());
            return response()->json([
                'message' => '学生削除中にエラーが発生しました。',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    //----------------------------------------------------------------------------------------DBから学生情報の取得
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
    

    //--------------------------------------------------------------------------------------------学生情報の更新
   // PUTリクエストを受け取るAPI
   public function update(Request $request, $studentId)
   {
       // 学生情報を取得
       $student = Student::where('student_number', $studentId)->first();
   
       // 学生が存在しない場合
       if (!$student) {
           return response()->json(['error' => 'Student not found'], 404);
       }
   
       // 入力データを更新
       $student->update($request->only(['name', 'name_kana']));
   
       // 更新成功のレスポンス
       return response()->json(['message' => 'Student updated successfully'], 200);
   }
   
   //取得するデータの条件API

//--------------------------------------------------------------------------------------------学生情報の無効化
public function disableStudent($studentId)
{
    try {
        // 学生情報を取得
        $student = Student::where('student_number', $studentId)->first();

        // 学生が存在しない場合
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        // 既に無効化されている場合
        if ($student->is_disabled === 1) {
            return response()->json(['error' => 'Student is already disabled'], 400);
        }

        // 学生の無効化
        $student->is_disabled = 1; // 明示的に 1 を設定
        $student->save(); // save() メソッドを使って保存

        // 更新成功のレスポンス
        return response()->json(['message' => 'Student disabled successfully'], 200);
    } catch (\Exception $e) {
        // エラー処理
        return response()->json(['error' => 'Error disabling student: ' . $e->getMessage()], 500);
    }
}

// -------------------------------------------------------------------------------------------- 学生情報の有効化
public function validStudent($studentId)
{
    try {
        // 学生情報を取得
        $student = Student::where('student_number', $studentId)->first();

        // 学生が存在しない場合
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        // 既に有効化されている場合
        if ($student->is_disabled === null) {
            return response()->json(['error' => 'Student is already valid'], 400);
        }

        // 学生の有効化
        $student->is_disabled = null; // null を設定
        $student->save(); // save() メソッドを使って保存

        // 更新成功のレスポンス
        return response()->json(['message' => 'Student valid successfully'], 200);
    } catch (\Exception $e) {
        // エラー処理
        return response()->json(['error' => 'Error enabling student: ' . $e->getMessage()], 500);
    }
}

}