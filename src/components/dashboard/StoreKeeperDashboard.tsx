import React from 'react';
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
  Box
} from 'lucide-react';
import StoreGrid from '../stores/StoreGrid';
import StatsCard from '../common/StatsCard';


  const stats = [
    {
      title: "My Stores",
      value: "5",
      description: "Stores under management",
      icon: Store,
      trend: "+1",
      color: "text-primary"
    },
    {
      title: "Total Items",
      value: "487",
      description: "Items in inventory",
      icon: Package,
      trend: "+23",
      color: "text-success"
    },
    {
      title: "Low Stock",
      value: "12",
      description: "Items need restocking",
      icon: AlertTriangle,
      trend: "-3",
      color: "text-warning"
    },
    {
      title: "Recent Additions",
      value: "34",
      description: "Added this week",
      icon: TrendingUp,
      trend: "+8",
      color: "text-info"
    }
  ];

  const quickActions = [
    { title: "Add New Item", icon: Plus, action: "add-item", color: "bg-success" },
    { title: "Remove Item", icon: Minus, action: "remove-item", color: "bg-destructive" },
    { title: "Search Inventory", icon: Search, action: "search", color: "bg-primary" },
    { title: "Request Stock", icon: Box, action: "request", color: "bg-warning" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Store Keeper Dashboard</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Quick Add Item
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                className="h-24 flex-col gap-2"
                onClick={() => console.log(`Action: ${action.action}`)}
              >
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm">{action.title}</span>
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
};

export default StoreKeeperDashboard;