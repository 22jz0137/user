import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FaceRecognition = () => {
    // エラーメッセージ、ローディング状態、APIレスポンスの状態を管理する
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);  // APIレスポンスを保持するstate
    const videoRef = useRef(null);  // <video> 要素への参照
    const canvasRef = useRef(null); // <canvas> 要素への参照
    const navigate = useNavigate(); // React Router の navigate 関数を使用
    const threshold = 90;  // 顔認識のしきい値

    // 初回レンダリング時にカメラのメディアストリームを取得
    useEffect(() => {
        const getMedia = async () => {
            try {
                // カメラの映像を取得
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;  // <video> 要素にストリームを設定
                videoRef.current.play();  // 映像を再生
            } catch (err) {
                console.error("カメラのアクセスに失敗しました:", err);
                setError("カメラにアクセスできません。");
            }
        };

        getMedia();  // カメラのメディアを開始

        // クリーンアップ: コンポーネントがアンマウントされる際にストリームを停止
        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());  // ストリーム内の全てのトラックを停止
            }
        };
    }, []); // 初回のみ実行

    // 定期的にビデオフレームをキャプチャしてAPIに送信
    useEffect(() => {
        const captureAndSubmit = async () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');  // Canvasのコンテキストを取得
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);  // ビデオからフレームを描画
            const base64String = canvas.toDataURL('image/jpeg').split(',')[1];  // Base64エンコードされた画像データを取得
            await submitForm(base64String);  // 画像データをAPIに送信
        };

        // 2秒ごとに画像をキャプチャして送信
        const timeoutId = setTimeout(captureAndSubmit, 2000);
        return () => clearTimeout(timeoutId);  // クリーンアップ: タイマーを解除
    }, []); // 初回のみ実行

    // APIにデータを送信してレスポンスを処理する
    const submitForm = async (base64String) => {
        setLoading(true);  // ローディング状態を開始
        try {
            // CSRFトークンを取得
            const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
            const csrfToken = csrfTokenElement ? csrfTokenElement.getAttribute('content') : '';

            // 送信するリクエストボディの構造
            const requestBody = {
                body: {
                    threshold: threshold,  // 顔認識のしきい値
                    image_base64str: base64String,  // Base64エンコードされた画像データ
                },
            };

            console.log('送信するリクエストボディ:', requestBody);  // リクエストボディをログに表示

            // APIにPOSTリクエストを送信
            const response = await axios.post(
                'https://jj225rr6zj.execute-api.ap-northeast-1.amazonaws.com/prod/search',
                requestBody,
                {
                    headers: {
                        'x-api-key': 'jtfzLBrT5g4AL8bIFftbX1OHZdioV2rf7XVmGW8s',  // APIキー
                        'X-CSRF-TOKEN': csrfToken,  // CSRFトークン
                        'Content-Type': 'application/json',  // リクエストヘッダにContent-Typeを指定
                    },
                }
            );

            // APIからのレスポンスを取得し、顔認識の結果を確認
            const faceMatches = response.data?.payloads?.FaceMatches;
            setApiResponse(response.data);  // APIレスポンスを保存

            if (faceMatches && faceMatches.length > 0) {
                const externalImageId = faceMatches[0].Face.ExternalImageId;  // 最初の顔マッチ結果を取得
                const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });  // ローカル時間を取得
                navigate(
                    `/result?externalImageId=${encodeURIComponent(externalImageId)}&imageBase64=${encodeURIComponent(base64String)}&timestamp=${encodeURIComponent(timestamp)}`
                );
                  // 結果ページに遷移
            } else {
                navigate(`/error?errorMessage=${encodeURIComponent('顔認識に失敗した')}`);  // 顔認識に失敗した場合、エラーページへ遷移
            }
            setError(null);  // エラーをリセット
        } catch (err) {
            console.error('API呼び出し中にエラーが発生しました:', err);
            setError('エラーが発生しました: ' + (err.response?.data?.message || err.message));  // エラーメッセージを設定
            navigate(`/error?errorMessage=${encodeURIComponent(err)}`);  // エラーページへ遷移
        } finally {
            setLoading(false);  // ローディング状態を終了
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
