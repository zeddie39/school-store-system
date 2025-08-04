import React from 'react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { profile } = useAuth();

  // Only admins can access this page
  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard />;
};

export default AdminPage;