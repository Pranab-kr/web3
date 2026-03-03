"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { generateSolanaWallet } from "@/lib/WallGen";

const STORAGE_KEY = "solana_wallets";
const MNEMONIC_KEY = "solana_mnemonic";

type Wallet = {
  index: number;
  publicKey: string;
  privateKey: string;
  path: string;
};

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center text-muted-foreground hover:text-foreground transition-colors ${className ?? ""}`}
      title="Copy"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}

export default function SolanaPage() {
  const router = useRouter();

  const [mnemonicInput, setMnemonicInput] = useState("");
  const [error, setError] = useState("");

  const [savedMnemonic, setSavedMnemonic] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});
  const [phraseOpen, setPhraseOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const m = localStorage.getItem(MNEMONIC_KEY);
      const w = localStorage.getItem(STORAGE_KEY);
      if (m) setSavedMnemonic(m);
      if (w) setWallets(JSON.parse(w));
    } catch {
      // ignore
    }
  }, []);

  // Persist wallets
  useEffect(() => {
    if (wallets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [wallets]);

  const words = savedMnemonic ? savedMnemonic.split(/\s+/) : [];

  const handleAddMnemonic = () => {
    setError("");
    const phrase = mnemonicInput.trim();

    if (!phrase) {
      setError("Paste a mnemonic phrase first.");
      return;
    }
    const wordCount = phrase.split(/\s+/).length;
    if (wordCount !== 12 && wordCount !== 24) {
      setError("Mnemonic must be 12 or 24 words.");
      return;
    }

    try {
      // Validate by attempting to derive the first wallet
      generateSolanaWallet(phrase, 0);
    } catch {
      setError("Invalid mnemonic. Please check the phrase and try again.");
      return;
    }

    localStorage.setItem(MNEMONIC_KEY, phrase);
    setSavedMnemonic(phrase);
    setMnemonicInput("");
    setPhraseOpen(false);
  };

  const handleAddWallet = () => {
    if (!savedMnemonic) return;
    setError("");
    try {
      const nextIndex = wallets.length;
      const { publicKey, privateKey } = generateSolanaWallet(
        savedMnemonic,
        nextIndex,
      );
      setWallets((prev) => [
        ...prev,
        {
          index: nextIndex,
          publicKey,
          privateKey,
          path: `m/44'/501'/${nextIndex}'/0'`,
        },
      ]);
    } catch {
      setError("Failed to derive wallet.");
    }
  };

  const handleRemoveWallet = (index: number) => {
    setWallets((prev) => prev.filter((w) => w.index !== index));
    setVisibleKeys((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const handleConfirmClearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MNEMONIC_KEY);
    setSavedMnemonic(null);
    setWallets([]);
    setVisibleKeys({});
    setClearDialogOpen(false);
    router.push("/");
  };

  const toggleKey = (index: number) => {
    setVisibleKeys((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
        {/* ── Input — only shown when no phrase saved yet ── */}
        {!savedMnemonic && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your secret phrase (12 or 24 words)..."
                value={mnemonicInput}
                onChange={(e) => {
                  setMnemonicInput(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAddMnemonic()}
                className="font-mono h-9 text-sm flex-1"
              />
              <Button
                onClick={handleAddMnemonic}
                size="lg"
                className="shrink-0"
              >
                Add Phrase
              </Button>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )}

        {/* ── Your Secret Phrase collapsible ── */}
        {savedMnemonic && (
          <Collapsible open={phraseOpen} onOpenChange={setPhraseOpen}>
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-muted/30 transition-colors">
                <span className="text-xl font-bold tracking-tight">
                  Your Secret Phrase
                </span>
                {phraseOpen ? (
                  <ChevronUp className="size-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-5 text-muted-foreground" />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {words.map((word, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-none border border-border bg-muted/50 px-3 py-2.5"
                      >
                        <span className="text-xs text-muted-foreground w-4 shrink-0 select-none">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium">{word}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(savedMnemonic)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="size-3.5" />
                    Click Anywhere To Copy
                  </button>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* ── Solana Wallet section ── */}
        {savedMnemonic && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">
                Solana Wallet
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleAddWallet}
                >
                  Add Wallet
                </Button>
                <Button
                  variant="destructive"
                  size="default"
                  onClick={() => setClearDialogOpen(true)}
                >
                  Clear Wallets
                </Button>
              </div>
            </div>

            {wallets.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No wallets yet — press &ldquo;Add Wallet&rdquo; to derive one.
              </p>
            )}

            {wallets.map((wallet, i) => (
              <Card key={wallet.index} className="overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <span className="text-lg font-bold">Wallet {i + 1}</span>
                  <button
                    onClick={() => handleRemoveWallet(wallet.index)}
                    className="text-destructive hover:text-destructive/70 transition-colors"
                    title="Remove wallet"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>

                <CardContent className="px-6 py-5 space-y-5">
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold">Public Key</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-sm text-muted-foreground break-all">
                        {wallet.publicKey}
                      </span>
                      <CopyButton
                        text={wallet.publicKey}
                        className="shrink-0"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="space-y-1.5">
                    <p className="text-sm font-bold">Private Key</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-sm text-muted-foreground break-all">
                        {visibleKeys[wallet.index]
                          ? wallet.privateKey
                          : Array(64).fill("•").join(" ")}
                      </span>
                      <button
                        onClick={() => toggleKey(wallet.index)}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        title={visibleKeys[wallet.index] ? "Hide" : "Show"}
                      >
                        {visibleKeys[wallet.index] ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!savedMnemonic && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              No phrase added yet.
            </p>
            <p className="text-xs text-muted-foreground">
              Paste your 12 or 24-word mnemonic above and press &ldquo;Add
              Phrase&rdquo;.
            </p>
          </div>
        )}
      </div>

      {/* ── Confirmation dialog ── */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Clear everything?
            </DialogTitle>
            <DialogDescription className="text-sm">
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                your saved phrase and all wallets
              </span>{" "}
              from this device. You will be redirected to the home page.
              <br />
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <DialogClose
              render={
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              }
            />
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleConfirmClearAll}
            >
              Yes, clear all
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
