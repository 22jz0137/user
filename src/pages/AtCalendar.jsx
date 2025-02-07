import React from 'react';
import Sidebar from '../components/Sidebar';
import GradeButton3 from '../components/GradeButton3';

const StudentPage = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-4/5 p-10 bg-gray-100">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-10">出席カレンダー</h1>
                <div className="flex justify-center">
                    <GradeButton3 />
                </div>
            </div>
            
        </div>
    );
};

export default StudentPage;
