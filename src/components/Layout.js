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
    {
      id: 'minting',
      name: "What's Minting",
      icon: faGears,
      path: '/minting',
      description: 'Discover tokens available for minting'
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
        `}>
          <div className="h-full bg-white shadow-xl border-r border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faCoins} className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">TapOnDoge</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:flex p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                >
                  <FontAwesomeIcon 
                    icon={sidebarCollapsed ? faChevronRight : faChevronLeft} 
                    className="w-4 h-4" 
                  />
                </button>
                
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2">
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

            {/* Sidebar Footer */}
            {!sidebarCollapsed && (
              <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  © 2024 TapOnDoge
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Menu Button */}
          <div className="lg:hidden p-4 border-b border-gray-200 bg-white">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
            </button>
          </div>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}