import Head from "next/head";
import Layout from "@/components/Layout";
import AllTokens from "@/components/AllTokens";

export default function Home() {
  return (
    <>
      <Head>
        <title>All Tokens | TapOnDoge Platform</title>
        <meta name="description" content="Discover and trade Dogecoin tokens on TapOnDoge platform" />
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
                Most powerful metaprotocol on top of Doginals with a clear focus on Bitcoin L1 powered by{' '}
                <a 
                  href="https://api.tapondoge.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-gradient-gold hover:scale-110 transition-transform duration-200"
                >
                  Benny Protocol
                </a>
                .
              </p>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <AllTokens />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
