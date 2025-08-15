import React, { useState, useEffect, useRef } from 'react';
import { getTokenActivity } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { formatAddress } from '@/utils/formatters';

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
    if (sold === 0 || sold === '0') return 'bg-info';
    if (sold === 1 || sold === '1') return 'bg-success';
    if (sold === 2 || sold === '2') return 'bg-warning';
    return 'bg-secondary';
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
    <div className="container mt-5">
      <h2 className="text-center">Activity Log</h2>
      <div className="table-responsive mt-4">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Token</th>
              <th>Action</th>
              <th>Amount</th>
              <th>Price (DOGE)</th>
              <th>Seller</th>
              <th>Buyer</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">Loading...</td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No activity found</td>
              </tr>
            ) : (
              activities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.tick || tokenName}</td>
                  <td>
                    <span className={`badge ${getActionClass(activity.sold)} text-white`}>
                      {getActionLabel(activity.sold)}
                    </span>
                  </td>
                  <td>{activity.amt || 0}</td>
                  <td>{parseFloat(activity.price || 0).toFixed(2)}</td>
                  <td>
                    <a 
                      href={`https://sochain.com/address/DOGE/${activity.sellerAddress}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title={activity.sellerAddress}
                    >
                      {formatAddress(activity.sellerAddress)}
                    </a>
                  </td>
                  <td>
                    {activity.buyerAddress ? (
                      <a 
                        href={`https://sochain.com/address/DOGE/${activity.buyerAddress}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title={activity.buyerAddress}
                      >
                        {formatAddress(activity.buyerAddress)}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{formatDate(activity.created)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Activity pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
} 