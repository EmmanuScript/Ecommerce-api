import Joi from "joi";

/**
 * Validation schema for user registration
 *
 * Requirements (as per security best practices):
 * - Email must be valid format
 * - Password must be at least 6 characters
 * - First name and last name are required
 *
 * TODO: Enhance password validation to require:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
});

/**
 * Validation schema for user login
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * Validation schema for profile update
 */
export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
});
