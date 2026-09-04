import dotenv from 'dotenv';

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
  if (!(process as any).env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

export const config = {
  port: parseInt((process as any).env.PORT!, 10),
  nodeEnv: (process as any).env.NODE_ENV! as 'development' | 'production' | 'test',
  supabaseUrl: (process as any).env.SUPABASE_URL!,
  supabaseServiceRoleKey: (process as any).env.SUPABASE_SERVICE_ROLE_KEY!,
  databaseUrl: (process as any).env.DATABASE_URL!,
  frontendUrl: (process as any).env.FRONTEND_URL!,
  jwtSecret: (process as any).env.JWT_SECRET || 'default-secret-change-in-production',
  sessionSecret: (process as any).env.SESSION_SECRET || 'default-session-secret-change-in-production',
  logLevel: (process as any).env.LOG_LEVEL || 'info',
  
  // Optional email configuration
  emailFrom: (process as any).env.EMAIL_FROM,
  smtpHost: (process as any).env.SMTP_HOST,
  smtpUser: (process as any).env.SMTP_USER,
  smtpPass: (process as any).env.SMTP_PASS,
  
  // Validate environment
  isDevelopment: (process as any).env.NODE_ENV === 'development',
  isProduction: (process as any).env.NODE_ENV === 'production',
  isTest: (process as any).env.NODE_ENV === 'test',
};

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