import React, { useState, useEffect } from 'react';
import { getTokenStats, getTokenHolders, getTokenDeployment, getDogePrice } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { formatAmericanStyle, formatCurrency } from '@/utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faTag, faChartLine, faDollarSign, faUsers } from '@fortawesome/free-solid-svg-icons';

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

  const statCards = [
    {
      icon: faList,
      title: "Listed Items",
      value: formatNumber(stats.total),
      color: "bg-blue-500"
    },
    {
      icon: faTag,
      title: "Floor Price",
      value: `${parseFloat(stats.floor).toFixed(2)} DOGE`,
      color: "bg-green-500"
    },
    {
      icon: faChartLine,
      title: "24h Volume",
      value: `${formatAmericanStyle(stats.dayVolume)} DOGE`,
      color: "bg-purple-500"
    },
    {
      icon: faDollarSign,
      title: "Total Volume",
      value: `${formatAmericanStyle(stats.totalVolume)} DOGE`,
      color: "bg-orange-500"
    },
    {
      icon: faDollarSign,
      title: "Market Cap",
      value: formatCurrency(marketCap),
      color: "bg-indigo-500"
    },
    {
      icon: faUsers,
      title: "Holders",
      value: formatAmericanStyle(holders, 0),
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{tokenName} Statistics</h2>
        <p className="text-gray-600 mt-1">Real-time token performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <FontAwesomeIcon 
                  icon={stat.icon} 
                  className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} 
                />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 