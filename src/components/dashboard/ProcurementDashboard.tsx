
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Truck, 
  DollarSign, 
  Package,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import StatsCard from '../common/StatsCard';
import { useToast } from '@/hooks/use-toast';

const ProcurementDashboard: React.FC = () => {
  const { toast } = useToast();
  const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set());

  const stats = [
    {
      title: "Purchase Orders",
      value: "24",
      description: "Active orders",
      icon: ShoppingCart,
      trend: "+6",
      color: "text-primary"
    },
    {
      title: "In Transit",
      value: "12",
      description: "Items being delivered",
      icon: Truck,
      trend: "+3",
      color: "text-info"
    },
    {
      title: "Monthly Budget",
      value: "$15,240",
      description: "Remaining budget",
      icon: DollarSign,
      trend: "-$2,180",
      color: "text-success"
    },
    {
      title: "Delivered",
      value: "89",
      description: "Items this month",
      icon: Package,
      trend: "+15",
      color: "text-accent"
    }
  ];

  const [procurementRequests, setProcurementRequests] = useState([
    {
      id: 1,
      department: "Science Laboratory",
      item: "Laboratory Equipment Set",
      quantity: 5,
      estimatedCost: "$2,500",
      status: "pending",
      requestDate: "2024-01-15",
      urgency: "High"
    },
    {
      id: 2,
      department: "Library",
      item: "Reference Books",
      quantity: 50,
      estimatedCost: "$1,200",
      status: "approved",
      requestDate: "2024-01-14",
      urgency: "Medium"
    },
    {
      id: 3,
      department: "Kitchen",
      item: "Cooking Utensils",
      quantity: 20,
      estimatedCost: "$800",
      status: "processing",
      requestDate: "2024-01-13",
      urgency: "Low"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'approved': return 'bg-success/10 text-success';
      case 'processing': return 'bg-info/10 text-info';
      case 'delivered': return 'bg-accent/10 text-accent';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-destructive/10 text-destructive';
      case 'Medium': return 'bg-warning/10 text-warning';
      case 'Low': return 'bg-success/10 text-success';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const handleNewPurchaseOrder = () => {
    toast({
      title: "New Purchase Order",
      description: "Opening purchase order form...",
    });
  };

  const handleReviewRequest = (requestId: number) => {
    toast({
      title: "Reviewing Request",
      description: `Opening review for request #${requestId}...`,
    });
  };

  const handleProcessRequest = (requestId: number) => {
    setProcessingRequests(prev => new Set(prev).add(requestId));
    setTimeout(() => {
      setProcurementRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'processing' } : req
      ));
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
      toast({
        title: "Request Processed",
        description: `Request #${requestId} has been moved to processing.`,
      });
    }, 2000);
  };

  const handleTrackOrder = (requestId: number) => {
    toast({
      title: "Tracking Order",
      description: `Opening tracking details for request #${requestId}...`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Procurement Dashboard</h1>
        <Button onClick={handleNewPurchaseOrder}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Procurement Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Procurement Requests
          </CardTitle>
          <CardDescription>
            Manage and track procurement requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {procurementRequests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{request.department}</p>
                    <p className="text-sm text-muted-foreground">{request.item}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <p className="font-medium">{request.quantity}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est. Cost:</span>
                    <p className="font-medium">{request.estimatedCost}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p className="font-medium">{request.requestDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Requested {request.requestDate}
                  </div>
                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReviewRequest(request.id)}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleProcessRequest(request.id)}
                          disabled={processingRequests.has(request.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {processingRequests.has(request.id) ? 'Processing...' : 'Process'}
                        </Button>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <Button 
                        size="sm"
                        onClick={() => handleTrackOrder(request.id)}
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        Track Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcurementDashboard;
