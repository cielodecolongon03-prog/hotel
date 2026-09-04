import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

// Create Supabase client with service role key for backend operations
// This client bypasses RLS policies - use with caution
export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper function to verify JWT token from Supabase
export async function verifyToken(token: string) {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return null;
    }

    return data.user;
  } catch (error) {
    return null;
  }
}

// Helper function to get user profile with role
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        roles (*)
      `)
      .eq('id', userId)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

// Helper function to get employee information
export async function getEmployeeByProfileId(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        departments (*)
      `)
      .eq('profile_id', profileId)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}