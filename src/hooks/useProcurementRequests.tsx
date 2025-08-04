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
      // Mock data until types are synced
      const mockRequests: ProcurementRequest[] = [
        {
          id: '1',
          item_id: 'item-1',
          supplier_id: 'supplier-1',
          quantity: 50,
          unit_price: 120,
          total_amount: 6000,
          required_date: '2024-01-15',
          notes: 'Urgent requirement for new academic year',
          whatsapp_sent: false,
          status: 'pending',
          created_by: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          item: {
            name: 'Exercise Books',
            unit: 'pieces'
          },
          supplier: {
            name: 'Office Plus Supplies',
            whatsapp: '+254722334455',
            contact_person: 'Mary Wanjiku'
          }
        }
      ];
      
      setRequests(mockRequests);
      toast({
        title: "Procurement requests loaded",
        description: "Demo requests loaded. Database integration pending.",
      });
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
      // Mock for now
      const newRequest: ProcurementRequest = {
        ...request,
        id: Math.random().toString(36).substr(2, 9),
        whatsapp_sent: false,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setRequests(prev => [newRequest, ...prev]);
      toast({
        title: "Procurement request created",
        description: "New procurement request has been created.",
      });
      
      return newRequest;
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
      setRequests(prev => prev.map(r => 
        r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r
      ));

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