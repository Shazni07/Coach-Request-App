import { Router } from "express";
import { authRequired } from "../auth/auth.middleware.js";
import { requireRole } from "../rbac/rbac.middleware.js";
import {
  createRequest,
  getAllRequests as listRequests,
  updateStatus,
  schedule,
  listDrivers,
  listVehicles,
  dailyAnalytics,
  getRequest,
  remove,
} from "./requests.controller.js";

const router = Router();

/**
 * ===================================================
 * 🧾 SERVICE REQUEST ROUTES (v2 - Finalized)
 * ===================================================
 *
 * Roles:
 *  - Public: Customer can create trip requests
 *  - Viewer: Read-only access (view requests, analytics)
 *  - Coordinator: Full access (approve, reject, schedule)
 *
 * Middlewares:
 *  - authRequired: Validates JWT token
 *  - requireRole('viewer', 'coordinator'): Allows both Viewer & Coordinator
 */

// -------------------------------
// 🔹 Public - Customer Form
// -------------------------------
router.post("/service-requests", createRequest);

// -------------------------------
// 🔹 Protected - Viewer & Coordinator
// -------------------------------
router.get(
  "/service-requests",
  authRequired,
  requireRole("viewer", "coordinator"),
  listRequests
);

router.get(
  "/service-requests/:id",
  authRequired,
  requireRole("viewer", "coordinator"),
  getRequest
);

router.get(
  "/drivers",
  authRequired,
  requireRole("viewer", "coordinator"),
  listDrivers
);

router.get(
  "/vehicles",
  authRequired,
  requireRole("viewer", "coordinator"),
  listVehicles
);

router.get(
  "/analytics/daily",
  authRequired,
  requireRole("viewer", "coordinator"),
  dailyAnalytics
);

// -------------------------------
// 🔹 Coordinator Only Actions
// -------------------------------
router.patch(
  "/service-requests/:id/status",
  authRequired,
  requireRole("coordinator"),
  updateStatus
);

router.post(
  "/service-requests/:id/schedule",
  authRequired,
  requireRole("coordinator"),
  schedule
);

router.delete(
  "/service-requests/:id",
  authRequired,
  requireRole("coordinator"),
  remove
);

export default router;
