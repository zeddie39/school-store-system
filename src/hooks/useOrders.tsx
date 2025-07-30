import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface Order {
  id: string;
  order_number: string;
  supplier_name: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_cost: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  notes?: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      // Create mock order data
      const mockOrders: Order[] = [
        {
          id: '1',
          order_number: 'ORD000001',
          supplier_name: 'Science Supply Co.',
          item_name: 'Laboratory Equipment',
          quantity: 15,
          unit_price: 45000,
          total_cost: 675000,
          status: 'pending',
          order_date: '2024-01-15',
          expected_delivery_date: '2024-01-25'
        },
        {
          id: '2',
          order_number: 'ORD000002',
          supplier_name: 'Academic Publishers',
          item_name: 'Library Books',
          quantity: 100,
          unit_price: 2500,
          total_cost: 250000,
          status: 'processing',
          order_date: '2024-01-14',
          expected_delivery_date: '2024-01-22'
        },
        {
          id: '3',
          order_number: 'ORD000003',
          supplier_name: 'Sports World Ltd',
          item_name: 'Sports Equipment',
          quantity: 25,
          unit_price: 8000,
          total_cost: 200000,
          status: 'delivered',
          order_date: '2024-01-10',
          expected_delivery_date: '2024-01-18',
          actual_delivery_date: '2024-01-17'
        }
      ];

      setOrders(mockOrders);
    } catch (error: any) {
      toast({
        title: "Error fetching orders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      setOrders(prev => 
        prev.map(order => 
          order.id === id ? { ...order, status } : order
        )
      );
      
      toast({
        title: "Order updated",
        description: `Order status changed to ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return {
    orders,
    loading,
    updateOrderStatus,
    refetch: fetchOrders
  };
};