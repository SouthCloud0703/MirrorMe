import React from 'react';
import { AvatarProfile, calculateGrowthLevel, calculateRewardRate } from '../../types';

interface AvatarDisplayProps {
  profile: AvatarProfile;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ profile }) => {
  const growthLevel = calculateGrowthLevel(profile);
  const rewardRate = calculateRewardRate(growthLevel);
  
  // Determine color based on icon selection
  const getAvatarColorClass = () => {
    switch (profile.icon) {
      case 'business': return 'from-blue-200 to-blue-400';
      case 'creative': return 'from-purple-200 to-purple-400';
      case 'tech': return 'from-green-200 to-green-400';
      case 'casual': return 'from-yellow-200 to-yellow-400';
      default: return 'from-gray-200 to-gray-400';
    }
  };
  
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
      {/* Avatar icon */}
      <div className={`w-32 h-32 rounded-full bg-gradient-to-b ${getAvatarColorClass()} mb-4 flex items-center justify-center`}>
        {profile.name.trim() ? (
          <span className="text-2xl font-bold text-white">
            {profile.name.trim().charAt(0).toUpperCase()}
          </span>
        ) : (
          <span className="text-2xl font-bold text-white">?</span>
        )}
      </div>
      
      {/* Avatar name */}
      <h3 className="text-lg font-medium mb-2">
        {profile.name.trim() || "Unnamed"}
      </h3>
      
      {/* Growth level display */}
      <div className="w-full mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Level {growthLevel}</span>
          <span>Reward Rate: {rewardRate.toFixed(2)}x</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${(growthLevel / 5) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Status display */}
      <div className="w-full grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span>{profile.gender || "Not Set"}</span>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{profile.location || "Not Set"}</span>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
          </svg>
          <span>{profile.occupation || "Not Set"}</span>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span>{profile.interests.length > 0 ? `${profile.interests.length} interests` : "Not Set"}</span>
        </div>
      </div>
      
      {/* Growth message */}
      <div className="mt-4 text-center text-xs">
        <p className="text-gray-600">Provide more information to strengthen your avatar</p>
      </div>
    </div>
  );
};

export default AvatarDisplay; 