import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCoins, 
    faChevronLeft, 
    faChevronRight, 
    faTimes,
    faHome,
    faChartLine,
    faPen,
    faWallet,
    faRocket
} from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const router = useRouter();

    // Navigation items with cartoon theme
    const navigationItems = [
        {
            id: 'all-tokens',
            name: 'All Tokens',
            description: 'Discover & Trade',
            path: '/',
            icon: faHome
        },
        {
            id: 'dmt',
            name: 'DMT',
            description: 'Doge Mining Token',
            path: '/dmt',
            icon: faChartLine
        },
        {
            id: 'inscribe',
            name: 'Inscribe',
            description: 'Create Tokens',
            path: '/inscribe',
            icon: faPen
        },
        {
            id: 'balance',
            name: 'Balance',
            description: 'Check Wallet',
            path: '/balance',
            icon: faWallet
        }
    ];

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [router.pathname]);

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
        <div className="min-h-screen flex flex-col">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header onMenuClick={handleMenuClick} />
            </div>
            
            {/* Main Content Area - positioned below fixed header and above fixed footer */}
            <div className="flex flex-1 mt-20 mb-40 lg:mb-20">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={`
                    fixed lg:static top-20 left-0 z-50 w-64 lg:w-auto h-[calc(100vh-5rem-10rem)] lg:h-full
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
                `}>
                    <div className="h-full bg-white/95 backdrop-blur-md shadow-cartoon-xl border-2 border-lime-300 flex flex-col rounded-r-cartoon">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between p-4 border-b-2 border-lime-200 bg-gradient-to-r from-lime-50 to-lime-100">
                            {!sidebarCollapsed && (
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-cartoon flex items-center justify-center shadow-cartoon-soft">
                                        <FontAwesomeIcon icon={faCoins} className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-lg font-bold text-teal-800">Menu</span>
                                </div>
                            )}
                            
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                    className="hidden lg:flex p-2 text-teal-600 hover:text-lime-600 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105"
                                >
                                    <FontAwesomeIcon 
                                        icon={sidebarCollapsed ? faChevronRight : faChevronLeft} 
                                        className="w-4 h-4" 
                                    />
                                </button>
                                
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="lg:hidden p-2 text-teal-600 hover:text-lime-600 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
                            {navigationItems.map((item) => {
                                const isActive = isActiveRoute(item.path);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`
                                            w-full flex items-center px-4 py-4 rounded-cartoon transition-all duration-200 group relative
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 shadow-cartoon border-2 border-lime-600' 
                                                : 'text-teal-700 hover:text-lime-600 hover:bg-lime-100 border-2 border-transparent hover:border-lime-300'
                                            }
                                        `}
                                        title={sidebarCollapsed ? item.name : undefined}
                                    >
                                        {/* Decorative elements for active items */}
                                        {isActive && (
                                            <>
                                                <div className="cartoon-star absolute -top-2 -right-2" style={{ width: '12px', height: '12px' }}></div>
                                                <div className="cartoon-star absolute -bottom-2 -left-2" style={{ width: '12px', height: '12px', animationDelay: '0.5s' }}></div>
                                            </>
                                        )}
                                        
                                        <div className={`
                                            w-8 h-8 rounded-cartoon flex items-center justify-center transition-all duration-200
                                            ${isActive 
                                                ? 'bg-teal-800 text-white shadow-cartoon-soft' 
                                                : 'bg-lime-100 text-teal-600 group-hover:bg-lime-200'
                                            }
                                        `}>
                                            <FontAwesomeIcon 
                                                icon={item.icon} 
                                                className="w-4 h-4" 
                                            />
                                        </div>
                                        
                                        {!sidebarCollapsed && (
                                            <div className="ml-4 text-left">
                                                <div className="font-bold text-sm">{item.name}</div>
                                                <div className={`text-xs font-medium ${
                                                    isActive ? 'text-teal-800' : 'text-teal-500'
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
                            <div className="p-4 border-t-2 border-lime-200 bg-gradient-to-r from-lime-50 to-lime-100">
                                <div className="text-center">
                                    <div className="text-xs text-teal-600 font-bold mb-2">🚀 To The Moon! 🌙</div>
                                    <div className="flex justify-center space-x-2">
                                        <div className="cartoon-coin" style={{ fontSize: '10px' }}>D</div>
                                        <div className="cartoon-coin" style={{ fontSize: '10px', animationDelay: '0.5s' }}>D</div>
                                        <div className="cartoon-coin" style={{ fontSize: '10px', animationDelay: '1s' }}>D</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
            
            {/* Fixed Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <Footer />
            </div>
        </div>
    );
}