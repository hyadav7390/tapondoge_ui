import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faUser, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import DevelopmentPopup from './DevelopmentPopup';

export default function Transfer() {
    const [tick, setTick] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
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
        if (!recipientAddress) {
            setError('Recipient address is required.');
            return;
        }
        if (!amount || amount <= 0) {
            setError('Amount must be greater than 0.');
            return;
        }

        // Show development popup instead of processing
        setShowPopup(true);
        
        // Log the form values if validation passes
        console.log('Tick:', tick);
        console.log('Recipient Address:', recipientAddress);
        console.log('Amount:', amount);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-black text-teal-800 mb-2">📤 Transfer Tokens</h2>
                <p className="text-teal-600 font-medium">Send tokens to another wallet address</p>
            </div>

            {/* Form Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tick Input */}
                    <div>
                        <label htmlFor="tick" className="block text-sm font-bold text-teal-700 mb-2">
                            <FontAwesomeIcon icon={faCoins} className="w-4 h-4 mr-2 text-lime-600" />
                            Token Tick
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

                    {/* Recipient Address Input */}
                    <div>
                        <label htmlFor="recipientAddress" className="block text-sm font-bold text-teal-700 mb-2">
                            <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2 text-lime-600" />
                            Recipient Address
                        </label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                            id="recipientAddress" 
                            placeholder="Enter recipient wallet address..."
                            value={recipientAddress} 
                            onChange={(e) => setRecipientAddress(e.target.value)} 
                            required
                        />
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-bold text-teal-700 mb-2">
                            Amount
                        </label>
                        <input 
                            type="number" 
                            className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
                            id="amount" 
                            placeholder="Enter amount to transfer..."
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
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
                            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-2" />
                            Transfer Tokens
                        </button>
                    </div>
                </form>
            </div>

            {/* Development Popup */}
            <DevelopmentPopup 
                isOpen={showPopup} 
                onClose={() => setShowPopup(false)} 
                featureName="Token Transfer"
            />
        </div>
    );
}