import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faWallet } from '@fortawesome/free-solid-svg-icons';
import WalletConnect from './WalletConnect';

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
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <img
                                    src="/tapondoge.jpg"
                                    alt="TAPONDOGE Logo"
                                    className="h-12 w-12 rounded-cartoon shadow-cartoon border-2 border-lime-400 hover:scale-110 transition-transform duration-200"
                                />
                                {/* Decorative stars around logo */}
                                <div className="cartoon-star" style={{ top: '-5px', right: '-5px', animationDelay: '0s' }}></div>
                                <div className="cartoon-star" style={{ bottom: '-5px', left: '-5px', animationDelay: '0.5s' }}></div>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-2xl font-black text-gradient text-display">BORKSY</span>
                                <div className="text-xs text-teal-600 font-medium flex items-center">
                                    <img src="/tap_symbol.png" alt="TAPONDOGE SYMBOL" className="w-6 h-6 mr-1" />
                                    Tap on doge! 🌙
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Spacer for Desktop */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <div className="text-sm text-teal-700 font-bold bg-gradient-to-r from-lime-100 to-lime-200 px-4 py-2 rounded-cartoon border-2 border-lime-300 shadow-cartoon-soft">
                            🐕 Dogecoin Token Trading Platform 🚀
                        </div>
                    </div>

                    {/* Right Section: Wallet Connect Button */}
                    <div className="relative">
                        <button 
                            ref={buttonRef}
                            onClick={toggleWalletModal}
                            className={`flex items-center space-x-3 px-6 py-3 rounded-cartoon font-bold transition-all duration-200 text-sm shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 transform ${
                                isConnected 
                                    ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 border-2 border-lime-600' 
                                    : 'bg-gradient-to-r from-gold-400 to-gold-500 text-white border-2 border-gold-600'
                            }`}
                        >
                            <div className="relative">
                                <FontAwesomeIcon icon={faWallet} className="w-5 h-5" />
                                {/* Floating coin animation */}
                                <div className="cartoon-coin" style={{ top: '-15px', right: '-15px', fontSize: '10px' }}>D</div>
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