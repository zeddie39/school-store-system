import React, { useState } from 'react';
import LoginForm, { UserRole } from './auth/LoginForm';
import Dashboard from './dashboard/Dashboard';
import { useToast } from '@/hooks/use-toast';

const SchoolStoreApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('storekeeper');
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();

  const handleLogin = (email: string, role: UserRole) => {
    setUserEmail(email);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setUserRole('storekeeper');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      userRole={userRole} 
      userEmail={userEmail} 
      onLogout={handleLogout} 
    />
  );
};

export default SchoolStoreApp;