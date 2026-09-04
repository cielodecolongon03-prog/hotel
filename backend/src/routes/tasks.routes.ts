import { Router } from 'express';
import * as tasksController from '../controllers/tasks.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema, completeTaskSchema, verifyTaskSchema, taskQuerySchema } from '../validators/tasks.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get tasks with filtering and pagination
router.get('/', validateRequest(taskQuerySchema, 'query'), tasksController.getTasks);

// Get specific task
router.get('/:id', tasksController.getTaskById);

// Create task (managers only)
router.post('/', authorize('hotel_manager'), validateRequest(createTaskSchema), tasksController.createTask);

// Update task (managers only)
router.put('/:id', authorize('hotel_manager'), validateRequest(updateTaskSchema), tasksController.updateTask);

// Update task status (assigned employee or manager)
router.patch('/:id/status', validateRequest(updateTaskStatusSchema), tasksController.updateTaskStatus);

// Complete task (assigned employee or manager)
router.post('/:id/complete', validateRequest(completeTaskSchema), tasksController.completeTask);

// Verify task (managers only)
router.post('/:id/verify', authorize('hotel_manager'), validateRequest(verifyTaskSchema), tasksController.verifyTask);

// Delete task (managers only)
router.delete('/:id', authorize('hotel_manager'), tasksController.deleteTask);

export default router;