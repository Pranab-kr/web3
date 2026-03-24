"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
import WallConnect from "@/components/WallConnect";

const page = () => {
  const endpoint =
    process.env.HELIUS_RPC_URL || "https://api.devnet.solana.com";
  return (
    <main className="container mx-auto min-h-screen p-6">
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <WallConnect />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </main>
  );
};

export default page;
