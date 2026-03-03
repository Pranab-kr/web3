import Link from "next/link";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <main className="space-y-2">
      <h1 className="font-bold text-3xl text-foreground">
        Solana keys from mnemonic
      </h1>

      <p className="text-muted-foreground">
        choice a blockchain, to get started
      </p>

      <div className="flex justify-start gap-4 mt-6">
        <Button variant="default" size="lg" className="px-8 py-2">
          <Link href="/keys/solana" className="w-full h-full">
            Solana
          </Link>
        </Button>
        <Button variant="default" size="lg" className="px-8 py-2">
          <Link href="/keys/eth" className="w-full h-full">
            Ethereum
          </Link>
        </Button>
      </div>
    </main>
  );
};

export default Hero;
