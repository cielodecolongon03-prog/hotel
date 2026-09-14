import { Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

export const createServiceRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const guestName = req.user?.full_name || req.body.guest_name || 'Guest';
    const roomNumber = String(req.body.room_number || '').trim();
    const notes = req.body.notes || '';
    const requestType = req.body.request_type || 'room_cleaning';

    if (!roomNumber) {
      throw new AppError('Room number is required', 400);
    }

    const { data: request, error: requestError } = await supabase
      .from('service_requests')
      .insert({
        guest_id: userId,
        guest_name: guestName,
        room_number: roomNumber,
        request_type: requestType,
        notes,
        status: 'pending',
      })
      .select()
      .single();

    if (requestError || !request) {
      throw new AppError(requestError?.message || 'Failed to create service request', 400);
    }

    const title = requestType === 'room_cleaning'
      ? `Room ${roomNumber} needs cleaning`
      : `New guest request for room ${roomNumber}`;

    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        type: requestType === 'room_cleaning' ? 'room_cleaning' : 'general',
        title,
        message: notes
          ? `${guestName} requested ${requestType.replace('_', ' ')} for room ${roomNumber}. ${notes}`
          : `${guestName} requested ${requestType.replace('_', ' ')} for room ${roomNumber}.`,
        room_number: roomNumber,
        guest_name: guestName,
        guest_id: userId,
        service_request_id: request.id,
        target_roles: ['housekeeping', 'admin', 'hotel_manager', 'front_desk', 'hotel_owner'],
        status: 'unread',
      })
      .select()
      .single();

    if (notificationError) {
      throw new AppError(notificationError.message, 400);
    }

    res.status(201).json({
      success: true,
      data: { request, notification },
    });
  } catch (error) {
    next(error);
  }
};

export const listNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new AppError(error.message, 400);
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateNotificationStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('notifications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(error?.message || 'Notification not found', 404);
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
