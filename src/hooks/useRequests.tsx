import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import type { Database } from '@/integrations/supabase/types';

type StockRequest = Database['public']['Tables']['stock_requests']['Row'];
type StockRequestInsert = Database['public']['Tables']['stock_requests']['Insert'];
type StockRequestUpdate = Database['public']['Tables']['stock_requests']['Update'];
type RequestType = Database['public']['Enums']['request_type'];

export const useRequests = () => {
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('stock_requests')
        .select(`
          *,
          item:items(name, unit),
          requested_by_profile:profiles!stock_requests_requested_by_fkey(full_name),
          approved_by_profile:profiles!stock_requests_approved_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: {
    item_id: string;
    quantity: number;
    request_type: RequestType;
    reason: string;
  }) => {
    if (!user?.id) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase
        .from('stock_requests')
        .insert({
          ...requestData,
          requested_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchRequests(); // Refresh the list
      toast({
        title: "Request created",
        description: "Your stock request has been submitted for approval.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating request",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateRequest = async (id: string, updates: StockRequestUpdate) => {
    try {
      const { data, error } = await supabase
        .from('stock_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchRequests(); // Refresh the list
      toast({
        title: "Request updated",
        description: "Request has been updated successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating request",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const approveRequest = async (id: string, comments?: string) => {
    try {
      const { error } = await supabase
        .from('stock_requests')
        .update({
          status: 'approved',
          approved_by: user!.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Create approval record
      const { error: approvalError } = await supabase
        .from('approvals')
        .insert({
          request_id: id,
          status: 'approved',
          comments,
          approved_by: user!.id
        });

      if (approvalError) throw approvalError;
      
      await fetchRequests(); // Refresh the list
      toast({
        title: "Request approved",
        description: "Request has been approved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error approving request",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const rejectRequest = async (id: string, comments?: string) => {
    try {
      const { error } = await supabase
        .from('stock_requests')
        .update({
          status: 'rejected',
          approved_by: user!.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Create approval record
      const { error: approvalError } = await supabase
        .from('approvals')
        .insert({
          request_id: id,
          status: 'rejected',
          comments,
          approved_by: user!.id
        });

      if (approvalError) throw approvalError;
      
      await fetchRequests(); // Refresh the list
      toast({
        title: "Request rejected",
        description: "Request has been rejected.",
      });
    } catch (error: any) {
      toast({
        title: "Error rejecting request",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  return {
    requests,
    loading,
    createRequest,
    updateRequest,
    approveRequest,
    rejectRequest,
    refetch: fetchRequests
  };
};