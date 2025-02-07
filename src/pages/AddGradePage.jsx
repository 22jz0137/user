import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AddGradePage = () => {
  const [grade, setGrade] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://nikkunicompany.mydns.jp/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grade }),
      });

      if (response.ok) {
        alert('学年が追加されました！');
        setGrade('');
      } else {
        alert('追加に失敗しました');
      }
    } catch (error) {
      console.error('エラー:', error);
      alert('エラーが発生しました');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* サイドバー */}
      <Sidebar />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">学年追加</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
          <label className="block mb-2 text-gray-700">学年</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            required
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-1/2 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg transition mr-2"
            >
              追加
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGradePage;
