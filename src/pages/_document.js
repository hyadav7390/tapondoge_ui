import Document, { Html, Head, Main, NextScript } from 'next/document';

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
          
          {/* Add required libraries for wallet functionality - using local files like reference */}
          <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js" async></script>
          <script src="/lib/bundle_buffer.js" async></script>
          <script src="/lib/bitcore-mnemonic.js" async></script>
          <script src="/lib/bitcore-lib-doge.js" async></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
