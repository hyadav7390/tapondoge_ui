import { useState } from 'react';

export default function Deploy() {
    const [tick, setTick] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [limitPerMint, setLimitPerMint] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        // Validation
        if (!tick.trim()) {
            setError('Tick is required.');
            return;
        }
        if (!totalSupply || totalSupply <= 0) {
            setError('Total Supply must be greater than 0.');
            return;
        }
        if (!limitPerMint || limitPerMint <= 0) {
            setError('Limit Per Mint must be greater than 0.');
            return;
        }
        if (!walletAddress.trim()) {
            setError('Wallet Address is required.');
            return;
        }

        // Log the form values if validation passes
        console.log('Tick:', tick);
        console.log('Total Supply:', totalSupply);
        console.log('Limit Per Mint:', limitPerMint);
        console.log('Wallet Address:', walletAddress);
        // Add any additional form handling logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="tick" className="form-label">Tick</label>
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
                <label htmlFor="totalSupply" className="form-label">Total Supply</label>
                <input 
                    type="number" 
                    className="form-control" 
                    id="totalSupply" 
                    value={totalSupply} 
                    onChange={(e) => setTotalSupply(e.target.value)} 
                    required
                />
                {error && <div className="text-danger">{error}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="limitPerMint" className="form-label">Limit Per Mint</label>
                <input 
                    type="number" 
                    className="form-control" 
                    id="limitPerMint" 
                    value={limitPerMint} 
                    onChange={(e) => setLimitPerMint(e.target.value)} 
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
            <div className="text-center">
                <button type="submit" className="btn btn-primary">Deploy</button>
            </div>
        </form>
    );
}