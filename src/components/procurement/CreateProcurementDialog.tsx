import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useItems } from '@/hooks/useItems';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Send } from 'lucide-react';

interface CreateProcurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: string;
}

const CreateProcurementDialog: React.FC<CreateProcurementDialogProps> = ({ 
  open, 
  onOpenChange,
  itemId 
}) => {
  const { suppliers } = useSuppliers();
  const { items } = useItems();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    item_id: itemId || '',
    supplier_id: '',
    quantity: 1,
    unit_price: 0,
    required_date: '',
    notes: ''
  });

  const selectedItem = items.find(item => item.id === formData.item_id);
  const selectedSupplier = suppliers.find(supplier => supplier.id === formData.supplier_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item_id || !formData.supplier_id || !formData.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create procurement request using the procurements table
      const { data, error } = await supabase
        .from('procurements')
        .insert({
          item_id: formData.item_id,
          procurement_date: new Date().toISOString().split('T')[0],
          quantity: formData.quantity,
          unit_cost: formData.unit_price,
          total_cost: formData.quantity * formData.unit_price,
          supplier: selectedSupplier?.name || '',
          procured_by: profile?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Send WhatsApp message to supplier
      if (selectedSupplier && selectedItem) {
        const procurementId = String(data.id).substring(0, 8);

        const message = `🏪 PROCUREMENT REQUEST #${procurementId}

📋 Request Details:
• Item: ${selectedItem.name}
• Quantity: ${formData.quantity} ${selectedItem.unit}
• Unit Price: KSH ${formData.unit_price.toLocaleString()}
• Total Amount: KSH ${(formData.quantity * formData.unit_price).toLocaleString()}
${formData.required_date ? `• Required Date: ${new Date(formData.required_date).toLocaleDateString()}` : ''}

📝 Notes: ${formData.notes || 'None'}

📞 Requested by: ${profile?.full_name || 'Store Manager'}
🏢 From: School Store Management System

Please confirm availability and delivery timeline.
Thank you! 🙏`;

        try {
          const { error: whatsappError } = await supabase.functions.invoke('send-whatsapp-message', {
            body: {
              to: selectedSupplier.whatsapp,
              message: message
            }
          });

          if (whatsappError) {
            console.error('WhatsApp error:', whatsappError);
          }
        } catch (error) {
          console.error('Failed to send WhatsApp message:', error);
        }
      }
      
      toast({
        title: "Procurement Request Created",
        description: `Request sent to ${selectedSupplier?.name}`,
      });
      
      // Reset form
      setFormData({
        item_id: itemId || '',
        supplier_id: '',
        quantity: 1,
        unit_price: 0,
        required_date: '',
        notes: ''
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create procurement request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Create Procurement Request
          </DialogTitle>
          <DialogDescription>
            Send a procurement request to a supplier via WhatsApp
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="item_id">Item *</Label>
            <Select 
              value={formData.item_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, item_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an item" />
              </SelectTrigger>
              <SelectContent>
                {items.map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} ({item.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="supplier_id">Supplier *</Label>
            <Select 
              value={formData.supplier_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, supplier_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.filter(s => s.is_active).map(supplier => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name} - {supplier.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                min="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="unit_price">Unit Price (KSH)</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData(prev => ({ ...prev, unit_price: parseFloat(e.target.value) || 0 }))}
                min="0"
              />
            </div>
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

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special requirements or notes"
              rows={3}
            />
          </div>

          {formData.quantity > 0 && formData.unit_price > 0 && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-medium">
                Total Amount: KSH {(formData.quantity * formData.unit_price).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                'Creating...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
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

export default CreateProcurementDialog;