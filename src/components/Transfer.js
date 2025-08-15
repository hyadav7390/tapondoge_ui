import { useState } from 'react';

export default function Transfer() {
    const [tick, setTick] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        // Validation
        if (!tick.trim()) {
            setError('Tick is required.');
            return;
        }
        if (!recipientAddress) {
            setError('Recipient address is required.');
            return;
        }
        if (!amount || amount <= 0) {
            setError('Amount must be greater than 0.');
            return;
        }

        // Log the form values if validation passes
        console.log('Tick:', tick);
        console.log('Recipient Address:', recipientAddress);
        console.log('Amount:', amount);
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
                <label htmlFor="recipientAddress" className="form-label">Recipient Address</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="recipientAddress" 
                    value={recipientAddress} 
                    onChange={(e) => setRecipientAddress(e.target.value)} 
                    required
                />
                {error && <div className="text-danger">{error}</div>} {/* Display error message */}
            </div>
            <div className="mb-3">
                <label htmlFor="amount" className="form-label">Amount</label>
                <input 
                    type="number" 
                    className="form-control" 
                    id="amount" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    required
                />
                {error && <div className="text-danger">{error}</div>} {/* Display error message */}
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-primary">Transfer</button>
            </div>
        </form>
    );
}