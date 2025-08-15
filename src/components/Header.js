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
        <header className="shadow-sm">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand d-flex align-items-center font-weight-bold" href="/">
                        <img
                            src="/tapondoge.jpg"
                            alt="TAPONDOGE Logo"
                            style={{
                                height: '40px',
                                width: 'auto',
                                marginRight: '10px'
                            }}
                        />
                        <span className="fw-bold">TAPONDOGE</span>
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="https://discord.com/invite/CHbTua4UZj" target="_blank" rel="noopener noreferrer">
                                    <img
                                        src="/discord.png"
                                        alt="Discord"
                                        style={{ width: '30px', height: '30px' }}
                                    />
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="https://x.com/tapondogehq" target="_blank" rel="noopener noreferrer">
                                    <img
                                        src="/x.png"
                                        alt="Twitter"
                                        style={{ width: '25px', height: '25px', backgroundColor: '#ffffff' }}
                                    />

                                </a>
                            </li>
                            <li className="nav-item dropdown">
                                <div className="mt-1" style={{ position: 'relative' }}>
                                    <button 
                                        ref={buttonRef}
                                        className={`btn ${isConnected ? 'btn-success' : 'btn-primary'}`}
                                        onClick={toggleWalletModal}
                                    >
                                        {isConnected ? (
                                            <span>
                                                <i className="fas fa-wallet me-2"></i>
                                                {address ? formatAddress(address) : 'Loading...'}
                                            </span>
                                        ) : (
                                            <span>
                                                <i className="fas fa-wallet me-2"></i>
                                                Connect Wallet
                                            </span>
                                        )}
                                    </button>
                                    
                                    {/* Wallet Modal - positioned as dropdown */}
                                    {isWalletModalOpen && (
                                        <div 
                                            className="wallet-dropdown" 
                                            ref={modalRef}
                                        >
                                            {/* <div className="wallet-dropdown-header">
                                                <h5>Wallet</h5>
                                                <button 
                                                    type="button" 
                                                    className="btn-close" 
                                                    onClick={() => setIsWalletModalOpen(false)}
                                                ></button>
                                            </div> */}
                                            <div className="wallet-dropdown-body">
                                                <WalletConnect onConnected={() => setIsWalletModalOpen(false)} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}