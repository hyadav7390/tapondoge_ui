import '@/styles/globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { LoaderProvider } from '@/contexts/LoaderContext';
import { WalletProvider } from '@/contexts/WalletContext';

// Prevent fontawesome from adding its CSS since we did it manually above:
config.autoAddCss = false;

export default function App({ Component, pageProps }) {
  return (
    <LoaderProvider>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </LoaderProvider>
  );
}