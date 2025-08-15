import Document, { Html, Head, Main, NextScript } from 'next/document';
import '../styles/theme.js';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add Font Awesome */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          />
          
          {/* Add Bitcore and Mnemonic libraries */}
          {<script src="/js/bitcore-lib-doge.js"></script>}
          {<script src="/js/bitcore-mnemonic.js"></script>}
          {<script>
              window.bitcore = bitcore;
              window.Mnemonic = Mnemonic;
          </script>}
        </Head>
        <body className="dark-theme">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
