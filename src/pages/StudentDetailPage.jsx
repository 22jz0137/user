import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StudentTable from '../components/StudentTable';
import DeleteButton from '../components/DeleteButton';
import BackButton from '../components/BackButton';
import VoidButton from '../components/VoidButton';
import ShowButton from '../components/ShowButton';

const StudentDetailPage = () => {
  const { grade } = useParams(); // URLのgradeパラメータを取得

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-4/5 pt-6 pb-10 px-10 bg-custom-light-gray flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">学生一覧</h1>
          <div className="flex space-x-4">
            <BackButton className="w-32" />
            <Link to={`/students/st-detail/${grade}/hide`}>
              <VoidButton className="w-32 " />
            </Link>
            <Link to={`/students/st-detail/${grade}/show`}>
              <ShowButton className="w-32" />
            </Link>
            <Link to={`/students/st-detail/${grade}/delete`}>
              <DeleteButton className="w-32" />
            </Link>
          </div>
        </div>
        <StudentTable />
      </div>
    </div>
  );
};

export default StudentDetailPage;


