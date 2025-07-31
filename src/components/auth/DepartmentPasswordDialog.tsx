import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DepartmentPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentName: string;
  onSuccess: () => void;
}

const DepartmentPasswordDialog: React.FC<DepartmentPasswordDialogProps> = ({
  open,
  onOpenChange,
  departmentName,
  onSuccess
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Demo passwords for different departments
  const departmentPasswords: Record<string, string> = {
    library: 'lib123',
    laboratory: 'lab456',
    kitchen: 'kitchen789',
    sports: 'sports012',
    ict_lab: 'ict345',
    boarding: 'board678',
    examination: 'exam901',
    agriculture: 'agri234',
    general: 'gen567'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate password verification
    setTimeout(() => {
      const correctPassword = departmentPasswords[departmentName] || 'admin123';
      
      if (password === correctPassword) {
        toast({
          title: "Access Granted",
          description: `Welcome to ${departmentName} department`,
        });
        onSuccess();
        onOpenChange(false);
        setPassword('');
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password. Please try again.",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Department Access Required
          </DialogTitle>
          <DialogDescription>
            Enter the password to access the <strong>{departmentName.replace('_', ' ')}</strong> department
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Department Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter department password..."
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !password}
              className="min-w-20"
            >
              {loading ? "Verifying..." : "Access"}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded">
          <strong>Demo Passwords:</strong><br />
          Library: lib123, Lab: lab456, Kitchen: kitchen789<br />
          Sports: sports012, ICT: ict345, Boarding: board678
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentPasswordDialog;