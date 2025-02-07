import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AttendanceCalendar from '../components/AttendanceCalendar';
import { useParams } from 'react-router-dom';

const AttendanceCalendarPage = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { grade } = useParams();
    const [searchTerm, setSearchTerm] = useState(''); // 検索用のステートを追加
    const [studentsData, setStudentsData] = useState([]);
    const [calendarData, setCalendarData] = useState([]);

    // 日付範囲の状態を管理
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');

// CSVエクスポート関数

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsResponse = await fetch('https://nikkunicompany.mydns.jp/api/Students');
                const studentsData = await studentsResponse.json();
                setStudentsData(studentsData); // 学生データを保存

                const calendarResponse = await fetch('https://nikkunicompany.mydns.jp/api/calendar');
                const calendarData = await calendarResponse.json();
                setCalendarData(calendarData); // カレンダーデータを保存
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchStudents();
        
    }, [grade]); // `grade` に依存して再取得


    const handleStudentNumberChange = (e) => {
        const inputValue = e.target.value;
        setStudentNumberInput(inputValue);

        // 学籍番号に基づいて生徒をフィルタリング
        const matchedStudent = studentsData.find(student => student.student_number === inputValue);
        setFilteredStudent(matchedStudent || null);
    };

// フィルタリングされたユーザーリストを作成
const filteredUsers = studentsData
.filter(student =>
    student.student_number.toLowerCase().startsWith(grade.toLowerCase()) && student.is_disabled !== 1
)
.filter(student => {
    // 検索機能: searchTermに基づいてフィルタリング
    const searchLower = searchTerm.toLowerCase();
    return (
        student.name.toLowerCase().includes(searchLower) ||
        student.student_number.toString().includes(searchLower)
    );
})
.map(student => {
    const studentAttendance = calendarData.filter(
        att => att.student_number === student.student_number
    );
    const attendance = {};
    studentAttendance.forEach(att => {
        const date = new Date(att.created_at);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        if (!attendance[formattedDate]) {
            attendance[formattedDate] = [];
        }

        const period = att.attendance_setting_id;
        const status = att.status_id === 1 ? '出' : att.status_id === 2 ? '欠' :  att.status_id === 3 ? '未': '*';
        attendance[formattedDate][period] = status;
    });

    return {
        student_number: student.student_number,
        name: student.name,
        grade: student.grade,
        attendance,
    };
    

});

const handleMonthChange = (direction) => {
const newMonth = new Date(currentMonth);
newMonth.setMonth(currentMonth.getMonth() + direction);
setCurrentMonth(newMonth);
};  


    const handleAttendanceChange = (studentNumber, date, period, status) => {
        if (!date || !period) {
            alert('日付と何限を選択してください。');
            return;
        }

        const statusId = status === '出席' ? 1 : status === '欠席' ? 2 : status === '未' ? 3 : null;


        setAttendanceEdit(prev => ({
            ...prev,
            [studentNumber]: {
                ...(prev[studentNumber] || {}),
                [date]: {
                    ...(prev[studentNumber]?.[date] || {}),
                    [period]: status,
                },
            },
        }));
    };




    const saveAttendance = async (studentNumber) => {
        const updatedAttendance = attendanceEdit[studentNumber];

        if (!updatedAttendance) {
            alert('変更がありません。');
            return;
        }

        try {
            await fetch(`{id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentNumber, attendance: updatedAttendance }),
            });
            alert('出席情報が保存されました。');
            setAttendanceEdit(prev => ({ ...prev, [studentNumber]: {} })); // 変更後に編集状態をリセット
        } catch (error) {
            console.error('Error saving attendance:', error);
        }
    };

    const handleEditAttendance = (user) => {
        setEditingAttendance({
            student_number: user.student_number,
            name: user.name,
            date: "", // 選択された日付をセットする
            period: "", // 選択された何限をセットする
        });
    };

    


// CSVエクスポート関数
const exportToCSV = () => {
    const csvRows = [];
    csvRows.push(['学籍番号', '名前', '学年', '出席情報'].join(','));

    filteredUsers.forEach(user => {
        const attendanceEntries = Object.entries(user.attendance)
            .filter(([date, periods]) => {
                // 開始日と終了日でフィルタリング
                return new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate);
            })
            .map(([date, periods]) => {
                const status = Object.values(periods).join('; ');
                return `${date}, ${status}`;
            }).join(' | ');

        if (attendanceEntries) {
            csvRows.push([user.student_number, user.name, user.grade, attendanceEntries].join(','));
        }
    });

    if (csvRows.length > 1) {
        const csvString = '\ufeff' + csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'attendance_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('データがありません。');
    }
};

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-4/5 p-10 bg-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleMonthChange(-1)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 text-sm"
                        >
                            前の月
                        </button>
                        <span className="text-lg font-medium text-gray-800">
                            {currentMonth.toLocaleString('ja-JP', { year: 'numeric', month: 'long' })}
                        </span>
                        <button
                            onClick={() => handleMonthChange(1)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 text-sm"
                        >
                            次の月
                        </button>
                    </div>
                    <input
                        type="text"
                        className="px-4 py-2 w-1/3 border border-gray-300 rounded-lg"
                        placeholder="学生名または学籍番号で検索"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex space-x-2 mb-4">
                    <input
                        type="date"
                        className="border border-gray-300 rounded-lg px-2 py-1"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        className="border border-gray-300 rounded-lg px-2 py-1"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 text-sm"
                    >
                        CSV
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    <AttendanceCalendar
                        currentMonth={currentMonth}
                        users={filteredUsers}
                        onAttendanceChange={handleAttendanceChange}
                        onSaveAttendance={saveAttendance}
                    />

                </div>
           

            </div>

        </div>

    );
};

export default AttendanceCalendarPage;

