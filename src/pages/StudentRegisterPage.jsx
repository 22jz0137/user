// StudentRegisterPage.jsx
import React from 'react';
import CancelButton from '../components/CancelButton';
import RegisterButton from '../components/RegisterButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentRegisterPage = () => {
  const handleRegister = () => {
    const isConfirmed = window.confirm('登録してもよろしいですか？');
    if (isConfirmed) {
      toast.success('登録が完了しました！');
    } else {
      toast.info('登録をキャンセルしました。');
    }
  };

  return (
    <div className="bg-gray-100 p-12 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">学生新規登録</h1>
        <form className="space-y-6">
          {/* 学生番号 */}
          <div className="flex items-center">
            <label htmlFor="studentId" className="w-1/6 font-medium text-lg">学生番号</label>
            <input 
              id="studentId" 
              type="text" 
              className="w-5/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          {/* 名前 */}
          <div className="flex items-center">
            <label htmlFor="name" className="w-1/6 font-medium text-lg">名前</label>
            <input 
              id="name" 
              type="text" 
              className="w-5/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          {/* 性別 */}
          <div className="flex items-center">
            <label htmlFor="gender" className="w-1/6 font-medium text-lg">性別</label>
            <input 
              id="gender" 
              type="text" 
              className="w-5/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          {/* 学年 */}
          <div className="flex items-center">
            <label htmlFor="grade" className="w-1/6 font-medium text-lg">学年</label>
            <input 
              id="grade" 
              type="text" 
              className="w-5/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          {/* 顔写真 */}
          <div className="flex items-center">
            <label htmlFor="photo" className="w-1/6 font-medium text-lg">顔写真</label>
            <input 
              id="photo" 
              type="file" 
              className="w-5/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          {/* ボタン */}
          <div className="flex justify-center space-x-4">
            <CancelButton />
            <RegisterButton onRegister={handleRegister} />
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentRegisterPage;
