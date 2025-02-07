import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import GradeButton from '../components/GradeButton';

const StudentPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-4/5 p-10 bg-gray-100">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-10">学生一覧</h1>
                <div className="flex justify-center mb-6">
                    <GradeButton />
                </div>
            </div>
        </div>
    );
};

export default StudentPage;
