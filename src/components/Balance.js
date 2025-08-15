import { useState } from 'react';
import { getTokensBalance, getAccountBlockedTransferables } from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';
import { toast } from 'react-hot-toast';

export default function Balance() {
  const [address, setAddress] = useState('');
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState('');
  const { showLoader, hideLoader } = useLoader();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Please enter an address');
      return;
    }

    try {
      showLoader();
      setError('');

      const [balanceResponse, blockedResponse] = await Promise.all([
        getTokensBalance(address),
        getAccountBlockedTransferables(address)
      ]);

      const balanceList = balanceResponse.data.list || [];
      const isBlocked = blockedResponse.result;

      setBalances(balanceList.map(balance => ({
        ...balance,
        isBlocked,
        transferableBalance: (parseFloat(balance.transferableBalance || 0) / 1e18).toFixed(2),
        overallBalance: (parseFloat(balance.overallBalance || 0) / 1e18).toFixed(2)
      })));

    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch balance. Please try again.');
      toast.error('Failed to fetch balance');
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Check Balance</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Dogecoin address"
            className="flex-1 bg-opacity-20 bg-white rounded-lg px-4 py-2 border border-gray-700"
          />
          <button
            type="submit"
            className="bg-primary text-secondary px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Check Balance
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {balances.length > 0 ? (
        <div className="grid gap-4">
          {balances.map((balance, index) => (
            <div key={index} className="bg-white bg-opacity-5 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{balance.ticker}</h3>
                {balance.isBlocked && balance.transferableBalance > 0 && (
                  <span className="bg-red-500 bg-opacity-20 text-red-500 px-3 py-1 rounded-full text-sm">
                    BLOCKED
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Overall Balance</div>
                  <div className="text-lg">{balance.overallBalance}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Transferable Balance</div>
                  <div className="text-lg">{balance.transferableBalance}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No balance information to display
        </div>
      )}
    </div>
  );
}