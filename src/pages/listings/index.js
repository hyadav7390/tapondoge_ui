import { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import Head from "next/head";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
        <div className="container my-4" style={{ backgroundColor: 'var(--color-cardHeader)', padding: '10px', borderRadius: '5px', border: '1px solid var(--color-border)' }}>
          <a
            onClick={() => window.history.back()}
            style={{ cursor: 'pointer', fontSize: 'small', textDecoration: 'underline', color: 'var(--color-link)' }}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ fontSize: '10px', margin: '0 5px 1px 0' }}
            />
            Back to all tokens
          </a>
          <h1 style={{ textAlign: 'center' }}>{tokenName}</h1>

          {/* Token Stats Component */}
          {tokenName && <TokenStats tokenName={tokenName} />}
        </div>

        {/* Token Listings Component */}
        {tokenName && <TokenListings tokenName={tokenName} />}

        {/* Activity Log Component */}
        {tokenName && <ActivityLog tokenName={tokenName} />}
      </Layout>
    </>
  );
}
