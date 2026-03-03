import nacl from "tweetnacl";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export function generateSolanaWallet(mnemonic: string, walletIndex: number) {
  const seed = mnemonicToSeedSync(mnemonic);

  const path = `m/44'/501'/${walletIndex}'/0'`;

  const derivedSeed = derivePath(path, seed.toString("hex")).key;

  const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);

  // const solanaKeyPair = Keypair.fromSecretKey(keyPair.secretKey);

  return {
    publicKey: bs58.encode(keyPair.publicKey), // 32 bytes
    privateKey: bs58.encode(keyPair.secretKey), // 64 bytes
  };
}
