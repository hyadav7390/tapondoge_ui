import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faDollarSign,
  faFileSignature,
  faWallet,
  faGears,
  faBars,
  faTimes,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  const navigationItems = [
    {
      id: 'all-tokens',
      name: 'All Tokens',
      icon: faCoins,
      path: '/',
      description: 'Discover and trade Dogecoin tokens'
    },
    {
      id: 'dmt',
      name: 'DMT',
      icon: faDollarSign,
      path: '/dmt',
      description: 'Dogecoin Mining Tokens'
    },
    {
      id: 'inscribe',
      name: 'Inscribe',
      icon: faFileSignature,
      path: '/inscribe',
      description: 'Mint, deploy, and transfer tokens'
    },
    {
      id: 'balance',
      name: 'Balance',
      icon: faWallet,
      path: '/balance',
      description: 'Check wallet balances'
    },
    // {
    //   id: 'minting',
    //   name: "What's Minting",
    //   icon: faGears,
    //   path: '/minting',
    //   description: 'Discover tokens available for minting'
    // }
  ];

  const handleNavigation = (path) => {
    router.push(path);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const isActiveRoute = (path) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <Header onMenuClick={handleMenuClick} />
      </div>
      
      {/* Main Content Area - positioned below fixed header and above fixed footer */}
      <div className="flex flex-1 mt-16 mb-40 lg:mb-20">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static top-16 left-0 z-50 w-64 lg:w-auto h-[calc(100vh-4rem-6rem)] lg:h-full
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
        `}>
          <div className="h-full bg-white shadow-xl border-r border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faCoins} className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Menu</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:flex p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200"
                >
                  <FontAwesomeIcon 
                    icon={sidebarCollapsed ? faChevronRight : faChevronLeft} 
                    className="w-3 h-3" 
                  />
                </button>
                
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-primary-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                      }
                    `}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <FontAwesomeIcon 
                      icon={item.icon} 
                      className={`w-5 h-5 transition-all duration-200 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-600'
                      }`} 
                    />
                    
                    {!sidebarCollapsed && (
                      <div className="ml-3 text-left">
                        <div className="font-medium">{item.name}</div>
                        <div className={`text-xs ${
                          isActive ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
        <Footer />
      </div>
    </div>
  );
}