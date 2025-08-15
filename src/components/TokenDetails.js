import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { getTransferableInscriptions } from '@/utils/wallet';
import { getAccountBlockedTransferables } from '@/utils/service';
// import { decodeInscriptionData } from '../utils/inscriptionUtils';

const TokenDetails = ({ token, onBack }) => {
    const { wallet } = useWallet();
    const [transferableInscriptions, setTransferableInscriptions] = useState([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTokenDetails = async () => {
            try {
                setIsLoading(true);
                const blocked = await getAccountBlockedTransferables(wallet.address);
                console.log('blocked', blocked);
                setIsBlocked(!blocked);
                const transferables = await getTransferableInscriptions(token.ticker, wallet.inscriptions);
                console.log('transferables', transferables);
                setTransferableInscriptions(transferables);
            } catch (error) {
                console.error('Error loading token details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTokenDetails();
    }, [token, wallet]);

    const handleTransfer = (inscriptionId, amount) => {
        // Implement transfer functionality
    };

    const handleListToken = (inscriptionId) => {
        // Implement listing functionality
    };

    const handleUnlistToken = (inscriptionId) => {
        // Implement unlisting functionality
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            {/* Header Section */}
            <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                    <button 
                        onClick={onBack}
                        className="btn btn-outline-secondary me-3"
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                        <h2 className="mb-1">{token.ticker}</h2>
                        <p className="text-muted mb-0">
                            Overall Balance: {(token.overallBalance / 1e18)}
                        </p>
                    </div>
                </div>
                {isBlocked && (
                    <div className="alert alert-danger" role="alert">
                        Transfers are currently blocked
                    </div>
                )}
            </div>

            {/* Transferable Tokens Section */}
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title mb-4">Transferable Tokens</h3>
                    
                    {transferableInscriptions.length > 0 ? (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {transferableInscriptions.map((insc, index) => {
                                const inscription = wallet.inscriptions[insc.inscriptionId];
                                const isListed = false; // Add logic to check if token is listed

                                return (
                                    <div key={index} className="col">
                                        <div className={`card h-100 ${isBlocked ? 'bg-light' : 'hover-shadow'}`}>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <span className="badge bg-secondary">
                                                        #{index + 1}
                                                    </span>
                                                    {isBlocked && (
                                                        <span className="badge bg-danger">
                                                            BLOCKED
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <h4 className="card-title mb-4">
                                                    {insc.amount}
                                                </h4>

                                                {!isBlocked && (
                                                    <div className="mt-auto">
                                                        {isListed ? (
                                                            <button 
                                                                onClick={() => handleUnlistToken(inscription.id)}
                                                                className="btn btn-outline-danger w-100"
                                                            >
                                                                Unlist
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleListToken(insc.inscriptionId, token.ticker)}
                                                                className="btn btn-outline-primary w-100"
                                                            >
                                                                List for Sale
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted mb-0">No transferable tokens available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TokenDetails; 