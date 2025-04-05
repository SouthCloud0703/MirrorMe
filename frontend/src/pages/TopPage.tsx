"use client"

import React, { useState, useEffect, useCallback } from "react"

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

// アイコンコンポーネント定義
interface IconProps {
  className?: string;
}

const ClockIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CheckCircleIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.9917 7.13631 4.39828 5.49706C5.80487 3.85781 7.69742 2.71537 9.79801 2.24013C11.8986 1.7649 14.1013 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// CheckIconコンポーネントを追加
const CheckIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// XIconコンポーネントを追加
const XIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertCircleIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoaderIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const RobotIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 8V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V8" stroke="currentColor" strokeWidth="2"/>
    <circle cx="9" cy="14" r="1" fill="currentColor"/>
    <circle cx="15" cy="14" r="1" fill="currentColor"/>
  </svg>
);

const ChevronDownIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);



// TrashIcon（削除ボタン用のアイコン）
const TrashIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// TopPagePropsインターフェイスの定義
interface TopPageProps {
  userId: string | null;
  onAuth: (userId: string) => void;
  onNavigate?: (page: 'welcome' | 'top' | 'activity') => void;
}

// ActivityタブのUI構造を更新するためのTypeScript型定義
interface AgentActivity {
  id: string;
  title: string;
  category: string;
  timestamp: Date;
  status: 'in-progress' | 'completed' | 'interrupted';
  description: string;
  reward: number;
  icon: 'clock' | 'alert' | 'check';
}

// コンポーネントの宣言を修正し、明示的にPropsインターフェイスを指定
const TopPage: React.FC<TopPageProps> = ({ userId, onAuth, onNavigate }) => {
  // 実際にpropsを使用する
  // authenticated変数は使用されていないため削除
  // const [authenticated, setAuthenticated] = useState<boolean>(!!userId);
  
  // ウォレット接続状態を管理するためのステート
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // MIRトークンとクレームコントラクトの情報
  const MIR_TOKEN_ADDRESS = "0xd6F752fd03C00A673b5bE7f7E3028c269d1ba1d0";
  const MIR_CLAIM_CONTRACT_ADDRESS = "0x29048B068fA58a1cf104046D38ff49aa6E6fD399";
  
  // MIRトークンのABI（残高取得用）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const MIR_TOKEN_ABI = [
  //   {
  //     "name": "balanceOf",
  //     "type": "function",
  //     "stateMutability": "view",
  //     "inputs": [
  //       {
  //         "name": "account",
  //         "type": "address"
  //       }
  //     ],
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ]
  //   }
  // ];
  
  // クレームコントラクトのABI（必要な関数のみ）
  const MIR_CLAIM_ABI = [
    {
      "name": "claimTokens",
      "type": "function",
      "stateMutability": "nonpayable",
      "inputs": [
        {
          "name": "_level",
          "type": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ]
    },
    {
      "name": "canClaim",
      "type": "function",
      "stateMutability": "view",
      "inputs": [
        {
          "name": "_user",
          "type": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ]
    },
    {
      "name": "claimEnabled",
      "type": "function",
      "stateMutability": "view",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ]
    },
    {
      "name": "nextClaimTime",
      "type": "function",
      "stateMutability": "view",
      "inputs": [
        {
          "name": "_user",
          "type": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ]
    },
    {
      "name": "recordAdView",
      "type": "function",
      "stateMutability": "nonpayable",
      "inputs": [
        {
          "name": "_user",
          "type": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ]
    },
    {
      "name": "getAdViewCount",
      "type": "function",
      "stateMutability": "view",
      "inputs": [
        {
          "name": "_user",
          "type": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ]
    }
  ];
  
  // トランザクション状態管理
  const [isClaiming, setIsClaiming] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  // isProcessingはhandleWatchAd関数内で使用されているためコメントを追加
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);
  
  // hugeiconsのCSSを動的にロード
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.hugeicons.com/font/hgi-stroke-rounded.css';
    document.head.appendChild(link);
    
    return () => {
      // コンポーネントのアンマウント時にリンクを削除
      document.head.removeChild(link);
    };
  }, []);

  // ユーザーの保有MIR量を管理するためのステート変数を追加
  const [userMirBalance, setUserMirBalance] = useState<string>("0");
  const [isUpdatingBalance, setIsUpdatingBalance] = useState<boolean>(false);
  
  // コンポーネントのマウント時にウォレット接続状態を確認
  useEffect(() => {
    // ローカルストレージからウォレットアドレスを取得
    const storedWalletAddress = localStorage.getItem('wallet_address');
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
      setWalletConnected(true);
      
      // 実際のブロックチェーン上の残高を取得
      fetchMirBalance(storedWalletAddress);
    }
  }, []);

  // userIdが変更されたときに認証状態を更新
  useEffect(() => {
    console.log("認証状態が更新されました:", !!userId);
    
    // ユーザーが認証されてウォレットも接続されている場合、実際の残高を取得
    if (userId && walletAddress) {
      fetchMirBalance(walletAddress);
    }
  }, [userId, walletAddress]);
  
  // 次回クレーム時間をステートとして管理
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [activeTab, setActiveTab] = useState<"Claim" | "Train" | "Activity">("Claim");
  const [canClaim, setCanClaim] = useState(false);
  const [boostMultiplier] = useState(2.5); // Boost multiplier - setterは使用しないので削除
  const [avatarLevel] = useState(3); // Avatar level for Train tab
  const [currentXP, setCurrentXP] = useState(65); // Current XP percentage
  const [xpToNextLevel] = useState(35); // XP needed for next level - setterは使用しないので削除
  // totalXPForLevelは未使用のため削除
  const [trainSection, setTrainSection] = useState("Tasks"); // "Tasks" or "Connections"
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  // 削除成功のメッセージ表示用
  const [showClearSuccess, setShowClearSuccess] = useState(false);
  // 広告視聴完了ポップアップ用のステート
  const [showAdCompletedPopup, setShowAdCompletedPopup] = useState(false);
  
  // タスクストリーム関連の状態
  const [streamTasks, setStreamTasks] = useState<{
    id: string;
    title: string;
    description: string;
    category: string;
    reward: number;
    status: 'streaming' | 'matching' | 'matched' | 'rejected' | 'todo' | 'completed';
    matchProgress?: number;
    tags: string[];
    createdAt: Date;
  }[]>([]);

  // 現在処理中のタスクの状態
  const [currentTask, setCurrentTask] = useState<{
    id: string;
    title: string;
    description: string;
    category: string;
    reward: number;
    status: 'waiting' | 'matching' | 'matched' | 'rejected';
    matchProgress?: number;
    tags: string[];
  } | null>(null);

  // タスク処理中かどうかのフラグ
  const [isProcessingTask, setIsProcessingTask] = useState(false);

  // 処理待ちのタスクキュー
  const [taskQueue, setTaskQueue] = useState<{
    id: string;
    title: string;
    description: string;
    category: string;
    reward: number;
    tags: string[];
  }[]>([]);
  
  // 過去のエージェント活動ログ
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([
    {
      id: 'act-1',
      title: 'Media Consumption',
      category: 'Survey',
      timestamp: new Date(),
      status: 'in-progress',
      description: 'Analyzing media consumption patterns...',
      reward: 20,
      icon: 'clock'
    },
    {
      id: 'act-2',
      title: 'Browser History',
      category: 'Data',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2日前
      status: 'interrupted',
      description: 'Unable to access browser history data',
      reward: 25,
      icon: 'alert'
    },
    {
      id: 'act-3',
      title: 'Shopping Preferences',
      category: 'Survey',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2時間前
      status: 'completed',
      description: 'Provided data on shopping habits and preferences',
      reward: 15,
      icon: 'check'
    },
    {
      id: 'act-4',
      title: 'Location Data',
      category: 'Data',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5時間前
      status: 'completed',
      description: 'Shared anonymized location data',
      reward: 10,
      icon: 'check'
    },
    {
      id: 'act-5',
      title: 'App Usage Statistics',
      category: 'Analysis',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1日前
      status: 'completed',
      description: 'Analyzed app usage patterns and preferences',
      reward: 12,
      icon: 'check'
    }
  ]);
  
  // プリセットダミータスクデータ（50種類）
  const dummyTasks = [
    {
      title: "User Preference Analysis",
      description: "Analyze user preferences based on browsing history and interaction patterns.",
      category: "Data Analysis",
      tags: ["AI", "User Data", "Preferences"]
    },
    {
      title: "Shopping Pattern Recognition",
      description: "Identify shopping patterns and preferences to optimize recommendations.",
      category: "Data Analysis",
      tags: ["E-commerce", "Shopping", "Patterns"]
    },
    {
      title: "Media Consumption Survey",
      description: "Collect and analyze data about media consumption habits.",
      category: "Survey",
      tags: ["Media", "Content", "Habits"]
    },
    {
      title: "Location Data Collection",
      description: "Gather anonymized location data to improve location-based services.",
      category: "Data Collection",
      tags: ["Location", "GPS", "Privacy"]
    },
    {
      title: "Social Media Usage Analysis",
      description: "Analyze social media usage patterns to understand engagement trends.",
      category: "Data Analysis",
      tags: ["Social Media", "Engagement", "Trends"]
    },
    {
      title: "Content Engagement Metrics",
      description: "Track and analyze user engagement with various content types.",
      category: "Content Evaluation",
      tags: ["Content", "Engagement", "Metrics"]
    },
    {
      title: "App Usage Statistics",
      description: "Collect statistics on app usage to improve user experience.",
      category: "Data Analysis",
      tags: ["App", "Usage", "Statistics"]
    },
    {
      title: "Digital Footprint Analysis",
      description: "Analyze digital footprints to understand online behavior patterns.",
      category: "Data Analysis",
      tags: ["Digital", "Behavior", "Privacy"]
    },
    {
      title: "Browser History Insights",
      description: "Gain insights from browser history to improve browsing experience.",
      category: "Data Analysis",
      tags: ["Browser", "History", "Privacy"]
    },
    {
      title: "Behavioral Pattern Recognition",
      description: "Identify behavioral patterns to enhance personalized experiences.",
      category: "Data Analysis",
      tags: ["Behavior", "Patterns", "Personalization"]
    },
    {
      title: "Email Communication Analysis",
      description: "Analyze email communication patterns to optimize productivity.",
      category: "Data Analysis",
      tags: ["Email", "Communication", "Productivity"]
    },
    {
      title: "Exercise Routine Tracking",
      description: "Track and analyze exercise routines to provide personalized fitness recommendations.",
      category: "Lifestyle Activity",
      tags: ["Fitness", "Exercise", "Health"]
    },
    {
      title: "Sleep Pattern Analysis",
      description: "Monitor and analyze sleep patterns to improve overall sleep quality.",
      category: "Lifestyle Activity",
      tags: ["Sleep", "Health", "Wellness"]
    },
    {
      title: "Dietary Preferences Survey",
      description: "Collect information about dietary preferences to provide personalized nutrition advice.",
      category: "Survey",
      tags: ["Diet", "Nutrition", "Health"]
    },
    {
      title: "Reading Habits Analysis",
      description: "Analyze reading habits to recommend relevant content and improve reading experience.",
      category: "Content Evaluation",
      tags: ["Reading", "Books", "Content"]
    },
    {
      title: "Music Listening Patterns",
      description: "Track music listening patterns to enhance music recommendations.",
      category: "Media Consumption",
      tags: ["Music", "Entertainment", "Preferences"]
    },
    {
      title: "Video Viewing Behavior",
      description: "Analyze video viewing behavior to optimize content recommendations.",
      category: "Media Consumption",
      tags: ["Video", "Entertainment", "Viewing"]
    },
    {
      title: "Search Query Analysis",
      description: "Analyze search queries to improve search results and recommendations.",
      category: "Data Analysis",
      tags: ["Search", "Queries", "Optimization"]
    },
    {
      title: "Device Usage Patterns",
      description: "Monitor device usage patterns to enhance user experience across devices.",
      category: "Data Analysis",
      tags: ["Devices", "Usage", "Cross-platform"]
    },
    {
      title: "Financial Behavior Analysis",
      description: "Analyze financial behavior to provide personalized financial advice.",
      category: "Data Analysis",
      tags: ["Finance", "Spending", "Budgeting"]
    },
    {
      title: "Travel Preferences Survey",
      description: "Collect information about travel preferences to provide tailored travel recommendations.",
      category: "Survey",
      tags: ["Travel", "Preferences", "Tourism"]
    },
    {
      title: "Social Interaction Patterns",
      description: "Analyze social interaction patterns to improve social networking experiences.",
      category: "Data Analysis",
      tags: ["Social", "Interaction", "Networking"]
    },
    {
      title: "Learning Style Assessment",
      description: "Assess learning styles to provide optimized educational content.",
      category: "Survey",
      tags: ["Education", "Learning", "Assessment"]
    },
    {
      title: "Professional Skills Analysis",
      description: "Analyze professional skills to recommend career development opportunities.",
      category: "Data Analysis",
      tags: ["Career", "Skills", "Professional"]
    },
    {
      title: "News Consumption Patterns",
      description: "Track news consumption patterns to deliver personalized news content.",
      category: "Media Consumption",
      tags: ["News", "Media", "Information"]
    },
    {
      title: "Gaming Behavior Analysis",
      description: "Analyze gaming behavior to enhance gaming experiences and recommendations.",
      category: "Lifestyle Activity",
      tags: ["Gaming", "Entertainment", "Behavior"]
    },
    {
      title: "Productivity Tool Usage",
      description: "Monitor productivity tool usage to improve workflow efficiency.",
      category: "Data Analysis",
      tags: ["Productivity", "Tools", "Efficiency"]
    },
    {
      title: "Weather Preference Collection",
      description: "Collect weather preferences to provide personalized weather recommendations.",
      category: "Survey",
      tags: ["Weather", "Preferences", "Environment"]
    },
    {
      title: "Transportation Mode Analysis",
      description: "Analyze transportation modes to optimize travel recommendations.",
      category: "Data Analysis",
      tags: ["Transportation", "Travel", "Commute"]
    },
    {
      title: "Home Automation Preferences",
      description: "Collect home automation preferences to enhance smart home experiences.",
      category: "Survey",
      tags: ["Smart Home", "Automation", "IoT"]
    },
    {
      title: "Art and Design Preferences",
      description: "Analyze art and design preferences to curate personalized aesthetic experiences.",
      category: "Content Evaluation",
      tags: ["Art", "Design", "Aesthetics"]
    },
    {
      title: "Language Learning Progress",
      description: "Track language learning progress to provide optimized language learning content.",
      category: "Education",
      tags: ["Language", "Learning", "Education"]
    },
    {
      title: "Podcast Listening Behavior",
      description: "Analyze podcast listening behavior to improve podcast recommendations.",
      category: "Media Consumption",
      tags: ["Podcast", "Audio", "Content"]
    },
    {
      title: "Fitness Goal Tracking",
      description: "Track fitness goals to provide personalized workout recommendations.",
      category: "Lifestyle Activity",
      tags: ["Fitness", "Goals", "Health"]
    },
    {
      title: "Calendar Usage Patterns",
      description: "Analyze calendar usage patterns to optimize scheduling and productivity.",
      category: "Data Analysis",
      tags: ["Calendar", "Scheduling", "Productivity"]
    },
    {
      title: "Photo Taking Patterns",
      description: "Analyze photo taking patterns to enhance photography experiences.",
      category: "Lifestyle Activity",
      tags: ["Photography", "Photos", "Memories"]
    },
    {
      title: "Restaurant Preference Collection",
      description: "Collect restaurant preferences to provide personalized dining recommendations.",
      category: "Survey",
      tags: ["Dining", "Food", "Restaurants"]
    },
    {
      title: "Voice Assistant Interaction",
      description: "Analyze voice assistant interactions to improve voice-based experiences.",
      category: "Data Analysis",
      tags: ["Voice", "Assistant", "AI"]
    },
    {
      title: "Digital Content Creation",
      description: "Track digital content creation to provide personalized creative tools.",
      category: "Content Evaluation",
      tags: ["Creation", "Content", "Digital"]
    },
    {
      title: "Messaging Pattern Analysis",
      description: "Analyze messaging patterns to enhance communication experiences.",
      category: "Data Analysis",
      tags: ["Messaging", "Communication", "Social"]
    },
    {
      title: "Map Usage Behavior",
      description: "Analyze map usage behavior to improve navigation and location services.",
      category: "Data Analysis",
      tags: ["Maps", "Navigation", "Location"]
    },
    {
      title: "Network Connection Analysis",
      description: "Analyze network connection patterns to optimize connectivity services.",
      category: "Data Analysis",
      tags: ["Network", "Connection", "Internet"]
    },
    {
      title: "Notification Interaction Patterns",
      description: "Analyze notification interaction patterns to improve notification systems.",
      category: "Data Analysis",
      tags: ["Notifications", "Interaction", "UX"]
    },
    {
      title: "Screen Time Analysis",
      description: "Analyze screen time patterns to promote digital wellbeing.",
      category: "Lifestyle Activity",
      tags: ["Screen Time", "Digital Health", "Wellbeing"]
    },
    {
      title: "Password Management Behavior",
      description: "Analyze password management behavior to enhance security practices.",
      category: "Data Analysis",
      tags: ["Security", "Passwords", "Privacy"]
    },
    {
      title: "Subscription Service Usage",
      description: "Analyze subscription service usage to optimize subscription recommendations.",
      category: "Data Analysis",
      tags: ["Subscriptions", "Services", "Usage"]
    },
    {
      title: "Weather Impact on Activities",
      description: "Analyze how weather impacts daily activities to provide weather-aware recommendations.",
      category: "Data Analysis",
      tags: ["Weather", "Activities", "Planning"]
    },
    {
      title: "Public Transportation Usage",
      description: "Analyze public transportation usage to optimize transit recommendations.",
      category: "Data Analysis",
      tags: ["Transportation", "Public Transit", "Commute"]
    },
    {
      title: "Digital Payment Behavior",
      description: "Analyze digital payment behavior to enhance payment experiences.",
      category: "Data Analysis",
      tags: ["Payments", "Digital", "Finance"]
    },
    {
      title: "Remote Work Productivity",
      description: "Analyze remote work productivity to provide personalized work environment recommendations.",
      category: "Data Analysis",
      tags: ["Remote Work", "Productivity", "Work Environment"]
    },
    {
      title: "Cultural Event Preferences",
      description: "Collect cultural event preferences to provide personalized event recommendations.",
      category: "Survey",
      tags: ["Culture", "Events", "Entertainment"]
    }
  ];
  
  // 新しいタスクを生成する関数
  const generateNewTask = () => {
    // ランダムなダミータスクを選択
    const randomTaskTemplate = dummyTasks[Math.floor(Math.random() * dummyTasks.length)];
    
    const id = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return {
      id,
      title: randomTaskTemplate.title,
      description: randomTaskTemplate.description,
      category: randomTaskTemplate.category,
      reward: Math.floor(Math.random() * 30) + 5, // 5〜35 XP
      tags: randomTaskTemplate.tags
    };
  };
  
  // タスクストリームシミュレーション
  useEffect(() => {
    // クリーンアップ用の変数
    let taskGenerationInterval: NodeJS.Timeout;
    
    // アクティビティタブが表示されている場合のみタスク生成を行う
    if (activeTab === 'Activity') {
      // Activityタブが表示されたら即座に最初のタスクを生成
      if (taskQueue.length === 0 && !currentTask && !isProcessingTask) {
        const newTask = generateNewTask();
        setTaskQueue([newTask]);
        
        // すぐに処理を開始
        setTimeout(() => {
          processNextTask();
        }, 300); // 300ミリ秒後に処理開始（短い初期遅延）
      }
      
      // その後は定期的にタスクを生成
      taskGenerationInterval = setInterval(() => {
        const tasksToGenerate = Math.floor(Math.random() * 2) + 1; // 1〜2個のタスクを生成
        
        for (let i = 0; i < tasksToGenerate; i++) {
          const newTask = generateNewTask();
          setTaskQueue(prevQueue => [...prevQueue, newTask]);
        }
      }, 5000); // 5秒ごとに新しいタスクを生成（従来のまま）
    }
    
    return () => {
      clearInterval(taskGenerationInterval);
    };
  }, [activeTab, currentTask, isProcessingTask, taskQueue.length]);
  
  // タスク処理ロジック
  const processNextTask = () => {
    if (taskQueue.length === 0 || isProcessingTask || currentTask) {
      return;
    }
    
    setIsProcessingTask(true);
    
    // キューから最初のタスクを取り出し、現在のタスクとして設定
    const nextTask = taskQueue[0];
    setCurrentTask({
      ...nextTask,
      status: 'waiting'
    });
    
    // キューから取り出したタスクを削除
    setTaskQueue(prevQueue => prevQueue.slice(1));
    
    // タスク評価開始までの短い遅延（500ミリ秒→300ミリ秒に短縮）
    setTimeout(() => {
      // タスク評価プロセスを開始
      setCurrentTask(prev => prev ? { ...prev, status: 'matching', matchProgress: 0 } : null);
      
      // マッチング進捗をシミュレート
      const matchInterval = setInterval(() => {
        setCurrentTask(prev => {
          if (!prev || prev.status !== 'matching') {
            clearInterval(matchInterval);
            return prev;
          }
          
          const newProgress = (prev.matchProgress || 0) + 10; // 10%ずつ進捗（変更なし）
          
          if (newProgress >= 100) {
            clearInterval(matchInterval);
            
            // マッチング判定（50%の確率でマッチ）- 確率は従来のまま
            const isMatch = Math.random() < 0.5;
            
            // マッチング結果を表示
            return { 
              ...prev, 
              status: isMatch ? 'matched' : 'rejected',
              matchProgress: 100
            };
          }
          
          return { ...prev, matchProgress: newProgress };
        });
      }, 150); // 150ミリ秒ごとに進捗更新（少し高速化）
      
      // マッチング後の処理
      const evaluationDuration = 1800; // 1.8秒の評価時間（短縮）
      setTimeout(() => {
        setCurrentTask(prev => {
          if (!prev) return null;
          
          if (prev.status === 'matched') {
            // タスクをToDo状態で追加
            setStreamTasks(prevTasks => [
              ...prevTasks, 
              { 
                ...prev, 
                status: 'todo', 
                createdAt: new Date() 
              }
            ]);
          }
          
          return null; // 現在のタスクをクリア
        });
        
        // 次のタスクを処理する準備
        setTimeout(() => {
          setIsProcessingTask(false);
          
          // キューに次のタスクがあれば処理を継続
          if (taskQueue.length > 0) {
            processNextTask();
          }
        }, 500); // 次のタスク処理までの間隔（短縮）
        
      }, evaluationDuration);
      
    }, 300); // タスク評価開始までの遅延（短縮）
  };
  
  // タスクキューが変更されたとき、新しいタスクの処理を開始
  useEffect(() => {
    processNextTask();
  }, [taskQueue, processNextTask]);
  
  // タスクストリームシミュレーション
  useEffect(() => {
    // Activityタブが表示されているときのみシミュレーションを実行
    if (activeTab !== 'Activity') return;
    
    // 初期タスク
    const initialTasks = [
      {
        id: 'task-initial-1',
        title: 'Shopping Pattern Analysis',
        description: 'This task analyzes your online shopping habits and patterns to better understand your preferences.',
        category: 'Data Analysis',
        reward: 20,
        status: 'todo' as const,
        tags: ["Shopping", "E-commerce", "Patterns"],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1日前
      }
    ];
    
    setStreamTasks(initialTasks);
    
    // 5〜10秒ごとに新しいタスクをキューに追加
    const taskInterval = setInterval(() => {
      const newTask = generateNewTask();
      setTaskQueue(prev => [...prev, newTask]);
    }, Math.floor(Math.random() * 5000) + 5000); // 5〜10秒ごと
    
    return () => {
      clearInterval(taskInterval);
    };
  }, [activeTab]);
  
  // タスクを完了する
  const completeTask = (taskId: string) => {
    // 対象のタスクを探す
    const targetTask = streamTasks.find(task => task.id === taskId);
    if (!targetTask) return;
    
    // タスクを完了状態に更新
    setStreamTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed' } 
          : task
      )
    );
    
    // 完了した活動としてログに追加
    const newActivity: AgentActivity = {
      id: `act-${Date.now()}`,
      title: targetTask.title,
      category: targetTask.category,
      timestamp: new Date(),
      status: 'completed',
      description: `Completed: ${targetTask.description.slice(0, 40)}...`,
      reward: targetTask.reward,
      icon: 'check'
    };
    
    setAgentActivities(prev => [newActivity, ...prev]);
  };

  // コンポーネントマウント時に次回クレーム時間を取得
  useEffect(() => {
    // ローカルストレージから次回クレーム時間を取得
    const storedNextClaimTime = localStorage.getItem('nextClaimTime');
    if (storedNextClaimTime) {
      const nextTime = new Date(storedNextClaimTime);
      setNextClaimTime(nextTime);
      setCanClaim(false);
      console.log("次回クレーム時間を読み込みました:", nextTime.toISOString());
    } else {
      // 保存されたクレーム時間がない場合はクレーム可能
      setCanClaim(true);
      setTimeLeft("00:00:00");
    }
  }, []);

  // ウォレット接続時に残高を更新（シンプル版）
  useEffect(() => {
    if (walletConnected && walletAddress) {
      fetchMirBalance(walletAddress);
    }
  }, [walletConnected, walletAddress]);
  
  // トランザクション成功後に残高を更新するuseEffectをコメントアウト
  // useEffect(() => {
  //   if (transactionHash && walletAddress) {
  //     // トランザクション成功後、少し待ってから残高を更新
  //     const timeoutId = setTimeout(() => {
  //       fetchMirBalance(walletAddress);
  //     }, 3000);
  //     
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [transactionHash]);

  // ウォレット接続のシンプルな実装
  const connectWallet = async () => {
    // 接続中なら何もしない
    if (isConnecting) return;
    
    // World App MiniKitが利用可能か確認
    if (!window.MiniKit || !window.MiniKit.isInstalled || !window.MiniKit.isInstalled()) {
      setConnectionError("World App MiniKit not found. Please install World App and reload the browser.");
      return;
    }
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      console.log("Starting simple wallet connection...");
      
      // 最もシンプルな形式でwalletAuthを呼び出す
      const nonce = "randomnonce123456789";
      
      const { finalPayload } = await window.MiniKit.commandsAsync.walletAuth({
        nonce: nonce
      });
      
      console.log("Wallet auth result:", finalPayload);
      
      if (finalPayload.status === 'error') {
        setConnectionError("Wallet connection failed: " + (finalPayload.message || "Unknown error"));
        return;
      }
      
      // 認証成功
      setWalletConnected(true);
      setWalletAddress(finalPayload.address);
      
      // ローカルストレージに保存
      localStorage.setItem('wallet_address', finalPayload.address);
      
      // クレーム可能に設定
      setCanClaim(true);
      
      // ウォレット残高を取得
      fetchMirBalance(finalPayload.address);
      
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      setConnectionError("Wallet connection error: " + (error.message || "Unknown error"));
    } finally {
      setIsConnecting(false);
    }
  };

  // トークンのクレーム処理を実装
  const handleClaimTokens = async () => {
    console.log("handleClaimTokens called, wallet connected:", walletConnected);
    
    // ウォレット未接続時は接続処理を開始
    if (!walletConnected) {
      console.log("Wallet not connected, starting connection process");
      await connectWallet();
      return; // 接続後、再度ボタンを押してもらう
    }
    
    console.log("Wallet connected, proceeding with claim");
    
    // MVPのため常にクレーム可能なのでこのチェックは不要
    // if (!canClaim) {
    //   console.log("Cannot claim, in cooldown period");
    //   return;
    // }
    
    // 既にトランザクション処理中なら何もしない
    if (isClaiming) {
      console.log("Already processing a claim transaction");
      return;
    }
    
    console.log("Processing claim transaction...");
    setIsClaiming(true);
    setTransactionError(null);
    
    try {
      // 現在のアバターレベルでクレーム
      const userLevel = avatarLevel.toString();
      console.log(`Claiming tokens with level ${userLevel}`);
      
      // ===== 本番環境: 実際のトランザクション処理 =====
      if (!window.MiniKit || !window.MiniKit.commandsAsync || !window.MiniKit.commandsAsync.sendTransaction) {
        throw new Error("World App MiniKit sendTransaction function not available");
      }
      
      console.log("Sending real transaction to blockchain...");
      console.log("Contract address:", MIR_CLAIM_CONTRACT_ADDRESS);
      console.log("ABI:", MIR_CLAIM_ABI);
      console.log("Function:", 'claimTokens');
      console.log("Args:", [userLevel]);
      
      // 公式ドキュメントに準拠したトランザクション形式
      const { finalPayload } = await window.MiniKit.commandsAsync.sendTransaction({
        transaction: [{
          address: MIR_CLAIM_CONTRACT_ADDRESS,
          abi: MIR_CLAIM_ABI,
          functionName: 'claimTokens',
          args: [userLevel]
        }]
      });
      
      console.log("Transaction response:", finalPayload);
      
      if (finalPayload.status === 'error') {
        console.error("Transaction error details:", finalPayload);
        throw new Error(finalPayload.error_code || finalPayload.message || "Transaction failed");
      }
      
      // トランザクションが成功
      const txHash = finalPayload.transaction_id;
      setTransactionHash(txHash);
      console.log("Transaction successful:", txHash);
      
      // UI上で成功アニメーションを表示
      // クレームの基本量に(avatarLevel / 2 + 1)を乗じた値
      const baseClaimAmount = 10; // 基本クレーム量
      const calculatedBoost = (avatarLevel / 2 + 1);
      const boostedAmount = Math.floor(baseClaimAmount * calculatedBoost);
      
      // 残高が更新されるまでポーリングを開始
      fetchMirBalanceWithRetry(walletAddress || '', boostedAmount);
      
      // MIR残高を更新（ユーザー体験向上のため、バックグラウンドでの残高更新を待たずに表示を先に更新）
      setUserMirBalance(prev => {
        const currentBalance = parseFloat(prev) || 0;
        return (currentBalance + boostedAmount).toFixed(2);
      });
      
      console.log(`Claimed ${boostedAmount} MIR tokens (development mode)`);
      
      // クールダウン設定（24時間）
      const cooldownPeriod = 86400000; // 24時間（ミリ秒）
      const nextTime = new Date(Date.now() + cooldownPeriod);
      setNextClaimTime(nextTime);
      setCanClaim(false);
      setTimeLeft("24:00:00");
      
      // ローカルストレージに保存
      localStorage.setItem('nextClaimTime', nextTime.toISOString());
      
      console.log("Claim completed successfully, next claim time:", nextTime.toISOString());
      
      // MVPのためクールダウン設定を削除
      // const cooldownPeriod = 86400000;
      // const nextTime = new Date(Date.now() + cooldownPeriod);
      // setNextClaimTime(nextTime);
      // setCanClaim(false);
      
      // ローカルストレージに保存
      // localStorage.setItem('nextClaimTime', nextTime.toISOString());
      
      console.log("Claim completed successfully");
    } catch (error: any) {
      console.error("Claim transaction error:", error);
      
      // エラーメッセージをより詳細に
      let errorMessage = "Failed to claim tokens";
      
      if (error.message && error.message.includes("invalid_contract")) {
        errorMessage = "コントラクトがWorld App開発者ポータルに登録されていません。コントラクトアドレスを登録してください。";
      } else if (error.message && error.message.includes("simulation_failed")) {
        errorMessage = "トランザクションシミュレーションに失敗しました。以下の可能性があります：\n1) コントラクトのトークン残高が不足\n2) クレーム機能が無効化されている";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setTransactionError(errorMessage);
    } finally {
      setIsClaiming(false);
    }
  };
  
  // nextClaimTimeが変更されたときにタイマーを開始/更新
  useEffect(() => {
    // タイマー管理のロジックを復活
    if (!nextClaimTime) return;
    
    // 残り時間を計算
    const updateTimeLeft = () => {
      const currentTime = new Date();
      const timeDiff = nextClaimTime.getTime() - currentTime.getTime();
      
      if (timeDiff <= 0) {
        // タイマーが正確に0か0より小さくなったときのみクレーム可能に
        setTimeLeft("00:00:00");
        setCanClaim(true);
        setNextClaimTime(null);
        localStorage.removeItem('nextClaimTime');
        return;
      }
      
      // 残り時間をHH:MM:SS形式に変換
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
      
      setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      
      // タイマーが進行中の間はクレーム不可
      setCanClaim(false);
    };
    
    // 初回実行
    updateTimeLeft();
    
    // タイマーを1秒ごとに更新
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
    
    // MVPのため常にクレーム可能に設定
    // setCanClaim(true);
  }, [nextClaimTime]); // nextClaimTimeが変更されたときに再実行

  // タスクの展開状態を切り替える
  const toggleTaskExpansion = (taskId: string | null) => {
    setExpandedTask(taskId === expandedTask ? null : taskId);
  };

  // 新しい階層型のタスクデータ構造
  type Question = {
    id: string;
    text: string;
    xp: number;
    isCompleted: boolean;
    answer?: string;
    type: "radio" | "text"; // 回答タイプ: ラジオボタンかテキスト入力か
    options?: string[]; // ラジオボタン用の選択肢
  };

  type TaskCategory = {
    id: string;
    name: string;
    icon: string; // アイコンのカラーコード
    questions: Question[];
    completedCount: number;
  };

  // サンプルのタスクデータ
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([
    {
      id: "basic_info",
      name: "Basic Info",
      icon: "bg-indigo-500",
      completedCount: 0,
      questions: [
        { 
          id: "gender", 
          text: "Gender", 
          xp: 2, 
          isCompleted: false,
          type: "radio",
          options: ["Male", "Female", "Other", "Prefer not to say"]
        },
        { 
          id: "age", 
          text: "Age", 
          xp: 2, 
          isCompleted: false,
          type: "radio",
          options: ["Under 18", "18-24", "25-34", "35-44", "45-54", "55+"]
        },
        { 
          id: "location", 
          text: "Region", 
          xp: 2, 
          isCompleted: false,
          type: "radio",
          options: ["North America", "Europe", "Asia", "South America", "Africa", "Oceania", "Middle East"]
        },
      ],
    },
    {
      id: "favorites",
      name: "Favorites",
      icon: "bg-amber-500",
      completedCount: 0,
      questions: [
        { 
          id: "food", 
          text: "Favorite Food", 
          xp: 3, 
          isCompleted: false,
          type: "text" 
        },
        { 
          id: "sport", 
          text: "Favorite Sport", 
          xp: 3, 
          isCompleted: false,
          type: "radio",
          options: ["Soccer", "Baseball", "Basketball", "Tennis", "Swimming", "Running", "Yoga", "Other", "I don't play sports"]
        },
      ],
    },
    {
      id: "survey",
      name: "Survey",
      icon: "bg-gray-500",
      completedCount: 0,
      questions: [
        { 
          id: "ai_model", 
          text: "Which AI model do you use most?", 
          xp: 5, 
          isCompleted: false,
          type: "radio",
          options: ["GPT-4", "Claude", "Gemini", "Midjourney", "Stable Diffusion", "Dall-E", "Other", "I don't use AI"]
        },
      ],
    },
  ]);

  // 回答ポップアップ用のステート
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState("");

  // 質問に回答するハンドラー
  const handleAnswerQuestion = () => {
    if (!currentQuestion || !currentCategoryId || !answerInput.trim()) return;

    // タスクカテゴリーの更新
    setTaskCategories(prev => 
      prev.map(category => {
        if (category.id === currentCategoryId) {
          // カテゴリー内の質問を更新
          const updatedQuestions = category.questions.map(q => {
            if (q.id === currentQuestion.id) {
              return { ...q, isCompleted: true, answer: answerInput };
            }
            return q;
          });

          // 完了した質問の数をカウント
          const completedCount = updatedQuestions.filter(q => q.isCompleted).length;

          return { 
            ...category, 
            questions: updatedQuestions,
            completedCount
          };
        }
        return category;
      })
    );

    // XPを更新
    setCurrentXP(prev => prev + currentQuestion.xp);

    // モーダルを閉じて状態をリセット
    setShowAnswerModal(false);
    setAnswerInput("");
    setCurrentQuestion(null);
    setCurrentCategoryId(null);
  };

  // 質問をクリックした時のハンドラー
  const handleQuestionClick = (categoryId: string, question: Question) => {
    setCurrentCategoryId(categoryId);
    setCurrentQuestion(question);
    setAnswerInput(question.answer || "");
    setShowAnswerModal(true);
  };

  // 接続済みサービスを管理するためのステート
  const [connectedServices, setConnectedServices] = useState<Record<string, boolean>>({
    x: false,
    discord: false,
    instagram: false,
    telegram: false,
    youtube: false,
    github: false,
  });

  // サービス接続状態を切り替える関数
  const toggleServiceConnection = (serviceName: string) => {
    setConnectedServices(prev => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
  };

  // トランザクションハッシュの表示時間管理
  useEffect(() => {
    if (transactionHash) {
      // 15秒後にトランザクションハッシュの表示をクリア
      const timer = setTimeout(() => {
        setTransactionHash(null);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [transactionHash]);
  
  // トランザクションエラーの表示時間管理
  useEffect(() => {
    if (transactionError) {
      // 10秒後にエラーメッセージをクリア
      const timer = setTimeout(() => {
        setTransactionError(null);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [transactionError]);

  // MIRトークン残高を取得する関数
  const fetchMirBalance = async (address: string) => {
    if (!address) return;
    
    setIsUpdatingBalance(true);
    
    try {
      console.log("MIRトークン残高を取得中...");
      
      // World App MiniKitの読み取り専用呼び出しを使用（ユーザーに承認を求めない）
      // メソッド: ethCall - これはJSONファイルで指定されたRPC URLに直接呼び出すため承認不要
      if (!window.MiniKit || !window.MiniKit.commandsAsync) {
        throw new Error("World App MiniKit not available");
      }

      // ethCallメソッドを使用して残高を取得（存在していると仮定）
      const { finalPayload } = await window.MiniKit.commandsAsync.ethCall({
        to: MIR_TOKEN_ADDRESS,
        // balanceOf関数のABIエンコーディング: function signature hash + パディング付きアドレス
        data: `0x70a08231000000000000000000000000${address.replace(/^0x/, '')}`
      });
      
      console.log("MIR balance response:", finalPayload);
      
      if (finalPayload.status === 'error') {
        console.error("MIR balance error:", finalPayload);
        throw new Error(finalPayload.message || "残高取得に失敗しました");
      }
      
      // 結果がBigNumberまたは16進数の文字列になるのでデコード
      let balance;
      if (finalPayload.result) {
        // 16進数の文字列の場合は10進数に変換
        if (typeof finalPayload.result === 'string' && finalPayload.result.startsWith('0x')) {
          balance = parseInt(finalPayload.result, 16);
        } else {
          balance = Number(finalPayload.result);
        }
        
        // Wei単位からEther単位に変換（18桁の小数点移動）
        balance = balance / 10**18;
        
        // 小数点2桁まで表示
        const formattedBalance = balance.toFixed(2);
        setUserMirBalance(formattedBalance);
        console.log("MIR balance updated:", formattedBalance);
      } else {
        // 結果がない場合はゼロを設定
        setUserMirBalance("0.00");
        console.log("MIR balance is zero or not available");
      }
    } catch (error) {
      console.error("Error fetching MIR balance:", error);
      
      // ethCallが存在しない場合は、代替手段としてRPC URLへの直接リクエストを試みる
      try {
        console.log("Falling back to direct RPC call");
        const rpcUrl = "https://worldchain-mainnet.g.alchemy.com/v2/MnQ8dUniBLMABxOq-QQjFJB4rVr2Zq73";
        
        const jsonRpcPayload = {
          jsonrpc: "2.0",
          id: 1,
          method: "eth_call",
          params: [
            {
              to: MIR_TOKEN_ADDRESS,
              data: `0x70a08231000000000000000000000000${address.replace(/^0x/, '')}`
            },
            "latest"
          ]
        };
        
        const response = await fetch(rpcUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonRpcPayload)
        });
        
        if (!response.ok) {
          throw new Error(`RPC error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(`RPC error: ${data.error.message}`);
        }
        
        // 16進数の結果を10進数に変換
        if (data.result) {
          const balance = parseInt(data.result, 16);
          const etherBalance = balance / 10**18;
          const formattedBalance = etherBalance.toFixed(2);
          setUserMirBalance(formattedBalance);
          console.log("MIR balance updated via direct RPC:", formattedBalance);
        }
      } catch (rpcError) {
        console.error("Direct RPC call also failed:", rpcError);
        // エラーの場合も古い値を保持
      }
    } finally {
      setIsUpdatingBalance(false);
    }
  };
  
  // 残高が更新されるまでポーリングを行う関数を追加
  const fetchMirBalanceWithRetry = async (address: string, expectedIncrease: number, maxRetries = 10) => {
    // 現在の残高を数値として保存
    const initialBalance = parseFloat(userMirBalance);
    let retryCount = 0;
    
    // ポーリング処理を行う関数
    const checkBalance = async () => {
      if (retryCount >= maxRetries) {
        console.log("残高更新の最大試行回数に達しました");
        return;
      }
      
      retryCount++;
      await fetchMirBalance(address);
      
      // 現在の残高を取得して数値比較
      const currentBalance = parseFloat(userMirBalance);
      
      // 期待する増加があったかどうかを確認
      if (currentBalance >= initialBalance + expectedIncrease) {
        console.log("残高が正常に更新されました:", currentBalance);
        return;
      } else {
        // まだ増加していない場合は再試行
        console.log(`残高更新を待機中... 試行回数: ${retryCount}/${maxRetries}`);
        setTimeout(checkBalance, 1000); // 1秒ごとに再試行（より頻繁に確認するため変更）
      }
    };
    
    // 初回実行
    await checkBalance();
  };
  
  // 定期的に残高を更新
  useEffect(() => {
    if (walletConnected && walletAddress) {
      // 初回の残高取得
      fetchMirBalance(walletAddress);
      
      // 残高の自動更新は不要なため、コメントアウト
      // // 30秒ごとに自動更新（バックグラウンドで残高を更新）
      // const intervalId = setInterval(() => {
      //   if (walletConnected && walletAddress) {
      //     fetchMirBalance(walletAddress);
      //   }
      // }, 30000); // 30秒間隔
      // 
      // return () => clearInterval(intervalId);
    }
  }, [walletConnected, walletAddress]);

  // 広告視聴の処理
  const handleWatchAd = async () => {
    try {
      console.log("広告視聴処理を開始します");
      setIsProcessing(true);
      
      // 広告視聴完了ポップアップを表示
      setShowAdCompletedPopup(true);
      
      // 本番環境ではここで実際の広告サービスのAPIを呼び出す
      
      // 広告視聴完了をシミュレート（実際にはここで広告視聴確認を行う）
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // クールダウン時間を1時間短縮
      if (nextClaimTime) {
        // 現在の次回クレーム時間から1時間（3600000ミリ秒）を引く
        const newNextClaimTime = new Date(nextClaimTime.getTime() - 3600000);
        const currentTime = new Date();
        
        // 新しいクレーム時間が現在時刻より前の場合は、即時クレーム可能にする
        if (newNextClaimTime <= currentTime) {
          setNextClaimTime(null);
          setCanClaim(true);
          setTimeLeft("00:00:00");
          localStorage.removeItem('nextClaimTime');
        } else {
          // そうでなければ新しいクレーム時間を設定
          setNextClaimTime(newNextClaimTime);
          localStorage.setItem('nextClaimTime', newNextClaimTime.toISOString());
        }
      }
      
      console.log("広告視聴完了、クールダウン時間が短縮されました");
    } catch (error) {
      console.error("広告視聴処理中にエラーが発生しました:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // ローカルストレージのデータをクリア
  const clearLocalData = () => {
    localStorage.removeItem('world_user_id');
    localStorage.removeItem('nextClaimTime');
    localStorage.removeItem('has_seen_welcome');
    localStorage.removeItem('wallet_address'); // ウォレットアドレスも削除
    // current_user_idは削除しない（ログアウトになるため）
    
    // クレーム状態をリセット
    setNextClaimTime(null);
    setCanClaim(true); // 開発テスト用にクレーム可能に
    setTimeLeft("00:00:00");
    
    // ウォレット接続状態をリセット
    setWalletConnected(false);
    setWalletAddress(null);
    setUserMirBalance("0");
    
    // 成功メッセージを表示
    setShowClearSuccess(true);
    
    // 3秒後に成功メッセージを非表示
    setTimeout(() => {
      setShowClearSuccess(false);
    }, 3000);
  };

  // メインコンテナ部分
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white">
      {/* Status bar */}
      <div className="w-full h-4"></div>

      {/* 広告視聴完了ポップアップ */}
      {showAdCompletedPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl border border-gray-200 z-50 max-w-xs w-full text-center animate-fadeIn">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Ad Viewing Completed!</h3>
          <p className="text-gray-600 mb-4">Your cooldown time has been reduced by 1 hour.</p>
          <button 
            className="w-full py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-300"
            onClick={() => setShowAdCompletedPopup(false)}
          >
            Close
          </button>
        </div>
      )}

      {/* 左上に開発用のデータ削除ボタンを配置 */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={clearLocalData}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md flex items-center justify-center"
          title="開発用：ローカルデータを削除"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
        
        {/* 削除成功メッセージ */}
        {showClearSuccess && (
          <div className="absolute top-12 left-0 bg-green-100 text-green-800 px-3 py-2 rounded-md text-xs whitespace-nowrap shadow-md z-20">
            ローカルデータを削除しました
          </div>
        )}
      </div>

      {/* Header with MIR count and logout */}
      <div className="w-full px-4 md:px-6 py-4 flex justify-between items-center">
        {/* Logout button */}
        <button
          onClick={() => {
            // ローカルストレージをクリア
            localStorage.removeItem('world_user_id');
            localStorage.removeItem('nextClaimTime');
            localStorage.removeItem('current_user_id');
            localStorage.removeItem('wallet_address'); // ウォレットアドレスも削除
            // その他必要に応じてローカルストレージをクリア
            
            // 認証状態をリセット
            // authenticated変数は削除したのでここでの設定も削除
            // setAuthenticated(false);
            setWalletConnected(false);
            setWalletAddress(null);
            
            // 親コンポーネントに通知
            if (onAuth) onAuth('');
            
            // リロード
            window.location.reload();
          }}
          className="text-sm text-slate-600 hover:text-slate-800 flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Logout
        </button>
        
        {/* MIR balance or Connect Wallet button */}
        {walletConnected ? (
          <div className="border border-gray-200 rounded-full py-1 px-3 flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <img src="/images/token.png" alt="MIR Token" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold">
              {isUpdatingBalance ? (
                <span className="font-bold text-lg">{userMirBalance}</span>
              ) : (
                <span className="font-bold text-lg">{userMirBalance}</span>
              )}
            </span>
            <button 
              onClick={() => fetchMirBalance(walletAddress || '')}
              className="text-gray-500 hover:text-gray-700"
              title="残高を更新"
              disabled={isUpdatingBalance}
            >
              <svg className={`w-4 h-4 ${isUpdatingBalance ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 13.9917 3.22426C12.5089 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1112 10.0083 20.7757C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className={`py-1 px-3 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              isConnecting 
                ? "bg-gray-200 text-gray-500 cursor-wait"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {isConnecting ? (
              <>
                <LoaderIcon className="h-4 w-4 text-gray-500 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <i className="hgi-stroke hgi-wallet text-white"></i>
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Tabs - now with 3 tabs */}
      <div className="w-full px-4 md:px-6 py-2 grid grid-cols-3 gap-2">
        <button
          className={`py-3 rounded-xl text-center font-medium text-sm transition-colors duration-200 ${
            activeTab === "Claim" 
              ? "bg-black text-white opacity-100 border-2 border-white/20" 
              : "bg-white text-gray-500 border border-gray-200"
          }`}
          onClick={() => setActiveTab("Claim")}
        >
          Claim
        </button>
        <button
          className={`py-3 rounded-xl text-center font-medium text-sm transition-colors duration-200 ${
            activeTab === "Train" 
              ? "bg-black text-white opacity-100 border-2 border-white/20" 
              : "bg-white text-gray-500 border border-gray-200"
          }`}
          onClick={() => setActiveTab("Train")}
        >
          Train
        </button>
        <button
          className={`py-3 rounded-xl text-center font-medium text-sm transition-colors duration-200 ${
            activeTab === "Activity" 
              ? "bg-black text-white opacity-100 border-2 border-white/20" 
              : "bg-white text-gray-500 border border-gray-200"
          }`}
          onClick={() => setActiveTab("Activity")}
        >
          Activity
        </button>
      </div>

      {/* Main content - 全てのタブのコンテンツに白背景を指定 */}
      <div className="flex-1 w-full bg-white">
        {activeTab === "Claim" ? (
          <div className="w-full flex flex-col items-center justify-center py-8 px-4 md:px-6">
            {/* Gold coin */}
            <div className="w-24 h-24 flex items-center justify-center mb-8">
              <img src="/images/token.png" alt="MIR Token" className="w-24 h-24 object-contain" />
            </div>

            {/* Timer */}
            <div className="text-6xl font-bold text-slate-800 mb-8">
              {timeLeft}
            </div>

            {/* Ad watching button with -1h indicator */}
            <button 
              className={`bg-white hover:bg-white border border-gray-200 text-slate-800 font-semibold py-2 px-4 rounded-full shadow-sm flex items-center gap-3 mb-8 ${!nextClaimTime ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleWatchAd}
              disabled={!nextClaimTime}
            >
              <div className="flex items-center">
                <i className="hgi-stroke hgi-youtube text-red-600 text-xl"></i>
              </div>
              <span>Watch Ad</span>
              <div className="flex items-center gap-1 border border-green-200 py-0.5 px-2 rounded-full text-green-600">
                <ClockIcon className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-bold text-xs">-1h</span>
              </div>
            </button>

            {/* Token Claim Button */}
            <div className="w-full px-8 mb-8">
              <button
                className={`w-full h-12 rounded-xl font-medium text-base transition-all duration-300 ${
                  isConnecting
                    ? "bg-gray-300 text-gray-500 cursor-wait"
                    : isClaiming
                    ? "bg-amber-500 text-white border border-white/20 shadow-md"
                    : !walletConnected
                    ? "bg-black text-white border border-white/20 shadow-md hover:bg-gray-800"
                    : canClaim
                    ? "bg-black text-white border border-white/20 shadow-md hover:bg-gray-800"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={isConnecting || isClaiming || (!walletConnected ? false : !canClaim)}
                onClick={handleClaimTokens}
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoaderIcon className="h-5 w-5 text-gray-500 animate-spin" />
                    <span>Connecting wallet...</span>
                  </div>
                ) : isClaiming ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoaderIcon className="h-5 w-5 text-white animate-spin" />
                    <span>Processing transaction...</span>
                  </div>
                ) : !walletConnected ? (
                  "Connect wallet to claim"
                ) : (
                  `Claim (x${boostMultiplier})`
                )}
              </button>
              
              {connectionError && (
                <div className="text-xs text-red-500 mt-2 text-center">
                  {connectionError}
                </div>
              )}
              
              {transactionError && (
                <div className="text-xs text-red-500 mt-2 text-center">
                  Transaction error: {transactionError}
                </div>
              )}
              
              {transactionHash && (
                <div className="text-xs text-green-500 mt-2 text-center">
                  Transaction successful! Hash: {transactionHash.slice(0, 8)}...{transactionHash.slice(-6)}
                </div>
              )}
              
              {walletConnected && walletAddress && (
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              )}
            </div>
            
            {/* Exchange Section */}
            <div className="w-full px-4 pb-8 z-10">
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <img src="/images/token.png" alt="MIR Token" className="w-12 h-12 object-contain" />
                    </div>
                    <div>
                      <div className="font-bold text-xl">MIR</div>
                      <div className="text-gray-500">MIR</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">$0.0028</div>
                    <div className="text-red-500">▼ 2.82%</div>
                  </div>
                </div>

                <button 
                  className="w-full bg-white text-slate-900 py-3 rounded-lg flex items-center justify-center gap-2 font-bold border border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!walletConnected}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-900">
                    <path d="M7.5 21L3 16.5M3 16.5L7.5 12M3 16.5H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 3L21 7.5M21 7.5L16.5 12M21 7.5H7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Exchange
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === "Train" ? (
          <div className="w-full flex flex-col items-center pt-8 px-4 md:px-6 bg-white">
            {/* Agent avatar with level indicator - レイアウト変更 */}
            <div className="mb-4">
              <div className="w-28 h-28 bg-black rounded-full flex items-center justify-center shadow-lg">
                <RobotIcon className="text-white h-16 w-16" />
              </div>
            </div>
            
            {/* Level badge - 独立したセクションに変更 */}
            <div className="mb-4">
              <div className="bg-black text-white px-4 py-1 rounded-full flex items-center justify-center shadow-md border border-white/20">
                <span className="font-bold text-sm">Level {avatarLevel}</span>
              </div>
            </div>

            {/* Progress bar with XP indicator */}
            <div className="w-full px-4 md:px-6 mb-8">
              <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-black font-medium">Level {avatarLevel}</span>
                  <div className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                    x{(avatarLevel / 2 + 1).toFixed(1)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="border border-black text-black text-xs font-bold px-2 py-1 rounded-full">
                    +{xpToNextLevel}XP
                  </div>
                </div>
              </div>
              <div className="w-full border border-gray-200 h-3 rounded-full overflow-hidden">
                <div className="h-full bg-black transition-all duration-500" style={{ width: `${currentXP}%` }} />
              </div>
            </div>

            {/* Section Tabs */}
            <div className="w-full mb-4 border-b border-gray-200">
              <div className="flex">
                <button
                  className={`flex-1 py-3 font-medium text-sm transition-colors duration-200 ${
                    trainSection === "Tasks" 
                      ? "text-white bg-black rounded-t-lg" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setTrainSection("Tasks")}
                >
                  Tasks
                </button>
                <button
                  className={`flex-1 py-3 font-medium text-sm transition-colors duration-200 ${
                    trainSection === "Connections" 
                      ? "text-white bg-black rounded-t-lg" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setTrainSection("Connections")}
                >
                  Connections
                </button>
              </div>
            </div>

            {/* Tasks Section */}
            {trainSection === "Tasks" && (
              <div className="w-full space-y-4 pb-8">
                {taskCategories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="flex items-center cursor-pointer" onClick={() => toggleTaskExpansion(category.id === expandedTask ? null : category.id)}>
                      {category.id === "basic_info" ? (
                        <div className="p-4 flex items-center justify-center">
                          <i className="hgi-stroke hgi-user-question-01 text-black text-xl"></i>
                        </div>
                      ) : category.id === "favorites" ? (
                        <div className="p-4 flex items-center justify-center">
                          <i className="hgi-stroke hgi-favourite text-black text-xl"></i>
                        </div>
                      ) : category.id === "survey" ? (
                        <div className="p-4 flex items-center justify-center">
                          <i className="hgi-stroke hgi-document-attachment text-black text-xl"></i>
                        </div>
                      ) : (
                        <div className={`${category.icon} p-4 flex items-center justify-center`}>
                          <ClockIcon className="text-white h-6 w-6" />
                        </div>
                      )}
                      <div className="flex-1 px-4 py-3">
                        <div className="font-semibold">{category.name}</div>
                        <div className="text-xs text-slate-500">
                          {category.completedCount}/{category.questions.length} Completed
                        </div>
                      </div>
                      <div className="pr-3">
                        <div className="border border-black text-black text-xs font-bold px-2 py-1 rounded-full">
                          +{category.questions.reduce((sum, q) => sum + q.xp, 0)} XP
                        </div>
                      </div>
                      <button className="border-l border-gray-200 p-3">
                        <ChevronDownIcon
                          className={`h-5 w-5 text-slate-500 transition-transform ${expandedTask === category.id ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Expanded QA list */}
                    {expandedTask === category.id && (
                      <div className="border-t border-slate-100 px-4 py-2 bg-white">
                        <div className="space-y-2">
                          {category.questions.map((question) => (
                            <div key={question.id} className="flex flex-col py-2 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                {question.isCompleted ? (
                                  <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                                ) : (
                                  <div className="h-4 w-4 border border-slate-300 rounded-full flex-shrink-0"></div>
                                )}
                                <span className={`text-sm ${question.isCompleted ? "text-slate-500" : "text-slate-800"}`}>
                                  {question.text}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-2 ml-6">
                                <div className="border border-black text-black text-xs font-bold px-2 py-1 rounded-full">+{question.xp} XP</div>
                                {!question.isCompleted && (
                                  <button 
                                    className="bg-black text-white text-xs px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuestionClick(category.id, question);
                                    }}
                                  >
                                    Answer
                                  </button>
                                )}
                                {question.isCompleted && question.answer && (
                                  <div className="flex-1 text-xs text-slate-500 bg-gray-50 p-2 rounded border border-gray-100">
                                    <span className="font-medium text-slate-700">Answer:</span> {question.answer}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Connections Section */}
            {trainSection === "Connections" && (
              <div className="space-y-4 mt-2 pb-8">
                {/* X (formerly Twitter) */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" fill="white"/>
                        </svg>
                      </div>
                      <span className="font-medium">X</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="border border-black text-black text-xs font-bold px-2 py-1 rounded-full">
                        +20 XP
                      </div>
                      <button 
                        onClick={() => toggleServiceConnection('x')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          connectedServices.x 
                            ? "bg-green-500 text-white" 
                            : "bg-black text-white"
                        }`}
                      >
                        {connectedServices.x ? "Connected" : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Discord */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <i className="hgi-stroke hgi-discord text-white text-lg"></i>
                      </div>
                      <span className="font-medium">Discord</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="border border-black text-black text-xs font-bold px-2 py-1 rounded-full">
                        +15 XP
                      </div>
                      <button 
                        onClick={() => toggleServiceConnection('discord')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          connectedServices.discord 
                            ? "bg-green-500 text-white" 
                            : "bg-black text-white"
                        }`}
                      >
                        {connectedServices.discord ? "Connected" : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Instagram */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center">
                        <i className="hgi-stroke hgi-instagram text-white text-lg"></i>
                      </div>
                      <span className="font-medium">Instagram</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="border border-black text-black text-xs font-bold px-2 py-1 rounded-full">
                        +25 XP
                      </div>
                      <button 
                        onClick={() => toggleServiceConnection('instagram')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          connectedServices.instagram 
                            ? "bg-green-500 text-white" 
                            : "bg-black text-white"
                        }`}
                      >
                        {connectedServices.instagram ? "Connected" : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Telegram */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <i className="hgi-stroke hgi-telegram text-white text-lg"></i>
                      </div>
                      <span className="font-medium">Telegram</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="border border-black text-black text-xs font-bold px-2 py-1 rounded-full">
                        +10 XP
                      </div>
                      <button 
                        onClick={() => toggleServiceConnection('telegram')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          connectedServices.telegram 
                            ? "bg-green-500 text-white" 
                            : "bg-black text-white"
                        }`}
                      >
                        {connectedServices.telegram ? "Connected" : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* YouTube */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <i className="hgi-stroke hgi-youtube text-white text-lg"></i>
                      </div>
                      <span className="font-medium">YouTube</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="border border-black text-black text-xs font-bold px-2 py-1 rounded-full">
                        +30 XP
                      </div>
                      <button 
                        onClick={() => toggleServiceConnection('youtube')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          connectedServices.youtube 
                            ? "bg-green-500 text-white" 
                            : "bg-black text-white"
                        }`}
                      >
                        {connectedServices.youtube ? "Connected" : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Github */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                        <i className="hgi-stroke hgi-github text-white text-lg"></i>
                      </div>
                      <span className="font-medium">Github</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="border border-black text-black text-xs font-bold px-2 py-1 rounded-full">
                        +25 XP
                      </div>
                      <button 
                        onClick={() => toggleServiceConnection('github')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          connectedServices.github 
                            ? "bg-green-500 text-white" 
                            : "bg-black text-white"
                        }`}
                      >
                        {connectedServices.github ? "Connected" : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 回答ポップアップモーダル */}
            {showAnswerModal && currentQuestion && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6">
                <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md shadow-xl">
                  <h3 className="text-xl font-bold mb-6 text-center">{currentQuestion.text}</h3>
                  
                  {currentQuestion.type === "radio" && currentQuestion.options && (
                    <div className="mb-6">
                      <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                          <div 
                            key={index} 
                            className={`flex items-center border rounded-lg p-4 cursor-pointer transition-colors ${
                              answerInput === option 
                                ? "border-black bg-gray-50" 
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            onClick={() => setAnswerInput(option)}
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              answerInput === option 
                                ? "border-black" 
                                : "border-gray-400"
                            }`}>
                              {answerInput === option && (
                                <div className="w-3 h-3 rounded-full bg-black"></div>
                              )}
                            </div>
                            <span className="text-gray-800">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentQuestion.type === "text" && (
                    <div className="mb-6">
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Enter your answer"
                          value={answerInput}
                          onChange={(e) => setAnswerInput(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <button 
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowAnswerModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-lg text-white transition-colors ${
                        answerInput.trim() 
                          ? "bg-black hover:bg-gray-800"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      disabled={!answerInput.trim()}
                      onClick={handleAnswerQuestion}
                    >
                      Submit (+{currentQuestion.xp} XP)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col pt-8 px-4 md:px-6 bg-white pb-8">
            {/* Agent Status */}
            <div className="border border-gray-200 rounded-lg p-4 mb-8 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                <RobotIcon className="text-white h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">Agent Status: Active (Level {avatarLevel})</div>
                <div className="text-xs text-slate-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Analyzing task stream</span>
                </div>
              </div>
              <div className="border border-slate-800 text-slate-800 text-xs px-2 py-1 rounded-full">
                +{agentActivities.reduce((sum, act) => act.status === 'completed' ? sum + act.reward : sum, 0)} XP Total
              </div>
            </div>
            
            {/* タスクストリームセクション */}
            <div className="relative h-[350px] border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mb-8">
              {/* タスクストリーム */}
              <div className="h-full w-full overflow-hidden relative">
                {/* 中央のエージェントアバター */}
                <div className="absolute left-4 top-4 z-10">
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center shadow-lg">
                    <RobotIcon className="text-white h-12 w-12" />
                  </div>
                  {/* レベル表示を削除 */}
                </div>
                
                {/* 現在処理中のタスク */}
                {currentTask && (
                  <div
                    className={`absolute bg-white rounded-lg shadow-md p-3 border ${
                      currentTask.status === 'matched' ? 'border-green-300' :
                      currentTask.status === 'rejected' ? 'border-red-300' : 'border-gray-200'
                    }`}
                    style={{
                      width: '250px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      animation: 
                        currentTask.status === 'matched' ? 'slideDown 2s ease-in-out forwards' :
                        currentTask.status === 'rejected' ? 'slideUp 2s ease-in-out forwards' :
                        'none'
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-sm">{currentTask.title}</div>
                      <div className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        +{currentTask.reward} XP
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      {currentTask.description}
                    </div>
                    
                    {/* タグの表示 */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {currentTask.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* マッチング進捗バー */}
                    {currentTask.status === 'matching' && typeof currentTask.matchProgress === 'number' && (
                      <div className="w-full mt-2">
                        <div className="text-xs text-gray-500 mb-1 flex justify-between">
                          <span>Analyzing match...</span>
                          <span>{currentTask.matchProgress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-100" 
                            style={{ width: `${currentTask.matchProgress}%` }} 
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* マッチング結果アイコン */}
                    {currentTask.status === 'matched' && (
                      <div className="absolute -right-2 -top-2 bg-green-500 text-white rounded-full p-1">
                        <CheckIcon className="h-4 w-4" />
                      </div>
                    )}
                    
                    {currentTask.status === 'rejected' && (
                      <div className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1">
                        <XIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* アニメーション用CSS */}
              <style dangerouslySetInnerHTML={{
                __html: `
                  @keyframes slideDown {
                    0% { transform: translate(-50%, -50%); }
                    100% { transform: translate(-50%, 250%); }
                  }
                  
                  @keyframes slideUp {
                    0% { transform: translate(-50%, -50%); }
                    100% { transform: translate(-50%, -250%); }
                  }
                `
              }} />
            </div>
            
            {/* Activity Log */}
            <div>
              <h3 className="text-lg font-medium mb-4">Activity Log</h3>
              <div className="space-y-4">
                {/* 進行中の活動 */}
                {agentActivities.filter(activity => activity.status === 'in-progress').length > 0 && (
                  <>
                    <div className="border-l-4 border-amber-500 pl-2 py-1 text-xs font-medium text-slate-700 bg-amber-50 rounded-r-md">
                      In Progress
                    </div>
                    
                    {agentActivities
                      .filter(activity => activity.status === 'in-progress')
                      .map(activity => (
                        <div key={activity.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center border border-blue-200 text-blue-600">
                                  <ClockIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-semibold text-sm">{activity.title}</div>
                                  <div className="text-xs text-slate-500">
                                    {activity.category} • {getRelativeTime(activity.timestamp)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <LoaderIcon className="h-5 w-5 text-amber-500 animate-spin" />
                                <div className="border border-amber-200 text-amber-600 text-xs font-bold px-2 py-1 rounded-full">
                                  +{activity.reward} XP
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-slate-600 border border-gray-100 bg-gray-50 p-2 rounded">
                              {activity.description}
                            </div>
                          </div>
                        </div>
                      ))}
                  </>
                )}
                
                {/* 中断された活動 */}
                {agentActivities.filter(activity => activity.status === 'interrupted').length > 0 && (
                  <>
                    <div className="border-l-4 border-red-500 pl-2 py-1 text-xs font-medium text-slate-700 bg-red-50 rounded-r-md mt-6">
                      Interrupted
                    </div>
                    
                    {agentActivities
                      .filter(activity => activity.status === 'interrupted')
                      .map(activity => (
                        <div key={activity.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center border border-purple-200 text-purple-600">
                                  <ClockIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-semibold text-sm">{activity.title}</div>
                                  <div className="text-xs text-slate-500">
                                    {activity.category} • {getRelativeTime(activity.timestamp)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertCircleIcon className="h-5 w-5 text-red-500" />
                                <div className="border border-amber-200 text-amber-600 text-xs font-bold px-2 py-1 rounded-full">
                                  +{activity.reward} XP
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-slate-600 border border-gray-100 bg-gray-50 p-2 rounded">
                              {activity.description}
                            </div>
                          </div>
                        </div>
                      ))}
                  </>
                )}
                
                {/* 完了した活動 */}
                {agentActivities.filter(activity => activity.status === 'completed').length > 0 && (
                  <>
                    <div className="border-l-4 border-green-500 pl-2 py-1 text-xs font-medium text-slate-700 bg-green-50 rounded-r-md mt-6">
                      Completed
                    </div>
                    
                    {agentActivities
                      .filter(activity => activity.status === 'completed')
                      .map(activity => (
                        <div key={activity.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center border border-blue-200 text-blue-600">
                                  <ClockIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-semibold text-sm">{activity.title}</div>
                                  <div className="text-xs text-slate-500">
                                    {activity.category} • {getRelativeTime(activity.timestamp)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                <div className="border border-amber-200 text-amber-600 text-xs font-bold px-2 py-1 rounded-full">
                                  +{activity.reward} XP
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-slate-600 border border-gray-100 bg-gray-50 p-2 rounded">
                              {activity.description}
                            </div>
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>
            </div>
            
            {/* Activity Pageへのリンク */}
            {onNavigate && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => onNavigate('activity')}
                  className="py-2 px-4 bg-black text-white rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <span>詳細ビューを開く</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 相対的な時間を取得するヘルパー関数
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // 秒単位の差
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

// デフォルトエクスポートを追加
export default TopPage;


