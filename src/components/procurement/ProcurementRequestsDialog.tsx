import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Calendar, Package, User, Phone, Send } from 'lucide-react';
import { useProcurementRequests } from '@/hooks/useProcurementRequests';
import { useToast } from '@/hooks/use-toast';

interface ProcurementRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProcurementRequestsDialog: React.FC<ProcurementRequestsDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { requests, loading, sendWhatsAppMessage } = useProcurementRequests();
  const { toast } = useToast();
  const [sendingMessages, setSendingMessages] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSendWhatsApp = async (requestId: string) => {
    setSendingMessages(prev => new Set([...prev, requestId]));
    try {
      await sendWhatsAppMessage(requestId);
      toast({
        title: "WhatsApp message sent",
        description: "Procurement request has been sent to supplier.",
      });
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
    } finally {
      setSendingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'sent': return 'bg-primary/10 text-primary border-primary/20';
      case 'confirmed': return 'bg-success/10 text-success border-success/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Procurement Requests</DialogTitle>
            <DialogDescription>
              Manage procurement requests and WhatsApp communications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-10 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Procurement Requests
          </DialogTitle>
          <DialogDescription>
            Manage procurement requests and WhatsApp communications with suppliers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold text-lg mb-2">No Procurement Requests</h3>
              <p className="text-muted-foreground">
                Procurement requests will appear here when items are requested from suppliers.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {request.item?.name || 'Unknown Item'}
                          </h3>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          Supplier: {request.supplier?.name || 'Unknown Supplier'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {request.total_amount ? formatCurrency(request.total_amount) : 'Quote Pending'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.quantity} {request.item?.unit || 'units'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="font-medium ml-1">{request.quantity}</span>
                        </span>
                      </div>
                      
                      {request.unit_price && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            <span className="text-muted-foreground">Unit Price:</span>
                            <span className="font-medium ml-1">{formatCurrency(request.unit_price)}</span>
                          </span>
                        </div>
                      )}

                      {request.required_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">Required:</span>
                            <span className="font-medium ml-1">{formatDate(request.required_date)}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Supplier Contact Info */}
                    <div className="bg-muted/30 rounded-lg p-3 mb-4">
                      <h4 className="font-medium mb-2">Supplier Contact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {request.supplier?.contact_person && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>{request.supplier.contact_person}</span>
                          </div>
                        )}
                        {request.supplier?.whatsapp && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-success" />
                            <span>{request.supplier.whatsapp}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {request.notes && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-1">Notes:</h4>
                        <p className="text-sm text-muted-foreground">{request.notes}</p>
                      </div>
                    )}

                    {/* WhatsApp Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        {request.whatsapp_sent ? (
                          <span className="text-success">
                            ✓ WhatsApp sent on {formatDate(request.whatsapp_sent_at!)}
                          </span>
                        ) : (
                          <span>WhatsApp not sent yet</span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {!request.whatsapp_sent && (
                          <Button
                            size="sm"
                            onClick={() => handleSendWhatsApp(request.id)}
                            disabled={sendingMessages.has(request.id)}
                            className="bg-success hover:bg-success/90"
                          >
                            {sendingMessages.has(request.id) ? (
                              <>
                                <span className="animate-spin mr-2">⏳</span>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send WhatsApp
                              </>
                            )}
                          </Button>
                        )}
                        
                        {request.whatsapp_sent && request.supplier?.whatsapp && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://wa.me/${request.supplier?.whatsapp}`, '_blank')}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Open WhatsApp
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProcurementRequestsDialog;