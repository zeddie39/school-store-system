import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Package, User, MapPin, Clock, Edit2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Asset = Database['public']['Tables']['assets']['Row'];

interface AssetDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  onEdit?: (asset: Asset) => void;
}

const AssetDetailsDialog: React.FC<AssetDetailsDialogProps> = ({
  open,
  onOpenChange,
  asset,
  onEdit
}) => {
  if (!asset) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDepreciationInfo = () => {
    const purchaseDate = new Date(asset.purchase_date);
    const today = new Date();
    const yearsOwned = (today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const totalDepreciation = asset.purchase_price - asset.current_value;
    const depreciationPercentage = (totalDepreciation / asset.purchase_price) * 100;
    
    return {
      yearsOwned: yearsOwned.toFixed(1),
      totalDepreciation: formatCurrency(totalDepreciation),
      depreciationPercentage: depreciationPercentage.toFixed(1)
    };
  };

  const depreciationInfo = getDepreciationInfo();

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-success/10 text-success border-success/20';
      case 'Good': return 'bg-primary/10 text-primary border-primary/20';
      case 'Fair': return 'bg-warning/10 text-warning border-warning/20';
      case 'Needs Maintenance': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                {asset.name}
              </DialogTitle>
              <DialogDescription>
                {asset.category ? asset.category.charAt(0).toUpperCase() + asset.category.slice(1) : 'Asset'} Details
              </DialogDescription>
            </div>
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(asset)}
                className="ml-4"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Overview */}
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <h3 className="font-semibold text-primary mb-3">Asset Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price:</span>
                  <span className="font-semibold text-primary">{formatCurrency(asset.purchase_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Value:</span>
                  <span className="font-semibold text-success">{formatCurrency(asset.current_value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-semibold">{asset.quantity} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Value:</span>
                  <span className="font-semibold">{formatCurrency(asset.current_value * asset.quantity)}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Valuation Info */}
            <div className="p-4 bg-success/5 rounded-lg border border-success/10">
              <h3 className="font-semibold text-success mb-3">Kenya Valuation Standards</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Value Type:</span>
                  <Badge variant="outline" className="capitalize">
                    {(asset as any).value_type || 'depreciation'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Classification:</span>
                  <Badge variant="outline">
                    {(asset as any).classification || 'Class I'}
                  </Badge>
                </div>
                {(asset as any).decline_type && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Decline Type:</span>
                    <Badge variant="outline" className="capitalize">
                      {(asset as any).decline_type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard:</span>
                  <span className="font-medium text-sm">
                    {(asset as any).valuation_standard || 'Kenya Asset Valuation Act 2023'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IAS/IFRS:</span>
                  <span className="font-medium text-sm">
                    {(asset as any).ias_ifrs_standard || 'IAS 16'}
                  </span>
                </div>
              </div>
            </div>

            {/* Compliance Info */}
            <div className="p-4 bg-warning/5 rounded-lg border border-warning/10">
              <h3 className="font-semibold text-warning mb-3">Compliance Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">PFMA Compliant:</span>
                  <Badge variant={(asset as any).pfma_compliant ? "default" : "destructive"}>
                    {(asset as any).pfma_compliant ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Income Tax Applicable:</span>
                  <Badge variant={(asset as any).income_tax_applicable ? "outline" : "secondary"}>
                    {(asset as any).income_tax_applicable ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {(asset as any).year_of_purchase && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year of Purchase:</span>
                    <span className="font-medium">{(asset as any).year_of_purchase}</span>
                  </div>
                )}
                {(asset as any).rep_person && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Responsible Person:</span>
                    <span className="font-medium">{(asset as any).rep_person}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-3">Condition Status</h3>
              <Badge className={getConditionColor(asset.condition || 'good')}>
                {asset.condition || 'Good'}
              </Badge>
            </div>

            <div className="p-4 bg-warning/5 rounded-lg border border-warning/10">
              <h3 className="font-semibold text-warning mb-3">Depreciation Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Years Owned:</span>
                  <span className="font-medium">{depreciationInfo.yearsOwned} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Depreciation:</span>
                  <span className="font-medium text-destructive">{depreciationInfo.totalDepreciation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Depreciation %:</span>
                  <span className="font-medium">{depreciationInfo.depreciationPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Information */}
          <div className="space-y-4">
            <div className="p-4 bg-success/5 rounded-lg border border-success/10">
              <h3 className="font-semibold text-success mb-3">Purchase Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Purchased:</span>
                    <span className="font-medium ml-2">{formatDate(asset.purchase_date)}</span>
                  </span>
                </div>
                {asset.supplier && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Supplier:</span>
                      <span className="font-medium ml-2">{asset.supplier}</span>
                    </span>
                  </div>
                )}
                {asset.purchase_order_number && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">PO Number:</span>
                      <span className="font-medium ml-2">{asset.purchase_order_number}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-warning/5 rounded-lg border border-warning/10">
              <h3 className="font-semibold text-warning mb-3">Location & Details</h3>
              <div className="space-y-3">
                {asset.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium ml-2">{asset.location}</span>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Last Valuation:</span>
                    <span className="font-medium ml-2">{formatDate(asset.last_valuation_date || asset.created_at)}</span>
                  </span>
                </div>
                {asset.warranty_expiry && (
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Warranty Expires:</span>
                      <span className="font-medium ml-2">{formatDate(asset.warranty_expiry)}</span>
                    </span>
                  </div>
                )}
                {asset.serial_number && (
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Serial Number:</span>
                      <span className="font-medium ml-2">{asset.serial_number}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Asset Description */}
        {asset.description && (
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-sm text-muted-foreground">{asset.description}</p>
          </div>
        )}

        {/* Asset History */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <h3 className="font-semibold text-primary mb-3">Asset History</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-primary/10">
              <span>Asset Created</span>
              <span className="text-muted-foreground">{formatDate(asset.created_at)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-primary/10">
              <span>Last Updated</span>
              <span className="text-muted-foreground">{formatDate(asset.updated_at)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Depreciation Rate</span>
              <span className="text-muted-foreground">{asset.depreciation_rate || 'Auto'}%</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetDetailsDialog;