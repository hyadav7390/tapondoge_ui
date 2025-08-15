import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faUser, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default function Transfer() {
    const [tick, setTick] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

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

        // Log the form values if validation passes
        console.log('Tick:', tick);
        console.log('Recipient Address:', recipientAddress);
        console.log('Amount:', amount);
        // Add any additional form handling logic here
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Transfer Tokens</h2>
                <p className="text-gray-600 mt-1">Send tokens to another wallet address</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tick Input */}
                    <div>
                        <label htmlFor="tick" className="block text-sm font-medium text-gray-700 mb-2">
                            <FontAwesomeIcon icon={faCoins} className="w-4 h-4 mr-2 text-primary-600" />
                            Token Tick
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

                    {/* Recipient Address Input */}
                    <div>
                        <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700 mb-2">
                            <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2 text-primary-600" />
                            Recipient Address
                        </label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            id="recipientAddress" 
                            placeholder="Enter recipient wallet address..."
                            value={recipientAddress} 
                            onChange={(e) => setRecipientAddress(e.target.value)} 
                            required
                        />
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                            Amount
                        </label>
                        <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            id="amount" 
                            placeholder="Enter amount to transfer..."
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
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
                            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-2" />
                            Transfer Tokens
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}