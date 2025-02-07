import React from 'react';
import AttendanceHeader from '../components/AttendanceHeader';
import AttendanceTable from '../components/AttendanceTable';
import CancelButton from '../components/CancelButton';
import RegisterButton from '../components/RegisterButton';

const AttendancePage = () => {
  return (
    <div className="container mx-auto border p-5 bg-[#f3f4f6]">
      <div className="flex justify-between items-center mb-5">
        <AttendanceHeader />
        {/* ボタンを右側に配置 */}
        <div className="flex space-x-2">
          <CancelButton />
          {/* <RegisterButton /> */}
        </div>
      </div>
      <AttendanceTable />
    </div>
  );
};

export default AttendancePage;
