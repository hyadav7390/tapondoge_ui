import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@/contexts/WalletContext';
import WalletConnect from './WalletConnect';
import { formatAddress } from '@/utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function Header({ onMenuClick }) {
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
        <header className="bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Left Section: Menu Button (Mobile) + Logo */}
                    <div className="flex items-center space-x-3">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
                        </button>
                        
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <img
                                src="/tapondoge.jpg"
                                alt="TAPONDOGE Logo"
                                className="h-8 w-8 rounded-lg"
                            />
                            <span className="text-lg font-bold text-gray-900 hidden sm:block">TAPONDOGE</span>
                        </div>
                    </div>

                    {/* Center Spacer for Desktop */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <div className="text-sm text-gray-500 font-medium">
                            Dogecoin Token Trading Platform
                        </div>
                    </div>

                    {/* Right Section: Wallet Connect Button */}
                    <div className="relative">
                        <button 
                            ref={buttonRef}
                            onClick={toggleWalletModal}
                            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                                isConnected 
                                    ? 'bg-success-100 text-success-700 hover:bg-success-200' 
                                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="hidden sm:inline">
                                {isConnected 
                                    ? (address ? formatAddress(address) : 'Loading...')
                                    : 'Connect Wallet'
                                }
                            </span>
                            <span className="sm:hidden">
                                {isConnected ? 'Wallet' : 'Connect'}
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
            </div>
        </header>
    );
}