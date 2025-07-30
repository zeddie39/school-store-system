import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface Supplier {
  id: string;
  name: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  category: string;
  rating: number;
  is_active: boolean;
  total_orders: number;
  total_value: number;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSuppliers = async () => {
    if (!user) return;
    
    try {
      // Create mock supplier data based on procurement records
      const mockSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'Science Supply Co.',
          contact_email: 'info@sciencesupply.com',
          phone: '+254 700 123 456',
          category: 'Laboratory Equipment',
          rating: 4.8,
          is_active: true,
          total_orders: 45,
          total_value: 2340000
        },
        {
          id: '2',
          name: 'Academic Publishers',
          contact_email: 'orders@academic.com',
          phone: '+254 700 234 567',
          category: 'Books & Literature',
          rating: 4.6,
          is_active: true,
          total_orders: 32,
          total_value: 1890000
        },
        {
          id: '3',
          name: 'Sports World Ltd',
          contact_email: 'sales@sportsworld.com',
          phone: '+254 700 345 678',
          category: 'Sports Equipment',
          rating: 4.7,
          is_active: true,
          total_orders: 28,
          total_value: 1560000
        },
        {
          id: '4',
          name: 'Food Service Inc.',
          contact_email: 'orders@foodservice.com',
          phone: '+254 700 456 789',
          category: 'Kitchen Supplies',
          rating: 4.5,
          is_active: true,
          total_orders: 23,
          total_value: 1250000
        }
      ];

      setSuppliers(mockSuppliers);
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

  useEffect(() => {
    if (user) {
      fetchSuppliers();
    }
  }, [user]);

  return {
    suppliers,
    loading,
    refetch: fetchSuppliers
  };
};