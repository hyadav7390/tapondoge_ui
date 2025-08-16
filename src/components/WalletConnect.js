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
    faExternalLinkAlt
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
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <FontAwesomeIcon icon={faWallet} className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Wallet</h3>
                                <p className="text-sm text-gray-600">{formatAddress(address)}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => copyToClipboard(address, 'Address')}
                                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                                title="Copy address"
                            >
                                <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
                            </button>
                            
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className={`p-2 rounded-lg transition-colors duration-200 ${
                                    isSyncing 
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                                }`}
                                title="Sync wallet"
                            >
                                <FontAwesomeIcon 
                                    icon={faSync} 
                                    className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} 
                                />
                            </button>
                            
                            <div className="relative">
                                <button
                                    onClick={() => setShowOptions(!showOptions)}
                                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                                    title="More options"
                                >
                                    <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                                </button>
                                
                                {showOptions && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50" style={{ right: '-6rem' }} ref={optionsRef}>
                                        <div className="py-1">
                                            <button 
                                                onClick={() => setShowSendModal(true)}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-2" />
                                                Send DOGE
                                            </button>
                                            <button 
                                                onClick={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faKey} className="w-4 h-4 mr-2" />
                                                {!showRecoveryPhrase ? "Show Recovery Phrase" : "Hide Recovery Phrase"}
                                            </button>
                                            <button 
                                                onClick={() => setShowPrivateKey(!showPrivateKey)}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faLock} className="w-4 h-4 mr-2" />
                                                {!showPrivateKey ? "Show Private Key" : "Hide Private Key"}
                                            </button>
                                            <button 
                                                onClick={handleDisconnect}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2" />
                                                Disconnect Wallet
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Wallet Balance */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Balance</span>
                            <span className="text-lg font-bold text-gray-900">
                                {(!walletBalance && walletBalance !== 0) ? 'Loading...' : `${walletBalance} DOGE`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Private Key Display */}
                {showPrivateKey && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <FontAwesomeIcon icon={faLock} className="w-5 h-5 mr-2 text-primary-600" />
                            Private Key
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <code className="text-sm text-gray-900 font-mono break-all">
                                    {getPrivateKey() || "Private key not available"}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(getPrivateKey() || "", 'Private Key')}
                                    className="ml-2 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                                    title="Copy private key"
                                >
                                    <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-danger-600 mr-2" />
                                <p className="text-sm text-danger-800 font-medium">Never share your private key with anyone!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recovery Phrase Display */}
                {showRecoveryPhrase && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <FontAwesomeIcon icon={faKey} className="w-5 h-5 mr-2 text-primary-600" />
                            Recovery Phrase
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <code className="text-sm text-gray-900 font-mono break-all">
                                    {getMnemonic() || "Recovery phrase not available"}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(getMnemonic() || "", 'Recovery Phrase')}
                                    className="ml-2 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                                    title="Copy recovery phrase"
                                >
                                    <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-warning-600 mr-2" />
                                <p className="text-sm text-warning-800 font-medium">Write this down and keep it safe. Never share your recovery phrase with anyone!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tokens List */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <FontAwesomeIcon icon={faCoins} className="w-5 h-5 mr-2 text-primary-600" />
                        Tokens
                    </h3>
                    
                    {!tokensBalance ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                            <p className="text-gray-600">Loading...</p>
                        </div>
                    ) : tokensBalance && tokensBalance.length > 0 ? (
                        <div className="space-y-3">
                            {tokensBalance.map((token, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer group"
                                    onClick={() => handleTokenClick(token)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon icon={faCoins} className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{token.ticker}</p>
                                            <p className="text-sm text-gray-600">Token</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">{(parseFloat(token.overallBalance) || 0)/1e18}</p>
                                            <p className="text-sm text-gray-600">Balance</p>
                                        </div>
                                        <FontAwesomeIcon 
                                            icon={faExternalLinkAlt} 
                                            className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FontAwesomeIcon icon={faCoins} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No tokens found</p>
                            <p className="text-gray-400 text-sm">Your wallet doesn&apos;t contain any tokens</p>
                        </div>
                    )}
                </div>

                {/* Send DOGE Modal */}
                {showSendModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Send DOGE</h3>
                                <button
                                    onClick={() => setShowSendModal(false)}
                                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSendDoge} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (DOGE)</label>
                                    <input
                                        type="number"
                                        value={sendAmount}
                                        onChange={(e) => setSendAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        min="0.1"
                                        step="0.1"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
                                    <input
                                        type="text"
                                        value={sendAddress}
                                        onChange={(e) => setSendAddress(e.target.value)}
                                        placeholder="Enter DOGE address"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowSendModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 mr-2" />
                            {copyStatus}
                        </div>
                    </div>
                )}

                {/* Error/Success Messages */}
                {error && (
                    <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-danger-600 mr-2" />
                            <p className="text-sm text-danger-600">{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-success-600 mr-2" />
                            <p className="text-sm text-success-600">{success}</p>
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
                <h2 className="text-2xl font-bold text-gray-900">Connect Wallet</h2>
                <p className="text-gray-600 mt-1">Connect your wallet to start trading</p>
            </div>

            {/* Connect Wallet Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-danger-600 mr-2" />
                            <p className="text-sm text-danger-600">{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-success-600 mr-2" />
                            <p className="text-sm text-success-600">{success}</p>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                            activeTab === 'create'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setActiveTab('create')}
                    >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                        Create New
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                            activeTab === 'mnemonic'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setActiveTab('mnemonic')}
                    >
                        <FontAwesomeIcon icon={faKey} className="w-4 h-4 mr-2" />
                        Mnemonic
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                            activeTab === 'privateKey'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
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
                                    <p className="text-gray-600 mb-4">Create a new wallet with a randomly generated mnemonic phrase.</p>
                                    <button 
                                        className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                                        onClick={handleCreateWallet}
                                        disabled={isLoading}
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                                        {isLoading ? 'Creating...' : 'Create Wallet'}
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                                    <h4 className="font-bold text-warning-800 mb-2">Your Mnemonic Phrase:</h4>
                                    <div className="bg-white p-4 rounded-lg border border-warning-300 mb-4">
                                        <p className="text-sm font-mono text-gray-900">{generatedMnemonic}</p>
                                    </div>
                                    <p className="text-sm text-warning-700 mb-4">
                                        Write this down and keep it safe! You will need it to recover your wallet.
                                    </p>
                                    <button 
                                        className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mnemonic Phrase</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                                    rows="3"
                                    value={mnemonic}
                                    onChange={(e) => setMnemonic(e.target.value)}
                                    placeholder="Enter your 12-word mnemonic phrase"
                                ></textarea>
                            </div>
                            <button 
                                className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Private Key</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    placeholder="Enter your private key"
                                />
                            </div>
                            <button 
                                className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
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