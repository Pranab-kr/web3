import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

import { PublicKey } from "@solana/web3.js";

async function main() {
  const mint = new PublicKey("ELWSHTFDWAWPS6ynR4aKumu8fiKXQhMPvWVEWKKhZzoS"); //min of oni token
  const owner = new PublicKey("22q78tREPo4Tyjs9BpdnHMuQJP5McsCsBv73zx1m1oM9"); // my sol add

  // to get the associated token address of the owner
  const ata = await getAssociatedTokenAddress(
    mint,
    owner,
    false,
    TOKEN_2022_PROGRAM_ID,
  );

  //to check the address and bump seed of the ata, we can use findProgramAddressSync
  const [address, bump] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  console.log(ata.toBase58());

  console.log(address.toBase58());
  console.log(bump);
}

main();

