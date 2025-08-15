/**
 * Format a number to American style with k, M, B suffixes
 * @param {number} num - The number to format
 * @param {number} digits - Number of decimal places (default: 1)
 * @returns {string} Formatted number
 */
export const formatAmericanStyle = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
};

/**
 * Format a currency value with $ symbol and American style suffixes
 * @param {number} num - The number to format
 * @param {number} digits - Number of decimal places (default: 1)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}; 

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
};