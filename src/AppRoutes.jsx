import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FaceRecognition from "./pages/FaceRecognition";
import ResultPage from "./pages/ResultPage";
import StudentPage from './pages/StudentPage'; 
import AttendancePage from './pages/AttendancePage';  
import AttendanceDetailPage from './pages/AttendanceDetailPage'; 
import LoginForm from "./pages/LoginForm";
import AttendanceCalendarPage from "./pages/AttendanceCalendarPage";
import AtCalendar from "./pages/AtCalendar";
import TimeSettingPage from "./pages/TimeSettingPage";
import StudentEditPage from "./pages/StudentEditPage";
import StudentDetailPage from "./pages/StudentDetailPage"; // 学生詳細ページ
import StudentHidePage from "./pages/StudentHidePage"; // 非表示学生ページ
import StudentShowPage from './pages/StudentShowPage';
import Add from "./pages/Add";
import SuccessPage from './pages/SuccessPage';
import AddGradePage from './pages/AddGradePage';
import ErrorPage from './pages/ErrorPage';
export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'element={<FaceRecognition />} />
        <Route path='/Result'element={<ResultPage />} />
        <Route path='/Success'element={<SuccessPage />} />
        <Route path='/signup'element={<Add />} />
        <Route path='/login' element={<LoginForm />} />  
        <Route path='/attendance' element={<AttendancePage />} /> 
        <Route path="/attendance/detail/:grade" element={<AttendanceDetailPage />} />
        <Route path='/students' element={<StudentPage />} />   
        <Route path="/students/st-detail/:grade" element={<StudentDetailPage />} />  {/* 学生詳細ページ */}
        <Route path='/students/st-detail/:grade/delete' element={<StudentEditPage />} /> {/* 学生更新ページ */}
        <Route path='/students/st-detail/:grade/hide' element={<StudentHidePage />} /> {/* 非表示学生ページ */}
        <Route path='/students/st-detail/:grade/show' element={<StudentShowPage />} /> {/* 表示学生ページ */}
        <Route path='/attendancecheck' element={<AtCalendar />} /> 
        <Route path='/attendancecheck/detail/:grade' element={<AttendanceCalendarPage />} />
        <Route path='/time' element={<TimeSettingPage />} />   
        <Route path="/add-grade" element={<AddGradePage />} /> {/* 追加 */}
        <Route path='/error' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
