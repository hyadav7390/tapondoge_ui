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
          <h2 className="text-3xl font-black text-teal-800 mb-2">{tokenName} Listings</h2>
          <p className="text-teal-600 font-medium">Available tokens for purchase</p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-12">
          <div className="text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-black text-teal-800 mb-2">No listings available</h3>
            <p className="text-teal-600 font-medium">Check back later for new listings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-teal-800 mb-2">{tokenName} Listings</h2>
        <p className="text-teal-600 font-medium">Available tokens for purchase</p>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing, index) => (
          <div key={index} className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 overflow-hidden hover:shadow-cartoon-2xl transition-all duration-200 hover:scale-105">
            <div className="p-6">
              {/* Token Amount */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full flex items-center justify-center shadow-cartoon-soft border-2 border-gold-600 mr-2">
                    <FontAwesomeIcon icon={faCoins} className="w-4 h-4 text-white" />
                  </div>
                  <h5 className="text-xl font-black text-teal-800">
                    {listing.amt || 0} {listing.tick || tokenName}
                  </h5>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon border-2 border-lime-200">
                  <span className="text-sm text-teal-600 font-medium">Total Price:</span>
                  <span className="font-black text-teal-800">
                    {parseFloat((listing.price || 0) * (listing.amt || 0)).toFixed(2)} DOGE
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-lime-50 to-lime-100 rounded-cartoon border-2 border-lime-200">
                  <span className="text-sm text-teal-600 font-medium">Price Per Token:</span>
                  <span className="font-black text-teal-800">
                    {parseFloat(listing.price || 0).toFixed(2)} DOGE
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <button 
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-200 transform"
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