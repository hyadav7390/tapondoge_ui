import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { createCredentialsFromMnemonic, createCredentialsFromPrivateKey, generateRandomCredentialsWithMnemonic, refreshWalletState } from '@/utils/wallet';
import { formatAddress } from '@/utils/formatters';
import TokenDetails from './TokenDetails';

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
    const [selectedToken, setSelectedToken] = useState(null);

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
        setSelectedToken(token);
    };

    const handleBack = () => {
        setSelectedToken(null);
    };

    const renderWalletDetails = () => {
        return (
            <div className="wallet-container">
                <div className="wallet-header">
                    <div className="address-section">
                        <div className="address" title={address}>
                            {formatAddress(address)}
                        </div>
                        <button
                            className="icon-button"
                            onClick={() => copyToClipboard(address, 'Address')}
                            title="Copy address"
                        >
                            <i className="far fa-copy"></i>
                        </button>
                    </div>

                    <div className="action-buttons">
                        <button
                            className={`icon-button ${isSyncing ? 'spinning' : ''}`}
                            onClick={handleSync}
                            disabled={isSyncing}
                            title="Sync wallet"
                        >
                            <i className="fas fa-sync-alt"></i>
                        </button>
                        <button
                            className="icon-button"
                            onClick={() => setShowOptions(!showOptions)}
                            title="More options"
                        >
                            <i className="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                </div>

                {showOptions && (
                    <div className="options-menu" ref={optionsRef}>
                        <button onClick={() => setShowSendModal(true)}>
                            <i className="fas fa-paper-plane"></i>
                            Send DOGE
                        </button>
                        <button onClick={() => setShowRecoveryPhrase(!showRecoveryPhrase)}>
                            <i className="fas fa-key"></i>
                            {!showRecoveryPhrase ? "Show Recovery Phrase" : "Hide Recovery Phrase"}
                        </button>
                        <button onClick={() => setShowPrivateKey(!showPrivateKey)}>
                            <i className="fas fa-lock"></i>
                            {!showPrivateKey ? "Show Private Key" : "Hide Private Key"}
                        </button>
                        <button onClick={handleDisconnect} className="disconnect-button">
                            <i className="fas fa-sign-out-alt"></i>
                            Disconnect Wallet
                        </button>
                    </div>
                )}

                {/* Private Key Display */}
                {showPrivateKey && (
                    <div className="secret-section">
                        <h4>Private Key</h4>
                        <div className="secret-container">
                            <div className="secret-value">
                                {getPrivateKey() || "Private key not available"}
                            </div>
                            <button
                                className="icon-button"
                                onClick={() => copyToClipboard(getPrivateKey() || "", 'Private Key')}
                                title="Copy private key"
                            >
                                <i className="far fa-copy"></i>
                            </button>
                        </div>
                        <p className="warning-text">
                            Never share your private key with anyone!
                        </p>
                    </div>
                )}

                {/* Recovery Phrase Display */}
                {showRecoveryPhrase && (
                    <div className="secret-section">
                        <h4>Recovery Phrase</h4>
                        <div className="secret-container">
                            <div className="secret-value">
                                {getMnemonic() || "Recovery phrase not available"}
                            </div>
                            <button
                                className="icon-button"
                                onClick={() => copyToClipboard(getMnemonic() || "", 'Recovery Phrase')}
                                title="Copy recovery phrase"
                            >
                                <i className="far fa-copy"></i>
                            </button>
                        </div>
                        <p className="warning-text">
                            Write this down and keep it safe. Never share your recovery phrase with anyone!
                        </p>
                    </div>
                )}

                {/* Wallet Balance */}
                <div className="balance-section">
                    {/* <h3 className="balance-title">Balance</h3> */}
                    {(!walletBalance && walletBalance !== 0) ? (
                        <div className="loading-indicator">Loading...</div>
                    ) : (
                        <div className="balance-amount">{`${walletBalance} DOGE`}</div>
                    )}
                </div>

                {/* Tokens List */}
                <div className="tokens-section">
                    <h3 className="tokens-title">Tokens</h3>
                    {!tokensBalance ? (
                        <div className="loading-indicator">Loading...</div>
                    ) : tokensBalance && tokensBalance.length > 0 ? (
                        <div className="tokens-list">
                            {tokensBalance.map((token, index) => (
                                <div 
                                    key={index} 
                                    className="token-item"
                                    onClick={() => handleTokenClick(token)}
                                >
                                    <div className="token-name">{token.ticker}</div>
                                    <div className="token-balance">{(parseFloat(token.overallBalance) || 0)/1e18}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-tokens">No tokens found</div>
                    )}
                </div>

                {/* Send DOGE Modal */}
                {showSendModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <h3>Send DOGE</h3>
                                <button
                                    className="close-button"
                                    onClick={() => setShowSendModal(false)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSendDoge}>
                                <div className="modal-body">
                                    <div className="input-group">
                                        <label>Amount (DOGE)</label>
                                        <input
                                            type="number"
                                            value={sendAmount}
                                            onChange={(e) => setSendAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            min="0.1"
                                            step="0.1"
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Recipient Address</label>
                                        <input
                                            type="text"
                                            value={sendAddress}
                                            onChange={(e) => setSendAddress(e.target.value)}
                                            placeholder="Enter DOGE address"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="submit"
                                        className="send-button"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending...' : 'Send DOGE'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Copy Status Message */}
                {copyStatus && (
                    <div className="copy-status">
                        {copyStatus}
                    </div>
                )}
            </div>
        );
    };

    if (selectedToken) {
        return <TokenDetails token={selectedToken} onBack={handleBack} />;
    }

    if (isConnected) {
        return renderWalletDetails();
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Connect Wallet</h5>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <ul className="nav nav-tabs mb-2">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
                            onClick={() => setActiveTab('create')}
                        >
                            Create New
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'mnemonic' ? 'active' : ''}`}
                            onClick={() => setActiveTab('mnemonic')}
                        >
                            Mnemonic
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'privateKey' ? 'active' : ''}`}
                            onClick={() => setActiveTab('privateKey')}
                        >
                            Private Key
                        </button>
                    </li>
                </ul>

                <div className="tab-content p-2">
                    {activeTab === 'create' && (
                        <div>
                            {!showMnemonic && (
                                <span>
                                    <p>Create a new wallet with a randomly generated mnemonic phrase.</p>
                                    <button className="btn btn-primary" onClick={handleCreateWallet}>
                                        Create Wallet
                                    </button>
                                </span>
                            )}

                            {showMnemonic && (
                                <div className="alert alert-warning">
                                    <p><strong>Your Mnemonic Phrase:</strong></p>
                                    <p className="mnemonic-display">{generatedMnemonic}</p>
                                    <p className="text-danger">
                                        <small>Write this down and keep it safe! You will need it to recover your wallet.</small>
                                    </p>
                                    <button className="btn btn-primary" onClick={handleConfirmMnemonic}>
                                        Connect Wallet
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'mnemonic' && (
                        <div>
                            <div className="mb-3">
                                <label htmlFor="mnemonic" className="form-label">Mnemonic Phrase</label>
                                <textarea
                                    id="mnemonic"
                                    className="form-control"
                                    rows="3"
                                    value={mnemonic}
                                    onChange={(e) => setMnemonic(e.target.value)}
                                    placeholder="Enter your 12-word mnemonic phrase"
                                ></textarea>
                            </div>
                            <button className="btn btn-primary" onClick={handleConnectWithMnemonic}>
                                Connect Wallet
                            </button>
                        </div>
                    )}

                    {activeTab === 'privateKey' && (
                        <div>
                            <div className="mb-3">
                                <label htmlFor="privateKey" className="form-label">Private Key</label>
                                <input
                                    type="text"
                                    id="privateKey"
                                    className="form-control"
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    placeholder="Enter your private key"
                                />
                            </div>
                            <button className="btn btn-primary" onClick={handleConnectWithPrivateKey}>
                                Connect Wallet
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 