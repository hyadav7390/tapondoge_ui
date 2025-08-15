import { useEffect, useState, useCallback, memo, useRef } from 'react';
import { getCurrentBlock, getDayTokens, getDeploymentsLength, getStatsResponse, getDeployments, getDogePrice } from './../utils/service.js';
import { Constants } from '@/utils/constants.js';
import { useLoader } from '@/contexts/LoaderContext.js';
import { useRouter } from 'next/router.js';
import { formatAmericanStyle, formatCurrency } from '@/utils/formatters';

const AllTokens = memo(() => {

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;
    const [currentBlock, setCurrentBlock] = useState(null);
    const [error, setError] = useState(null);
    const [tokens, setTokens] = useState([]);
    const [totalTokens, setTotalTokens] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [rawTokenData, setRawTokenData] = useState([]);
    const [dogecoinPrice, setDogecoinPrice] = useState(0);

    // Flag to prevent duplicate API calls
    const isLoadingRef = useRef(false);

    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();

    // Fetch Dogecoin price
    const fetchDogePrice = useCallback(async () => {
        try {
            const response = await getDogePrice();
            if (response && response.dogecoin && response.dogecoin.usd) {
                setDogecoinPrice(response.dogecoin.usd);
            } else {
                console.error("Invalid Dogecoin price response:", response);
            }
        } catch (error) {
            console.error("Error fetching Dogecoin price:", error);
        }
    }, []);

    // Set up price refresh interval
    useEffect(() => {
        fetchDogePrice(); // Fetch price immediately

        // Refresh price every minute
        // const priceInterval = setInterval(fetchDogePrice, 60000);

        // return () => clearInterval(priceInterval);
    }, [fetchDogePrice]);

    const navigateToToken = useCallback((token) => {
        router.push(`/listings?token=${token.tick}`, undefined, { shallow: true });
    }, [router]);

    // Fetch current block info
    const fetchCurrentBlock = useCallback(async () => {
        try {
            const result = await getCurrentBlock();
            setCurrentBlock(result.result);
        } catch (err) {
            setError(err);
        }
    }, []);

    // Format large numbers
    const formatNumber = (num) => {
        if (num === undefined || num === null || isNaN(num)) return '0.00';
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    // Process and update tokens in state - separate from data fetching
    const processTokensData = useCallback((tokenArr) => {
        if (!tokenArr || tokenArr.length === 0) return;

        const processedTokens = tokenArr.map((token) => {
            if (!token) return null;

            // Calculate market cap - explicitly check for null/undefined, not just falsy values
            let marketCap = '$0.00';

            const hasMax = token.max !== undefined && token.max !== null;
            const hasPrice = token.lastSoldPrice !== undefined && token.lastSoldPrice !== null;
            const hasDogecoinPrice = dogecoinPrice !== undefined && dogecoinPrice !== null;

            const maxValue = token.max || 0;
            const lastPrice = token.lastSoldPrice || 0;
            const dogePriceValue = dogecoinPrice || 0;

            const marketCapInToken = (maxValue / 1e18) * lastPrice;
            const marketCapVal = marketCapInToken * dogePriceValue;

            // Even if calculated value is 0, display formatted value
            marketCap = marketCapVal;

            return {
                ...token,
                marketCap
            };
        });

        setTokens(processedTokens.filter((token) => token !== null));
    }, [dogecoinPrice]);

    // Recalculate market caps when dogecoinPrice changes
    useEffect(() => {
        if (rawTokenData.length > 0) {
            processTokensData(rawTokenData);
        }
    }, [dogecoinPrice, processTokensData, rawTokenData]);

    // Fetch and process all tokens
    const getAllTokens = useCallback(async (page) => {
        // Prevent duplicate API calls
        if (isLoadingRef.current) return;

        try {
            isLoadingRef.current = true;
            showLoader();

            const offset = (page - 1) * rowsPerPage;

            // Fetch deployments for this specific page
            const deploymentsResponse = await getDeployments(offset, rowsPerPage);
            if (!deploymentsResponse || !deploymentsResponse.result) {
                console.error("Invalid deployments response:", deploymentsResponse);
                hideLoader();
                isLoadingRef.current = false;
                return;
            }

            // Get page-specific deployments
            const pageTokens = deploymentsResponse.result;

            // Get total tokens count for pagination
            const lengthResponse = await getDeploymentsLength();
            const total = lengthResponse.result;
            setTotalTokens(total);
            setTotalPages(Math.ceil(total / rowsPerPage));

            // Get daily token data
            const dayTokensResponse = await getDayTokens();
            const dayTokens = dayTokensResponse.response || [];

            // Combine tokens from both sources
            const newTokenArr = pageTokens.filter((item) => !item.dmt).map((item) => item.tick);
            const allTokens = [...new Set([...dayTokens.map((item) => item.tick), ...newTokenArr])];

            // Get stats for these tokens
            const statResponse = await getStatsResponse({ tokenArr: allTokens });
            const stats = statResponse.response || [];

            // Process and combine all token data
            const processedTokens = allTokens.map((item) => {
                const statObj = stats.find((i) => i.tick === item) || {};
                const tokenObj = pageTokens.find((i) => i.tick === item) || {};
                const dayTokenObj = dayTokens.find((i) => i.tick === item) || {};
                return { ...statObj, ...tokenObj, ...dayTokenObj };
            });

            // Store raw token data for market cap recalculation
            setRawTokenData(processedTokens);

            // Process tokens for display
            processTokensData(processedTokens);
            setCurrentPage(page);
            setIsDataLoaded(true);
        } catch (error) {
            console.error("Error fetching tokens:", error);
        } finally {
            hideLoader();
            isLoadingRef.current = false;
        }
    }, [processTokensData, showLoader, hideLoader, rowsPerPage]);

    // Handle page change
    const handlePageChange = useCallback((page) => {
        console.log(`Page change requested to: ${page}`);
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page); // Update the page state first
            getAllTokens(page); // Then fetch data for the new page
        }
    }, [getAllTokens, totalPages]);

    // Initial data loading - only fetch current block
    useEffect(() => {
        fetchCurrentBlock();
    }, [fetchCurrentBlock]);

    // Load initial token data exactly once when component mounts
    useEffect(() => {
        if (!isDataLoaded && !isLoadingRef.current) {
            getAllTokens(1);
        }
    }, [getAllTokens, isDataLoaded]);

    // Handle URL changes for pagination
    useEffect(() => {
        const { page } = router.query;
        if (page && !isLoadingRef.current) {
            const pageNumber = Number(page);
            if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
                getAllTokens(pageNumber);
            }
        }
    }, [router.query, getAllTokens, totalPages, currentPage]);

    // Filter tokens based on search term
    const filteredTokens = tokens.filter((token) =>
        token.tick?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the range of pages to display
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            {/* Block Info */}
            <div className="bg-light py-2 px-3 mb-4 rounded d-flex align-items-center justify-content-between">
                <span className="text-muted">
                    Last Synced Block: <span className="fw-bold">{currentBlock}</span>
                </span>
                <div
                    className="rounded-circle bg-success"
                    style={{
                        width: '8px',
                        height: '8px',
                        animation: 'blink 1s ease-in-out infinite',
                        WebkitAnimation: 'blink 1s ease-in-out infinite',
                        opacity: 1
                    }}
                />
                <style jsx>{`
                    @keyframes blink {
                        0% { opacity: 0; }
                        50% { opacity: 1; }
                        100% { opacity: 0; }
                    }
                `}</style>
            </div>

            {/* Header and Search */}
            <h2>All Tokens</h2>
            <div className="mb-4">
                <input
                    type="search"
                    className="form-control"
                    placeholder="Search tokens..."
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Token Table */}
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Tick</th>
                            <th scope="col">Price</th>
                            <th scope="col">Volume (24h)</th>
                            <th scope="col">Total Volume</th>
                            <th scope="col">Market Cap</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTokens.length > 0 ? (
                            filteredTokens.map((token, index) => (
                                <tr key={index}>
                                    <td>{token.tick}</td>
                                    <td>{token.floor}</td>
                                    <td>{token.dayVolume}</td>
                                    <td>{token.totalVolume}</td>
                                    <td>{formatCurrency(token.marketCap || 0)}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm"
                                            onClick={() => navigateToToken(token)}
                                        >
                                            Trade
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No tokens found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav aria-label="Table pagination">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>

                        {[...Array(endPage - startPage + 1)].map((_, index) => {
                            const pageIndex = startPage + index;
                            return (
                                <li
                                    key={pageIndex}
                                    className={`page-item pagination-overflow ${currentPage === pageIndex ? 'active' : ''}`}
                                >
                                    <button
                                        type="button"
                                        className="page-link"
                                        onClick={() => handlePageChange(pageIndex)}
                                    >
                                        {pageIndex}
                                    </button>
                                </li>
                            );
                        })}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </>
    );
});

AllTokens.displayName = 'AllTokens';

export default AllTokens;
