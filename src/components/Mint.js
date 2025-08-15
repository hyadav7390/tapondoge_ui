import { useState } from 'react';
// gotostep2() and sendFeeAndInscribe - script.js 
export default function Mint() {
    const [tick, setTick] = useState('');
    const [mintAmount, setMintAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [repetitions, setRepetitions] = useState(1);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Reset error message

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

        // Log the form values if validation passes
        console.log('Tick:', tick);
        console.log('Mint Amount:', mintAmount);
        console.log('Wallet Address:', walletAddress);
        console.log('Repetitions:', repetitions);
        // Add any additional form handling logic here
    };

    return (
        <>
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
                    {error && <div className="text-danger">{error}</div>}
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
                    {error && <div className="text-danger">{error}</div>}
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
                    {error && <div className="text-danger">{error}</div>}
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
                    {error && <div className="text-danger">{error}</div>}
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Mint</button>
                </div>
            </form>
        </>
    )
}