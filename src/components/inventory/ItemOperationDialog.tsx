import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Package, User, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ItemOperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    name: string;
    quantity: number;
    unit: string;
    store?: {
      name: string;
      store_type: string;
    } | string;
  } | null;
  operation?: 'purchase' | 'issue' | null;
}

const ItemOperationDialog: React.FC<ItemOperationDialogProps> = ({
  open,
  onOpenChange,
  item,
  operation
}) => {
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!item || !operation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate processing
    setTimeout(() => {
      const operationType = operation === 'purchase' ? 'Purchase' : 'Issue';
      const total = operation === 'purchase' ? 
        (parseFloat(unitPrice) * parseFloat(quantity)).toLocaleString() : 
        quantity;

      toast({
        title: `${operationType} Recorded`,
        description: `Successfully processed ${quantity} ${item.unit} of ${item.name}`,
      });

      onOpenChange(false);
      resetForm();
      setLoading(false);
    }, 1500);
  };

  const resetForm = () => {
    setQuantity('');
    setSupplier('');
    setRecipient('');
    setPurpose('');
    setUnitPrice('');
    setNotes('');
  };

  const operationIcon = operation === 'purchase' ? ShoppingCart : Package;
  const operationTitle = operation === 'purchase' ? 'Purchase Item' : 'Issue Item';
  const operationDescription = operation === 'purchase' ? 
    'Record new stock purchase' : 
    'Issue items from inventory';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {React.createElement(operationIcon, { className: "w-5 h-5 text-primary" })}
            {operationTitle}
          </DialogTitle>
          <DialogDescription>
            {operationDescription} for {item.name}
          </DialogDescription>
        </DialogHeader>

        {/* Item Information */}
        <div className="p-4 bg-muted/30 rounded-lg border">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Item Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Item:</span>
              <span className="font-medium ml-2">{item.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Current Stock:</span>
              <span className="font-medium ml-2">{item.quantity} {item.unit}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Store:</span>
              <span className="font-medium ml-2">{typeof item.store === 'string' ? item.store : item.store?.name || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium ml-2">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Enter quantity in ${item.unit}...`}
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <div className="p-2 bg-muted/50 rounded border text-sm">
                {item.unit}
              </div>
            </div>
          </div>

          {/* Purchase-specific fields */}
          {operation === 'purchase' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Select value={supplier} onValueChange={setSupplier} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="schoolsupply">SchoolSupply Co.</SelectItem>
                      <SelectItem value="eduequip">EduEquip Ltd.</SelectItem>
                      <SelectItem value="campus">Campus Supplies</SelectItem>
                      <SelectItem value="academic">Academic Resources Inc.</SelectItem>
                      <SelectItem value="learning">Learning Materials Ltd.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price (KSH) *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Total calculation */}
              {quantity && unitPrice && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Cost:</span>
                    <span className="text-lg font-bold text-success">
                      KSH {(parseFloat(quantity) * parseFloat(unitPrice)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Issue-specific fields */}
          {operation === 'issue' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient *</Label>
                  <Input
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Teacher/Department name..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose *</Label>
                  <Select value={purpose} onValueChange={setPurpose} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classroom">Classroom Use</SelectItem>
                      <SelectItem value="lab">Laboratory Work</SelectItem>
                      <SelectItem value="sports">Sports Activities</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="event">Special Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Availability check */}
              {quantity && parseFloat(quantity) > item.quantity && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive font-medium">
                    Insufficient stock! Available: {item.quantity} {item.unit}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          {/* Summary Section */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
            <h3 className="font-semibold text-primary mb-3">Transaction Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Date: {new Date().toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>Store: {typeof item.store === 'string' ? item.store : item.store?.name || 'Unknown'}</span>
              </div>
              {operation === 'purchase' && supplier && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Supplier: {supplier}</span>
                </div>
              )}
              {operation === 'issue' && recipient && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Recipient: {recipient}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !quantity || 
                (operation === 'purchase' && (!supplier || !unitPrice)) ||
                (operation === 'issue' && (!recipient || !purpose || parseFloat(quantity) > item.quantity))
              }
              className="min-w-32"
            >
              {loading ? 'Processing...' : 
               operation === 'purchase' ? 'Record Purchase' : 'Issue Items'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemOperationDialog;