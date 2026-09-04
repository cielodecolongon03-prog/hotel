import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { config } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import healthRoutes from './routes/health.routes';
import tasksRoutes from './routes/tasks.routes';
import employeesRoutes from './routes/employees.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/employees', employeesRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found',
    },
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} in ${config.nodeEnv} mode`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`API endpoint: http://localhost:${PORT}/api/v1`);
});

export default app;