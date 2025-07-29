
import React, { useState } from 'react';
import LoginForm from './auth/LoginForm';
import Dashboard from './dashboard/Dashboard';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, profile, loading, profileError, signOut, createProfile } = useAuth();
  const { toast } = useToast();
  const [retryingProfile, setRetryingProfile] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

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

  const handleRetryProfile = async () => {
    setRetryingProfile(true);
    setRetryError(null);
    try {
      if (user?.user_metadata) {
        await createProfile(user.user_metadata);
        toast({
          title: "Profile created",
          description: "Your user profile has been created. Please try logging in again.",
        });
      } else {
        setRetryError("User metadata not found. Please sign out and try again.");
      }
    } catch (err: any) {
      setRetryError(err?.message || "Failed to create profile. Please contact support.");
    } finally {
      setRetryingProfile(false);
    }
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

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Handle case where user exists but profile is missing or has error
  if (profileError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-warning" />
            </div>
            <CardTitle>Profile Setup Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              {profileError || "Your user profile couldn't be loaded. This might be because your account is new or there was a setup issue."}
            </p>
            {retryError && (
              <p className="text-center text-destructive text-sm">{retryError}</p>
            )}
            <div className="flex flex-col gap-2">
              <Button onClick={handleRetryProfile} className="w-full" disabled={retryingProfile}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {retryingProfile ? "Creating Profile..." : "Try to Create Profile"}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="w-full" disabled={retryingProfile}>
                Sign Out and Try Again
              </Button>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              If this persists, please contact your system administrator.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user profile exists but has no department or role, show waiting message
  if (!profile.department || !profile.role) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-warning" />
            </div>
            <CardTitle>Awaiting Department Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Your registration is complete. Please wait for the admin to assign your department and role. You will be notified once assigned.
            </p>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
