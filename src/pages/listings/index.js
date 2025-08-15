import { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import Head from "next/head";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCoins } from '@fortawesome/free-solid-svg-icons';
import TokenStats from '@/components/TokenStats';
import TokenListings from '@/components/TokenListings';
import ActivityLog from '@/components/ActivityLog';
import { useLoader } from '@/contexts/LoaderContext';

export default function Listings() {
  const [tokenName, setTokenName] = useState('');
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');

      if (token) {
        setTokenName(token);
        document.title = `${token.toUpperCase()} - Tap on Doge`;
      } else {
        console.log('Token not found');
        // Redirect to home page if no token is specified
        window.location.href = '/';
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>{tokenName ? `${tokenName} - Tap On Doge` : 'Tap On Doge'}</title>
        <meta name="description" content={`${tokenName} token information and listings on Tap On Doge`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tapondoge.ico" />
      </Head>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 mr-2" />
                  Back to all tokens
                </button>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FontAwesomeIcon icon={faCoins} className="w-8 h-8 text-primary-600 mr-3" />
                  <h1 className="text-3xl font-bold text-gray-900">{tokenName}</h1>
                </div>
                <p className="text-gray-600">Token information, listings, and activity</p>
              </div>
            </div>

            {/* Token Stats Component */}
            {tokenName && (
              <div className="mb-8">
                <TokenStats tokenName={tokenName} />
              </div>
            )}

            {/* Token Listings Component */}
            {tokenName && (
              <div className="mb-8">
                <TokenListings tokenName={tokenName} />
              </div>
            )}

            {/* Activity Log Component */}
            {tokenName && (
              <div className="mb-8">
                <ActivityLog tokenName={tokenName} />
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
