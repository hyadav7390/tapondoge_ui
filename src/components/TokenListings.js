import React, { useState, useEffect } from 'react';
import { getTokenListings, buyToken } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCoins, faDollarSign } from '@fortawesome/free-solid-svg-icons';

export default function TokenListings({ tokenName }) {
  const [listings, setListings] = useState([]);
  const [noListings, setNoListings] = useState(false);
  
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (tokenName) {
      fetchListings();
    }
  }, [tokenName]);

  const fetchListings = async () => {
    try {
      showLoader();
      
      const listingsData = await getTokenListings(tokenName);
      console.log('Listings data:', listingsData);
      
      if (!listingsData || listingsData.length === 0) {
        setNoListings(true);
        setListings([]);
      } else {
        // Sort listings by price (lowest first)
        const sortedListings = [...listingsData].sort((a, b) => 
          parseFloat(a.price || 0) - parseFloat(b.price || 0)
        );
        
        // Filter out sold listings
        const activeListings = sortedListings.filter(listing => 
          listing.sold === 0 || listing.sold === '0'
        );
        
        console.log('Active listings:', activeListings);
        setListings(activeListings);
        setNoListings(activeListings.length === 0);
      }
      
    } catch (error) {
      console.error('Error fetching listings:', error);
      setNoListings(true);
      setListings([]);
    } finally {
      hideLoader();
    }
  };

  const handleBuy = async (inscriptionId) => {
    try {
      // Check if wallet is connected
      const walletAddress = localStorage.getItem('walletAddress');
      if (!walletAddress) {
        alert('Please connect your wallet first');
        return;
      }

      // Confirm purchase
      if (!confirm('Are you sure you want to buy this token?')) {
        return;
      }

      showLoader();
      
      // Call buyToken function
      await buyToken(inscriptionId);
      
      // Refresh the listings after successful purchase
      alert('Purchase successful!');
      fetchListings();
      
    } catch (error) {
      console.error('Error buying token:', error);
      alert(error.message || 'Failed to buy token');
    } finally {
      hideLoader();
    }
  };

  if (noListings) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{tokenName} Listings</h2>
          <p className="text-gray-600 mt-1">Available tokens for purchase</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
          <div className="text-center">
            <FontAwesomeIcon icon={faCoins} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings available</h3>
            <p className="text-gray-500">Check back later for new listings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{tokenName} Listings</h2>
        <p className="text-gray-600 mt-1">Available tokens for purchase</p>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-200">
            <div className="p-6">
              {/* Token Amount */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <FontAwesomeIcon icon={faCoins} className="w-6 h-6 text-primary-600 mr-2" />
                  <h5 className="text-xl font-bold text-gray-900">
                    {listing.amt || 0} {listing.tick || tokenName}
                  </h5>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Price:</span>
                  <span className="font-semibold text-gray-900">
                    {parseFloat((listing.price || 0) * (listing.amt || 0)).toFixed(2)} DOGE
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Price Per Token:</span>
                  <span className="font-semibold text-gray-900">
                    {parseFloat(listing.price || 0).toFixed(2)} DOGE
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <button 
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                onClick={() => handleBuy(listing.inscriptionId)}
              >
                <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4 mr-2" />
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 