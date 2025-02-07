import React, { useState, useEffect } from 'react';
import RegisterButton from '../components/RegisterButton';
import TimeSetting from '../components/TimeSetting';
import Sidebar from '../components/Sidebar';

const TimeSettingPage = () => {
    const [times, setTimes] = useState([]);
    const [initialTimes, setInitialTimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 時間設定のデータ更新時のハンドラー
    const handleTimesChange = (newTimes) => {
        setTimes(newTimes);
    };

    // 時間設定の保存
    const handleRegister = async () => {
        if (times.length === 0) {
            alert('時間設定がありません。');
            return;
        }

        setLoading(true);
        setError(null); // エラーをリセット

        const formattedTimes = times.map((time) => ({
            ...time,
            start_time: time.start_time.length === 5 ? `${time.start_time}:00` : time.start_time,
            end_time: time.end_time.length === 5 ? `${time.end_time}:00` : time.end_time,
        }));

        try {
            const response = await fetch('https://nikkunicompany.mydns.jp/api/timeupdate', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    times: formattedTimes,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('設定の保存に失敗しました');
            }

            alert('設定が保存されました。');
            setInitialTimes(formattedTimes);
        } catch (error) {
            setError('エラーが発生しました: ' + error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // キャンセル時の挙動
    const handleCancel = () => {
        setTimes(initialTimes);
    };

    // ページロード時に初期データを取得
    useEffect(() => {
        const fetchTimes = async () => {
            setLoading(true);
            setError(null); // エラーをリセット

            try {
                const response = await fetch('https://nikkunicompany.mydns.jp/api/time');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setTimes(data);
                        setInitialTimes(data);
                    } else {
                        setError('取得したデータが空です。');
                    }
                } else {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    setError('データ取得に失敗しました');
                }
            } catch (error) {
                setError('エラーが発生しました: ' + error.message);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTimes();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 bg-gray-100 p-6">
                <div className="container mx-auto max-w-3xl px-6">
                    <h1 className="text-2xl font-bold mb-4">時間設定</h1>
                    {loading ? (
                        <div className="text-center text-xl text-gray-600">データを取得中...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center text-xl">{error}</div>
                    ) : (
                        <div>
                            <TimeSetting times={times} onTimesChange={handleTimesChange} className="mb-4" />
                            <div className="mt-8 flex justify-end space-x-4">

                                <RegisterButton onRegister={handleRegister} className="text-lg" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimeSettingPage;
