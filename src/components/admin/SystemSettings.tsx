
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Database, 
  Bell, 
  Shield, 
  Clock, 
  Mail,
  Server,
  Download,
  Upload,
  RefreshCw,
  Save
} from 'lucide-react';

const SystemSettings: React.FC = () => {
  const { toast } = useToast();

  const [generalSettings, setGeneralSettings] = useState({
    notifications: true,
    autoBackup: true,
    maintenanceMode: false,
    allowRegistration: true,
    sessionTimeout: 30,
    systemName: 'School Store System',
    maxFileSize: 10
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@school.edu',
    enableEmailNotifications: true
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackupTime: '02:00',
    backupRetentionDays: 30,
    lastBackup: '2024-01-16 02:00:00',
    nextBackup: '2024-01-17 02:00:00'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSettingToggle = (category: string, setting: string) => {
    if (category === 'general') {
      setGeneralSettings(prev => ({
        ...prev,
        [setting]: !prev[setting as keyof typeof prev]
      }));
    }
    
    toast({
      title: "Setting Updated",
      description: `${setting} has been ${generalSettings[setting as keyof typeof generalSettings] ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleSessionTimeoutChange = (minutes: number) => {
    setGeneralSettings(prev => ({ ...prev, sessionTimeout: minutes }));
    toast({
      title: "Session Timeout Updated",
      description: `Session timeout set to ${minutes} minutes.`,
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings Saved",
        description: "All system settings have been updated successfully.",
      });
    }, 1500);
  };

  const handleBackupNow = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setBackupSettings(prev => ({
        ...prev,
        lastBackup: new Date().toLocaleString()
      }));
      toast({
        title: "Backup Complete",
        description: "System backup has been created successfully.",
      });
    }, 3000);
  };

  const handleTestEmail = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Test Email Sent",
        description: "Test email has been sent to verify configuration.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            General Settings
          </CardTitle>
          <CardDescription>Configure system-wide settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="system-name">System Name</Label>
              <Input
                id="system-name"
                value={generalSettings.systemName}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, systemName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="max-file-size">Max File Size (MB)</Label>
              <Input
                id="max-file-size"
                type="number"
                value={generalSettings.maxFileSize}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Enable Notifications
                </p>
                <p className="text-sm text-muted-foreground">Send system notifications to users</p>
              </div>
              <Switch
                checked={generalSettings.notifications}
                onCheckedChange={() => handleSettingToggle('general', 'notifications')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Auto Backup
                </p>
                <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
              </div>
              <Switch
                checked={generalSettings.autoBackup}
                onCheckedChange={() => handleSettingToggle('general', 'autoBackup')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  Maintenance Mode
                </p>
                <p className="text-sm text-muted-foreground">Temporarily disable system access</p>
              </div>
              <Switch
                checked={generalSettings.maintenanceMode}
                onCheckedChange={() => handleSettingToggle('general', 'maintenanceMode')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Allow Registration
                </p>
                <p className="text-sm text-muted-foreground">Allow new user registrations</p>
              </div>
              <Switch
                checked={generalSettings.allowRegistration}
                onCheckedChange={() => handleSettingToggle('general', 'allowRegistration')}
              />
            </div>
          </div>

          <Separator />

          <div>
            <p className="font-medium mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Session Timeout (minutes)
            </p>
            <div className="flex gap-2 flex-wrap">
              {[15, 30, 60, 120, 240].map((minutes) => (
                <Button
                  key={minutes}
                  variant={generalSettings.sessionTimeout === minutes ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSessionTimeoutChange(minutes)}
                >
                  {minutes}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Current: {generalSettings.sessionTimeout} minutes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Configuration
          </CardTitle>
          <CardDescription>Configure SMTP settings for email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Enable Email Notifications</p>
              <p className="text-sm text-muted-foreground">Send email notifications for system events</p>
            </div>
            <Switch
              checked={emailSettings.enableEmailNotifications}
              onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enableEmailNotifications: checked }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-server">SMTP Server</Label>
              <Input
                id="smtp-server"
                value={emailSettings.smtpServer}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpServer: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                type="number"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="smtp-username">SMTP Username</Label>
              <Input
                id="smtp-username"
                value={emailSettings.smtpUsername}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input
                id="smtp-password"
                type="password"
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="from-email">From Email Address</Label>
              <Input
                id="from-email"
                type="email"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={handleTestEmail} variant="outline" disabled={isLoading}>
            <Mail className="w-4 h-4 mr-2" />
            Send Test Email
          </Button>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backup & Recovery
          </CardTitle>
          <CardDescription>Manage system backups and data recovery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="backup-time">Daily Backup Time</Label>
              <Input
                id="backup-time"
                type="time"
                value={backupSettings.autoBackupTime}
                onChange={(e) => setBackupSettings(prev => ({ ...prev, autoBackupTime: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="retention-days">Retention Period (Days)</Label>
              <Input
                id="retention-days"
                type="number"
                value={backupSettings.backupRetentionDays}
                onChange={(e) => setBackupSettings(prev => ({ ...prev, backupRetentionDays: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Last Backup:</p>
                <p className="text-muted-foreground">{backupSettings.lastBackup}</p>
              </div>
              <div>
                <p className="font-medium">Next Scheduled:</p>
                <p className="text-muted-foreground">{backupSettings.nextBackup}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleBackupNow} disabled={isLoading}>
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? 'Creating Backup...' : 'Backup Now'}
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Restore from Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            System Status
          </CardTitle>
          <CardDescription>Current system health and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Database</p>
                  <p className="font-medium">Connected</p>
                </div>
                <Badge variant="default">Online</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Storage</p>
                  <p className="font-medium">85% Used</p>
                </div>
                <Badge variant="secondary">Normal</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="font-medium">120ms</p>
                </div>
                <Badge variant="default">Good</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
