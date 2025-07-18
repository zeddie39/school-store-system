
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronRight,
  Package, 
  AlertTriangle,
  TrendingDown,
  Calendar
} from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useItems } from '@/hooks/useItems';
import ItemUsageTracker from './ItemUsageTracker';
import type { Database } from '@/integrations/supabase/types';

type Item = Database['public']['Tables']['items']['Row'] & {
  store?: { name: string; store_type: string };
};

interface DepartmentDropdownProps {
  department: string;
  departmentLabel: string;
  isOpen: boolean;
  onToggle: () => void;
}

const DepartmentDropdown: React.FC<DepartmentDropdownProps> = ({
  department,
  departmentLabel,
  isOpen,
  onToggle
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { stores } = useStores();
  const { items } = useItems();

  // Get items for this department
  const departmentStores = stores.filter(store => store.store_type === department);
  const storeIds = departmentStores.map(store => store.id);
  const departmentItems = items.filter(item => storeIds.includes(item.store_id));

  // Calculate totals
  const totalItems = departmentItems.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = departmentItems.filter(item => 
    item.minimum_stock && item.quantity <= item.minimum_stock
  ).length;

  const getItemStatus = (item: Item) => {
    const threshold = item.minimum_stock || 10;
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= threshold) return 'low-stock';
    return 'in-stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-success/10 text-success border-success/20';
      case 'low-stock': return 'bg-warning/10 text-warning border-warning/20';
      case 'out-of-stock': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            <div>
              <CardTitle className="text-lg">{departmentLabel}</CardTitle>
              <CardDescription>
                {departmentItems.length} items • Total: {totalItems} units
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lowStockItems > 0 && (
              <Badge variant="outline" className="bg-warning/10 text-warning">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {lowStockItems} Low Stock
              </Badge>
            )}
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {departmentItems.map((item) => {
              const status = getItemStatus(item);
              
              return (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${getStatusColor(status)}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(status)}`}
                      >
                        {status.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="font-bold text-lg">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min Stock:</span>
                        <span>{item.minimum_stock || 10} {item.unit}</span>
                      </div>
                      
                      {item.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>This Week</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                        >
                          Track Usage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {departmentItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No items found in this department</p>
            </div>
          )}
        </CardContent>
      )}

      {/* Item Usage Tracker Modal */}
      {selectedItem && (
        <ItemUsageTracker
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </Card>
  );
};

export default DepartmentDropdown;
