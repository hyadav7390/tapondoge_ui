// Add these constants at the top of the file
const DOGE_NETWORK = 'livenet';
const DERIVATION = "m/44'/3'/0'/0/0";
const NUM_RETRIES = 3;
const INSCRIPTION_FEE = 3;
const INSCRIPTION_FEE_ADDRESS = "DRfN11nSNTo1stNxkehQ34Zh3UwSpFAwiU";
const TEMP_WALLET_ADDRESS = "DF7BJ1fgVAoRZ3xSBMqYUU1Lxm8yoGDaZh";
const SFM_POLL_FEE_ADDRESS = "DJY7sZk8VBTaAchhnYkT2SF7CyS3raJZwV";

// const BASE_URL = "http://localhost:3000/api/tod";
// const API_BASE_URL = 'http://localhost:3000/api/tod';
const BASE_URL = "https://newapi.tapondoge.com/api/tod";
const API_BASE_URL = 'https://newapi.tapondoge.com/api/tod';

const UTXO_CACHE_DURATION = 36000000 * 24; // 1 Hour
const UTXO_FORCE_REFRESH_EVENTS = new Set(['SEND_TRANSACTION', 'RECEIVE_TRANSACTION']);
const MAX_SOCHAIN_CALLS_PER_SESSION = 5000;
const UTXO_SYNC_DELAY = 10000; // 10 seconds wait for blockchain sync

// Add an object to store different fee types
const INSCRIPTION_FEES = {
    INSCRIBE: 1
};
const BASE_API_URL = "https://tap.tapondoge.com";

const API_ERROR_MSG = "We are experiencing some error at our end. Please try later";

// Add these constants at the top of the file
const TOKENS_CACHE_KEY = 'tapondoge_tokens_cache';
const TOKENS_RECENT_CACHE_KEY = 'tapondoge_recent_tokens_cache';
const TOKENS_CACHE_DURATION = 10 * 60 * 1000; // 5 minutes in milliseconds

// Export all constants as a single object
export const Constants = {
    DOGE_NETWORK,
    DERIVATION,
    NUM_RETRIES,
    INSCRIPTION_FEE,
    INSCRIPTION_FEE_ADDRESS,
    TEMP_WALLET_ADDRESS,
    SFM_POLL_FEE_ADDRESS,
    BASE_URL,
    API_BASE_URL,
    UTXO_CACHE_DURATION,
    UTXO_FORCE_REFRESH_EVENTS,
    MAX_SOCHAIN_CALLS_PER_SESSION,
    UTXO_SYNC_DELAY,
    INSCRIPTION_FEES,
    BASE_API_URL,
    API_ERROR_MSG,
    TOKENS_CACHE_KEY,
    TOKENS_RECENT_CACHE_KEY,
    TOKENS_CACHE_DURATION
};
