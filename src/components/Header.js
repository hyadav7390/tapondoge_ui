import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faWallet } from '@fortawesome/free-solid-svg-icons';
import WalletConnect from './WalletConnect';
import Link from 'next/link';

export default function Header({ onMenuClick }) {
    const { isConnected, address } = useWallet();
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const buttonRef = useRef(null);
    const modalRef = useRef(null);

    // Format address for display
    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    // Toggle wallet modal
    const toggleWalletModal = () => {
        setIsWalletModalOpen(!isWalletModalOpen);
    };

    // Close modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target) && 
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsWalletModalOpen(false);
            }
        }
        
        if (isWalletModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isWalletModalOpen]);

    // Handle wallet connection success
    const handleWalletConnected = () => {
        setIsWalletModalOpen(false);
    };

    return (
        <header className="bg-white/90 backdrop-blur-md shadow-cartoon-medium border-b-2 border-lime-300">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Left Section: Menu Button (Mobile) + Logo */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-3 text-teal-700 hover:text-lime-600 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
                        </button>
                        
                        {/* Logo */}
                        <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-200">
                            <img
                                src="/Borksy_logo.png"
                                alt="BORKSY Logo"
                                className="h-20 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Right Section: Wallet Connect Button */}
                    <div className="relative">
                        <button 
                            ref={buttonRef}
                            onClick={toggleWalletModal}
                            className={`flex items-center space-x-3 px-6 py-3 rounded-cartoon font-bold transition-all duration-200 text-sm shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 transform ${isConnected
                                ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 border-2 border-lime-600'
                                : 'bg-gradient-to-r from-gold-400 to-gold-500 text-white border-2 border-gold-600'
                            }`}
                        >
                            <div className="relative">
                                <FontAwesomeIcon icon={faWallet} className="w-5 h-5" />
                            </div>
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
                                className="absolute right-0 mt-3 w-96 bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-lime-300 overflow-hidden z-50"
                                ref={modalRef}
                            >
                                <WalletConnect onConnected={handleWalletConnected} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}