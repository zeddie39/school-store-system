
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useItems } from '@/hooks/useItems';
import { useStores } from '@/hooks/useStores';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Store = Database['public']['Tables']['stores']['Row'];

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStore?: Store | null;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedStore 
}) => {
  const { createItem } = useItems();
  const { stores } = useStores();
  const { suppliers } = useSuppliers();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    unit: 'pieces',
    minimum_stock: 10,
    store_id: selectedStore?.id || '',
    supplier_id: '',
    unit_price: 0,
    required_date: '',
    procurement_notes: ''
  });

  // Update store_id when selectedStore changes
  useEffect(() => {
    if (selectedStore) {
      setFormData(prev => ({ ...prev, store_id: selectedStore.id }));
    }
  }, [selectedStore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.store_id) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createItem({
        ...formData,
        added_by: profile?.id
      });
      
      toast({
        title: "Item Added",
        description: `${formData.name} has been added successfully.`,
      });
      
      // If a supplier is selected and we want to send a procurement request
      if (formData.supplier_id && formData.quantity > 0) {
        try {
          const selectedSupplier = suppliers.find(s => s.id === formData.supplier_id);
          const selectedStore = stores.find(s => s.id === formData.store_id);
          
          if (selectedSupplier && selectedStore) {
            // Send WhatsApp message to supplier
            const totalAmount = formData.quantity * formData.unit_price;
            const message = `🏪 NEW PROCUREMENT REQUEST

📋 Item Details:
• Item: ${formData.name}
• Quantity: ${formData.quantity} ${formData.unit}
• Unit Price: KSH ${formData.unit_price.toLocaleString()}
• Total Amount: KSH ${totalAmount.toLocaleString()}
• Store: ${selectedStore.name}
• Description: ${formData.description || 'N/A'}
${formData.required_date ? `• Required Date: ${new Date(formData.required_date).toLocaleDateString()}` : ''}

📝 Notes: ${formData.procurement_notes || 'None'}

📞 Contact: ${profile?.full_name || 'Store Manager'}
📧 Please confirm availability and delivery timeline.

Thank you for your service! 🙏`;

            await fetch('/api/send-whatsapp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: selectedSupplier.whatsapp,
                message: message
              })
            });
            
            toast({
              title: "Procurement Request Sent",
              description: `WhatsApp message sent to ${selectedSupplier.name}`,
            });
          }
        } catch (error) {
          console.error('Failed to send WhatsApp message:', error);
          toast({
            title: "Warning",
            description: "Item added but failed to send WhatsApp message to supplier.",
            variant: "destructive",
          });
        }
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        quantity: 0,
        unit: 'pieces',
        minimum_stock: 10,
        store_id: selectedStore?.id || '',
        supplier_id: '',
        unit_price: 0,
        required_date: '',
        procurement_notes: ''
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const units = [
    'pieces', 'kg', 'g', 'liters', 'ml', 'meters', 'cm', 'boxes', 'sets', 'pairs'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Item
          </DialogTitle>
          <DialogDescription>
            {selectedStore ? `Add item to ${selectedStore.name}` : 'Add a new item to store inventory'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter item description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="minimum_stock">Minimum Stock Level</Label>
            <Input
              id="minimum_stock"
              type="number"
              value={formData.minimum_stock}
              onChange={(e) => setFormData(prev => ({ ...prev, minimum_stock: parseInt(e.target.value) || 10 }))}
              min="0"
            />
          </div>

          {!selectedStore && (
            <div>
              <Label htmlFor="store_id">Store *</Label>
              <Select 
                value={formData.store_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, store_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map(store => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="supplier_id">Preferred Supplier</Label>
            <Select 
              value={formData.supplier_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, supplier_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier (optional)" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(supplier => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name} - {supplier.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              You can send procurement requests to this supplier via WhatsApp
            </p>
          </div>

          {/* Procurement Request Fields - Only show when supplier is selected */}
          {formData.supplier_id && (
            <div className="p-4 bg-muted/30 rounded-lg border space-y-4">
              <h3 className="font-medium text-sm">Procurement Request Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit_price">Unit Price (KSH)</Label>
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit_price: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="required_date">Required Date</Label>
                  <Input
                    id="required_date"
                    type="date"
                    value={formData.required_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, required_date: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="procurement_notes">Procurement Notes</Label>
                <Textarea
                  id="procurement_notes"
                  value={formData.procurement_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, procurement_notes: e.target.value }))}
                  placeholder="Any special requirements or notes for the supplier"
                  rows={2}
                />
              </div>

              {formData.quantity > 0 && formData.unit_price > 0 && (
                <div className="bg-success/10 p-3 rounded-lg border border-success/20">
                  <p className="text-sm font-medium">
                    Total Amount: KSH {(formData.quantity * formData.unit_price).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Adding...' : 'Add Item'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
