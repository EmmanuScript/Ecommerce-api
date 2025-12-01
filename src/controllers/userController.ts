import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

/**
 * Register a new user
 * POST /api/users/register
 * Body: { email, password, firstName, lastName }
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: "customer", // Default role
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Login user
 * POST /api/users/login
 * Body: { email, password }
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } as jwt.SignOptions
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get user profile
 * GET /api/users/profile
 * Requires authentication
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update user profile
 * PUT /api/users/profile
 * Requires authentication
 * Body: { firstName, lastName }
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { firstName, lastName },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "Profile updated successfully", user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get all users
 * GET /api/users
 * Requires admin role
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Delete user
 * DELETE /api/users/:id
 * Requires superadmin role
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// TODO: Implement password reset functionality
// TODO: Implement email verification
// TODO: Add account deactivation endpoint (instead of deletion)
