import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const AddClassDay = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 日付選択時のハンドラー
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 授業日を追加する関数
  const handleAddClassDay = async () => {
    if (!selectedDate) {
      alert('授業日を選択してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://your-api-endpoint.com/api/classday', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString().split('T')[0], // 日付をYYYY-MM-DD形式で送信
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '授業日の追加に失敗しました');
      }

      alert('授業日が追加されました');
    } catch (error) {
      setError('エラーが発生しました: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>授業日を選択してください</h2>
      <Calendar onChange={handleDateChange} value={selectedDate} />
      <button onClick={handleAddClassDay} disabled={loading} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        {loading ? '登録中...' : '授業日を追加'}
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default AddClassDay;
