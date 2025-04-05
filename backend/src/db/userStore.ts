import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// ユーザーデータの型定義
export interface UserData {
  id: string;         // 内部ID (UUID)
  worldId: string;    // World IDハッシュ
  createdAt: string;  // 作成日時
  updatedAt: string;  // 更新日時
  profile?: {         // プロフィール情報（オプション）
    name?: string;
    avatarLevel?: number;
    xp?: number;
  };
  customData?: Record<string, any>; // カスタムデータ（任意のJSONデータ）
}

// ユーザーストアクラス
export class UserStore {
  private dbPath: string;
  private users: Record<string, UserData> = {};
  private initialized: boolean = false;

  constructor(dbFileName: string = 'users.json') {
    // データベースファイルのパスを設定
    this.dbPath = path.join(process.cwd(), 'data', dbFileName);
    this.init();
  }

  // データベースの初期化
  private init(): void {
    try {
      // data ディレクトリが存在しない場合は作成
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // データベースファイルが存在する場合はロード
      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, 'utf-8');
        this.users = JSON.parse(data);
        console.log(`ユーザーデータをロードしました: ${Object.keys(this.users).length}件`);
      } else {
        // 新規作成
        this.save();
        console.log('新しいユーザーデータベースを作成しました');
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('ユーザーデータベースの初期化エラー:', error);
    }
  }

  // データベースへの保存
  private save(): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.users, null, 2), 'utf-8');
    } catch (error) {
      console.error('ユーザーデータベースの保存エラー:', error);
    }
  }

  // World IDに基づいてユーザーを作成または取得
  public getOrCreateUser(worldId: string): UserData {
    // すでに存在するかチェック
    const existingUser = this.getUserByWorldId(worldId);
    if (existingUser) {
      return existingUser;
    }

    // 新規ユーザーの作成
    const now = new Date().toISOString();
    const newUser: UserData = {
      id: randomUUID(),
      worldId,
      createdAt: now,
      updatedAt: now,
      profile: {
        avatarLevel: 1,
        xp: 0
      },
      customData: {}
    };

    // ユーザーを保存
    this.users[worldId] = newUser;
    this.save();
    
    return newUser;
  }

  // World IDによるユーザー取得
  public getUserByWorldId(worldId: string): UserData | null {
    return this.users[worldId] || null;
  }

  // 内部IDによるユーザー取得
  public getUserById(id: string): UserData | null {
    for (const worldId in this.users) {
      if (this.users[worldId].id === id) {
        return this.users[worldId];
      }
    }
    return null;
  }

  // ユーザーのプロフィール情報を更新
  public updateUserProfile(worldId: string, profile: Partial<UserData['profile']>): UserData | null {
    const user = this.getUserByWorldId(worldId);
    if (!user) return null;
    
    user.profile = {
      ...user.profile,
      ...profile
    };
    user.updatedAt = new Date().toISOString();
    
    this.save();
    return user;
  }

  // カスタムデータの更新
  public updateCustomData(worldId: string, key: string, value: any): UserData | null {
    const user = this.getUserByWorldId(worldId);
    if (!user) return null;
    
    if (!user.customData) {
      user.customData = {};
    }
    
    user.customData[key] = value;
    user.updatedAt = new Date().toISOString();
    
    this.save();
    return user;
  }

  // 全ユーザー取得
  public getAllUsers(): UserData[] {
    return Object.values(this.users);
  }

  // ユーザー削除
  public deleteUser(worldId: string): boolean {
    if (this.users[worldId]) {
      delete this.users[worldId];
      this.save();
      return true;
    }
    return false;
  }
} 