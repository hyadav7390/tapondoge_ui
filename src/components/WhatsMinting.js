import { useState, useEffect } from 'react';
import { getDeploymentsLength, getDeployments, getMintTokensLeft } from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from 'react-hot-toast';

export default function WhatsMinting() {
  const [recentTokens, setRecentTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useLoader();
  const { isConnected, address } = useWallet();

  useEffect(() => {
    fetchRecentlyDeployed();
  }, []);

  const calculateMintProgress = (max, balance) => {
    max = parseFloat(max);
    balance = parseFloat(balance);
    const progress = ((max - balance) / max) * 100;
    return Math.min(Math.round(progress), 100);
  };

  const fetchRecentlyDeployed = async () => {
    try {
      showLoader();
      const lengthResponse = await getDeploymentsLength();
      const totalTokens = lengthResponse.result;
      const offset = totalTokens - 10;
      
      const response = await getDeployments(offset);
      const tokens = response.result;

      const tokensWithProgress = await Promise.all(
        tokens.map(async (token) => {
          const mintsLeftResponse = await getMintTokensLeft(token.tick);
          const mintsLeft = mintsLeftResponse.result / 1e18;
          const progress = calculateMintProgress(token.max, mintsLeft);
          return { ...token, progress, mintsLeft };
        })
      );

      setRecentTokens(tokensWithProgress);
    } catch (error) {
      console.error('Error fetching recently deployed tokens:', error);
      toast.error('Failed to load recently deployed tokens');
    } finally {
      hideLoader();
      setLoading(false);
    }
  };

  const handleMint = async (tick, limit) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Navigate to inscribe page with pre-filled values
    // This should be handled by your routing system
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentTokens.map((token, index) => (
        <div key={index} className="token-card bg-opacity-20 bg-white p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{token.tick}</h3>
            {token.progress < 100 && (
              <span className="text-sm text-green-400">Available</span>
            )}
          </div>

          <div className="space-y-4">
            <div className="stat-group">
              <div className="text-sm text-gray-400">Max Supply</div>
              <div className="text-lg">{token.max}.00Z</div>
            </div>

            <div className="stat-group">
              <div className="text-sm text-gray-400">Limit Per Mint</div>
              <div className="text-lg">{token.lim}.00Z</div>
            </div>

            <div className="stat-group">
              <div className="text-sm text-gray-400">Progress</div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-lg">{token.progress}%</div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                  <div
                    style={{ width: `${token.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {token.progress < 100 && (
            <button
              onClick={() => handleMint(token.tick, token.lim)}
              className="w-full mt-4 bg-primary text-secondary py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Mint Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
}