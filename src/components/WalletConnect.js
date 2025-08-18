import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { getTokensBalance } from '@/utils/service';
import { formatAddress } from '@/utils/formatters';
import { createCredentialsFromMnemonic, createCredentialsFromPrivateKey, generateRandomCredentialsWithMnemonic, refreshWalletState } from '@/utils/wallet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faWallet, 
    faPlus, 
    faKey, 
    faLock, 
    faCopy, 
    faSync, 
    faEllipsisV, 
    faPaperPlane, 
    faSignOutAlt, 
    faCheckCircle, 
    faExclamationTriangle,
    faCoins,
    faExternalLinkAlt,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

export default function WalletConnect({ onConnected }) {
    const { isConnected, credentials, address, wallet, error: walletError, connectWallet, disconnectWallet, balance, sendTransaction } = useWallet();

    const [activeTab, setActiveTab] = useState('create');
    const [mnemonic, setMnemonic] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showMnemonic, setShowMnemonic] = useState(false);
    const [generatedMnemonic, setGeneratedMnemonic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [showSendModal, setShowSendModal] = useState(false);
    const [sendAmount, setSendAmount] = useState('');
    const [sendAddress, setSendAddress] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
    const [copyStatus, setCopyStatus] = useState('');
    const [walletBalance, setWalletBalance] = useState(null);
    const [tokensBalance, setTokensBalance] = useState([]);

    // Ref for dropdown menu
    const optionsRef = useRef(null);

    // Add debug logging
    useEffect(() => {
        console.log('WalletConnect - credentials:', credentials);
        console.log('WalletConnect - wallet:', wallet);
    }, [isConnected, credentials]);

    // Get private key
    const getPrivateKey = () => {
        try {
            console.log('Getting private key from credentials:', credentials);
            if (credentials?.privateKey) {
                return credentials.privateKey;
            }
            return "Private key not available";
        } catch (err) {
            console.error('Error getting private key:', err);
            return "Error retrieving private key";
        }
    };
    
    // Get mnemonic
    const getMnemonic = () => {
        try {
            console.log('Getting mnemonic from credentials:', credentials);
            if (credentials?.mnemonicString) {
                return credentials.mnemonicString;
            }
            return "Recovery phrase not available";
        } catch (err) {
            console.error('Error getting mnemonic:', err);
            return "Error retrieving recovery phrase";
        }
    };

    // Effect to fetch wallet balance when connected
    useEffect(() => {
        if (isConnected && wallet) {
            fetchWalletBalance();
        }
    }, [isConnected, wallet]);

    // Effect to handle wallet errors
    useEffect(() => {
        if (walletError) {
            setError(walletError);
        }
    }, [walletError]);

    // Effect to close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        }
        
        // Add event listener when dropdown is open
        if (showOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        // Clean up event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOptions]);

    // Function to fetch wallet balance
    const fetchWalletBalance = async () => {
        try {
            if (isConnected) {
                setWalletBalance(wallet.balance); // Reset to loading state
                setTokensBalance(wallet.balances);
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
            setError('Failed to fetch wallet balance');
        }
    };

    // Function to handle wallet sync
    const handleSync = async () => {
        try {
            setIsSyncing(true);
            setError('');
            
            await refreshWalletState(wallet);
            
            setSuccess('Wallet synced successfully');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (error) {
            console.error('Error syncing wallet:', error);
            setError(`Failed to sync wallet: ${error.message}`);
        } finally {
            setIsSyncing(false);
        }
    };

    // Function to copy text to clipboard
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus(`${label} copied to clipboard`);
            
            // Clear copy status after 3 seconds
            setTimeout(() => {
                setCopyStatus('');
            }, 3000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            setError(`Failed to copy ${label.toLowerCase()}`);
        });
    };

    const handleCreateWallet = async () => {
        try {
            setError('');
            setIsLoading(true);

            let credentials;
            try {
                credentials = await generateRandomCredentialsWithMnemonic(mnemonic);
            } catch (mnemonicError) {
                console.error('Failed to generate with mnemonic, falling back to simple credentials:', mnemonicError);
            }

            console.log('Credentials generated successfully', credentials);

            // Store the mnemonic for display if available
            if (credentials.mnemonic) {
                setGeneratedMnemonic(credentials.mnemonic);
                setShowMnemonic(true);
            } else {
                console.log('Error in creating mnemonic');
            }

            setIsLoading(false);

            // Store credentials temporarily if showing mnemonic
            if (credentials.mnemonic) {
                window.tempCredentials = credentials;
            }

        } catch (error) {
            console.error('Failed to create wallet:', error);
            setError(`Failed to create wallet: ${error.message}`);
            setIsLoading(false);
        }
    };

    const handleConnectWithMnemonic = async () => {
        try {
            setError('');
            if (!mnemonic.trim()) {
                setError('Please enter your mnemonic phrase');
                return;
            }

            const credentials = createCredentialsFromMnemonic(mnemonic.trim());
            const result = await connectWallet(credentials);

            if (result) {
                setSuccess('Wallet connected successfully!');
                setMnemonic('');

                // Call the onConnected callback if provided
                if (onConnected) onConnected();
            } else {
                setError('Failed to connect wallet. Please check your mnemonic phrase.');
            }
        } catch (error) {
            console.error('Failed to connect with mnemonic:', error);
            setError('Invalid mnemonic phrase. Please check and try again.');
        }
    };

    const handleConnectWithPrivateKey = async () => {
        try {
            setError('');
            if (!privateKey.trim()) {
                setError('Please enter your private key');
                return;
            }

            const credentials = createCredentialsFromPrivateKey(privateKey.trim());
            const result = await connectWallet(credentials);

            if (result) {
                setSuccess('Wallet connected successfully!');
                setPrivateKey('');

                // Call the onConnected callback if provided
                if (onConnected) onConnected();
            } else {
                setError('Failed to connect wallet. Please check your private key.');
            }
        } catch (error) {
            console.error('Failed to connect with private key:', error);
            setError('Invalid private key. Please check and try again.');
        }
    };

    const handleDisconnect = () => {
        disconnectWallet();
        setSuccess('Wallet disconnected successfully!');

        // Call the onConnected callback if provided
        if (onConnected) onConnected();
    };

    // Function to handle confirming mnemonic and connecting wallet
    const handleConfirmMnemonic = async () => {
        try {
            setError('');
            setIsLoading(true);

            const wallet = window.tempCredentials;
            console.log('Wallet', wallet);

            if (!wallet) {
                throw new Error('Wallet data not found');
            }

            await connectWallet(wallet);

            // Clear temporary wallet data
            window.tempCredentials = null;

            setShowMnemonic(false);
            setGeneratedMnemonic('');
            setIsLoading(false);

            if (onConnected) {
                onConnected(wallet.address);
            }

        } catch (error) {
            console.error('Failed to connect wallet:', error);
            setError(`Failed to connect wallet: ${error.message}`);
            setIsLoading(false);
        }
    };

    // Function to handle sending DOGE
    const handleSendDoge = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await sendTransaction(parseFloat(sendAmount), sendAddress);
            setShowSendModal(false);
            setSendAmount('');
            setSendAddress('');
            setSuccess('Transaction sent successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (error) {
            console.error('Send failed:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTokenClick = (token) => {
        // Open token details in a new tab
        window.open(`/token/${token.ticker}`, '_self');
    };

    const renderWalletDetails = () => {
        return (
            <div className="space-y-6">
                {/* Wallet Header */}
                <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 min-w-0 flex-1 mr-4">
                            <div className="p-3 bg-gradient-to-r from-lime-400 to-lime-500 rounded-cartoon shadow-cartoon-soft border-2 border-lime-600 flex-shrink-0">
                                <FontAwesomeIcon icon={faWallet} className="w-6 h-6 text-teal-900" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-black text-teal-800 truncate">🐕 Wallet</h3>
                                <p className="text-sm font-bold text-teal-600 truncate">{formatAddress(address)}</p>
                            </div>
                        </div>
                        
                        {/* Action Buttons Container */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <button
                                onClick={() => copyToClipboard(address, 'Address')}
                                className="p-2 text-teal-600 hover:text-lime-600 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
                                title="Copy address"
                            >
                                <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
                            </button>
                            
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className={`p-2 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95 ${
                                    isSyncing 
                                        ? 'text-teal-400 cursor-not-allowed' 
                                        : 'text-teal-600 hover:text-lime-600 hover:bg-lime-100'
                                }`}
                                title="Sync wallet"
                            >
                                <FontAwesomeIcon 
                                    icon={faSync} 
                                    className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} 
                                />
                            </button>
                            
                            {/* More Options Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowOptions(!showOptions)}
                                    className="p-2 text-teal-600 hover:text-lime-600 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
                                    title="More options"
                                >
                                    <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                                </button>
                                
                                {showOptions && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 overflow-hidden z-50" ref={optionsRef}>
                                        <div className="py-2">
                                            <button 
                                                onClick={() => setShowSendModal(true)}
                                                className="w-full px-4 py-3 text-left text-sm text-teal-700 hover:bg-lime-100 flex items-center transition-all duration-150 font-bold"
                                            >
                                                <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-3 text-teal-500" />
                                                Send DOGE
                                            </button>
                                            <button 
                                                onClick={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
                                                className="w-full px-4 py-3 text-left text-sm text-teal-700 hover:bg-lime-100 flex items-center transition-all duration-150 font-bold"
                                            >
                                                <FontAwesomeIcon icon={faKey} className="w-4 h-4 mr-3 text-teal-500" />
                                                {!showRecoveryPhrase ? "Show Recovery Phrase" : "Hide Recovery Phrase"}
                                            </button>
                                            <button 
                                                onClick={() => setShowPrivateKey(!showPrivateKey)}
                                                className="w-full px-4 py-3 text-left text-sm text-teal-700 hover:bg-lime-100 flex items-center transition-all duration-150 font-bold"
                                            >
                                                <FontAwesomeIcon icon={faLock} className="w-4 h-4 mr-3 text-teal-500" />
                                                {!showPrivateKey ? "Show Private Key" : "Hide Private Key"}
                                            </button>
                                            <div className="border-t-2 border-lime-200 my-2"></div>
                                            <button 
                                                onClick={handleDisconnect}
                                                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center transition-all duration-150 font-bold"
                                            >
                                                <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-3 text-red-500" />
                                                Disconnect Wallet
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Wallet Balance */}
                    <div className="bg-gradient-to-r from-lime-100 to-lime-200 rounded-cartoon p-4 border-2 border-lime-300">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-teal-700">Balance</span>
                            <span className="text-xl font-black text-teal-800">
                                {(!walletBalance && walletBalance !== 0) ? 'Loading...' : `${walletBalance} DOGE`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Private Key Display */}
                {showPrivateKey && (
                    <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
                        <h4 className="text-xl font-black text-teal-800 mb-4 flex items-center">
                            <FontAwesomeIcon icon={faLock} className="w-5 h-5 mr-3 text-lime-600" />
                            Private Key
                        </h4>
                        <div className="bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon p-4 mb-4 border-2 border-lime-200">
                            <div className="flex items-center justify-between">
                                <code className="text-sm text-teal-900 font-mono break-all font-bold">
                                    {getPrivateKey() || "Private key not available"}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(getPrivateKey() || "", 'Private Key')}
                                    className="ml-3 p-2 text-teal-600 hover:text-lime-600 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
                                    title="Copy private key"
                                >
                                    <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-cartoon">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-red-600 mr-3" />
                                <p className="text-sm text-red-800 font-bold">Never share your private key with anyone!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recovery Phrase Display */}
                {showRecoveryPhrase && (
                    <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
                        <h4 className="text-xl font-black text-teal-800 mb-4 flex items-center">
                            <FontAwesomeIcon icon={faKey} className="w-5 h-5 mr-3 text-lime-600" />
                            Recovery Phrase
                        </h4>
                        <div className="bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon p-4 mb-4 border-2 border-lime-200">
                            <div className="flex items-center justify-between">
                                <code className="text-sm text-teal-900 font-mono break-all font-bold">
                                    {getMnemonic() || "Recovery phrase not available"}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(getMnemonic() || "", 'Recovery Phrase')}
                                    className="ml-3 p-2 text-teal-600 hover:text-lime-600 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
                                    title="Copy recovery phrase"
                                >
                                    <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-cartoon">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-yellow-600 mr-3" />
                                <p className="text-sm text-yellow-800 font-bold">Write this down and keep it safe. Never share your recovery phrase with anyone!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tokens List */}
                <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
                    <h3 className="text-xl font-black text-teal-800 mb-4 flex items-center">
                        <FontAwesomeIcon icon={faCoins} className="w-5 h-5 mr-3 text-lime-600" />
                        Tokens
                    </h3>
                    
                    {!tokensBalance ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600 mx-auto mb-2"></div>
                            <p className="text-teal-600 font-bold">Loading...</p>
                        </div>
                    ) : tokensBalance && tokensBalance.length > 0 ? (
                        <div className="space-y-3">
                            {tokensBalance.map((token, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon hover:from-lime-100 hover:to-lime-200 transition-all duration-200 cursor-pointer group border-2 border-lime-200 hover:border-lime-300"
                                    onClick={() => handleTokenClick(token)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <img src="/tap_symbol.png" alt="TAPONDOGE SYMBOL" className="w-6 h-6 mr-1" />
                                        <div>
                                            <p className="font-bold text-teal-800">{token.ticker}</p>
                                            <p className="text-sm text-teal-600 font-medium">Token</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-right">
                                            <p className="font-black text-teal-800">{(parseFloat(token.overallBalance) || 0)/1e18}</p>
                                            <p className="text-sm text-teal-600 font-medium">Balance</p>
                                        </div>
                                        <FontAwesomeIcon 
                                            icon={faExternalLinkAlt} 
                                            className="w-4 h-4 text-teal-400 group-hover:text-lime-600 transition-all duration-200" 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">🐕</div>
                            <p className="text-teal-600 font-bold">No tokens found</p>
                            <p className="text-teal-500 text-sm">Your wallet doesn&apos;t contain any tokens</p>
                        </div>
                    )}
                </div>

                {/* Send DOGE Modal */}
                {showSendModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-cartoon shadow-cartoon-xl p-6 w-full max-w-md mx-4 border-2 border-teal-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-black text-teal-800">Send DOGE</h3>
                                <button
                                    onClick={() => setShowSendModal(false)}
                                    className="p-2 text-teal-600 hover:text-teal-800 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSendDoge} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-teal-700 mb-2">Amount (DOGE)</label>
                                    <input
                                        type="number"
                                        value={sendAmount}
                                        onChange={(e) => setSendAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        min="0.1"
                                        step="0.1"
                                        required
                                        className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-teal-700 mb-2">Recipient Address</label>
                                    <input
                                        type="text"
                                        value={sendAddress}
                                        onChange={(e) => setSendAddress(e.target.value)}
                                        placeholder="Enter DOGE address"
                                        required
                                        className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowSendModal(false)}
                                        className="flex-1 px-4 py-3 border-2 border-teal-300 text-teal-700 font-bold rounded-cartoon hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform"
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-2" />
                                        {isLoading ? 'Sending...' : 'Send DOGE'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Copy Status Message */}
                {copyStatus && (
                    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-cartoon shadow-cartoon-xl z-[60] animate-fade-in">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 mr-2" />
                            <span className="text-sm font-bold">{copyStatus}</span>
                        </div>
                    </div>
                )}

                {/* Error/Success Messages */}
                {error && (
                    <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-cartoon">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-red-600 mr-3" />
                            <p className="text-sm text-red-800 font-bold">{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-cartoon">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mr-3" />
                            <p className="text-sm text-green-800 font-bold">{success}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (isConnected) {
        return renderWalletDetails();
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-black text-teal-800 mb-2">🐕 Connect Wallet</h2>
                <p className="text-teal-600 font-medium">Connect your wallet to start trading</p>
            </div>

            {/* Connect Wallet Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-cartoon">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-red-600 mr-3" />
                            <p className="text-sm text-red-800 font-bold">{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-cartoon">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mr-3" />
                            <p className="text-sm text-green-800 font-bold">{success}</p>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex space-x-2 mb-6 bg-gradient-to-r from-lime-100 to-lime-200 rounded-cartoon p-2 border-2 border-lime-300">
                    <button
                        className={`flex-1 py-3 px-4 rounded-cartoon text-sm font-bold transition-all duration-200 ${
                            activeTab === 'create'
                                ? 'bg-white text-teal-800 shadow-cartoon-soft border-2 border-lime-400'
                                : 'text-teal-700 hover:text-teal-800 hover:bg-lime-50 border-2 border-transparent'
                        }`}
                        onClick={() => setActiveTab('create')}
                    >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                        Create New
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 rounded-cartoon text-sm font-bold transition-all duration-200 ${
                            activeTab === 'mnemonic'
                                ? 'bg-white text-teal-800 shadow-cartoon-soft border-2 border-lime-400'
                                : 'text-teal-700 hover:text-teal-800 hover:bg-lime-50 border-2 border-transparent'
                        }`}
                        onClick={() => setActiveTab('mnemonic')}
                    >
                        <FontAwesomeIcon icon={faKey} className="w-4 h-4 mr-2" />
                        Mnemonic
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 rounded-cartoon text-sm font-bold transition-all duration-200 ${
                            activeTab === 'privateKey'
                                ? 'bg-white text-teal-800 shadow-cartoon-soft border-2 border-lime-400'
                                : 'text-teal-700 hover:text-teal-800 hover:bg-lime-50 border-2 border-transparent'
                        }`}
                        onClick={() => setActiveTab('privateKey')}
                    >
                        <FontAwesomeIcon icon={faLock} className="w-4 h-4 mr-2" />
                        Private Key
                    </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'create' && (
                        <div className="space-y-4">
                            {!showMnemonic ? (
                                <div className="text-center">
                                    <p className="text-teal-600 mb-4 font-medium">Create a new wallet with a randomly generated mnemonic phrase.</p>
                                    <button 
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform"
                                        onClick={handleCreateWallet}
                                        disabled={isLoading}
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                                        {isLoading ? 'Creating...' : 'Create Wallet'}
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-cartoon">
                                    <h4 className="font-black text-yellow-800 mb-2">Your Mnemonic Phrase:</h4>
                                    <div className="bg-white p-4 rounded-cartoon border-2 border-yellow-400 mb-4">
                                        <p className="text-sm font-mono text-teal-900 font-bold">{generatedMnemonic}</p>
                                    </div>
                                    <p className="text-sm text-yellow-700 mb-4 font-medium">
                                        Write this down and keep it safe! You will need it to recover your wallet.
                                    </p>
                                    <button 
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform"
                                        onClick={handleConfirmMnemonic}
                                        disabled={isLoading}
                                    >
                                        <FontAwesomeIcon icon={faWallet} className="w-4 h-4 mr-2" />
                                        {isLoading ? 'Connecting...' : 'Connect Wallet'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'mnemonic' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-teal-700 mb-2">Mnemonic Phrase</label>
                                <textarea
                                    className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                                    rows="3"
                                    value={mnemonic}
                                    onChange={(e) => setMnemonic(e.target.value)}
                                    placeholder="Enter your 12-word mnemonic phrase"
                                ></textarea>
                            </div>
                            <button 
                                className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform"
                                onClick={handleConnectWithMnemonic}
                            >
                                <FontAwesomeIcon icon={faWallet} className="w-4 h-4 mr-2" />
                                Connect Wallet
                            </button>
                        </div>
                    )}

                    {activeTab === 'privateKey' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-teal-700 mb-2">Private Key</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    placeholder="Enter your private key"
                                />
                            </div>
                            <button 
                                className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform"
                                onClick={handleConnectWithPrivateKey}
                            >
                                <FontAwesomeIcon icon={faWallet} className="w-4 h-4 mr-2" />
                                Connect Wallet
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 