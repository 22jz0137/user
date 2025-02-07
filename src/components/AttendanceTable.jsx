import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AttendanceTable = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const { grade } = useParams();
  const [attendanceSettingId, setAttendanceSettingId] = useState(1); // 初期値を1に設定

  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      try {
        // 学生データを取得
        const studentsResponse = await fetch('https://nikkunicompany.mydns.jp/api/Students', { credentials: 'include' });
        if (!studentsResponse.ok) {
          throw new Error(`Students API error: ${studentsResponse.status}`);
        }
        const studentsData = await studentsResponse.json();
        const filtered = studentsData.filter(student => student.student_number.startsWith(grade) && student.is_disabled !== 1);
  
        const attendanceResponse = await fetch('https://nikkunicompany.mydns.jp/api/Check', { credentials: 'include' });
        if (!attendanceResponse.ok) {
          throw new Error(`Attendance API error: ${attendanceResponse.status}`);
        }
        const attendanceData = await attendanceResponse.json();
  
        // 出席設定IDが一致するものだけをフィルタリング
        const studentsWithLatestAttendance = filtered.map(student => {
          const studentAttendanceRecords = attendanceData
            .filter(att => att.student_number === student.student_number && att.attendance_setting_id === attendanceSettingId); // フィルタリングを追加
          
          if (studentAttendanceRecords.length > 0) {
            studentAttendanceRecords.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
          }
          const latestAttendance = studentAttendanceRecords[0] || null;
  
          return { ...student, attendance: latestAttendance };
        });
  
        setStudents(studentsWithLatestAttendance);
  
      } catch (error) {
        console.error('データ取得エラー:', error.message);
        setError(error.message);
      }
    };
  
    fetchStudentsAndAttendance();
  }, [grade, attendanceSettingId]); // attendanceSettingIdが変更された時にも再度データ取得を行う
  

  // 出席ステータスを色付きで返す関数
  const getAttendanceStatus = (attendance) => {
    if (!attendance || attendance.attendance_setting_id !== attendanceSettingId) {
      return { status: '未登録', color: 'bg-gray-500 text-white' };
    }
    
    // 出席の状態
    if (attendance.status_id === 1) {
      return { status: '出席', color: 'bg-green-500 text-white' };
    }
  
    // 欠席の状態
    if (attendance.status_id === 2) {
      return { status: '欠席', color: 'bg-red-500 text-white' };
    }
  
    // その他、未登録や不明の状態
    return { status: '未登録', color: 'bg-gray-500 text-white' };
  };

  
  
  const createAttendanceForNewStudent = async (studentNumber) => {
    try {
      const response = await fetch('https://nikkunicompany.mydns.jp/api/attendance/Insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_number: studentNumber,
          status_id: 3, // 未登録ステータス
          attendance_setting_id: attendanceSettingId,
          // attendance_time は含めない
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // レスポンスの内容を取得
        console.error('API Error:', errorText);
        throw new Error(`出席データ作成エラー: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('新しい出席データ:', result.data);
  
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.student_number === studentNumber
            ? { ...student, attendance: result.data }
            : student
        )
      );
    } catch (error) {
      console.error('出席データ作成エラー:', error.message);
    }
  };
  
  
  const updateAttendanceStatus = async (studentNumber, statusId) => {
    try {
      const attendanceTime = new Date().toISOString(); // 現在時刻

      const response = await fetch('https://nikkunicompany.mydns.jp/api/attendance/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_number: studentNumber,
          status_id: statusId,
          attendance_time: attendanceTime,
          attendance_setting_id: attendanceSettingId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // レスポンスの内容をテキストとして取得
        console.error('API Error:', errorText);
        throw new Error(`出席データ更新エラー: ${response.status}`);
      }

      const result = await response.json();
      console.log('出席データ更新:', result.data);

      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.student_number === studentNumber
            ? { ...student, attendance: result.data }
            : student
        )
      );
    } catch (error) {
      console.error('出席データ更新エラー:', error.message);
    }
  };

  const handleAttendanceToggle = (student) => {
    if (!student.attendance || student.attendance.status_id === 3) {
      updateAttendanceStatus(student.student_number, 1); // 未登録 → 出席
    } else if (student.attendance.status_id === 1) {
      updateAttendanceStatus(student.student_number, 2); // 出席 → 欠席
    } else if (student.attendance.status_id === 2) {
      updateAttendanceStatus(student.student_number, 3); // 欠席 → 未登録
    }
  };

  const handleAttendanceSettingChange = (settingId) => {
    setAttendanceSettingId(settingId);
    students.forEach(student => {
      if (!student.attendance || student.attendance.status_id === null) {
        createAttendanceForNewStudent(student.student_number);
      }
    });
  };

  if (error) {
    return <div>エラー: {error}</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => handleAttendanceSettingChange(1)}
          className={`px-4 py-2 mr-2 ${attendanceSettingId === 1 ? 'bg-blue-700' : 'bg-gray-400'} text-white`}
        >
          1限
        </button>
        <button
          onClick={() => handleAttendanceSettingChange(2)}
          className={`px-4 py-2 mr-2 ${attendanceSettingId === 2 ? 'bg-blue-700' : 'bg-gray-400'} text-white`}
        >
          2限
        </button>
        <button
          onClick={() => handleAttendanceSettingChange(3)}
          className={`px-4 py-2 mr-2 ${attendanceSettingId === 3 ? 'bg-blue-700' : 'bg-gray-400'} text-white`}
        >
          3限
        </button>
        <button
          onClick={() => handleAttendanceSettingChange(4)}
          className={`px-4 py-2 ${attendanceSettingId === 4 ? 'bg-blue-700' : 'bg-gray-400'} text-white`}
        >
          4限
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse border text-center">
        <thead>
          <tr>
            <th className="border border-gray-500 px-4 py-2">学籍番号</th>
            <th className="border border-gray-500 px-4 py-2">名前</th>
            <th className="border border-gray-500 px-4 py-2">出席時間</th>
            <th className="border border-gray-500 px-4 py-2">ステータス</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            const attendanceStatus = getAttendanceStatus(student.attendance);
            const attendanceRecord = student.attendance;

            return (
              <tr key={index} className="h-20">
                <td className="border border-gray-500 px-4 py-2">{student.student_number || 'データなし'}</td>
                <td className="border border-gray-500 px-4 py-2">{student.name || 'データなし'}</td>
                <td className="border border-gray-500 px-4 py-2"> {attendanceStatus.status === '未登録' ? ' ' : (attendanceRecord?.updated_at
                    ? new Date(attendanceRecord.updated_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }): 'データなし')}
                </td>

                <td
          className={`border border-gray-500 px-4 py-2 text-lg ${attendanceStatus.color}`}
          onClick={() => handleAttendanceToggle(student)}
                >
                  {attendanceStatus.status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
