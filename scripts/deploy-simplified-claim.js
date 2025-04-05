// 簡略化されたMIR Token Claimコントラクトをデプロイするスクリプト
const hre = require("hardhat");

async function main() {
  console.log("簡略化されたMIR Token Claimコントラクトのデプロイを開始します...");

  // デプロイ用のアカウントを取得
  const [deployer] = await ethers.getSigners();
  console.log(`デプロイアドレス: ${deployer.address}`);

  // すでにデプロイされているMIRトークンのアドレス
  const mirTokenAddress = "0xd6F752fd03C00A673b5bE7f7E3028c269d1ba1d0"; // 実際のMIRトークンアドレス
  console.log(`MIR Tokenアドレス: ${mirTokenAddress}`);

  // MIRTokenClaimコントラクトをデプロイ
  const MIRTokenClaim = await ethers.getContractFactory("MIRTokenClaim");
  const mirTokenClaim = await MIRTokenClaim.deploy(mirTokenAddress, deployer.address);

  await mirTokenClaim.waitForDeployment();
  const mirTokenClaimAddress = await mirTokenClaim.getAddress();

  console.log(`簡略化されたMIR Token Claimコントラクトがデプロイされました！アドレス: ${mirTokenClaimAddress}`);

  console.log("コントラクトにトークンを送信するには、MIRトークンの所有者が以下の手順を実行してください：");
  console.log(`1. MIRトークンコントラクトのapprove関数を呼び出し、${mirTokenClaimAddress}に対して必要な量のトークンを承認する`);
  console.log(`2. 承認後、トークンをクレームコントラクトに送信する`);
  
  console.log("デプロイ完了！");
  console.log("注意: このコントラクトはMVP用に簡略化されており、クールダウン制限なしで常にクレーム可能です。");
}

// エラーハンドリング
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 