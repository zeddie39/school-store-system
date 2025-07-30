import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { supabase } from '../integrations/supabase/client';

const DepartmentDetails: React.FC = () => {
  const { deptId } = useParams<{ deptId: string}>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('departments')
          .select('*')
          .eq('id', deptId)
          .single();
        if (error) throw error;
        setDepartment(data);
        setName(data?.name || '');
      } catch (err: any) {
        setError('Failed to load department');
      }
      setLoading(false);
    };
    if (deptId) fetchDepartment();
  }, [deptId]);

  const handleSave = async () => {
    setError(null);
    try {
      const { error } = await supabase
        .from('departments')
        .update({ name })
        .eq('id', deptId);
      if (error) throw error;
      setDepartment({ ...department, name });
      setEditMode(false);
    } catch (err: any) {
      setError('Failed to update department');
    }
  };

  if (loading) return <div className="p-8">Loading department...</div>;
  if (error) return <div className="p-8 text-destructive">{error}</div>;
  if (!department) return <div className="p-8">Department not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
          <CardDescription>View and edit department settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block font-medium mb-1">Department Name:</label>
            {editMode ? (
              <input
                className="border rounded px-3 py-2 w-full"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            ) : (
              <span className="text-lg">{department.name}</span>
            )}
          </div>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button size="sm" onClick={handleSave}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>Edit</Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentDetails;
