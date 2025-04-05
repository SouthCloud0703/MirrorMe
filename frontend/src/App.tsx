import { useState, useEffect } from "react";
import MiniKitProvider from "./minikit-provider";

// Components
import TopPage from "./pages/TopPage";
import WelcomePage from "./pages/WelcomePage";

// Authentication state
interface User {
  id: string;
  verified: boolean;
}

export default function App() {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);

  // Check for existing user on mount
  useEffect(() => {
    // Check local storage for existing user
    const savedUserId = localStorage.getItem('current_user_id');
    if (savedUserId) {
      setUser({
        id: savedUserId,
        verified: true
      });
      
      // Not first visit since we have a user ID
      setIsFirstVisit(false);
      
      console.log("Existing user found:", savedUserId);
    } else {
      // Check if we've shown the welcome page before
      const hasSeenWelcome = localStorage.getItem('has_seen_welcome');
      if (hasSeenWelcome) {
        setIsFirstVisit(false);
      }
    }
  }, []);

  // Logging
  console.log("App re-rendering:", { authenticated: !!user, isFirstVisit, user });

  // Authentication success handler
  const handleAuth = (userId: string) => {
    console.log("Authentication success:", userId);
    
    if (!userId) {
      setError("Invalid authentication information");
      return;
    }
    
    try {
      // Update user information
      setUser({
        id: userId,
        verified: true
      });
      
      // Save user ID to local storage
      localStorage.setItem('current_user_id', userId);
      
      // Mark that the user has seen the welcome page
      localStorage.setItem('has_seen_welcome', 'true');
      
      // No longer first visit
      setIsFirstVisit(false);
      
      // Create user record if doesn't exist
      if (!localStorage.getItem(`user_${userId}`)) {
        localStorage.setItem(`user_${userId}`, JSON.stringify({ authenticated: true }));
      }
      
      console.log("User authentication complete");
    } catch (err) {
      console.error("Authentication process error:", err);
      setError("An error occurred during authentication");
    }
  };

  return (
    <MiniKitProvider>
      <main className="flex min-h-screen flex-col items-center p-0 bg-white">
        <div className="w-full">
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
          
          {/* Show Welcome Page for first visit, otherwise TopPage */}
          {!user && isFirstVisit ? (
            <WelcomePage onAuth={handleAuth} />
          ) : (
            <TopPage 
              userId={user ? user.id : null} 
              onAuth={handleAuth} 
            />
          )}
        </div>
      </main>
    </MiniKitProvider>
  );
}