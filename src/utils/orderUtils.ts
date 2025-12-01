/**
 * Utility function to format currency values
 * @param amount - Amount in cents or smallest currency unit
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 *
 * TODO: Implement proper multi-currency support
 * Currently only handles USD
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Calculate order total including tax and shipping
 * @param subtotal - Order subtotal
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @param shippingCost - Shipping cost
 * @returns Total amount
 *
 * TODO: Implement tax calculation based on shipping address
 * Different states/countries have different tax rates
 */
export const calculateOrderTotal = (
  subtotal: number,
  taxRate: number = 0,
  shippingCost: number = 0
): number => {
  const tax = subtotal * taxRate;
  return subtotal + tax + shippingCost;
};

/**
 * Generate a random order number
 * @returns Order number string
 */
export const generateOrderNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};
