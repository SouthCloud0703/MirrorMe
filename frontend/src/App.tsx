import { useState } from "react";
import MiniKitProvider from "./minikit-provider";

// Components
import AuthPage from "./pages/AuthPage";
import AvatarCreationPage from "./pages/AvatarCreationPage";
import MainPage from "./pages/MainPage";

// Authentication state
interface User {
  id: string;
  verified: boolean;
  hasAvatar?: boolean;
}

// Debug information component
const DebugState = ({ user }: { user: User | null }) => {
  // ローカルストレージデータをリセットする関数
  const resetAllData = () => {
    try {
      // ローカルストレージからすべてのキーを取得
      const keys = Object.keys(localStorage);
      
      // アプリ関連のキーのみを削除
      const appKeys = keys.filter(key => 
        key.startsWith('avatar_') || 
        key.startsWith('revenue_') || 
        key.startsWith('user_')
      );
      
      // 該当するキーをすべて削除
      appKeys.forEach(key => localStorage.removeItem(key));
      
      console.log('All application data has been reset');
      alert('All data has been reset. Please refresh the page.');
      
      // ページをリロード
      window.location.reload();
    } catch (error) {
      console.error('Error resetting data:', error);
      alert('An error occurred while resetting data.');
    }
  };

  return (
    <div className="p-3 bg-gray-100 rounded-md mb-4 text-xs">
      <h4 className="font-bold">Debug Info</h4>
      <div>Authentication: {user ? 'Authenticated' : 'Not Authenticated'}</div>
      <div>Avatar: {user?.hasAvatar ? 'Created' : 'Not Created'}</div>
      <div>User Info: {user ? JSON.stringify(user) : 'None'}</div>
      <button
        onClick={resetAllData}
        className="mt-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
      >
        Reset All Data
      </button>
    </div>
  );
};

export default function App() {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugMode] = useState(true); // Debug mode toggle

  // Logging
  console.log("App re-rendering:", { authenticated: !!user, hasAvatar: user?.hasAvatar, user });

  // Authentication success handler
  const handleAuth = (userId: string) => {
    console.log("Authentication success:", userId);
    
    if (!userId) {
      setError("Invalid authentication information");
      return;
    }
    
    try {
      // Check for avatar existence
      const storedAvatar = localStorage.getItem(`avatar_${userId}`);
      const hasAvatar = !!storedAvatar;
      
      // Update user information
      setUser({
        id: userId,
        verified: true,
        hasAvatar
      });
      
      console.log("User authentication complete - Avatar status:", hasAvatar ? "Exists" : "None");
    } catch (err) {
      console.error("Authentication process error:", err);
      setError("An error occurred during authentication");
    }
  };

  // Avatar creation completion handler
  const handleAvatarCreated = () => {
    console.log("Avatar creation complete");
    
    if (!user) {
      setError("User information not found");
      return;
    }
    
    // Update user information
    setUser({
      ...user,
      hasAvatar: true
    });
    
    console.log("Avatar creation complete - User information updated");
  };

  // Display content based on authentication status
  const renderContent = () => {
    // Not authenticated
    if (!user || !user.verified) {
      return <AuthPage onAuth={handleAuth} />;
    }
    
    // Authenticated but no avatar
    if (!user.hasAvatar) {
      return <AvatarCreationPage userId={user.id} onComplete={handleAvatarCreated} />;
    }
    
    // Authenticated with avatar
    return <MainPage userId={user.id} />;
  };

  return (
    <MiniKitProvider>
      <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-md w-full">
          <header className="w-full text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">MirrorMe</h1>
            <p className="text-sm text-gray-600">Your digital self works for you</p>
          </header>
          
          {debugMode && (
            <DebugState user={user} />
          )}
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              <p>{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 px-3 py-1 text-sm bg-red-50 hover:bg-red-100 rounded-md"
              >
                Close
              </button>
            </div>
          )}
          
          {renderContent()}
        </div>
      </main>
    </MiniKitProvider>
  );
}