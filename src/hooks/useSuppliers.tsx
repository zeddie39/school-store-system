import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define types for suppliers
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
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSuppliers((data as unknown as Supplier[]) || []);
      toast({
        title: "Suppliers loaded",
        description: `${data?.length || 0} suppliers loaded from database.`,
      });
    } catch (error: any) {
      console.error('Error fetching suppliers:', error);
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
      const { data, error } = await (supabase as any)
        .from('suppliers')
        .insert([supplier])
        .select()
        .single();

      if (error) throw error;

      const newSupplier = data as Supplier;
      setSuppliers(prev => [newSupplier, ...prev]);
      toast({
        title: "Supplier created",
        description: "New supplier has been added successfully.",
      });
      
      return newSupplier;
    } catch (error: any) {
      console.error('Error creating supplier:', error);
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
      const { data, error } = await (supabase as any)
        .from('suppliers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedSupplier = data as Supplier;
      setSuppliers(prev => prev.map(s => 
        s.id === id ? updatedSupplier : s
      ));
      
      toast({
        title: "Supplier updated",
        description: "Supplier has been updated successfully.",
      });
      
      return updatedSupplier;
    } catch (error: any) {
      console.error('Error updating supplier:', error);
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
      const { error } = await (supabase as any)
        .from('suppliers')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setSuppliers(prev => prev.map(s => 
        s.id === id ? { ...s, is_active: false } : s
      ));
      
      toast({
        title: "Supplier deactivated",
        description: "Supplier has been deactivated successfully.",
      });
    } catch (error: any) {
      console.error('Error deactivating supplier:', error);
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