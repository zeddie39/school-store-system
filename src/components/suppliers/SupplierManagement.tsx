import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, MessageCircle, Star, Phone } from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useAuth } from '@/hooks/useAuth';
import AddSupplierDialog from './AddSupplierDialog';
import EditSupplierDialog from './EditSupplierDialog';
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

const SupplierManagement: React.FC = () => {
  const { suppliers, loading, deleteSupplier } = useSuppliers();
  const { profile } = useAuth();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const isAdmin = profile?.role === 'admin';

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setEditDialogOpen(true);
  };

  const handleDelete = async (supplierId: string) => {
    if (confirm('Are you sure you want to deactivate this supplier?')) {
      await deleteSupplier(supplierId);
    }
  };

  const openWhatsApp = (whatsapp: string) => {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
  };

  const formatRating = (rating: number | null) => {
    if (!rating) return 'No rating';
    return Array(Math.floor(rating)).fill('⭐').join('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Supplier Management</h2>
          <p className="text-muted-foreground">
            Manage suppliers and their contact information
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  {supplier.contact_person && (
                    <CardDescription>
                      Contact: {supplier.contact_person}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    {formatRating(supplier.rating)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                {supplier.whatsapp && (
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4 text-success" />
                    <span>{supplier.whatsapp}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openWhatsApp(supplier.whatsapp)}
                      className="p-1 h-auto"
                    >
                      Open
                    </Button>
                  </div>
                )}
                {supplier.email && (
                  <div className="text-sm text-muted-foreground">
                    📧 {supplier.email}
                  </div>
                )}
              </div>

              {supplier.category && (
                <Badge variant="outline" className="text-xs">
                  {supplier.category}
                </Badge>
              )}

              {supplier.address && (
                <p className="text-sm text-muted-foreground">
                  📍 {supplier.address}
                </p>
              )}

              {supplier.notes && (
                <p className="text-sm text-muted-foreground">
                  📝 {supplier.notes}
                </p>
              )}

              {isAdmin && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(supplier)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(supplier.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {suppliers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-4 opacity-50">👥</div>
          <h3 className="font-semibold text-lg mb-2">No Suppliers Found</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding your first supplier to manage procurement.
          </p>
          {isAdmin && (
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Supplier
            </Button>
          )}
        </div>
      )}

      {/* Dialogs */}
      <AddSupplierDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />

      <EditSupplierDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        supplier={selectedSupplier}
      />
    </div>
  );
};

export default SupplierManagement;