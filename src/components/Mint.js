import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { generateWalletFeeTransaction } from '@/utils/wallet';
import { inscribe } from '@/utils/service';
import { toast } from 'react-hot-toast';

export default function Mint() {
    const [tick, setTick] = useState('');
    const [mintAmount, setMintAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [repetitions, setRepetitions] = useState(1);
    const [error, setError] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isInscribing, setIsInscribing] = useState(false);
    const [transactionIds, setTransactionIds] = useState([]);
    const [orderData, setOrderData] = useState(null);
    const [fee, setFee] = useState(0);

    const { wallet, address } = useWallet();

    const calculateFee = async () => {
        try {
            const feeTransaction = await generateWalletFeeTransaction(repetitions, "INSCRIBE");
            setFee(feeTransaction.fee);
            return feeTransaction;
        } catch (err) {
            console.error('Error calculating fee:', err);
            setError('Failed to calculate transaction fee');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!tick.trim()) {
            setError('Tick is required.');
            return;
        }
        if (!mintAmount || mintAmount <= 0) {
            setError('Amount must be greater than 0.');
            return;
        }
        if (!walletAddress.trim()) {
            setError('Wallet Address is required.');
            return;
        }
        if (!repetitions || repetitions < 1) {
            setError('Repetitions must be greater than 0.');
            return;
        }

        // Prepare order data
        const data = {
            totalInscriptions: repetitions,
            wAddress: address,
            rAddress: walletAddress,
            inscription: {
                p: 'tap',
                op: 'token-mint',
                tick: tick,
                amt: mintAmount
            }
        };

        // Calculate fee
        const feeTransaction = await calculateFee();
        if (!feeTransaction) return;

        data.feeTx = feeTransaction.tx;
        data.totalFee = feeTransaction.fee;

        setOrderData(data);
        setShowConfirmation(true);
    };

    const handleConfirm = async () => {
        try {
            setIsInscribing(true);
            setError('');

            const response = await inscribe(orderData);
            
            if (response?.status === 200) {
                const txIds = response.data.response.txIds;
                setTransactionIds(txIds);
                toast.success('Inscription successful!');
            } else {
                throw new Error('Failed to process inscription');
            }
        } catch (err) {
            console.error('Inscription error:', err);
            setError(err.message || 'Failed to process inscription');
            toast.error(err.message || 'Failed to process inscription');
        } finally {
            setIsInscribing(false);
        }
    };

    const handleBack = () => {
        setShowConfirmation(false);
        setOrderData(null);
        setTransactionIds([]);
    };

    if (transactionIds.length > 0) {
        return (
            <div className="transaction-success">
                <h3 className="text-success mb-4">Inscription Successful!</h3>
                <div className="transaction-links">
                    {transactionIds.map((txId, index) => (
                        <a 
                            key={index}
                            href={`https://sochain.com/tx/DOGE/${txId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-block mb-2"
                        >
                            Transaction {index + 1}: {txId.slice(0, 30)}...
                        </a>
                    ))}
                </div>
                <button 
                    className="btn btn-primary mt-4"
                    onClick={handleBack}
                >
                    Mint Another Token
                </button>
            </div>
        );
    }

    if (showConfirmation) {
        return (
            <div className="confirmation-panel">
                <h3>Order Confirmation</h3>
                <div className="order-details p-3 bg-light rounded mb-4">
                    <pre>{JSON.stringify(orderData.inscription, null, 2)}</pre>
                </div>
                <div className="fee-details mb-4">
                    <p>Transaction Fee: {fee} DOGE</p>
                </div>
                <div className="confirmation-checkboxes mb-4">
                    <div className="form-check mb-2">
                        <input 
                            type="checkbox" 
                            className="form-check-input" 
                            id="confirmAccuracy" 
                            required 
                        />
                        <label className="form-check-label" htmlFor="confirmAccuracy">
                            I confirm the accuracy of the input data
                        </label>
                    </div>
                    <div className="form-check">
                        <input 
                            type="checkbox" 
                            className="form-check-input" 
                            id="agreeTerms" 
                            required 
                        />
                        <label className="form-check-label" htmlFor="agreeTerms">
                            I agree to the Terms and Conditions
                        </label>
                    </div>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="d-flex justify-content-between">
                    <button 
                        className="btn btn-secondary" 
                        onClick={handleBack}
                        disabled={isInscribing}
                    >
                        Back
                    </button>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleConfirm}
                        disabled={isInscribing}
                    >
                        {isInscribing ? 'Processing...' : 'Confirm Inscription'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="mintTick" className="form-label">Tick</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="tick" 
                    value={tick} 
                    onChange={(e) => setTick(e.target.value)} 
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="mintAmount" className="form-label">Amount</label>
                <input 
                    type="number" 
                    className="form-control" 
                    id="mintAmount" 
                    value={mintAmount} 
                    onChange={(e) => setMintAmount(e.target.value)} 
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="walletAddress" className="form-label">Wallet Address</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="walletAddress" 
                    value={walletAddress} 
                    onChange={(e) => setWalletAddress(e.target.value)} 
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="repetitions" className="form-label">
                    Repetitions
                </label>
                <input 
                    type="range" 
                    className="form-range mb-4" 
                    id="repetitions"
                    min="1"
                    max="100"
                    value={repetitions}
                    onChange={(e) => setRepetitions(e.target.value)}
                    required
                />
                <div className="progress" style={{ height: '24px' }}>
                    <div 
                        className="progress-bar d-flex align-items-center justify-content-center" 
                        role="progressbar" 
                        style={{ width: `${repetitions}%` }}
                        aria-valuenow={repetitions} 
                        aria-valuemin="1" 
                        aria-valuemax="100"
                    >
                        {repetitions}
                    </div>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="text-center">
                <button type="submit" className="btn btn-primary">Next</button>
            </div>
        </form>
    );
}