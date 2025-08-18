import React, { useState, useEffect } from 'react';
import { getTokenStats, getTokenHolders, getTokenDeployment, getDogePrice } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { formatAmericanStyle, formatCurrency } from '@/utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faTag, faChartLine, faChartBar, faUsers, faDollarSign } from '@fortawesome/free-solid-svg-icons';

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
      color: "bg-gradient-to-r from-blue-400 to-blue-500",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-300"
    },
    {
      icon: faTag,
      title: "Floor Price",
      value: (
        <div className="flex items-center space-x-1">
          <span>{parseFloat(stats.floor).toFixed(2)}</span>
          <img src="/dogecoin.png" alt="dogecoin" className="w-6 h-6" />
        </div>
      ),
      color: "bg-gradient-to-r from-green-400 to-green-500",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-300"
    },
    {
      icon: faChartLine,
      title: "24h Volume",
      value: (
        <div className="flex items-center space-x-1">
          <span>{formatAmericanStyle(stats.dayVolume)}</span>
          <img src="/dogecoin.png" alt="dogecoin" className="w-6 h-6" />
        </div>
      ),
      color: "bg-gradient-to-r from-purple-400 to-purple-500",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-300"
    },
    {
      icon: faChartBar,
      title: "Total Volume",
      value: (
        <div className="flex items-center space-x-1">
          <span>{formatAmericanStyle(stats.totalVolume)}</span>
          <img src="/dogecoin.png" alt="dogecoin" className="w-6 h-6" />
        </div>
      ),
      color: "bg-gradient-to-r from-orange-400 to-orange-500",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-300"
    },
    {
      icon: faDollarSign,
      title: "Market Cap",
      value: formatCurrency(marketCap),
      color: "bg-gradient-to-r from-indigo-400 to-indigo-500",
      bgColor: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-300"
    },
    {
      icon: faUsers,
      title: "Holders",
      value: formatAmericanStyle(holders, 0),
      color: "bg-gradient-to-r from-pink-400 to-pink-500",
      bgColor: "from-pink-50 to-pink-100",
      borderColor: "border-pink-300"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-teal-800 mb-2">📊 {tokenName} Statistics</h2>
        <p className="text-teal-600 font-medium">Real-time token performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 p-6 hover:shadow-cartoon-2xl transition-all duration-200 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-cartoon shadow-cartoon-soft border-2 border-white ${stat.color}`}>
                <FontAwesomeIcon 
                  icon={stat.icon} 
                  className="w-6 h-6 text-white" 
                />
              </div>
              <div className="text-right">
                <h3 className="text-xl font-black text-teal-800">{stat.value}</h3>
                <p className="text-sm text-teal-600 font-medium">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 