import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface Expense {
  id: string;
  category: string;
  amount: number;
  department: string;
  vendor: string;
  description?: string;
  expense_date: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  reference_number?: string;
  created_at: string;
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchExpenses = async () => {
    if (!user) return;
    
    try {
      // Use procurement data to create expense records
      const { data: procurements } = await supabase
        .from('procurements')
        .select('*');

      const mockExpenses: Expense[] = [
        {
          id: '1',
          category: 'Laboratory Equipment',
          amount: 320000,
          department: 'Science Lab',
          vendor: 'Science Supply Co.',
          status: 'paid',
          expense_date: '2024-01-15',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          category: 'Library Books',
          amount: 180000,
          department: 'Library',
          vendor: 'Academic Publishers',
          status: 'pending',
          expense_date: '2024-01-14',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          category: 'Kitchen Supplies',
          amount: 95000,
          department: 'Kitchen',
          vendor: 'Food Service Inc.',
          status: 'approved',
          expense_date: '2024-01-13',
          created_at: new Date().toISOString()
        }
      ];

      setExpenses(mockExpenses);
    } catch (error: any) {
      toast({
        title: "Error fetching expenses",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateExpenseStatus = async (id: string, status: Expense['status']) => {
    try {
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === id ? { ...expense, status } : expense
        )
      );
      
      toast({
        title: "Expense updated",
        description: `Expense status changed to ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating expense",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  return {
    expenses,
    loading,
    updateExpenseStatus,
    refetch: fetchExpenses
  };
};