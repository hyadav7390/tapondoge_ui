import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faCopy, faRefresh, faCoins } from '@fortawesome/free-solid-svg-icons';

export default function WalletBalance() {
  const { isConnected, address, balance, utxoCount, refreshWalletData } = useWallet();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Address copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Wallet Balance</h2>
          <p className="text-gray-600 mt-1">View your wallet balance and tokens</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
          <div className="text-center">
            <FontAwesomeIcon icon={faWallet} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Wallet Not Connected</h3>
            <p className="text-gray-500">Please connect your wallet to view balance.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Wallet Balance</h2>
        <p className="text-gray-600 mt-1">Your wallet overview and token balances</p>
      </div>

      {/* Wallet Info Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faWallet} className="w-5 h-5 mr-2 text-primary-600" />
            Wallet Information
          </h3>
          <button 
            onClick={refreshWalletData}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faRefresh} className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
        
        {/* Address Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-900 font-mono flex-1 truncate">{address}</span>
            <button 
              onClick={() => copyToClipboard(address)}
              className="ml-2 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              title="Copy to clipboard"
            >
              <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* UTXO Count */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Available UTXOs</label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-lg font-semibold text-gray-900">{utxoCount}</span>
          </div>
        </div>
      </div>

      {/* Token Balances Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <FontAwesomeIcon icon={faCoins} className="w-5 h-5 mr-2 text-primary-600" />
          Token Balances
        </h3>
        
        {balance.length === 0 ? (
          <div className="text-center py-8">
            <FontAwesomeIcon icon={faCoins} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No tokens found</p>
            <p className="text-gray-400 text-sm">Your wallet doesn&apos;t contain any tokens</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {balance.map((token, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{token.tick}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{parseInt(token.amt).toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 