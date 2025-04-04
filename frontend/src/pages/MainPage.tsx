import { useState, useEffect } from "react";
import AvatarDisplay from "../components/Avatar/AvatarDisplay";
import { MiniKit } from "@worldcoin/minikit-js";
import { AvatarProfile, RevenueData, Advertisement } from "../types";
import { Button, Typography } from "@worldcoin/mini-apps-ui-kit-react";

interface MainPageProps {
  userId: string;
}

// ローカルストレージデータをリセットする関数を追加
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
    
    // ページをリロード（任意）
    window.location.reload();
  } catch (error) {
    console.error('Error resetting data:', error);
    alert('An error occurred while resetting data.');
  }
};

const MainPage = ({ userId }: MainPageProps) => {
  // Avatar profile state
  const [profile, setProfile] = useState<AvatarProfile>({
    name: "",
    gender: "",
    location: "",
    interests: [],
    occupation: "",
    icon: "default"
  });
  
  // Revenue data state
  const [revenue, setRevenue] = useState<RevenueData>({
    totalTokens: 0,
    dailyClaimable: 10,
    lastClaimed: null
  });
  
  // Ad viewing related states
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [isAdCompleted, setIsAdCompleted] = useState(false);
  const [isClaimingTokens, setIsClaimingTokens] = useState(false);
  
  // Growth related states
  const [developmentQuestions, setDevelopmentQuestions] = useState<string[]>([
    "What social media platforms do you typically use?",
    "How do you gather news information?",
    "What types of content are you interested in?",
    "Do you shop more online or in physical stores?",
    "Which areas would you like to invest in the future?"
  ]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  
  // Tab management
  const [activeTab, setActiveTab] = useState<"dashboard" | "development" | "monetization">("dashboard");
  
  // Load avatar information on initial load
  useEffect(() => {
    loadAvatarData();
    loadRevenueData();
    
    // Check if daily rewards can be claimed
    checkDailyClaimEligibility();
    
    // Select a new question randomly
    selectRandomQuestion();
  }, [userId]);
  
  // Load avatar data
  const loadAvatarData = () => {
    try {
      const storedData = localStorage.getItem(`avatar_${userId}`);
      if (storedData) {
        const avatarData = JSON.parse(storedData);
        setProfile(avatarData);
      }
    } catch (error) {
      console.error("Avatar data loading error:", error);
    }
  };
  
  // Load revenue data (mock data for demo)
  const loadRevenueData = () => {
    try {
      const storedData = localStorage.getItem(`revenue_${userId}`);
      if (storedData) {
        const revenueData = JSON.parse(storedData);
        setRevenue(revenueData);
      } else {
        // Set initial data
        const initialData: RevenueData = {
          totalTokens: 0,
          dailyClaimable: 10,
          lastClaimed: null
        };
        localStorage.setItem(`revenue_${userId}`, JSON.stringify(initialData));
        setRevenue(initialData);
      }
    } catch (error) {
      console.error("Revenue data loading error:", error);
    }
  };
  
  // Check if daily rewards can be claimed
  const checkDailyClaimEligibility = () => {
    const storedData = localStorage.getItem(`revenue_${userId}`);
    if (storedData) {
      const revenueData = JSON.parse(storedData);
      
      // Check the last claimed date
      if (revenueData.lastClaimed) {
        const lastClaimedDate = new Date(revenueData.lastClaimed);
        const today = new Date();
        
        // Claimable if the date is different
        const isNewDay = lastClaimedDate.getDate() !== today.getDate() ||
                        lastClaimedDate.getMonth() !== today.getMonth() ||
                        lastClaimedDate.getFullYear() !== today.getFullYear();
        
        if (isNewDay) {
          revenueData.dailyClaimable = 10; // Reset
          localStorage.setItem(`revenue_${userId}`, JSON.stringify(revenueData));
          setRevenue(revenueData);
        }
      }
    }
  };
  
  // Select a new question randomly
  const selectRandomQuestion = () => {
    if (developmentQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * developmentQuestions.length);
      setCurrentQuestion(developmentQuestions[randomIndex]);
      
      // Remove the selected question from the array
      const updatedQuestions = [...developmentQuestions];
      updatedQuestions.splice(randomIndex, 1);
      setDevelopmentQuestions(updatedQuestions);
    }
  };
  
  // Token claim process
  const handleClaimTokens = async () => {
    if (revenue.dailyClaimable <= 0) return;
    
    setIsClaimingTokens(true);
    
    try {
      // TODO: Use MiniKit for token transfer
      // In production, use the appropriate Pay API
      if (MiniKit.isInstalled()) {
        // Mock process - In production, call the Pay API
        await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
        
        // Update revenue data
        const updatedRevenue = {
          totalTokens: revenue.totalTokens + revenue.dailyClaimable,
          dailyClaimable: 0,
          lastClaimed: new Date().toISOString()
        };
        
        localStorage.setItem(`revenue_${userId}`, JSON.stringify(updatedRevenue));
        setRevenue(updatedRevenue);
        
        alert(`You've earned ${revenue.dailyClaimable} tokens!`);
      } else {
        alert("World App is not properly installed or the execution environment is not compatible.");
      }
    } catch (error) {
      console.error("Token claim error:", error);
      alert("An error occurred while claiming tokens. Please try again.");
    } finally {
      setIsClaimingTokens(false);
    }
  };
  
  // Start ad viewing process
  const handleStartWatchingAd = (ad: Advertisement) => {
    setSelectedAd(ad);
    setIsWatchingAd(true);
    setIsAdCompleted(false);
  };
  
  // Ad viewing completion process
  const handleAdCompleted = () => {
    setIsAdCompleted(true);
    
    if (selectedAd) {
      // Update revenue data
      const updatedRevenue = {
        ...revenue,
        totalTokens: revenue.totalTokens + selectedAd.rewardAmount
      };
      
      localStorage.setItem(`revenue_${userId}`, JSON.stringify(updatedRevenue));
      setRevenue(updatedRevenue);
    }
  };
  
  // Close ad viewing modal
  const handleCloseAdModal = () => {
    setIsWatchingAd(false);
    setSelectedAd(null);
    setIsAdCompleted(false);
  };
  
  // Submit answer to question
  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    
    // Avatar growth process (simple implementation here)
    // In actual implementation, more complex processing would be done via backend API
    
    // Reset answer
    setAnswer("");
    
    // Select a new question
    selectRandomQuestion();
    
    // Revenue increase bonus (slightly increase reward)
    const updatedRevenue = {
      ...revenue,
      dailyClaimable: Math.min(revenue.dailyClaimable + 2, 30) // Maximum 30 tokens
    };
    
    localStorage.setItem(`revenue_${userId}`, JSON.stringify(updatedRevenue));
    setRevenue(updatedRevenue);
    
    alert("Thank you for your answer! Your avatar's abilities have improved.");
  };
  
  // Mock ad data
  const mockAds: Advertisement[] = [
    {
      id: "ad1",
      title: "New Product Introduction",
      description: "Learn about the latest technology products",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      rewardAmount: 5
    },
    {
      id: "ad2",
      title: "Travel Campaign",
      description: "Introduction to special summer travel plans",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      rewardAmount: 3
    },
    {
      id: "ad3",
      title: "Health Food Introduction",
      description: "New products to support your health",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      rewardAmount: 4
    }
  ];
  
  // Dashboard tab contents
  const renderDashboardTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <Typography as="h3" variant="heading" level={3} className="mb-3">Revenue Status</Typography>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <Typography variant="body" level={2} className="text-gray-500">Total Tokens Earned</Typography>
              <Typography variant="number" level={1} className="text-2xl font-semibold">{revenue.totalTokens}</Typography>
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <Typography variant="body" level={2} className="text-blue-500">Claimable Today</Typography>
              <Typography variant="number" level={1} className="text-2xl font-semibold">{revenue.dailyClaimable}</Typography>
            </div>
          </div>
          <Button
            onClick={handleClaimTokens}
            disabled={revenue.dailyClaimable <= 0 || isClaimingTokens}
            fullWidth
            variant="primary"
            isLoading={isClaimingTokens}
            className="mt-4"
          >
            {!isClaimingTokens && `${revenue.dailyClaimable > 0 ? `Claim ${revenue.dailyClaimable} Tokens` : 'Already Claimed'}`}
          </Button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Avatar Information</h3>
          <AvatarDisplay profile={profile} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Activity History</h3>
          <div className="space-y-2">
            {revenue.lastClaimed && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">Last Claim Time</span>
                <span className="text-sm text-gray-500">
                  {new Date(revenue.lastClaimed).toLocaleString('en-US')}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Avatar Creation Date</span>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US')}
              </span>
            </div>
          </div>
        </div>
        
        {/* デバッグモードの場合のみリセットボタンを表示 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Admin Panel</h3>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={resetAllData}
              fullWidth
              variant="primary"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              Reset All Data
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Warning: This will permanently delete all user data.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  // Development tab contents
  const renderDevelopmentTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Avatar Enhancement</h3>
          <p className="text-sm text-gray-600 mb-4">
            Answer the questions below to enhance your avatar's abilities.
            The more detailed information you provide, the more efficiently your avatar will generate revenue.
          </p>
          
          {currentQuestion ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm font-medium">{currentQuestion}</p>
              </div>
              
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
              
              <button
                onClick={handleSubmitAnswer}
                disabled={!answer.trim()}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-sm text-yellow-700">
                You've answered all questions. More questions will be added later.
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Avatar Growth Status</h3>
          <AvatarDisplay profile={profile} />
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              As your avatar grows, revenue increases. Answer more questions to enhance its abilities.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  // Monetization tab contents
  const renderMonetizationTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Ad Viewing</h3>
          <p className="text-sm text-gray-600 mb-4">
            Watch ads to earn additional tokens. The higher your avatar's level, the more rewards you can earn.
          </p>
          
          <div className="grid gap-4">
            {mockAds.map((ad) => (
              <div key={ad.id} className="border rounded-md p-3">
                <h4 className="font-medium">{ad.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{ad.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600 font-medium">
                    Reward: {ad.rewardAmount} Tokens
                  </span>
                  <button
                    onClick={() => handleStartWatchingAd(ad)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Watch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Revenue History</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Total Tokens Earned</span>
              <span className="text-sm font-medium">{revenue.totalTokens}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Claimable Today</span>
              <span className="text-sm font-medium">{revenue.dailyClaimable}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Ad viewing modal
  const renderAdModal = () => {
    if (!isWatchingAd || !selectedAd) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">{selectedAd.title}</h3>
          </div>
          
          <div className="p-4">
            {!isAdCompleted ? (
              <>
                <div className="aspect-video bg-gray-200 mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedAd.videoUrl}
                    title={selectedAd.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Watch the video to the end and then click the complete button.
                </p>
                <button
                  onClick={handleAdCompleted}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Complete Viewing
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h4 className="text-xl font-medium mb-2">Reward Earned!</h4>
                <p className="text-gray-600 mb-6">
                  You earned {selectedAd.rewardAmount} tokens.
                </p>
                <button
                  onClick={handleCloseAdModal}
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col space-y-4">
      {/* Tab navigation */}
      <div className="flex bg-white rounded-lg shadow p-1">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 py-2 text-sm font-medium rounded-md ${
            activeTab === "dashboard"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("development")}
          className={`flex-1 py-2 text-sm font-medium rounded-md ${
            activeTab === "development"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Avatar Development
        </button>
        <button
          onClick={() => setActiveTab("monetization")}
          className={`flex-1 py-2 text-sm font-medium rounded-md ${
            activeTab === "monetization"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Monetization
        </button>
      </div>
      
      {/* Tab content */}
      <div>
        {activeTab === "dashboard" && renderDashboardTab()}
        {activeTab === "development" && renderDevelopmentTab()}
        {activeTab === "monetization" && renderMonetizationTab()}
      </div>
      
      {/* Ad viewing modal */}
      {renderAdModal()}
    </div>
  );
};

export default MainPage; 