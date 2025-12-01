/**
 * Application configuration constants
 *
 * This file contains default configuration values.
 * These can be overridden by environment variables.
 */

export const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || "development",
  },

  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
    options: {
      // TODO: Add connection pooling options
      // TODO: Add retry configuration for production
    },
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || "default-secret-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    // TODO: Add refresh token configuration
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    // TODO: Configure different limits for authenticated vs unauthenticated users
  },

  // Pagination defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
    // Note: Some endpoints use limit: 20, should be standardized
  },

  // File upload configuration (not yet implemented)
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"],
    // TODO: Implement file upload functionality
  },

  // Email configuration (not yet implemented)
  email: {
    from: process.env.EMAIL_FROM || "noreply@example.com",
    // TODO: Add SMTP configuration
    // TODO: Add email templates
  },

  // Payment configuration (not yet implemented)
  payment: {
    currency: "USD",
    // TODO: Add payment gateway configuration
    // Supported methods defined in Order model
  },

  // Security configuration
  security: {
    bcryptRounds: 10,
    passwordMinLength: 6,
    // TODO: Add password complexity requirements (as per validator TODOs)
    // Should require: uppercase, lowercase, number
  },

  // Order configuration
  order: {
    cancellationWindow: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    // TODO: Enforce cancellation window in cancelOrder function
  },

  // Product configuration
  product: {
    categories: ["electronics", "clothing", "books", "home", "sports"],
    // This matches the enum in productValidator.ts
    defaultCategory: "electronics",
  },

  // User roles (must match auth middleware)
  roles: {
    customer: "customer",
    admin: "admin",
    superadmin: "superadmin",
    // Role hierarchy: customer < admin < superadmin
  },
};

export default config;
