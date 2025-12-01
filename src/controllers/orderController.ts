import { Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/auth";

/**
 * Create a new order
 * POST /api/orders
 * Requires authentication
 * Body: { items: [{ product, quantity }], shippingAddress, paymentMethod }
 */
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user?.id;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must contain at least one item" });
    }

    // Validate products and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product ${item.product} not found` });
      }

      if (!product.isActive) {
        return res
          .status(400)
          .json({ error: `Product ${product.name} is not available` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for product ${product.name}`,
        });
      }

      // Calculate item total
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "pending",
      paymentStatus: "pending",
    });

    await order.save();

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });

    // TODO: Send order confirmation email
    // TODO: Initiate payment processing
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get user's orders
 * GET /api/orders/my-orders
 * Requires authentication
 */
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get order by ID
 * GET /api/orders/:id
 * Requires authentication
 */
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const order = await Order.findById(id).populate("items.product");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Users can only view their own orders, unless they're admin
    if (
      order.user.toString() !== userId &&
      userRole !== "admin" &&
      userRole !== "superadmin"
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get all orders
 * GET /api/orders
 * Requires admin role
 */
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate("user", "email firstName lastName")
      .populate("items.product")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    return res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update order status
 * PATCH /api/orders/:id/status
 * Requires admin role
 * Body: { status }
 */
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json({
      message: "Order status updated successfully",
      order,
    });

    // TODO: Send status update notification to user
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Cancel order
 * POST /api/orders/:id/cancel
 * Requires authentication (user can cancel own orders)
 */
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Only order owner can cancel
    if (order.user.toString() !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Can only cancel pending orders
    if (order.status !== "pending") {
      return res.status(400).json({
        error: "Can only cancel pending orders",
      });
    }

    order.status = "cancelled";
    await order.save();

    // TODO: Restore product stock when order is cancelled
    // TODO: Process refund if payment was completed

    return res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
