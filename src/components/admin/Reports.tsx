import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AuditLog from './AuditLog';
import type { Database } from '@/integrations/supabase/types';

const Reports: React.FC = () => {
  const { toast } = useToast();
  const [selectedDateRange, setSelectedDateRange] = useState('last30days');
  const [selectedStore, setSelectedStore] = useState('all');
  const [isGenerating, setIsGenerating] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDepartment, setUploadDepartment] = useState('all');
  const [uploadFormat, setUploadFormat] = useState('PDF');

  const reportTypes = [
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Current stock levels across all stores',
      color: '',
      bgColor: '',
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
      color: '',
      bgColor: '',
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
      color: '',
      bgColor: '',
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
      color: '',
      bgColor: '',
      data: {
        totalRequests: 156,
        approved: 134,
        pending: 15,
        rejected: 7
      }
    }
  ];

  type ReportRow = Database['public']['Tables']['reports']['Row'];
  const [recentReports, setRecentReports] = useState<ReportRow[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // Fetch reports function for reuse
  const fetchReports = async () => {
    setLoadingReports(true);
    setReportsError(null);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setReportsError('Failed to load reports.');
      setRecentReports([]);
    } else {
      setRecentReports(data || []);
    }
    setLoadingReports(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async (reportId: string, format: string) => {
    setIsGenerating(prev => new Set(prev).add(`${reportId}-${format}`));
    // Find the report type info
    const reportType = reportTypes.find(r => r.id === reportId);
    if (!reportType) {
      setIsGenerating(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${reportId}-${format}`);
        return newSet;
      });
      toast({ title: 'Error', description: 'Report type not found.' });
      return;
    }
    // Simulate report generation delay
    setTimeout(async () => {
      // Insert new report into Supabase
      const { error } = await supabase.from('reports').insert([
        {
          name: `${reportType.title} - ${new Date().toLocaleString()}`,
          type: reportType.title,
          generated_by: 'Admin', // You can replace with actual user
          date: new Date().toISOString().slice(0, 10),
          format: format,
          size: '2.0 MB', // Simulated size, adjust as needed
          // file_url: '', // Add if you implement file upload
        }
      ]);
      setIsGenerating(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${reportId}-${format}`);
        return newSet;
      });
      if (error) {
        toast({ title: 'Error', description: 'Failed to save report to database.' });
      } else {
        toast({
          title: "Report Generated",
          description: `${reportType.title} report has been generated and saved in ${format} format.`,
        });
        fetchReports(); // Refresh the reports list
      }
    }, 2000);
  };

  const handleDownloadReport = async (reportId: string) => {
    const report = recentReports.find(r => r.id === reportId);
    if (!report) return;
    // If you have a file_url or storage reference, use it. Otherwise, simulate as before.
    if (report.file_url) {
      // Download from Supabase Storage or direct link
      window.open(report.file_url, '_blank');
      toast({
        title: "Download Started",
        description: `Downloading ${report.name}`,
      });
      return;
    }
    // Fallback: Simulate file content
    let content = '';
    let mimeType = '';
    let fileExtension = '';
    if (report.format && report.format.toLowerCase() === 'pdf') {
      content = `PDF Report: ${report.name}\nType: ${report.type}\nGenerated by: ${report.generated_by}\nDate: ${report.date}`;
      mimeType = 'application/pdf';
      fileExtension = 'pdf';
    } else if (report.format && report.format.toLowerCase() === 'excel') {
      content = `Excel Report: ${report.name}\nType: ${report.type}\nGenerated by: ${report.generated_by}\nDate: ${report.date}`;
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
    a.download = `${report.name?.replace(/\s+/g, '_') || 'report'}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    toast({
      title: "Download Started",
      description: `Downloading ${report.name} as ${report.format}`,
    });
  };

  return (
    <div className="space-y-6">
      <AuditLog />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <Button variant="outline" onClick={fetchReports}>Refresh Data</Button>
      </div>

      {/* Upload Report (All Departments) */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Department Report</CardTitle>
          <CardDescription>Admins and departments can upload PDF/Excel reports for their store</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!uploadFile) {
                toast({ title: 'Error', description: 'Please select a file to upload.' });
                return;
              }
              setUploading(true);
              // Upload to Supabase Storage
              const fileExt = uploadFile.name.split('.').pop();
              const fileName = `${uploadDepartment}_${Date.now()}.${fileExt}`;
              const { data: storageData, error: storageError } = await supabase.storage
                .from('reports')
                .upload(fileName, uploadFile);
              if (storageError) {
                toast({ title: 'Error', description: 'File upload failed.' });
                setUploading(false);
                return;
              }
              // Get public URL
              const { data: publicUrlData } = supabase.storage
                .from('reports')
                .getPublicUrl(fileName);
              const fileUrl = publicUrlData?.publicUrl || '';
              // Insert report row
              const { error: dbError } = await supabase.from('reports').insert([
                {
                  name: uploadFile.name,
                  type: uploadDepartment,
                  generated_by: 'Department', // You can set actual user/department
                  date: new Date().toISOString().slice(0, 10),
                  format: uploadFormat,
                  size: `${(uploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
                  file_url: fileUrl,
                }
              ]);
              setUploading(false);
              setUploadFile(null);
              if (dbError) {
                toast({ title: 'Error', description: 'Failed to save report info.' });
              } else {
                toast({ title: 'Report Uploaded', description: 'Report uploaded and saved successfully.' });
                // @ts-ignore: notifications table may not be in types yet
                await supabase.from('notifications').insert([
                  {
                    message: `A new report "${uploadFile.name}" was uploaded for ${uploadDepartment}.`,
                    department: uploadDepartment,
                    file_name: uploadFile.name,
                    uploader: 'Department', // Replace with actual user if available
                  }
                ]);
                toast({
                  title: 'Admin Notification',
                  description: `A new report was uploaded for ${uploadDepartment}. Notify admin to review.`,
                  variant: 'default',
                });
                fetchReports();
              }
            }}
          >
            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={uploadDepartment} onValueChange={setUploadDepartment}>
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
            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={uploadFormat} onValueChange={setUploadFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file">Report File</Label>
              <Input
                type="file"
                accept=".pdf,.xlsx,.xls"
                onChange={e => setUploadFile(e.target.files?.[0] || null)}
                disabled={uploading}
              />
            </div>
            <div>
              <Button type="submit" disabled={uploading || !uploadFile} className="w-full">
                {uploading ? 'Uploading...' : 'Upload Report'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
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
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
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
                  {isGenerating.has(`${report.id}-PDF`) ? 'Generating...' : 'Generate PDF'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleGenerateReport(report.id, 'Excel')}
                  disabled={isGenerating.has(`${report.id}-Excel`)}
                  className="flex-1"
                >
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
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingReports ? (
            <div className="text-center py-8 text-muted-foreground">Loading reports...</div>
          ) : reportsError ? (
            <div className="text-center py-8 text-destructive">{reportsError}</div>
          ) : recentReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No reports found.</div>
          ) : (
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{report.type}</Badge>
                          <span>•</span>
                          <span>Generated by {report.generated_by}</span>
                          <span>•</span>
                          <span>{report.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Format: {report.format}</span>
                      {report.size && <span>Size: {report.size}</span>}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadReport(report.id)}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Dashboard Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Analytics</CardTitle>
          <CardDescription>Key performance indicators at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <p className="text-2xl font-bold">2,847</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <Badge variant="default" className="mt-1">+8% from last month</Badge>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <p className="text-2xl font-bold">127</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <Badge variant="default" className="mt-1">+12% from last month</Badge>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <Badge variant="secondary" className="mt-1">+3% from last month</Badge>
            </div>
            <div className="p-4 border rounded-lg text-center">
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
