import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Layout from "@/components/Layout";
import AllTokens from "@/components/AllTokens";
import Dmt from "@/components/Dmt";
import Inscribe from "@/components/Inscribe";
import Balance from "@/components/Balance";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faWallet,
  faPen,
  faChartLine,
  faGears
} from '@fortawesome/free-solid-svg-icons';
import WhatsMinting from "@/components/WhatsMinting";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const [activeTab, setActiveTab] = useState('tokens');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Layout>
      <Head>
        <title>Tap on Doge</title>
        <meta name="description" content="Tap on Doge - Dogecoin Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main} ${inter.className}`}>
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${activeTab === 'tokens' ? styles.active : ''}`}
            onClick={() => handleTabChange('tokens')}
          >
            <FontAwesomeIcon icon={faCoins} />
            All Tokens
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'dmt' ? styles.active : ''}`}
            onClick={() => handleTabChange('dmt')}
          >
            <FontAwesomeIcon icon={faGears} />
            DMT
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'inscribe' ? styles.active : ''}`}
            onClick={() => handleTabChange('inscribe')}
          >
            <FontAwesomeIcon icon={faPen} />
            Inscribe
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'balance' ? styles.active : ''}`}
            onClick={() => handleTabChange('balance')}
          >
            <FontAwesomeIcon icon={faWallet} />
            Balance
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'minting' ? styles.active : ''}`}
            onClick={() => handleTabChange('minting')}
          >
            <FontAwesomeIcon icon={faChartLine} />
            What's Minting
          </button>
        </nav>

        <div className={styles.panel}>
          {activeTab === 'tokens' && <AllTokens />}
          {activeTab === 'dmt' && <Dmt />}
          {activeTab === 'inscribe' && <Inscribe />}
          {activeTab === 'balance' && <Balance />}
          {activeTab === 'minting' && <WhatsMinting />}
        </div>
      </main>
    </Layout>
  );
}
