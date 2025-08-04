import React from 'react';
import SupplierManagement from '@/components/suppliers/SupplierManagement';
import BackButton from '@/components/common/BackButton';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const SupplierManagementPage: React.FC = () => {
  const { profile } = useAuth();

  // Only admins can access supplier management
  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Supplier Management</h1>
          <p className="text-muted-foreground">
            Manage suppliers for procurement and inventory sourcing
          </p>
        </div>
        <BackButton to="/admin" label="Back to Admin" />
      </div>
      
      <SupplierManagement />
    </div>
  );
};

export default SupplierManagementPage;