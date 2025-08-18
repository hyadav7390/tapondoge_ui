import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { getTransferableInscriptions, listTokenForSaleWithWallet } from '@/utils/wallet';
import { getAccountBlockedTransferables, getWalletListedTokens, unlistToken, getTokensBalance } from '@/utils/service';
import { Constants } from '@/utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faExclamationTriangle, 
    faTag, 
    faList, 
    faUnlink, 
    faCoins, 
    faWallet, 
    faExchangeAlt,
    faPaperPlane,
    faTimes,
    faDollarSign,
    faSync
} from '@fortawesome/free-solid-svg-icons';

const TokenDetails = ({ token, onBack }) => {
    const { wallet } = useWallet();
    const [transferableInscriptions, setTransferableInscriptions] = useState([]);
    const [listedTokens, setListedTokens] = useState([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showListingModal, setShowListingModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [selectedInscription, setSelectedInscription] = useState(null);
    const [listingPrice, setListingPrice] = useState('');
    const [transferAddress, setTransferAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(null);

    console.log('token', token);

    useEffect(() => {
        const loadTokenDetails = async () => {
            try {
                setIsLoading(true);
                
                // Get wallet balance for this specific token
                if (wallet && wallet.address) {
                    const balanceResponse = await getTokensBalance(wallet.address);
                    console.log('balanceResponse', balanceResponse);
                    
                    if (balanceResponse && balanceResponse.data && balanceResponse.data.list) {
                        const tokenBalanceData = balanceResponse.data.list.find(t => t.ticker === token.ticker);
                        if (tokenBalanceData) {
                            setTokenBalance(tokenBalanceData);
                        }
                    }
                }

                // Get blocked status
                if (wallet && wallet.address) {
                const blocked = await getAccountBlockedTransferables(wallet.address);
                console.log('blocked', blocked);
                setIsBlocked(!blocked);
                }
                
                // Get transferable inscriptions using the new API-based approach
                if (wallet && wallet.address && token.ticker) {
                    const transferables = await getTransferableInscriptionsNew(token.ticker, wallet.address);
                console.log('transferables', transferables);
                setTransferableInscriptions(transferables);
                }
                
                // Get listed tokens
                if (wallet && wallet.address) {
                    const listed = await getWalletListedTokens(wallet.address);
                    setListedTokens(listed);
                }
            } catch (error) {
                console.error('Error loading token details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token && token.ticker) {
        loadTokenDetails();
        }
    }, [token, wallet]);

    // New function to get transferable inscriptions using the API approach from the JavaScript code
    const getTransferableInscriptionsNew = async (ticker, walletAddress) => {
        try {
            let offset = 0;
            let done = false;
            let estimatedActiveTransfers = [];
            let transfersArr = [];
            
            // Get all transfers for this token
            while (!done) {
                const transferRes = await fetch(`${Constants.BASE_API_URL}/getAccountTransferList/${walletAddress}/${ticker}?offset=${offset}&max=500`);
                const transferData = await transferRes.json();
                
                offset += 500;
                if (!transferData || (transferData.result && transferData.result.length === 0) || (transferData.result && transferData.result.length < 500)) {
                    done = true;
                }
                
                if (transferData.result) {
                    transfersArr.push(...transferData.result);
                }
            }

            // Get active transfers (this would need wallet UTXOs - simplified for now)
            const activeTransfers = transfersArr.map(t => t.tx);

            // Get valid transferable inscriptions
            const inscriptionsPromises = transfersArr.map(async (transfer) => {
                if (activeTransfers.includes(transfer.tx)) {
                    const singleTransfer = await fetch(`${Constants.BASE_API_URL}/getSingleTransferable/${transfer.ins}`);
                    const singleTransferData = await singleTransfer.json();
                    
                    if (singleTransferData && singleTransferData.result && parseFloat(singleTransferData.result) > 0) {
                        const resultAmt = BigInt(singleTransferData.result);
                        const divisor = BigInt("1000000000000000000"); // 1e18 as BigInt
                        const amountRes = resultAmt / divisor;
                        const amount = amountRes.toString();
                        
                        return {
                            inscriptionId: transfer.ins,
                            number: transfer.num,
                            amount: amount,
                            tick: ticker,
                            outpoint: `${transfer.tx}:${transfer.vo}`,
                            data: JSON.stringify({p: "tap",op: "token-transfer",tick: ticker,amt: amount})
                        };
                    }
                }
                return null;
            });

            const results = await Promise.all(inscriptionsPromises);
            return results.filter(result => result !== null);
        } catch (error) {
            console.error('Error getting transferable inscriptions:', error);
            return [];
        }
    };

    // Format balance value from wei to readable format
    const formatBalance = (balance) => {
        if (!balance) return '0';
        const balanceInWei = parseFloat(balance);
        const balanceInTokens = balanceInWei / 1e18;
        return balanceInTokens.toLocaleString();
    };

    // Get overall balance from token balance data
    const getOverallBalance = () => {
        if (tokenBalance) {
            return formatBalance(tokenBalance.overallBalance);
        }
        return '0';
    };

    const handleListToken = (inscription) => {
        // Check if wallet has UTXO data
        if (!wallet.utxos || wallet.utxos.length === 0) {
            alert('Wallet UTXO data not available. Please refresh your wallet first.');
            return;
        }
        
        setSelectedInscription(inscription);
        setShowListingModal(true);
    };

    const handleUnlistToken = async (inscriptionId) => {
        try {
            // Show confirmation dialog
            if (!confirm('Are you sure you want to unlist this token?')) {
                return;
            }

            setIsSubmitting(true);
            const response = await unlistToken(inscriptionId);
            
            if (response.success) {
                // Refresh listed tokens
                const listed = await getWalletListedTokens(wallet.address);
                setListedTokens(listed);
                alert('Token unlisted successfully!');
            } else {
                throw new Error(response.message || 'Failed to unlist token');
            }
        } catch (error) {
            console.error('Error unlisting token:', error);
            alert('Failed to unlist token: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTransferToken = (inscription) => {
        setSelectedInscription(inscription);
        setShowTransferModal(true);
    };

    const submitListing = async () => {
        if (!listingPrice || parseFloat(listingPrice) <= 0) {
            alert('Please enter a valid price');
            return;
        }

        try {
            setIsSubmitting(true);
            await listTokenForSaleWithWallet(selectedInscription, token.ticker, parseFloat(listingPrice), selectedInscription.amount, wallet);
            setShowListingModal(false);
            setListingPrice('');
            setSelectedInscription(null);
            
            // Refresh listed tokens
            const listed = await getWalletListedTokens(wallet.address);
            setListedTokens(listed);
            
            alert('Token listed successfully!');
        } catch (error) {
            console.error('Error listing token:', error);
            let errorMessage = 'Failed to list token';
            
            if (error.message.includes('Inscription UTXO not found')) {
                errorMessage = 'Inscription UTXO not found. Please refresh your wallet and try again.';
            } else if (error.message.includes('Wallet not properly initialized')) {
                errorMessage = 'Wallet not properly initialized. Please reconnect your wallet.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitTransfer = async () => {
        if (!transferAddress || transferAddress.trim() === '') {
            alert('Please enter a valid recipient address');
            return;
        }

        // Basic DOGE address validation
        const dogeAddressPattern = /^[D9daA][1-9A-HJ-NP-Za-km-z]{25,34}$/;
        if (!dogeAddressPattern.test(transferAddress)) {
            alert('Please enter a valid Dogecoin address');
            return;
        }

        try {
            setIsSubmitting(true);
            // This would need to be implemented based on your wallet's transfer functionality
            // await transferToken(selectedInscription, transferAddress);
            alert('Transfer functionality needs to be implemented with wallet integration');
            setShowTransferModal(false);
            setTransferAddress('');
            setSelectedInscription(null);
        } catch (error) {
            console.error('Error transferring token:', error);
            alert('Failed to transfer token: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isInscriptionListed = (inscriptionId) => {
        return listedTokens.some(lt => lt.inscriptionId === inscriptionId);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-lime-50 to-lime-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
                    <p className="text-teal-600 font-bold">Loading token details...</p>
                </div>
            </div>
        );
    }

    // Check if wallet is connected
    if (!wallet || !wallet.address) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-lime-50 to-lime-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-8 max-w-md mx-4">
                        <div className="text-4xl mb-4">🔒</div>
                        <h2 className="text-xl font-black text-teal-800 mb-2">Wallet Not Connected</h2>
                        <p className="text-teal-600 font-medium mb-6">Please connect your wallet to view token details</p>
                        <button
                            onClick={onBack}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-50 to-lime-100">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="space-y-8">
            {/* Header Section */}
                    <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                    <button 
                        onClick={onBack}
                                    className="p-3 text-teal-600 hover:text-lime-600 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
                    </button>
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-gradient-to-r from-lime-400 to-lime-500 rounded-cartoon shadow-cartoon-soft border-2 border-lime-600">
                                        <FontAwesomeIcon icon={faCoins} className="w-6 h-6 text-teal-900" />
                                    </div>
                    <div>
                                        <h1 className="text-3xl font-black text-teal-800">{token.ticker}</h1>
                                        <p className="text-teal-600 font-medium">Token Details</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Refresh Button */}
                            <button
                                onClick={() => window.location.reload()}
                                className="p-3 text-teal-600 hover:text-lime-600 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
                                title="Refresh wallet data"
                            >
                                <FontAwesomeIcon icon={faSync} className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Token Balance Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon p-6 border-2 border-lime-200">
                                <div className="flex items-center space-x-3 mb-3">
                                    <FontAwesomeIcon icon={faWallet} className="w-5 h-5 text-lime-600" />
                                    <h3 className="text-lg font-black text-teal-800">Overall Balance</h3>
                                </div>
                                <p className="text-3xl font-black text-teal-800">
                                    {getOverallBalance()}
                                </p>
                                <p className="text-sm text-teal-600 mt-1 font-medium">Total tokens owned</p>
                            </div>
                            
                            <div className="bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon p-6 border-2 border-lime-200">
                                <div className="flex items-center space-x-3 mb-3">
                                    <FontAwesomeIcon icon={faTag} className="w-5 h-5 text-lime-600" />
                                    <h3 className="text-lg font-black text-teal-800">Transferable</h3>
                                </div>
                                <p className="text-3xl font-black text-teal-800">
                                    {transferableInscriptions ? transferableInscriptions.length : 0}
                                </p>
                                <p className="text-sm text-teal-600 mt-1 font-medium">Available inscriptions</p>
                            </div>

                            <div className="bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon p-6 border-2 border-lime-200">
                                <div className="flex items-center space-x-3 mb-3">
                                    <FontAwesomeIcon icon={faList} className="w-5 h-5 text-lime-600" />
                                    <h3 className="text-lg font-black text-teal-800">Listed</h3>
                                </div>
                                <p className="text-3xl font-black text-teal-800">
                                    {listedTokens.filter(lt => lt.tick === token.ticker).length}
                                </p>
                                <p className="text-sm text-teal-600 mt-1 font-medium">For sale</p>
                    </div>
                </div>
                        
                {isBlocked && (
                            <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-cartoon">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-red-600 mr-3" />
                                    <div>
                                        <p className="text-red-800 font-black">Transfers are currently blocked</p>
                                        <p className="text-red-700 text-sm mt-1 font-medium">This wallet cannot transfer tokens at the moment</p>
                                    </div>
                                </div>
                    </div>
                )}
            </div>

            {/* Transferable Tokens Section */}
                    <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-teal-800 flex items-center">
                                <FontAwesomeIcon icon={faTag} className="w-6 h-6 mr-3 text-lime-600" />
                                Transferable Tokens
                            </h2>
                            {transferableInscriptions && transferableInscriptions.length > 0 && (
                                <span className="px-4 py-2 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 text-sm font-bold rounded-cartoon shadow-cartoon-soft border-2 border-lime-600">
                                    {transferableInscriptions.length} inscription{transferableInscriptions.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        
                        {transferableInscriptions && transferableInscriptions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {transferableInscriptions.map((insc, index) => {
                                    const isListed = isInscriptionListed(insc.inscriptionId);

                                return (
                                        <div key={index} className={`bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon p-6 border-2 transition-all duration-200 ${
                                            isBlocked ? 'border-gray-200 opacity-60' : 'border-lime-200 hover:border-lime-300 hover:shadow-cartoon-lg'
                                        }`}>
                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-3 py-1 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 text-sm font-bold rounded-cartoon shadow-cartoon-soft border-2 border-lime-600">
                                                        #{index + 1}
                                                </span>
                                                {isListed && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm font-bold rounded-cartoon border-2 border-green-300">
                                                        LISTED
                                                    </span>
                                                )}
                                                    {isBlocked && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-sm font-bold rounded-cartoon border-2 border-red-300">
                                                            BLOCKED
                                                        </span>
                                                    )}
                                                </div>
                                                
                                            {/* Token Amount */}
                                            <div className="text-center mb-6">
                                                <div className="flex items-center justify-center mb-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full flex items-center justify-center shadow-cartoon-soft border-2 border-gold-600 mr-3">
                                                        <FontAwesomeIcon icon={faCoins} className="w-4 h-4 text-white" />
                                                    </div>
                                                    <h4 className="text-2xl font-black text-teal-800">
                                                    {insc.amount}
                                                </h4>
                                                </div>
                                                <p className="text-sm text-teal-600 font-medium">tokens</p>
                                            </div>

                                            {/* Action Buttons */}
                                                {!isBlocked && (
                                                <div className="space-y-3">
                                                        {isListed ? (
                                                        <button 
                                                            onClick={() => handleUnlistToken(insc.inscriptionId)}
                                                            disabled={isSubmitting}
                                                            className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-red-300 text-red-700 bg-white rounded-cartoon hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 hover:scale-105 active:scale-95"
                                                        >
                                                            <FontAwesomeIcon icon={faUnlink} className="w-4 h-4 mr-2" />
                                                            {isSubmitting ? 'Unlisting...' : 'Unlist'}
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button 
                                                                onClick={() => handleListToken(insc)}
                                                                className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-lime-300 text-lime-700 bg-white rounded-cartoon hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 hover:scale-105 active:scale-95"
                                                            >
                                                                <FontAwesomeIcon icon={faList} className="w-4 h-4 mr-2" />
                                                                List for Sale
                                                            </button>
                                                            <button 
                                                                onClick={() => handleTransferToken(insc)}
                                                                className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-teal-300 text-teal-700 bg-white rounded-cartoon hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 hover:scale-105 active:scale-95"
                                                            >
                                                                <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-2" />
                                                                Transfer
                                                            </button>
                                                        </>
                                                        )}
                                                    </div>
                                                )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                            <div className="text-center py-16">
                                <div className="bg-gradient-to-r from-lime-100 to-lime-200 rounded-cartoon w-24 h-24 flex items-center justify-center mx-auto mb-6 border-2 border-lime-300">
                                    <FontAwesomeIcon icon={faTag} className="w-12 h-12 text-lime-400" />
                                </div>
                                <h3 className="text-xl font-black text-teal-800 mb-2">No transferable tokens available</h3>
                                <p className="text-teal-600 max-w-md mx-auto font-medium">
                                    All your tokens are currently in use or locked. Check back later for available transferable inscriptions.
                                </p>
                        </div>
                    )}
                    </div>
                </div>
            </div>

            {/* Listing Modal */}
            {showListingModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl p-8 w-full max-w-md mx-4 border-2 border-teal-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black text-teal-800">List Token for Sale</h3>
                            <button
                                onClick={() => setShowListingModal(false)}
                                className="p-2 text-teal-600 hover:text-teal-800 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-teal-700 mb-2">Amount to List</label>
                                <div className="p-4 bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon border-2 border-lime-200">
                                    <span className="text-lg font-black text-teal-800">{selectedInscription?.amount} {token.ticker}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-teal-700 mb-2">Price per Token (DOGE)</label>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faDollarSign} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        value={listingPrice}
                                        onChange={(e) => setListingPrice(e.target.value)}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full pl-12 pr-4 py-4 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                                    />
                                </div>
                            </div>

                            {/* Wallet Requirements Note */}
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-cartoon">
                                <div className="flex items-start">
                                    <FontAwesomeIcon icon={faWallet} className="w-4 h-4 text-blue-600 mt-0.5 mr-3" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-bold">Wallet Requirements</p>
                                        <p className="mt-1 font-medium">Your wallet must be connected and have fresh UTXO data. If listing fails, try refreshing your wallet first.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowListingModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-teal-300 text-teal-700 font-bold rounded-cartoon hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitListing}
                                    disabled={isSubmitting || !listingPrice}
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FontAwesomeIcon icon={faList} className="w-4 h-4 mr-2" />
                                    {isSubmitting ? 'Listing...' : 'List Token'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transfer Modal */}
            {showTransferModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl p-8 w-full max-w-md mx-4 border-2 border-teal-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black text-teal-800">Transfer Token</h3>
                            <button
                                onClick={() => setShowTransferModal(false)}
                                className="p-2 text-teal-600 hover:text-teal-800 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-teal-700 mb-2">Amount to Transfer</label>
                                <div className="p-4 bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon border-2 border-lime-200">
                                    <span className="text-lg font-black text-teal-800">{selectedInscription?.amount} {token.ticker}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-teal-700 mb-2">Recipient Address</label>
                                <input
                                    type="text"
                                    value={transferAddress}
                                    onChange={(e) => setTransferAddress(e.target.value)}
                                    placeholder="Enter Dogecoin address..."
                                    className="w-full px-4 py-4 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowTransferModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-teal-300 text-teal-700 font-bold rounded-cartoon hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitTransfer}
                                    disabled={isSubmitting || !transferAddress}
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-2" />
                                    {isSubmitting ? 'Transferring...' : 'Transfer Token'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TokenDetails; 