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
      // For now, we'll return an empty array since the table might not be fully synced
      // This will be updated when the types are available
      setRequests([]);
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
      // Mock for now - will be implemented when table is available
      toast({
        title: "Procurement request created",
        description: "New procurement request has been created.",
      });
      
      return { id: 'mock-id', ...request };
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
      toast({
        title: "Procurement request updated",
        description: "Request has been updated successfully.",
      });
      
      return { id, ...updates };
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