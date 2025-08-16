import Head from "next/head";
import Layout from "@/components/Layout";
import Inscribe from "@/components/Inscribe";

export default function InscribePage() {
  return (
    <>
      <Head>
        <title>Inscribe | TapOnDoge Platform</title>
        <meta name="description" content="Mint, deploy, and transfer tokens on TapOnDoge platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tapondoge.ico" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 py-8">
            <Inscribe />
          </div>
        </div>
      </Layout>
    </>
  );
} 