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
  Plus,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
const MNEMONICS_KEY = "solana_mnemonics";

type Wallet = {
  index: number;
  publicKey: string;
  privateKey: string;
  path: string;
  mnemonicIndex: number;
};

type SavedMnemonic = {
  id: string;
  phrase: string;
  label: string;
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
  const [showInput, setShowInput] = useState(true);

  const [savedMnemonics, setSavedMnemonics] = useState<SavedMnemonic[]>([]);
  const [activeMnemonicId, setActiveMnemonicId] = useState<string>("");

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});
  const [phraseOpen, setPhraseOpen] = useState(true);

  // Confirmation dialog state
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const rawMnemonics = localStorage.getItem(MNEMONICS_KEY);
      const rawWallets = localStorage.getItem(STORAGE_KEY);

      const mnemonics: SavedMnemonic[] = rawMnemonics
        ? JSON.parse(rawMnemonics)
        : [];
      const walls: Wallet[] = rawWallets ? JSON.parse(rawWallets) : [];

      setSavedMnemonics(mnemonics);
      setWallets(walls);

      if (mnemonics.length > 0) {
        setActiveMnemonicId(mnemonics[0].id);
        // Phrase already saved — hide the input by default
        setShowInput(false);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist mnemonics
  useEffect(() => {
    if (savedMnemonics.length > 0) {
      localStorage.setItem(MNEMONICS_KEY, JSON.stringify(savedMnemonics));
    } else {
      localStorage.removeItem(MNEMONICS_KEY);
    }
  }, [savedMnemonics]);

  // Persist wallets
  useEffect(() => {
    if (wallets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [wallets]);

  const activeMnemonic = savedMnemonics.find((m) => m.id === activeMnemonicId);
  const activeWords = activeMnemonic ? activeMnemonic.phrase.split(/\s+/) : [];

  const activeWallets = wallets.filter(
    (w) =>
      w.mnemonicIndex ===
      savedMnemonics.findIndex((m) => m.id === activeMnemonicId),
  );

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
    if (savedMnemonics.some((m) => m.phrase === phrase)) {
      setError("This phrase is already saved.");
      return;
    }

    const id = crypto.randomUUID();
    const label = `Phrase ${savedMnemonics.length + 1}`;
    const newMnemonic: SavedMnemonic = { id, phrase, label };

    setSavedMnemonics((prev) => [...prev, newMnemonic]);
    setActiveMnemonicId(id);
    setMnemonicInput("");
    setPhraseOpen(true);
    // Hide the input after the phrase is successfully added
    setShowInput(false);
  };

  const handleAddWallet = () => {
    if (!activeMnemonic) {
      setError("Select or add a mnemonic phrase first.");
      return;
    }
    setError("");
    try {
      const mnemonicIndex = savedMnemonics.findIndex(
        (m) => m.id === activeMnemonicId,
      );
      const existingCount = wallets.filter(
        (w) => w.mnemonicIndex === mnemonicIndex,
      ).length;

      const { publicKey, privateKey } = generateSolanaWallet(
        activeMnemonic.phrase,
        existingCount,
      );

      const newWallet: Wallet = {
        index: wallets.length,
        publicKey,
        privateKey,
        path: `m/44'/501'/${existingCount}'/0'`,
        mnemonicIndex,
      };

      setWallets((prev) => [...prev, newWallet]);
    } catch {
      setError("Failed to derive wallet. The mnemonic may be invalid.");
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

  // Called after user confirms in the dialog
  const handleConfirmClearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MNEMONICS_KEY);
    setSavedMnemonics([]);
    setWallets([]);
    setVisibleKeys({});
    setActiveMnemonicId("");
    setShowInput(true);
    setClearDialogOpen(false);
    router.push("/");
  };

  const toggleKey = (index: number) => {
    setVisibleKeys((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">

        {/* ── Mnemonic input (hidden once a phrase is saved) ── */}
        {showInput ? (
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
              {/* Cancel back to phrase view if there's already a saved phrase */}
              {savedMnemonics.length > 0 && (
                <Button
                  variant="outline"
                  size="lg"
                  className="shrink-0"
                  onClick={() => {
                    setShowInput(false);
                    setMnemonicInput("");
                    setError("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        ) : (
          /* ── "Add another phrase" trigger ── */
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Phrase selector dropdown */}
              {savedMnemonics.length > 1 && (
                <>
                  <span className="text-xs text-muted-foreground">
                    Active phrase:
                  </span>
                  <Select
                    value={activeMnemonicId}
                    onValueChange={(val) => {
                      if (val) setActiveMnemonicId(val);
                      setPhraseOpen(true);
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select phrase" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedMnemonics.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowInput(true);
                setError("");
              }}
            >
              <Plus className="size-3.5" />
              Add Another Phrase
            </Button>
          </div>
        )}

        {/* ── Your Secret Phrase collapsible ── */}
        {activeMnemonic && (
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
                  {/* Word grid — 4 columns */}
                  <div className="grid grid-cols-4 gap-2">
                    {activeWords.map((word, i) => (
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

                  {/* Copy hint */}
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(activeMnemonic.phrase)
                    }
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
        {activeMnemonic && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">
                Solana Wallet
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="default" onClick={handleAddWallet}>
                  Add Wallet
                </Button>
                {/* Clear Wallets always visible once a phrase exists — opens dialog */}
                <Button
                  variant="destructive"
                  size="default"
                  onClick={() => setClearDialogOpen(true)}
                >
                  Clear Wallets
                </Button>
              </div>
            </div>

            {activeWallets.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No wallets yet — press &ldquo;Add Wallet&rdquo; to derive one.
              </p>
            )}

            {activeWallets.map((wallet) => (
              <Card key={wallet.index} className="overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <span className="text-lg font-bold">
                    Wallet {activeWallets.indexOf(wallet) + 1}
                  </span>
                  <button
                    onClick={() => handleRemoveWallet(wallet.index)}
                    className="text-destructive hover:text-destructive/70 transition-colors"
                    title="Remove wallet"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>

                <CardContent className="px-6 py-5 space-y-5">
                  {/* Public Key */}
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold">Public Key</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-sm text-muted-foreground break-all">
                        {wallet.publicKey}
                      </span>
                      <CopyButton text={wallet.publicKey} className="shrink-0" />
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Private Key */}
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
        {savedMnemonics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
            <p className="text-sm text-muted-foreground">No phrase added yet.</p>
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
                all saved phrases and wallets
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
