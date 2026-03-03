"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Trash2, Copy, Check, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { generateSolanaWallet } from "@/lib/WallGen";

const STORAGE_KEY = "solana_wallets";
const MNEMONIC_KEY = "solana_mnemonic";

type Wallet = {
  index: number;
  publicKey: string;
  privateKey: string;
  path: string;
};

function truncate(str: string, start = 8, end = 8) {
  if (str.length <= start + end) return str;
  return `${str.slice(0, start)}...${str.slice(-end)}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-1 inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
}

export default function SolanaPage() {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [storedMnemonic, setStoredMnemonic] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedMnemonic = localStorage.getItem(MNEMONIC_KEY);
      const savedWallets = localStorage.getItem(STORAGE_KEY);
      if (savedMnemonic) setStoredMnemonic(savedMnemonic);
      if (savedWallets) setWallets(JSON.parse(savedWallets));
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist wallets to localStorage whenever they change
  useEffect(() => {
    if (wallets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [wallets]);

  const handleAdd = () => {
    setError("");
    const phrase = mnemonic.trim();

    if (!phrase) {
      setError("Please paste a mnemonic phrase.");
      return;
    }

    const wordCount = phrase.split(/\s+/).length;
    if (wordCount !== 12 && wordCount !== 24) {
      setError("Mnemonic must be 12 or 24 words.");
      return;
    }

    // If a mnemonic is already stored, ensure it matches
    if (storedMnemonic && storedMnemonic !== phrase) {
      setError(
        "This mnemonic doesn't match the stored one. Clear all wallets first to use a different mnemonic.",
      );
      return;
    }

    try {
      const nextIndex = wallets.length;
      const { publicKey, privateKey } = generateSolanaWallet(phrase, nextIndex);

      const newWallet: Wallet = {
        index: nextIndex,
        publicKey,
        privateKey,
        path: `m/44'/501'/${nextIndex}'/0'`,
      };

      // Save the mnemonic on first wallet creation
      if (!storedMnemonic) {
        localStorage.setItem(MNEMONIC_KEY, phrase);
        setStoredMnemonic(phrase);
      }

      setWallets((prev) => [...prev, newWallet]);
      setMnemonic("");
    } catch {
      setError("Invalid mnemonic. Please check the phrase and try again.");
    }
  };

  const handleRemove = (index: number) => {
    setWallets((prev) => {
      const updated = prev.filter((w) => w.index !== index);
      // Re-derive removed wallets would change derivation paths,
      // so we just remove and keep the existing ones with their original paths.
      // We DON'T re-index to preserve derivation path integrity.
      if (updated.length === 0) {
        localStorage.removeItem(MNEMONIC_KEY);
        setStoredMnemonic(null);
      }

      return updated;
    });
    setVisibleKeys((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const handleClearAll = () => {
    setWallets([]);
    setStoredMnemonic(null);
    setVisibleKeys({});
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MNEMONIC_KEY);
  };

  const toggleKeyVisibility = (index: number) => {
    setVisibleKeys((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight">
            Solana HD Wallet
          </h1>
          <p className="text-sm text-muted-foreground">
            Paste your BIP39 mnemonic to derive Solana keypairs using{" "}
            <span className="font-mono">
              m/44&apos;/501&apos;/n&apos;/0&apos;
            </span>
          </p>
        </div>

        {/* Input section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add Wallet</CardTitle>
            <CardDescription>
              {wallets.length === 0
                ? "Paste a 12 or 24-word mnemonic phrase and press Add."
                : `Wallet #${wallets.length} will be derived from the stored mnemonic. Paste it again to confirm.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="word1 word2 word3 ... word12"
              value={mnemonic}
              onChange={(e) => {
                setMnemonic(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="font-mono text-xs"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex items-center gap-2">
              <Button onClick={handleAdd} size="default">
                <PlusCircle className="size-3.5" />
                Add Wallet
              </Button>
              {wallets.length > 0 && (
                <Button
                  variant="destructive"
                  size="default"
                  onClick={handleClearAll}
                >
                  <Trash2 className="size-4" />
                  Clear All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Wallet list */}
        {wallets.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">
                {wallets.length} wallet{wallets.length !== 1 ? "s" : ""}
              </h2>
              <span className="text-xs text-muted-foreground font-mono">
                {storedMnemonic ? truncate(storedMnemonic, 12, 12) : ""}
              </span>
            </div>

            {wallets.map((wallet) => (
              <Card key={wallet.index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Wallet #{wallet.index + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-normal text-muted-foreground">
                        {wallet.path}
                      </span>
                      <Button
                        variant="destructive"
                        size="icon-xs"
                        onClick={() => handleRemove(wallet.index)}
                        title="Remove wallet"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Public key */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Public Key
                    </p>
                    <div className="flex items-center gap-1 rounded-none border border-input bg-muted/40 px-2.5 py-1.5">
                      <span className="flex-1 font-mono text-xs break-all">
                        {wallet.publicKey}
                      </span>
                      <CopyButton text={wallet.publicKey} />
                    </div>
                  </div>

                  {/* Private key */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Private Key
                      </p>
                      <button
                        onClick={() => toggleKeyVisibility(wallet.index)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {visibleKeys[wallet.index] ? (
                          <>
                            <EyeOff className="size-3" /> Hide
                          </>
                        ) : (
                          <>
                            <Eye className="size-3" /> Show
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-1 rounded-none border border-input bg-muted/40 px-2.5 py-1.5">
                      <span className="flex-1 font-mono text-xs break-all">
                        {visibleKeys[wallet.index]
                          ? wallet.privateKey
                          : "•".repeat(64)}
                      </span>
                      <CopyButton text={wallet.privateKey} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {wallets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
            <p className="text-sm text-muted-foreground">No wallets yet.</p>
            <p className="text-xs text-muted-foreground">
              Paste a mnemonic above and press &ldquo;Add Wallet&rdquo; to get
              started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
