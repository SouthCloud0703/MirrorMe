import { useState } from "react";
import AvatarDisplay from "../components/Avatar/AvatarDisplay";
import { AvatarProfile } from "../types";
import { Button, Input} from "@worldcoin/mini-apps-ui-kit-react";

interface AvatarCreationPageProps {
  userId: string;
  onComplete: () => void;
}

const AvatarCreationPage = ({ userId, onComplete }: AvatarCreationPageProps) => {
  // Avatar profile state
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<AvatarProfile>({
    name: "",
    gender: "",
    location: "",
    interests: [],
    occupation: "",
    icon: "default"
  });
  const [isLoading, setIsLoading] = useState(false);

  // Input value change handler (for standard HTML components)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Interests change handler
  const handleInterestChange = (interest: string) => {
    setProfile(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  // Icon selection handler
  const handleIconSelect = (icon: string) => {
    setProfile(prev => ({ ...prev, icon }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // TODO: Save avatar profile using backend API
      // For now, save to localStorage as a mock implementation
      localStorage.setItem(`avatar_${userId}`, JSON.stringify(profile));
      
      // Notify parent component of completion
      onComplete();
    } catch (error) {
      console.error("Avatar creation error:", error);
      alert("An error occurred while creating your avatar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Interests list
  const interestOptions = [
    "Technology", "Travel", "Cooking", "Music", "Movies", "Reading", 
    "Sports", "Art", "Fashion", "Gaming", "Investment", "Health"
  ];

  // Icon options list
  const iconOptions = ["default", "business", "creative", "tech", "casual"];

  // Gender options (for Select component)
  const genderOptions = [
    { value: "", label: "Please select", id: "gender-none" },
    { value: "male", label: "Male", id: "gender-male" },
    { value: "female", label: "Female", id: "gender-female" },
    { value: "other", label: "Other", id: "gender-other" },
    { value: "prefer_not_to_say", label: "Prefer not to say", id: "gender-prefer-not-to-say" }
  ];

  // Region options (for Select component) - Global regions
  const locationOptions = [
    { value: "", label: "Please select", id: "location-none" },
    { value: "north_america", label: "North America", id: "location-north-america" },
    { value: "south_america", label: "South America", id: "location-south-america" },
    { value: "europe", label: "Europe", id: "location-europe" },
    { value: "middle_east", label: "Middle East", id: "location-middle-east" },
    { value: "africa", label: "Africa", id: "location-africa" },
    { value: "asia", label: "Asia", id: "location-asia" },
    { value: "oceania", label: "Oceania", id: "location-oceania" },
    { value: "antarctica", label: "Antarctica", id: "location-antarctica" },
    { value: "other", label: "Other", id: "location-other" }
  ];

  // Occupation options (for Select component)
  const occupationOptions = [
    { value: "", label: "Please select", id: "occupation-none" },
    { value: "student", label: "Student", id: "occupation-student" },
    { value: "office_worker", label: "Office Worker", id: "occupation-office-worker" },
    { value: "self_employed", label: "Self Employed", id: "occupation-self-employed" },
    { value: "freelance", label: "Freelancer", id: "occupation-freelance" },
    { value: "part_time", label: "Part-time Worker", id: "occupation-part-time" },
    { value: "homemaker", label: "Homemaker", id: "occupation-homemaker" },
    { value: "unemployed", label: "Unemployed", id: "occupation-unemployed" },
    { value: "other", label: "Other", id: "occupation-other" }
  ];

  // Display form content based on step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-medium mb-4">Enter Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar Name
                </label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleChange({ 
                    target: { name: "name", value: e.target.value }
                  } as React.ChangeEvent<HTMLInputElement>)}
                  required
                  placeholder="Your avatar's name"
                />
              </div>
              
              <div>
                <label htmlFor="gender-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                {/* Use standard HTML select box */}
                <select
                  id="gender-select"
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {genderOptions.map(option => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                {/* Use standard HTML select box */}
                <select
                  id="location-select"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {locationOptions.map(option => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h3 className="text-lg font-medium mb-4">Interests and Occupation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests (select multiple)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map(interest => (
                    <div key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`interest-${interest}`}
                        checked={profile.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`interest-${interest}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="occupation-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation
                </label>
                {/* Use standard HTML select box */}
                <select
                  id="occupation-select"
                  name="occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {occupationOptions.map(option => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <h3 className="text-lg font-medium mb-4">Select Avatar Icon</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {iconOptions.map(icon => (
                <div
                  key={icon}
                  onClick={() => handleIconSelect(icon)}
                  className={`p-2 border rounded-lg cursor-pointer ${
                    profile.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="w-full aspect-square bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                    {/* Display icon image (in actual implementation, display image here) */}
                    <span className="text-xs text-gray-500">{icon}</span>
                  </div>
                  <p className="text-xs text-center">{icon}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-sm mb-2">Avatar Information Review</h4>
              <p className="text-sm">Name: {profile.name}</p>
              <p className="text-sm">Gender: {profile.gender || "Not Set"}</p>
              <p className="text-sm">Region: {profile.location || "Not Set"}</p>
              <p className="text-sm">Occupation: {profile.occupation || "Not Set"}</p>
              <p className="text-sm">Interests: {profile.interests.length > 0 ? profile.interests.join(', ') : "Not Set"}</p>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Create Your Avatar</h2>
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
          <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
          <div className={`w-8 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <span className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/5">
          <AvatarDisplay profile={profile} />
        </div>
        
        <div className="md:w-3/5">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  variant="secondary"
                >
                  Back
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                isLoading={isLoading}
                className="ml-auto"
              >
                {isLoading ? 'Processing...' : step < 3 ? 'Next' : 'Create Avatar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreationPage; 