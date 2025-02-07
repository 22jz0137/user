import React, { useState } from 'react';

const TimeSetting = ({ times, onTimesChange }) => {
    const [errors, setErrors] = useState({}); // エラーを管理する状態

    // 時間がHH:mm形式であることを確認するバリデーション関数
    const validateTime = (time) => {
        const regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
        return regex.test(time);
    };

    // 入力が変更された時の処理
    const handleChange = (index, field, value) => {
        const newTimes = [...times];
        let newErrors = { ...errors };

        // 時間関連のフィールド（start_time, end_time）についての処理
        if (field === 'start_time' || field === 'end_time') {
            // 時間のフォーマットをHH:mm形式で保存
            value = value.slice(0, 5); // 時間のみを取得

            // 時間のバリデーション
            if (!validateTime(value)) {
                newErrors[field] = '時間はHH:mm形式で入力してください。';
            } else {
                delete newErrors[field]; // エラーが解決した場合はエラーメッセージを削除
            }
        }

        // 出席ウィンドウのバリデーション
        if (field === 'attendance_window' && isNaN(value)) {
            newErrors[field] = '受付時間は数値で入力してください。';
        } else {
            delete newErrors[field]; // エラーが解決した場合はエラーメッセージを削除
        }

        newTimes[index][field] = value;
        setErrors(newErrors); // エラー状態を更新
        onTimesChange(newTimes); // 親コンポーネントに変更を通知
    };

    return (
        <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
            <thead>
                <tr className="bg-blue-600 text-white text-center">
                    <th className="border border-gray-300 px-6 py-3">時限</th>
                    <th className="border border-gray-300 px-6 py-3">授業開始時間</th>
                    <th className="border border-gray-300 px-6 py-3">授業終了時間</th>
                    <th className="border border-gray-300 px-6 py-3">受付時間（分）</th>
                </tr>
            </thead>
            <tbody>
                {times.map((time, index) => (
                    <tr key={time.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="border border-gray-300 px-6 py-3 text-center">{time.period}</td>
                        <td className="border border-gray-300 px-6 py-3 text-center">
                            <input
                                type="time"
                                value={time.start_time.slice(0, 5)}
                                onChange={(e) => handleChange(index, 'start_time', e.target.value)}
                                className="border rounded px-3 py-1 w-32 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                            />
                            {errors.start_time && (
                                <div className="text-red-600 text-sm mt-1">{errors.start_time}</div>
                            )}
                        </td>
                        <td className="border border-gray-300 px-6 py-3 text-center">
                            <input
                                type="time"
                                value={time.end_time.slice(0, 5)}
                                onChange={(e) => handleChange(index, 'end_time', e.target.value)}
                                className="border rounded px-3 py-1 w-32 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                            />
                            {errors.end_time && (
                                <div className="text-red-600 text-sm mt-1">{errors.end_time}</div>
                            )}
                        </td>
                        <td className="border border-gray-300 px-6 py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-gray-700">開始から</span>
                                <input
                                    type="number"
                                    value={time.attendance_window}
                                    onChange={(e) => handleChange(index, 'attendance_window', e.target.value)}
                                    className="border rounded px-3 py-1 w-20 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                                    placeholder="分"
                                    min="0" 
                                    max="90"
                                />
                                <span className="text-gray-700">分</span>
                            </div>
                            {errors.attendance_window && (
                                <div className="text-red-600 text-sm mt-1">{errors.attendance_window}</div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
};

export default TimeSetting;
