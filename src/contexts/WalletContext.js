import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeWallet } from '@/utils/wallet';
import { getTokensBalance, callSoChainForData } from '@/utils/service';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

const UTXO_CACHE_DURATION = 30000; // 30 seconds
const MAX_SOCHAIN_CALLS_PER_SESSION = 100;

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [utxos, setUtxos] = useState([]);
  const [soChainCallCount, setSoChainCallCount] = useState(0);
  const [lastSoChainReset, setLastSoChainReset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inscriptions, setInscriptions] = useState([]);

  // Load saved wallet
  useEffect(() => {
    const loadSavedWallet = async () => {
      try {
        const savedData = localStorage.getItem('walletData');
        if (savedData) {
          const { credentials: savedCredentials, address: savedAddress } = JSON.parse(savedData);
          setCredentials(savedCredentials);
          setAddress(savedAddress);
          setIsConnected(true);

          const walletInstance = await initializeWallet(savedCredentials);
          setWallet(walletInstance);

          // Initial refresh of inscriptions
          await walletInstance.refreshDoginals();
          setInscriptions(walletInstance.inscriptions || []);
        }
      } catch (error) {
        console.warn('Error loading saved wallet:', error);
        localStorage.removeItem('walletData');
      }
    };

    loadSavedWallet();
  }, []);

  const refreshUtxos = async (force) => {
    try {
      if (!force) {
        const cachedUtxos = localStorage.getItem('cachedUtxos');
        if (cachedUtxos) {
          const parsedUtxos = JSON.parse(cachedUtxos);
          if (parsedUtxos.length) {
            setUtxos(parsedUtxos);
            return parsedUtxos;
          }
        }
      }

      let allUtxos = [];
      let round = 1;
      let done = false;

      while (!done) {
        try {
          const response = await callSoChainForData(address, round);
          
          if (response?.status === 200 && response?.data?.data?.outputs) {
            const outputs = response.data.data.outputs;
            if (outputs.length === 0) {
              done = true;
              continue;
            }

            const partialUtxos = outputs.map(output => ({
              txid: output.txid,
              vout: output.vout,
              script: output.script,
              satoshis: output.satoshis,
              lastUpdated: Date.now()
            }));

            allUtxos.push(...partialUtxos);
            round++;
          } else {
            // Handle invalid response format
            console.warn('Invalid response format from SoChain API');
            done = true;
          }
        } catch (error) {
          console.error('Error fetching UTXOs:', error);
          // Don't break the UI, use cached data if available
          const cachedUtxos = localStorage.getItem('cachedUtxos');
          if (cachedUtxos) {
            const parsedUtxos = JSON.parse(cachedUtxos);
            setUtxos(parsedUtxos);
            return parsedUtxos;
          }
          // If no cache, return empty array instead of breaking
          setUtxos([]);
          return [];
        }
      }

      // Update cache only if we got valid data
      if (allUtxos.length > 0) {
        localStorage.setItem('lastUtxoRefresh', Date.now().toString());
        localStorage.setItem('cachedUtxos', JSON.stringify(allUtxos));
      }

      setUtxos(allUtxos);
      return allUtxos;
    } catch (error) {
      console.error('RefreshUtxos failed:', error);
      // Fallback to cached data
      const cachedUtxos = localStorage.getItem('cachedUtxos');
      if (cachedUtxos) {
        const parsedUtxos = JSON.parse(cachedUtxos);
        setUtxos(parsedUtxos);
        return parsedUtxos;
      }
      // If no cache available, return empty array
      setUtxos([]);
      return [];
    }
  };

  const getWalletBalance = async () => {
    try {
      if (!address) return 0;

      const response = await getTokensBalance(address);
      console.log('response', response);
      if (response && response.data && response.data.list) {
        setBalance(response.data.list);
      } else {
        setBalance([]);
      }
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  };

  // Add UTXO monitoring
  // useEffect(() => {
  //   let monitoringInterval;

  //   const startMonitoring = () => {
  //     // Initial refresh
  //     if (wallet) {
  //       wallet.refreshUtxos(true);
  //       wallet.refreshDoginals();
  //       setInscriptions(wallet.inscriptions || []);
  //     }

  //     monitoringInterval = setInterval(async () => {
  //       if (wallet) {
  //         await wallet.refreshUtxos();
  //         await wallet.refreshDoginals();
  //         setInscriptions(wallet.inscriptions || []);
  //       }
  //     }, UTXO_CACHE_DURATION);
  //   };

  //   if (isConnected) {
  //     startMonitoring();
  //   }

  //   return () => {
  //     if (monitoringInterval) {
  //       clearInterval(monitoringInterval);
  //     }
  //   };
  // }, [isConnected, wallet]);

  const connectWallet = async (walletCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const walletInstance = await initializeWallet(walletCredentials);
      setWallet(walletInstance);
      setAddress(walletInstance.address);
      setCredentials(walletCredentials);
      setIsConnected(true);

      // Initial refresh of UTXOs and inscriptions
      await walletInstance.refreshUtxos(true);
      await walletInstance.refreshDoginals();
      setInscriptions(walletInstance.inscriptions || []);

      localStorage.setItem('walletData', JSON.stringify({
        credentials: walletCredentials,
        address: walletInstance.address
      }));

      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setAddress(null);
    setBalance(null);
    setTokens([]);
    setIsConnected(false);
    setCredentials(null);
    localStorage.clear();
  };

  const refreshWallet = async () => {
    if (!wallet) return;

    try {
      setLoading(true);
      // Implement wallet refresh logic
      // Update balance and tokens
    } catch (error) {
      console.error('Error refreshing wallet:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendTransaction = async (amount, recipientAddress) => {
    if (!wallet) throw new Error('Wallet not connected');

    try {
      setLoading(true);
      // Implement transaction logic
      // Return transaction result
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Log current state for debugging
  useEffect(() => {
    console.log('WalletContext state updated:', {
      isConnected,
      hasAddress: !!address,
      address,
      hasWallet: !!wallet,
      balance,
      hasTokens: tokens.length > 0
    });
  }, [isConnected, address, wallet, balance, tokens]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        address,
        balance,
        tokens,
        isConnected,
        error,
        credentials,
        utxos,
        connectWallet,
        disconnectWallet,
        refreshUtxos,
        getWalletBalance,
        sendTransaction,
        inscriptions
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}; 