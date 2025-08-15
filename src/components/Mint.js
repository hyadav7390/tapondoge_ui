import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faWallet, faRepeat, faPlay } from '@fortawesome/free-solid-svg-icons';

export default function Mint() {
    const [tick, setTick] = useState('');
    const [mintAmount, setMintAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [repetitions, setRepetitions] = useState(1);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        // Validation
        if (!tick.trim()) {
            setError('Tick is required.');
            return;
        }
        if (!mintAmount || mintAmount <= 0) {
            setError('Amount must be greater than 0.');
            return;
        }
        if (!walletAddress.trim()) {
            setError('Wallet Address is required.');
            return;
        }
        if (!repetitions || repetitions < 1) {
            setError('Repetitions must be greater than 0.');
            return;
        }

        // Log the form values if validation passes
        console.log('Tick:', tick);
        console.log('Mint Amount:', mintAmount);
        console.log('Wallet Address:', walletAddress);
        console.log('Repetitions:', repetitions);
        // Add any additional form handling logic here
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Mint Tokens</h2>
                <p className="text-gray-600 mt-1">Create new tokens with your specifications</p>
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

                    {/* Mint Amount Input */}
                    <div>
                        <label htmlFor="mintAmount" className="block text-sm font-medium text-gray-700 mb-2">
                            Amount
                        </label>
                        <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            id="mintAmount" 
                            placeholder="Enter mint amount..."
                            value={mintAmount} 
                            onChange={(e) => setMintAmount(e.target.value)} 
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

                    {/* Repetitions Slider */}
                    <div>
                        <label htmlFor="repetitions" className="block text-sm font-medium text-gray-700 mb-2">
                            <FontAwesomeIcon icon={faRepeat} className="w-4 h-4 mr-2 text-primary-600" />
                            Repetitions: {repetitions}
                        </label>
                        <input 
                            type="range" 
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            id="repetitions"
                            min="1"
                            max="100"
                            value={repetitions}
                            onChange={(e) => setRepetitions(parseInt(e.target.value))}
                            required
                        />
                        
                        {/* Progress Bar */}
                        <div className="mt-3 bg-gray-200 rounded-full h-3">
                            <div 
                                className="bg-primary-600 h-3 rounded-full transition-all duration-300 flex items-center justify-center"
                                style={{ width: `${repetitions}%` }}
                            >
                                <span className="text-xs text-white font-medium">{repetitions}</span>
                            </div>
                        </div>
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
                            <FontAwesomeIcon icon={faPlay} className="w-4 h-4 mr-2" />
                            Mint Tokens
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}