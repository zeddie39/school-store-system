
import React, { useState } from 'react';
import { UserRole } from '../auth/LoginForm';
import AdminDashboard from './AdminDashboard';
import StoreKeeperDashboard from './StoreKeeperDashboard';
import TeacherDashboard from './TeacherDashboard';
import ProcurementDashboard from './ProcurementDashboard';
import BursarDashboard from './BursarDashboard';
import Navigation from '../navigation/Navigation';
import UserManagement from '../admin/UserManagement';
import SystemSettings from '../admin/SystemSettings';
import Reports from '../admin/Reports';
import InventoryManagement from '../inventory/InventoryManagement';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface DashboardProps {
  userRole: UserRole;
  userEmail: string;
  userProfile: Profile;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, userEmail, userProfile, onLogout }) => {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState('/');

  const handleNavigation = (path: string) => {
    setCurrentView(path);
    console.log(`Navigating to: ${path}`);
  };

  const renderDashboard = () => {
    // Handle navigation-based views
    switch (currentView) {
      case '/users':
        if (userRole === 'admin') {
          return <UserManagement />;
        }
        break;
      case '/settings':
        if (userRole === 'admin') {
          return <SystemSettings />;
        }
        break;
      case '/reports':
        if (userRole === 'admin') {
          return <Reports />;
        }
        break;
      case '/inventory':
        if (userRole === 'storekeeper') {
          return <InventoryManagement />;
        }
        break;
      case '/requests':
        if (userRole === 'storekeeper') {
          return (
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6">My Requests</h1>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">Requests management interface would be implemented here.</p>
              </div>
            </div>
          );
        }
        break;
      case '/approvals':
        if (userRole === 'teacher') {
          return (
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6">Approvals</h1>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">Approvals interface would be implemented here.</p>
              </div>
            </div>
          );
        }
        break;
      case '/procurement':
        if (userRole === 'procurement_officer') {
          return (
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6">Procurement</h1>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">Procurement interface would be implemented here.</p>
              </div>
            </div>
          );
        }
        break;
      case '/orders':
        if (userRole === 'procurement_officer') {
          return (
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6">Orders</h1>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">Orders interface would be implemented here.</p>
              </div>
            </div>
          );
        }
        break;
      case '/budget':
        if (userRole === 'bursar') {
          return (
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6">Budget Management</h1>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">Budget management interface would be implemented here.</p>
              </div>
            </div>
          );
        }
        break;
      case '/expenses':
        if (userRole === 'bursar') {
          return (
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6">Expense Tracking</h1>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">Expense tracking interface would be implemented here.</p>
              </div>
            </div>
          );
        }
        break;
      case '/stores':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">All Stores</h1>
            <div className="bg-card p-6 rounded-lg border">
              <p className="text-muted-foreground">Stores overview interface would be implemented here.</p>
            </div>
          </div>
        );
      default:
        // Return to dashboard
        switch (userRole) {
          case 'admin':
            return <AdminDashboard />;
          case 'storekeeper':
            return <StoreKeeperDashboard />;
          case 'teacher':
            return <TeacherDashboard />;
          case 'procurement_officer':
            return <ProcurementDashboard />;
          case 'bursar':
            return <BursarDashboard />;
          default:
            return <StoreKeeperDashboard />;
        }
    }
    
    // Fallback to dashboard if no match
    return renderDashboard();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        userRole={userRole} 
        userEmail={userEmail} 
        userProfile={userProfile} 
        onLogout={onLogout}
        onNavigate={handleNavigation}
      />
      <div className="flex">
        <main className="flex-1 p-6">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
