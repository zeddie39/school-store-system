
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, Trash2, MapPin, Calendar } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Store = Database['public']['Tables']['stores']['Row'];
type StoreType = Database['public']['Enums']['store_type'];

interface StoreManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store | null;
}

const StoreManagementDialog: React.FC<StoreManagementDialogProps> = ({ 
  open, 
  onOpenChange, 
  store 
}) => {
  const { updateStore, deleteStore } = useStores();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: store?.name || '',
    description: store?.description || '',
    location: store?.location || '',
    store_type: store?.store_type || ('general' as StoreType)
  });

  React.useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || '',
        description: store.description || '',
        location: store.location || '',
        store_type: store.store_type || ('general' as StoreType)
      });
    }
  }, [store]);

  if (!store) return null;

  const storeTypes: { value: StoreType; label: string }[] = [
    { value: 'library', label: 'Library' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'sports', label: 'Sports' },
    { value: 'ict_lab', label: 'ICT Lab' },
    { value: 'boarding', label: 'Boarding' },
    { value: 'examination', label: 'Examination' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'general', label: 'General' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateStore(store.id, formData);
      toast({
        title: "Store Updated",
        description: "Store details have been updated successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update store details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${store.name}? This action cannot be undone.`)) {
      setIsLoading(true);
      try {
        await deleteStore(store.id);
        toast({
          title: "Store Deleted",
          description: `${store.name} has been deleted successfully.`,
        });
        onOpenChange(false);
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete store.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Manage Store - {store.name}
          </DialogTitle>
          <DialogDescription>
            Update store information and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Store Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Store Information</CardTitle>
              <CardDescription>Basic store details and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter store name"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter store location"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="store_type">Store Type</Label>
                <Select 
                  value={formData.store_type} 
                  onValueChange={(value: StoreType) => setFormData(prev => ({ ...prev, store_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select store type" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter store description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Store Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Store Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(store.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <Badge variant="outline" className="text-xs">
                      {store.store_type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Store
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreManagementDialog;
