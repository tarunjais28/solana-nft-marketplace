import {
  initNftProgram,
  createNFT,
  mintNFT,
  burnNFT,
  getNFTs,
  transferNFT,
  initCollection,
  getNftBaseKeys,
  fetchNftCounter,
  fetchNftsByCollection,
  getNftByMint,
} from "./nft";

const callTheFunction = async () => {
  console.log("Triggering functions , please wait !");
  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // await initNftProgram();
  // await initCollection();
  // await createNFT();
  // await getNftBaseKeys();
  // await mintNFT();
  // await burnNFT();
  // await transferNFT();
  // await getNFTs();
  // await fetchNftCounter();
  // await fetchNftsByCollection();
  await getNftByMint();

  console.log("Functions Triggered, success !");
  console.log("sent =>>>>>>>>");
  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
};

callTheFunction();

// npm start run
