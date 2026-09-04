import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import employeesService from '../services/employees.service';
import { AppError } from '../middleware/error.middleware';

export const getEmployees = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await employeesService.getEmployees(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const employee = await employeesService.getEmployeeById(id);
    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Only managers can create employees
    if (req.user.role !== 'hotel_manager' && req.user.role !== 'hotel_owner') {
      throw new AppError('Insufficient permissions to create employees', 403);
    }

    const employee = await employeesService.createEmployee(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: employee,
      message: 'Employee created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const employee = await employeesService.updateEmployee(id, req.body);
    res.status(200).json({
      success: true,
      data: employee,
      message: 'Employee updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await employeesService.deleteEmployee(id);
    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};