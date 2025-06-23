/**
 * Formats a number as currency based on the specified currency code
 * @param amount The amount to format
 * @param currency The currency code (NGN or GHS)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = currency === 'NGN' ? '₦' : 'GH₵';
  return `${symbol}${amount.toLocaleString()}`;
};