import React from 'react';
import { UserRole } from '../auth/LoginForm';
import AdminDashboard from './AdminDashboard';
import StoreKeeperDashboard from './StoreKeeperDashboard';
import TeacherDashboard from './TeacherDashboard';
import ProcurementDashboard from './ProcurementDashboard';
import BursarDashboard from './BursarDashboard';
import Navigation from '../navigation/Navigation';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface DashboardProps {
  userRole: UserRole;
  userEmail: string;
  userProfile: Profile;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, userEmail, userProfile, onLogout }) => {
  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard userProfile={userProfile} />;
      case 'storekeeper':
        return <StoreKeeperDashboard userProfile={userProfile} />;
      case 'teacher':
        return <TeacherDashboard userProfile={userProfile} />;
      case 'procurement_officer':
        return <ProcurementDashboard userProfile={userProfile} />;
      case 'bursar':
        return <BursarDashboard userProfile={userProfile} />;
      default:
        return <StoreKeeperDashboard userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole={userRole} userEmail={userEmail} userProfile={userProfile} onLogout={onLogout} />
      <div className="flex">
        <main className="flex-1 p-6">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;