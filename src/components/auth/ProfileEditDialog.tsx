import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileEditDialogProps {
  open: boolean;
  onClose: () => void;
  profile: { id: string; full_name: string; phone: string; email: string };
  onProfileUpdated: (profile: { full_name: string; phone: string }) => void;
}


const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({ open, onClose, profile, onProfileUpdated }) => {
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', profile.id);
      if (error) throw error;
      toast({ title: 'Profile updated', description: 'Your profile information has been updated.' });
      onProfileUpdated({ full_name: fullName, phone });
      onClose();
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: 'Error', description: 'Please fill in all password fields.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    setPasswordLoading(true);
    try {
      // Re-authenticate user (Supabase requires current session)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: currentPassword
      });
      if (signInError) throw signInError;
      // Update password
      const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
      if (pwError) throw pwError;
      toast({ title: 'Password changed', description: 'Your password has been updated.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({ title: 'Password change failed', description: err.message, variant: 'destructive' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input value={fullName} onChange={e => setFullName(e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} disabled={loading} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
        <hr className="my-4" />
        <form onSubmit={handleChangePassword} className="space-y-3">
          <div className="font-semibold">Change Password</div>
          <Input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            disabled={passwordLoading}
          />
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={passwordLoading}
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={passwordLoading}
          />
          <Button type="submit" disabled={passwordLoading} className="w-full">
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
