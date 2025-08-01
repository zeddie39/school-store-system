
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '../auth/LoginForm';
import type { Database } from '@/integrations/supabase/types';
import { 
  School, 
  LogOut, 
  User, 
  Settings,
  Home,
  Store,
  FileText,
  Users,
  DollarSign,
  Package
} from 'lucide-react';
import ProfileEditDialog from '../auth/ProfileEditDialog';
import { useToast } from '@/hooks/use-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface NavigationProps {
  userRole: UserRole;
  userEmail: string;
  userProfile: Profile;
  onLogout: () => void;
  onNavigate?: (path: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ userRole, userEmail, userProfile, onLogout, onNavigate }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('/');

  const getNavItems = () => {
    const commonItems = [
      { icon: Home, label: 'Dashboard', path: '/' },
      { icon: Store, label: 'Stores', path: '/stores' }
    ];

    const roleSpecificItems = {
      admin: [
        { icon: Users, label: 'Users', path: '/users' },
        { icon: Settings, label: 'Settings', path: '/settings' },
        { icon: FileText, label: 'Reports', path: '/reports' }
      ],
      storekeeper: [
        { icon: Package, label: 'Inventory', path: '/inventory' },
        { icon: FileText, label: 'Requests', path: '/requests' }
      ],
      teacher: [
        { icon: FileText, label: 'Approvals', path: '/approvals' }
      ],
      procurement_officer: [
        { icon: Package, label: 'Procurement', path: '/procurement' },
        { icon: FileText, label: 'Orders', path: '/orders' }
      ],
      bursar: [
        { icon: DollarSign, label: 'Budget', path: '/budget' },
        { icon: FileText, label: 'Expenses', path: '/expenses' }
      ]
    };

    return [...commonItems, ...roleSpecificItems[userRole]];
  };

  const handleNavigation = (item: { icon: any; label: string; path: string }) => {
    setActiveTab(item.path);
    toast({
      title: `Navigating to ${item.label}`,
      description: `Opening ${item.label} section...`,
    });
    
    if (onNavigate) {
      onNavigate(item.path);
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    const roleNames = {
      admin: 'Administrator',
      storekeeper: 'Store Keeper',
      teacher: 'Department Teacher',
      procurement_officer: 'Procurement Officer',
      bursar: 'Bursar'
    };
    return roleNames[role];
  };

  const getRoleBadgeClass = (role: UserRole) => {
    const roleClasses = {
      admin: 'role-badge role-badge-admin',
      storekeeper: 'role-badge role-badge-storekeeper',
      teacher: 'role-badge role-badge-teacher',
      procurement_officer: 'role-badge role-badge-procurement',
      bursar: 'role-badge role-badge-bursar'
    };
    return roleClasses[role];
  };

  // Profile edit dialog state
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const handleProfileUpdated = (updated: { full_name: string; phone: string }) => {
    // Optionally update UI or refetch profile
    if (userProfile) {
      userProfile.full_name = updated.full_name;
      userProfile.phone = updated.phone;
    }
  };
  return (
    <>
      <nav className="bg-sidebar border-b border-sidebar-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 flex-wrap sm:flex-nowrap gap-2">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sidebar-primary/10 rounded-lg">
                <School className="w-6 h-6 text-sidebar-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">
                  School Store System
                </h1>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-4 flex-wrap">
              {getNavItems().map((item, index) => (
                <Button
                  key={index}
                  variant={activeTab === item.path ? "default" : "ghost"}
                  size="sm"
                  className="text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent"
                  onClick={() => handleNavigation(item)}
                >
                  <item.icon className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              ))}
            </div>

            {/* User Info, Profile Edit, and Logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-sidebar-foreground">
                    {userProfile.full_name}
                  </p>
                  <div className={getRoleBadgeClass(userRole)}>
                    {getRoleDisplayName(userRole)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2"
                  title="Edit Profile"
                  onClick={() => setProfileDialogOpen(true)}
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-sidebar-foreground" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-sidebar-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Profile Edit Dialog */}
      {profileDialogOpen && (
        <React.Suspense fallback={null}>
          {/* @ts-ignore */}
          <ProfileEditDialog
            open={profileDialogOpen}
            onClose={() => setProfileDialogOpen(false)}
            profile={{
              id: userProfile.id,
              full_name: userProfile.full_name,
              phone: userProfile.phone || '',
              email: userProfile.email
            }}
            onProfileUpdated={handleProfileUpdated}
          />
        </React.Suspense>
      )}
    </>
  );
};

export default Navigation;
