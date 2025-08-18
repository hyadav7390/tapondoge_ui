import React, { useState, useEffect, useRef } from 'react';
import { getTokenActivity } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { formatAddress } from '@/utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faList, faShoppingCart, faUnlink, faArrowLeft, faArrowRight, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

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
    if (sold === 0 || sold === '0') return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-2 border-blue-300';
    if (sold === 1 || sold === '1') return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300';
    if (sold === 2 || sold === '2') return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-2 border-yellow-300';
    return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-2 border-gray-300';
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
        <h2 className="text-3xl font-black text-teal-800 flex items-center justify-center mb-2">
          <FontAwesomeIcon icon={faHistory} className="w-6 h-6 mr-3 text-lime-600" />
          Activity Log
        </h2>
        <p className="text-teal-600 font-medium">Recent trading activity for {tokenName}</p>
      </div>

      {/* Activity Table */}
      <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-lime-100 to-lime-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-black text-teal-800 uppercase tracking-wider border-b-2 border-lime-300">Token</th>
                <th className="px-6 py-4 text-left text-sm font-black text-teal-800 uppercase tracking-wider border-b-2 border-lime-300">Action</th>
                <th className="px-6 py-4 text-left text-sm font-black text-teal-800 uppercase tracking-wider border-b-2 border-lime-300">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-black text-teal-800 uppercase tracking-wider border-b-2 border-lime-300">Price (DOGE)</th>
                <th className="px-6 py-4 text-left text-sm font-black text-teal-800 uppercase tracking-wider border-b-2 border-lime-300">Seller</th>
                <th className="px-6 py-4 text-left text-sm font-black text-teal-800 uppercase tracking-wider border-b-2 border-lime-300">Buyer</th>
                <th className="px-6 py-4 text-left text-sm font-black text-teal-800 uppercase tracking-wider border-b-2 border-lime-300">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-2 divide-lime-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
                      <span className="ml-2 text-teal-600 font-bold">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-teal-600">
                      <div className="text-4xl mb-4">📊</div>
                      <p className="text-lg font-bold">No activity found</p>
                      <p className="text-sm">No recent trading activity for this token</p>
                    </div>
                  </td>
                </tr>
              ) : (
                activities.map((activity, index) => (
                  <tr key={index} className="hover:bg-lime-50 transition-all duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full flex items-center justify-center shadow-cartoon-soft border-2 border-gold-600">
                          <FontAwesomeIcon icon={faList} className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-teal-800">{activity.tick || tokenName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-cartoon text-xs font-bold ${getActionClass(activity.sold)}`}>
                        {getActionLabel(activity.sold)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-teal-800">{activity.amt || 0}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-teal-800">{parseFloat(activity.price || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`https://sochain.com/address/DOGE/${activity.sellerAddress}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title={activity.sellerAddress}
                        className="text-sm text-lime-600 hover:text-teal-800 transition-all duration-200 font-bold flex items-center group/link"
                      >
                        {formatAddress(activity.sellerAddress)}
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3 ml-1 opacity-0 group-hover/link:opacity-100 transition-all duration-200" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.buyerAddress ? (
                        <a 
                          href={`https://sochain.com/address/DOGE/${activity.buyerAddress}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title={activity.buyerAddress}
                          className="text-sm text-lime-600 hover:text-teal-800 transition-all duration-200 font-bold flex items-center group/link"
                        >
                          {formatAddress(activity.buyerAddress)}
                          <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3 ml-1 opacity-0 group-hover/link:opacity-100 transition-all duration-200" />
                        </a>
                      ) : (
                        <span className="text-sm text-teal-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-teal-800">{formatDate(activity.created)}</span>
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
            className={`px-4 py-2 rounded-cartoon text-sm font-bold transition-all duration-200 ${
              currentPage === 1
                ? 'text-teal-400 cursor-not-allowed'
                : 'text-teal-700 hover:text-lime-600 hover:bg-lime-100 border-2 border-transparent hover:border-lime-300'
            }`}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 mr-1" />
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-cartoon text-sm font-bold transition-all duration-200 ${
                currentPage === index + 1
                  ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 shadow-cartoon border-2 border-lime-600'
                  : 'text-teal-700 hover:text-lime-600 hover:bg-lime-100 border-2 border-transparent hover:border-lime-300'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-cartoon text-sm font-bold transition-all duration-200 ${
              currentPage === totalPages
                ? 'text-teal-400 cursor-not-allowed'
                : 'text-teal-700 hover:text-lime-600 hover:bg-lime-100 border-2 border-transparent hover:border-lime-300'
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