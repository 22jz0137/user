<?php

namespace App\Http\Controllers;

use App\Models\Teacher; // Teacherモデルをインポート
use Illuminate\Http\Request; // リクエストデータを取得
use Illuminate\Support\Facades\Hash; // パスワードのハッシュ化や照合用
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    // ログイン処理のメソッド
    public function login(Request $request)
    {
        // バリデーション
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);
    
        // ユーザー名で認証
        if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
            $request->session()->regenerate();
            return response()->json(['message' => 'Login successful'], 200);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    
    
    }
    // ログアウト処理
    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Logout successful'], 200);
    }
}