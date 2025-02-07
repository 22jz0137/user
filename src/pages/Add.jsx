import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const UploadFace = () => {
  const [studentName, setStudentName] = useState('');
  const [studentNameKana, setStudentNameKana] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false); // 確認モーダル表示状態
  const [image, setImage] = useState(''); // 撮影した画像データ
  const webcamRef = useRef(null);

  const validateInput = () => {
    if (!/^[a-z0-9]{8}$/.test(studentNumber)) {
      setMessage('学籍番号は半角英数字8桁（英文字は小文字のみ）で入力してください。');
      return false;
    }
    if (!/^[\u30A0-\u30FF]+$/.test(studentNameKana)) {
      setMessage('名前（カナ）はカタカナのみで入力してください。');
      return false;
    }
    return true;
  };

  const handleOpenConfirmModal = () => {
    if (!studentName || !studentNameKana || !studentNumber || !webcamRef.current || !webcamRef.current.getScreenshot) {
      setMessage('全ての項目を入力してください。');
      return;
    }

    if (!validateInput()) return;

    const capturedImage = webcamRef.current.getScreenshot();
    if (!capturedImage) {
      setMessage('画像を撮影してください。');
      return;
    }

    setImage(capturedImage);
    setIsConfirming(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(''); // メッセージをリセット

    try {
      const response = await axios.post('https://nikkunicompany.mydns.jp/api/register', {
        name: studentName,
        name_kana: studentNameKana,
        student_number: studentNumber,
        image: image,
      });

      // 成功メッセージを表示
      setMessage(response.data.message || '登録が完了しました！');

      // 3秒後にメッセージを非表示に
      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (err) {
      console.error('登録エラー', err);
      const errorMessage = err.response?.data?.message || '登録中にエラーが発生しました。';
      setMessage(errorMessage); // エラーメッセージをセット
    } finally {
      setIsSubmitting(false);
      setIsConfirming(false); // モーダルを閉じる
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center">
        <div className="w-full lg:w-1/2 pr-12 mb-8 lg:mb-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">学生情報登録</h1>
          <div className="mb-6">
            <label className="block text-gray-700 text-lg mb-2">名前</label>
            <input
              type="text"
              placeholder="名前"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-5 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-lg mb-2">名前（カナ）</label>
            <input
              type="text"
              placeholder="名前（カナ）"
              value={studentNameKana}
              onChange={(e) => setStudentNameKana(e.target.value)}
              className="w-full px-5 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 text-lg mb-2">学籍番号</label>
            <input
              type="text"
              placeholder="学籍番号"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              className="w-full px-5 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            onClick={handleOpenConfirmModal}
            className="w-full py-3 text-lg text-white font-bold bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            登録
          </button>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="border-4 border-gray-300 rounded-lg overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={640}
              height={480}
              videoConstraints={{
                width: 1920,
                height: 1080,
                facingMode: 'user',
              }}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 確認モーダル */}
      {isConfirming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-2xl font-bold mb-4">確認</h2>
            <p className="mb-2"><strong>名前：</strong>{studentName}</p>
            <p className="mb-2"><strong>名前（カナ）：</strong>{studentNameKana}</p>
            <p className="mb-2"><strong>学籍番号：</strong>{studentNumber}</p>
            <img src={image} alt="Captured" className="rounded-lg mb-4" />
            <div className="flex justify-between">
              <button
                onClick={() => setIsConfirming(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                戻る
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                登録
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 登録成功メッセージ */}
      {message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default UploadFace;
