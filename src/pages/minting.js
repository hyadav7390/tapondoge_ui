import Head from "next/head";
import Layout from "@/components/Layout";
import WhatsMinting from "@/components/WhatsMinting";

export default function MintingPage() {
  return (
    <>
      <Head>
        <title>What's Minting | TapOnDoge Platform</title>
        <meta name="description" content="Discover tokens available for minting on TapOnDoge platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tapondoge.ico" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 py-8">
            <WhatsMinting />
          </div>
        </div>
      </Layout>
    </>
  );
} 