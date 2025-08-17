import axios from 'axios';
import { Constants } from '@/utils/constants';
import { callSoChainForData, getBestBlockHash, getTokensBalance } from './service';

// --- Constants ---
const DOGE_NETWORK = 'livenet';
const DERIVATION = Constants.DERIVATION || "m/44'/3'/0'/0/0";
const UTXO_CACHE_DURATION = Constants.UTXO_CACHE_DURATION || 5 * 60 * 1000; // 5 minutes
const MAX_SOCHAIN_CALLS_PER_SESSION = Constants.MAX_SOCHAIN_CALLS_PER_SESSION || 100;
const INSCRIPTION_FEE_ADDRESS = Constants.INSCRIPTION_FEE_ADDRESS;
const BASE_API_URL = Constants.BASE_API_URL;
const INSCRIPTION_FEES = {
  INSCRIBE: 1, // 1 DOGE
  TRANSFER: 0.5, // 0.5 DOGE
  MINT: 0.5 // 0.5 DOGE
};

// Set up bitcore like the reference code
if (typeof window !== 'undefined' && window.bitcore) {
  window.bitcore.Transaction.DUST_AMOUNT = 10000;
}
const Mnemonic = typeof window !== 'undefined' ? window.Mnemonic : null;

// --- Credential Generation ---

/**
 * Creates credentials from an existing Dogecoin private key in WIF format.
 * @param {string} privateKeyWIF - The private key in Wallet Import Format.
 */
export function createCredentialsFromPrivateKey(privateKeyWIF) {
  console.log('Creating credentials from private key WIF...');
  try {
    if (typeof window === 'undefined' || !window.bitcore) {
      throw new Error('Bitcore library not loaded. Please refresh the page.');
    }
    
    const privateKey = new window.bitcore.PrivateKey(privateKeyWIF, DOGE_NETWORK);
    const address = privateKey.toAddress(DOGE_NETWORK).toString();

    console.log('Derived address from Private Key:', address);

    return {
      privateKey: privateKey,
      address: address,
      wif: privateKeyWIF,
      mnemonic: null,
      mnemonicString: null,
      derivation: DERIVATION,
    };
  } catch (error) {
    console.error('Error creating credentials from private key WIF:', error);
    throw new Error('Failed to create credentials from private key: ' + error.message);
  }
}

/**
 * Creates credentials by deriving keys from a BIP39 mnemonic phrase.
 * @param {string} mnemonicText - The 12 or 24-word mnemonic phrase.
 */
export function createCredentialsFromMnemonic(mnemonicText) {
  console.log('Creating credentials from mnemonic...');
  try {
    if (typeof window === 'undefined' || !window.Mnemonic) {
      throw new Error('Mnemonic library not loaded. Please refresh the page.');
    }
    
    if (typeof window === 'undefined' || !window.bitcore) {
      throw new Error('Bitcore library not loaded. Please refresh the page.');
    }
    
    if (!window.Mnemonic.isValid(mnemonicText)) {
      throw new Error('Invalid mnemonic phrase');
    }
    const mnemonic = new window.Mnemonic(mnemonicText);

    // Convert the mnemonic to an HDPrivateKey
    const hdPrivateKey = mnemonic.toHDPrivateKey();
  
    // Derive the private key using the specified derivation path
    const derivedPrivateKey = hdPrivateKey.deriveChild(DERIVATION).privateKey;
    
    const privateKey = derivedPrivateKey.toString();
    const address = new window.bitcore.PrivateKey(privateKey).toAddress().toString();
    
    return {
      privateKey: privateKey,
      mnemonic: mnemonic,
      mnemonicString: mnemonicText,
      derivation: DERIVATION,
      address: address
    };
  } catch (error) {
    console.error('Error creating credentials from mnemonic:', error);
    throw new Error('Error creating credentials from mnemonic: ' + error.message);
  }
}

/**
 * Generates new random credentials including a new BIP39 mnemonic phrase.
 */
export async function generateRandomCredentialsWithMnemonic(existingMnemonic = null) {
    try {
        if (typeof window === 'undefined' || !window.Mnemonic) {
            throw new Error('Mnemonic library not loaded. Please refresh the page.');
        }
        
        if (typeof window === 'undefined' || !window.bitcore) {
            throw new Error('Bitcore library not loaded. Please refresh the page.');
        }
        
        // Generate new mnemonic if not provided
        const mnemonic = existingMnemonic || new window.Mnemonic();
        const mnemonicPhrase = mnemonic.toString();
        // Convert the mnemonic to an HDPrivateKey
        const hdPrivateKey = mnemonic.toHDPrivateKey();
      
        // Derive the private key using the specified derivation path
        const derivedPrivateKey = hdPrivateKey.deriveChild(DERIVATION).privateKey;  
        const privateKey = derivedPrivateKey.toString();
        
        const address = new window.bitcore.PrivateKey(privateKey).toAddress().toString();
        return {
          privateKey: derivedPrivateKey.toString(),
          mnemonic: mnemonicPhrase,
          derivationPath: DERIVATION,
          address: address
        };
    } catch (error) {
        console.error('Error generating random credentials:', error);
        throw error;
    }
}



// --- Wallet Class ---
export class Wallet {
  constructor(credentials) {
    if (!credentials || !credentials.privateKey || !credentials.address) {
      console.error('Wallet constructor called with invalid or incomplete credentials');
      throw new Error('Valid credentials (including PrivateKey object and address) are required to initialize Wallet.');
    }
    // Store credentials in memory - DO NOT PERSIST PRIVATE KEY TO LOCALSTORAGE
    this.credentials = credentials;
    this.address = credentials.address;
    this.wif = credentials.wif;
    this.mnemonicString = credentials.mnemonicString;
    this.balance = 0;
    this.utxos = [];
    this.isLoading = false;

    // State
    this.initialized = false;
    this.acceptedTerms = localStorage.getItem("accepted_terms") === 'true'; // Load acceptance status
    this.hasAllPermissions = undefined;
    this.blockedTransferables = [];
    this.balances = []; // For tokens/DRC-20 etc.
    this.transactions = [];
    this.inscriptions = {}; // Map of inscriptions linked to UTXOs

    // API Rate Limiting State
    this.soChainCallCount = parseInt(localStorage.getItem('soChainCallCount') || '0');
    this.lastSoChainReset = parseInt(localStorage.getItem('lastSoChainReset') || '0');
    this.isBlocked = false; // For token transfer blocks
  }

  // --- Wallet State & Management ---

  getWalletAddress() {
    return this.address;
  }

  getWalletPrivateKey() {
    // WARNING: Exposing the PrivateKey object. Handle with extreme care.
    if (!this.credentials || !this.credentials.privateKey) return null;
    return this.credentials.privateKey; // Return the bitcore.PrivateKey object
  }

  getWalletPrivateKeyWIF() {
     // WARNING: Exposing the WIF. Handle with extreme care.
    if (!this.credentials || !this.credentials.wif) return null;
    return this.credentials.wif;
  }

  /**
   * Loads non-sensitive data like terms acceptance.
   * Does NOT load private keys from storage.
   */
  loadState() {
    console.log("Loading wallet state (terms acceptance)...");
    this.acceptedTerms = localStorage.getItem("accepted_terms") === 'true';
    // Consider loading cached public data like address if needed, but credentials must be provided securely.
    this.initialized = true; // Mark as initialized after loading state
  }

  /**
   * Saves terms acceptance status to localStorage.
   */
  async acceptTerms() {
    console.log("Accepting terms...");
    localStorage.setItem('accepted_terms', 'true');
    this.acceptedTerms = true;
  }

  /**
   * Stores non-sensitive credential info (mnemonic, derivation path, address) to localStorage.
   * WARNING: Does NOT store the private key. Storing mnemonics is still a risk.
   * @param {object} credentials - The credentials object.
   */
  async storePublicCredentials(credentials) {
     if (!credentials || !credentials.address) {
       console.error("Cannot store public credentials without an address.");
       return;
     }
     console.log("Storing public credentials (address, potentially mnemonic)...");
     localStorage.setItem("walletAddress", credentials.address);
     if (credentials.mnemonicString && credentials.derivation) {
        // Storing mnemonic is risky - use with caution and inform the user.
        localStorage.setItem("mnemonic", credentials.mnemonicString);
        localStorage.setItem("derivation", credentials.derivation);
        console.warn("Mnemonic stored in localStorage. This has security implications.");
     } else {
        localStorage.removeItem("mnemonic");
        localStorage.removeItem("derivation");
     }
  }

  /**
   * Refreshes UTXOs for the wallet address from the backend API, managing cache and rate limits.
   * @param {boolean} force - If true, bypasses cache duration check.
   */
  async refreshUtxos(force = false) {
    console.log(`refreshUtxos called (force=${force})`);
    try {
      const shouldRefresh = await this.shouldRefreshUtxos(force);
      const cachedUtxos = await this.getLocalUtxos(); // Check cache first

      if (!shouldRefresh && cachedUtxos) {
        console.log("Using cached UTXOs.");
        this.utxos = cachedUtxos;
        return this.utxos;
      }

      console.log("Refreshing UTXOs from API...");
      await this.trackSoChainCall(); // Check and increment rate limit counter
      let fetchedUtxos = [];
      let done = false;

        try {
          const address = this.getWalletAddress();
          const respData = await callSoChainForData(address);
          console.log('response', respData);
          console.log('aaaa', !respData , !respData.data , !Array.isArray(respData.data.outputs))
          // Ensure structure is as expected
          if (!respData || !respData.data || !Array.isArray(respData.data.outputs)) {
              console.error('Unexpected API response structure:', respData);
              throw new Error('Invalid UTXO data structure received from API.');
          }

          const outputs = respData.data.outputs;
          if (outputs.length === 0) {
            done = true;
          } else {
            const partial_utxos = outputs.map(output => ({
              txid: output.txid,
              vout: output.vout,
              satoshis: parseFloat(output.value),
              lastUpdated: Date.now()
            }));
             fetchedUtxos.push(...partial_utxos);
          }

        } catch (error) {
          console.error('Error fetching UTXOs', error);
          done = true;
        }

      try {
        await getBestBlockHash();
      } catch (blockHashError) {
        console.error("Failed to verify blockchain sync state:", blockHashError.message);
      }

      // Update cache
      const now = Date.now();
      localStorage.setItem('lastUtxoRefresh', now.toString());
      localStorage.setItem('cachedUtxos', JSON.stringify(fetchedUtxos)); // Cache the successfully fetched UTXOs
      console.log(`UTXOs refreshed and cached. Count: ${fetchedUtxos.length}`);

      this.utxos = fetchedUtxos;
      let balance = fetchedUtxos.reduce((prev, curr) => prev + curr.satoshis, 0) / 100000000;
      this.balance = balance;
      console.log('Doge Account balance', balance);
      return this.utxos;

    } catch (error) {
      console.error('refreshUtxos failed:', error.message);
      // Fallback to potentially stale cached UTXOs if available on error
      const cachedUtxos = await this.getLocalUtxos();
      if (cachedUtxos) {
        console.warn("Falling back to cached UTXOs due to refresh error.");
        this.utxos = cachedUtxos;
        return cachedUtxos;
      }
      // If no cache and refresh failed, re-throw or handle appropriately
      throw error; // Re-throw the error if no fallback is possible/desired
    }
  }

  /**
   * Waits briefly and attempts to refresh UTXOs, useful after broadcasting.
   */
  async waitForUtxoSync(attempts = 3, delay = 3000) {
    console.log(`Waiting for UTXO sync (attempts: ${attempts}, delay: ${delay}ms)...`);
    for (let i = 0; i < attempts; i++) {
      await new Promise(resolve => setTimeout(resolve, delay));
      try {
        console.log(`Sync attempt ${i + 1}/${attempts}...`);
        await this.refreshUtxos(true); // Force refresh
        console.log("UTXO sync successful.");
        return; // Exit loop on success
      } catch (error) {
        console.warn(`Attempt ${i + 1}/${attempts} to sync UTXOs failed:`, error.message);
        if (i === attempts - 1) {
           console.error("Failed to sync UTXOs after multiple attempts.");
           // Optionally re-throw or handle the final failure
        }
      }
    }
  }

  // --- Caching & Rate Limiting Helpers ---

  async trackSoChainCall() {
    const now = Date.now();
    // Reset counter if 24 hours have passed
    if (now - this.lastSoChainReset > 24 * 60 * 60 * 1000) {
      this.soChainCallCount = 0;
      this.lastSoChainReset = now;
      localStorage.setItem('lastSoChainReset', now.toString());
    }

    if (this.soChainCallCount >= MAX_SOCHAIN_CALLS_PER_SESSION) {
      console.warn("Daily SoChain API limit reached.");
      throw new Error('Daily SoChain API limit reached. Please try again later.');
    }

    this.soChainCallCount++;
    localStorage.setItem('soChainCallCount', this.soChainCallCount.toString());
  }

  async getLocalUtxos() {
    const cachedData = localStorage.getItem('cachedUtxos');
    if (cachedData) {
      try {
        return JSON.parse(cachedData);
      } catch (e) {
        console.error("Failed to parse cached UTXOs:", e);
        localStorage.removeItem('cachedUtxos');
        return null;
      }
    }
    return null;
  }

  async shouldRefreshUtxos(force = false) {
    if (force) return true;
    const lastRefresh = parseInt(localStorage.getItem('lastUtxoRefresh') || '0');
    const now = Date.now();

    if (!lastRefresh) return true;
    if (now - lastRefresh > UTXO_CACHE_DURATION) return true;
    console.log("UTXO cache is still fresh.");
    return false;
  }

  async refreshDoginals() {
    const { inscriptionIds, inscriptionOutpoints } = await this.refreshInscriptionIds();
    await this.refreshInscriptionContent(inscriptionIds, inscriptionOutpoints);
  }

  async refreshInscriptionIds() {
    const keys = this.utxos.map(utxo => `inscriptions_at_${utxo.txid}:${utxo.vout}`);
    const inscriptionIdsPerOutput = {};
    const allInscriptionIds = [];
    const inscriptionOutpoints = [];

    // Load cached inscriptions
    keys.forEach(key => {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        inscriptionIdsPerOutput[key] = JSON.parse(storedData);
      }
    });

    // Fetch missing inscriptions
    for (const [index, utxo] of this.utxos.entries()) {
      const key = `inscriptions_at_${utxo.txid}:${utxo.vout}`;
      
      if (!inscriptionIdsPerOutput[key]) {
        try {
          const resp = await fetch(`https://wonky-ord.dogeord.io/output/${utxo.txid}:${utxo.vout}`);
          const html = await resp.text();

          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const main = doc.getElementsByTagName("main")[0];
          const list = main.getElementsByTagName("dl")[0];
          const thumbnails = Array.from(list.getElementsByTagName("dd"))
            .filter(x => x.className === "thumbnails");
          
          const inscriptionIds = thumbnails.map(x => 
            x.getElementsByTagName("a")[0].getAttribute("href").split("/shibescription/")[1]
          );

          inscriptionIdsPerOutput[key] = inscriptionIds;

          if (inscriptionIds.length) {
            localStorage.setItem(key, JSON.stringify(inscriptionIds));
          }
        } catch (error) {
          console.warn('Error fetching inscription IDs:', error);
          continue;
        }
      }

      // Add to final lists
      if (inscriptionIdsPerOutput[key]) {
        inscriptionIdsPerOutput[key].forEach(id => {
          allInscriptionIds.push(id);
          inscriptionOutpoints.push(`${utxo.txid}:${utxo.vout}`);
        });
      }
    }

    return { inscriptionIds: allInscriptionIds, inscriptionOutpoints };
  }

  async refreshInscriptionContent(inscriptionIds, inscriptionOutpoints) {
    const keys = inscriptionIds.map(x => `inscription_${x}`);
    const inscriptions = {};

    // Load cached content
    keys.forEach(key => {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        inscriptions[key] = JSON.parse(storedData);
      }
    });

    // Fetch missing content
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!inscriptions[key]) {
        try {
          const inscriptionId = inscriptionIds[i];
          const url = `https://wonky-ord.dogeord.io/content/${inscriptionId}`;
          const resp = await fetch(url);
          const blob = await resp.blob();
          
          const data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function() { resolve(this.result); };
            reader.readAsDataURL(blob);
          });

          if (data && data.toLowerCase().startsWith("data:text")) {
            const text = await decodeInscriptionData(data);
            
            const inscription = {
              id: inscriptionId,
              data,
              outpoint: inscriptionOutpoints[i]
            };

            inscriptions[key] = inscription;
            localStorage.setItem(key, JSON.stringify(inscription));
          }
        } catch (error) {
          console.warn('Error fetching inscription content:', error);
          continue;
        }
      }
    }

    this.inscriptions = inscriptions;
  }
}

// --- Wallet Initialization & State Refresh ---

/**
 * Initializes a Wallet instance with provided credentials and fetches initial state.
 * @param {object} credentials - Securely obtained credentials object.
 */
export async function initializeWallet(credentials) {
  try {
    const wallet = new Wallet(credentials);
    // Load non-sensitive state (like terms acceptance)
    wallet.loadState();
    await refreshWalletState(wallet);
    wallet.initialized = true;
    return wallet;
  } catch (error) {
    console.error('Error initializing wallet:', error);
    throw error;
  }
}

/**
 * Refreshes the dynamic state of a given wallet instance from the API.
 * @param {Wallet} wallet - The wallet instance to refresh.
 */
export async function refreshWalletState(wallet) {
  if (!wallet || !wallet.getWalletAddress()) {
    throw new Error('Valid wallet instance required to refresh state.');
  }
  console.log('Refreshing wallet state for:', wallet.getWalletAddress());
  try {
    const refreshPromises = [
      wallet.refreshUtxos(true).catch(e => { console.error("Refresh UTXOs failed:", e.message); return []; }),
      getTokensBalance(wallet.getWalletAddress()).catch(e => { console.error("Refresh Token Balance failed:", e.message); return []; }),
    ];

    const [utxos, balances] = await Promise.all(refreshPromises);
    let TokenBalance = balances.data.list;
    wallet.balances = Array.isArray(TokenBalance) ? TokenBalance : [];

    console.log('Wallet state refreshed successfully.');
    return wallet;

  } catch (error) {
    console.error('Critical error during wallet state refresh:', error);
    throw error;
  }
}

export async function getTransferableInscriptions(ticker, inscriptions) {
  try {
    console.log('getTransferableInscriptions', ticker, inscriptions);
    if (!inscriptions) {
      return [];
    }
    const transferableInscriptions = [];
    
    // Convert Object.keys to Object.entries for proper iteration
    const inscriptionEntries = Object.entries(inscriptions);
    
    // Use map instead of forEach to properly handle promises
    const transferablePromises = inscriptionEntries.map(async ([inscriptionId, inscription]) => {
      try {
        if (inscription.data && inscription.data.toLowerCase().startsWith("data:text")) {
          const text = await decodeInscriptionData(inscription.data);
          if (text.includes('token-transfer')) {
            const data = JSON.parse(text);
            if (data.tick === ticker) { // Changed from tick to ticker to match parameter name
              const idOnly = inscriptionId.split("_")[1];
              try {
                const response = await fetch(`${Constants.BASE_API_URL}/getSingleTransferable/${idOnly}`);
                const valid = await response.json();
                
                if (response.ok && valid.result && valid.result > 0) {
                  const amountToCheck = valid.result / 1e18;
                  if (amountToCheck === parseFloat(data.amt)) {
                    return {
                      inscriptionId,
                      amount: parseFloat(data.amt),
                      data: inscription.data,
                      tick: ticker // Changed from tick to ticker to match parameter name
                    };
                  }
                }
              } catch (error) {
                console.warn("Error in fetching inscription status:", error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error processing inscription:', error);
      }
      return null;
    });

    const results = await Promise.all(transferablePromises);
    
    // Filter out nulls and add to inscriptions array
    results.forEach(result => {
      if (result) transferableInscriptions.push(result);
    });

    console.log('getTransferableInscriptions result', transferableInscriptions);
    return transferableInscriptions;
  } catch (error) {
    console.error('Error getting transferable inscriptions:', error);
    return [];
  }
}

// --- Exports ---
// Export utility functions and the Wallet class
export const WalletUtils = {
  createCredentialsFromPrivateKey,
  createCredentialsFromMnemonic,
  generateRandomCredentialsWithMnemonic,
  initializeWallet,
  refreshWalletState,
  getTransferableInscriptions
  // DO NOT export methods that directly expose the PrivateKey object unless absolutely necessary
};

// Also export the Wallet class directly if needed for type hinting or extension
// export { Wallet };

// Wallet listing functions
export const listTokenForSaleWithWallet = async (inscription, tick, price, amt, wallet) => {
  try {
    if (!wallet || !wallet.credentials || !wallet.utxos) {
      throw new Error('Wallet not properly initialized');
    }

    // Step 1: Refresh UTXOs to get fresh data
    console.log('Step 1: Refreshing UTXOs...');
    await wallet.refreshUtxos(true);
    
    // Step 1.5: Get fresh UTXOs from API (as done in JavaScript reference)
    console.log('Step 1.5: Getting fresh UTXOs from API...');
    const utxosResponse = await fetch(`${Constants.API_BASE_URL}/wallet/utxos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: wallet.address
      })
    });
    const utxosData = await utxosResponse.json();
    
    if (!utxosData.success) {
      throw new Error('Failed to get fresh UTXOs');
    }
    
    // Step 2: Get best block hash to verify blockchain sync
    console.log('Step 2: Getting best block hash...');
    const bestBlockResponse = await fetch(`${Constants.API_BASE_URL}/wallet/bestblock`);
    const bestBlockData = await bestBlockResponse.json();
    
    if (!bestBlockData.success) {
      throw new Error('Failed to verify blockchain sync');
    }

    // Step 3: Get transaction details for the inscription
    console.log('Step 3: Getting transaction details...');
    const txResponse = await fetch(`${Constants.API_BASE_URL}/tx/${inscription.outpoint.split(':')[0]}`);
    const txData = await txResponse.json();
    
    if (!txData.success) {
      throw new Error('Failed to get transaction details');
    }

    // Step 4: Find the inscription UTXO
    const inscriptionUtxo = wallet.utxos.find(x => `${x.txid}:${x.vout}` === inscription.outpoint);
    if (!inscriptionUtxo) {
      throw new Error("Inscription UTXO not found");
    }

    // Step 4.5: Get and set UTXO script (as done in JavaScript reference)
    console.log('Step 4.5: Getting UTXO script...');
    const utxoResponse = await fetch(`${Constants.API_BASE_URL}/tx/${inscriptionUtxo.txid}`);
    const utxoResponseData = await utxoResponse.json();
    
    if (!utxoResponseData.success) {
      throw new Error('Failed to get UTXO transaction data');
    }
    
    const utxoResponseVout = utxoResponseData.data.vout;
    let scriptFound = false;
    
    utxoResponseVout.forEach((item) => {
      if (item.n === inscriptionUtxo.vout && item.addresses.indexOf(wallet.address) > -1) {
        inscriptionUtxo.script = item.hex;
        scriptFound = true;
      }
    });
    
    if (!scriptFound) {
      throw new Error('Failed to find UTXO script for wallet address');
    }

    // Step 5: Create the listing data structure
    // Note: In the JavaScript reference, they create a signed transaction
    // For now, we'll send the minimal required data and let the backend handle the transaction creation
    const listingData = {
      inscriptionId: inscription.inscriptionId,
      tick: tick,
      price: price,
      amt: amt,
      sellerAddress: wallet.address,
      inscriptionUtxo: JSON.stringify([inscriptionUtxo]),
      // The backend will need to handle the transaction creation and signing
      // This is a simplified approach - in production, you'd need the full transaction signing
    };

    console.log('Step 4: Submitting listing...');
    console.log('Listing data:', listingData);
    
    // Call the listing API
    const response = await fetch(`${Constants.API_BASE_URL}/token/list/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listingData)
    });

    const result = await response.json();
    console.log('Listing API response:', result);
    
    if (!response.ok) {
      console.error('Listing API error:', result);
      throw new Error(result.message || result.error || 'Failed to list token');
    }

    if (!result.success) {
      console.error('Listing API failed:', result);
      throw new Error(result.message || 'Failed to list token');
    }

    return result;
  } catch (error) {
    console.error('Error listing token with wallet:', error);
    throw error;
  }
};

export const decodeInscriptionData = (data) => {
    try {
        if (!data) return null;
        
        // Handle data:text format
        if (data.startsWith('data:text')) {
            let parts = data.split(',');
            if (parts.length < 2) return null;
            
            // Get the base64 part
            let base64Data = parts[1];
            
            // Decode base64
            let decodedText = atob(base64Data);
            
            // Handle UTF-8 encoding
            try {
                return decodeURIComponent(escape(decodedText));
            } catch (e) {
                return decodedText;
            }
        }
        
        // If not in data:text format, return null
        return null;
    } catch (error) {
        console.error('Error decoding inscription:', error);
        return null;
    }
};