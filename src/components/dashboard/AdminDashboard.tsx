
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Store,
  ShoppingCart,
  UserCheck,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import StoreGrid from '../stores/StoreGrid';
import StatsCard from '../common/StatsCard';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());

  const stats = [
    {
      title: "Total Users",
      value: "127",
      description: "Active system users",
      icon: Users,
      trend: "+12%",
      color: "text-primary"
    },
    {
      title: "Total Items",
      value: "2,847",
      description: "Items across all stores",
      icon: Package,
      trend: "+8%",
      color: "text-success"
    },
    {
      title: "Low Stock Alerts",
      value: "23",
      description: "Items needing restock",
      icon: AlertTriangle,
      trend: "-5%",
      color: "text-warning"
    },
    {
      title: "Pending Approvals",
      value: "15",
      description: "Awaiting approval",
      icon: UserCheck,
      trend: "+3%",
      color: "text-info"
    }
  ];

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@school.edu", role: "Teacher", status: "Active", lastLogin: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@school.edu", role: "Store Keeper", status: "Active", lastLogin: "2024-01-14" },
    { id: 3, name: "Mike Johnson", email: "mike@school.edu", role: "Bursar", status: "Inactive", lastLogin: "2024-01-10" },
    { id: 4, name: "Sarah Wilson", email: "sarah@school.edu", role: "Procurement Officer", status: "Active", lastLogin: "2024-01-13" }
  ]);

  const [systemSettings, setSystemSettings] = useState({
    notifications: true,
    autoBackup: true,
    maintenanceMode: false,
    allowRegistration: true,
    sessionTimeout: 30
  });

  const recentActivities = [
    { user: "John Doe", action: "Added 50 Biology textbooks", store: "Library Store", time: "2 hours ago" },
    { user: "Jane Smith", action: "Requested lab equipment", store: "Laboratory Store", time: "4 hours ago" },
    { user: "Mike Johnson", action: "Approved kitchen supplies", store: "Kitchen Store", time: "6 hours ago" },
    { user: "Sarah Wilson", action: "Updated sports inventory", store: "Sports Store", time: "8 hours ago" }
  ];

  const handleSettings = () => {
    setShowSettings(!showSettings);
    toast({
      title: showSettings ? "Closing Settings" : "Opening Settings",
      description: showSettings ? "Settings panel closed." : "Opening system settings...",
    });
  };

  const handleManageUsers = () => {
    setShowUserManagement(!showUserManagement);
    toast({
      title: showUserManagement ? "Closing User Management" : "Opening User Management",
      description: showUserManagement ? "User management panel closed." : "Opening user management panel...",
    });
  };

  const handleAddUser = () => {
    toast({
      title: "Add New User",
      description: "Opening user registration form...",
    });
  };

  const handleEditUser = (userId: number) => {
    setProcessingActions(prev => new Set(prev).add(`edit-${userId}`));
    setTimeout(() => {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(`edit-${userId}`);
        return newSet;
      });
      toast({
        title: "Edit User",
        description: `Opening edit form for user ID: ${userId}`,
      });
    }, 1000);
  };

  const handleDeleteUser = (userId: number) => {
    setProcessingActions(prev => new Set(prev).add(`delete-${userId}`));
    setTimeout(() => {
      setUsers(prev => prev.filter(user => user.id !== userId));
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(`delete-${userId}`);
        return newSet;
      });
      toast({
        title: "User Deleted",
        description: `User with ID ${userId} has been removed from the system.`,
      });
    }, 1500);
  };

  const handleViewUser = (userId: number) => {
    toast({
      title: "View User Details",
      description: `Opening detailed view for user ID: ${userId}`,
    });
  };

  const handleSettingToggle = (setting: string) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
    toast({
      title: "Setting Updated",
      description: `${setting} has been ${systemSettings[setting as keyof typeof systemSettings] ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleSessionTimeoutChange = (minutes: number) => {
    setSystemSettings(prev => ({ ...prev, sessionTimeout: minutes }));
    toast({
      title: "Session Timeout Updated",
      description: `Session timeout set to ${minutes} minutes.`,
    });
  };

  if (showUserManagement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex gap-2">
            <Button onClick={handleAddUser}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
            <Button variant="outline" onClick={handleManageUsers}>
              Back to Dashboard
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>Manage all users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last login: {user.lastLogin}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewUser(user.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditUser(user.id)}
                      disabled={processingActions.has(`edit-${user.id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={processingActions.has(`delete-${user.id}`)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <Button variant="outline" onClick={handleSettings}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Notifications</p>
                  <p className="text-sm text-muted-foreground">Send system notifications to users</p>
                </div>
                <Button 
                  variant={systemSettings.notifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSettingToggle('notifications')}
                >
                  {systemSettings.notifications ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Backup</p>
                  <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
                </div>
                <Button 
                  variant={systemSettings.autoBackup ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSettingToggle('autoBackup')}
                >
                  {systemSettings.autoBackup ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Temporarily disable system access</p>
                </div>
                <Button 
                  variant={systemSettings.maintenanceMode ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleSettingToggle('maintenanceMode')}
                >
                  {systemSettings.maintenanceMode ? 'Active' : 'Inactive'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Registration</p>
                  <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                </div>
                <Button 
                  variant={systemSettings.allowRegistration ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSettingToggle('allowRegistration')}
                >
                  {systemSettings.allowRegistration ? 'Allowed' : 'Blocked'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Session Timeout (minutes)</p>
                <div className="flex gap-2">
                  {[15, 30, 60, 120].map((minutes) => (
                    <Button
                      key={minutes}
                      variant={systemSettings.sessionTimeout === minutes ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSessionTimeoutChange(minutes)}
                    >
                      {minutes}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Current: {systemSettings.sessionTimeout} minutes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSettings}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" onClick={handleManageUsers}>
            <Users className="w-4 h-4 mr-2" />
            Manage Users
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Store Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Store Overview
          </CardTitle>
          <CardDescription>
            Manage all departmental stores from one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoreGrid userRole="admin" />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest actions across all stores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  <Badge variant="outline" className="mt-1">
                    {activity.store}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
