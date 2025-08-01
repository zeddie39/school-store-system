
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, AlertTriangle, CheckCircle, Eye, Edit } from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { useToast } from '@/hooks/use-toast';
import ItemDetailsDialog from './ItemDetailsDialog';
import type { Database } from '@/integrations/supabase/types';

type Store = Database['public']['Tables']['stores']['Row'];
type Item = Database['public']['Tables']['items']['Row'];

interface StoreItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store | null;
}

const StoreItemsDialog: React.FC<StoreItemsDialogProps> = ({ 
  open, 
  onOpenChange, 
  store 
}) => {
  const { items } = useItems();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemDetailsOpen, setItemDetailsOpen] = useState(false);

  if (!store) return null;

  const storeItems = items.filter(item => item.store_id === store.id);

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

  const handleViewItem = (item: Item) => {
    setSelectedItem(item);
    setItemDetailsOpen(true);
  };

  const handleEditItem = (item: Item) => {
    toast({
      title: "Edit Item",
      description: `Opening editor for ${item.name}`,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {store.name} - Items Overview
            </DialogTitle>
            <DialogDescription>
              View and manage all items in this store
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Store Summary */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{storeItems.length}</div>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {storeItems.filter(item => getItemStatus(item) === 'in-stock').length}
                </div>
                <p className="text-sm text-muted-foreground">In Stock</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {storeItems.filter(item => getItemStatus(item) === 'low-stock').length}
                </div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storeItems.map((item) => {
                const status = getItemStatus(item);
                const StatusIcon = status === 'out-of-stock' ? AlertTriangle : 
                                  status === 'low-stock' ? AlertTriangle : CheckCircle;
                
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <Badge className={`text-xs ${getStatusColor(status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="font-bold">
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
                      
                      <div className="flex gap-2 mt-3 pt-2 border-t">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleViewItem(item)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Empty State */}
            {storeItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold text-lg mb-2">No Items Found</h3>
                <p className="text-muted-foreground">
                  This store doesn't have any items yet.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ItemDetailsDialog
        open={itemDetailsOpen}
        onOpenChange={setItemDetailsOpen}
        item={selectedItem}
        onEdit={handleEditItem}
      />
    </>
  );
};

export default StoreItemsDialog;
