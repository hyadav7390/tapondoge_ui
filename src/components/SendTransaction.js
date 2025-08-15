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
          <h2 className="text-2xl font-bold text-gray-900">Send DOGE</h2>
          <p className="text-gray-600 mt-1">Transfer DOGE to another wallet</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
          <div className="text-center">
            <FontAwesomeIcon icon={faWallet} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Wallet Not Connected</h3>
            <p className="text-gray-500">Please connect your wallet to send transactions.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Send DOGE</h2>
        <p className="text-gray-600 mt-1">Transfer DOGE to another wallet address</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-danger-600 mr-2" />
              <p className="text-sm text-danger-600">{error}</p>
            </div>
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-success-600 mr-2" />
              <p className="text-sm text-success-600">{success}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSend} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (DOGE)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
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
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
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
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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