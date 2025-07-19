import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, School } from 'lucide-react';
import AuthStatus from './AuthStatus';

export type UserRole = 'admin' | 'storekeeper' | 'teacher' | 'procurement_officer' | 'bursar';

interface LoginFormProps {
  onLogin: (user: any, profile: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    department: '',
    role: 'storekeeper' as UserRole
  });

  const departments = [
    'Administration', 'Academic', 'Sports', 'ICT', 'Kitchen', 
    'Laboratory', 'Library', 'Boarding', 'Agriculture', 'Examination'
  ];

  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'storekeeper', label: 'Store Keeper' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'procurement_officer', label: 'Procurement Officer' },
    { value: 'bursar', label: 'Bursar' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    console.log('🔐 Attempting login for:', loginData.email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        setAuthError(error.message);
        return;
      }

      console.log('✅ Login successful:', data.user?.email);
      
      if (data.user) {
        setAuthSuccess('Login successful! Welcome back.');
        toast({
          title: "Login successful",
          description: "Welcome back to the School Store System!",
        });
        // The auth state change will handle the redirect
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      setAuthError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    
    console.log('📝 Starting signup process for:', signupData.email);
    
    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setAuthError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setAuthError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (!signupData.fullName.trim()) {
      setAuthError("Please enter your full name");
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Attempting user registration...');

      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
            phone: signupData.phone || '',
            department: signupData.department || '',
            role: signupData.role
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        if (error.message.includes('Database error')) {
          setAuthError('There seems to be a temporary issue with account creation. Please contact support or try again later.');
        } else {
          setAuthError(error.message);
        }
        return;
      }

      console.log('✅ Signup response:', data);

      if (data.user) {
        setAuthSuccess('Account created successfully! You can now log in.');
        toast({
          title: "Account created successfully",
          description: "Welcome to the School Store System! You can now log in.",
        });
        setIsLogin(true);
        // Clear form
        setSignupData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          phone: '',
          department: '',
          role: 'storekeeper'
        });
      }
    } catch (error: any) {
      console.error('❌ Signup failed:', error);
      setAuthError(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <School className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">School Store System</CardTitle>
          <CardDescription>
            Manage your school inventory efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthStatus loading={loading} error={authError} success={authSuccess} />
          
          <Tabs value={isLogin ? "login" : "signup"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="login" 
                onClick={() => {
                  setIsLogin(true);
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                onClick={() => {
                  setIsLogin(false);
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                      placeholder="Your full name"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={signupData.phone}
                      onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={signupData.department}
                      onValueChange={(value) => setSignupData(prev => ({ ...prev, department: value }))}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={signupData.role}
                      onValueChange={(value: UserRole) => setSignupData(prev => ({ ...prev, role: value }))}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      placeholder="Create a password"
                      minLength={6}
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
