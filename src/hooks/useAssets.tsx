import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Asset = Database['public']['Tables']['assets']['Row'];
type AssetInsert = Database['public']['Tables']['assets']['Insert'];
type AssetUpdate = Database['public']['Tables']['assets']['Update'];

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching assets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAsset = async (asset: AssetInsert) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert(asset)
        .select()
        .single();

      if (error) throw error;
      
      await fetchAssets(); // Refresh the list
      toast({
        title: "Asset created",
        description: "New asset has been added successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating asset",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateAsset = async (id: string, updates: AssetUpdate) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchAssets(); // Refresh the list
      toast({
        title: "Asset updated",
        description: "Asset has been updated successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating asset",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchAssets(); // Refresh the list
      toast({
        title: "Asset deleted",
        description: "Asset has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting asset",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    assets,
    loading,
    createAsset,
    updateAsset,
    deleteAsset,
    refetch: fetchAssets
  };
};