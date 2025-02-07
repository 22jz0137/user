import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ErrorPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const errorMessage = searchParams.get('errorMessage');

    return (
        <div>
            <h1>エラー</h1>
            <p className="text-3xl font-bold underline">顔認識に失敗しました。再試行してください。</p>
            {errorMessage}
            <button onClick={() => navigate('/')}>戻る</button>
        </div>
    );
};

export default ErrorPage;
