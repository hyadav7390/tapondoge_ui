import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faWallet, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function SendTransaction() {
  const { isConnected, sendWalletTransaction } = useWallet();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Validate inputs
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!address || !address.trim()) {
      setError('Please enter a valid recipient address');
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await sendWalletTransaction(parseFloat(amount), address.trim());
      console.log('Transaction result:', result);
      setSuccess(`Transaction sent successfully! TxID: ${result.txid}`);
      
      // Reset form
      setAmount('');
      setAddress('');
    } catch (error) {
      console.error('Transaction failed:', error);
      setError(error.message || 'Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-black text-teal-800 mb-2">📤 Send DOGE</h2>
          <p className="text-teal-600 font-medium">Transfer DOGE to another wallet</p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-12">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-black text-teal-800 mb-2">Wallet Not Connected</h3>
            <p className="text-teal-600 font-medium">Please connect your wallet to send transactions.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-teal-800 mb-2">📤 Send DOGE</h2>
        <p className="text-teal-600 font-medium">Transfer DOGE to another wallet address</p>
      </div>

      {/* Form Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-cartoon">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-red-600 mr-3" />
              <p className="text-sm text-red-800 font-bold">{error}</p>
            </div>
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-cartoon">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-sm text-green-800 font-bold">{success}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSend} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-bold text-teal-700 mb-2">
              Amount (DOGE)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              disabled={isLoading}
            />
          </div>
          
          {/* Address Input */}
          <div>
            <label htmlFor="address" className="block text-sm font-bold text-teal-700 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-teal-300 rounded-cartoon focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium text-teal-800 placeholder-teal-500"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Dogecoin address"
              required
              disabled={isLoading}
            />
          </div>
          
          {/* Submit Button */}
          <div className="text-center">
            <button 
              type="submit" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send DOGE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 