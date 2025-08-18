import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-white/90 backdrop-blur-md border-t-2 border-lime-300 py-3 shadow-cartoon-medium">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center">
                    {/* Powered by Benny Protocol - Centered */}
                    <div className="flex flex-col items-center bg-gradient-to-r from-lime-100 to-lime-200 px-6 py-2 rounded-cartoon border-2 border-lime-400 shadow-cartoon-soft relative">
                        {/* Decorative stars */}
                        <div className="cartoon-star" style={{ top: '-6px', left: '-6px', width: '12px', height: '12px', animationDelay: '0s' }}></div>
                        <div className="cartoon-star" style={{ bottom: '-6px', right: '-6px', width: '12px', height: '12px', animationDelay: '1s' }}></div>
                        
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-teal-700 font-bold">Powered by</span>
                            <a 
                                href="https://tap.tapondoge.com/docs/static/index.html" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-lg font-black text-gradient-gold hover:scale-110 transition-transform duration-200"
                            >
                                Benny Protocol
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}