import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './TokenClaim.css';

// ABIはコンパイル後のJSONファイルから抽出（完全なABI）
const mirTokenClaimAbi = [
  "function claimTokens(uint256 _level) external returns (bool)",
  "function canClaim(address _user) external view returns (bool)",
  "function nextClaimTime(address _user) external view returns (uint256)",
  "function calculateClaimAmount(uint256 _level) external view returns (uint256)",
  "function claimInfo(address) external view returns (uint256 lastClaimTime, uint256 totalClaimed)",
  "function levelClaimLimit(uint256) external view returns (uint256)",
  "function claimCooldown() external view returns (uint256)",
  "function baseClaimAmount() external view returns (uint256)",
  "function claimEnabled() external view returns (bool)"
];

// MIRトークン用のABI
const mirTokenAbi = [
  "function balanceOf(address account) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)"
];

const TokenClaim = () => {
  // コントラクトアドレス
  const claimContractAddress = "0xEb5773a0f57883b0cCC5585b5b32852995dc3FA8";
  const mirTokenAddress = "0xd6F752fd03C00A673b5bE7f7E3028c269d1ba1d0"; // MIRトークンアドレス
  
  // ステート
  const [userAccount, setUserAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [mirTokenContract, setMirTokenContract] = useState(null); // MIRトークンコントラクト
  const [userLevel, setUserLevel] = useState(1);
  const [claimAmount, setClaimAmount] = useState('0');
  const [canClaimTokens, setCanClaimTokens] = useState(false);
  const [nextClaimTimestamp, setNextClaimTimestamp] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [networkId, setNetworkId] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [mirBalance, setMirBalance] = useState('0'); // MIRトークン残高
  
  // 認証状態とウォレット接続状態
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  // 必要なネットワークID（WorldChain）
  const requiredNetworkId = 480;

  // アプリケーションステートのリセット
  const resetAppState = () => {
    // ウォレット接続状態をリセット
    setUserAccount('');
    setProvider(null);
    setSigner(null);
    setContract(null);
    setMirTokenContract(null);
    setNetworkId(null);
    
    // データ表示をリセット
    setMirBalance('0');
    setClaimAmount('0');
    setCanClaimTokens(false);
    setNextClaimTimestamp(0);
    
    // メッセージをリセット
    setError('');
    setSuccess('アプリケーションの状態をリセットしました');
    setDebugInfo('アプリケーションの状態をリセットしました');
    
    // 認証状態とウォレット接続状態をリセット
    setIsAuthenticated(false);
    setIsWalletConnected(false);
    
    // ローカルストレージもクリア（もし使用している場合）
    try {
      localStorage.removeItem('mirTokenClaimUserData');
      localStorage.removeItem('mirTokenClaimState');
    } catch (e) {
      console.error('ローカルストレージのクリアに失敗しました', e);
    }
    
    // イベントリスナーの削除（メモリリーク防止）
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  };

  // WorldアプリのMiniKitが利用可能かチェック
  useEffect(() => {
    const checkMiniKitAvailability = async () => {
      if (window.MiniKit) {
        setIsMiniApp(true);
        setDebugInfo('World MiniKitが検出されました');
        
        // 自動的にウォレット接続を試行
        if (!userAccount) {
          await connectWithMiniKit();
        }
      } else {
        setIsMiniApp(false);
        setDebugInfo('World MiniKitは利用できません。通常のWeb3モードで動作します。');
      }
    };

    checkMiniKitAvailability();
  }, []);

  // World MiniKitを使用したウォレット認証 - 簡素化バージョン
  const connectWithMiniKit = async () => {
    try {
      setError('');
      setSuccess('');
      setDebugInfo('World MiniKitでウォレット認証を試みています...');
      
      // 認証状態を更新
      setIsAuthenticated(false);
      setIsWalletConnected(false);
      
      if (!window.MiniKit) {
        setError('World MiniKitが見つかりません');
        return;
      }
      
      try {
        // 簡素化されたWallet Auth - アドレスのみを取得
        const { finalPayload } = await window.MiniKit.commandsAsync.walletAuth({});
        
        setDebugInfo(prev => `${prev}\nウォレット認証レスポンス: ${JSON.stringify(finalPayload)}`);
        
        if (finalPayload.status === 'error') {
          setError(`認証エラー: ${finalPayload.error?.message || '不明なエラー'}`);
          return;
        }
        
        // 認証成功
        setIsAuthenticated(true);
        
        // 認証成功後、ウォレットアドレスを取得
        const walletAddress = finalPayload.address;
        if (!walletAddress) {
          setError('ウォレットアドレスの取得に失敗しました');
          return;
        }
        
        setUserAccount(walletAddress);
        setIsWalletConnected(true);
        setDebugInfo(prev => `${prev}\nウォレットアドレス取得成功: ${walletAddress}`);
        
        // プロバイダとコントラクトのセットアップ
        await setupProviderAndContract(walletAddress);
        
      } catch (authError) {
        console.error('MiniKit認証エラー:', authError);
        setError(`ウォレット認証中にエラーが発生しました: ${authError.message || JSON.stringify(authError)}`);
        setDebugInfo(prev => `${prev}\n認証エラー: ${authError.message || JSON.stringify(authError)}`);
      }
    } catch (err) {
      console.error(err);
      setError(`MiniKit接続中にエラーが発生しました: ${err.message}`);
      setDebugInfo(prev => `${prev}\n接続エラー: ${err.message}\n${err.stack}`);
    }
  };
  
  // プロバイダとコントラクトの設定
  const setupProviderAndContract = async (address) => {
    try {
      setDebugInfo(prev => `${prev}\nプロバイダとコントラクトをセットアップ中...`);
      
      // World Chainへの接続
      const worldChainRpcUrl = "https://worldchain-mainnet.g.alchemy.com/v2/MnQ8dUniBLMABxOq-QQjFJB4rVr2Zq73";
      const newProvider = new ethers.JsonRpcProvider(worldChainRpcUrl);
      setProvider(newProvider);
      setNetworkId(480); // WorldChain ID
      
      // 擬似Signerを作成
      const customSigner = new ethers.AbstractSigner(newProvider);
      
      // カスタムSignerのアドレスを設定
      customSigner.getAddress = async () => {
        return address;
      };
      
      // トランザクション送信機能をオーバーライド
      customSigner.sendTransaction = async (tx) => {
        try {
          setDebugInfo(prev => `${prev}\nトランザクション送信を準備中...`);
          
          // トランザクションデータの準備
          const transaction = [{
            address: tx.to,
            abi: mirTokenClaimAbi,
            functionName: 'claimTokens',
            args: [userLevel]
          }];
          
          setDebugInfo(prev => `${prev}\nsendTransaction コマンドを実行: ${JSON.stringify(transaction)}`);
          
          // MiniKit sendTransaction コマンドを実行
          const { finalPayload } = await window.MiniKit.commandsAsync.sendTransaction({
            transaction: transaction
          });
          
          if (finalPayload.status === 'error') {
            throw new Error(finalPayload.error?.message || 'トランザクション送信エラー');
          }
          
          const txId = finalPayload.transaction_id;
          setDebugInfo(prev => `${prev}\nトランザクションID: ${txId}`);
          
          // トランザクションオブジェクトを返す
          return {
            hash: txId,
            wait: async () => {
              setDebugInfo(prev => `${prev}\nトランザクション完了を待機中...`);
              
              // 簡易版: トランザクション完了を仮定
              setDebugInfo(prev => `${prev}\nトランザクション完了とみなします`);
              
              // トランザクションレシートの代わり
              return {
                status: 1,
                transactionHash: txId
              };
            }
          };
        } catch (txError) {
          setDebugInfo(prev => `${prev}\nトランザクション送信エラー: ${txError.message}`);
          throw txError;
        }
      };
      
      setSigner(customSigner);
      
      // クレームコントラクトインスタンスの作成
      const newContract = new ethers.Contract(claimContractAddress, mirTokenClaimAbi, customSigner);
      setContract(newContract);
      setDebugInfo(prev => `${prev}\nクレームコントラクトインスタンス作成完了`);
      
      // MIRトークンコントラクトインスタンスの作成
      const newMirTokenContract = new ethers.Contract(mirTokenAddress, mirTokenAbi, customSigner);
      setMirTokenContract(newMirTokenContract);
      setDebugInfo(prev => `${prev}\nMIRトークンコントラクトインスタンス作成完了`);
      
      // コントラクト機能テスト
      try {
        const baseAmount = await newContract.baseClaimAmount();
        setDebugInfo(prev => `${prev}\nコントラクトテスト成功: baseAmount=${ethers.formatEther(baseAmount)} MIR`);
        
        // MIRトークン残高を取得
        await updateMirBalance(address, newMirTokenContract);
        
      } catch (testError) {
        setError(`コントラクト接続テストに失敗しました: ${testError.message}`);
        setDebugInfo(prev => `${prev}\nコントラクトテストエラー: ${testError.message}`);
        return;
      }
    } catch (setupError) {
      console.error('セットアップエラー:', setupError);
      setError(`プロバイダとコントラクトのセットアップ中にエラーが発生しました: ${setupError.message}`);
      setDebugInfo(prev => `${prev}\nセットアップエラー: ${setupError.message}`);
    }
  };
  
  // MIRトークン残高の更新
  const updateMirBalance = async (address, tokenContract) => {
    try {
      if (!tokenContract) {
        tokenContract = mirTokenContract;
      }
      
      if (tokenContract) {
        setDebugInfo(prev => `${prev}\nMIRトークン残高を取得中...`);
        const balance = await tokenContract.balanceOf(address);
        setMirBalance(ethers.formatEther(balance));
        setDebugInfo(prev => `${prev}\nMIRトークン残高: ${ethers.formatEther(balance)} MIR`);
      }
    } catch (err) {
      console.error('残高取得エラー:', err);
      setDebugInfo(prev => `${prev}\n残高取得エラー: ${err.message}`);
    }
  };
  
  // 標準Web3用のウォレット接続（通常のブラウザ用）
  const connectWallet = async () => {
    // MiniApp環境ではこの関数は使用しないため、早期リターン
    if (isMiniApp) {
      setDebugInfo('World MiniApp環境では標準Web3接続は使用できません');
      connectWithMiniKit();
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setDebugInfo('ウォレット接続を試みています...');
      
      // 認証状態を更新
      setIsAuthenticated(false);
      setIsWalletConnected(false);
      
      if (window.ethereum) {
        // チェーンIDを取得
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const decimalChainId = parseInt(chainId, 16);
        setNetworkId(decimalChainId);
        setDebugInfo(prev => `${prev}\n現在のネットワークID: ${decimalChainId}`);
        
        // 正しいネットワークに接続されているか確認
        if (decimalChainId !== requiredNetworkId) {
          setError(`WorldChainネットワーク(ID: ${requiredNetworkId})に接続してください。現在のネットワークID: ${decimalChainId}`);
          
          // ネットワーク切り替えを試みる
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${requiredNetworkId.toString(16)}` }],
            });
            setDebugInfo(prev => `${prev}\nネットワークの切り替えを要求しました`);
          } catch (switchError) {
            // ネットワークが見つからない場合、追加を要求
            if (switchError.code === 4902) {
              setError(`WorldChainネットワークがウォレットに追加されていません。手動で追加してください。`);
            }
            setDebugInfo(prev => `${prev}\nネットワーク切り替えエラー: ${switchError.message}`);
            return;
          }
        }
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setUserAccount(account);
        setIsAuthenticated(true);
        setIsWalletConnected(true);
        setDebugInfo(prev => `${prev}\nアカウント接続成功: ${account}`);
        
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
        
        const newSigner = await newProvider.getSigner();
        setSigner(newSigner);
        setDebugInfo(prev => `${prev}\nSignerの取得に成功しました`);
        
        // クレームコントラクトの作成
        const newContract = new ethers.Contract(claimContractAddress, mirTokenClaimAbi, newSigner);
        setContract(newContract);
        setDebugInfo(prev => `${prev}\nクレームコントラクトインスタンス作成完了`);
        
        // MIRトークンコントラクトの作成
        const newMirTokenContract = new ethers.Contract(mirTokenAddress, mirTokenAbi, newSigner);
        setMirTokenContract(newMirTokenContract);
        setDebugInfo(prev => `${prev}\nMIRトークンコントラクトインスタンス作成完了`);
        
        // コントラクトが有効かテスト
        try {
          const enabled = await newContract.claimEnabled();
          setDebugInfo(prev => `${prev}\nコントラクト接続テスト成功、クレーム機能は${enabled ? '有効' : '無効'}です`);
          
          // MIRトークン残高を取得
          await updateMirBalance(account, newMirTokenContract);
          
        } catch (contractError) {
          setError(`コントラクトへの接続に失敗しました: ${contractError.message}`);
          setDebugInfo(prev => `${prev}\nコントラクト接続テストエラー: ${contractError.message}`);
          return;
        }
        
        // アカウント変更イベントを監視
        window.ethereum.on('accountsChanged', async (accounts) => {
          if (accounts.length === 0) {
            // ウォレット接続解除
            setUserAccount('');
            setMirBalance('0');
            setIsWalletConnected(false);
            setDebugInfo('ウォレット接続が解除されました');
          } else {
            setUserAccount(accounts[0]);
            setIsWalletConnected(true);
            setDebugInfo(`アカウントが切り替わりました: ${accounts[0]}`);
            
            // 新しいアカウントのMIR残高を取得
            if (mirTokenContract) {
              await updateMirBalance(accounts[0]);
            }
          }
        });
        
        // ネットワーク変更イベントを監視
        window.ethereum.on('chainChanged', (chainId) => {
          const decimalChainId = parseInt(chainId, 16);
          setNetworkId(decimalChainId);
          setDebugInfo(`ネットワークが切り替わりました: ${decimalChainId}`);
          
          if (decimalChainId !== requiredNetworkId) {
            setError(`WorldChainネットワーク(ID: ${requiredNetworkId})に接続してください。現在のネットワークID: ${decimalChainId}`);
          } else {
            setError('');
            
            // ネットワーク変更後にMIR残高を再取得
            if (userAccount && mirTokenContract) {
              updateMirBalance(userAccount);
            }
          }
        });
      } else {
        setError('MetaMaskまたは他のWeb3プロバイダーをインストールしてください');
        setDebugInfo('Web3プロバイダーが見つかりません');
      }
    } catch (err) {
      console.error(err);
      setError(`ウォレット接続中にエラーが発生しました: ${err.message}`);
      setDebugInfo(prev => `${prev}\n接続エラー: ${err.message}\n${err.stack}`);
    }
  };
  
  // クレーム可能かどうかを確認
  const checkClaimStatus = async () => {
    if (contract && userAccount) {
      try {
        setDebugInfo('クレームステータスを確認中...');
        
        // クレーム可能かどうかを確認
        const canClaimResult = await contract.canClaim(userAccount);
        setCanClaimTokens(canClaimResult);
        setDebugInfo(prev => `${prev}\nクレーム可能: ${canClaimResult}`);
        
        // 次回クレーム可能時間を取得
        const nextTime = await contract.nextClaimTime(userAccount);
        setNextClaimTimestamp(Number(nextTime));
        setDebugInfo(prev => `${prev}\n次回クレーム可能時間: ${new Date(Number(nextTime) * 1000).toLocaleString()}`);
        
        // クレーム量を計算
        const amount = await contract.calculateClaimAmount(userLevel);
        setClaimAmount(ethers.formatEther(amount));
        setDebugInfo(prev => `${prev}\nクレーム可能量: ${ethers.formatEther(amount)} MIR`);
        
        // 追加情報を取得
        const claimCooldownTime = await contract.claimCooldown();
        setDebugInfo(prev => `${prev}\nクールダウン期間: ${Number(claimCooldownTime)} 秒`);
        
        const baseAmount = await contract.baseClaimAmount();
        setDebugInfo(prev => `${prev}\n基本クレーム量: ${ethers.formatEther(baseAmount)} MIR`);
        
      } catch (err) {
        console.error(err);
        setError(`クレームステータスの確認中にエラーが発生しました: ${err.message}`);
        setDebugInfo(prev => `${prev}\nステータス確認エラー: ${err.message}\n${err.stack}`);
      }
    }
  };
  
  // ウォレット接続時とレベル変更時にクレームステータスをチェック
  useEffect(() => {
    if (contract && userAccount) {
      checkClaimStatus();
    }
  }, [contract, userAccount, userLevel]);
  
  // ダミークレームボタン - ウォレット未接続時に直接表示するためのもの
  const handleGuestClaim = () => {
    setDebugInfo('ウォレット未接続状態でクレームボタンが押されました');
    setError('ウォレットが接続されていません。');
    handleConnect();
  };

  // トークンをクレーム
  const claimTokens = async () => {
    // この関数はウォレット接続済み時のみ呼ばれるようになるため、
    // 未接続時の処理は handleGuestClaim で実行
    if (!userAccount) {
      setError('ウォレットが接続されていません。');
      handleConnect();
      return;
    }
    
    if (contract && userAccount) {
      try {
        setIsLoading(true);
        setError('');
        setSuccess('');
        setDebugInfo('トークンクレームを開始します...');
        
        // ネットワークIDを確認（MiniAppの場合はスキップ）
        if (!isMiniApp && networkId !== requiredNetworkId) {
          setError(`WorldChainネットワーク(ID: ${requiredNetworkId})に接続してください。現在のネットワークID: ${networkId}`);
          setDebugInfo(prev => `${prev}\nネットワークIDが不一致: 必要=${requiredNetworkId}, 現在=${networkId}`);
          setIsLoading(false);
          return;
        }
        
        // クレームが可能か再確認
        const canClaimNow = await contract.canClaim(userAccount);
        if (!canClaimNow) {
          setError('現在クレームはできません。クールダウン期間が終了するまでお待ちください。');
          setDebugInfo(prev => `${prev}\nクレーム不可: クールダウン期間中`);
          setIsLoading(false);
          return;
        }
        
        setDebugInfo(prev => `${prev}\nトランザクション送信準備完了...`);
        
        // トークンをクレーム
        let tx;
        try {
          tx = await contract.claimTokens(userLevel);
          setDebugInfo(prev => `${prev}\nトランザクション送信完了: ${tx.hash || 'ハッシュなし'}`);
        } catch (sendError) {
          throw new Error(`トランザクション送信エラー: ${sendError.message}`);
        }
        
        setDebugInfo(prev => `${prev}\nトランザクション承認待ち...`);
        
        try {
          const receipt = await tx.wait();
          setDebugInfo(prev => `${prev}\nトランザクション承認完了: ${JSON.stringify(receipt)}`);
        } catch (waitError) {
          // トランザクション待機中のエラーは無視（MiniAppでは実際のレシートが取得できないため）
          setDebugInfo(prev => `${prev}\nトランザクション待機エラー（無視）: ${waitError.message}`);
        }
        
        setSuccess(`${claimAmount} MIRトークンのクレームリクエストが送信されました！`);
        
        // クレームステータスとMIR残高を更新
        setTimeout(async () => {
          await checkClaimStatus();
          await updateMirBalance(userAccount);
        }, 3000);
      } catch (err) {
        console.error(err);
        // 詳細なエラーメッセージ
        if (err.code === 4001) {
          setError('トランザクションがユーザーによって拒否されました。');
        } else if (err.code === -32603) {
          setError('内部エラーが発生しました。ガス不足の可能性があります。');
        } else {
          setError(`トークンのクレーム中にエラーが発生しました: ${err.message}`);
        }
        setDebugInfo(prev => `${prev}\nクレームエラー: ${err.message}\n${err.stack || 'スタック情報なし'}`);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // 次回クレーム可能時間をフォーマット
  const formatNextClaimTime = () => {
    if (nextClaimTimestamp === 0) return '';
    
    const nextDate = new Date(nextClaimTimestamp * 1000);
    return nextDate.toLocaleString();
  };
  
  // 適切な接続ボタンを選択
  const handleConnect = () => {
    if (isMiniApp) {
      connectWithMiniKit();
    } else {
      connectWallet();
    }
  };
  
  return (
    <div className="token-claim-container">
      <h2>MIRトークンクレーム</h2>
      
      {/* デバッグステータス表示 - 左上に配置 */}
      <div className="debug-status">
        <div className="status-item auth-status">
          認証状態: <span className={isAuthenticated ? "status-on" : "status-off"}>
            {isAuthenticated ? "認証済み" : "未認証"}
          </span>
        </div>
        <div className="status-item wallet-status">
          ウォレット: <span className={isWalletConnected ? "status-on" : "status-off"}>
            {isWalletConnected ? "接続済み" : "未接続"}
          </span>
        </div>
      </div>
      
      {/* 環境バッジとMIR残高表示 */}
      <div className="top-bar">
        {isMiniApp && (
          <div className="environment-badge">World App</div>
        )}
        <div className="mir-balance">
          <span className="balance-label">保有MIR:</span>
          <span className="balance-value">{mirBalance} MIR</span>
        </div>
      </div>
      
      {/* リセットボタン */}
      <button onClick={resetAppState} className="reset-button">
        リセット
      </button>
      
      {/* メインコンテンツ */}
      <div className="main-content">
        {!userAccount ? (
          <>
            <p className="welcome-text">MIRトークンをクレームするにはウォレットを接続してください</p>
            <button onClick={handleConnect} className="connect-button">
              {isMiniApp ? "World Appで認証" : "ウォレットを接続"}
            </button>
            
            {/* 未接続時のダミークレームボタン - これは直接表示するためのもの */}
            <div className="claim-info">
              <p>サンプルクレーム量: <strong>10.0 MIR</strong></p>
              <button
                onClick={handleGuestClaim}
                className="claim-button"
              >
                トークンをクレーム
              </button>
            </div>
          </>
        ) : (
          <div className="claim-section">
            <p>接続中のアドレス: {userAccount.substring(0, 6)}...{userAccount.substring(userAccount.length - 4)}</p>
            {!isMiniApp && (
              <p>ネットワークID: {networkId} {networkId !== requiredNetworkId && <span className="error-text">(要求ID: {requiredNetworkId})</span>}</p>
            )}
            
            <div className="level-selector">
              <label>アバターレベル: </label>
              <select
                value={userLevel}
                onChange={(e) => setUserLevel(Number(e.target.value))}
              >
                <option value="1">レベル 1</option>
                <option value="2">レベル 2</option>
                <option value="3">レベル 3</option>
                <option value="4">レベル 4</option>
                <option value="5">レベル 5</option>
              </select>
            </div>
            
            <div className="claim-info">
              <p>クレーム可能なトークン: <strong>{claimAmount} MIR</strong></p>
              
              {canClaimTokens ? (
                <button
                  onClick={claimTokens}
                  disabled={isLoading || (!isMiniApp && networkId !== requiredNetworkId)}
                  className="claim-button"
                >
                  {isLoading ? '処理中...' : 'トークンをクレーム'}
                </button>
              ) : (
                <div className="cooldown-info">
                  <p>クレームはクールダウン中です</p>
                  <p>次回クレーム可能時間: {formatNextClaimTime()}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        
        <div className="debug-info">
          <details>
            <summary>デバッグ情報</summary>
            <pre>{debugInfo}</pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default TokenClaim; 