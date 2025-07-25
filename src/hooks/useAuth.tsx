
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
// Audit log utility
async function logAudit({ action, actor, target, details }: { action: string, actor: string, target: string, details?: string }) {
  try {
    await supabase.from('audit_logs').insert({
      action,
      actor,
      target,
      timestamp: new Date().toISOString(),
      details: details || null
    });
  } catch {}
}
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  profileError: string | null;
  signOut: () => Promise<void>;
  createProfile: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const createProfile = async (userData: any) => {
    if (!user) return;
    
    console.log('🔧 Creating missing profile for user:', user.email);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: userData.full_name || user.user_metadata?.full_name || 'New User',
          role: (userData.role || user.user_metadata?.role || 'storekeeper') as any,
          phone: userData.phone || user.user_metadata?.phone || '',
          department: userData.department || user.user_metadata?.department || ''
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating profile:', error);
        setProfileError('Failed to create user profile');
      } else {
        console.log('✅ Profile created successfully:', data);
        setProfile(data);
        setProfileError(null);
      }
    } catch (err) {
      console.error('❌ Profile creation error:', err);
      setProfileError('Failed to create user profile');
    }
  };

  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Audit log: user login
          logAudit({
            action: 'login',
            actor: session.user.email,
            target: session.user.email,
            details: 'User logged in.'
          });
          console.log('👤 User signed in, fetching profile...');
          setProfileError(null);
          
          // Defer profile fetching to avoid deadlocks
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no rows
              
              if (error) {
                console.error('❌ Error fetching profile:', error);
                setProfileError('Error fetching user profile');
                setProfile(null);
              } else if (!profile) {
                console.log('⚠️ No profile found, user needs profile creation');
                setProfileError('Profile not found - please contact administrator');
                setProfile(null);
                
                // Attempt to create profile from user metadata
                if (session.user.user_metadata) {
                  await createProfile(session.user.user_metadata);
                }
              } else {
                console.log('✅ Profile fetched successfully:', profile);
                setProfile(profile);
                setProfileError(null);
              }
              setLoading(false);
            } catch (err) {
              console.error('❌ Profile fetch error:', err);
              setProfileError('Unexpected error fetching profile');
              setProfile(null);
              setLoading(false);
            }
          }, 100);
        } else {
          setProfile(null);
          setProfileError(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Checking existing session...');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 Found existing session, fetching profile...');
        setProfileError(null);
        
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error('❌ Error fetching existing profile:', error);
              setProfileError('Error fetching user profile');
              setProfile(null);
            } else if (!profile) {
              console.log('⚠️ No existing profile found');
              setProfileError('Profile not found - please contact administrator');
              setProfile(null);
              
              // Attempt to create profile from user metadata
              if (session.user.user_metadata) {
                createProfile(session.user.user_metadata);
              }
            } else {
              console.log('✅ Existing profile fetched:', profile);
              setProfile(profile);
              setProfileError(null);
            }
            setLoading(false);
          });
      } else {
        console.log('❌ No existing session found');
        setLoading(false);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('🚪 Signing out...');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    setProfileError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      loading, 
      profileError, 
      signOut, 
      createProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
