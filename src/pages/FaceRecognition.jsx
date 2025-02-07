import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FaceRecognition = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const threshold = 90;

    useEffect(() => {
        const getMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;

                // ストリームが完全に読み込まれるのを待ってから再生
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                };
            } catch (err) {
                console.error("カメラのアクセスに失敗しました:", err);
                setError("カメラにアクセスできません。");
            }
        };

        getMedia();

        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    const captureAndSubmit = async () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64String = canvas.toDataURL('image/jpeg').split(',')[1];
        await submitForm(base64String);
    };

    const submitForm = async (base64String) => {
        setLoading(true);
        try {
            const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
            const csrfToken = csrfTokenElement ? csrfTokenElement.getAttribute('content') : '';

            const requestBody = {
                body: {
                    threshold: threshold,
                    image_base64str: base64String,
                },
            };

            console.log('送信するリクエストボディ:', requestBody);

            const response = await axios.post(
                'https://jj225rr6zj.execute-api.ap-northeast-1.amazonaws.com/prod/search',
                requestBody,
                {
                    headers: {
                        'x-api-key': 'jtfzLBrT5g4AL8bIFftbX1OHZdioV2rf7XVmGW8s',
                        'X-CSRF-TOKEN': csrfToken,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const faceMatches = response.data?.payloads?.FaceMatches;
            setApiResponse(response.data);

            if (faceMatches && faceMatches.length > 0) {
                const externalImageId = faceMatches[0].Face.ExternalImageId;
                const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
                navigate(
                    `/result?externalImageId=${encodeURIComponent(externalImageId)}&imageBase64=${encodeURIComponent(base64String)}&timestamp=${encodeURIComponent(timestamp)}`
                );
            } else {
                navigate(`/error?errorMessage=${encodeURIComponent('顔認識に失敗しました')}`);
            }
            setError(null);
        } catch (err) {
            console.error('API呼び出し中にエラーが発生しました:', err);
            setError('エラーが発生しました: ' + (err.response?.data?.message || err.message));
            navigate(`/error?errorMessage=${encodeURIComponent(err.response?.data?.message || err.message)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold underline mb-6 text-gray-800">出席登録</h1>
            <video 
                ref={videoRef} 
                width="640" 
                height="480" 
                autoPlay 
                className="rounded-lg shadow-md mb-4"
            />
            <canvas 
                ref={canvasRef} 
                width="640" 
                height="480" 
                style={{ display: 'none' }} 
            />
            <button 
                onClick={captureAndSubmit} 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
            >
                撮影
            </button>
            {loading && (
                <p className="text-gray-600 text-lg">処理中...お待ちください。</p>
            )}
            {error && (
                <p className="text-red-500 text-lg mt-4">{error}</p>
            )}
            {apiResponse && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-4xl">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">APIレスポンス</h2>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 overflow-x-auto">
                        {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default FaceRecognition;
