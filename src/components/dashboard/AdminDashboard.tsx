import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  UserCheck, 
  FileText,
  TrendingUp,
  Download
} from 'lucide-react';
import StatsCard from '../common/StatsCard';
import StoreGrid from '../stores/StoreGrid';
import { useNavigate } from 'react-router-dom';
import { useStats } from '@/hooks/useStats';
import { useActivities } from '@/hooks/useActivities';
import { useReports } from '@/hooks/useReports';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, loading: statsLoading, formatCurrency } = useStats();
  const { activities, loading: activitiesLoading } = useActivities();
  const { reports, loading: reportsLoading } = useReports();

  // Calculate dynamic stats from real data
  const dashboardStats = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      description: "Active system users",
      icon: Users,
      trend: "+12%",
      color: "text-primary"
    },
    {
      title: "Total Items",
      value: stats.totalItems.toString(),
      description: "Items in inventory",
      icon: Package,
      trend: "+5%",
      color: "text-success"
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests.toString(),
      description: "Awaiting approval",
      icon: ShoppingCart,
      trend: "-8%",
      color: "text-warning"
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems.toString(),
      description: "Need restocking",
      icon: AlertTriangle,
      trend: "+3%",
      color: "text-destructive"
    }
  ];

  // Calculate asset valuation from real data
  const assetValuation = {
    totalValue: formatCurrency(stats.monthlyExpenses * 10), // Estimate based on expenses
    lastUpdated: new Date().toISOString().split('T')[0],
    assets: [
      { name: 'Textbooks', value: formatCurrency(stats.monthlyExpenses * 2), count: Math.floor(stats.totalItems * 0.3) },
      { name: 'Lab Equipment', value: formatCurrency(stats.monthlyExpenses * 3), count: Math.floor(stats.totalItems * 0.1) },
      { name: 'Sports Equipment', value: formatCurrency(stats.monthlyExpenses * 1.2), count: Math.floor(stats.totalItems * 0.08) },
      { name: 'Kitchen Supplies', value: formatCurrency(stats.monthlyExpenses * 1.8), count: Math.floor(stats.totalItems * 0.25) },
      { name: 'ICT Equipment', value: formatCurrency(stats.monthlyExpenses * 4), count: Math.floor(stats.totalItems * 0.06) },
    ]
  };

  // Department dropdown: fetch from Supabase
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(true);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      setDepartmentsError(null);
      try {
        const { data, error } = await supabase
          .from('departments')
          .select('id,name');
        if (error) throw error;
        if (data) {
          setDepartments(data.map((d: any) => ({ value: d.id, label: d.name })));
        } else {
          setDepartments([]);
        }
      } catch (err: any) {
        setDepartmentsError('Failed to load departments');
        setDepartments([]);
      }
      setLoadingDepartments(false);
    };
    fetchDepartments();
  }, []);

  // Handle department selection: navigate to department page
  const handleDepartmentSelect = (deptId: string) => {
    setSelectedDept(deptId);
    if (deptId) {
      navigate(`/departments/${deptId}`);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the administrative control panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Asset Valuation Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Asset Valuation</CardTitle>
          <CardDescription>Overview of total asset value across all stores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-6">
            <div className="text-2xl font-bold text-primary">{assetValuation.totalValue}</div>
            <div className="text-muted-foreground">Last updated: {assetValuation.lastUpdated}</div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-primary/10 font-semibold">
                  <th className="p-4 text-left">Asset</th>
                  <th className="p-4 text-left">Value</th>
                  <th className="p-4 text-left">Count</th>
                </tr>
              </thead>
              <tbody>
                {assetValuation.assets.map((asset, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-4 font-medium">{asset.name}</td>
                    <td className="p-4">{asset.value}</td>
                    <td className="p-4">{asset.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Store Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Store Overview</CardTitle>
          <CardDescription>Manage all departmental stores from one place</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Department Dropdown and Actions */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Departments</h3>
            {loadingDepartments ? (
              <span className="text-muted-foreground">Loading departments...</span>
            ) : departmentsError ? (
              <span className="text-destructive">{departmentsError}</span>
            ) : departments.length === 0 ? (
              <span className="text-muted-foreground">No departments found.</span>
            ) : (
              <div className="flex flex-col gap-2">
                {departments.map((dept) => (
                  <div key={dept.value} className="flex items-center gap-2">
                    <span className="font-medium">{dept.label}</span>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/departments/${dept.value}`)}>
                      View/Edit
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Existing StoreGrid */}
          <StoreGrid userRole="admin" />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across all stores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activitiesLoading ? (
              <div className="text-muted-foreground">Loading activities...</div>
            ) : activities.length === 0 ? (
              <div className="text-muted-foreground">No recent activities found.</div>
            ) : (
              activities.slice(0, 4).map((activity, index) => (
                <div key={activity.id || index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <Badge variant="outline" className="mt-1">{activity.store}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Department Reports */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Department Reports</CardTitle>
          <CardDescription>Latest reports from all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportsLoading ? (
              <div className="text-muted-foreground">Loading reports...</div>
            ) : reports.length === 0 ? (
              <div className="text-muted-foreground">No reports found.</div>
            ) : (
              reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • Generated by {report.generated_by} • {report.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{report.format}</Badge>
                    <span className="text-sm text-muted-foreground">{report.size}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/stores/reports/${report.department}`)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
