import React from 'react';
import LoginForm from './auth/LoginForm';
import Dashboard from './dashboard/Dashboard';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AppContent: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogin = (user: any, profile: any) => {
    // Auth state is already managed by useAuth hook
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      userRole={profile.role} 
      userEmail={profile.email}
      userProfile={profile}
      onLogout={handleLogout} 
    />
  );
};

const SchoolStoreApp: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default SchoolStoreApp;