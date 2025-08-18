import { useEffect, useState, useCallback, memo, useRef } from 'react';
import { getCurrentBlock, getDayTokens, getDeploymentsLength, getStatsResponse, getDeployments, getDogePrice } from './../utils/service.js';
import { Constants } from '@/utils/constants.js';
import { useLoader } from '@/contexts/LoaderContext.js';
import { useRouter } from 'next/router.js';
import { formatAmericanStyle, formatCurrency } from '@/utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faArrowRight, faPlay } from '@fortawesome/free-solid-svg-icons';

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
        return (
            <div className="text-center py-8">
                <div className="text-red-600 text-lg font-medium">Error: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Block Info */}
            {/* <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="text-gray-600">
                        Last Synced Block: <span className="font-bold text-gray-900">{currentBlock}</span>
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-success-600 font-medium">Live</span>
                </div>
            </div> */}

            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Tokens</h2>
                    <p className="text-gray-600 mt-1">Discover and trade Dogecoin tokens</p>
                </div>
                <div className="relative">
                    <FontAwesomeIcon 
                        icon={faSearch} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
                    />
                    <input
                        type="search"
                        className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Search tokens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Token Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tick</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume (24h)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Volume</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTokens.length > 0 ? (
                                filteredTokens.map((token, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{token.tick}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{token.floor}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{token.dayVolume}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{token.totalVolume}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{formatCurrency(token.marketCap || 0)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => navigateToToken(token)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                                            >
                                                <FontAwesomeIcon icon={faPlay} className="w-3 h-3 mr-1" />
                                                Trade
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <p className="text-lg font-medium">No tokens found</p>
                                            <p className="text-sm">Try adjusting your search criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 mr-1" />
                        Previous
                    </button>

                    {[...Array(endPage - startPage + 1)].map((_, index) => {
                        const pageIndex = startPage + index;
                        return (
                            <button
                                key={pageIndex}
                                onClick={() => handlePageChange(pageIndex)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    currentPage === pageIndex
                                        ? 'bg-primary-600 text-white'
                                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                                }`}
                            >
                                {pageIndex}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                    >
                        Next
                        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 ml-1" />
                    </button>
                </div>
            )}
        </div>
    );
});

AllTokens.displayName = 'AllTokens';

export default AllTokens;
