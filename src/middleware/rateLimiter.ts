import rateLimit from "express-rate-limit";

/**
 * Rate limiter configuration
 * Limits requests per IP address to prevent abuse
 *
 * Configuration based on environment variables:
 * - RATE_LIMIT_WINDOW_MS: Time window in milliseconds
 * - RATE_LIMIT_MAX_REQUESTS: Maximum requests per window
 */
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// TODO: Implement different rate limits for different endpoints
// TODO: Add authentication-based rate limiting (higher limits for authenticated users)
// TODO: Add Redis support for distributed rate limiting in production
