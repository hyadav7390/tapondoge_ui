import { useState, useEffect } from 'react';
import { getDeployments } from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';
import { toast } from 'react-hot-toast';

export default function Dmt() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    fetchDmtTokens();
  }, []);

  const fetchDmtTokens = async () => {
    try {
      showLoader();
      const response = await getDeployments(0, 20);
      const dmtTokens = response.result.filter(token => token.dmt);
      setTokens(dmtTokens);
    } catch (error) {
      console.error('Error fetching DMT tokens:', error);
      toast.error('Failed to load DMT tokens');
    } finally {
      hideLoader();
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">DMT Tokens</h2>

      {tokens.length > 0 ? (
        <div className="grid gap-4">
          {tokens.map((token, index) => (
            <div key={index} className="bg-white bg-opacity-5 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{token.tick}</h3>
                <div className="text-gray-400">
                  Holders: {token.holdings || '-'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No DMT tokens found
        </div>
      )}
    </div>
  );
}