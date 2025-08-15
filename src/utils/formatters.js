/**
 * Format a number to American style with k, M, B suffixes
 * @param {number} num - The number to format
 * @param {number} digits - Number of decimal places (default: 1)
 * @returns {string} Formatted number
 */
export const formatAmericanStyle = (num, digits = 1) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  
  const absNum = Math.abs(Number(num));
  
  if (absNum >= 1.0e+9) {
    // Billions
    return (Math.sign(num) * (absNum / 1.0e+9)).toFixed(digits) + 'B';
  } else if (absNum >= 1.0e+6) {
    // Millions
    return (Math.sign(num) * (absNum / 1.0e+6)).toFixed(digits) + 'M';
  } else if (absNum >= 1.0e+3) {
    // Thousands
    return (Math.sign(num) * (absNum / 1.0e+3)).toFixed(digits) + 'K';
  } else {
    return absNum.toFixed(digits);
  }
};

/**
 * Format a currency value with $ symbol and American style suffixes
 * @param {number} num - The number to format
 * @param {number} digits - Number of decimal places (default: 1)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (num, digits = 1) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '$0';
  }
  
  return '$' + formatAmericanStyle(num, digits);
}; 

export const formatAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-6)}` : '-';
};