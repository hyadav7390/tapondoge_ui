import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import TokenDetails from '@/components/TokenDetails';
import { getTokenByTicker, getTokensBalance } from '@/utils/service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function TokenDetailsPage() {
  const router = useRouter();
  const { ticker } = router.query;
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!ticker) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch token deployment data
        const tokenData = await getTokenByTicker(ticker);
        
        if (tokenData) {
          setToken({
            ticker: ticker,
            ...tokenData
          });
        } else {
          setError('Token not found');
        }
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError('Failed to load token details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenData();
  }, [ticker]);

  const handleBack = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading token details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-4">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Token</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{ticker} - Token Details | TapOnDoge</title>
        <meta name="description" content={`${ticker} token details and management on TapOnDoge platform`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tapondoge.ico" />
      </Head>
      
      <Layout>
        <TokenDetails token={token} onBack={handleBack} />
      </Layout>
    </>
  );
} 