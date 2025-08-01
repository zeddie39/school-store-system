import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define types manually since the database types need to be regenerated
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

interface SupplierInsert {
  name: string;
  contact_person?: string;
  phone?: string;
  whatsapp: string;
  email?: string;
  address?: string;
  category?: string;
  rating?: number;
  notes?: string;
}

interface SupplierUpdate {
  name?: string;
  contact_person?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  category?: string;
  rating?: number;
  is_active?: boolean;
  notes?: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSuppliers = async () => {
    try {
      // Mock data for demonstration - will be replaced with real data once types are updated
      const mockSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'Tech Solutions Kenya',
          contact_person: 'John Kamau',
          phone: '+254712345678',
          whatsapp: '+254712345678',
          email: 'john@techsolutions.co.ke',
          address: 'Westlands, Nairobi',
          category: 'Technology & Electronics',
          rating: 4.5,
          is_active: true,
          notes: 'Reliable supplier for computer equipment',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Office Plus Supplies',
          contact_person: 'Mary Wanjiku',
          phone: '+254722334455',
          whatsapp: '+254722334455',
          email: 'mary@officeplus.co.ke',
          address: 'CBD, Nairobi',
          category: 'Stationery & Office Supplies',
          rating: 4.2,
          is_active: true,
          notes: 'Best prices for office stationery',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setSuppliers(mockSuppliers);
      toast({
        title: "Suppliers loaded",
        description: "Demo suppliers loaded. Database integration pending.",
      });
    } catch (error: any) {
      toast({
        title: "Error fetching suppliers",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplier: SupplierInsert) => {
    try {
      const newSupplier: Supplier = {
        ...supplier,
        id: Math.random().toString(36).substr(2, 9),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setSuppliers(prev => [...prev, newSupplier]);
      toast({
        title: "Supplier created",
        description: "New supplier has been added successfully.",
      });
      
      return newSupplier;
    } catch (error: any) {
      toast({
        title: "Error creating supplier",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSupplier = async (id: string, updates: SupplierUpdate) => {
    try {
      setSuppliers(prev => prev.map(s => 
        s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
      ));
      
      toast({
        title: "Supplier updated",
        description: "Supplier has been updated successfully.",
      });
      
      return { id, ...updates };
    } catch (error: any) {
      toast({
        title: "Error updating supplier",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      setSuppliers(prev => prev.map(s => 
        s.id === id ? { ...s, is_active: false, updated_at: new Date().toISOString() } : s
      ));
      
      toast({
        title: "Supplier deactivated",
        description: "Supplier has been deactivated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deactivating supplier",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: fetchSuppliers
  };
};