import React, { useState, useEffect, useRef } from 'react';
import { getTokenActivity } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { formatAddress } from '@/utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faList, faShoppingCart, faUnlink, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function ActivityLog({ tokenName }) {
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (tokenName) {
      fetchActivities();
    }
  }, [tokenName, currentPage]);

  const fetchActivities = async () => {
    try {
      showLoader();
      setLoading(true);
      
      const result = await getTokenActivity(tokenName, currentPage, itemsPerPage);
      console.log('Activity data:', result);
      
      if (result && result.response) {
        setActivities(result.response);
        setTotalPages(Math.ceil(result.total / itemsPerPage) || 1);
      } else {
        setActivities([]);
        setTotalPages(1);
      }
      
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  const getActionLabel = (sold) => {
    if (sold === 0 || sold === '0') return 'List';
    if (sold === 1 || sold === '1') return 'Sell';
    if (sold === 2 || sold === '2') return 'Unlist';
    return 'Unknown';
  };

  const getActionClass = (sold) => {
    if (sold === 0 || sold === '0') return 'bg-info-100 text-info-800';
    if (sold === 1 || sold === '1') return 'bg-success-100 text-success-800';
    if (sold === 2 || sold === '2') return 'bg-warning-100 text-warning-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
          <FontAwesomeIcon icon={faHistory} className="w-6 h-6 mr-2 text-primary-600" />
          Activity Log
        </h2>
        <p className="text-gray-600 mt-1">Recent trading activity for {tokenName}</p>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (DOGE)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FontAwesomeIcon icon={faHistory} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No activity found</p>
                      <p className="text-sm">No recent trading activity for this token</p>
                    </div>
                  </td>
                </tr>
              ) : (
                activities.map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{activity.tick || tokenName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionClass(activity.sold)}`}>
                        {getActionLabel(activity.sold)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{activity.amt || 0}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{parseFloat(activity.price || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`https://sochain.com/address/DOGE/${activity.sellerAddress}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title={activity.sellerAddress}
                        className="text-sm text-primary-600 hover:text-primary-800 transition-colors duration-200"
                      >
                        {formatAddress(activity.sellerAddress)}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.buyerAddress ? (
                        <a 
                          href={`https://sochain.com/address/DOGE/${activity.buyerAddress}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title={activity.buyerAddress}
                          className="text-sm text-primary-600 hover:text-primary-800 transition-colors duration-200"
                        >
                          {formatAddress(activity.buyerAddress)}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{formatDate(activity.created)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
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

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === index + 1
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
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
} 