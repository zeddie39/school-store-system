import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Package, AlertTriangle, CheckCircle, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ItemOperationDialog from '../inventory/ItemOperationDialog';
import type { Database } from '@/integrations/supabase/types';

type Item = Database['public']['Tables']['items']['Row'] & {
  store?: {
    name: string;
    store_type: string;
  };
  added_by_profile?: {
    full_name: string;
  };
};

interface ItemDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onEdit?: (item: Item) => void;
}

const ItemDetailsDialog: React.FC<ItemDetailsDialogProps> = ({
  open,
  onOpenChange,
  item,
  onEdit
}) => {
  const { toast } = useToast();
  const [operationDialogOpen, setOperationDialogOpen] = useState(false);

  if (!item) return null;

  const getItemStatus = () => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const status = getItemStatus();
  const StatusIcon = status === 'out-of-stock' ? AlertTriangle : 
                    status === 'low-stock' ? AlertTriangle : CheckCircle;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  {item.name}
                </DialogTitle>
                <DialogDescription>
                  Item details and inventory information
                </DialogDescription>
              </div>
              {onEdit && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEdit(item)}
                  className="ml-4"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Overview */}
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h3 className="font-semibold text-primary mb-3">Stock Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Stock:</span>
                    <span className="font-semibold text-primary">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Stock:</span>
                    <span className="font-semibold">
                      {item.minimum_stock || 10} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unit:</span>
                    <span className="font-semibold capitalize">{item.unit}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                <h3 className="font-semibold text-success mb-3">Store Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Store:</span>
                    <span className="font-semibold">{item.store?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-semibold capitalize">
                      {item.store?.store_type?.replace('_', ' ') || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 rounded-lg">
                <h3 className="font-semibold mb-3">Item Details</h3>
                <div className="space-y-3">
                  {item.description && (
                    <div>
                      <span className="text-muted-foreground text-sm">Description:</span>
                      <p className="text-sm mt-1">{item.description}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Added:</span>
                      <span className="font-medium ml-2">{formatDate(item.created_at)}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium ml-2">{formatDate(item.updated_at)}</span>
                    </span>
                  </div>
                  {item.added_by_profile?.full_name && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="text-muted-foreground">Added by:</span>
                        <span className="font-medium ml-2">{item.added_by_profile.full_name}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-warning/5 rounded-lg border border-warning/10">
                <h3 className="font-semibold text-warning mb-3">Stock Actions</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setOperationDialogOpen(true)}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Issue/Receive Stock
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Record stock movements for this item
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Level Warning */}
          {(status === 'low-stock' || status === 'out-of-stock') && (
            <div className="mt-6 p-4 bg-destructive/5 rounded-lg border border-destructive/10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-semibold text-destructive">
                  {status === 'out-of-stock' ? 'Stock Alert: Out of Stock' : 'Stock Alert: Low Stock'}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {status === 'out-of-stock' 
                  ? 'This item is completely out of stock. Consider restocking immediately.'
                  : `Stock level is below minimum threshold of ${item.minimum_stock || 10} ${item.unit}. Consider restocking soon.`
                }
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ItemOperationDialog
        open={operationDialogOpen}
        onOpenChange={setOperationDialogOpen}
        item={item}
      />
    </>
  );
};

export default ItemDetailsDialog;