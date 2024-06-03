import { PublicKey } from "@solana/web3.js";

export const NFT_PROGRAM_ID: string =
  "9dDzq4c5y68STfWnRPVt1AD3SoDhJygRyUWvjiKnPmSj";

export const AdminAddress: PublicKey = new PublicKey(
  "FDFAEes1Tc4WbZeD6aJ25VHPUiUJVFDzUW3abiDRKmXD",
);

export const COLLECTION = "Collection";
export const COLLECTION_BUFFER = Buffer.from(COLLECTION);
export const TEST_NFT = "Test-2";
export const MINT = Buffer.from("mint");
export const MAINTAINERS = Buffer.from("maintainers");
export const COLLECTIONS = Buffer.from("collection");
export const COLLECTION_COUNTER = Buffer.from("counter");
export const TEST_BUFFER = Buffer.from(TEST_NFT);
