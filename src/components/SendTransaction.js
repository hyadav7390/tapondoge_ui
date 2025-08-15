import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';

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
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Send DOGE</h5>
          <p className="card-text">Please connect your wallet to send transactions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Send DOGE</h5>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSend}>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount (DOGE)</label>
            <input
              type="number"
              className="form-control"
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
          
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Recipient Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Dogecoin address"
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send DOGE'}
          </button>
        </form>
      </div>
    </div>
  );
} 