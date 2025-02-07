import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GradeButton3= () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch('https://nikkunicompany.mydns.jp/api/grades');
        if (!response.ok) {
          throw new Error('Failed to fetch grades');
        }
        const data = await response.json();
        console.log("Fetched Grades:", data);
        
        // `grade` のみを取り出してセットする
        setGrades(data.map(item => item.grade));
      } catch (error) {
        console.error('Error fetching grades:', error);
      }
    };
  
    fetchGrades();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4 w-3/4 mx-auto">
      {grades.map((grade, index) => (
        <Link to={`/attendancecheck/detail/${grade}`} key={index} className="w-[calc(33.333%-1rem)]">
          <button className="w-full p-3 bg-[#14b8a6] hover:bg-[#0e7b75] text-white rounded-lg shadow-lg transition duration-300 ease-in-out">
            {grade.toUpperCase()}
          </button>
        </Link>
      ))}
    </div>
  );
};

export default GradeButton3;
