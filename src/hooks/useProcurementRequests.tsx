import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define types manually since they don't exist in the database types yet
interface ProcurementRequest {
  id: string;
  item_id: string;
  supplier_id: string;
  quantity: number;
  unit_price?: number;
  total_amount?: number;
  required_date?: string;
  notes?: string;
  whatsapp_sent: boolean;
  whatsapp_sent_at?: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  item?: {
    name: string;
    unit: string;
  };
  supplier?: {
    name: string;
    whatsapp: string;
    contact_person?: string;
  };
}

interface ProcurementRequestInsert {
  item_id: string;
  supplier_id: string;
  quantity: number;
  unit_price?: number;
  total_amount?: number;
  required_date?: string;
  notes?: string;
  created_by: string;
}

interface ProcurementRequestUpdate {
  quantity?: number;
  unit_price?: number;
  total_amount?: number;
  required_date?: string;
  notes?: string;
  whatsapp_sent?: boolean;
  whatsapp_sent_at?: string;
  status?: string;
}

export const useProcurementRequests = () => {
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      // Use procurements table for now - this is the actual table in DB
      const { data, error } = await supabase
        .from('procurements')
        .select(`
          *,
          item:items(name, unit)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform to match our interface
      const transformedData = data?.map(item => ({
        id: item.id,
        item_id: item.item_id,
        supplier_id: 'temp-supplier',
        quantity: item.quantity,
        unit_price: item.unit_cost,
        total_amount: item.total_cost,
        required_date: item.procurement_date,
        notes: `Procurement by ${item.supplier || 'Unknown'}`,
        whatsapp_sent: false,
        status: 'completed',
        created_by: item.procured_by,
        created_at: item.created_at,
        updated_at: item.updated_at,
        item: item.item,
        supplier: {
          name: item.supplier || 'Unknown',
          whatsapp: '+254700000000',
          contact_person: 'N/A'
        }
      })) || [];
      
      setRequests(transformedData);
    } catch (error: any) {
      toast({
        title: "Error fetching procurement requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (request: ProcurementRequestInsert) => {
    try {
      // Create as procurement record for now
      const { data, error } = await supabase
        .from('procurements')
        .insert({
          item_id: request.item_id,
          procured_by: request.created_by,
          quantity: request.quantity,
          unit_cost: request.unit_price,
          total_cost: request.total_amount,
          supplier: 'TBD',
          procurement_date: request.required_date
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchRequests(); // Refresh the list
      toast({
        title: "Procurement request created",
        description: "New procurement request has been created.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating procurement request",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateRequest = async (id: string, updates: ProcurementRequestUpdate) => {
    try {
      const { data, error } = await supabase
        .from('procurements')
        .update({
          quantity: updates.quantity,
          unit_cost: updates.unit_price,
          total_cost: updates.total_amount
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchRequests(); // Refresh the list
      toast({
        title: "Procurement request updated",
        description: "Request has been updated successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating procurement request",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendWhatsAppMessage = async (requestId: string) => {
    try {
      // Call edge function to send WhatsApp message
      const { data, error } = await supabase.functions.invoke('send-whatsapp-message', {
        body: { requestId }
      });

      if (error) throw error;

      // Update request to mark as sent
      await updateRequest(requestId, {
        whatsapp_sent: true,
        whatsapp_sent_at: new Date().toISOString()
      });

      toast({
        title: "WhatsApp message sent",
        description: "Procurement request has been sent to supplier via WhatsApp.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error sending WhatsApp message",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    createRequest,
    updateRequest,
    sendWhatsAppMessage,
    refetch: fetchRequests
  };
};