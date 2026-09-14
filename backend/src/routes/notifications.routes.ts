import { Router } from 'express';
import * as notificationsController from '../controllers/notifications.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', notificationsController.listNotifications);
router.post(
  '/service-requests',
  authorize('guest', 'admin', 'hotel_manager', 'front_desk'),
  notificationsController.createServiceRequest
);
router.patch('/:id', notificationsController.updateNotificationStatus);

export default router;
