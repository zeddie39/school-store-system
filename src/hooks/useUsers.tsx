import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'storekeeper' | 'teacher' | 'procurement_officer' | 'bursar';
  department: string;
  phone: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
        return;
      }

      const formattedUsers: User[] = (data || []).map(profile => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || 'No Name',
        role: profile.role,
        department: profile.department || 'No Department',
        phone: profile.phone || 'No Phone',
        status: 'Active', // We'll assume all users are active since auth.users controls this
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error in fetchUsers:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      // Sanitize input data
      const sanitizedData = {
        full_name: userData.full_name?.trim().slice(0, 100),
        phone: userData.phone?.trim().slice(0, 20),
        department: userData.department?.trim().slice(0, 100),
        role: userData.role
      };

      const { error } = await supabase
        .from('profiles')
        .update(sanitizedData)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        toast({
          title: "Error",
          description: "Failed to update user",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, ...sanitizedData, updated_at: new Date().toISOString() }
          : user
      ));

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      return true;
    } catch (err) {
      console.error('Error in updateUser:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Note: We can't actually delete users from auth.users via the client
      // This would need to be done through the Supabase admin API
      // For now, we'll just remove from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user profile:', error);
        toast({
          title: "Error",
          description: "Failed to delete user profile. Note: The user account may still exist in authentication.",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));

      toast({
        title: "Success",
        description: "User profile deleted successfully",
      });

      return true;
    } catch (err) {
      console.error('Error in deleteUser:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    updateUser,
    deleteUser,
    refreshUsers: fetchUsers
  };
};