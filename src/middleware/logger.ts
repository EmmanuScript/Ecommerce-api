import { Request, Response, NextFunction } from "express";

/**
 * Simple request logger middleware
 * Logs incoming requests with timestamp, method, and path
 */
export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  // TODO: Add response time tracking
  // TODO: Add user identification in logs (if authenticated)
  // TODO: Implement structured logging format

  return next();
};
