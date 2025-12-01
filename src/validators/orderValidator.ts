import Joi from "joi";

/**
 * Validation schema for order items
 */
const orderItemSchema = Joi.object({
  product: Joi.string().required(), // MongoDB ObjectId as string
  quantity: Joi.number().integer().min(1).required(),
});

/**
 * Validation schema for shipping address
 *
 * TODO: Add country-specific zip code validation
 * Different countries have different zip code formats
 */
const shippingAddressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  country: Joi.string().required(),
});

/**
 * Validation schema for creating an order
 *
 * Supported payment methods (as per README):
 * - credit_card
 * - debit_card
 * - paypal
 */
export const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),
  shippingAddress: shippingAddressSchema.required(),
  paymentMethod: Joi.string()
    .valid("credit_card", "debit_card", "paypal")
    .required(),
});

/**
 * Validation schema for updating order status
 *
 * Valid status transitions (as documented in README):
 * pending -> processing -> shipped -> delivered
 * Any status can transition to cancelled
 */
export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required(),
});

// TODO: Add validation for order status transitions
// Not all transitions should be allowed (e.g., delivered -> pending)
