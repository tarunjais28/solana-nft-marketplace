import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import nftProgramIDL from "../target/idl/nft.json";
import { NFT_PROGRAM_ID } from "./constant";
import * as fs from "fs";

export const nftProgramID = new PublicKey(NFT_PROGRAM_ID);

export const nftProgramInterface = JSON.parse(JSON.stringify(nftProgramIDL));

const solanaNetwork = web3.clusterApiUrl("devnet");
const opts: any = {
  preflightCommitment: "processed",
};

export const getProvider = (): {
  provider: AnchorProvider;
  connection: web3.Connection;
} => {
  try {
    //Creating a provider, the provider is authenication connection to solana
    const connection = new web3.Connection(
      solanaNetwork,
      opts.preflightCommitment,
    );

    /// With config file
    const rawPayerKeypair = JSON.parse(
      fs.readFileSync("/home/tarunjais/.config/solana/id.json", "utf-8"),
    );
    const privateKeyWallet = anchor.web3.Keypair.fromSecretKey(
      Buffer.from(rawPayerKeypair),
    );

    const provider: any = new AnchorProvider(
      connection,
      new NodeWallet(privateKeyWallet),
      opts,
    );
    return { provider, connection };
  } catch (error) {
    console.log("provider:solana", error);
    throw error;
  }
};
