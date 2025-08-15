import { useEffect } from 'react';
import { LoaderProvider } from '@/contexts/LoaderContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { applyTheme } from '@/styles/theme';
import Header from './Header';
import Footer from './Footer';
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

export default function Layout({ children }) {
  useEffect(() => {
    applyTheme();
  }, []);

  return (
    <LoaderProvider>
      <WalletProvider>
        <div className="layout">
          <Header />
          {children}
          <Footer />
        </div>
      </WalletProvider>
    </LoaderProvider>
  );
}