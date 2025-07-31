import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface Activity {
  id: string;
  user: string;
  action: string;
  store: string;
  time: string;
  created_at: string;
}

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchActivities = async () => {
    if (!user) return;
    
    try {
      // Fetch audit logs and convert to activities
      const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      // Convert audit logs to activities format
      const realActivities: Activity[] = (auditLogs || []).map((log, index) => ({
        id: log.id,
        user: 'System User', // Simplified since we can't easily join with profiles
        action: log.action || 'Performed an action',
        store: 'Store System',
        time: new Date(log.timestamp || '').toLocaleString(),
        created_at: log.timestamp || new Date().toISOString()
      }));

      setActivities(realActivities);
    } catch (error: any) {
      toast({
        title: "Error fetching activities",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  return {
    activities,
    loading,
    refetch: fetchActivities
  };
};