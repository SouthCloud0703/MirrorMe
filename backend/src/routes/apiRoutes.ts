import express, { Router } from 'express';

const router: Router = express.Router();

// ヘルスチェック用エンドポイント
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' });
});

export default router; 