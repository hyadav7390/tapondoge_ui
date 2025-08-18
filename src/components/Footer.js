import React, { useState, useEffect } from 'react';

export default function Footer() {
    const [isVisible, setIsVisible] = useState(true);
    const [inactivityTimer, setInactivityTimer] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    // Inactivity timeout in milliseconds (5 seconds)
    const INACTIVITY_TIMEOUT = 5000;

    // Reset inactivity timer
    const resetInactivityTimer = () => {
        // Don't hide if mouse is hovering over footer
        if (isHovered) return;
        
        setIsVisible(true);
        
        // Clear existing timer
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        
        // Set new timer
        const timer = setTimeout(() => {
            // Only hide if not being hovered
            if (!isHovered) {
                setIsVisible(false);
            }
        }, INACTIVITY_TIMEOUT);
        
        setInactivityTimer(timer);
    };

    // Handle user activity
    const handleUserActivity = () => {
        resetInactivityTimer();
    };

    // Handle mouse enter (hover start)
    const handleMouseEnter = () => {
        setIsHovered(true);
        setIsVisible(true);
        
        // Clear timer when hovering
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            setInactivityTimer(null);
        }
    };

    // Handle mouse leave (hover end)
    const handleMouseLeave = () => {
        setIsHovered(false);
        // Start timer again when mouse leaves
        resetInactivityTimer();
    };

    // Set up activity listeners
    useEffect(() => {
        // Start initial timer
        resetInactivityTimer();

        // Add event listeners for user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        events.forEach(event => {
            document.addEventListener(event, handleUserActivity, { passive: true });
        });

        // Cleanup function
        return () => {
            // Clear timer
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
            }
            
            // Remove event listeners
            events.forEach(event => {
                document.removeEventListener(event, handleUserActivity);
            });
        };
    }, []);

    return (
        <footer 
            className={`bg-white/90 backdrop-blur-md border-t-2 border-lime-300 py-4 shadow-cartoon-medium transition-all duration-500 ease-in-out ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center space-y-4">
                    {/* Powered by Benny Protocol - Centered */}
                    <div className="flex flex-col items-center space-y-1 bg-gradient-to-r from-lime-100 to-lime-200 px-6 py-3 rounded-cartoon border-2 border-lime-400 shadow-cartoon-soft relative">
                        {/* Decorative stars */}
                        <div className="cartoon-star" style={{ top: '-6px', left: '-6px', width: '12px', height: '12px', animationDelay: '0s' }}></div>
                        <div className="cartoon-star" style={{ bottom: '-6px', right: '-6px', width: '12px', height: '12px', animationDelay: '1s' }}></div>
                        
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-teal-700 font-bold">Powered by</span>
                            <a 
                                href="https://api.tapondoge.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-lg font-black text-gradient-gold hover:scale-110 transition-transform duration-200"
                            >
                                Benny Protocol
                            </a>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-6">
                        <a 
                            href="https://discord.com/invite/CHbTua4UZj" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-teal-700 hover:text-lime-600 transition-all duration-200 group hover:scale-110"
                        >
                            <div className="relative">
                                <img src="/discord.png" alt="Discord" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                <div className="cartoon-star" style={{ top: '-2px', right: '-2px', width: '6px', height: '6px', animationDelay: '0.5s' }}></div>
                            </div>
                            <span className="text-xs font-bold hidden sm:inline">Discord</span>
                        </a>
                        <a 
                            href="https://x.com/tapondogehq" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-teal-700 hover:text-lime-600 transition-all duration-200 group hover:scale-110"
                        >
                            <div className="relative">
                                <img src="/x.png" alt="Twitter" className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                <div className="cartoon-star" style={{ top: '-2px', right: '-2px', width: '6px', height: '6px', animationDelay: '1s' }}></div>
                            </div>
                            <span className="text-xs font-bold hidden sm:inline">Twitter</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}