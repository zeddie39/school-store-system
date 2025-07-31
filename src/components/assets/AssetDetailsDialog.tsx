import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Package, User, MapPin, Clock } from 'lucide-react';

interface AssetDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: {
    name: string;
    value: string;
    count: number;
  } | null;
}

const AssetDetailsDialog: React.FC<AssetDetailsDialogProps> = ({
  open,
  onOpenChange,
  asset
}) => {
  if (!asset) return null;

  // Generate mock detailed data for the asset
  const generateAssetDetails = (assetName: string) => {
    const baseDate = new Date();
    const purchaseDate = new Date(baseDate.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    
    const suppliers = ['SchoolSupply Co.', 'EduEquip Ltd.', 'Campus Supplies', 'Academic Resources Inc.', 'Learning Materials Ltd.'];
    const locations = ['Main Store', 'Department A', 'Department B', 'Storage Room 1', 'Storage Room 2'];
    const conditions = ['Excellent', 'Good', 'Fair', 'Needs Maintenance'];
    
    return {
      purchaseDate: purchaseDate.toLocaleDateString(),
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      unitPrice: Math.floor(Math.random() * 5000) + 500,
      warranty: Math.floor(Math.random() * 36) + 12, // 12-48 months
      lastMaintenance: new Date(baseDate.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      purchaseOrder: `PO-${Math.floor(Math.random() * 90000) + 10000}`,
      serialNumbers: Array.from({ length: Math.min(asset.count, 3) }, () => 
        `SN${Math.floor(Math.random() * 900000) + 100000}`
      )
    };
  };

  const details = generateAssetDetails(asset.name);

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
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            {asset.name} Details
          </DialogTitle>
          <DialogDescription>
            Comprehensive information about this asset category
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Overview */}
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <h3 className="font-semibold text-primary mb-3">Asset Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Value:</span>
                  <span className="font-semibold text-primary">{asset.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Count:</span>
                  <span className="font-semibold">{asset.count} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Unit Price:</span>
                  <span className="font-semibold">KSH {details.unitPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-3">Condition Status</h3>
              <Badge className={getConditionColor(details.condition)}>
                {details.condition}
              </Badge>
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
                    <span className="font-medium ml-2">{details.purchaseDate}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Supplier:</span>
                    <span className="font-medium ml-2">{details.supplier}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">PO Number:</span>
                    <span className="font-medium ml-2">{details.purchaseOrder}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-warning/5 rounded-lg border border-warning/10">
              <h3 className="font-semibold text-warning mb-3">Location & Maintenance</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium ml-2">{details.location}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Last Maintenance:</span>
                    <span className="font-medium ml-2">{details.lastMaintenance}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Warranty:</span>
                    <span className="font-medium ml-2">{details.warranty} months</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Serial Numbers (if applicable) */}
        {details.serialNumbers.length > 0 && (
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <h3 className="font-semibold mb-3">Recent Serial Numbers</h3>
            <div className="flex flex-wrap gap-2">
              {details.serialNumbers.map((serial, index) => (
                <Badge key={index} variant="outline" className="font-mono">
                  {serial}
                </Badge>
              ))}
              {asset.count > 3 && (
                <Badge variant="secondary">
                  +{asset.count - 3} more items
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <h3 className="font-semibold text-primary mb-3">Recent Transaction History</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-primary/10">
              <span>Purchase Order {details.purchaseOrder}</span>
              <span className="text-success">+{asset.count} items</span>
            </div>
            <div className="flex justify-between py-2 border-b border-primary/10">
              <span>Inventory Check - {details.lastMaintenance}</span>
              <span className="text-muted-foreground">Verified</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Condition Assessment</span>
              <Badge className={getConditionColor(details.condition)} variant="outline">
                {details.condition}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetDetailsDialog;