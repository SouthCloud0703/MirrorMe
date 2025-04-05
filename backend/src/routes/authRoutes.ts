import express from 'express';
import { verifyWorldId, updateUserAfterVerification } from '../controllers/worldIdAuth';

const router = express.Router();

// World ID認証結果を受け取るエンドポイント
router.post('/verify-world-id', verifyWorldId);

// 認証後にユーザープロフィールを更新するエンドポイント
router.post('/update-profile', updateUserAfterVerification);

export default router; 