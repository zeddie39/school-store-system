import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface Budget {
  id: string;
  department_name: string;
  allocated_amount: number;
  spent_amount: number;
  fiscal_year: number;
  created_at: string;
  updated_at: string;
}

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchBudgets = async () => {
    if (!user) return;
    
    try {
      // For now, we'll create mock budget data based on procurements table
      const { data: procurements } = await supabase
        .from('procurements')
        .select('*');

      // Create mock budget data
      const mockBudgets: Budget[] = [
        {
          id: '1',
          department_name: 'Science Laboratory',
          allocated_amount: 2500000,
          spent_amount: 1850000,
          fiscal_year: 2024,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          department_name: 'Library',
          allocated_amount: 1500000,
          spent_amount: 820000,
          fiscal_year: 2024,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          department_name: 'Sports',
          allocated_amount: 1200000,
          spent_amount: 910000,
          fiscal_year: 2024,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          department_name: 'Kitchen',
          allocated_amount: 2000000,
          spent_amount: 1530000,
          fiscal_year: 2024,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setBudgets(mockBudgets);
    } catch (error: any) {
      toast({
        title: "Error fetching budgets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  return {
    budgets,
    loading,
    refetch: fetchBudgets
  };
};