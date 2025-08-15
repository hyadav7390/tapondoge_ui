import React, { useState, useEffect } from 'react';
import { getTokenListings, buyToken } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';

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
      <div className="container mt-4">
        <h2 className="text-center">{tokenName} Listings</h2>
        <div className="alert alert-info text-center">
          No listings available for this token.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">{tokenName} Listings</h2>
      <div className="row">
        {listings.map((listing, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{listing.amt || 0} {listing.tick || tokenName}</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total:</span>
                  <span>{parseFloat((listing.price || 0) * (listing.amt || 0)).toFixed(2)} <img src="/dogecoin.png" alt="DOGE" style={{ width: '15px', height: '15px', verticalAlign: 'middle' }} /></span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Price Per Token:</span>
                  <span>{parseFloat(listing.price || 0).toFixed(2)} <img src="/dogecoin.png" alt="DOGE" style={{ width: '15px', height: '15px', verticalAlign: 'middle' }} /></span>
                </div>
                <button 
                  className="btn btn-primary w-100" 
                  onClick={() => handleBuy(listing.inscriptionId)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 