import { useState } from 'react';
import { getTokensBalance, getAccountBlockedTransferables } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faSearch, faWallet, faExchangeAlt, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function Balance() {
    const [walletAddress, setWalletAddress] = useState('');
    const [error, setError] = useState('');
    const [balances, setBalances] = useState([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    const { showLoader, hideLoader } = useLoader();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            showLoader();
            setError(''); // Reset error message

            // Validation
            if (!walletAddress) {
                hideLoader();
                setError('Wallet address is required.');
                return;
            }

            // Log the form values if validation passes
            console.log('Wallet Address:', walletAddress);

            // Get balance data
            const response = await getTokensBalance(walletAddress);
            console.log('Balance response:', response);

            // Get blocked transferables status
            const blockResponse = await getAccountBlockedTransferables(walletAddress);
            console.log('Block status response:', blockResponse);

            // Set the blocked status
            setIsBlocked(blockResponse.result);

            // Set balances array
            if (response && response.data && response.data.list) {
                setBalances(response.data.list);
            } else {
                setBalances([]);
            }

            setHasChecked(true);
        } catch (error) {
            console.error('Error getting balance:', error);
            setError('Failed to fetch balance. Please try again.');
            setBalances([]);
        } finally {
            hideLoader();
        }
    };

    // Format balance value from wei to readable format
    const formatBalance = (balance) => {
        if (!balance || balance === '') return '0';
        const balanceInWei = parseFloat(balance);
        const balanceInTokens = balanceInWei / 1e18;
        return balanceInTokens.toLocaleString();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-black text-teal-800 mb-2">💰 Check Balance</h2>
                <p className="text-teal-600 font-medium">Enter a wallet address to check token balances</p>
            </div>

            {/* Form Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="walletAddress" className="block text-sm font-bold text-teal-700 mb-2">
                            <FontAwesomeIcon icon={faWallet} className="w-4 h-4 mr-2 text-lime-600" />
                            Wallet Address
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                            id="walletAddress"
                            placeholder="Enter wallet address..."
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                        />
                        {error && (
                            <div className="mt-2 p-3 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-cartoon">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-600 mr-2" />
                                    <p className="text-sm text-red-800 font-bold">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform"
                        >
                            <FontAwesomeIcon icon={faSearch} className="w-4 h-4 mr-2" />
                            Check Balance
                        </button>
                    </div>
                </form>
            </div>

            {/* Balance Result Section */}
            {hasChecked && (
                <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
                    <h3 className="text-2xl font-black text-teal-800 text-center mb-6">Balance Results</h3>
                    
                    {isBlocked && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-cartoon">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-yellow-600 mr-3" />
                                <p className="text-yellow-800 font-bold">⚠️ This wallet is blocked for transfers</p>
                            </div>
                        </div>
                    )}
                    
                    {balances.length > 0 ? (
                        <div className="space-y-6">
                            {balances.map((balance, index) => (
                                <div key={index} className="bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon p-6 border-2 border-lime-200 hover:border-lime-300 transition-all duration-200">
                                    {/* Token Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-gold-400 to-gold-500 rounded-cartoon flex items-center justify-center shadow-cartoon-soft border-2 border-gold-600">
                                                <FontAwesomeIcon icon={faCoins} className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-teal-800">{balance.ticker}</h4>
                                                <p className="text-sm text-teal-600 font-medium">Token</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-4 py-2 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 text-sm font-bold rounded-cartoon shadow-cartoon-soft border-2 border-lime-600">
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Balance Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Overall Balance */}
                                        <div className="bg-white rounded-cartoon p-4 border-2 border-lime-300 shadow-cartoon-soft">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <FontAwesomeIcon icon={faWallet} className="w-4 h-4 text-lime-600" />
                                                <span className="text-sm font-bold text-teal-700">Overall Balance</span>
                                            </div>
                                            <div className="text-2xl font-black text-teal-800">
                                                {formatBalance(balance.overallBalance)}
                                            </div>
                                            <p className="text-xs text-teal-500 mt-1 font-medium">Total tokens owned</p>
                                        </div>

                                        {/* Transferable Balance */}
                                        <div className="bg-white rounded-cartoon p-4 border-2 border-lime-300 shadow-cartoon-soft">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <FontAwesomeIcon icon={faExchangeAlt} className="w-4 h-4 text-lime-600" />
                                                <span className="text-sm font-bold text-teal-700">Transferable Balance</span>
                                            </div>
                                            <div className="text-2xl font-black text-teal-800">
                                                {formatBalance(balance.transferableBalance)}
                                            </div>
                                            <p className="text-xs text-teal-500 mt-1 font-medium">Available for transfer</p>
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    {balance.transferableBalance && parseFloat(balance.transferableBalance) > 0 ? (
                                        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-cartoon">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mr-3" />
                                                <span className="text-sm text-green-800 font-bold">
                                                    Tokens available for transfer
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-cartoon">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-yellow-600 mr-3" />
                                                <span className="text-sm text-yellow-800 font-bold">
                                                    No transferable tokens available
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">💰</div>
                            <div className="text-teal-600">
                                <p className="text-lg font-bold">No tokens found</p>
                                <p className="text-sm">This wallet doesn&apos;t have any tokens</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}