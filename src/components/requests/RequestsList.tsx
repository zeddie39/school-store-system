
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle,
  Package,
  User,
  Calendar,
  Filter
} from 'lucide-react';
import { useRequests } from '@/hooks/useRequests';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface RequestsListProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const RequestsList: React.FC<RequestsListProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { requests, loading, approveRequest, rejectRequest } = useRequests();
  const { profile } = useAuth();

  const canApprove = profile?.role === 'admin' || profile?.role === 'teacher';

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requested_by_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'completed': return 'bg-info/10 text-info border-info/20';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'completed': return Package;
      default: return Clock;
    }
  };

  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case 'add_stock': return 'bg-success/10 text-success';
      case 'remove_stock': return 'bg-destructive/10 text-destructive';
      case 'transfer_stock': return 'bg-info/10 text-info';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const handleApproval = async (requestId: string, approved: boolean) => {
    try {
      if (approved) {
        await approveRequest(requestId, 'Request approved by ' + profile?.full_name);
      } else {
        await rejectRequest(requestId, 'Request rejected by ' + profile?.full_name);
      }
    } catch (error) {
      console.error('Error processing request:', error);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Stock Requests
          </DialogTitle>
          <DialogDescription>
            View and manage stock requests from all users
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Requests List */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading requests...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg mb-2">No Requests Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No requests match your search criteria.' 
                    : 'No stock requests have been made yet.'}
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status || 'pending');
                
                return (
                  <Card key={request.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            {request.item?.name || 'Unknown Item'}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {request.requested_by_profile?.full_name || 'Unknown User'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(request.created_at || ''), 'MMM dd, yyyy')}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRequestTypeColor(request.request_type)}>
                            {request.request_type.replace('_', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(request.status || 'pending')}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {request.status || 'pending'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Quantity:</span>
                          <span className="font-medium ml-2">
                            {request.quantity} {request.item?.unit || 'units'}
                          </span>
                        </div>
                        {request.approved_by_profile && (
                          <div>
                            <span className="text-sm text-muted-foreground">Approved by:</span>
                            <span className="font-medium ml-2">
                              {request.approved_by_profile.full_name}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {request.reason && (
                        <div className="mb-4">
                          <span className="text-sm text-muted-foreground">Reason:</span>
                          <p className="text-sm mt-1 p-2 bg-muted/50 rounded">
                            {request.reason}
                          </p>
                        </div>
                      )}

                      {request.status === 'pending' && canApprove && (
                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleApproval(request.id, false)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-success hover:bg-success/90"
                            onClick={() => handleApproval(request.id, true)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestsList;
