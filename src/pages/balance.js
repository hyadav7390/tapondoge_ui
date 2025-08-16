import Head from "next/head";
import Layout from "@/components/Layout";
import Balance from "@/components/Balance";

export default function BalancePage() {
  return (
    <>
      <Head>
        <title>Check Balance | TapOnDoge Platform</title>
        <meta name="description" content="Check wallet balances on TapOnDoge platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tapondoge.ico" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 py-8">
            <Balance />
          </div>
        </div>
      </Layout>
    </>
  );
} 