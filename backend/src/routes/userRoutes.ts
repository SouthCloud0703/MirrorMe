import express from 'express';
import { userStore } from '../db';

const router = express.Router();

// ユーザー情報を取得するエンドポイント
router.get('/:worldId', (req, res) => {
  const { worldId } = req.params;
  
  if (!worldId) {
    return res.status(400).json({
      error: 'World IDが必要です'
    });
  }
  
  const user = userStore.getUserByWorldId(worldId);
  
  if (!user) {
    return res.status(404).json({
      error: 'ユーザーが見つかりません'
    });
  }
  
  // パスワードハッシュなど機密情報は除外
  return res.json(user);
});

// ユーザー情報を作成または取得するエンドポイント
router.post('/', (req, res) => {
  const { worldId } = req.body;
  
  if (!worldId) {
    return res.status(400).json({
      error: 'World IDが必要です'
    });
  }
  
  try {
    const user = userStore.getOrCreateUser(worldId);
    res.status(201).json(user);
  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    res.status(500).json({
      error: 'ユーザーの作成に失敗しました'
    });
  }
});

// ユーザープロフィールを更新するエンドポイント
router.patch('/:worldId/profile', (req, res) => {
  const { worldId } = req.params;
  const profileData = req.body;
  
  if (!worldId) {
    return res.status(400).json({
      error: 'World IDが必要です'
    });
  }
  
  try {
    const updatedUser = userStore.updateUserProfile(worldId, profileData);
    
    if (!updatedUser) {
      return res.status(404).json({
        error: 'ユーザーが見つかりません'
      });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    res.status(500).json({
      error: 'プロフィールの更新に失敗しました'
    });
  }
});

// カスタムデータを更新するエンドポイント
router.patch('/:worldId/custom/:key', (req, res) => {
  const { worldId, key } = req.params;
  const { value } = req.body;
  
  if (!worldId || !key) {
    return res.status(400).json({
      error: 'World IDとデータキーが必要です'
    });
  }
  
  try {
    const updatedUser = userStore.updateCustomData(worldId, key, value);
    
    if (!updatedUser) {
      return res.status(404).json({
        error: 'ユーザーが見つかりません'
      });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('カスタムデータ更新エラー:', error);
    res.status(500).json({
      error: 'カスタムデータの更新に失敗しました'
    });
  }
});

// ユーザーを削除するエンドポイント
router.delete('/:worldId', (req, res) => {
  const { worldId } = req.params;
  
  if (!worldId) {
    return res.status(400).json({
      error: 'World IDが必要です'
    });
  }
  
  try {
    const deleted = userStore.deleteUser(worldId);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'ユーザーが見つかりません'
      });
    }
    
    res.json({
      success: true,
      message: 'ユーザーが削除されました'
    });
  } catch (error) {
    console.error('ユーザー削除エラー:', error);
    res.status(500).json({
      error: 'ユーザーの削除に失敗しました'
    });
  }
});

// 全ユーザーを取得するエンドポイント（開発/管理用）
router.get('/', (req, res) => {
  try {
    const users = userStore.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('ユーザー一覧取得エラー:', error);
    res.status(500).json({
      error: 'ユーザー一覧の取得に失敗しました'
    });
  }
});

export default router; 