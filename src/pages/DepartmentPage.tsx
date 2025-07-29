import React from 'react';
import { useParams } from 'react-router-dom';

const DepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Department: {id}</h1>
      <p>This is the department details page for <strong>{id}</strong>.</p>
      {/* Add more department-specific info here */}
    </div>
  );
};

export default DepartmentPage;
