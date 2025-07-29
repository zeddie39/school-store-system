import React from 'react';
import { useParams } from 'react-router-dom';

const StoreDepartmentPage: React.FC = () => {
  const { department } = useParams<{ department: string }>();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Store Department: {department}</h1>
      <p>This is the store department page for <strong>{department}</strong>.</p>
      {/* Add more store-specific info here */}
    </div>
  );
};

export default StoreDepartmentPage;
