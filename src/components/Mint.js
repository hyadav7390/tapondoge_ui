import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faWallet, faRepeat, faPlay } from '@fortawesome/free-solid-svg-icons';
import DevelopmentPopup from './DevelopmentPopup';

export default function Mint() {
    const [tick, setTick] = useState('');
    const [mintAmount, setMintAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [repetitions, setRepetitions] = useState(1);
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

        // Show development popup instead of processing
        setShowPopup(true);
        
        // Log the form values if validation passes
        console.log('Tick:', tick);
        console.log('Mint Amount:', mintAmount);
        console.log('Wallet Address:', walletAddress);
        console.log('Repetitions:', repetitions);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-black text-teal-800 mb-2">🪙 Mint Tokens</h2>
                <p className="text-teal-600 font-medium">Create new tokens with your specifications</p>
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

                    {/* Mint Amount Input */}
                    <div>
                        <label htmlFor="mintAmount" className="block text-sm font-bold text-teal-700 mb-2">
                            Amount
                        </label>
                        <input 
                            type="number" 
                            className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                            id="mintAmount" 
                            placeholder="Enter mint amount..."
                            value={mintAmount} 
                            onChange={(e) => setMintAmount(e.target.value)} 
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

                    {/* Repetitions Slider */}
                    <div>
                        <label htmlFor="repetitions" className="block text-sm font-bold text-teal-700 mb-2">
                            <FontAwesomeIcon icon={faRepeat} className="w-4 h-4 mr-2 text-lime-600" />
                            Repetitions: {repetitions}
                        </label>
                        <input 
                            type="range" 
                            className="w-full h-3 bg-gradient-to-r from-lime-200 to-lime-300 rounded-cartoon appearance-none cursor-pointer slider border-2 border-lime-400"
                            id="repetitions"
                            min="1"
                            max="100"
                            value={repetitions}
                            onChange={(e) => setRepetitions(parseInt(e.target.value))}
                            required
                        />
                        
                        {/* Progress Bar */}
                        <div className="mt-3 bg-gradient-to-r from-lime-200 to-lime-300 rounded-cartoon h-4 border-2 border-lime-400">
                            <div 
                                className="bg-gradient-to-r from-lime-400 to-lime-500 h-4 rounded-cartoon transition-all duration-300 flex items-center justify-center border-2 border-lime-600"
                                style={{ width: `${repetitions}%` }}
                            >
                                <span className="text-xs text-teal-900 font-bold">{repetitions}</span>
                            </div>
                        </div>
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
                            <FontAwesomeIcon icon={faPlay} className="w-4 h-4 mr-2" />
                            Mint Tokens
                        </button>
                    </div>
                </form>
            </div>

            {/* Development Popup */}
            <DevelopmentPopup 
                isOpen={showPopup} 
                onClose={() => setShowPopup(false)} 
                featureName="Token Minting"
            />
        </div>
    );
}