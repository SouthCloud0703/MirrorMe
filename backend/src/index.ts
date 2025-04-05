import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes';
import { userStore } from './db';

// 環境変数の読み込み
dotenv.config();

// Expressアプリの初期化
const app = express();
const PORT = process.env.PORT || 5000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// APIルートの設定
app.use('/api', apiRoutes);

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// ルートヘルスチェック
app.get('/', (req, res) => {
  res.send('MirrorMe API is running');
});

// エラーハンドリング
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
}); 