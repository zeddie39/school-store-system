import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DashboardStats {
  totalStores: number;
  totalItems: number;
  pendingRequests: number;
  lowStockItems: number;
  totalUsers: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalProcurements: number;
  monthlyExpenses: number;
  activeProcurements: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStores: 0,
    totalItems: 0,
    pendingRequests: 0,
    lowStockItems: 0,
    totalUsers: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalProcurements: 0,
    monthlyExpenses: 0,
    activeProcurements: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Fetch stores count
      const { count: storesCount } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true });

      // Fetch items count and low stock items
      const { data: items } = await supabase
        .from('items')
        .select('quantity, minimum_stock');

      const totalItems = items?.length || 0;
      const lowStockItems = items?.filter(item => 
        item.minimum_stock && item.quantity <= item.minimum_stock
      ).length || 0;

      // Fetch requests statistics
      const { count: pendingRequestsCount } = await supabase
        .from('stock_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: approvedRequestsCount } = await supabase
        .from('stock_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: rejectedRequestsCount } = await supabase
        .from('stock_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch procurements statistics
      const { count: procurementsCount } = await supabase
        .from('procurements')
        .select('*', { count: 'exact', head: true });

      // Calculate monthly expenses
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const { data: monthlyProcurements } = await supabase
        .from('procurements')
        .select('total_cost')
        .gte('created_at', firstDay.toISOString());

      const monthlyExpenses = monthlyProcurements?.reduce((sum, p) => 
        sum + (p.total_cost || 0), 0) || 0;

      setStats({
        totalStores: storesCount || 0,
        totalItems,
        pendingRequests: pendingRequestsCount || 0,
        lowStockItems,
        totalUsers: usersCount || 0,
        approvedRequests: approvedRequestsCount || 0,
        rejectedRequests: rejectedRequestsCount || 0,
        totalProcurements: procurementsCount || 0,
        monthlyExpenses,
        activeProcurements: procurementsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  return { stats, loading, refetch: fetchStats };
};