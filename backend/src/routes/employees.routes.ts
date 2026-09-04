import { Router } from 'express';
import * as employeesController from '../controllers/employees.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { createEmployeeSchema, updateEmployeeSchema, employeeQuerySchema } from '../validators/employees.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get employees with filtering and pagination
router.get('/', validateRequest(employeeQuerySchema, 'query'), employeesController.getEmployees);

// Get specific employee
router.get('/:id', employeesController.getEmployeeById);

// Create employee (managers only - checked in controller)
router.post('/', validateRequest(createEmployeeSchema), employeesController.createEmployee);

// Update employee (managers only - checked in controller)
router.put('/:id', validateRequest(updateEmployeeSchema), employeesController.updateEmployee);

// Delete employee (managers only - checked in controller)
router.delete('/:id', employeesController.deleteEmployee);

export default router;