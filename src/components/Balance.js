import { useState } from 'react';
import { getTokensBalance, getAccountBlockedTransferables } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faSearch, faWallet, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

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
                <h2 className="text-2xl font-bold text-gray-900">Check Balance</h2>
                <p className="text-gray-600 mt-1">Enter a wallet address to check token balances</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-2">
                            Wallet Address
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            id="walletAddress"
                            placeholder="Enter wallet address..."
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                        />
                        {error && (
                            <div className="mt-2 text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">
                                {error}
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faSearch} className="w-4 h-4 mr-2" />
                            Check Balance
                        </button>
                    </div>
                </form>
            </div>

            {/* Balance Result Section */}
            {hasChecked && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Balance Results</h3>
                    
                    {isBlocked && (
                        <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
                            <p className="text-warning-800 font-medium">⚠️ This wallet is blocked for transfers</p>
                        </div>
                    )}
                    
                    {balances.length > 0 ? (
                        <div className="space-y-6">
                            {balances.map((balance, index) => (
                                <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    {/* Token Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <FontAwesomeIcon icon={faCoins} className="w-6 h-6 text-primary-600" />
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900">{balance.ticker}</h4>
                                                <p className="text-sm text-gray-600">Token</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Balance Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Overall Balance */}
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <FontAwesomeIcon icon={faWallet} className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm font-medium text-gray-700">Overall Balance</span>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {formatBalance(balance.overallBalance)}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Total tokens owned</p>
                                        </div>

                                        {/* Transferable Balance */}
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <FontAwesomeIcon icon={faExchangeAlt} className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm font-medium text-gray-700">Transferable Balance</span>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {formatBalance(balance.transferableBalance)}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Available for transfer</p>
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    {balance.transferableBalance && parseFloat(balance.transferableBalance) > 0 ? (
                                        <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                                                <span className="text-sm text-success-800 font-medium">
                                                    Tokens available for transfer
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 bg-warning-500 rounded-full mr-2"></div>
                                                <span className="text-sm text-warning-800 font-medium">
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
                            <FontAwesomeIcon icon={faCoins} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <div className="text-gray-500">
                                <p className="text-lg font-medium">No tokens found</p>
                                <p className="text-sm">This wallet doesn&apos;t have any tokens</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}