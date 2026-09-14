import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import tasksService from '../services/tasks.service';
import { AppError } from '../middleware/error.middleware';

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await tasksService.getTasks(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const task = await tasksService.getTaskById(id);
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const task = await tasksService.createTask(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const task = await tasksService.updateTask(id, req.body);
    res.status(200).json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { id } = req.params;
    const { status, notes } = req.body;
    
    // Get task to check ownership/assignment
    const task = await tasksService.getTaskById(id);
    
    // Check if user is assigned to this task or is a manager
    const isManager = req.user.role === 'hotel_manager' || req.user.role === 'hotel_owner' || req.user.role === 'admin';
    const isAssigned = task.assigned_to && task.assigned_to.profile_id === req.user.id;
    
    if (!isManager && !isAssigned) {
      throw new AppError('You can only update your assigned tasks', 403);
    }
    
    const updatedTask = await tasksService.updateTaskStatus(id, status, req.user.id, notes);
    res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Task status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const completeTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { id } = req.params;
    const { completion_notes } = req.body;
    
    // Get task to check ownership/assignment
    const task = await tasksService.getTaskById(id);
    
    // Check if user is assigned to this task or is a manager
    const isManager = req.user.role === 'hotel_manager' || req.user.role === 'hotel_owner' || req.user.role === 'admin';
    const isAssigned = task.assigned_to && task.assigned_to.profile_id === req.user.id;
    
    if (!isManager && !isAssigned) {
      throw new AppError('You can only complete your assigned tasks', 403);
    }
    
    const updatedTask = await tasksService.completeTask(id, completion_notes, req.user.id);
    res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Task completed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { id } = req.params;
    const { result, verification_notes } = req.body;
    const task = await tasksService.verifyTask(id, result, verification_notes, req.user.id);
    res.status(200).json({
      success: true,
      data: task,
      message: 'Task verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await tasksService.deleteTask(id);
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};