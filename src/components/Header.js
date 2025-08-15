import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@/contexts/WalletContext';
import WalletConnect from './WalletConnect';
import { formatAddress } from '@/utils/formatters';

export default function Header() {
    const router = useRouter();
    const { isConnected, address } = useWallet();
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const modalRef = useRef(null);
    const buttonRef = useRef(null);

    // Close modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target) && 
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsWalletModalOpen(false);
            }
        }

        // Add event listener when modal is open
        if (isWalletModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isWalletModalOpen]);

    // Close modal when route changes
    useEffect(() => {
        setIsWalletModalOpen(false);
    }, [router.pathname]);

    const toggleWalletModal = () => {
        setIsWalletModalOpen(!isWalletModalOpen);
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <img
                            src="/tapondoge.jpg"
                            alt="TAPONDOGE Logo"
                            className="h-10 w-auto rounded-lg"
                        />
                        <span className="text-xl font-bold text-gray-900">TAPONDOGE</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a 
                            href="https://discord.com/invite/CHbTua4UZj" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                        >
                            <img
                                src="/discord.png"
                                alt="Discord"
                                className="w-6 h-6"
                            />
                            <span className="text-sm font-medium">Discord</span>
                        </a>
                        <a 
                            href="https://x.com/tapondogehq" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                        >
                            <img
                                src="/x.png"
                                alt="Twitter"
                                className="w-5 h-5"
                            />
                            <span className="text-sm font-medium">Twitter</span>
                        </a>
                    </div>

                    {/* Wallet Connect Button */}
                    <div className="relative">
                        <button 
                            ref={buttonRef}
                            onClick={toggleWalletModal}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                isConnected 
                                    ? 'bg-success-100 text-success-700 hover:bg-success-200' 
                                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>
                                {isConnected 
                                    ? (address ? formatAddress(address) : 'Loading...')
                                    : 'Connect Wallet'
                                }
                            </span>
                        </button>
                        
                        {/* Wallet Modal Dropdown */}
                        {isWalletModalOpen && (
                            <div 
                                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                                ref={modalRef}
                            >
                                <div className="p-4">
                                    <WalletConnect onConnected={() => setIsWalletModalOpen(false)} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}