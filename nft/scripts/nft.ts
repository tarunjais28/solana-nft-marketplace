import * as anchor from "@coral-xyz/anchor";
import { getProvider, nftProgramInterface } from "./solanaService";
import { Nft } from "../target/types/nft";
import { Program } from "@coral-xyz/anchor";
import {
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  getMultipleAccounts,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  AdminAddress,
  MAINTAINERS,
  TEST_BUFFER,
  TEST_NFT,
  MINT,
  COLLECTION,
  COLLECTION_COUNTER,
  COLLECTIONS,
  COLLECTION_BUFFER,
} from "./constant";
import * as fs from "fs";
import { PublicKey } from "@solana/web3.js";

const { provider }: any = getProvider();
if (!provider) throw new Error("Provider not available");
let program: any = new anchor.Program(
  nftProgramInterface,
  provider,
) as Program<Nft>;

const [pdaMaintainers] = anchor.web3.PublicKey.findProgramAddressSync(
  [MAINTAINERS],
  program.programId,
);

const [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
  [MINT, COLLECTION_BUFFER, TEST_BUFFER],
  program.programId,
);

const [pdaNftCounter] = anchor.web3.PublicKey.findProgramAddressSync(
  [COLLECTION_COUNTER],
  program.programId,
);

const [pdaCollection] = anchor.web3.PublicKey.findProgramAddressSync(
  [COLLECTIONS, COLLECTION_BUFFER],
  program.programId,
);

const addSubAdmins = async () => {
  await program.methods
    .addSubAdminAccounts([
      new PublicKey("ArZEdFt7rq9Eoc1T4DoppEYh9vrdBHgLATxsFKRytfxr"),
    ])
    .accounts({
      maintainers: pdaMaintainers,
      authority: AdminAddress,
    })
    .rpc();
};

const initNftProgram = async () => {
  await program.methods
    .init()
    .accounts({
      maintainers: pdaMaintainers,
      nft_counter: pdaNftCounter,
      authority: AdminAddress,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
};

const fetchMaintainers = async () => {
  let maintainers = await program.account.maintainers.fetch(pdaMaintainers);
  console.log(maintainers.admin.toString());
  console.log(maintainers.subAdmins.toString());
};

const fetchNftsByCollection = async () => {
  let collections = await program.account.collections.fetch(pdaCollection);
  console.log(collections.nfts);
};

const fetchNftCounter = async () => {
  let nftCounter = await program.account.nftCounter.fetch(pdaNftCounter);
  console.log(Number(nftCounter.value));
};

const initCollection = async () => {
  await program.methods
    .initCollection(COLLECTION)
    .accounts({
      maintainers: pdaMaintainers,
      collections: pdaCollection,
      nftCounter: pdaNftCounter,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      payer: AdminAddress,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
};

const createNFT = async () => {
  let createNFTParams = {
    name: TEST_NFT,
    collection: COLLECTION,
    symbol: "tar",
    uri: "https://arweave.net/70u_lKabcp8A-jeguNq4M3oxuXzKjKWeomdSckcT_So",
    royalty: 1,
  };

  await program.methods
    .createNft(createNFTParams)
    .accounts({
      maintainers: pdaMaintainers,
      collections: pdaCollection,
      nftCounter: pdaNftCounter,
      mintAccount,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      payer: AdminAddress,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
};

const getNftBaseKeys = async () => {
  console.log("mint", mintAccount.toString());
  console.log("maintainers", pdaMaintainers.toString());
  console.log("collections", pdaCollection.toString());
  console.log("nft_counter", pdaNftCounter.toString());
};

const getNftByMint = async () => {
  let user = new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3");
  let userATAs = await provider.connection.getTokenAccountsByOwner(user, {
    programId: TOKEN_2022_PROGRAM_ID,
  });

  userATAs.value.forEach(async function (value) {
    let userAccount = await getAccount(
      provider.connection,
      value.pubkey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    if (userAccount.mint.toBase58() == mintAccount.toBase58()) {
      console.log(userAccount.address, userAccount.owner);
    }
  });
};

const fetchBalances = async () => {
  let user = new PublicKey("ArZEdFt7rq9Eoc1T4DoppEYh9vrdBHgLATxsFKRytfxr");
  let userATA = await getAssociatedTokenAddress(
    mintAccount,
    user,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  console.log("user: ", user.toString());
  console.log("ata: ", userATA.toString());

  let supply = (await provider.connection.getTokenSupply(mintAccount)).value
    .amount;

  let userAccountBalance = Number(
    (
      await getAccount(
        provider.connection,
        userATA,
        undefined,
        TOKEN_2022_PROGRAM_ID,
      )
    ).amount,
  );

  console.log("supply: ", supply);
  console.log("user balance: ", userAccountBalance);
};

const updateNftProgramAdmin = async (admin: PublicKey) => {
  await program.methods
    .manageAdmin(admin)
    .accounts({
      maintainers: pdaMaintainers,
      authority: AdminAddress,
    })
    .rpc();
};

const mintNFT = async () => {
  let user = new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3");

  const rawPayerKeypair = JSON.parse(
    fs.readFileSync("/home/tarunjais/.config/solana/id.json", "utf-8"),
  );
  const adminKey = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(rawPayerKeypair),
  );

  // Creating associated token for user for Test
  let userATA = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    adminKey,
    mintAccount,
    user,
    undefined,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  let tx = await program.methods
    .mint(COLLECTION, TEST_NFT)
    .accounts({
      maintainers: pdaMaintainers,
      mintAccount,
      toAccount: userATA.address,
      authority: AdminAddress,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .rpc();
  console.log(tx);
};

const getNFTs = async () => {
  let user = new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3");
  let nfts = await provider.connection.getTokenAccountsByOwner(user, {
    programId: TOKEN_2022_PROGRAM_ID,
  });
  console.log(nfts);
};

const burnNFT = async () => {
  // Creating associated token for user for Test
  let userATA = await getAssociatedTokenAddress(
    mintAccount,
    AdminAddress,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  let tx = await program.methods
    .burn(COLLECTION, TEST_NFT)
    .accounts({
      maintainers: pdaMaintainers,
      mintAccount,
      from: userATA,
      authority: AdminAddress,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .rpc();
  console.log(tx);
};

const transferNFT = async () => {
  let user = new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3");

  const rawPayerKeypair = JSON.parse(
    fs.readFileSync("/home/tarunjais/.config/solana/id.json", "utf-8"),
  );
  const adminKey = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(rawPayerKeypair),
  );

  // Creating associated token for user for Test
  let fromATA = await getAssociatedTokenAddress(
    mintAccount,
    user,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  let toATA = (
    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      adminKey,
      mintAccount,
      AdminAddress,
      undefined,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    )
  ).address;

  let tx = await program.methods
    .transfer(COLLECTION, TEST_NFT)
    .accounts({
      mintAccount,
      fromAccount: fromATA,
      toAccount: toATA,
      authority: AdminAddress,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
  console.log(tx);
};

export {
  fetchMaintainers,
  updateNftProgramAdmin,
  initNftProgram,
  initCollection,
  addSubAdmins,
  createNFT,
  mintNFT,
  burnNFT,
  fetchBalances,
  getNftBaseKeys,
  getNFTs,
  transferNFT,
  fetchNftCounter,
  fetchNftsByCollection,
  getNftByMint,
};
