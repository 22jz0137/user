import React from 'react';

const SuccessPage = () => {
    const handleCloseSite = () => {
        window.close(); // サイトを閉じる
    };

    return (
        <div className="flex items-center justify-center p-10 bg-gray-100 min-h-screen">
            <div className="text-center w-full max-w-4xl bg-white shadow-lg rounded-lg p-10">
                <h1 className="text-5xl font-bold text-green-600 mb-6">登録完了</h1>
                <p className="text-2xl text-gray-700 mb-10">
                    登録が完了しました。
                </p>

            </div>
        </div>
    );
};

export default SuccessPage;
