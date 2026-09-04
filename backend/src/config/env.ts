/// <reference types="node" />

import dotenv from 'dotenv';

// Type declaration for Node.js process.env
declare const process: {
  env: {
    [key: string]: string | undefined;
    PORT?: string;
    NODE_ENV?: string;
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    DATABASE_URL?: string;
    FRONTEND_URL?: string;
    JWT_SECRET?: string;
    SESSION_SECRET?: string;
    LOG_LEVEL?: string;
    EMAIL_FROM?: string;
    SMTP_HOST?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
  };
};

// Load environment variables
dotenv.config();

const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'FRONTEND_URL'
] as const;

// Validate required environment variables
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

export const config = {
  port: parseInt(process.env.PORT!, 10),
  nodeEnv: process.env.NODE_ENV! as 'development' | 'production' | 'test',
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  databaseUrl: process.env.DATABASE_URL!,
  frontendUrl: process.env.FRONTEND_URL!,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  sessionSecret: process.env.SESSION_SECRET || 'default-session-secret-change-in-production',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Optional email configuration
  emailFrom: process.env.EMAIL_FROM,
  smtpHost: process.env.SMTP_HOST,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  
  // Validate environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};