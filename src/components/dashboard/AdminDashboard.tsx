
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../hooks/useStores';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Badge } from '../ui/badge';
import StoreGrid from '../stores/StoreGrid';
import StatsCard from '../common/StatsCard';
import { Download, Store, TrendingUp, Users, Package, AlertTriangle, UserCheck } from 'lucide-react';
// import { supabase } from '../../integrations/supabase'; // TODO: Uncomment when supabase client is available
// import type { NotificationRow } from '../../types'; // TODO: Uncomment when NotificationRow type is available
const AdminDashboard: React.FC = () => {
  // User management: fetch unassigned users
  // const [unassignedUsers, setUnassignedUsers] = useState([]);
  // const [loadingUnassigned, setLoadingUnassigned] = useState(true);
  // const [assigningUserId, setAssigningUserId] = useState(null);
  // const [assignError, setAssignError] = useState(null);
  // const [assignSuccess, setAssignSuccess] = useState(null);

  // const fetchUnassignedUsers = async () => {
  //   setLoadingUnassigned(true);
  //   setAssignError(null);
  //   // Get users with no department or role
  //   const { data, error } = await supabase
  //     .from('profiles')
  //     .select('*')
  //     .or('department.is.null,department.eq.""')
  //     .or('role.is.null,role.eq.""');
  //   if (!error && data) {
  //     setUnassignedUsers(data);
  //   } else {
  //     setUnassignedUsers([]);
  //     setAssignError('Failed to fetch unassigned users');
  //   }
  //   setLoadingUnassigned(false);
  // };

  // Placeholder for handleRemoveUser to prevent errors
  // const handleRemoveUser = (userId: string) => {
  //   alert('Remove user not implemented');
  // };

  // TODO: Restore actual dashboard JSX and logic here
  return (
    <div style={{ padding: 32 }}>
      <h1>Admin Dashboard</h1>
      <p>This is a placeholder. Restore dashboard logic and UI here.</p>
    </div>
  );

};

export default AdminDashboard;
