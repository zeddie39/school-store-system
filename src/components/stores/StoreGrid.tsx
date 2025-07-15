import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Beaker, 
  ChefHat, 
  Dumbbell, 
  Monitor, 
  Home, 
  Users, 
  Calculator,
  Truck,
  Package,
  Eye,
  Edit,
  Plus
} from 'lucide-react';
import { UserRole } from '../auth/LoginForm';

interface StoreGridProps {
  userRole: UserRole;
}

interface StoreInfo {
  id: string;
  name: string;
  type: string;
  icon: React.ComponentType<any>;
  itemCount: number;
  lastUpdated: string;
  status: 'active' | 'low-stock' | 'maintenance';
  manager: string;
  description: string;
}

const StoreGrid: React.FC<StoreGridProps> = ({ userRole }) => {
  const stores: StoreInfo[] = [
    {
      id: 'library',
      name: 'Library Store',
      type: 'Educational',
      icon: BookOpen,
      itemCount: 1250,
      lastUpdated: '2 hours ago',
      status: 'active',
      manager: 'Sarah Johnson',
      description: 'Books, journals, and educational materials'
    },
    {
      id: 'laboratory',
      name: 'Laboratory Store',
      type: 'Scientific',
      icon: Beaker,
      itemCount: 487,
      lastUpdated: '4 hours ago',
      status: 'low-stock',
      manager: 'Dr. Michael Chen',
      description: 'Lab equipment and scientific instruments'
    },
    {
      id: 'kitchen',
      name: 'Kitchen Store',
      type: 'Food Service',
      icon: ChefHat,
      itemCount: 325,
      lastUpdated: '1 hour ago',
      status: 'active',
      manager: 'Maria Rodriguez',
      description: 'Kitchen supplies and food items'
    },
    {
      id: 'sports',
      name: 'Sports Store',
      type: 'Athletic',
      icon: Dumbbell,
      itemCount: 198,
      lastUpdated: '6 hours ago',
      status: 'active',
      manager: 'Coach Thompson',
      description: 'Sports equipment and athletic gear'
    },
    {
      id: 'ict',
      name: 'ICT Lab',
      type: 'Technology',
      icon: Monitor,
      itemCount: 156,
      lastUpdated: '3 hours ago',
      status: 'maintenance',
      manager: 'Tech Team',
      description: 'Computer equipment and IT supplies'
    },
    {
      id: 'boarding',
      name: 'Boarding Store',
      type: 'Residential',
      icon: Home,
      itemCount: 234,
      lastUpdated: '5 hours ago',
      status: 'active',
      manager: 'House Keeper',
      description: 'Boarding house supplies and materials'
    },
    {
      id: 'examination',
      name: 'Examination Store',
      type: 'Academic',
      icon: Calculator,
      itemCount: 89,
      lastUpdated: '1 day ago',
      status: 'active',
      manager: 'Exam Officer',
      description: 'Examination materials and stationery'
    },
    {
      id: 'agriculture',
      name: 'Agriculture Store',
      type: 'Agricultural',
      icon: Truck,
      itemCount: 167,
      lastUpdated: '8 hours ago',
      status: 'active',
      manager: 'Farm Manager',
      description: 'Agricultural tools and supplies'
    },
    {
      id: 'general',
      name: 'General Store',
      type: 'Miscellaneous',
      icon: Package,
      itemCount: 456,
      lastUpdated: '2 hours ago',
      status: 'active',
      manager: 'General Manager',
      description: 'General supplies and miscellaneous items'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'low-stock': return 'bg-warning/10 text-warning';
      case 'maintenance': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'low-stock': return 'Low Stock';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const canEdit = (userRole: UserRole) => {
    return userRole === 'admin' || userRole === 'storekeeper';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => {
        const IconComponent = store.icon;
        return (
          <Card key={store.id} className="store-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <CardDescription>{store.type}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(store.status)}>
                  {getStatusText(store.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {store.description}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium ml-2">{store.itemCount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Manager:</span>
                  <span className="font-medium ml-2">{store.manager}</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last updated: {store.lastUpdated}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                {canEdit(userRole) && (
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                )}
                {(userRole === 'admin' || userRole === 'storekeeper') && (
                  <Button size="sm" className="flex-1">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StoreGrid;