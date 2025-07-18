
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Plus, 
  Minus, 
  Search,
  Store,
  AlertTriangle,
  TrendingUp,
  Box,
  ShoppingCart,
  FileText,
  Users
} from 'lucide-react';
import StoreGrid from '../stores/StoreGrid';
import StatsCard from '../common/StatsCard';
import AddItemDialog from '../items/AddItemDialog';
import CreateRequestDialog from '../requests/CreateRequestDialog';
import DepartmentItemsView from '../stores/DepartmentItemsView';
import RequestsList from '../requests/RequestsList';
import { useStats } from '@/hooks/useStats';
import { useAuth } from '@/hooks/useAuth';

const StoreKeeperDashboard: React.FC = () => {
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestsListOpen, setRequestsListOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'requests'>('overview');
  const { stats: dashboardStats } = useStats();
  const { profile } = useAuth();

  const statsArray = [
    {
      title: "My Stores",
      value: dashboardStats.totalStores.toString(),
      description: "Stores under management",
      icon: Store,
      trend: "+1",
      color: "text-primary"
    },
    {
      title: "Total Items",
      value: dashboardStats.totalItems.toString(),
      description: "Items in inventory",
      icon: Package,
      trend: "+23",
      color: "text-success"
    },
    {
      title: "Low Stock",
      value: dashboardStats.lowStockItems.toString(),
      description: "Items need restocking",
      icon: AlertTriangle,
      trend: "-3",
      color: "text-warning"
    },
    {
      title: "Recent Additions",
      value: dashboardStats.recentItems.toString(),
      description: "Added this week",
      icon: TrendingUp,
      trend: "+8",
      color: "text-info"
    }
  ];

  const quickActions = [
    { 
      title: "Add New Item", 
      icon: Plus, 
      action: () => setAddItemOpen(true), 
      color: "bg-success hover:bg-success/90",
      description: "Add items to inventory"
    },
    { 
      title: "Create Request", 
      icon: Box, 
      action: () => setRequestOpen(true), 
      color: "bg-primary hover:bg-primary/90",
      description: "Request stock changes"
    },
    { 
      title: "View Requests", 
      icon: FileText, 
      action: () => setRequestsListOpen(true), 
      color: "bg-info hover:bg-info/90",
      description: "Track request status"
    },
    { 
      title: "Department View", 
      icon: Package, 
      action: () => setActiveTab('departments'), 
      color: "bg-warning hover:bg-warning/90",
      description: "Browse by department"
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'departments':
        return <DepartmentItemsView />;
      case 'requests':
        return <RequestsList />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsArray.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks for store management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`h-32 flex-col gap-3 p-4 ${action.color} text-white border-0 hover:text-white`}
                      onClick={action.action}
                    >
                      <div className="p-3 bg-white/20 rounded-full">
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{action.title}</div>
                        <div className="text-xs opacity-90">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My Stores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  My Stores
                </CardTitle>
                <CardDescription>
                  Stores you're responsible for managing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StoreGrid userRole="storekeeper" />
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Store Keeper Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'departments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('departments')}
          >
            Departments
          </Button>
          <Button
            variant={activeTab === 'requests' ? 'default' : 'outline'}
            onClick={() => setActiveTab('requests')}
          >
            Requests
          </Button>
        </div>
      </div>

      {renderContent()}

      {/* Dialogs */}
      <AddItemDialog 
        open={addItemOpen} 
        onOpenChange={setAddItemOpen}
      />
      <CreateRequestDialog 
        open={requestOpen} 
        onOpenChange={setRequestOpen}
      />
      <RequestsList 
        open={requestsListOpen} 
        onOpenChange={setRequestsListOpen}
      />
    </div>
  );
};

export default StoreKeeperDashboard;
