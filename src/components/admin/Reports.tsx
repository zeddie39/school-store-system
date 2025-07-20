
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Activity,
  Filter,
  RefreshCw
} from 'lucide-react';

const Reports: React.FC = () => {
  const { toast } = useToast();
  const [selectedDateRange, setSelectedDateRange] = useState('last30days');
  const [selectedStore, setSelectedStore] = useState('all');
  const [isGenerating, setIsGenerating] = useState<Set<string>>(new Set());

  const reportTypes = [
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Current stock levels across all stores',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      data: {
        totalItems: 2847,
        lowStock: 23,
        outOfStock: 5,
        mostRequested: 'Biology Textbooks'
      }
    },
    {
      id: 'users',
      title: 'User Activity Report',
      description: 'User engagement and activity metrics',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      data: {
        activeUsers: 127,
        newUsers: 12,
        logins: 456,
        topUser: 'John Doe (45 actions)'
      }
    },
    {
      id: 'financial',
      title: 'Financial Report',
      description: 'Budget allocation and expense tracking',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      data: {
        totalBudget: 'KSH 2,450,000',
        spent: 'KSH 1,876,500',
        remaining: 'KSH 573,500',
        topExpense: 'Laboratory Equipment'
      }
    },
    {
      id: 'requests',
      title: 'Requests Report',
      description: 'Stock requests and approval statistics',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      data: {
        totalRequests: 156,
        approved: 134,
        pending: 15,
        rejected: 7
      }
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Monthly Inventory Report - January 2024',
      type: 'Inventory',
      generatedBy: 'Admin',
      date: '2024-01-16',
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'User Activity Summary - Q4 2023',
      type: 'User Activity',
      generatedBy: 'System',
      date: '2024-01-01',
      format: 'Excel',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Financial Report - December 2023',
      type: 'Financial',
      generatedBy: 'Bursar',
      date: '2023-12-31',
      format: 'PDF',
      size: '3.2 MB'
    }
  ];

  const handleGenerateReport = async (reportId: string, format: string) => {
    setIsGenerating(prev => new Set(prev).add(`${reportId}-${format}`));
    
    setTimeout(() => {
      setIsGenerating(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${reportId}-${format}`);
        return newSet;
      });
      
      toast({
        title: "Report Generated",
        description: `${reportId} report has been generated successfully in ${format} format.`,
      });
    }, 3000);
  };

  const handleDownloadReport = (reportId: number) => {
    toast({
      title: "Download Started",
      description: "Report download has been initiated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Report Filters
          </CardTitle>
          <CardDescription>Configure report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last3months">Last 3 Months</SelectItem>
                  <SelectItem value="last6months">Last 6 Months</SelectItem>
                  <SelectItem value="lastyear">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="store-filter">Store/Department</Label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  <SelectItem value="library">Library Store</SelectItem>
                  <SelectItem value="laboratory">Laboratory Store</SelectItem>
                  <SelectItem value="kitchen">Kitchen Store</SelectItem>
                  <SelectItem value="sports">Sports Store</SelectItem>
                  <SelectItem value="ict">ICT Lab Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${report.bgColor}`}>
                  <report.icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                {Object.entries(report.data).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              {/* Generation Buttons */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleGenerateReport(report.id, 'PDF')}
                  disabled={isGenerating.has(`${report.id}-PDF`)}
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {isGenerating.has(`${report.id}-PDF`) ? 'Generating...' : 'Generate PDF'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleGenerateReport(report.id, 'Excel')}
                  disabled={isGenerating.has(`${report.id}-Excel`)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGenerating.has(`${report.id}-Excel`) ? 'Generating...' : 'Generate Excel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Reports
          </CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{report.type}</Badge>
                        <span>•</span>
                        <span>Generated by {report.generatedBy}</span>
                        <span>•</span>
                        <span>{report.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Format: {report.format}</span>
                    <span>Size: {report.size}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadReport(report.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Analytics
          </CardTitle>
          <CardDescription>Key performance indicators at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">2,847</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <Badge variant="default" className="mt-1">+8% from last month</Badge>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">127</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <Badge variant="default" className="mt-1">+12% from last month</Badge>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <Badge variant="secondary" className="mt-1">+3% from last month</Badge>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold">76%</p>
              <p className="text-sm text-muted-foreground">Budget Utilized</p>
              <Badge variant="secondary" className="mt-1">+5% from last month</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
