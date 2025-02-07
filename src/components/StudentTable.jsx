import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditButton from './EditButton';
import { ToastContainer, toast } from 'react-toastify';

const StudentTable = () => {
  const { grade } = useParams();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://nikkunicompany.mydns.jp/api/Students');
        if (!response.ok) {
          throw new Error(`HTTPエラー！ステータスコード: ${response.status}`);
        }
  
        const data = await response.json();
  
        // 無効化された学生（is_disabled: 1）を除外し、小文字で統一
        const filtered = data
          .filter(student =>
            student.student_number.toLowerCase().startsWith(grade.toLowerCase()) && student.is_disabled !== 1
          )
          .map(student => ({
            ...student,
            student_number: student.student_number.toLowerCase(), // 学籍番号を小文字に変換
          }));
  
        setStudents(filtered);
        setFilteredStudents(filtered); // 初期表示用
      } catch (error) {
        console.error('学生情報の取得に失敗しました', error);
      }
    };
  
    fetchStudents();
  }, [grade]);
  
  

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === '') {
      // 検索欄が空なら全体リストを反映
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter((student) =>
      student.student_number.includes(query) ||
      student.name.includes(query) ||
      student.name_kana.includes(query)
    );
    setFilteredStudents(filtered);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setOriginalData([...filteredStudents]);
    }
  };

  const handleInputChange = (e, studentId, field) => {
    const { value } = e.target;
    setFilteredStudents((prev) =>
      prev.map((student) =>
        student.student_number === studentId
          ? { ...student, [field]: value }
          : student
      )
    );
  };

  const handleSave = async (studentId) => {
    try {
      const studentToUpdate = filteredStudents.find((student) => student.student_number === studentId);
      if (!studentToUpdate) {
        toast.error('学生情報が見つかりませんでした。');
        return;
      }

      const updatedStudent = {
        name: studentToUpdate.name,
        name_kana: studentToUpdate.name_kana,
      };

      const updateResponse = await fetch(`https://nikkunicompany.mydns.jp/api/Update/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudent),
      });

      if (updateResponse.ok) {
        // studentsのデータを更新
        setStudents((prev) =>
          prev.map((student) =>
            student.student_number === studentId
              ? { ...student, ...updatedStudent }
              : student
          )
        );

        toast.success('更新が完了しました！');
      } else {
        const error = await updateResponse.json();
        toast.error(`更新に失敗しました: ${error.message || '不明なエラー'}`);
      }
    } catch (error) {
      toast.error('更新に失敗しました。');
    }
  };

  const handleCancel = () => {
    setFilteredStudents(originalData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <div className="flex items-center mb-4 space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="キーワードで検索"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <EditButton onClick={handleEditClick} />
      </div>

      {/* テーブルのスクロール用コンテナ */}
      <div className="overflow-y-auto max-h-96">
        <table className="min-w-full text-left text-sm text-gray-800">
        <thead className="sticky top-0 z-10">
          <tr>
            <th className="px-6 py-3 bg-custom-teal text-white">学籍番号</th>
            <th className="px-6 py-3 bg-custom-teal text-white">名前</th>
            <th className="px-6 py-3 bg-custom-teal text-white">フリガナ</th>
            {isEditing && (
              <th className="px-6 py-3 bg-custom-teal text-white">操作</th>
            )}
          </tr>
        </thead>

          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.student_number} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">{student.student_number}</td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => handleInputChange(e, student.student_number, 'name')}
                        className="p-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      student.name
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={student.name_kana}
                        onChange={(e) => handleInputChange(e, student.student_number, 'name_kana')}
                        className="p-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      student.name_kana
                    )}
                  </td>

                  {isEditing && (
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(student.student_number)}
                          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
                        >
                          更新
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  該当する学生が見つかりません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default StudentTable;
