import { Request, Response } from 'express';
import { config } from '../config/env';

// Add process declaration
declare const process: {
  uptime(): number;
  env: any;
};

export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      version: '1.0.0',
      uptime: process.uptime(),
    },
  });
};