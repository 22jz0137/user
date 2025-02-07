import React, { useEffect, useState } from 'react';

const AttendanceCalendar = ({ currentMonth, users }) => {
    // 月の日数を取得する関数
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // 現在の月の日数を基にmonthDays配列を作成
    const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
        return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 2).toISOString().split('T')[0]; // YYYY-MM-DD形式
    });

    const getAttendanceMark = (user, date, period) => {
        const periodNumber = parseInt(period, 10);  // 文字列を数値に変換
        let attendance;
        if (user.attendance[date]) {
            attendance = user.attendance[date][period];
        }
        if (!attendance) {
            return '_';
        }

      // 出席と欠席の判定
        if (attendance === '出') {
            return <span className="bg-green-500 text-white w-full text-center">出席</span>;
        } else if (attendance === '欠') {
            return <span className="bg-red-500 text-white w-full text-center">欠席</span>;
        } 
        return <span className="">*</span>;

    };

    // 曜日ごとのスタイルを取得する関数
    const getDayClass = (date) => {
        const dayOfWeek = new Date(date).getDay();
        if (dayOfWeek === 0) return 'bg-red-500 text-white'; // 日曜日
        if (dayOfWeek === 6) return 'bg-blue-500 text-white'; // 土曜日
        return '';
    };

    // 曜日名を取得する関数
    const getDayName = (date) => {
        const dayOfWeek = new Date(date).getDay();
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return days[dayOfWeek];
    };

    if (!monthDays || !users) {
        return <div>データがありません</div>;
    }

    return (
        <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
        <table className="max-w-6xl mx-auto table-auto border-separate border-spacing-0">
            <thead className="sticky top-0 bg-white shadow-md z-50">
                {/* 1行目: 左上の固定セル + 曜日 */}
                <tr>
                    <th className="border border-gray-400 p-0.5 text-xs min-w-[60px] text-center sticky left-0 bg-white z-50"></th>
                    <th className="border border-gray-400 p-0.5 text-xs min-w-[60px] text-center sticky left-[60px] bg-white z-50"></th>
                    {monthDays.map((day, index) => (
                        <th key={index} className={`border border-gray-400 p-0.5 text-xs min-w-[60px] text-center ${getDayClass(day)}`}>
                            {getDayName(day)}
                        </th>
                    ))}
                </tr>
    
                {/* 2行目: 左上の固定セル + 日付 */}
                <tr>
                    <th className="border border-gray-400 p-0.5 text-xs min-w-[60px] text-center sticky left-0 bg-white z-50"></th>
                    <th className="border border-gray-400 p-0.5 text-xs min-w-[60px] text-center sticky left-[60px] bg-white z-50"></th>
                    {monthDays.map((day, index) => (
                        <th key={index} className="border border-gray-400 p-0.5 text-xs min-w-[60px] text-center">
                            {day}
                        </th>
                    ))}
                </tr>
    
                {/* 3行目: 学籍番号 & 名前 + 時間割 */}
                <tr>
                    <th className="border border-gray-400 p-0.5 text-xs min-w-[60px] text-center sticky left-0 bg-white z-50">
                        学籍番号
                    </th>
                    <th className="border border-gray-400 p-0.5 text-xs min-w-[80px] text-center sticky left-[60px] bg-white z-50">
                        名前
                    </th>
                    {monthDays.map((_, index) => (
                        <th key={index} className="border border-gray-400 p-0.5 text-xs min-w-[60px] text-center">
                            <div className="flex space-x-0.5 border">
                                {['1限', '2限', '3限', '4限'].map((hour, idx) => (
                                    <div key={idx} className="w-8 text-center text-xs">
                                        {hour}
                                    </div>
                                ))}
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
    
            <tbody>
                {users.map((user, userIndex) => (
                    <tr key={userIndex}>
                        <td className="border border-gray-400 p-0.5 text-xs min-w-[60px] text-center sticky left-0 bg-white z-40">
                            {user.student_number}
                        </td>
                        <td className="border border-gray-400 p-0.5 text-xs min-w-[60px] text-center sticky left-[60px] bg-white z-40">
                            {user.name}
                        </td>
                        {monthDays.map((day, dayIndex) => (
                            <td key={dayIndex} className="border border-gray-400 p-1 min-w-[40px] text-center">
                                <div className="flex space-x-0.5">
                                    {['1限', '2限', '3限', '4限'].map((hour, idx) => (
                                        <div key={idx} className="border p-0.5 w-8 text-center text-xs">
                                            {getAttendanceMark(user, day, (idx + 1).toString())}
                                        </div>
                                    ))}
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    
    );
};

export default AttendanceCalendar;
