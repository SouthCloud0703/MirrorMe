// MIR Tokenをデプロイするスクリプト
const hre = require("hardhat");

async function main() {
  console.log("MIR Tokenのデプロイを開始します...");

  // デプロイ用のアカウントを取得
  const [deployer] = await ethers.getSigners();
  console.log(`デプロイアドレス: ${deployer.address}`);

  // コントラクトをデプロイ
  const MIRToken = await ethers.getContractFactory("MIRToken");
  const mirToken = await MIRToken.deploy(deployer.address);

  await mirToken.waitForDeployment();
  const mirTokenAddress = await mirToken.getAddress();

  console.log(`MIR Tokenがデプロイされました！アドレス: ${mirTokenAddress}`);
  console.log("デプロイ完了！");
}

// エラーハンドリング
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 