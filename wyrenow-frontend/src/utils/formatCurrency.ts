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

export const formatCurrencyPackage = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculatePackagePrice = (pv: number, country: Country): number => {
  return pv * country.pvRate;
};
// bottles
// : 
// 2
// country_code
// : 
// "NG"
// country_name
// : 
// "Nigeria"
// created_at
// : 
// "2025-07-03 11:28:27"
// currency
// : 
// "Nigerian Naira"
// currency_symbol
// : 
// "₦"
// description
// : 
// "Entry-level package perfect for beginners"
// id
// : 
// 1
// name
// : 
// "Starter Pack"
// package_type
// : 
// "starter"
// price
// : 
// 60000
// product_pv_rate
// : 
// "1200.00"
// pv
// : 
// 50
// status
// : 
// "active"