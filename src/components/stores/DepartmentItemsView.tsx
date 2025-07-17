import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ChevronDown, 
  Package, 
  TrendingDown, 
  TrendingUp, 
  ShoppingCart,
  Minus,
  Plus,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { useStores } from '@/hooks/useStores';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Item = Database['public']['Tables']['items']['Row'] & {
  store?: { name: string; store_type: string };
};

interface UsageRecord {
  id: string;
  item_id: string;
  quantity_used: number;
  date_used: string;
  week_period: string;
  user_id: string;
}

const DepartmentItemsView: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [usageDialogOpen, setUsageDialogOpen] = useState(false);
  const [usageQuantity, setUsageQuantity] = useState(1);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  
  const { stores } = useStores();
  const { items, updateItem } = useItems();
  const { toast } = useToast();

  // Group items by department (store type)
  const departmentItems = React.useMemo(() => {
    if (!selectedDepartment) return [];
    
    const departmentStores = stores.filter(store => store.store_type === selectedDepartment);
    const storeIds = departmentStores.map(store => store.id);
    
    return items.filter(item => storeIds.includes(item.store_id));
  }, [selectedDepartment, stores, items]);

  // Get available departments
  const availableDepartments = React.useMemo(() => {
    const departments = [...new Set(stores.map(store => store.store_type))];
    return departments.map(dept => ({
      value: dept,
      label: dept.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  }, [stores]);

  // Calculate item usage for current week
  const getWeeklyUsage = (itemId: string) => {
    const currentWeek = getWeekPeriod(new Date());
    const weeklyRecords = usageRecords.filter(
      record => record.item_id === itemId && record.week_period === currentWeek
    );
    return weeklyRecords.reduce((total, record) => total + record.quantity_used, 0);
  };

  // Get week period string (e.g., "2024-W03")
  const getWeekPeriod = (date: Date) => {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const daysSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);
    return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
  };

  // Handle item usage
  const handleUseItem = async (item: Item, quantity: number) => {
    if (quantity <= 0 || quantity > item.quantity) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity to use.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update item quantity
      await updateItem(item.id, {
        quantity: item.quantity - quantity
      });

      // Record usage (in a real app, this would be saved to a usage_records table)
      const newUsageRecord: UsageRecord = {
        id: Math.random().toString(36).substr(2, 9),
        item_id: item.id,
        quantity_used: quantity,
        date_used: new Date().toISOString(),
        week_period: getWeekPeriod(new Date()),
        user_id: 'current-user' // In real app, get from auth
      };
      
      setUsageRecords(prev => [...prev, newUsageRecord]);
      
      toast({
        title: "Item used",
        description: `${quantity} ${item.unit} of ${item.name} marked as used.`,
      });
      
      setUsageDialogOpen(false);
      setUsageQuantity(1);
    } catch (error) {
      toast({
        title: "Error recording usage",
        description: "Failed to update item usage.",
        variant: "destructive",
      });
    }
  };

  // Get item status based on stock level
  const getItemStatus = (item: Item) => {
    const lowStockThreshold = item.minimum_stock || 10;
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= lowStockThreshold) return 'low-stock';
    return 'in-stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-success/10 text-success';
      case 'low-stock': return 'bg-warning/10 text-warning';
      case 'out-of-stock': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-stock': return 'In Stock';
      case 'low-stock': return 'Low Stock';
      case 'out-of-stock': return 'Out of Stock';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Department Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Department Inventory
          </CardTitle>
          <CardDescription>
            Select a department to view and manage its inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-sm">
            <Label htmlFor="department">Department</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {availableDepartments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      {selectedDepartment && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentItems.map((item) => {
            const status = getItemStatus(item);
            const weeklyUsed = getWeeklyUsage(item.id);
            const remaining = item.quantity;
            
            return (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => setSelectedItem(item)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.description || 'No description'}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(status)}>
                      {getStatusText(status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Available:</span>
                      <span className="font-bold ml-2 text-success">
                        {remaining} {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Used (Week):</span>
                      <span className="font-bold ml-2 text-warning">
                        {weeklyUsed} {item.unit}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Minimum Stock:</span>
                    <span className="font-medium ml-2">
                      {item.minimum_stock || 10} {item.unit}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Dialog open={usageDialogOpen} onOpenChange={setUsageDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          disabled={item.quantity === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setUsageDialogOpen(true);
                          }}
                        >
                          <Minus className="w-4 h-4 mr-1" />
                          Use Item
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Usage Dialog */}
      {selectedItem && (
        <Dialog open={usageDialogOpen} onOpenChange={setUsageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Use {selectedItem.name}</DialogTitle>
              <DialogDescription>
                Record usage of this item. Current stock: {selectedItem.quantity} {selectedItem.unit}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Available</div>
                  <div className="font-bold text-success">
                    {selectedItem.quantity} {selectedItem.unit}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Used This Week</div>
                  <div className="font-bold text-warning">
                    {getWeeklyUsage(selectedItem.id)} {selectedItem.unit}
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantity to Use</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUsageQuantity(Math.max(1, usageQuantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={usageQuantity}
                    onChange={(e) => setUsageQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={selectedItem.quantity}
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUsageQuantity(Math.min(selectedItem.quantity, usageQuantity + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground ml-2">
                    {selectedItem.unit}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setUsageDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleUseItem(selectedItem, usageQuantity)}
                  disabled={usageQuantity <= 0 || usageQuantity > selectedItem.quantity}
                >
                  Record Usage
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Empty State */}
      {selectedDepartment && departmentItems.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Items Found</h3>
            <p className="text-muted-foreground text-center">
              This department doesn't have any items yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DepartmentItemsView;