import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
} from "../controllers/userController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

/**
 * Public routes - no authentication required
 */
router.post("/register", register);
router.post("/login", login);

/**
 * Protected routes - require authentication
 * Following the pattern established in the auth middleware:
 * - All authenticated users can access their own profile
 */
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

/**
 * Admin routes - require admin or superadmin role
 * As documented in auth.ts, role hierarchy is:
 * customer < admin < superadmin
 */
router.get("/", authenticate, authorize("admin", "superadmin"), getAllUsers);

/**
 * Superadmin only routes
 * User deletion requires highest privilege level
 */
router.delete("/:id", authenticate, authorize("superadmin"), deleteUser);

export default router;
