import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 *
 * Usage: Add to routes that require authentication
 * Token should be provided in Authorization header as "Bearer <token>"
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "default-secret";

    const decoded = jwt.verify(token, secret) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Authorization middleware factory
 * Checks if authenticated user has required role
 *
 * @param allowedRoles - Array of roles that can access the route
 *
 * Role hierarchy (as documented in README):
 * - customer: basic user, can view products and place orders
 * - admin: can manage products and view all orders
 * - superadmin: full access to all resources
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    return next();
  };
};

// TODO: Implement token refresh mechanism
// TODO: Add support for multiple authentication strategies (OAuth, API keys)
