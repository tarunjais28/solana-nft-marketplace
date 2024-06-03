import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { BN } from "bn.js";
import { assert } from "chai";
import { Nft } from "../target/types/nft";
import { it } from "node:test";

// Create test keypairs
const admin = anchor.web3.Keypair.generate();
const payer = anchor.web3.Keypair.generate();
const user1 = anchor.web3.Keypair.generate();
const user2 = anchor.web3.Keypair.generate();
const vault = anchor.web3.Keypair.generate();
const mintAuthority = anchor.web3.Keypair.generate();

// Create constant amount fields
const MINT_AMOUNT = new BN(1);
const BURN_AMOUNT = new BN(1);

// Constant seeds
const COLLECTION = "Collection";
const COLLECTION_1 = "Collection-1";
const COLLECTION_2 = "Collection-2";
const COLLECTION_BUFFER = Buffer.from(COLLECTION);
const COLLECTION_1_BUFFER = Buffer.from(COLLECTION_1);
const COLLECTION_2_BUFFER = Buffer.from(COLLECTION_2);
const TEST_NFT = "Test";
const TEST_1_NFT = "Test-1";
const TEST_2_NFT = "Test-2";
const MINT = Buffer.from("mint");
const MAINTAINERS = Buffer.from("maintainers");
const COLLECTIONS = Buffer.from("collection");
const COLLECTION_COUNTER = Buffer.from("counter");
const TEST_BUFFER = Buffer.from(TEST_NFT);
const TEST_1_BUFFER = Buffer.from(TEST_1_NFT);
const TEST_2_BUFFER = Buffer.from(TEST_2_NFT);

describe("token_program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Nft as Program<Nft>;

  // Declare PDAs
  let pdaMaintainers,
    pdaCollection,
    pdaNftCounter,
    mintAccount = null;

  const confirmTransaction = async (tx) => {
    const latestBlockHash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    });
  };

  const initCollection = async (collectionName) => {
    let initCollection = await program.methods
      .initCollection(collectionName)
      .accounts({
        maintainers: pdaMaintainers,
        collections: pdaCollection,
        nftCounter: pdaNftCounter,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        payer: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(initCollection);
  };

  const createNFT = async (createTokenParams) => {
    // Test create_token instruction
    let createNft = await program.methods
      .createNft(createTokenParams)
      .accounts({
        maintainers: pdaMaintainers,
        collections: pdaCollection,
        nftCounter: pdaNftCounter,
        mintAccount,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        payer: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(createNft);
  };

  const mint = async (collectionName, nftName, user1ATA) => {
    // Test mint_token instruction
    let mintNFT = await program.methods
      .mint(collectionName, nftName)
      .accounts({
        maintainers: pdaMaintainers,
        mintAccount,
        toAccount: user1ATA,
        authority: user1.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    await confirmTransaction(mintNFT);
  };

  const burn = async (collectionName, nftName, user1ATA) => {
    // Test burn_nft instruction
    let burnNFT = await program.methods
      .burn(collectionName, nftName)
      .accounts({
        maintainers: pdaMaintainers,
        mintAccount,
        from: user1ATA,
        authority: user1.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([user1])
      .rpc();

    await confirmTransaction(burnNFT);
  };

  const transfer = async (collectionName, nftName, fromATA, toATA) => {
    // Test transfer token instruction
    let transferNFT = await program.methods
      .transfer(collectionName, nftName)
      .accounts({
        mintAccount,
        fromAta: fromATA,
        toAta: toATA,
        toAccount: user2.publicKey,
        authority: user1.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    await confirmTransaction(transferNFT);
  };

  it("Initialize test accounts", async () => {
    // Airdrop sol to the test users
    let adminSol = await provider.connection.requestAirdrop(
      admin.publicKey,
      anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(adminSol);

    let payerSol = await provider.connection.requestAirdrop(
      payer.publicKey,
      anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(payerSol);

    let user1Sol = await provider.connection.requestAirdrop(
      user1.publicKey,
      1000 * anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(user1Sol);

    let user2Sol = await provider.connection.requestAirdrop(
      user2.publicKey,
      anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(user2Sol);

    let mintAuthoritySol = await provider.connection.requestAirdrop(
      mintAuthority.publicKey,
      anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(mintAuthoritySol);

    let vaultSol = await provider.connection.requestAirdrop(
      vault.publicKey,
      anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(vaultSol);
  });

  it("Initialize global account", async () => {
    [pdaMaintainers] = anchor.web3.PublicKey.findProgramAddressSync(
      [MAINTAINERS],
      program.programId,
    );

    [pdaNftCounter] = anchor.web3.PublicKey.findProgramAddressSync(
      [COLLECTION_COUNTER],
      program.programId,
    );

    // Test initialize instruction
    let init = await program.methods
      .init()
      .accounts({
        maintainers: pdaMaintainers,
        nft_counter: pdaNftCounter,
        authority: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(init);

    let maintainers = await program.account.maintainers.fetch(pdaMaintainers);
    assert.equal(maintainers.admin.toString(), admin.publicKey.toString());
    assert.isTrue(
      JSON.stringify(maintainers.subAdmins).includes(
        JSON.stringify(admin.publicKey),
      ),
    );

    let nftCounter = await program.account.nftCounter.fetch(pdaNftCounter);
    assert.equal(Number(nftCounter.value), 0);
  });

  it("Test Init Collections", async () => {
    [pdaCollection] = anchor.web3.PublicKey.findProgramAddressSync(
      [COLLECTIONS, COLLECTION_BUFFER],
      program.programId,
    );
    await initCollection(COLLECTION);

    let collections = await program.account.collections.fetch(pdaCollection);
    assert.equal(collections.nfts.length, 0);

    [pdaCollection] = anchor.web3.PublicKey.findProgramAddressSync(
      [COLLECTIONS, COLLECTION_1_BUFFER],
      program.programId,
    );
    await initCollection(COLLECTION_1);

    collections = await program.account.collections.fetch(pdaCollection);
    assert.equal(collections.nfts.length, 0);

    [pdaCollection] = anchor.web3.PublicKey.findProgramAddressSync(
      [COLLECTIONS, COLLECTION_2_BUFFER],
      program.programId,
    );
    await initCollection(COLLECTION_2);

    collections = await program.account.collections.fetch(pdaCollection);
    assert.equal(collections.nfts.length, 0);
  });

  it("Test Create NFT", async () => {
    [pdaCollection] = anchor.web3.PublicKey.findProgramAddressSync(
      [COLLECTIONS, COLLECTION_BUFFER],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, COLLECTION_BUFFER, TEST_BUFFER],
      program.programId,
    );

    let createTokenParams = {
      name: TEST_NFT,
      collection: COLLECTION,
      symbol: "tes",
      uri: "https://arweave.net/dEGah51x5Dlvbfcl8UUGz52KovgWh6QmrYIW48hi244?ext=png",
      royalty: 1,
    };

    await createNFT(createTokenParams);

    let nftCounter = await program.account.nftCounter.fetch(pdaNftCounter);
    assert.equal(Number(nftCounter.value), 1);

    let collections = await program.account.collections.fetch(pdaCollection);
    assert.equal(collections.nfts.length, 1);
    assert.isTrue(
      JSON.stringify(collections.nfts).includes(JSON.stringify(mintAccount)),
    );

    // Creating another token
    createTokenParams = {
      name: TEST_1_NFT,
      collection: COLLECTION_1,
      symbol: "tes",
      uri: "https://arweave.net/dEGah51x5Dlvbfcl8UUGz52KovgWh6QmrYIW48hi244?ext=png",
      royalty: 1,
    };

    [pdaCollection] = anchor.web3.PublicKey.findProgramAddressSync(
      [COLLECTIONS, COLLECTION_1_BUFFER],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, COLLECTION_1_BUFFER, TEST_1_BUFFER],
      program.programId,
    );

    await createNFT(createTokenParams);

    nftCounter = await program.account.nftCounter.fetch(pdaNftCounter);
    assert.equal(Number(nftCounter.value), 2);

    collections = await program.account.collections.fetch(pdaCollection);
    assert.equal(collections.nfts.length, 1);
    assert.isTrue(
      JSON.stringify(collections.nfts).includes(JSON.stringify(mintAccount)),
    );
  });

  it("Test Mint NFT", async () => {
    [pdaCollection] = anchor.web3.PublicKey.findProgramAddressSync(
      [COLLECTIONS, COLLECTION_BUFFER],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, COLLECTION_BUFFER, TEST_BUFFER],
      program.programId,
    );

    // Creating associated token for user1 for Test
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    await mint(COLLECTION, TEST_NFT, user1ATA);

    // Check balance after mint
    let supply = await provider.connection.getTokenSupply(mintAccount);
    assert.equal(Number(supply.value.amount), Number(MINT_AMOUNT));

    let user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(Number(user1Account.amount), Number(MINT_AMOUNT));

    // Minting Token Test-1
    [pdaCollection] = anchor.web3.PublicKey.findProgramAddressSync(
      [COLLECTIONS, COLLECTION_1_BUFFER],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, COLLECTION_1_BUFFER, TEST_1_BUFFER],
      program.programId,
    );

    // Creating associated token for user1 for Test-1
    user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    await mint(COLLECTION_1, TEST_1_NFT, user1ATA);

    // Check balance after mint
    supply = await provider.connection.getTokenSupply(mintAccount);
    assert.equal(Number(supply.value.amount), Number(MINT_AMOUNT));

    user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(Number(user1Account.amount), Number(MINT_AMOUNT));
  });

  it("Test Get NFTs", async () => {
    let nfts = await provider.connection.getTokenAccountsByOwner(
      user1.publicKey,
      { programId: TOKEN_2022_PROGRAM_ID },
    );
    console.log(nfts);

    let accounts = await provider.connection.getProgramAccounts(
      program.programId,
    );
    console.log(accounts);
  });

  it("Test Burn Token", async () => {
    [pdaCollection] = anchor.web3.PublicKey.findProgramAddressSync(
      [COLLECTIONS, COLLECTION_BUFFER],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, COLLECTION_BUFFER, TEST_BUFFER],
      program.programId,
    );

    // Creating associated token for user1 and Test
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    await burn(COLLECTION, TEST_NFT, user1ATA);

    // Check balance after mint
    let user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    assert.equal(
      Number(user1Account.amount),
      Number(MINT_AMOUNT) - Number(BURN_AMOUNT),
    );
    let supply = await provider.connection.getTokenSupply(mintAccount);
    assert.equal(
      Number(supply.value.amount),
      Number(MINT_AMOUNT) - Number(BURN_AMOUNT),
    );

    // Burning Token Test-1
    [pdaCollection] = anchor.web3.PublicKey.findProgramAddressSync(
      [COLLECTIONS, COLLECTION_1_BUFFER],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, COLLECTION_1_BUFFER, TEST_1_BUFFER],
      program.programId,
    );

    // Creating associated token for user1 and Test-1
    user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    await burn(COLLECTION_1, TEST_1_NFT, user1ATA);

    // Check balance after mint
    user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(
      Number(user1Account.amount),
      Number(MINT_AMOUNT) - Number(BURN_AMOUNT),
    );
    supply = await provider.connection.getTokenSupply(mintAccount);
    assert.equal(
      Number(supply.value.amount),
      Number(MINT_AMOUNT) - Number(BURN_AMOUNT),
    );
  });

  it("Test Transfer Token", async () => {
    [pdaCollection] = anchor.web3.PublicKey.findProgramAddressSync(
      [COLLECTIONS, COLLECTION_2_BUFFER],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, COLLECTION_2_BUFFER, TEST_2_BUFFER],
      program.programId,
    );

    let createTokenParams = {
      name: TEST_2_NFT,
      collection: COLLECTION_2,
      symbol: "tes",
      uri: "https://arweave.net/dEGah51x5Dlvbfcl8UUGz52KovgWh6QmrYIW48hi244?ext=png",
      royalty: 1,
    };

    await createNFT(createTokenParams);

    let nftCounter = await program.account.nftCounter.fetch(pdaNftCounter);
    assert.equal(Number(nftCounter.value), 3);

    let collections = await program.account.collections.fetch(pdaCollection);
    assert.equal(collections.nfts.length, 1);
    assert.isTrue(
      JSON.stringify(collections.nfts).includes(JSON.stringify(mintAccount)),
    );

    // Creating associated token for user1 and Test-2
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    await mint(COLLECTION_2, TEST_2_NFT, user1ATA);

    let user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(Number(user1Account.amount), 1);

    let user2ATA = await getAssociatedTokenAddress(
      mintAccount,
      user2.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    await transfer(COLLECTION_2, TEST_2_NFT, user1ATA, user2ATA);

    user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(Number(user1Account.amount), 0);

    let user2Account = await getAccount(
      provider.connection,
      user2ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(Number(user2Account.amount), 1);
  });

  it("Test Update Admin", async () => {
    let oldAdmin = (await program.account.maintainers.fetch(pdaMaintainers))
      .admin;
    assert.equal(oldAdmin.toString(), admin.publicKey.toString());

    let updateAdmin = await program.methods
      .manageAdmin(user1.publicKey)
      .accounts({
        maintainers: pdaMaintainers,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(updateAdmin);

    let newAdmin = (await program.account.maintainers.fetch(pdaMaintainers))
      .admin;
    assert.equal(newAdmin.toString(), user1.publicKey.toString());

    updateAdmin = await program.methods
      .manageAdmin(admin.publicKey)
      .accounts({
        maintainers: pdaMaintainers,
        authority: user1.publicKey,
      })
      .signers([user1])
      .rpc();

    await confirmTransaction(updateAdmin);
    newAdmin = (await program.account.maintainers.fetch(pdaMaintainers)).admin;
    assert.equal(oldAdmin.toString(), admin.publicKey.toString());
  });

  it("Test Add Sub Admins", async () => {
    let addSubAdmins = await program.methods
      .addSubAdminAccounts([user1.publicKey])
      .accounts({
        maintainers: pdaMaintainers,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(addSubAdmins);

    let maintainers = await program.account.maintainers.fetch(pdaMaintainers);
    assert.isTrue(
      JSON.stringify(maintainers.subAdmins).includes(
        JSON.stringify(user1.publicKey),
      ),
    );
  });

  it("Test Remove Sub Admins", async () => {
    let removeSubAdmins = await program.methods
      .removeSubAdminAccounts([user1.publicKey])
      .accounts({
        maintainers: pdaMaintainers,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(removeSubAdmins);

    let maintainers = await program.account.maintainers.fetch(pdaMaintainers);
    assert.isFalse(
      JSON.stringify(maintainers.subAdmins).includes(
        JSON.stringify(user1.publicKey),
      ),
    );
  });
});
