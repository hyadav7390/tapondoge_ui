import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faLayerGroup, faWallet, faRocket } from '@fortawesome/free-solid-svg-icons';

export default function Deploy() {
    const [tick, setTick] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [limitPerMint, setLimitPerMint] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        // Validation
        if (!tick.trim()) {
            setError('Tick is required.');
            return;
        }
        if (!totalSupply || totalSupply <= 0) {
            setError('Total Supply must be greater than 0.');
            return;
        }
        if (!limitPerMint || limitPerMint <= 0) {
            setError('Limit Per Mint must be greater than 0.');
            return;
        }
        if (!walletAddress.trim()) {
            setError('Wallet Address is required.');
            return;
        }

        // Log the form values if validation passes
        console.log('Tick:', tick);
        console.log('Total Supply:', totalSupply);
        console.log('Limit Per Mint:', limitPerMint);
        console.log('Wallet Address:', walletAddress);
        // Add any additional form handling logic here
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Deploy Token</h2>
                <p className="text-gray-600 mt-1">Create and deploy a new token to the blockchain</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tick Input */}
                    <div>
                        <label htmlFor="tick" className="block text-sm font-medium text-gray-700 mb-2">
                            <FontAwesomeIcon icon={faCoins} className="w-4 h-4 mr-2 text-primary-600" />
                            Tick
                        </label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            id="tick" 
                            placeholder="Enter token tick..."
                            value={tick} 
                            onChange={(e) => setTick(e.target.value)} 
                            required
                        />
                    </div>

                    {/* Total Supply Input */}
                    <div>
                        <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700 mb-2">
                            <FontAwesomeIcon icon={faLayerGroup} className="w-4 h-4 mr-2 text-primary-600" />
                            Total Supply
                        </label>
                        <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            id="totalSupply" 
                            placeholder="Enter total supply..."
                            value={totalSupply} 
                            onChange={(e) => setTotalSupply(e.target.value)} 
                            required
                        />
                    </div>

                    {/* Limit Per Mint Input */}
                    <div>
                        <label htmlFor="limitPerMint" className="block text-sm font-medium text-gray-700 mb-2">
                            Limit Per Mint
                        </label>
                        <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            id="limitPerMint" 
                            placeholder="Enter limit per mint..."
                            value={limitPerMint} 
                            onChange={(e) => setLimitPerMint(e.target.value)} 
                            required
                        />
                    </div>

                    {/* Wallet Address Input */}
                    <div>
                        <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-2">
                            <FontAwesomeIcon icon={faWallet} className="w-4 h-4 mr-2 text-primary-600" />
                            Wallet Address
                        </label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            id="walletAddress" 
                            placeholder="Enter wallet address..."
                            value={walletAddress} 
                            onChange={(e) => setWalletAddress(e.target.value)} 
                            required
                        />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                            <p className="text-sm text-danger-600">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="text-center">
                        <button 
                            type="submit" 
                            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faRocket} className="w-4 h-4 mr-2" />
                            Deploy Token
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}