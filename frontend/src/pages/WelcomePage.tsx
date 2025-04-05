import React, { useState } from "react";

// World App MiniKit用の型定義拡張
declare global {
  interface Window {
    MiniKit?: {
      isInstalled?: () => boolean;
      commandsAsync: {
        verify: (options: {
          action: string;
          signal?: string;
          verification_level: "orb" | "device";
        }) => Promise<{finalPayload: any}>;
        walletAuth: (options: any) => Promise<{finalPayload: any}>;
        sendTransaction: (options: any) => Promise<{finalPayload: any}>;
        ethCall: (options: {
          to: string;
          data: string;
        }) => Promise<{finalPayload: any}>;
      }
    }
  }
}

interface WelcomePageProps {
  onAuth: (userId: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onAuth }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // World AppのVerify機能を使用したユーザー認証
  const handleWorldVerify = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Starting authentication process");
      
      // MiniKitが利用可能かチェック
      if (window.MiniKit && window.MiniKit.isInstalled && window.MiniKit.isInstalled()) {
        console.log("Using World App MiniKit for authentication");
        
        // 認証リクエストパラメータの設定
        const verifyPayload = {
          action: "verify", // 実際のアプリではDeveloper Portalのaction_idに置き換え
          signal: "mirror_me_auth", // オプションのデータ
          verification_level: "orb" as "orb" | "device" // 型としてリテラル型"orb"または"device"を明示的に指定
        };
        
        try {
          // World Appに認証ダイアログを表示
          const { finalPayload } = await window.MiniKit.commandsAsync.verify(verifyPayload);
          
          console.log("Authentication response:", finalPayload);
          
          if (finalPayload.status === 'error') {
            console.error("Authentication error:", finalPayload);
            setError("World ID verification failed. Please try again.");
            setIsLoading(false);
            return;
          }
          
          console.log("Authentication successful:", finalPayload);
          
          // ユーザーIDの生成
          let worldUserId: string;
          if (finalPayload.nullifier_hash) {
            worldUserId = finalPayload.nullifier_hash;
          } else {
            // nullifier_hashが利用できない場合は代替の識別子を生成
            worldUserId = `worldid_user_${Date.now().toString(36)}`;
          }
          
          console.log("Generated user ID:", worldUserId);
          
          // ローカルストレージに保存
          localStorage.setItem('world_user_id', worldUserId);
          
          // 親コンポーネントに通知
          onAuth(worldUserId);
          setIsLoading(false);
          return;
        } catch (verifyError) {
          console.error("MiniKit authentication error:", verifyError);
          setError("An error occurred during authentication. Please try again.");
          setIsLoading(false);
        }
      } else {
        // MiniKitが利用できない場合のフォールバック
        console.log("MiniKit is not available, falling back to alternative authentication");
        // 開発環境用のフォールバック認証
        const fallbackUserId = `dev_user_${Date.now().toString(36)}`;
        localStorage.setItem('world_user_id', fallbackUserId);
        onAuth(fallbackUserId);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* Header/Logo area */}
      <div className="w-full flex justify-center pt-10 pb-6">
        <img 
          src="/images/logo.png" 
          alt="MirrorMe Logo" 
          className="w-32 h-32 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/128?text=MirrorMe";
          }} 
        />
      </div>

      {/* Welcome heading */}
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Welcome to MirrorMe</h1>
      
      {/* App description */}
      <div className="px-6 mb-8 max-w-md">
        <p className="text-center text-slate-600 mb-6">
          Let your digital self work for you
        </p>

        {/* Image-based feature highlights */}
        <div className="grid grid-cols-1 gap-8 mb-10">
          {/* Feature 1: Claim */}
          <div className="feature-card rounded-xl overflow-hidden shadow-lg">
            <div className="relative">
              <img 
                src="/images/claim.png" 
                alt="Daily Claims" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/400x200?text=Daily+Claims";
                }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div className="text-white w-full">
                  <h3 className="font-bold text-xl">Daily Claims</h3>
                  <p className="text-sm opacity-90 mb-3">Incentivize daily regular logins</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature 2: Training */}
          <div className="feature-card rounded-xl overflow-hidden shadow-lg">
            <div className="relative">
              <img 
                src="/images/train.png" 
                alt="Training" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/400x200?text=Training";
                }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-xl">Training</h3>
                  <p className="text-sm opacity-90">Share information to increase claim efficiency</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature 3: Work autonomously */}
          <div className="feature-card rounded-xl overflow-hidden shadow-lg">
            <div className="relative">
              <img 
                src="/images/work.png" 
                alt="Autonomous Work" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/400x200?text=Autonomous+Work";
                }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-xl">Work Autonomously</h3>
                  <p className="text-sm opacity-90">Your digital avatar earns rewards automatically</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 max-w-sm w-full">
          <p>{error}</p>
        </div>
      )}

      {/* Auth button */}
      <div className="w-full px-6 max-w-md">
        <button 
          className={`w-full px-6 py-4 bg-black text-white rounded-xl shadow-md hover:bg-gray-800 transition-colors font-medium text-base ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleWorldVerify}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 8L10.8 14.5L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Authenticate with World ID
            </span>
          )}
        </button>
        
        <p className="text-center text-xs text-slate-500 mt-4">
          By authenticating, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage; 