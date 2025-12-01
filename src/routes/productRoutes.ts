import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

/**
 * Public routes - anyone can view products
 */
router.get("/", getAllProducts);
router.get("/:id", getProductById);

/**
 * Protected routes - require admin role
 * Product management (create, update, delete) requires admin privileges
 * Following the authorization pattern: admin and superadmin can manage products
 */
router.post("/", authenticate, authorize("admin", "superadmin"), createProduct);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  updateProduct
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  deleteProduct
);

export default router;
