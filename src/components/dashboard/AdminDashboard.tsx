
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
type NotificationRow = {
  id: string;
  message: string;
  department?: string;
  file_name?: string;
  uploader?: string;
  created_at?: string;
  is_read?: boolean;
};
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Store,
  UserCheck
} from 'lucide-react';
import StoreGrid from '../stores/StoreGrid';
import { useStores } from '@/hooks/useStores';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import StatsCard from '../common/StatsCard';

const AdminDashboard: React.FC = () => {
  // Sample assets bought for Asset Valuation store
  const assetValuationAssets = [
    {
      id: 1,
      name: 'School Bus',
      type: 'Vehicle',
      purchaseDate: '2022-01-15',
      cost: 4500000,
      usefulLife: 10, // years
      location: 'Main Campus',
    },
    {
      id: 2,
      name: 'Science Lab Equipment',
      type: 'Equipment',
      purchaseDate: '2023-03-10',
      cost: 1200000,
      usefulLife: 7,
      location: 'Laboratory',
    },
    {
      id: 3,
      name: 'Library Shelves',
      type: 'Furniture',
      purchaseDate: '2021-09-05',
      cost: 350000,
      usefulLife: 15,
      location: 'Library',
    },
    {
      id: 4,
      name: 'ICT Computers',
      type: 'ICT',
      purchaseDate: '2024-02-20',
      cost: 800000,
      usefulLife: 5,
      location: 'ICT Lab',
    },
  ];

  // Helper to calculate depreciation and current value (straight-line method)
  function getDepreciation(asset) {
    const purchaseYear = new Date(asset.purchaseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const yearsUsed = Math.max(0, currentYear - purchaseYear);
    const annualDepreciation = asset.cost / asset.usefulLife;
    const accumulatedDepreciation = Math.min(yearsUsed * annualDepreciation, asset.cost);
    const currentValue = Math.max(0, asset.cost - accumulatedDepreciation);
    return { annualDepreciation, accumulatedDepreciation, currentValue, yearsUsed };
  }
  const { stores } = useStores();
  const [selectedDept, setSelectedDept] = useState<string>('');
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Real-time updates
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const prevUnreadCount = useRef<number>(0);
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      // @ts-ignore: notifications table may not be in types yet
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setNotifications(data);
        // Sound alert for new unread notifications
        const unreadCount = data.filter((n: any) => !n.is_read).length;
        if (unreadCount > prevUnreadCount.current) {
          soundRef.current?.play();
        }
        prevUnreadCount.current = unreadCount;
      } else {
        setNotifications([]);
      }
      setLoadingNotifications(false);
    };
    fetchNotifications();
    // Subscribe to changes
    const subscription = supabase
      .channel('notifications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const markAsRead = async (id: string) => {
    // @ts-ignore: notifications table may not be in types yet
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    // fetchNotifications(); // Real-time will update
  };
  // Simulated reports per department
  const departmentReports = [
    // Library Store
    {
      id: 1,
      name: 'Library Inventory Overview - July 2025',
      type: 'Inventory',
      generatedBy: 'Head Librarian',
      date: '2025-07-01',
      format: 'PDF',
      size: '2.8 MB',
      department: 'library',
    },
    {
      id: 2,
      name: 'Book Lending Trends - Q2 2025',
      type: 'Usage',
      generatedBy: 'Library Analyst',
      date: '2025-06-30',
      format: 'Excel',
      size: '1.4 MB',
      department: 'library',
    },
    // Laboratory Store
    {
      id: 3,
      name: 'Lab Chemical Stock - July 2025',
      type: 'Inventory',
      generatedBy: 'Lab Manager',
      date: '2025-07-01',
      format: 'PDF',
      size: '2.1 MB',
      department: 'laboratory',
    },
    {
      id: 4,
      name: 'Experiment Usage Report - Q2 2025',
      type: 'Usage',
      generatedBy: 'Science Teacher',
      date: '2025-06-28',
      format: 'Excel',
      size: '1.6 MB',
      department: 'laboratory',
    },
    // Kitchen Store
    {
      id: 5,
      name: 'Kitchen Inventory - July 2025',
      type: 'Inventory',
      generatedBy: 'Head Chef',
      date: '2025-07-01',
      format: 'PDF',
      size: '2.5 MB',
      department: 'kitchen',
    },
    {
      id: 6,
      name: 'Meal Preparation Stats - Q2 2025',
      type: 'Usage',
      generatedBy: 'Kitchen Analyst',
      date: '2025-06-29',
      format: 'Excel',
      size: '1.3 MB',
      department: 'kitchen',
    },
    // Sports Store
    {
      id: 7,
      name: 'Sports Equipment Inventory - July 2025',
      type: 'Inventory',
      generatedBy: 'Sports Coordinator',
      date: '2025-07-01',
      format: 'PDF',
      size: '2.2 MB',
      department: 'sports',
    },
    {
      id: 8,
      name: 'Athlete Participation Report - Q2 2025',
      type: 'Usage',
      generatedBy: 'Coach',
      date: '2025-06-27',
      format: 'Excel',
      size: '1.5 MB',
      department: 'sports',
    },
    // ICT Lab Store
    {
      id: 9,
      name: 'ICT Lab Device Inventory - July 2025',
      type: 'Inventory',
      generatedBy: 'ICT Admin',
      date: '2025-07-01',
      format: 'PDF',
      size: '2.0 MB',
      department: 'ict_lab',
    },
    {
      id: 10,
      name: 'Software Usage Stats - Q2 2025',
      type: 'Usage',
      generatedBy: 'ICT Analyst',
      date: '2025-06-30',
      format: 'Excel',
      size: '1.2 MB',
      department: 'ict_lab',
    },
    // Asset Valuation Store
    {
      id: 11,
      name: 'Asset Valuation Summary - July 2025',
      type: 'Valuation',
      generatedBy: 'Asset Manager',
      date: '2025-07-01',
      format: 'PDF',
      size: '2.7 MB',
      department: 'asset_valuation',
    },
    {
      id: 12,
      name: 'Depreciation Trends - Q2 2025',
      type: 'Valuation',
      generatedBy: 'Finance Analyst',
      date: '2025-06-30',
      format: 'Excel',
      size: '1.8 MB',
      department: 'asset_valuation',
    },
  ];

  const handleDownloadReport = (report) => {
    let content = '';
    let mimeType = '';
    let fileExtension = '';
    if (report.format.toLowerCase() === 'pdf') {
      content = `PDF Report: ${report.name}\nType: ${report.type}\nGenerated by: ${report.generatedBy}\nDate: ${report.date}`;
      mimeType = 'application/pdf';
      fileExtension = 'pdf';
    } else if (report.format.toLowerCase() === 'excel') {
      content = `Excel Report: ${report.name}\nType: ${report.type}\nGenerated by: ${report.generatedBy}\nDate: ${report.date}`;
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      fileExtension = 'xlsx';
    } else {
      content = `Report: ${report.name}`;
      mimeType = 'text/plain';
      fileExtension = 'txt';
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_')}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };
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

  return (
    <div className="space-y-6">
      {/* Admin Notifications */}
      <audio ref={soundRef} src="https://cdn.pixabay.com/audio/2022/07/26/audio_124b7b2b48.mp3" preload="auto" />
      <Card>
        <CardHeader>
          <CardTitle>Admin Notifications</CardTitle>
          <CardDescription>Latest department uploads and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-3">
            <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
            <Button size="sm" variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')}>Unread</Button>
            <Button size="sm" variant={filter === 'read' ? 'default' : 'outline'} onClick={() => setFilter('read')}>Read</Button>
          </div>
          {loadingNotifications ? (
            <div className="text-center py-4 text-muted-foreground">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No notifications yet.</div>
          ) : (
            <div className="space-y-3">
              {notifications
                .filter(note =>
                  filter === 'all' ? true : filter === 'unread' ? !note.is_read : note.is_read
                )
                .slice(0, 8)
                .map((note) => (
                  <div key={note.id} className={`flex items-center justify-between p-3 rounded-lg ${note.is_read ? 'bg-muted' : 'bg-muted/50'}`}>
                    <div className="flex-1">
                      <p className="font-medium">{note.message}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                        {note.department && <Badge variant="outline">{note.department}</Badge>}
                        {note.file_name && <span>File: {note.file_name}</span>}
                        {note.uploader && <span>By: {note.uploader}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{note.created_at?.slice(0, 16).replace('T', ' ')}</span>
                      {!note.is_read && (
                        <Button size="xs" variant="secondary" onClick={() => markAsRead(note.id)}>Mark as Read</Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the administrative control panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>


      {/* Store/Department Reports Section */}
      <Card className="bg-gradient-to-br from-gray-50 via-white to-gray-100 shadow-xl border-0">
        <CardHeader className="pb-2">
          <CardTitle
            className="flex items-center gap-2"
            style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: 700, fontSize: '2rem', letterSpacing: '0.02em', color: '#2d3748' }}
          >
            <Store className="w-6 h-6 text-primary" />
            Department Reports
          </CardTitle>
          <CardDescription style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: 500, color: '#4a5568', fontSize: '1.1rem' }}>
            Select a department to view and download its reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <Select
              value={selectedDept}
              onValueChange={(value) => {
                setSelectedDept(value);
                if (value) {
                  navigate(`/department-reports/${value}`);
                }
              }}
            >
              <SelectTrigger className="w-64 border-2 border-primary rounded-lg shadow-sm focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.store_type} className="font-semibold">
                    {store.name} <span className="text-xs text-muted-foreground">({store.store_type.replace('_', ' ')})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedDept ? (
    {selectedDept === 'asset_valuation' ? (
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-lg mb-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-primary/10" style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: 600, fontSize: '1.1rem', color: '#2d3748' }}>
              <th className="p-4 text-left">Asset Name</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Purchase Date</th>
              <th className="p-4 text-left">Cost (KSh)</th>
              <th className="p-4 text-left">Useful Life (yrs)</th>
              <th className="p-4 text-left">Years Used</th>
              <th className="p-4 text-left">Annual Depreciation</th>
              <th className="p-4 text-left">Accumulated Depreciation</th>
              <th className="p-4 text-left">Current Value</th>
            </tr>
          </thead>
          <tbody>
            {assetValuationAssets.length === 0 ? (
              <tr><td colSpan={10} className="p-6 text-center text-muted-foreground">No assets found for Asset Valuation.</td></tr>
            ) : (
              assetValuationAssets.map((asset) => {
                const dep = getDepreciation(asset);
                return (
                  <tr key={asset.id} className="border-b hover:bg-primary/5 transition-all">
                    <td className="p-4" style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}>{asset.name}</td>
                    <td className="p-4">{asset.type}</td>
                    <td className="p-4">{asset.location}</td>
                    <td className="p-4">{asset.purchaseDate}</td>
                    <td className="p-4">{asset.cost.toLocaleString()}</td>
                    <td className="p-4">{asset.usefulLife}</td>
                    <td className="p-4">{dep.yearsUsed}</td>
                    <td className="p-4">{dep.annualDepreciation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="p-4">{dep.accumulatedDepreciation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="p-4 font-semibold text-primary">{dep.currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-primary/10" style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: 600, fontSize: '1.1rem', color: '#2d3748' }}>
              <th className="p-4 text-left">Report Name</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Generated By</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Format</th>
              <th className="p-4 text-left">Size</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {departmentReports.filter(r => r.department === selectedDept).length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No reports found for this department.</td></tr>
            ) : (
              departmentReports.filter(r => r.department === selectedDept).map((report) => (
                <tr key={report.id} className="border-b hover:bg-primary/5 transition-all">
                  <td className="p-4" style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}>{report.name}</td>
                  <td className="p-4"><Badge variant="outline" className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary border-0">{report.type}</Badge></td>
                  <td className="p-4">{report.generatedBy}</td>
                  <td className="p-4">{report.date}</td>
                  <td className="p-4">{report.format}</td>
                  <td className="p-4">{report.size}</td>
                  <td className="p-4">
                    <Button size="sm" variant="outline" onClick={() => handleDownloadReport(report)} style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }} className="rounded-full px-4 py-2 shadow hover:bg-primary/10">
                      <Download className="w-4 h-4 mr-1 text-primary" /> Download
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )}
          ) : (
            <div className="text-muted-foreground">Select a department to view its reports.</div>
          )}
        </CardContent>
      </Card>

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
