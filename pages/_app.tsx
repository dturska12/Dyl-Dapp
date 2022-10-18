import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Head from "next/head";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Goerli;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Head>
        <title>Creator Pass, by 1st Class</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="1st Class" />
        <meta
          name="keywords"
          content="Thirdweb, KronicLabz, KronicKatz, web3, thirdweb NFT drop, how to make thirdweb nft drop, how to make nft collection thirdweb"
        />
      </Head>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
