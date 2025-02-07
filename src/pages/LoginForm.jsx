import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import bImage from '../assets/img/logo.png';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // useHistoryをuseNavigateに変更

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://nikkunicompany.mydns.jp/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // ログイン成功時の処理
        navigate('/attendance'); // ページ遷移
      } else {
        // エラーレスポンスの内容を取得
        const errorData = await response.json();
        if (errorData.message === 'Invalid credentials') {
          alert('ユーザーネームまたはパスワードが間違っています。');
        } else {
          alert('ログインに失敗しました: ' + (errorData.message || '不明なエラー'));
        }
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('ネットワークエラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="mb-4 flex justify-center">
          <img src={bImage} alt="顔写真" className="h-24 w-24" />
        </div>
        <h1 className="text-center text-2xl font-semibold mb-6">ログイン</h1>

        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            name="admin_id"
            placeholder="教員ID"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            type="password"
            name="password"
            placeholder="パスワード"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SubmitButton label="ログイン" />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
