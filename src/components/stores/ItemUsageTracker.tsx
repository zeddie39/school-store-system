
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Minus, 
  Plus, 
  Calendar, 
  TrendingDown, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Package
} from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Item = Database['public']['Tables']['items']['Row'];

interface UsageRecord {
  id: string;
  quantity_used: number;
  date_used: string;
  time_used: string;
}

interface ItemUsageTrackerProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

const ItemUsageTracker: React.FC<ItemUsageTrackerProps> = ({ item, isOpen, onClose }) => {
  const [usageQuantity, setUsageQuantity] = useState(1);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [todayUsage, setTodayUsage] = useState(0);
  const [weeklyUsage, setWeeklyUsage] = useState(0);
  const { updateItem } = useItems();
  const { toast } = useToast();

  // Load usage records from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`usage_${item.id}`);
    if (stored) {
      const records = JSON.parse(stored);
      setUsageRecords(records);
      calculateUsage(records);
    }
  }, [item.id]);

  const calculateUsage = (records: UsageRecord[]) => {
    const today = new Date().toDateString();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const todayRecords = records.filter(r => 
      new Date(r.date_used).toDateString() === today
    );
    const weeklyRecords = records.filter(r => 
      new Date(r.date_used) >= oneWeekAgo
    );

    setTodayUsage(todayRecords.reduce((sum, r) => sum + r.quantity_used, 0));
    setWeeklyUsage(weeklyRecords.reduce((sum, r) => sum + r.quantity_used, 0));
  };

  const handleUseItem = async () => {
    if (usageQuantity <= 0 || usageQuantity > item.quantity) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity to use.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update item quantity in database
      await updateItem(item.id, {
        quantity: item.quantity - usageQuantity
      });

      // Record usage locally
      const newRecord: UsageRecord = {
        id: Date.now().toString(),
        quantity_used: usageQuantity,
        date_used: new Date().toISOString(),
        time_used: new Date().toLocaleTimeString()
      };

      const updatedRecords = [...usageRecords, newRecord];
      setUsageRecords(updatedRecords);
      localStorage.setItem(`usage_${item.id}`, JSON.stringify(updatedRecords));
      calculateUsage(updatedRecords);

      toast({
        title: "Usage recorded",
        description: `${usageQuantity} ${item.unit} of ${item.name} marked as used.`,
      });

      setUsageQuantity(1);
    } catch (error) {
      toast({
        title: "Error recording usage",
        description: "Failed to update item usage.",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = () => {
    const threshold = item.minimum_stock || 10;
    if (item.quantity === 0) return { status: 'out-of-stock', color: 'text-destructive', icon: AlertTriangle };
    if (item.quantity <= threshold) return { status: 'low-stock', color: 'text-warning', icon: AlertTriangle };
    return { status: 'in-stock', color: 'text-success', icon: CheckCircle };
  };

  const stockInfo = getStockStatus();
  const StatusIcon = stockInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {item.name} - Usage Tracker
          </DialogTitle>
          <DialogDescription>
            Track and record usage of this item with automatic quantity updates
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Stock Status */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`flex items-center justify-center gap-1 ${stockInfo.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-2xl font-bold">{item.quantity}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Available {item.unit}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-info">
                    <Calendar className="w-4 h-4" />
                    <span className="text-2xl font-bold">{todayUsage}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Used Today</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-warning">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-2xl font-bold">{weeklyUsage}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Used This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="quantity">Quantity to Use</Label>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUsageQuantity(Math.max(1, usageQuantity - 1))}
                  disabled={usageQuantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={usageQuantity}
                  onChange={(e) => setUsageQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  max={item.quantity}
                  className="text-center w-24"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUsageQuantity(Math.min(item.quantity, usageQuantity + 1))}
                  disabled={usageQuantity >= item.quantity}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  {item.unit}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-info/10 text-info">
                Remaining: {item.quantity - usageQuantity} {item.unit}
              </Badge>
              {(item.quantity - usageQuantity) <= (item.minimum_stock || 10) && (
                <Badge variant="outline" className="bg-warning/10 text-warning">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Will be low stock
                </Badge>
              )}
            </div>
          </div>

          {/* Recent Usage History */}
          {usageRecords.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Usage History
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {usageRecords.slice(-5).reverse().map((record) => (
                  <div key={record.id} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                    <span>Used {record.quantity_used} {item.unit}</span>
                    <span className="text-muted-foreground">
                      {new Date(record.date_used).toLocaleDateString()} at {record.time_used}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleUseItem}
              disabled={usageQuantity <= 0 || usageQuantity > item.quantity}
            >
              Record Usage
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemUsageTracker;
