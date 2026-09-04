import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { supabase } from '@/lib/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          roles (name)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        // If profile doesn't exist, create a basic one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating basic profile');
          await createBasicProfile(userId);
        }
        setLoading(false);
        return;
      }

      setUser({
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.roles?.name,
        avatar_url: data.avatar_url,
      });
      
      console.log('User set:', data);
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setLoading(false);
    }
  };

  const createBasicProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser(userId);
      
      if (userData?.user) {
        // Get default role (front_desk)
        const { data: roleData } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'front_desk')
          .single();

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userData.user.email,
            full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || 'User',
            role_id: roleData?.id,
            avatar_url: userData.user.user_metadata?.avatar_url,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        } else {
          // Fetch the newly created profile
          await fetchUserProfile(userId);
        }
      }
    } catch (error) {
      console.error('Error creating basic profile:', error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful:', data);
      
      // Wait for auth state change and profile fetch
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to role-specific dashboard
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('roles (name)')
          .eq('id', session.user.id)
          .single();
        
        const userRole = profileData?.roles?.name;
        console.log('User role:', userRole);
        
        // Route to appropriate dashboard based on role
        if (userRole === 'manager') {
          router.push('/dashboard/manager');
        } else if (userRole === 'front_desk') {
          router.push('/dashboard/front-desk');
        } else if (userRole === 'housekeeping') {
          router.push('/dashboard/housekeeping');
        } else if (userRole === 'maintenance') {
          router.push('/dashboard/maintenance');
        } else if (userRole === 'owner') {
          router.push('/dashboard/owner');
        } else {
          // Default to main dashboard if role not recognized
          router.push('/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
      
      return data;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Redirect to login after logout
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}