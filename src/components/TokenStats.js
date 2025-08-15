import React, { useState, useEffect } from 'react';
import { getTokenStats, getTokenHolders, getTokenDeployment, getDogePrice } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { formatAmericanStyle, formatCurrency } from '@/utils/formatters';

export default function TokenStats({ tokenName }) {
  const [stats, setStats] = useState({
    total: 0,
    floor: 0,
    dayVolume: 0,
    totalVolume: 0,
    lastSoldPrice: 0
  });
  const [holders, setHolders] = useState(0);
  const [marketCap, setMarketCap] = useState(0);
  
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (tokenName) {
      fetchTokenStats();
    }
  }, [tokenName]);

  const fetchTokenStats = async () => {
    try {
      showLoader();
      
      // Fetch token stats
      const statsData = await getTokenStats(tokenName);
      console.log('Stats data:', statsData);
      
      // Check if statsData exists and has the expected structure
      if (statsData) {
        setStats({
          total: statsData.total || 0,
          floor: statsData.floor || 0,
          dayVolume: statsData.dayVolume || 0,
          totalVolume: statsData.totalVolume || 0,
          lastSoldPrice: statsData.lastSoldPrice || 0
        });
      }
      
      // Fetch holders count
      const holdersCount = await getTokenHolders(tokenName);
      console.log('Holders count:', holdersCount);
      setHolders(holdersCount || 0);
      
      // Calculate market cap
      const deploymentData = await getTokenDeployment(tokenName);
      console.log('Deployment data:', deploymentData);
      
      if (deploymentData && deploymentData.max) {
        const dogecoinPrice = await getDogePrice();
        console.log('Dogecoin price:', dogecoinPrice.dogecoin.usd);
        
        const lastPrice = statsData.lastSoldPrice || 0;
        const marketCapInToken = ((parseFloat(deploymentData.max) || 0)/1e18) * lastPrice;
        const marketCapInUsd = (marketCapInToken * (dogecoinPrice.dogecoin.usd || 0)) || 0;
        setMarketCap(marketCapInUsd);
      }
      
    } catch (error) {
      console.error('Error fetching token stats:', error);
    } finally {
      hideLoader();
    }
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
  };

  return (
    <div className="cards-container">
      <div className="row my-4">
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Listed Items</h5>
              <p className="card-text">{formatNumber(stats.total)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Floor Price</h5>
              <p className="card-text">{parseFloat(stats.floor).toFixed(2)}<img src="/dogecoin.png" alt="DOGE" style={{ width: '25px', height: '25px', verticalAlign: 'middle', marginLeft: '5px' }} /></p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">24h Volume</h5>
              <p className="card-text">{formatAmericanStyle(stats.dayVolume)}<img src="/dogecoin.png" alt="DOGE" style={{ width: '25px', height: '25px', verticalAlign: 'middle', marginLeft: '5px' }} /></p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Volume</h5>
              <p className="card-text">{formatAmericanStyle(stats.totalVolume)}<img src="/dogecoin.png" alt="DOGE" style={{ width: '25px', height: '25px', verticalAlign: 'middle', marginLeft: '5px' }} /></p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Market Cap</h5>
              <p className="card-text">{formatCurrency(marketCap)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Holders</h5>
              <p className="card-text">{formatAmericanStyle(holders, 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 