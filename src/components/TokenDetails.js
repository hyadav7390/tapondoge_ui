import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { getTransferableInscriptions } from '@/utils/wallet';
import { getAccountBlockedTransferables } from '@/utils/service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExclamationTriangle, faTag, faList, faUnlink } from '@fortawesome/free-solid-svg-icons';

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

        if (wallet && wallet.address && token) {
            loadTokenDetails();
        }
    }, [token, wallet]);

    const handleTransfer = (inscriptionId, amount) => {
        // Implement transfer functionality
        console.log('Transfer', inscriptionId, amount);
    };

    const handleListToken = (inscriptionId) => {
        // Implement listing functionality
        console.log('List token', inscriptionId);
    };

    const handleUnlistToken = (inscriptionId) => {
        // Implement unlisting functionality
        console.log('Unlist token', inscriptionId);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                    <button 
                        onClick={onBack}
                        className="mr-4 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{token.ticker}</h2>
                        <p className="text-gray-600">
                            Overall Balance: {(token.overallBalance / 1e18).toLocaleString()}
                        </p>
                    </div>
                </div>
                
                {isBlocked && (
                    <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-danger-600 mr-2" />
                            <p className="text-danger-800 font-medium">Transfers are currently blocked</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Transferable Tokens Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FontAwesomeIcon icon={faTag} className="w-5 h-5 mr-2 text-primary-600" />
                    Transferable Tokens
                </h3>
                
                {transferableInscriptions && transferableInscriptions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {transferableInscriptions.map((insc, index) => {
                            const inscription = wallet.inscriptions[insc.inscriptionId];
                            const isListed = false; // Add logic to check if token is listed

                            return (
                                <div key={index} className={`bg-gray-50 rounded-xl p-6 border-2 transition-all duration-200 ${
                                    isBlocked ? 'border-gray-200 opacity-60' : 'border-gray-200 hover:border-primary-300 hover:shadow-lg'
                                }`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-full">
                                            #{index + 1}
                                        </span>
                                        {isBlocked && (
                                            <span className="px-3 py-1 bg-danger-100 text-danger-800 text-sm font-medium rounded-full">
                                                BLOCKED
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="text-center mb-6">
                                        <h4 className="text-2xl font-bold text-gray-900 mb-2">
                                            {insc.amount}
                                        </h4>
                                        <p className="text-sm text-gray-600">tokens</p>
                                    </div>

                                    {!isBlocked && (
                                        <div className="space-y-2">
                                            {isListed ? (
                                                <button 
                                                    onClick={() => handleUnlistToken(inscription.id)}
                                                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-danger-300 text-danger-700 bg-white rounded-lg hover:bg-danger-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 transition-colors duration-200"
                                                >
                                                    <FontAwesomeIcon icon={faUnlink} className="w-4 h-4 mr-2" />
                                                    Unlist
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleListToken(insc.inscriptionId, token.ticker)}
                                                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-primary-300 text-primary-700 bg-white rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                                                >
                                                    <FontAwesomeIcon icon={faList} className="w-4 h-4 mr-2" />
                                                    List for Sale
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FontAwesomeIcon icon={faTag} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No transferable tokens available</p>
                        <p className="text-gray-400 text-sm">All your tokens are currently in use</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TokenDetails; 