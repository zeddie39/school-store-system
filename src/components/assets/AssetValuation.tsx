import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Package, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import { useAuth } from '@/hooks/useAuth';
import AssetDetailsDialog from './AssetDetailsDialog';
import AddAssetDialog from './AddAssetDialog';
import EditAssetDialog from './EditAssetDialog';
import type { Database } from '@/integrations/supabase/types';

type Asset = Database['public']['Tables']['assets']['Row'];

const AssetValuation: React.FC = () => {
  const { assets, loading } = useAssets();
  const { profile } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAssetSummary = () => {
    const totalAssets = assets.length;
    const totalValue = assets.reduce((sum, asset) => sum + (asset.current_value * asset.quantity), 0);
    const totalPurchaseValue = assets.reduce((sum, asset) => sum + (asset.purchase_price * asset.quantity), 0);
    const totalDepreciation = totalPurchaseValue - totalValue;
    const depreciationPercentage = totalPurchaseValue > 0 ? (totalDepreciation / totalPurchaseValue) * 100 : 0;

    // Group by category
    const categoryTotals = assets.reduce((acc, asset) => {
      const category = asset.category;
      const value = asset.current_value * asset.quantity;
      const count = asset.quantity;
      
      if (!acc[category]) {
        acc[category] = { value: 0, count: 0 };
      }
      acc[category].value += value;
      acc[category].count += count;
      
      return acc;
    }, {} as Record<string, { value: number; count: number }>);

    return {
      totalAssets,
      totalValue,
      totalPurchaseValue,
      totalDepreciation,
      depreciationPercentage,
      categoryTotals
    };
  };

  const summary = getAssetSummary();

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailsDialogOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vehicles': return '🚗';
      case 'land': return '🏞️';
      case 'textbooks': return '📚';
      case 'equipment': return '⚙️';
      case 'buildings': return '🏢';
      case 'furniture': return '🪑';
      default: return '📦';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-success/10 text-success border-success/20';
      case 'good': return 'bg-primary/10 text-primary border-primary/20';
      case 'fair': return 'bg-warning/10 text-warning border-warning/20';
      case 'poor': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{summary.totalAssets}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(summary.totalValue)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Purchase Value</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {formatCurrency(summary.totalPurchaseValue)}
                </p>
              </div>
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Depreciation</p>
                <p className="text-2xl font-bold text-destructive">
                  {summary.depreciationPercentage.toFixed(1)}%
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Asset Categories</CardTitle>
              <CardDescription>Summary by asset category</CardDescription>
            </div>
            {profile?.role === 'admin' && (
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(summary.categoryTotals).map(([category, data]) => (
              <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(category)}</span>
                      <h3 className="font-semibold capitalize">{category}</h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Value:</span>
                      <span className="font-semibold">{formatCurrency(data.value)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Count:</span>
                      <span className="font-semibold">{data.count} items</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Assets</CardTitle>
          <CardDescription>Detailed view of all assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 font-semibold">Asset Name</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Purchase Price</th>
                  <th className="pb-3 font-semibold">Current Value</th>
                  <th className="pb-3 font-semibold">Condition</th>
                  <th className="pb-3 font-semibold">Quantity</th>
                  <th className="pb-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-b hover:bg-muted/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span>{getCategoryIcon(asset.category)}</span>
                        <span className="font-medium">{asset.name}</span>
                      </div>
                    </td>
                    <td className="py-3 capitalize">{asset.category}</td>
                    <td className="py-3">{formatCurrency(asset.purchase_price)}</td>
                    <td className="py-3 text-success font-semibold">
                      {formatCurrency(asset.current_value)}
                    </td>
                    <td className="py-3">
                      <Badge className={getConditionColor(asset.condition || 'good')}>
                        {asset.condition || 'Good'}
                      </Badge>
                    </td>
                    <td className="py-3">{asset.quantity}</td>
                    <td className="py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAssetClick(asset)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {assets.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold text-lg mb-2">No Assets Found</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first asset to track its valuation.
                </p>
                {profile?.role === 'admin' && (
                  <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Asset
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AssetDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        asset={selectedAsset}
        onEdit={profile?.role === 'admin' ? (asset) => {
          setSelectedAsset(asset);
          setEditDialogOpen(true);
        } : undefined}
      />

      <AddAssetDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />

      <EditAssetDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        asset={selectedAsset}
      />
    </div>
  );
};

export default AssetValuation;