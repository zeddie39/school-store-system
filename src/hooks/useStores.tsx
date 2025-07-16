import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Store = Database['public']['Tables']['stores']['Row'];
type StoreInsert = Database['public']['Tables']['stores']['Insert'];
type StoreUpdate = Database['public']['Tables']['stores']['Update'];

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          manager:profiles(full_name)
        `)
        .order('name');

      if (error) throw error;
      setStores(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching stores",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStore = async (store: StoreInsert) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .insert(store)
        .select()
        .single();

      if (error) throw error;
      
      await fetchStores(); // Refresh the list
      toast({
        title: "Store created",
        description: "New store has been created successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating store",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStore = async (id: string, updates: StoreUpdate) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchStores(); // Refresh the list
      toast({
        title: "Store updated",
        description: "Store has been updated successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating store",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteStore = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchStores(); // Refresh the list
      toast({
        title: "Store deleted",
        description: "Store has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting store",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return {
    stores,
    loading,
    createStore,
    updateStore,
    deleteStore,
    refetch: fetchStores
  };
};