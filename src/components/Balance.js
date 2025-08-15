import { useState } from 'react';
import { getTokensBalance, getAccountBlockedTransferables } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCoins
} from '@fortawesome/free-solid-svg-icons';


// getBalance - script.js - ln  : 551
export default function Balance() {
    const [walletAddress, setWalletAddress] = useState('');
    const [error, setError] = useState('');
    const [balances, setBalances] = useState([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    const { showLoader, hideLoader } = useLoader();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            showLoader();
            setError(''); // Reset error message

            // Validation
            if (!walletAddress) {
                hideLoader();
                setError('Wallet address is required.');
                return;
            }

            // Log the form values if validation passes
            console.log('Wallet Address:', walletAddress);

            // Get balance data
            const response = await getTokensBalance(walletAddress);
            console.log('Balance response:', response);

            // Get blocked transferables status
            const blockResponse = await getAccountBlockedTransferables(walletAddress);
            console.log('Block status response:', blockResponse);

            // Set the blocked status
            setIsBlocked(blockResponse.result);

            // Set balances array
            if (response && response.data && response.data.list) {
                setBalances(response.data.list);
            } else {
                setBalances([]);
            }

            setHasChecked(true);
        } catch (error) {
            console.error('Error getting balance:', error);
            setError('Failed to fetch balance. Please try again.');
            setBalances([]);
        } finally {
            hideLoader();
        }
    };

    return (
        <>
            <div className="container p-4" style={{ maxWidth: '60%' }}>
                <div className="card shadow rounded" style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                    <div className="card-header">
                        <h2>Check Balance</h2>
                    </div>
                    <div className="card-body p-5">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="walletAddress" className="form-label">Wallet Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="walletAddress"
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                />
                                {error && <div className="text-danger">{error}</div>}
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Check Balance
                                </button>
                            </div>
                        </form>

                        {/* Balance Result Section */}
                        {hasChecked && (
                            <div className="mt-4 p-3 border rounded">
                                <h4 className="text-center mb-3">Balance Results</h4>
                                {balances.length > 0 ? (
                                    <div className="balance-results">
                                        {balances.map((balance, index) => {
                                            const transferableBalance = (parseFloat(balance.transferableBalance || 0) / 1e18).toFixed(2);
                                            const overallBalance = (parseFloat(balance.overallBalance || 0) / 1e18).toFixed(2);

                                            return (
                                                <div key={index} className="card mb-3 balance-card">
                                                    <div className="card-header bg-light">
                                                        <h5 className="mb-0">
                                                            <FontAwesomeIcon
                                                                icon={faCoins}
                                                                style={{ fontSize: '20px', marginRight: '10px' }}
                                                            />
                                                            {balance.ticker}
                                                        </h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-6 mb-2">
                                                                <div className="d-flex justify-content-between">
                                                                    <span className="fw-bold">Overall:</span>
                                                                    <span>{overallBalance}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mb-2">
                                                                <div className={`d-flex justify-content-between ${isBlocked && transferableBalance > 0 ? 'text-danger' : ''}`}>
                                                                    <span className="fw-bold">Transferable:</span>
                                                                    <div>
                                                                        <span>{transferableBalance}</span>
                                                                        {isBlocked && transferableBalance > 0 && (
                                                                            <span className="badge bg-danger ms-2">BLOCKED</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="alert alert-warning text-center" role="alert">
                                        No Balance found for this address
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}