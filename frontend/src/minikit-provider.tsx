import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect, useState } from "react";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const [, setIsInstalled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log("Attempting to install MiniKit...");
      MiniKit.install();
      
      // Check installation status
      const installed = MiniKit.isInstalled();
      setIsInstalled(installed);
      
      console.log("MiniKit installation status:", installed);
      
      if (!installed) {
        console.warn("MiniKit is not properly installed. Some features may be limited.");
        // Do not throw an error so that the app can still function without MiniKit
      }
    } catch (err) {
      console.error("MiniKit installation error:", err);
      setError("An error occurred during MiniKit initialization. However, demo features are still available.");
      setIsInstalled(false);
    }
  }, []);

  return (
    <>
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 text-yellow-800 p-2 text-sm text-center">
          {error}
        </div>
      )}
      {children}
    </>
  );
}
