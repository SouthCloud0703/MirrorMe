import { Request, Response } from 'express';
import { userStore } from '../db';

// World IDの検証と新規ユーザー登録
export const verifyWorldId = async (req: Request, res: Response) => {
  try {
    const { nullifier_hash } = req.body;
    
    // nullifier_hashが必須
    if (!nullifier_hash) {
      return res.status(400).json({
        success: false,
        error: 'nullifier_hash is required'
      });
    }
    
    // nullifier_hashをWorld IDとして使用
    const worldId = nullifier_hash;
    
    // ユーザーを取得または作成
    const user = userStore.getOrCreateUser(worldId);
    
    // レスポンスからプライベート情報を削除
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('World ID検証エラー:', error);
    return res.status(500).json({
      success: false,
      error: 'World ID認証に失敗しました'
    });
  }
};

// World ID検証の成功後にユーザープロフィールを更新
export const updateUserAfterVerification = async (req: Request, res: Response) => {
  try {
    const { worldId, profile } = req.body;
    
    if (!worldId) {
      return res.status(400).json({
        success: false,
        error: 'worldId is required'
      });
    }
    
    // プロフィール情報を更新
    const updatedUser = userStore.updateUserProfile(worldId, profile || {});
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    return res.status(500).json({
      success: false,
      error: 'プロフィールの更新に失敗しました'
    });
  }
}; 