import React, { useState, useEffect } from 'react';

const AttendanceHeader = ({ className = "3JZ1", dateOptions = { year: 'numeric', month: 'long', day: 'numeric' } }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateCurrentDate = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('ja-JP', dateOptions));
    };

    updateCurrentDate(); // 初回表示時刻を設定

    // タイマーを設定して定期的に日付を更新することも可能
    const interval = setInterval(updateCurrentDate, 60000); // 1分ごとに更新

    return () => clearInterval(interval); // コンポーネントがアンマウントされたときにクリーンアップ
  }, [dateOptions]);

  return (
    <div className="header flex justify-between mb-5">
      <div className="flex space-x-5">
        <span className="font-bold text-2xl">出席登録</span>
        {/* <span className="border px-2 text-xl">{className}</span> クラス名を表示 */}
        <span className="border px-2 text-xl">{currentDate}</span> {/* 現在の日付を表示 */}
      </div>
    </div>
  );
};

export default AttendanceHeader;
