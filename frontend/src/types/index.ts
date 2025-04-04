// Avatar profile type definition
export interface AvatarProfile {
  name: string;
  gender: string;
  location: string;
  interests: string[];
  occupation: string;
  icon: string;
}

// Revenue data type definition
export interface RevenueData {
  totalTokens: number;
  dailyClaimable: number;
  lastClaimed: string | null;
}

// Advertisement type definition
export interface Advertisement {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  rewardAmount: number;
}

// User type definition
export interface User {
  id: string;
  verified: boolean;
}

// Development question type definition
export interface DevelopmentQuestion {
  id: string;
  text: string;
  category: string;
}

// Growth level calculation utility
export const calculateGrowthLevel = (profile: AvatarProfile): number => {
  // Calculate level based on information completeness
  let score = 0;
  
  // Name has been entered
  if (profile.name.trim().length > 0) score += 1;
  
  // Gender has been selected
  if (profile.gender) score += 1;
  
  // Region has been selected
  if (profile.location) score += 1;
  
  // Occupation has been selected
  if (profile.occupation) score += 1;
  
  // Interests have been selected (score increases based on number of selections)
  score += Math.min(3, profile.interests.length);
  
  // Maximum score is 7, level range is 1-5
  const level = Math.ceil((score / 7) * 5);
  return Math.max(1, Math.min(5, level));
};

// Calculate reward rate function (increases with level)
export const calculateRewardRate = (level: number): number => {
  // Base reward rate + additional reward based on level
  return 1 + (level - 1) * 0.25; // Level 1: 1.0x, Level 5: 2.0x
}; 