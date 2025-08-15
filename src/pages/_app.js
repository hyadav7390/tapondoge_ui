import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { LoaderProvider } from '@/contexts/LoaderContext';
import {applyTheme} from '@/styles/theme';
import { WalletProvider } from '@/contexts/WalletContext';

export default function App({ Component, pageProps }) {
  // Apply theme on mount
  useEffect(() => {
    // Load Bootstrap JS
    // import('bootstrap/dist/js/bootstrap.bundle.min.js');
    
    // Apply our custom theme
    applyTheme('dark');
  }, []);

  return (
    <LoaderProvider>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </LoaderProvider>
  );
}