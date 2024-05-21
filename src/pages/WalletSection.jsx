import React, { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletMultiButton1 } from "./WalletMultiButton1";

const shortenAddress = (address) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};
export default function WalletSection({ wallet }) {
  return (
    // <div className="wallet-section z-40">
    //   <WalletMultiButton1 />
    //   {/* <div className="wallet-status  z-30">
    //     {wallet.connected ? (
    //       <p>Connected: {shortenAddress(wallet.publicKey.toBase58())}</p>
    //     ) : (
    //       <p>Wallet not connected</p>
    //     )}
    //   </div> */}
    // </div>
    <>
      <WalletMultiButton1 />
    </>
  );
}
