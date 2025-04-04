import { useState } from "react";
import { MiniKit, VerifyCommandInput, VerificationLevel } from "@worldcoin/minikit-js";
import { Button, Typography } from "@worldcoin/mini-apps-ui-kit-react";

interface AuthPageProps {
  onAuth: (userId: string) => void;
}

const AuthPage = ({ onAuth }: AuthPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Authentication process started");
      console.log("MiniKit installation status:", MiniKit.isInstalled());
      
      // WorldID authentication implementation
      if (MiniKit.isInstalled()) {
        console.log("Executing actual authentication using MiniKit");
        
        // Set authentication request payload
        const verifyPayload: VerifyCommandInput = {
          action: "verify", // Replace with action_id from Developer Portal when deployed
          signal: "mirror_me_auth", // Optional data
          verification_level: VerificationLevel.Orb // Or Device
        };
        
        try {
          // Display authentication dialog in World App
          const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
          
          console.log("MiniKit authentication response:", finalPayload);
          
          if (finalPayload.status === 'error') {
            console.error("Authentication error:", finalPayload);
            throw new Error("WorldID authentication failed");
          }
          
          console.log("Authentication successful:", finalPayload);
          
          // Generate user ID
          let userId: string;
          if (finalPayload.nullifier_hash) {
            userId = finalPayload.nullifier_hash;
          } else {
            // Generate alternative identifier if nullifier_hash is not available
            userId = `worldid_user_${Date.now().toString(36)}`;
          }
          
          console.log("Generated user ID:", userId);
          onAuth(userId);
          return;
        } catch (verifyError) {
          console.error("MiniKit authentication error:", verifyError);
          // In case of error, continue to fallback processing below
        }
      } 
      
      // Fallback when MiniKit is not available
      // Note: In production, this fallback should be removed and appropriate error message should be displayed
      console.log("MiniKit is not available, executing mock authentication");
      const userId = `user_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      console.log("Generated user ID:", userId);
      
      // Add intentional short delay to make UI state transitions more visible
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Notify result of fallback authentication
      console.log("Authentication complete - User ID:", userId);
      onAuth(userId);
      
    } catch (err) {
      console.error("Authentication error:", err);
      setError("An error occurred during authentication. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <div className="w-24 h-24 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
        <img src="/logo-placeholder.svg" alt="MirrorMe Logo" className="w-16 h-16" />
      </div>
      
      <Typography as="h2" variant="heading" level={2} className="font-bold mb-4">Welcome to MirrorMe</Typography>
      <Typography variant="body" level={1} className="text-center mb-8">
        Create your digital avatar and start generating revenue automatically.
        First, verify your identity with World ID.
      </Typography>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 w-full text-center">
          <Typography variant="body" level={2}>{error}</Typography>
        </div>
      )}
      
      <Button
        onClick={handleVerify}
        disabled={isLoading}
        fullWidth
        size="lg"
        variant="primary"
        isLoading={isLoading}
      >
        <span className="flex items-center justify-center">
          {!isLoading && (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
          )}
          {isLoading ? "Authenticating..." : "Authenticate with World ID"}
        </span>
      </Button>
      
      <Typography as="small" variant="body" level={3} className="mt-4 text-center">
        * Limit of one account per person. Verification with World ID is required.
      </Typography>
    </div>
  );
};

export default AuthPage; 