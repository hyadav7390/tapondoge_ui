import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Layout from "@/components/Layout";
import AllTokens from "@/components/AllTokens";
import Dmt from "@/components/Dmt";
import Inscribe from "@/components/Inscribe";
import Balance from "@/components/Balance";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faDollarSign,
  faFileSignature,
  faWallet,
  faGears
} from '@fortawesome/free-solid-svg-icons';
import WhatsMinting from "@/components/WhatsMinting";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [activeTab, setActiveTab] = useState('all-tokens');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <Head>
        <title>TapOnDoge Platform</title>
        <meta name="description" content="TapOnDoge Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tapondoge.ico" />
      </Head>
      {/* <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      > */}
      <Layout>
        {/* <Model> </Model> */}
        <div className="container py-4">
          <ul className="nav nav-pills mb-3 w-100 nav-fill" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'all-tokens' ? 'active' : ''}`}
                onClick={() => handleTabChange('all-tokens')}
                type="button"
                role="tab"
                aria-selected={activeTab === 'all-tokens'}
              >
                <div className="d-flex flex-column align-items-center">
                  <FontAwesomeIcon
                    icon={faCoins}
                    style={{ fontSize: '24px', marginBottom: '8px' }}
                  />
                  All Tokens
                </div>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'dmt' ? 'active' : ''}`}
                onClick={() => handleTabChange('dmt')}
                type="button"
                role="tab"
                aria-selected={activeTab === 'dmt'}
              >
                <div className="d-flex flex-column align-items-center">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    style={{ fontSize: '24px', marginBottom: '8px' }}
                  />
                  DMT
                </div>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'inscribe' ? 'active' : ''}`}
                onClick={() => handleTabChange('inscribe')}
                type="button"
                role="tab"
                aria-selected={activeTab === 'inscribe'}
              >
                <div className="d-flex flex-column align-items-center">
                  <FontAwesomeIcon
                    icon={faFileSignature}
                    style={{ fontSize: '24px', marginBottom: '8px' }}
                  />
                  Inscribe
                </div>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'balance' ? 'active' : ''}`}
                onClick={() => handleTabChange('balance')}
                type="button"
                role="tab"
                aria-selected={activeTab === 'balance'}
              >
                <div className="d-flex flex-column align-items-center">
                  <FontAwesomeIcon
                    icon={faWallet}
                    style={{ fontSize: '24px', marginBottom: '8px' }}
                  />
                  Balance
                </div>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'minting' ? 'active' : ''}`}
                onClick={() => handleTabChange('minting')}
                type="button"
                role="tab"
                aria-selected={activeTab === 'minting'}
              >
                <div className="d-flex flex-column align-items-center">
                  <FontAwesomeIcon
                    icon={faGears}
                    style={{ fontSize: '24px', marginBottom: '8px' }}
                  />
                  What's Minting
                </div>
              </button>
            </li>
          </ul>
          <div className="tab-content p-4" id="pills-tabContent">
            <div className={`tab-pane fade ${activeTab === 'all-tokens' ? 'show active' : ''}`}>
              {activeTab === 'all-tokens' && <AllTokens />}
            </div>
            <div className={`tab-pane fade ${activeTab === 'dmt' ? 'show active' : ''}`}>
              {activeTab === 'dmt' && <Dmt />}
            </div>
            <div className={`tab-pane fade ${activeTab === 'inscribe' ? 'show active' : ''}`}>
              {activeTab === 'inscribe' && <Inscribe />}
            </div>
            <div className={`tab-pane fade ${activeTab === 'balance' ? 'show active' : ''}`}>
              {activeTab === 'balance' && <Balance />}
            </div>
            <div className={`tab-pane fade ${activeTab === 'minting' ? 'show active' : ''}`}>
              {activeTab === 'minting' && <WhatsMinting />}
            </div>
          </div>
        </div>
      </Layout>
      {/* </div> */}
    </>
  );
}
