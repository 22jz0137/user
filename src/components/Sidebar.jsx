import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();

  // ログアウトボタンの動作
  const handleLogout = async() => {
    const response = await fetch('https://nikkunicompany.mydns.jp/api/logout',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
       
        }),
      });
      if (!response.ok) {
        throw new Error(`logout error: ${response.status}`);
      }
    navigate('/login');
  };

  return (
    <div className="w-1/5 bg-gray-800 p-5 h-screen">
      <ul className="space-y-4">
        {/* 出席登録ページへのリンク */}
        <li>
          <Link to="/attendance">
            <span className="text-white bg-gray-700 py-3 px-4 rounded text-center hover:bg-custom-teal cursor-pointer block">
              出席登録
            </span>
          </Link>
        </li>

        {/* 学生一覧ページへのリンク */}
        <li>
          <Link to="/students">
            <span className="text-white bg-gray-700 py-3 px-4 rounded text-center hover:bg-custom-teal cursor-pointer block">
              学生一覧
            </span>
          </Link>
        </li>

        {/* 出席カレンダーページへのリンク */}
        <li>
          <Link to="/attendancecheck">
            <span className="text-white bg-gray-700 py-3 px-4 rounded text-center hover:bg-custom-teal cursor-pointer block">
              出席カレンダー
            </span>
          </Link>
        </li>

        {/* 時間指定ページへのリンク */}
        <li>
          <Link to="/time">
            <span className="text-white bg-gray-700 py-3 px-4 rounded text-center hover:bg-custom-teal cursor-pointer block">
              時間指定
            </span>
          </Link>
        </li>

        <li>
          <Link to="/add-grade">
            <span className="text-white bg-gray-700 py-3 px-4 rounded text-center hover:bg-custom-teal cursor-pointer block">
              学年追加
            </span>
          </Link>
        </li>

        {/* ログアウトボタン */}
        <li>
          <button
            onClick={handleLogout}
            className="text-white bg-gray-700 py-3 px-4 rounded text-center hover:bg-custom-teal cursor-pointer block w-full"
          >
            ログアウト
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;