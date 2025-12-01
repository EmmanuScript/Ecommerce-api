import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

/**
 * All order routes require authentication
 * Orders are sensitive and should only be accessed by authenticated users
 */

/**
 * Customer routes - authenticated users can manage their own orders
 */
router.post("/", authenticate, createOrder);
router.get("/my-orders", authenticate, getMyOrders);
router.get("/:id", authenticate, getOrderById);
router.post("/:id/cancel", authenticate, cancelOrder);

/**
 * Admin routes - require admin role to view all orders
 */
router.get("/", authenticate, authorize("admin", "superadmin"), getAllOrders);

/**
 * Admin routes - manage order status
 * Note: Status updates require admin privileges
 */
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin", "superadmin"),
  updateOrderStatus
);

// TODO: Add route for processing refunds (admin only)
// TODO: Add route for generating invoices

export default router;
