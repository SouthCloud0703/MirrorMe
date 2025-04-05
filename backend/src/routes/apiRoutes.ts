import express, { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';

const router: Router = express.Router();

// 各種ルートを登録
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// ヘルスチェック用エンドポイント
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' });
});

// バージョン情報を返すエンドポイント
router.get('/version', (req, res) => {
  res.json({
    version: '1.0.0',
    name: 'MirrorMe API',
  });
});

export default router; 