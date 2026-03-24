"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const WallConnect = () => {
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();

  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!publicKey) return;

    connection.getBalance(publicKey).then((lamports) => {
      setBalance(lamports / 1e9);
    });
  }, [publicKey, connection]);

  const network = connection.rpcEndpoint.includes("devnet")
    ? "Devnet"
    : connection.rpcEndpoint.includes("mainnet")
      ? "Mainnet"
      : "Unknown";

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Wallet Adapter</CardTitle>
            <CardDescription>
              Connect your wallet to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletMultiButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <WalletDisconnectButton />
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {wallet?.adapter.icon && (
              <Image
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <CardTitle>{wallet?.adapter.name}</CardTitle>
              <CardDescription className="font-mono text-xs">
                {publicKey.toBase58().slice(0, 6)}...
                {publicKey.toBase58().slice(-6)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 pt-4">
          {/* Balance */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Balance</p>
            <p className="text-2xl font-semibold tabular-nums">
              {balance.toFixed(4)}{" "}
              <span className="text-sm text-muted-foreground font-normal">
                SOL
              </span>
            </p>
          </div>

          <Separator />

          {/* Network */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Network</p>
            <Badge variant="outline" className="gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {network}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WallConnect;
