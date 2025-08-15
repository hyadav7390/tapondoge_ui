import Head from "next/head";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faDollarSign,
  faFileSignature,
  faWallet,
  faGears
} from '@fortawesome/free-solid-svg-icons';
import Layout from "@/components/Layout";
import AllTokens from "@/components/AllTokens";
import Dmt from "@/components/Dmt";
import Inscribe from "@/components/Inscribe";
import Balance from "@/components/Balance";
import WhatsMinting from "@/components/WhatsMinting";

export default function Home() {
  const [activeTab, setActiveTab] = useState('all-tokens');

  const tabs = [
    {
      id: 'all-tokens',
      name: 'All Tokens',
      icon: faCoins,
      component: AllTokens
    },
    {
      id: 'dmt',
      name: 'DMT',
      icon: faDollarSign,
      component: Dmt
    },
    {
      id: 'inscribe',
      name: 'Inscribe',
      icon: faFileSignature,
      component: Inscribe
    },
    {
      id: 'balance',
      name: 'Balance',
      icon: faWallet,
      component: Balance
    },
    {
      id: 'minting',
      name: "What's Minting",
      icon: faGears,
      component: WhatsMinting
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <>
      <Head>
        <title>TapOnDoge Platform</title>
        <meta name="description" content="TapOnDoge Platform - The premier Dogecoin token platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tapondoge.ico" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to <span className="text-gradient">TapOnDoge</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The premier platform for Dogecoin tokens. Discover, mint, and manage your digital assets with ease.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
              <div className="flex flex-wrap justify-center p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex flex-col items-center px-6 py-4 mx-1 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={tab.icon}
                      className={`text-2xl mb-2 transition-all duration-200 ${
                        activeTab === tab.id ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                {ActiveComponent && <ActiveComponent />}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
