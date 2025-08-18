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
          <h2 className="text-3xl font-black text-teal-800 mb-2">💰 Wallet Balance</h2>
          <p className="text-teal-600 font-medium">View your wallet balance and tokens</p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-12">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-black text-teal-800 mb-2">Wallet Not Connected</h3>
            <p className="text-teal-600 font-medium">Please connect your wallet to view balance.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-teal-800 mb-2">💰 Wallet Balance</h2>
        <p className="text-teal-600 font-medium">Your wallet overview and token balances</p>
      </div>

      {/* Wallet Info Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-teal-800 flex items-center">
            <FontAwesomeIcon icon={faWallet} className="w-5 h-5 mr-3 text-lime-600" />
            Wallet Information
          </h3>
          <button 
            onClick={refreshWalletData}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 text-sm font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform"
          >
            <FontAwesomeIcon icon={faRefresh} className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
        
        {/* Address Section */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-teal-700 mb-2">Wallet Address</label>
          <div className="flex items-center p-4 bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon border-2 border-lime-200">
            <span className="text-sm text-teal-900 font-mono flex-1 truncate font-bold">{address}</span>
            <button 
              onClick={() => copyToClipboard(address)}
              className="ml-3 p-2 text-teal-600 hover:text-lime-600 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
              title="Copy to clipboard"
            >
              <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* UTXO Count */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-teal-700 mb-2">Available UTXOs</label>
          <div className="p-4 bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon border-2 border-lime-200">
            <span className="text-xl font-black text-teal-800">{utxoCount}</span>
          </div>
        </div>
      </div>

      {/* Token Balances Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6">
        <h3 className="text-xl font-black text-teal-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faCoins} className="w-5 h-5 mr-3 text-lime-600" />
          Token Balances
        </h3>
        
        {balance.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💰</div>
            <p className="text-teal-600 font-bold">No tokens found</p>
            <p className="text-teal-500 text-sm">Your wallet doesn&apos;t contain any tokens</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-lime-100 to-lime-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-black text-teal-800 uppercase tracking-wider border-b-2 border-lime-300">Token</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-teal-800 uppercase tracking-wider border-b-2 border-lime-300">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-lime-100">
                {balance.map((token, index) => (
                  <tr key={index} className="hover:bg-lime-50 transition-all duration-200 group">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full flex items-center justify-center shadow-cartoon-soft border-2 border-gold-600">
                          <FontAwesomeIcon icon={faCoins} className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-teal-800">{token.tick}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-teal-800">{parseInt(token.amt).toLocaleString()}</span>
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