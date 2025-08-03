import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExamCard = ({ exam }) => {
  const navigate = useNavigate();

  const startExam = () => {
    navigate(`/mock-exam/${exam.id}`);
  };

  return (
    <button
      onClick={startExam}
      className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg w-full text-left"
    >
      {exam.title}
    </button>
  );
};

export default ExamCard;
