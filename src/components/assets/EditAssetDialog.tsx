import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAssets } from '@/hooks/useAssets';
import { useToast } from '@/hooks/use-toast';
import { Package } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Asset = Database['public']['Tables']['assets']['Row'];

interface EditAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}

const EditAssetDialog: React.FC<EditAssetDialogProps> = ({ 
  open, 
  onOpenChange,
  asset
}) => {
  const { updateAsset } = useAssets();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    purchase_date: '',
    purchase_price: 0,
    quantity: 1,
    location: '',
    supplier: '',
    purchase_order_number: '',
    condition: 'good',
    warranty_expiry: '',
    serial_number: '',
    depreciation_rate: 0,
    value_type: 'depreciation',
    decline_type: '',
    classification: 'Class I',
    year_of_purchase: new Date().getFullYear(),
    rep_person: '',
    income_tax_applicable: false,
    pfma_compliant: true,
    ias_ifrs_standard: 'IAS 16',
    valuation_standard: 'Kenya Asset Valuation Act 2023'
  });

  // Populate form when asset changes
  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        category: asset.category || '',
        description: asset.description || '',
        purchase_date: asset.purchase_date || '',
        purchase_price: asset.purchase_price || 0,
        quantity: asset.quantity || 1,
        location: asset.location || '',
        supplier: asset.supplier || '',
        purchase_order_number: asset.purchase_order_number || '',
        condition: asset.condition || 'good',
        warranty_expiry: asset.warranty_expiry || '',
        serial_number: asset.serial_number || '',
        depreciation_rate: asset.depreciation_rate || 0,
        value_type: (asset as any).value_type || 'depreciation',
        decline_type: (asset as any).decline_type || '',
        classification: (asset as any).classification || 'Class I',
        year_of_purchase: (asset as any).year_of_purchase || new Date().getFullYear(),
        rep_person: (asset as any).rep_person || '',
        income_tax_applicable: (asset as any).income_tax_applicable || false,
        pfma_compliant: (asset as any).pfma_compliant !== false,
        ias_ifrs_standard: (asset as any).ias_ifrs_standard || 'IAS 16',
        valuation_standard: (asset as any).valuation_standard || 'Kenya Asset Valuation Act 2023'
      });
    }
  }, [asset]);

  const categories = [
    { value: 'land', label: 'Land' },
    { value: 'vehicles', label: 'Vehicles (Cars/Buses)' },
    { value: 'textbooks', label: 'Textbooks' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'buildings', label: 'Buildings' },
    { value: 'furniture', label: 'Furniture' }
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!asset || !formData.name || !formData.category || !formData.purchase_date || !formData.purchase_price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateAsset(asset.id, formData);
      onOpenChange(false);
    } catch (error) {
      // Error already handled in useAssets
    } finally {
      setIsLoading(false);
    }
  };

  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Edit Asset: {asset.name}
          </DialogTitle>
          <DialogDescription>
            Update asset details with automatic Kenya valuation standards
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter asset name"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter asset description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchase_date">Purchase Date *</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="purchase_price">Purchase Price (KSH) *</Label>
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: parseFloat(e.target.value) || 0 }))}
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map(cond => (
                    <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Asset location"
              />
            </div>

            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                placeholder="Supplier name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="classification">Classification</Label>
              <Select 
                value={formData.classification} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, classification: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Class I">Class I</SelectItem>
                  <SelectItem value="Class II">Class II</SelectItem>
                  <SelectItem value="Class III">Class III</SelectItem>
                  <SelectItem value="Class IV">Class IV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="value_type">Value Type</Label>
              <Select 
                value={formData.value_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, value_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="depreciation">Depreciation</SelectItem>
                  <SelectItem value="appreciation">Appreciation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.value_type === 'depreciation' && (
            <div>
              <Label htmlFor="decline_type">Decline Type</Label>
              <Select 
                value={formData.decline_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, decline_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select decline type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="industrial_building_decline">Industrial Building Decline</SelectItem>
                  <SelectItem value="investment_decline">Investment Decline</SelectItem>
                  <SelectItem value="wear_and_tear">Wear and Tear</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year_of_purchase">Year of Purchase</Label>
              <Input
                id="year_of_purchase"
                type="number"
                value={formData.year_of_purchase}
                onChange={(e) => setFormData(prev => ({ ...prev, year_of_purchase: parseInt(e.target.value) || new Date().getFullYear() }))}
                min="1990"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <Label htmlFor="rep_person">Responsible Person</Label>
              <Input
                id="rep_person"
                value={formData.rep_person}
                onChange={(e) => setFormData(prev => ({ ...prev, rep_person: e.target.value }))}
                placeholder="Person responsible for this asset"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Compliance & Standards</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="income_tax_applicable"
                  checked={formData.income_tax_applicable}
                  onChange={(e) => setFormData(prev => ({ ...prev, income_tax_applicable: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="income_tax_applicable" className="text-sm">
                  Income Tax Applicable
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pfma_compliant"
                  checked={formData.pfma_compliant}
                  onChange={(e) => setFormData(prev => ({ ...prev, pfma_compliant: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="pfma_compliant" className="text-sm">
                  PFMA Compliant
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="ias_ifrs_standard">IAS/IFRS Standard</Label>
              <Select 
                value={formData.ias_ifrs_standard} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, ias_ifrs_standard: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IAS 16">IAS 16 - Property, Plant and Equipment</SelectItem>
                  <SelectItem value="IAS 40">IAS 40 - Investment Property</SelectItem>
                  <SelectItem value="IFRS 16">IFRS 16 - Leases</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valuation_standard">Valuation Standard</Label>
              <Select 
                value={formData.valuation_standard} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, valuation_standard: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kenya Asset Valuation Act 2023">Kenya Asset Valuation Act 2023</SelectItem>
                  <SelectItem value="International Valuation Standards">International Valuation Standards</SelectItem>
                  <SelectItem value="RICS Valuation Standards">RICS Valuation Standards</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Current Value Information:</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Current value will be automatically recalculated based on Kenya Asset Valuation Act 2023 standards.
            </p>
            <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
              <div>• Purchase Price: KSH {formData.purchase_price.toLocaleString()}</div>
              <div>• Value will update automatically on save</div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Updating Asset...' : 'Update Asset'}
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

export default EditAssetDialog;