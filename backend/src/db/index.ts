import { UserStore } from './userStore';

// シングルトンパターンでユーザーストアを提供
const userStore = new UserStore();

export { userStore, UserStore };
export type { UserData } from './userStore'; 