
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Calendar
} from 'lucide-react';
import StatsCard from '../common/StatsCard';
import { useToast } from '@/hooks/use-toast';

const TeacherDashboard: React.FC = () => {
  const { toast } = useToast();
  const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set());
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      requester: "John Smith",
      store: "Laboratory Store",
      item: "Microscope Slides",
      quantity: 50,
      date: "2024-01-15",
      priority: "High",
      status: "pending"
    },
    {
      id: 2,
      requester: "Mary Johnson",
      store: "Library Store",
      item: "Science Textbooks",
      quantity: 25,
      date: "2024-01-15",
      priority: "Medium",
      status: "pending"
    },
    {
      id: 3,
      requester: "David Brown",
      store: "Sports Store",
      item: "Football Equipment",
      quantity: 10,
      date: "2024-01-14",
      priority: "Low",
      status: "pending"
    }
  ]);

  const stats = [
    {
      title: "Pending Approvals",
      value: pendingRequests.filter(req => req.status === "pending").length.toString(),
      description: "Awaiting your approval",
      icon: Clock,
      trend: "+2",
      color: "text-warning"
    },
    {
      title: "Approved Today",
      value: "12",
      description: "Requests approved",
      icon: CheckCircle,
      trend: "+5",
      color: "text-success"
    },
    {
      title: "Total Requests",
      value: "156",
      description: "This month",
      icon: ClipboardCheck,
      trend: "+18",
      color: "text-primary"
    },
    {
      title: "Rejected",
      value: "3",
      description: "Rejected this week",
      icon: XCircle,
      trend: "-1",
      color: "text-destructive"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-destructive/10 text-destructive';
      case 'Medium': return 'bg-warning/10 text-warning';
      case 'Low': return 'bg-success/10 text-success';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const handleViewAllRequests = () => {
    toast({
      title: "View All Requests",
      description: "Opening requests management interface...",
    });
  };

  const handleApproveRequest = (requestId: number) => {
    setProcessingRequests(prev => new Set(prev).add(requestId));
    
    setTimeout(() => {
      setPendingRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
      ));
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
      toast({
        title: "Request Approved",
        description: `Request #${requestId} has been approved successfully.`,
      });
    }, 2000);
  };

  const handleRejectRequest = (requestId: number) => {
    setProcessingRequests(prev => new Set(prev).add(requestId));
    
    setTimeout(() => {
      setPendingRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' } : req
      ));
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
      toast({
        title: "Request Rejected",
        description: `Request #${requestId} has been rejected.`,
        variant: "destructive",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button onClick={handleViewAllRequests}>
          <FileText className="w-4 h-4 mr-2" />
          View All Requests
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" />
            Pending Approvals
          </CardTitle>
          <CardDescription>
            Stock requests awaiting your approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingRequests.filter(req => req.status === "pending").map((request) => (
              <div key={request.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{request.requester}</p>
                      <p className="text-sm text-muted-foreground">{request.store}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Item:</span>
                    <p className="font-medium">{request.item}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <p className="font-medium">{request.quantity}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {request.date}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRejectRequest(request.id)}
                      disabled={processingRequests.has(request.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      {processingRequests.has(request.id) ? 'Processing...' : 'Reject'}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApproveRequest(request.id)}
                      disabled={processingRequests.has(request.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {processingRequests.has(request.id) ? 'Processing...' : 'Approve'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {pendingRequests.filter(req => req.status === "pending").length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pending requests at the moment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
