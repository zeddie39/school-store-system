import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Item = Database['public']['Tables']['items']['Row'];
type ItemInsert = Database['public']['Tables']['items']['Insert'];
type ItemUpdate = Database['public']['Tables']['items']['Update'];

export const useItems = (storeId?: string) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      let query = supabase
        .from('items')
        .select(`
          *,
          store:stores(name, store_type),
          added_by_profile:profiles!items_added_by_fkey(full_name)
        `)
        .order('name');

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching items",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (item: ItemInsert) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      
      await fetchItems(); // Refresh the list
      toast({
        title: "Item created",
        description: "New item has been added to the store.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating item",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateItem = async (id: string, updates: ItemUpdate) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchItems(); // Refresh the list
      toast({
        title: "Item updated",
        description: "Item has been updated successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchItems(); // Refresh the list
      toast({
        title: "Item deleted",
        description: "Item has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchItems();
  }, [storeId]);

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems
  };
};