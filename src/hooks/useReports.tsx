import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface DepartmentReport {
  id: string;
  name: string;
  type: string;
  generated_by: string;
  date: string;
  format: string;
  size: string;
  department?: string; // Make this optional since it may not exist in DB
  file_url?: string;
}

export const useReports = (department?: string) => {
  const [reports, setReports] = useState<DepartmentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchReports = async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('date', { ascending: false });

      if (department) {
        // Map department types for filtering
        const departmentMapping: Record<string, string[]> = {
          'agriculture': ['Agriculture Store'],
          'boarding': ['Boarding Facilities', 'Boarding Store'], 
          'examination': ['Examination Store'],
          'general': ['General Store'],
          'ict_lab': ['ICT Lab', 'ICT Laboratory'],
          'kitchen': ['Kitchen Store', 'School Kitchen'],
          'library': ['Library Store', 'Main Library'],
          'laboratory': ['Science Laboratory', 'Laboratory'],
          'sports': ['Sports Store', 'Sports Equipment Store']
        };

        const searchTerms = departmentMapping[department] || [department];
        query = query.or(searchTerms.map(term => `name.ilike.%${term}%`).join(','));
      }

      const { data: reportsData } = await query;

      if (reportsData && reportsData.length > 0) {
        const formattedReports: DepartmentReport[] = reportsData.map(report => ({
          id: report.id,
          name: report.name || 'Untitled Report',
          type: report.type || 'General Report',
          generated_by: report.generated_by || 'System',
          date: report.date ? new Date(report.date).toLocaleDateString() : new Date().toLocaleDateString(),
          format: report.format || 'PDF',
          size: report.size || 'Unknown size',
          department: getDepartmentFromName(report.name || ''),
          file_url: report.file_url
        }));

        setReports(formattedReports);
      } else {
        // Create sample reports based on existing stores if no real reports exist
        const { data: stores } = await supabase
          .from('stores')
          .select('*');

        if (stores) {
          const sampleReports: DepartmentReport[] = stores.map((store, index) => ({
            id: `sample-${store.id}`,
            name: `${store.name} Report - ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
            type: 'Inventory',
            generated_by: 'System',
            date: new Date().toISOString().split('T')[0],
            format: 'PDF',
            size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
            department: store.store_type,
            file_url: undefined
          }));

          const filteredReports = department 
            ? sampleReports.filter(report => report.department === department)
            : sampleReports;

          setReports(filteredReports);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error fetching reports",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentFromName = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('agriculture')) return 'agriculture';
    if (lowerName.includes('boarding')) return 'boarding';
    if (lowerName.includes('examination') || lowerName.includes('exam')) return 'examination';
    if (lowerName.includes('general')) return 'general';
    if (lowerName.includes('ict') || lowerName.includes('lab')) return 'ict_lab';
    if (lowerName.includes('kitchen')) return 'kitchen';
    if (lowerName.includes('library')) return 'library';
    if (lowerName.includes('science') || lowerName.includes('laboratory')) return 'laboratory';
    if (lowerName.includes('sports')) return 'sports';
    return 'general';
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user, department]);

  return {
    reports,
    loading,
    refetch: fetchReports
  };
};