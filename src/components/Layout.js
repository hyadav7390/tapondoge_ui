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
            description: 'Digital Matter Theory',
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
                    <div className="h-full bg-white/95 backdrop-blur-md shadow-cartoon-xl border-2 border-lime-300 flex flex-col rounded-r-cartoon relative">
                        {/* Desktop Collapse Toggle - Absolute Position */}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 bg-white border-2 border-lime-300 rounded-full shadow-cartoon items-center justify-center text-teal-600 hover:text-lime-600 hover:bg-lime-100 transition-all duration-200 hover:scale-110 z-10"
                            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <FontAwesomeIcon 
                                icon={sidebarCollapsed ? faChevronRight : faChevronLeft} 
                                className="w-3 h-3" 
                            />
                        </button>

                        {/* Mobile Toggle - Same Design as Desktop */}
                        {sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden absolute -right-3 top-6 w-6 h-6 bg-white border-2 border-lime-300 rounded-full shadow-cartoon items-center justify-center text-teal-600 hover:text-lime-600 hover:bg-lime-100 transition-all duration-200 hover:scale-110 z-10"
                                title="Close sidebar"
                            >
                                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                            </button>
                        )}

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
                                <div className="space-y-4">
                                    {/* Rocket Message */}
                                    <div className="text-center">
                                        <div className="text-xs text-teal-600 font-bold mb-2">🚀 To The Moon! 🌙</div>
                                    </div>
                                    
                                    {/* Social Links */}
                                    <div className="flex items-center justify-center space-x-4">
                                        <a 
                                            href="https://discord.com/invite/CHbTua4UZj" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 text-teal-700 hover:text-lime-600 transition-all duration-200 group hover:scale-110"
                                        >
                                            <div className="relative">
                                                <img src="/discord.png" alt="Discord" className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                                <div className="cartoon-star" style={{ top: '-2px', right: '-2px', width: '4px', height: '4px', animationDelay: '0.5s' }}></div>
                                            </div>
                                            <span className="text-xs font-bold">Discord</span>
                                        </a>
                                        <a 
                                            href="https://x.com/tapondogehq" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 text-teal-700 hover:text-lime-600 transition-all duration-200 group hover:scale-110"
                                        >
                                            <div className="relative">
                                                <img src="/x.png" alt="Twitter" className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                                                <div className="cartoon-star" style={{ top: '-2px', right: '-2px', width: '4px', height: '4px', animationDelay: '1s' }}></div>
                                            </div>
                                            <span className="text-xs font-bold">Twitter</span>
                                        </a>
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