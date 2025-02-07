import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResultPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const externalImageId = searchParams.get('externalImageId');
    const imageBase64 = searchParams.get('imageBase64');
    const timestamp = searchParams.get('timestamp');

    // はいボタンがクリックされた時の処理
    const handleYesClick = async () => {
        // POSTリクエストを送信
        const response = await fetch('https://nikkunicompany.mydns.jp/api/attend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                externalImageId,
                imageBase64,
                timestamp
            })
        });

        if (response.ok) {
            navigate('/Success'); // 登録完了画面に遷移
        } else {
            console.error('データ送信に失敗しました');
        }
    };

    const handleNoClick = () => {
        navigate('/'); // ホーム画面に遷移
    };

    return (
        <div className="flex items-center justify-center p-10 bg-gray-100 min-h-screen">
            <div className="text-center w-full max-w-7xl">
                <h1 className="text-6xl font-bold underline mb-12 text-gray-800">本人確認</h1>
                {externalImageId ? (
                    <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-2xl p-10 w-full max-w-6xl mx-auto">
                        {/* 左側 - 画像 */}
                        {imageBase64 ? (
                            <div className="flex-shrink-0 mb-8 lg:mb-0 lg:w-[600px] max-w-[600px] w-full">
                                <img
                                    src={`data:image/jpeg;base64,${imageBase64}`}
                                    alt="Captured"
                                    className="rounded-2xl shadow-lg w-full h-auto"
                                />
                            </div>
                        ) : (
                            <p className="text-red-500 text-2xl mb-8">画像データが見つかりません。</p>
                        )}

                        {/* 右側 - データ */}
                        <div className="flex flex-col justify-center items-center w-full lg:w-[600px] max-w-[600px] p-6 bg-gray-50 rounded-lg shadow-md">
                            <p className="text-3xl font-semibold text-gray-700 mb-6">
                                学籍番号: <span className="text-gray-900">{externalImageId}</span>
                            </p>
                            {timestamp && (
                                <p className="text-xl text-gray-600 mb-8">
                                    取得時間: {timestamp}
                                </p>
                            )}
                            <div className="flex gap-8 justify-center">
                                <button
                                    onClick={handleYesClick}
                                    className="px-8 py-4 bg-green-500 text-white text-2xl rounded-lg shadow hover:bg-green-600 transition"
                                >
                                    はい
                                </button>
                                <button
                                    onClick={handleNoClick}
                                    className="px-8 py-4 bg-red-500 text-white text-2xl rounded-lg shadow hover:bg-red-600 transition"
                                >
                                    いいえ
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-3xl text-gray-500">データがありません。</p>
                )}
            </div>
        </div>
    );
};

export default ResultPage;
