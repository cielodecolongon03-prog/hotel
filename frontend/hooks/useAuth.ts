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
      console.log('Fetching profile for user:', userId);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );
      
      const fetchPromise = supabase
        .from('profiles')
        .select(`
          *,
          roles (name)
        `)
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Profile fetch error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Try to create profile as fallback
        console.log('Attempting to create/update profile as fallback');
        await createBasicProfile(userId);
        return;
      }

      const userData = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.roles?.name,
        avatar_url: data.avatar_url,
      };
      
      console.log('User data fetched successfully:', userData);
      setUser(userData);
      setLoading(false);
    } catch (error: any) {
      console.error('Error in fetchUserProfile:', error);
      if (error.message === 'Profile fetch timeout') {
        console.log('Profile fetch timed out, using fallback');
        await createBasicProfile(userId);
      } else {
        // Set loading to false even on error to prevent infinite loading
        setLoading(false);
      }
    }
  };

  const createBasicProfile = async (userId: string) => {
    try {
      console.log('Creating basic profile for user:', userId);
      const { data: userData } = await supabase.auth.getUser(userId);
      
      if (userData?.user) {
        // Try to get the role - default to manager if not specified
        let roleId = null;
        try {
          const { data: roleData } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'manager')
            .single();
          
          if (roleData) {
            roleId = roleData.id;
            console.log('Found manager role:', roleId);
          }
        } catch (roleError) {
          console.error('Error fetching role:', roleError);
        }

        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();

        if (existingProfile) {
          console.log('Profile already exists, updating it');
          // Update existing profile with role
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              role_id: roleId,
              email: userData.user.email || 'user@example.com',
              full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || 'User',
            })
            .eq('id', userId);

          if (updateError) {
            console.error('Error updating profile:', updateError);
            // Set user anyway with default role
            setUser({
              id: userId,
              email: userData.user.email || 'user@example.com',
              full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || 'User',
              role: 'manager',
              avatar_url: userData.user.user_metadata?.avatar_url,
            });
            setLoading(false);
          } else {
            console.log('Profile updated successfully');
            // Fetch the updated profile
            await fetchUserProfile(userId);
          }
        } else {
          console.log('Creating new profile');
          // Create new profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: userData.user.email || 'user@example.com',
              full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || 'User',
              role_id: roleId,
              avatar_url: userData.user.user_metadata?.avatar_url,
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
            console.error('Profile error details:', profileError);
            // Set user anyway with default role
            setUser({
              id: userId,
              email: userData.user.email || 'user@example.com',
              full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || 'User',
              role: 'manager',
              avatar_url: userData.user.user_metadata?.avatar_url,
            });
            setLoading(false);
          } else {
            console.log('Profile created successfully');
            // Fetch the newly created profile
            await fetchUserProfile(userId);
          }
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
      
      // Immediately redirect to dashboard
      // Profile fetch will happen in the background via auth state change
      console.log('Redirecting to /dashboard immediately');
      router.push('/dashboard');
      
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