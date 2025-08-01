import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useToast } from '@/hooks/use-toast';
import { Edit } from 'lucide-react';
// Define Supplier type manually
interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  whatsapp: string;
  email?: string;
  address?: string;
  category?: string;
  rating?: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface EditSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
}

const EditSupplierDialog: React.FC<EditSupplierDialogProps> = ({ 
  open, 
  onOpenChange,
  supplier 
}) => {
  const { updateSupplier } = useSuppliers();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    category: '',
    rating: 5.0,
    notes: ''
  });

  const categories = [
    'Stationery & Office Supplies',
    'Food & Catering',
    'Technology & Electronics',
    'Maintenance & Repairs',
    'Construction & Building',
    'Furniture & Equipment',
    'Transport & Logistics',
    'Other'
  ];

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        contact_person: supplier.contact_person || '',
        phone: supplier.phone || '',
        whatsapp: supplier.whatsapp || '',
        email: supplier.email || '',
        address: supplier.address || '',
        category: supplier.category || '',
        rating: supplier.rating || 5.0,
        notes: supplier.notes || ''
      });
    }
  }, [supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplier || !formData.name || !formData.whatsapp) {
      toast({
        title: "Validation Error",
        description: "Please provide supplier name and WhatsApp number.",
        variant: "destructive",
      });
      return;
    }

    // Validate WhatsApp number format
    const whatsappPattern = /^\+?[1-9]\d{1,14}$/;
    if (!whatsappPattern.test(formData.whatsapp.replace(/\s/g, ''))) {
      toast({
        title: "Invalid WhatsApp Number",
        description: "Please enter a valid WhatsApp number with country code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateSupplier(supplier.id, {
        ...formData,
        whatsapp: formData.whatsapp.replace(/\s/g, '') // Remove spaces
      });
      
      onOpenChange(false);
    } catch (error) {
      // Error already handled in useSuppliers
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Supplier
          </DialogTitle>
          <DialogDescription>
            Update supplier information and contact details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Supplier Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter supplier name"
                required
              />
            </div>

            <div>
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                placeholder="Contact person name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number *</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="+254712345678"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include country code (e.g., +254 for Kenya)
              </p>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Optional alternative phone"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="supplier@example.com"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select supplier category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Physical address or location"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Select 
              value={formData.rating.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, rating: parseFloat(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">⭐ 1 Star</SelectItem>
                <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this supplier"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Updating Supplier...' : 'Update Supplier'}
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

export default EditSupplierDialog;