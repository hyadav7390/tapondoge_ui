import React from 'react';
import { useWallet } from '@/contexts/WalletContext';

export default function WalletBalance() {
  const { isConnected, address, balance, utxoCount, refreshWalletData } = useWallet();

  if (!isConnected) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Wallet Balance</h5>
          <p className="card-text">Please connect your wallet to view balance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Wallet Balance</h5>
          <button 
            className="btn btn-sm btn-outline-primary" 
            onClick={refreshWalletData}
          >
            Refresh
          </button>
        </div>
        
        <div className="mb-3">
          <small className="text-muted">Address:</small>
          <div className="d-flex align-items-center">
            <span className="text-truncate" style={{ maxWidth: '200px' }}>{address}</span>
            <button 
              className="btn btn-sm btn-link ms-2" 
              onClick={() => navigator.clipboard.writeText(address)}
              title="Copy to clipboard"
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <small className="text-muted">Available UTXOs:</small>
          <p className="mb-0">{utxoCount}</p>
        </div>
        
        <div>
          <small className="text-muted">Token Balances:</small>
          {balance.length === 0 ? (
            <p className="mb-0">No tokens found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {balance.map((token, index) => (
                    <tr key={index}>
                      <td>{token.tick}</td>
                      <td>{parseInt(token.amt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 