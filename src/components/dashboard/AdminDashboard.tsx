
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
  Settings
} from 'lucide-react';
import StoreGrid from '../stores/StoreGrid';
import StatsCard from '../common/StatsCard';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

  const recentActivities = [
    { user: "John Doe", action: "Added 50 Biology textbooks", store: "Library Store", time: "2 hours ago" },
    { user: "Jane Smith", action: "Requested lab equipment", store: "Laboratory Store", time: "4 hours ago" },
    { user: "Mike Johnson", action: "Approved kitchen supplies", store: "Kitchen Store", time: "6 hours ago" },
    { user: "Sarah Wilson", action: "Updated sports inventory", store: "Sports Store", time: "8 hours ago" }
  ];

  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Opening system settings...",
    });
    setShowSettings(true);
  };

  const handleManageUsers = () => {
    toast({
      title: "User Management",
      description: "Opening user management panel...",
    });
    setShowUserManagement(true);
  };

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
