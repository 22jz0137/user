import React from 'react';
import { useNavigate } from 'react-router-dom'; // 追加
import Sidebar from '../components/Sidebar';
import GradeButton2 from '../components/GradeButton2';

const AttendancePage = () => {
  const navigate = useNavigate(); // ルート遷移用

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-4/5 p-10 bg-gray-100">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-10">出席登録</h1>
        <div className="flex justify-center mb-10">
          <GradeButton2 />
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
