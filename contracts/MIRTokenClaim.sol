// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MIRToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MIRTokenClaim
 * @dev MIR Tokenをクレームするためのコントラクト
 */
contract MIRTokenClaim is Ownable, ReentrancyGuard {
    MIRToken public mirToken;
    
    // クレーム情報を格納する構造体
    struct ClaimInfo {
        uint256 lastClaimTime;
        uint256 totalClaimed;
    }
    
    // アドレスごとのクレーム情報を追跡するマッピング
    mapping(address => ClaimInfo) public claimInfo;
    
    // ユーザーレベルごとの1日のクレーム上限
    mapping(uint256 => uint256) public levelClaimLimit;
    
    // クレーム間隔（デフォルトは24時間 = 86400秒）
    uint256 public claimCooldown = 86400;
    
    // パラメータ
    uint256 public baseClaimAmount = 10 * 10**18; // 基本クレーム量: 10 MIR
    bool public claimEnabled = true; // クレーム有効フラグ
    
    // イベント
    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event ClaimLimitUpdated(uint256 level, uint256 newLimit);
    event ClaimCooldownUpdated(uint256 newCooldown);
    event ClaimEnabledUpdated(bool enabled);
    event BaseClaimAmountUpdated(uint256 newAmount);
    
    /**
     * @dev コンストラクタ
     * @param _mirTokenAddress MIRトークンコントラクトのアドレス
     * @param _initialOwner 初期所有者のアドレス
     */
    constructor(address _mirTokenAddress, address _initialOwner) Ownable(_initialOwner) {
        mirToken = MIRToken(_mirTokenAddress);
        
        // デフォルトのレベル別クレーム上限を設定
        levelClaimLimit[1] = 10 * 10**18;  // レベル1: 10 MIR/日
        levelClaimLimit[2] = 20 * 10**18;  // レベル2: 20 MIR/日
        levelClaimLimit[3] = 30 * 10**18;  // レベル3: 30 MIR/日
        levelClaimLimit[4] = 50 * 10**18;  // レベル4: 50 MIR/日
        levelClaimLimit[5] = 100 * 10**18; // レベル5: 100 MIR/日
    }
    
    /**
     * @dev 指定したレベルでトークンをクレームする
     * @param _level ユーザーのレベル（1-5）
     * @return 成功したかどうか
     */
    function claimTokens(uint256 _level) external nonReentrant returns (bool) {
        require(claimEnabled, "Claiming is currently disabled");
        require(_level > 0 && _level <= 5, "Invalid level");
        // MVPのため常にクレーム可能: require(canClaim(msg.sender), "Claim cooldown period has not passed yet");
        
        ClaimInfo storage info = claimInfo[msg.sender];
        uint256 claimAmount = calculateClaimAmount(_level);
        
        // トークン転送
        require(mirToken.transfer(msg.sender, claimAmount), "Token transfer failed");
        
        // クレーム情報更新
        info.lastClaimTime = block.timestamp;
        info.totalClaimed += claimAmount;
        
        emit TokensClaimed(msg.sender, claimAmount, block.timestamp);
        return true;
    }
    
    /**
     * @dev 指定したレベルでクレームできる金額を計算
     * @param _level ユーザーのレベル
     * @return クレーム可能な金額
     */
    function calculateClaimAmount(uint256 _level) public view returns (uint256) {
        return baseClaimAmount * _level;
    }
    
    /**
     * @dev ユーザーがクレーム可能かチェック
     * @param _user ユーザーアドレス
     * @return クレーム可能かどうか
     */
    function canClaim(address _user) public view returns (bool) {
        // MVPのため常にクレーム可能にする
        return true;
        
        // 以下は元のロジック（参照用）
        // ClaimInfo memory info = claimInfo[_user];
        // return (block.timestamp >= info.lastClaimTime + claimCooldown);
    }
    
    /**
     * @dev 次回クレーム可能時間を取得
     * @param _user ユーザーアドレス
     * @return 次回クレーム可能なUNIXタイムスタンプ
     */
    function nextClaimTime(address _user) external view returns (uint256) {
        // MVPのため常に現在時刻を返す（即時クレーム可能）
        return block.timestamp;
        
        // 以下は元のロジック（参照用）
        // ClaimInfo memory info = claimInfo[_user];
        // return info.lastClaimTime + claimCooldown;
    }
    
    /**
     * @dev レベルごとのクレーム上限を設定（オーナーのみ）
     * @param _level レベル
     * @param _limit 新しい上限
     */
    function setLevelClaimLimit(uint256 _level, uint256 _limit) external onlyOwner {
        require(_level > 0 && _level <= 5, "Invalid level");
        levelClaimLimit[_level] = _limit;
        emit ClaimLimitUpdated(_level, _limit);
    }
    
    /**
     * @dev クレームクールダウン期間を設定（オーナーのみ）
     * @param _cooldown 新しいクールダウン期間（秒）
     */
    function setClaimCooldown(uint256 _cooldown) external onlyOwner {
        claimCooldown = _cooldown;
        emit ClaimCooldownUpdated(_cooldown);
    }
    
    /**
     * @dev クレーム機能の有効/無効を切り替え（オーナーのみ）
     * @param _enabled 有効にするかどうか
     */
    function setClaimEnabled(bool _enabled) external onlyOwner {
        claimEnabled = _enabled;
        emit ClaimEnabledUpdated(_enabled);
    }
    
    /**
     * @dev 基本クレーム量を設定（オーナーのみ）
     * @param _amount 新しい基本クレーム量
     */
    function setBaseClaimAmount(uint256 _amount) external onlyOwner {
        baseClaimAmount = _amount;
        emit BaseClaimAmountUpdated(_amount);
    }
    
    /**
     * @dev コントラクトが保有する残りのトークンを引き出す（オーナーのみ）
     * @param _amount 引き出す量
     */
    function withdrawTokens(uint256 _amount) external onlyOwner {
        require(mirToken.transfer(owner(), _amount), "Token transfer failed");
    }
} 