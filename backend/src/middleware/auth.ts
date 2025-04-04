import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Requestオブジェクトに userId プロパティを追加するための型拡張
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { id: string };
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export default auth; 