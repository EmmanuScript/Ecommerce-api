import Joi from "joi";

/**
 * Validation schema for creating a product
 *
 * Valid categories (as documented in README):
 * - electronics
 * - clothing
 * - books
 * - home
 * - sports
 */
export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).max(1000).required(),
  price: Joi.number().positive().precision(2).required(),
  category: Joi.string()
    .valid("electronics", "clothing", "books", "home", "sports")
    .required(),
  stock: Joi.number().integer().min(0).required(),
  imageUrl: Joi.string().uri().optional(),
  // TODO: Add validation for image URL format
  // TODO: Validate that imageUrl points to allowed domains
});

/**
 * Validation schema for updating a product
 * All fields are optional for update
 */
export const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(200),
  description: Joi.string().min(10).max(1000),
  price: Joi.number().positive().precision(2),
  category: Joi.string().valid(
    "electronics",
    "clothing",
    "books",
    "home",
    "sports"
  ),
  stock: Joi.number().integer().min(0),
  imageUrl: Joi.string().uri(),
  isActive: Joi.boolean(),
});
