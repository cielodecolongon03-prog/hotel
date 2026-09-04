// Global type declarations for Node.js
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
  uptime(): number;
};

declare const Error: {
  new(message?: string): Error;
  captureStackTrace?(targetObject: Object, constructorOpt: Function): void;
};