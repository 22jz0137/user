import React, { useState } from 'react';
import CancelButton from '../components/CancelButton';
import DeleteButton from '../components/DeleteButton';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート

import 'react-toastify/dist/ReactToastify.css';

const StudentEditPage = () => {
    const [studentId, setStudentId] = useState('');
    const [name, setName] = useState('');
    const [nameKana, setNameKana] = useState('');
    const navigate = useNavigate(); // useNavigateフックを使用

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === 'studentId') setStudentId(value);
        if (id === 'name') setName(value);
        if (id === 'nameKana') setNameKana(value);
    };

    const handleDelete = async () => {
        const isConfirmed = window.confirm('削除してもよろしいですか？');
        if (isConfirmed) {
            try {
                const response = await fetch(`https://nikkunicompany.mydns.jp/api/Delete/${studentId}/${name}/${nameKana}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    toast.success('削除が完了しました！');
                    setTimeout(() => {
                        navigate(-1); // 前の画面に戻る
                    }, 2000); // 2秒待ってから遷移
                } else {
                    const error = await response.json();
                    toast.error(`削除に失敗しました: ${error.message}`);
                }
            } catch (error) {
                toast.error('削除に失敗しました。');
            }
        } else {
            toast.info('削除をキャンセルしました。');
        }
    };

    return (
        <div className="bg-gray-100 p-12 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-8 text-center">学生情報削除</h1>
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
                    <div className="flex items-center">
                        <label htmlFor="name" className="w-1/6 font-medium text-lg">名前</label>
                        <input 
                            id="name" 
                            type="text"  
                            value={name}
                            onChange={handleInputChange}
                            className="w-5/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="nameKana" className="w-1/6 font-medium text-lg">名前（カナ）</label>
                        <input 
                            id="nameKana" 
                            type="text"  
                            value={nameKana}
                            onChange={handleInputChange}
                            className="w-5/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>

                    <div className="flex justify-center space-x-4">
                        <CancelButton />
                        <DeleteButton onDelete={handleDelete} studentId={studentId} />
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default StudentEditPage;
