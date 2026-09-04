import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, full_name, role } = req.body;

    // Validate input
    if (!email || !password || !full_name) {
      throw new AppError('Email, password, and full name are required', 400);
    }

    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    if (!email.includes('@')) {
      throw new AppError('Invalid email format', 400);
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw new AppError(authError?.message || 'Failed to create user', 400);
    }

    // Get role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role || 'front_desk')
      .single();

    if (roleError || !roleData) {
      throw new AppError('Invalid role specified', 400);
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        role_id: roleData.id,
        avatar_url: null,
      })
      .select()
      .single();

    if (profileError) {
      throw new AppError(profileError.message, 400);
    }

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
        },
        session: authData.session,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    if (!email.includes('@')) {
      throw new AppError('Invalid email format', 400);
    }

    if (password.length < 1) {
      throw new AppError('Password is required', 400);
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        roles (name)
      `)
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      throw new AppError('User profile not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.roles?.name,
          avatar_url: profile.avatar_url,
        },
        session: data.session,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AppError(error.message, 400);
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Get user profile with role and employee info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        roles (name),
        employees (
          *,
          departments (name)
        )
      `)
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new AppError('User profile not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.roles?.name,
        avatar_url: profile.avatar_url,
        employee: profile.employees?.[0] || null,
      },
    });
  } catch (error) {
    next(error);
  }
};