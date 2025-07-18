
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
  Plus,
  Settings
} from 'lucide-react';
import { UserRole } from '../auth/LoginForm';
import { useStores } from '@/hooks/useStores';
import { useItems } from '@/hooks/useItems';
import type { Database } from '@/integrations/supabase/types';

interface StoreGridProps {
  userRole: UserRole;
}

type Store = Database['public']['Tables']['stores']['Row'];

const StoreGrid: React.FC<StoreGridProps> = ({ userRole }) => {
  const { stores, loading } = useStores();
  const { items } = useItems();

  const getStoreIcon = (storeType: string) => {
    switch (storeType) {
      case 'library': return BookOpen;
      case 'laboratory': return Beaker;
      case 'kitchen': return ChefHat;
      case 'sports': return Dumbbell;
      case 'ict_lab': return Monitor;
      case 'boarding': return Home;
      case 'examination': return Calculator;
      case 'agriculture': return Truck;
      case 'general': return Package;
      default: return Package;
    }
  };

  const getItemCount = (storeId: string) => {
    return items.filter(item => item.store_id === storeId).length;
  };

  const getTotalValue = (storeId: string) => {
    const storeItems = items.filter(item => item.store_id === storeId);
    // Estimate value based on quantity (for demo purposes)
    return storeItems.reduce((total, item) => total + (item.quantity * 50), 0);
  };

  const getStoreStatus = (storeId: string) => {
    const storeItems = items.filter(item => item.store_id === storeId);
    const lowStockItems = storeItems.filter(item => 
      item.minimum_stock && item.quantity <= item.minimum_stock
    );
    
    if (lowStockItems.length > storeItems.length * 0.3) {
      return 'low-stock';
    }
    return 'active';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'low-stock': return 'bg-warning/10 text-warning border-warning/20';
      case 'maintenance': return 'bg-destructive/10 text-destructive border-destructive/20';
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
        const IconComponent = getStoreIcon(store.store_type);
        const itemCount = getItemCount(store.id);
        const totalValue = getTotalValue(store.id);
        const status = getStoreStatus(store.id);
        
        return (
          <Card key={store.id} className="store-card hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {store.store_type.replace('_', ' ')}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(status)}>
                  {getStatusText(status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {store.description || 'No description available'}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium ml-2">{itemCount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Value:</span>
                  <span className="font-medium ml-2 text-success">
                    KSH {totalValue.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium ml-2">{store.location || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium ml-2 capitalize">
                    {store.store_type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Created: {new Date(store.created_at || '').toLocaleDateString()}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    // Activate the view items functionality
                    console.log(`Viewing items for store: ${store.name}`)
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Items
                </Button>
                {canEdit(userRole) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      // Activate the manage functionality
                      console.log(`Managing store: ${store.name}`)
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {(userRole === 'admin' || userRole === 'storekeeper') && (
                <Button 
                  size="sm" 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    // Activate the add item functionality
                    console.log(`Adding item to: ${store.name}`)
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StoreGrid;
