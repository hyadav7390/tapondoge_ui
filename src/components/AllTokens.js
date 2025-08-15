import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { useLoader } from '@/contexts/LoaderContext';
import { toast } from 'react-hot-toast';
import { formatNumber, formatCurrency, formatAddress } from '@/utils/formatters';
import { 
    getDeployments, 
    getDeploymentsLength, 
    getDayTokens, 
    getStatsResponse, 
    getDogePrice,
    getCurrentBlock
} from '@/utils/service';

export default function AllTokens() {
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();
    const isLoadingRef = useRef(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    
    // State for tokens and pagination
    const [tokens, setTokens] = useState([]);
    const [rawTokenData, setRawTokenData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTokens, setTotalTokens] = useState(0);
    const [rowsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [lastSyncedBlock, setLastSyncedBlock] = useState('');

    // Fetch current block
    const fetchCurrentBlock = useCallback(async () => {
        try {
            const response = await getCurrentBlock();
            setLastSyncedBlock(response.result || 'N/A');
        } catch (error) {
            console.error('Error fetching current block:', error);
            setLastSyncedBlock('Error');
        }
    }, []);

    // Process tokens data
    const processTokensData = useCallback((tokenArr) => {
        if (!Array.isArray(tokenArr)) {
            console.error('processTokensData: tokenArr is not an array', tokenArr);
            return;
        }

        const processedTokens = tokenArr.map((token) => {
            if (!token || !token.tick) return null;

            return {
                tick: token.tick,
                floor: token.floor || '0',
                dayVolume: token.dayVolume || '0',
                totalVolume: token.totalVolume || '0',
                marketCap: token.marketCap || '0',
                holders: token.holders || '0',
                supply: token.supply || '0',
                isOfficial: token.tick === 'tap'
            };
        }).filter(Boolean);

        setTokens(processedTokens);
    }, []);

    // Get all tokens with pagination
    const getAllTokens = useCallback(async (page = 1) => {
        if (isLoadingRef.current) return;
        
        isLoadingRef.current = true;
        showLoader();
        setError(null);

        try {
            const offset = page === 1 ? 0 : (page - 1) * rowsPerPage;
            
            // Get page-specific deployments
            const deploymentsResponse = await getDeployments(offset, rowsPerPage);
            if (!deploymentsResponse || !deploymentsResponse.result) {
                throw new Error('Invalid deployments response');
            }

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
            setError(error.message || 'Failed to fetch tokens');
            toast.error('Failed to fetch tokens. Please try again later.');
        } finally {
            hideLoader();
            isLoadingRef.current = false;
        }
    }, [processTokensData, showLoader, hideLoader, rowsPerPage]);

    // Handle page change
    const handlePageChange = useCallback((page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            getAllTokens(page);
        }
    }, [getAllTokens, totalPages, currentPage]);

    // Initial data loading - only fetch current block
    useEffect(() => {
        fetchCurrentBlock();
    }, [fetchCurrentBlock]);

    // Load initial token data exactly once when component mounts
    useEffect(() => {
        if (!isDataLoaded && !isLoadingRef.current) {
            getAllTokens(1);
        }
    }, []); // Empty dependency array to run only once

    // Handle URL changes for pagination
    useEffect(() => {
        const { page } = router.query;
        if (page && !isLoadingRef.current && isDataLoaded) {
            const pageNumber = Number(page);
            if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
                getAllTokens(pageNumber);
            }
        }
    }, [router.query, totalPages, currentPage, isDataLoaded]);

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
            <div className="alert alert-danger">
                <i className="fas fa-exclamation-circle me-2"></i>
                Error: {error}
            </div>
        );
    }

    return (
        <>
            {/* Last Synced Block */}
            <div className="bg-light py-2 px-3 mb-4 rounded d-flex align-items-center justify-content-between">
                <span className="text-muted">
                    Last Synced Block: <span className="fw-bold">{lastSyncedBlock}</span>
                </span>
                <div 
                    style={{
                        width: '8px',
                        height: '8px',
                        animation: 'blink 1s ease-in-out infinite',
                        opacity: 1
                    }} 
                    className="rounded-circle bg-success"
                ></div>
            </div>

            <h2>All Tokens</h2>

            {/* Search */}
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

            {/* Tokens Table */}
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
                                <tr key={`${token.tick}-${index}`} style={{ cursor: 'pointer' }}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            {token.tick}
                                            {token.isOfficial && (
                                                <img 
                                                    src="/verify.png" 
                                                    alt="verified" 
                                                    className="ms-1" 
                                                    width="20" 
                                                    title="Official Token"
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td>{token.floor || '0'}</td>
                                    <td>{token.dayVolume || '0'}</td>
                                    <td>{token.totalVolume || '0'}</td>
                                    <td>{token.marketCap || '0'}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-primary"
                                            onClick={() => router.push(`/trade?tick=${encodeURIComponent(token.tick)}`)}
                                        >
                                            Trade
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    <div className="alert alert-info mb-0">
                                        <i className="fas fa-info-circle me-2"></i>
                                        {searchTerm ? 'No tokens found matching your search' : 'No tokens found'}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav aria-label="Token pagination">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                                className="page-link" 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>
                        
                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                            <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
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

            {/* Results info */}
            {totalTokens > 0 && (
                <div className="text-center text-muted mt-3">
                    Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, totalTokens)} of {totalTokens} tokens
                </div>
            )}
        </>
    );
}
