export const Constants = {
  DOGE_NETWORK: 'livenet',
  DERIVATION: "m/44'/3'/0'/0/0",
  NUM_RETRIES: 3,
  INSCRIPTION_FEE: 3,
  INSCRIPTION_FEE_ADDRESS: "DRfN11nSNTo1stNxkehQ34Zh3UwSpFAwiU",
  TEMP_WALLET_ADDRESS: "DF7BJ1fgVAoRZ3xSBMqYUU1Lxm8yoGDaZh",
  SFM_POLL_FEE_ADDRESS: "DJY7sZk8VBTaAchhnYkT2SF7CyS3raJZwV",
  
  // API URLs - matching JavaScript version exactly
  BASE_URL: "https://api.tapondoge.com/api/tod",
  API_BASE_URL: 'https://api.tapondoge.com/api/tod',
  BASE_API_URL: "https://tap.tapondoge.com",
  
  // Cache settings
  UTXO_CACHE_DURATION: 3600000, // 1 Hour
  MAX_SOCHAIN_CALLS_PER_SESSION: 5000,
  UTXO_SYNC_DELAY: 10000, // 10 seconds wait for blockchain sync
  
  // Inscription fees
  INSCRIPTION_FEES: {
    INSCRIBE: 1
  },
  
  // Error messages
  API_ERROR_MSG: "We are experiencing some error at our end. Please try later",
  
  // Cache keys
  TOKENS_CACHE_KEY: 'tapondoge_tokens_cache',
  TOKENS_RECENT_CACHE_KEY: 'tapondoge_recent_tokens_cache',
  TOKENS_CACHE_DURATION: 10 * 60 * 1000, // 5 minutes in milliseconds
  
  // External APIs
  COINGECKO_API_URL: 'https://api.coingecko.com/api/v3',
  SOCHAIN_API_URL: 'https://sochain.com/api/v2',
  
  // Social links
  SOCIAL_LINKS: {
    DISCORD: 'https://discord.gg/CHbTua4UZj',
    TWITTER: 'https://x.com/tapondogehq'
  }
};

// Format number function
export const formatNumber = (num, decimals = 1) => {
  if (isNaN(num) || num === null) return "0";

  const absNum = Math.abs(num);
  let formattedNum;
  let suffix;

  if (absNum >= 1e9) {
    // Billions (Bn)
    formattedNum = (num / 1e9).toFixed(decimals);
    suffix = "Bn";
  } else if (absNum >= 1e6) {
    // Millions (Mn)
    formattedNum = (num / 1e6).toFixed(decimals);
    suffix = "Mn";
  } else if (absNum >= 1e3) {
    // Thousands (K)
    formattedNum = (num / 1e3).toFixed(decimals);
    suffix = "K";
  } else {
    // Less than 1,000
    formattedNum = num.toFixed(decimals);
    suffix = "";
  }

  // Remove trailing zeros and decimal point if unnecessary
  formattedNum = Number(formattedNum).toString();

  return `${formattedNum}${suffix}`;
};
