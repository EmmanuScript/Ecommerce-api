import { Request, Response, NextFunction } from "express";

/**
 * Global error handling middleware
 * Handles all errors thrown in the application
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
      details: err.errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      error: "Duplicate Entry",
      message: "Resource already exists",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid Token",
      message: "Authentication token is invalid",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token Expired",
      message: "Authentication token has expired",
    });
  }

  // TODO: Add specific error handling for payment processing errors
  // TODO: Add logging to external service (e.g., Sentry)

  // Default error response
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    error: err.name || "Internal Server Error",
    message: err.message || "Something went wrong",
  });
};
