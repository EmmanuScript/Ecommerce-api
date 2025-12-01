import { Request, Response } from "express";
import Product from "../models/Product";

/**
 * Get all products
 * GET /api/products
 * Query params: category, search, page, limit
 */
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    const query: any = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    return res.json({
      products,
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
 * Get product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new product
 * POST /api/products
 * Requires admin role
 * Body: { name, description, price, category, stock, imageUrl }
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });

    await product.save();

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update product
 * PUT /api/products/:id
 * Requires admin role
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Delete product
 * DELETE /api/products/:id
 * Requires admin role
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - just mark as inactive
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// TODO: Implement product image upload functionality
// TODO: Add product review and rating system
// TODO: Implement inventory management (low stock alerts)
