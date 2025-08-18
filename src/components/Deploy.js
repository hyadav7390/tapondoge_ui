import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faLayerGroup, faWallet, faRocket } from '@fortawesome/free-solid-svg-icons';
import DevelopmentPopup from './DevelopmentPopup';

export default function Deploy() {
    const [tick, setTick] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [limitPerMint, setLimitPerMint] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);

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

        // Show development popup instead of processing
        setShowPopup(true);
        
        // Log the form values if validation passes
        console.log('Tick:', tick);
        console.log('Total Supply:', totalSupply);
        console.log('Limit Per Mint:', limitPerMint);
        console.log('Wallet Address:', walletAddress);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-black text-teal-800 mb-2">🚀 Deploy Token</h2>
                <p className="text-teal-600 font-medium">Create and deploy a new token to the blockchain</p>
            </div>

            {/* Form Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tick Input */}
                    <div>
                        <label htmlFor="tick" className="block text-sm font-bold text-teal-700 mb-2">
                            <FontAwesomeIcon icon={faCoins} className="w-4 h-4 mr-2 text-lime-600" />
                            Tick
                        </label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                            id="tick" 
                            placeholder="Enter token tick..."
                            value={tick} 
                            onChange={(e) => setTick(e.target.value)} 
                            required
                        />
                    </div>

                    {/* Total Supply Input */}
                    <div>
                        <label htmlFor="totalSupply" className="block text-sm font-bold text-teal-700 mb-2">
                            <FontAwesomeIcon icon={faLayerGroup} className="w-4 h-4 mr-2 text-lime-600" />
                            Total Supply
                        </label>
                        <input 
                            type="number" 
                            className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                            id="totalSupply" 
                            placeholder="Enter total supply..."
                            value={totalSupply} 
                            onChange={(e) => setTotalSupply(e.target.value)} 
                            required
                        />
                    </div>

                    {/* Limit Per Mint Input */}
                    <div>
                        <label htmlFor="limitPerMint" className="block text-sm font-bold text-teal-700 mb-2">
                            Limit Per Mint
                        </label>
                        <input 
                            type="number" 
                            className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                            id="limitPerMint" 
                            placeholder="Enter limit per mint..."
                            value={limitPerMint} 
                            onChange={(e) => setLimitPerMint(e.target.value)} 
                            required
                        />
                    </div>

                    {/* Wallet Address Input */}
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
                            required
                        />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-cartoon">
                            <p className="text-sm text-red-800 font-bold">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="text-center">
                        <button 
                            type="submit" 
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform"
                        >
                            <FontAwesomeIcon icon={faRocket} className="w-4 h-4 mr-2" />
                            Deploy Token
                        </button>
                    </div>
                </form>
            </div>

            {/* Development Popup */}
            <DevelopmentPopup 
                isOpen={showPopup} 
                onClose={() => setShowPopup(false)} 
                featureName="Token Deployment"
            />
        </div>
    );
}