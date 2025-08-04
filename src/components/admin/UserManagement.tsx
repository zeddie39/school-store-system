import React, { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, Eye, Search, UserPlus, Filter } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const { users, loading, error, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());

  // Input validation helper
  const validateInput = (input: string, type: 'name' | 'email' | 'phone') => {
    const sanitized = input.trim().slice(0, type === 'phone' ? 20 : 100);
    
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(sanitized) ? sanitized : '';
    }
    
    if (type === 'phone') {
      const phoneRegex = /^[0-9+\-\s()]{10,20}$/;
      return phoneRegex.test(sanitized) ? sanitized : sanitized;
    }
    
    return sanitized;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Separate pending users (those without department or with minimal role assignment)
  const pendingUsers = users.filter(user => 
    !user.department || user.department === 'N/A' || user.department === 'No Department'
  );

  const activeUsers = users.filter(user => 
    user.department && user.department !== 'N/A' && user.department !== 'No Department'
  );

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  const handleAssignDepartment = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setPendingUser(user);
    }
  };

  const handleApprovePendingUser = async () => {
    if (!pendingUser) return;

    const validatedData = {
      full_name: validateInput(pendingUser.full_name, 'name'),
      department: validateInput(pendingUser.department, 'name'),
      role: pendingUser.role
    };

    if (!validatedData.full_name || !validatedData.department) {
      toast({
        title: "Validation Error",
        description: "Please provide valid name and department.",
        variant: "destructive"
      });
      return;
    }

    const success = await updateUser(pendingUser.id, validatedData);
    if (success) {
      setPendingUser(null);
      toast({
        title: "User Approved",
        description: "User has been successfully assigned to department.",
      });
    }
  };

  const handleRejectPendingUser = async () => {
    if (!pendingUser) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to reject and delete user ${pendingUser.full_name}? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      setProcessingActions(prev => new Set(prev).add(`delete-${pendingUser.id}`));
      const success = await deleteUser(pendingUser.id);
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(`delete-${pendingUser.id}`);
        return newSet;
      });
      
      if (success) {
        setPendingUser(null);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    const validatedData = {
      full_name: validateInput(selectedUser.full_name, 'name'),
      phone: validateInput(selectedUser.phone, 'phone'),
      department: validateInput(selectedUser.department, 'name'),
      role: selectedUser.role
    };

    if (!validatedData.full_name) {
      toast({
        title: "Validation Error",
        description: "Please provide a valid name.",
        variant: "destructive"
      });
      return;
    }

    const success = await updateUser(selectedUser.id, validatedData);
    if (success) {
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setProcessingActions(prev => new Set(prev).add(`delete-${userId}`));
    const success = await deleteUser(userId);
    setProcessingActions(prev => {
      const newSet = new Set(prev);
      newSet.delete(`delete-${userId}`);
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error loading users: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Note: User creation must be done through the registration system for security.
        </p>
      </div>

      {/* Pending Users Alert */}
      {pendingUsers.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <UserPlus className="w-5 h-5" />
              Pending User Approvals ({pendingUsers.length})
            </CardTitle>
            <CardDescription className="text-orange-700">
              These users have registered but need department assignment and role confirmation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAssignDepartment(user.id)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Assign Department
                  </Button>
                </div>
              ))}
              {pendingUsers.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  And {pendingUsers.length - 3} more users awaiting approval...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role-filter">Filter by Role</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Administrator</SelectItem>
                  <SelectItem value="Teacher">Department Teacher</SelectItem>
                  <SelectItem value="Store Keeper">Store Keeper</SelectItem>
                  <SelectItem value="Procurement Officer">Procurement Officer</SelectItem>
                  <SelectItem value="Bursar">Bursar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All System Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Active Users: {activeUsers.length} • Pending Approval: {pendingUsers.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                       <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                      <Badge variant="outline">{user.role}</Badge>
                      {(!user.department || user.department === 'N/A' || user.department === 'No Department') && (
                        <Badge variant="destructive">Needs Department</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <span>Department: {user.department}</span>
                      <span>Phone: {user.phone}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={processingActions.has(`delete-${user.id}`)}
                    >
                      {processingActions.has(`delete-${user.id}`) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assign Department Dialog */}
      {pendingUser && (
        <Dialog open={!!pendingUser} onOpenChange={() => setPendingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign User to Department</DialogTitle>
              <DialogDescription>
                Review and approve this user's registration by assigning them to a department
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">User Information</h4>
                <p><strong>Name:</strong> {pendingUser.full_name}</p>
                <p><strong>Email:</strong> {pendingUser.email}</p>
              </div>
              <div>
                <Label htmlFor="assign-name">Full Name</Label>
                <Input
                  id="assign-name"
                  value={pendingUser.full_name}
                  onChange={(e) => setPendingUser(prev => prev ? { ...prev, full_name: validateInput(e.target.value, 'name') } : null)}
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="assign-department">Department *</Label>
                <Input
                  id="assign-department"
                  value={pendingUser.department || ''}
                  onChange={(e) => setPendingUser(prev => prev ? { ...prev, department: validateInput(e.target.value, 'name') } : null)}
                  placeholder="Enter department name..."
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="assign-role">Role *</Label>
                <Select 
                  value={pendingUser.role} 
                  onValueChange={(value) => setPendingUser(prev => prev ? { ...prev, role: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="teacher">Department Teacher</SelectItem>
                    <SelectItem value="storekeeper">Store Keeper</SelectItem>
                    <SelectItem value="procurement_officer">Procurement Officer</SelectItem>
                    <SelectItem value="bursar">Bursar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleApprovePendingUser} 
                  className="flex-1"
                  disabled={!pendingUser.department?.trim()}
                >
                  Approve & Assign
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleRejectPendingUser} 
                  className="flex-1"
                  disabled={processingActions.has(`delete-${pendingUser.id}`)}
                >
                  {processingActions.has(`delete-${pendingUser.id}`) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Reject & Delete'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.full_name}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, full_name: validateInput(e.target.value, 'name') } : null)}
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email (Read-only)</Label>
                <Input
                  id="edit-email"
                  value={selectedUser.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed for security reasons</p>
              </div>
              <div>
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={selectedUser.department}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, department: validateInput(e.target.value, 'name') } : null)}
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={selectedUser.phone}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, phone: validateInput(e.target.value, 'phone') } : null)}
                  maxLength={20}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value) => setSelectedUser(prev => prev ? { ...prev, role: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="teacher">Department Teacher</SelectItem>
                    <SelectItem value="storekeeper">Store Keeper</SelectItem>
                    <SelectItem value="procurement_officer">Procurement Officer</SelectItem>
                    <SelectItem value="bursar">Bursar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateUser} className="flex-1">
                  Update User
                </Button>
                <Button variant="outline" onClick={() => setSelectedUser(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;
