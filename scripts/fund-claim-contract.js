// クレームコントラクトにMIRトークンを送信するスクリプト
const hre = require("hardhat");

async function main() {
  console.log("クレームコントラクトにMIRトークンを送信します...");

  // デプロイ用のアカウントを取得
  const [deployer] = await ethers.getSigners();
  console.log(`送信元アドレス: ${deployer.address}`);

  // コントラクトアドレス (実際のアドレスに置き換えてください)
  const mirTokenAddress = "0xd6F752fd03C00A673b5bE7f7E3028c269d1ba1d0";
  const MIR_CLAIM_CONTRACT_ADDRESS = "0x29048B068fA58a1cf104046D38ff49aa6E6fD399";
  
  console.log(`MIR Tokenアドレス: ${mirTokenAddress}`);
  console.log(`クレームコントラクトアドレス: ${MIR_CLAIM_CONTRACT_ADDRESS}`);

  // コントラクトインスタンスを取得
  const MIRToken = await ethers.getContractFactory("MIRToken");
  const mirToken = MIRToken.attach(mirTokenAddress);

  // 送信するトークン量 (100,000 MIR)
  const amount = ethers.parseEther("100000");
  console.log(`送信量: ${ethers.formatEther(amount)} MIR`);

  // トークン送信前の残高を確認
  const balanceBefore = await mirToken.balanceOf(MIR_CLAIM_CONTRACT_ADDRESS);
  console.log(`送信前のクレームコントラクト残高: ${ethers.formatEther(balanceBefore)} MIR`);

  // クレームコントラクトにトークンを送信
  console.log("トークンを送信中...");
  const tx = await mirToken.transfer(MIR_CLAIM_CONTRACT_ADDRESS, amount);
  await tx.wait();
  console.log(`トランザクション完了: ${tx.hash}`);

  // トークン送信後の残高を確認
  const balanceAfter = await mirToken.balanceOf(MIR_CLAIM_CONTRACT_ADDRESS);
  console.log(`送信後のクレームコントラクト残高: ${ethers.formatEther(balanceAfter)} MIR`);

  console.log("クレームコントラクトへのトークン送信が完了しました！");
}

// エラーハンドリング
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 