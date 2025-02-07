import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const StudentShowPage = () => {
    const [studentId, setStudentId] = useState('');
    const navigate = useNavigate(); // useNavigateフックを使用

    const handleInputChange = (e) => {
        const { value } = e.target;
        setStudentId(value);
    };

    const handleShow = async () => {
        const isConfirmed = window.confirm('この学生を表示してもよろしいですか？');
        if (isConfirmed) {
            try {
                const response = await fetch(`https://nikkunicompany.mydns.jp/api/Valid/${studentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    toast.success('学生を表示しました！');
                    setTimeout(() => {
                        navigate(-1); // 前の画面に戻る
                    }, 2000); // 2秒待ってから遷移
                } else {
                    const error = await response.json();
                    if (error.error === 'Student is already valid') {
                        toast.error('この学生はすでに表示されています！');
                    } else {
                        toast.error(`表示に失敗しました: ${error.message || '不明なエラー'}`);
                    }
                }
            } catch (error) {
                toast.error(`表示処理に失敗しました: ${error.message || 'サーバーエラー'}`);
            }
        } else {
            toast.info('表示処理をキャンセルしました。');
        }
    };

    return (
        <div className="bg-gray-100 p-12 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-8 text-center">学生情報表示</h1>
                <form className="space-y-6">
                    <div className="flex items-center">
                        <label htmlFor="studentId" className="w-1/6 font-medium text-lg">学籍番号</label>
                        <input 
                            id="studentId" 
                            type="text" 
                            value={studentId}
                            onChange={handleInputChange}
                            className="w-5/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>

                    <div className="flex justify-center space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate(-1)} // 前の画面に戻る
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-lg hover:bg-gray-600 transition duration-200"
                        >
                            キャンセル
                        </button>
                        <button
                            type="button"
                            onClick={handleShow}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-lg hover:bg-blue-600 transition duration-200"
                        >
                            表示
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default StudentShowPage;
