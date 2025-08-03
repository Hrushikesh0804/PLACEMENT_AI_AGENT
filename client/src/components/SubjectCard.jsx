import React from 'react';
import ExamCard from './ExamCard';

const SubjectCard = ({ subject }) => (
  <div className="bg-slate-800 p-4 rounded-xl shadow-md">
    <h3 className="text-xl font-semibold mb-3">{subject.name}</h3>
    <div className="grid grid-cols-1 gap-3">
      {subject.exams.map((exam, index) => (
        <ExamCard key={index} exam={exam} />
      ))}
    </div>
  </div>
);

export default SubjectCard;
