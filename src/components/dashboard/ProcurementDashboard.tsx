
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Truck, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Package,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search
} from 'lucide-react';
import StatsCard from '../common/StatsCard';
import { useToast } from '@/hooks/use-toast';

const ProcurementDashboard: React.FC = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'overview' | 'procurement' | 'orders' | 'suppliers'>('overview');
  const [processingOrders, setProcessingOrders] = useState<Set<number>>(new Set());

  const stats = [
    {
      title: "Total Procurements",
      value: "156",
      description: "This month",
      icon: ShoppingCart,
      trend: "+12%",
      color: "text-primary"
    },
    {
      title: "Active Orders",
      value: "23",
      description: "Currently processing",
      icon: Truck,
      trend: "+5",
      color: "text-warning"
    },
    {
      title: "Completed Orders",
      value: "89",
      description: "This month",
      icon: CheckCircle,
      trend: "+8%",
      color: "text-success"
    },
    {
      title: "Monthly Budget",
      value: "KSH 2,500,000",
      description: "Procurement budget",
      icon: TrendingUp,
      trend: "+15%",
      color: "text-info"
    }
  ];

  const [orders, setOrders] = useState([
    {
      id: 1,
      item: "Laboratory Equipment",
      supplier: "Science Supply Co.",
      quantity: 15,
      unitPrice: "KSH 45,000",
      totalCost: "KSH 675,000",
      status: "pending",
      orderDate: "2024-01-15",
      expectedDelivery: "2024-01-25"
    },
    {
      id: 2,
      item: "Library Books",
      supplier: "Academic Publishers",
      quantity: 100,
      unitPrice: "KSH 2,500",
      totalCost: "KSH 250,000",
      status: "processing",
      orderDate: "2024-01-14",
      expectedDelivery: "2024-01-22"
    },
    {
      id: 3,
      item: "Sports Equipment",
      supplier: "Sports World Ltd",
      quantity: 25,
      unitPrice: "KSH 8,000",
      totalCost: "KSH 200,000",
      status: "delivered",
      orderDate: "2024-01-10",
      expectedDelivery: "2024-01-18"
    }
  ]);

  const suppliers = [
    {
      id: 1,
      name: "Science Supply Co.",
      contact: "info@sciencesupply.com",
      phone: "+254 700 123 456",
      category: "Laboratory Equipment",
      rating: 4.8,
      totalOrders: 45,
      totalValue: "KSH 2,340,000"
    },
    {
      id: 2,
      name: "Academic Publishers",
      contact: "orders@academic.com",
      phone: "+254 700 234 567",
      category: "Books & Literature",
      rating: 4.6,
      totalOrders: 32,
      totalValue: "KSH 1,890,000"
    },
    {
      id: 3,
      name: "Sports World Ltd",
      contact: "sales@sportsworld.com",
      phone: "+254 700 345 678",
      category: "Sports Equipment",
      rating: 4.7,
      totalOrders: 28,
      totalValue: "KSH 1,560,000"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success/10 text-success';
      case 'processing': return 'bg-info/10 text-info';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const handleCreateOrder = () => {
    toast({
      title: "Create New Order",
      description: "Opening procurement order form...",
    });
  };

  const handleProcessOrder = (orderId: number) => {
    setProcessingOrders(prev => new Set(prev).add(orderId));
    setTimeout(() => {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'processing' } : order
      ));
      setProcessingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
      toast({
        title: "Order Processed",
        description: `Order #${orderId} has been moved to processing.`,
      });
    }, 2000);
  };

  const handleViewOrder = (orderId: number) => {
    toast({
      title: "View Order Details",
      description: `Opening detailed view for order #${orderId}...`,
    });
  };

  const handleEditOrder = (orderId: number) => {
    toast({
      title: "Edit Order",
      description: `Opening order editor for order #${orderId}...`,
    });
  };

  const handleCancelOrder = (orderId: number) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'cancelled' } : order
    ));
    toast({
      title: "Order Cancelled",
      description: `Order #${orderId} has been cancelled.`,
      variant: "destructive",
    });
  };

  const handleAddSupplier = () => {
    toast({
      title: "Add New Supplier",
      description: "Opening supplier registration form...",
    });
  };

  const handleEditSupplier = (supplierId: number) => {
    toast({
      title: "Edit Supplier",
      description: `Opening supplier editor for supplier #${supplierId}...`,
    });
  };

  const handleViewSupplier = (supplierId: number) => {
    toast({
      title: "View Supplier Details",
      description: `Opening detailed view for supplier #${supplierId}...`,
    });
  };

  const renderProcurementManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Procurement Management</h2>
        <Button onClick={handleCreateOrder}>
          <Plus className="w-4 h-4 mr-2" />
          Create Order
        </Button>
      </div>
      
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.item}</h3>
                  <p className="text-sm text-muted-foreground">{order.supplier}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{order.totalCost}</p>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{order.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unit Price</p>
                  <p className="font-medium">{order.unitPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{order.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Delivery</p>
                  <p className="font-medium">{order.expectedDelivery}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {order.orderDate}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditOrder(order.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  {order.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => handleProcessOrder(order.id)}
                      disabled={processingOrders.has(order.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {processingOrders.has(order.id) ? 'Processing...' : 'Process'}
                    </Button>
                  )}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOrdersManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search Orders
          </Button>
          <Button onClick={handleCreateOrder}>
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-muted-foreground">{order.item}</p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{order.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="font-medium">{order.totalCost}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Delivery</p>
                  <p className="font-medium">{order.expectedDelivery}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewOrder(order.id)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditOrder(order.id)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSuppliersManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Suppliers Management</h2>
        <Button onClick={handleAddSupplier}>
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>
      
      <div className="grid gap-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{supplier.name}</h3>
                  <p className="text-sm text-muted-foreground">{supplier.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rating: {supplier.rating}/5</p>
                  <p className="text-sm text-muted-foreground">Total Value: {supplier.totalValue}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{supplier.contact}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{supplier.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="font-medium">{supplier.totalOrders}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewSupplier(supplier.id)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditSupplier(supplier.id)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'procurement':
        return renderProcurementManagement();
      case 'orders':
        return renderOrdersManagement();
      case 'suppliers':
        return renderSuppliersManagement();
      default:
        return (
          <div className="space-y-6">
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
                  Procurement management shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleCreateOrder}
                  >
                    <Plus className="w-6 h-6" />
                    New Order
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 bg-success text-success-foreground hover:bg-success/90"
                    onClick={() => setActiveView('orders')}
                  >
                    <Truck className="w-6 h-6" />
                    Manage Orders
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 bg-info text-info-foreground hover:bg-info/90"
                    onClick={() => setActiveView('suppliers')}
                  >
                    <Package className="w-6 h-6" />
                    Suppliers
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 bg-warning text-warning-foreground hover:bg-warning/90"
                    onClick={() => setActiveView('procurement')}
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Procurement
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription>
                  Latest procurement orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.item}</p>
                          <p className="text-sm text-muted-foreground">{order.supplier}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">{order.totalCost}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>
                          <p className="font-medium">{order.quantity}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected Delivery:</span>
                          <p className="font-medium">{order.expectedDelivery}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {order.orderDate}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {order.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => handleProcessOrder(order.id)}
                              disabled={processingOrders.has(order.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {processingOrders.has(order.id) ? 'Processing...' : 'Process'}
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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Procurement Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant={activeView === 'overview' ? 'default' : 'outline'} 
            onClick={() => setActiveView('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={activeView === 'procurement' ? 'default' : 'outline'} 
            onClick={() => setActiveView('procurement')}
          >
            Procurement
          </Button>
          <Button 
            variant={activeView === 'orders' ? 'default' : 'outline'} 
            onClick={() => setActiveView('orders')}
          >
            Orders
          </Button>
          <Button 
            variant={activeView === 'suppliers' ? 'default' : 'outline'} 
            onClick={() => setActiveView('suppliers')}
          >
            Suppliers
          </Button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default ProcurementDashboard;
