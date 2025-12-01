/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for validation failures
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

/**
 * Error for authentication failures
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

/**
 * Error for authorization failures
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403);
    this.name = "AuthorizationError";
  }
}

/**
 * Error for resource not found
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
