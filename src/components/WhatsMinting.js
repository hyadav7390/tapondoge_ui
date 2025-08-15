import { useEffect, useState, useCallback, useRef } from 'react';
import { getDeployments, getMintTokensLeft } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCoins, faPlay } from '@fortawesome/free-solid-svg-icons';

export default function WhatsMinting() {
    const [tokensWithMints, setTokensWithMints] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const loadingRef = useRef(false);
    const mountedRef = useRef(true);

    // Calculate mint progress percentage
    const calculateMintProgress = useCallback((max, balance) => {
        max = parseFloat(max);
        balance = parseFloat(balance);
        const progress = ((max - balance) / max) * 100;
        return Math.min(Math.round(progress), 100);
    }, []);

    // Load all data
    useEffect(() => {
        // Set mounted reference to true on mount
        mountedRef.current = true;

        const loadData = async () => {
            // Prevent duplicate calls
            if (loadingRef.current) return;
            loadingRef.current = true;

            try {
                console.log("Starting to fetch deployments");
                showLoader();

                // Step 1: Get deployments
                const deploymentsResponse = await getDeployments(0, 10);
                const tokens = deploymentsResponse.result || [];

                // Check if component is still mounted
                if (!mountedRef.current) {
                    console.log("Component unmounted, stopping data load");
                    return;
                }

                if (!tokens || tokens.length === 0) {
                    console.log("No tokens found");
                    setTokensWithMints([]);
                    return;
                }

                console.log(`Found ${tokens.length} tokens, fetching mints left`);

                // Step 2: Get mints left for each token
                const tokensPromises = tokens.map(async (token) => {
                    try {
                        // Check if still mounted before each API call
                        if (!mountedRef.current) return null;

                        console.log(`Fetching mints left for ${token.tick}`);
                        const response = await getMintTokensLeft(token.tick);

                        // Check again if still mounted after API call
                        if (!mountedRef.current) return null;

                        const mintsLeft = response.result / 1e18;
                        const progress = calculateMintProgress(token.max, mintsLeft);

                        return {
                            ...token,
                            mintsLeft,
                            progress,
                            showMintButton: progress < 100
                        };
                    } catch (err) {
                        console.error(`Error fetching mints left for ${token.tick}:`, err);
                        return {
                            ...token,
                            mintsLeft: 0,
                            progress: 100,
                            showMintButton: false
                        };
                    }
                });

                const tokensWithMintData = await Promise.all(tokensPromises);

                // Final mounted check before state update
                if (!mountedRef.current) {
                    console.log("Component unmounted before final state update");
                    return;
                }

                console.log("Setting tokens with mint data", tokensWithMintData);
                // Filter out any null values from unmounted calls
                setTokensWithMints(tokensWithMintData.filter(token => token !== null));
            } catch (error) {
                console.error("Error in WhatsMining loadData:", error);
                if (mountedRef.current) {
                    setTokensWithMints([]);
                }
            } finally {
                if (mountedRef.current) {
                    hideLoader();
                }
                loadingRef.current = false;
            }
        };

        loadData();

        // Cleanup function
        return () => {
            mountedRef.current = false;
        };
    }, []); // Removed dependencies that were causing infinite calls

    const handleMintClick = (token) => {
        console.log(`Mint clicked for ${token.tick}`);
        // Add mint functionality here
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">What&apos;s Minting</h2>
                <p className="text-gray-600 mt-1">Discover tokens currently available for minting</p>
            </div>

            {/* Tokens Grid */}
            {tokensWithMints.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tokensWithMints.map((token, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-200">
                            {/* Token Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <FontAwesomeIcon 
                                            icon={faFire} 
                                            className={`w-6 h-6 ${token.showMintButton ? 'text-warning-500' : 'text-gray-400'}`} 
                                        />
                                        <h3 className="text-xl font-bold text-gray-900">{token.tick}</h3>
                                    </div>
                                    {token.showMintButton && (
                                        <span className="px-2 py-1 bg-success-100 text-success-800 text-xs font-medium rounded-full">
                                            Live
                                        </span>
                                    )}
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Mint Progress</span>
                                        <span>{token.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                token.progress < 50 ? 'bg-success-500' : 
                                                token.progress < 80 ? 'bg-warning-500' : 'bg-danger-500'
                                            }`}
                                            style={{ width: `${token.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Token Details */}
                            <div className="p-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Max Supply:</span>
                                        <span className="font-medium text-gray-900">
                                            {(token.max / 1e18).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mints Left:</span>
                                        <span className="font-medium text-gray-900">
                                            {token.mintsLeft.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Block:</span>
                                        <span className="font-medium text-gray-900">{token.blck}</span>
                                    </div>
                                </div>

                                {/* Mint Button */}
                                {token.showMintButton && (
                                    <button
                                        onClick={() => handleMintClick(token)}
                                        className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                                    >
                                        <FontAwesomeIcon icon={faPlay} className="w-4 h-4 mr-2" />
                                        Mint Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <FontAwesomeIcon icon={faCoins} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tokens minting</h3>
                    <p className="text-gray-600">Check back later for new minting opportunities</p>
                </div>
            )}
        </div>
    );
}