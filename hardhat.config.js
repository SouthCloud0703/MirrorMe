require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// プライベートキーを.envファイルから取得
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    // WorldChainメインネット設定 - PRIVATEキーが設定されている場合のみ有効
    ...(PRIVATE_KEY ? {
      worldchain: {
        url: RPC_URL, // WorldChainのRPCエンドポイント
        chainId: 480, // 実際のWorldChainのチェーンID
        accounts: [PRIVATE_KEY],
      },
      // WorldChainテストネット設定
      worldchainTestnet: {
        url: "https://testnet-rpc.worldchain.io", // テストネットRPCエンドポイント
        chainId: 11735, // テストネットチェーンID（この値は実際のテストネットのチェーンIDに合わせて変更してください）
        accounts: [PRIVATE_KEY],
      }
    } : {}),
    // ローカル開発用
    hardhat: {
      chainId: 31337,
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
  }
}; 