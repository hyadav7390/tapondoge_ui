import { useEffect, useState, useCallback, useRef } from 'react';
import { getDeployments, getMintTokensLeft } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';

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
                    console.log("Finishing data load");
                }
                loadingRef.current = false;
                hideLoader();
            }
        };

        loadData();

        // Cleanup function to run when component unmounts
        return () => {
            console.log("WhatsMining component unmounting");
            mountedRef.current = false;
            hideLoader();
        };
    }, [showLoader, hideLoader, calculateMintProgress]);

    // Handle mint button click
    const handleMint = useCallback((tick, lim) => {
        console.log(`Mint ${tick} with limit ${lim}`);
        // Implement mint functionality or navigate to mint page
    }, []);

    return (
        <>
            <div className="container">
                <h3 className="mb-4">Recently Deployed Tokens</h3>
                <div className="row g-4">
                    {tokensWithMints.length > 0 ? (
                        tokensWithMints.map((token, index) => (
                            <div key={index} className="col-md-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title text-center mb-4">{token.tick}</h5>

                                        <div className="mb-3 p-2 rounded" style={{ backgroundColor: 'var(--color-cardHeader)', border: '1px solid var(--color-border)' }}>
                                            <div className="d-flex justify-content-between">
                                                <span>Max Supply:</span>
                                                <span title={token.max ? (parseInt(token.max)).toLocaleString() : '0'}
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top" className="fw-bold text-truncate" style={{ maxWidth: '60%', textAlign: 'right' }}>
                                                    {token.max ? parseInt(token.max).toLocaleString() : '0'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-3 p-2 rounded" style={{ backgroundColor: 'var(--color-cardHeader)', border: '1px solid var(--color-border)' }}>
                                            <div className="d-flex justify-content-between">
                                                <span>Limit Per Mint:</span>
                                                <span title={token.lim ? (parseInt(token.lim)).toLocaleString() : '0'}
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top" className="fw-bold text-truncate" style={{ maxWidth: '60%', textAlign: 'right' }}>
                                                    {token.lim ? parseInt(token.lim).toLocaleString() : '0'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-3 p-2 rounded" style={{ backgroundColor: 'var(--color-cardHeader)', border: '1px solid var(--color-border)' }}>
                                            <label className="form-label d-flex justify-content-between mb-1">
                                                <span>Progress:</span>
                                                <span className="text-truncate" style={{ maxWidth: '60%', textAlign: 'right' }}>
                                                    {token.progress}%
                                                </span>
                                            </label>
                                            <div className="progress">
                                                <div
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    style={{ width: `${token.progress}%` }}
                                                    aria-valuenow={token.progress}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="mb-3 p-2 rounded" style={{ backgroundColor: 'var(--color-cardHeader)', border: '1px solid var(--color-border)' }}>
                                            <div className="d-flex justify-content-between">
                                                <span>Available:</span>
                                                <span className="fw-bold text-truncate" style={{ maxWidth: '60%', textAlign: 'right' }}>
                                                    {token.mintsLeft ? Math.round(token.mintsLeft).toLocaleString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {token.showMintButton && (
                                            <div className="text-center mt-4">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleMint(token.tick, token.lim)}
                                                    disabled={token.progress >= 100}
                                                    style={{ zIndex: 9999 }}
                                                >
                                                    Mint Now
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <div className="alert alert-info">
                                Loading the tokens available for minting at the moment...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}