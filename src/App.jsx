import React from 'react';
import './index.css';
import { Sidebar } from './components/Sidebar';
import StudentTable from './components/StudentTable';



const App = () => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="w-4/5 p-10 bg-custom-light-gray">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-10">学生一覧</h1>
      <StudentTable />
    </div>
  </div>
);

export default App;
