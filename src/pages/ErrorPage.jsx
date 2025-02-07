import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ErrorPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const errorMessage = searchParams.get('errorMessage');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">エラー</h1>
            <p className="text-xl font-medium text-gray-800 mb-6">顔認識に失敗しました。再試行してください。</p>
           
            <button 
                onClick={() => navigate('/')} 
                className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-600 focus:outline-none"
            >
                戻る
            </button>
        </div>
    );
};

export default ErrorPage;
