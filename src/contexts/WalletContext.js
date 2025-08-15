import { createContext, useContext, useState, useEffect } from 'react';
import { generateRandomCredentialsWithMnemonic, createCredentialsFromMnemonic, createCredentialsFromPrivateKey } from '@/utils/wallet';
import { toast } from 'react-hot-toast';

const WalletContext = createContext();

export function WalletProvider({ children }) {
    const [isConnected, setIsConnected] = useState(false);
    const [credentials, setCredentials] = useState(null);
    const [address, setAddress] = useState('');
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState(0);
    const [error, setError] = useState(null);

    // Load wallet from localStorage on mount
    useEffect(() => {
        const savedWallet = localStorage.getItem('wallet');
        if (savedWallet) {
            try {
                const walletData = JSON.parse(savedWallet);
                setCredentials(walletData.credentials);
                setAddress(walletData.address);
                setWallet(walletData.wallet);
                setIsConnected(true);
            } catch (err) {
                console.error('Failed to load wallet:', err);
                localStorage.removeItem('wallet');
            }
        }
    }, []);

    const connectWallet = async (credentials) => {
        try {
            setError(null);
            
            // Generate wallet from credentials
            const wallet = await generateRandomCredentialsWithMnemonic();
            const address = wallet.address;

            // Save wallet data
            const walletData = {
                credentials,
                address,
                wallet
            };
            localStorage.setItem('wallet', JSON.stringify(walletData));

            // Update state
            setCredentials(credentials);
            setAddress(address);
            setWallet(wallet);
            setIsConnected(true);

            toast.success('Wallet connected successfully!');
            return true;
        } catch (err) {
            console.error('Failed to connect wallet:', err);
            setError(err.message);
            toast.error(err.message);
            return false;
        }
    };

    const disconnectWallet = () => {
        localStorage.removeItem('wallet');
        setCredentials(null);
        setAddress('');
        setWallet(null);
        setIsConnected(false);
        setBalance(0);
        toast.success('Wallet disconnected');
    };

    const sendTransaction = async (amount, toAddress) => {
        try {
            setError(null);
            if (!wallet) throw new Error('Wallet not connected');
            if (!amount || amount <= 0) throw new Error('Invalid amount');
            if (!toAddress) throw new Error('Invalid recipient address');

            // TODO: Implement actual transaction sending
            // This is a placeholder
            toast.success('Transaction sent successfully!');
        } catch (err) {
            console.error('Transaction failed:', err);
            setError(err.message);
            toast.error(err.message);
            throw err;
        }
    };

    return (
        <WalletContext.Provider value={{
            isConnected,
            credentials,
            address,
            wallet,
            balance,
            error,
            connectWallet,
            disconnectWallet,
            sendTransaction
        }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
} 