import { Router } from 'express';
import { authRequired } from '../auth/auth.middleware.js';
import { requireRole } from '../rbac/rbac.middleware.js';
import {
  createRequest, listRequests, getRequest,
  updateStatus, schedule, remove,
  listDrivers, listVehicles, dailyAnalytics
} from './requests.controller.js';

const router = Router();

// Public
router.post('/service-requests', createRequest);

// Protected (viewer/coordinator)
router.get('/service-requests', authRequired, requireRole('viewer', 'coordinator'), listRequests);
router.get('/service-requests/:id', authRequired, requireRole('viewer', 'coordinator'), getRequest);
router.get('/drivers', authRequired, requireRole('viewer', 'coordinator'), listDrivers);
router.get('/vehicles', authRequired, requireRole('viewer', 'coordinator'), listVehicles);
router.get('/analytics/daily', authRequired, requireRole('viewer', 'coordinator'), dailyAnalytics);

// Coordinator-only
router.patch('/service-requests/:id/status', authRequired, requireRole('coordinator'), updateStatus);
router.post('/service-requests/:id/schedule', authRequired, requireRole('coordinator'), schedule);
router.delete('/service-requests/:id', authRequired, requireRole('coordinator'), remove);

export default router;
