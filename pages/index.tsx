import {
  ChainId,
  useClaimedNFTSupply,
  useContractMetadata,
  useNetwork,
  useNFTDrop,
  useUnclaimedNFTSupply,
  useActiveClaimCondition,
  useClaimNFT,
  useWalletConnect,
  useCoinbaseWallet,
} from "@thirdweb-dev/react";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Theme.module.css";

// Put Your NFT Drop Contract address from the dashboard here
const useContract = "0x934e7A415bdA6454569DF6Fd9C3177dADe2da545";

const Home: NextPage = () => {
  const nftDrop = useNFTDrop(useContract);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const isOnWrongNetwork = useNetworkMismatch();
  const claimNFT = useClaimNFT(nftDrop);
  const [, switchNetwork] = useNetwork();
  const url = "https://thirdweb.com/";
  const url2 = "https://kroniclabz.com/";

  // The amount the user claims
  const [quantity, setQuantity] = useState(1); // default to 1

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(useContract);

  // Load claimed supply and unclaimed supply
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(nftDrop);
  const { data: claimedSupply } = useClaimedNFTSupply(nftDrop);

  // Load the active claim condition
  const { data: activeClaimCondition } = useActiveClaimCondition(nftDrop);

  // Check if there's NFTs left on the active claim phase
  const isNotReady =
    activeClaimCondition &&
    parseInt(activeClaimCondition?.availableSupply) === 0;

  // Check if there's any NFTs left
  const isSoldOut = unclaimedSupply?.toNumber() === 0;

  // Check price
  const price = parseUnits(
    activeClaimCondition?.currencyMetadata.displayValue || "0",
    activeClaimCondition?.currencyMetadata.decimals
  );

  // Multiply depending on quantity
  const priceToMint = price.mul(quantity);

  // Loading state while we fetch the metadata
  if (!nftDrop || !contractMetadata) {
    return <div className={styles.container}>Loading...</div>;
  }

  // Function to mint/claim an NFT

  const mint = async () => {
    if (isOnWrongNetwork) {
      switchNetwork && switchNetwork(ChainId.Goerli);
      return;
    }

    claimNFT.mutate(
      { to: address as string, quantity },
      {
        onSuccess: () => {
          alert(`Successfully minted NFT${quantity > 1 ? "s" : ""}!`);
        },
        onError: (err: any) => {
          console.error(err);
          alert(err?.message || "Something went wrong");
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img
          src="/logo-white.png"
          alt="1st Class"
          width={150}
          role="button"
          style={{ cursor: "pointer" }}
        />
        <hr className={styles.divider} />
      </div>
      <div className={styles.title}>
        <h1>MINT YOUR CREATOR PASS NOW</h1>
      </div>
      <hr className={styles.divider} />
      <p></p>
      <div className={styles.mintInfoContainer}>
        <div className={styles.imageSide}>
          {/* Image Preview of NFTs */}
          <img
            className={styles.image}
            src="/1st.png"
            alt={`${contractMetadata?.name} preview image`}
          />

          {/* Amount claimed so far */}
          <div className={styles.mintCompletionArea}>
            <div className={styles.mintAreaLeft}>
              <p>Total Minted</p>
            </div>
            <div className={styles.mintAreaRight}>
              {claimedSupply && unclaimedSupply ? (
                <p>
                  {/* Claimed supply so far */}
                  <b>{claimedSupply?.toNumber()}</b>
                  {" / "}
                  {
                    // Add unclaimed and claimed supply to get the total supply
                    claimedSupply?.toNumber() + unclaimedSupply?.toNumber()
                  }
                </p>
              ) : (
                // Show loading state if we're still loading the supply
                <p>Loading...</p>
              )}
            </div>
          </div>

          {/* Show claim button or connect wallet button */}
          {address ? (
            // Sold out or show the claim button
            isSoldOut ? (
              <div>
                <h2>Sold Out</h2>
              </div>
            ) : isNotReady ? (
              <div>
                <h2>Not ready to be minted yet</h2>
              </div>
            ) : (
              <>
                <p>Quantity</p>
                <div className={styles.quantityContainer}>
                  <button
                    className={`${styles.quantityControlButton}`}
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>

                  <h4>{quantity}</h4>

                  <button
                    className={`${styles.quantityControlButton}`}
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={
                      quantity >=
                      parseInt(
                        activeClaimCondition?.quantityLimitPerTransaction || "0"
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className={`${styles.mainButton} ${styles.spacerTop} ${styles.spacerBottom}`}
                  onClick={mint}
                  disabled={claimNFT.isLoading}
                >
                  {claimNFT.isLoading
                    ? "Minting..."
                    : `Mint${quantity > 1 ? ` ${quantity}` : ""}${
                        activeClaimCondition?.price.eq(0)
                          ? " (Free)"
                          : activeClaimCondition?.currencyMetadata.displayValue
                          ? ` (${formatUnits(
                              priceToMint,
                              activeClaimCondition.currencyMetadata.decimals
                            )} ${
                              activeClaimCondition?.currencyMetadata.symbol
                            })`
                          : ""
                      }`}
                </button>
              </>
            )
          ) : (
            <div className={styles.buttons}>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  padding: "5 5 5 5",
                }}
              >
                <img
                  src="/metamask.svg"
                  alt="Metamask"
                  width={50}
                  height={50}
                  role="button"
                  style={{ cursor: "pointer" }}
                  onClick={() => connectWithMetamask()}
                />
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                  }}
                >
                  <img
                    src="/coinbase.svg"
                    alt="Coinbase"
                    width={50}
                    height={50}
                    role="button"
                    style={{ cursor: "pointer" }}
                    onClick={() => connectWithCoinbaseWallet()}
                  />
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                    }}
                  >
                    <img
                      src="/walletconnect.svg"
                      alt="WalletConnect"
                      width={50}
                      height={50}
                      role="button"
                      style={{ cursor: "pointer" }}
                      onClick={() => connectWithWalletConnect()}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <p></p>
        <hr className={styles.divider} />
        <div className={styles.container}>
          <div className={styles.infoSide2}>
            {/* Title of your NFT Collection */}
            <h1>{contractMetadata?.name}</h1>
            <div className={styles.infoSide3}>
              {/* Description of your NFT Collection */}
              <p className={styles.description}>
                {contractMetadata?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p></p>
      <hr className={styles.divider} />
      <p></p>
      {/* Powered by thirdweb */}
      {"Powered by"}
      <p></p>
      <img
        src="/logo.png"
        alt="thirdweb Logo"
        width={135}
        className={styles.buttonGapTop}
        role="button"
        style={{ cursor: "pointer" }}
        onClick={() => window.open(url, "_blank")}
      />
      <img
        src="/kroniclabz-logo.png"
        alt="Kroniclabz Logo"
        width={70}
        className={styles.buttonGapTop}
        role="button"
        style={{ cursor: "pointer" }}
        onClick={() => window.open(url2, "_blank")}
      />
    </div>
  );
};

export default Home;
