
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../hooks/useStores';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Badge } from '../ui/badge';
import StoreGrid from '../stores/StoreGrid';
import StatsCard from '../common/StatsCard';
import { Download, Store, TrendingUp, Users, Package, AlertTriangle, UserCheck } from 'lucide-react';
// import { supabase } from '../../integrations/supabase'; // TODO: Uncomment when supabase client is available
// import type { NotificationRow } from '../../types'; // TODO: Uncomment when NotificationRow type is available
const AdminDashboard: React.FC = () => {
  // User management: fetch unassigned users
  // const [unassignedUsers, setUnassignedUsers] = useState([]);
  // const [loadingUnassigned, setLoadingUnassigned] = useState(true);
  // const [assigningUserId, setAssigningUserId] = useState(null);
  // const [assignError, setAssignError] = useState(null);
  // const [assignSuccess, setAssignSuccess] = useState(null);

  // const fetchUnassignedUsers = async () => {
  //   setLoadingUnassigned(true);
  //   setAssignError(null);
  //   // Get users with no department or role
  //   const { data, error } = await supabase
  //     .from('profiles')
  //     .select('*')
  //     .or('department.is.null,department.eq.""')
  //     .or('role.is.null,role.eq.""');
  //   if (!error && data) {
  //     setUnassignedUsers(data);
  //   } else {
  //     setUnassignedUsers([]);
  //     setAssignError('Failed to fetch unassigned users');
  //   }
  //   setLoadingUnassigned(false);
  // };

  // Placeholder for handleRemoveUser to prevent errors
  // const handleRemoveUser = (userId: string) => {
  //   alert('Remove user not implemented');
  // };

  // Dashboard mock data
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

  // Asset valuation mock data
  const assetValuation = {
    totalValue: 'KSh 12,500,000',
    lastUpdated: '2025-07-28',
    assets: [
      { name: 'Textbooks', value: 'KSh 2,000,000', count: 2847 },
      { name: 'Lab Equipment', value: 'KSh 3,500,000', count: 120 },
      { name: 'Sports Equipment', value: 'KSh 1,200,000', count: 75 },
      { name: 'Kitchen Supplies', value: 'KSh 1,800,000', count: 300 },
      { name: 'ICT Equipment', value: 'KSh 4,000,000', count: 60 },
    ]
  };

  const recentActivities = [
    { user: "John Doe", action: "Added 50 Biology textbooks", store: "Library Store", time: "2 hours ago" },
    { user: "Jane Smith", action: "Requested lab equipment", store: "Laboratory Store", time: "4 hours ago" },
    { user: "Mike Johnson", action: "Approved kitchen supplies", store: "Kitchen Store", time: "6 hours ago" },
    { user: "Sarah Wilson", action: "Updated sports inventory", store: "Sports Store", time: "8 hours ago" }
  ];

  // Example department reports
  const departmentReports = [
    { id: 1, name: 'Agriculture Store Report - July 2025', type: 'Inventory', generatedBy: 'Agriculture Manager', date: '2025-07-01', format: 'PDF', size: '2.2 MB', department: 'agriculture' },
    { id: 2, name: 'Boarding Facilities Report - July 2025', type: 'Inventory', generatedBy: 'Boarding Manager', date: '2025-07-01', format: 'PDF', size: '2.3 MB', department: 'boarding' },
    { id: 3, name: 'Examination Store Report - July 2025', type: 'Inventory', generatedBy: 'Exam Officer', date: '2025-07-01', format: 'PDF', size: '2.0 MB', department: 'examination' },
    { id: 4, name: 'General Store Report - July 2025', type: 'Inventory', generatedBy: 'General Storekeeper', date: '2025-07-01', format: 'PDF', size: '2.4 MB', department: 'general' },
    { id: 5, name: 'ICT Lab Store Report - July 2025', type: 'Inventory', generatedBy: 'ICT Lab Manager', date: '2025-07-01', format: 'PDF', size: '2.1 MB', department: 'ict lab' },
    { id: 6, name: 'ICT Laboratory Report - July 2025', type: 'Inventory', generatedBy: 'ICT Lab Supervisor', date: '2025-07-01', format: 'PDF', size: '2.3 MB', department: 'ict lab' },
    { id: 7, name: 'Kitchen Store Report - July 2025', type: 'Inventory', generatedBy: 'Kitchen Manager', date: '2025-07-01', format: 'PDF', size: '2.5 MB', department: 'kitchen' },
    { id: 8, name: 'Library Store Report - July 2025', type: 'Inventory', generatedBy: 'Head Librarian', date: '2025-07-01', format: 'PDF', size: '2.8 MB', department: 'library' },
    { id: 9, name: 'Main Library Report - July 2025', type: 'Inventory', generatedBy: 'Main Librarian', date: '2025-07-01', format: 'PDF', size: '2.7 MB', department: 'library' },
    { id: 10, name: 'School Kitchen Report - July 2025', type: 'Inventory', generatedBy: 'School Chef', date: '2025-07-01', format: 'PDF', size: '2.6 MB', department: 'kitchen' },
    { id: 11, name: 'Science Laboratory Report - July 2025', type: 'Inventory', generatedBy: 'Lab Supervisor', date: '2025-07-01', format: 'PDF', size: '2.2 MB', department: 'laboratory' },
    { id: 12, name: 'Sports Equipment Store Report - July 2025', type: 'Inventory', generatedBy: 'Sports Manager', date: '2025-07-01', format: 'PDF', size: '2.4 MB', department: 'sports' },
    { id: 13, name: 'Sports Store Report - July 2025', type: 'Inventory', generatedBy: 'Sports Storekeeper', date: '2025-07-01', format: 'PDF', size: '2.3 MB', department: 'sports' },
    { id: 14, name: 'Boarding Store Report - July 2025', type: 'Inventory', generatedBy: 'Boarding Storekeeper', date: '2025-07-01', format: 'PDF', size: '2.1 MB', department: 'boarding' },
    { id: 15, name: 'Library Inventory Overview - July 2025', type: 'Inventory', generatedBy: 'Head Librarian', date: '2025-07-01', format: 'PDF', size: '2.8 MB', department: 'library' },
    { id: 16, name: 'Lab Chemical Stock - July 2025', type: 'Inventory', generatedBy: 'Lab Manager', date: '2025-07-01', format: 'PDF', size: '2.1 MB', department: 'laboratory' },
    { id: 17, name: 'Kitchen Inventory - July 2025', type: 'Inventory', generatedBy: 'Head Chef', date: '2025-07-01', format: 'PDF', size: '2.5 MB', department: 'kitchen' },
  ];

  // Department dropdown: fetch from Supabase
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const navigate = useNavigate();
  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(true);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      setDepartmentsError(null);
    try {
      // Uncomment supabase import above if not already
      // Replace 'departments' with your actual table name
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

  // Main dashboard layout
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the administrative control panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Department Reports Section removed. Department dropdown moved to Store Overview below. */}

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
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  <Badge variant="outline" className="mt-1">{activity.store}</Badge>
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

// Make sure supabase is imported
import { supabase } from '../../integrations/supabase/client';
export default AdminDashboard;
