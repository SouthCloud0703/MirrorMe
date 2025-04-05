import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { UserData } from '../db';

// English name lists
const firstNames = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
  'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White'
];

// Define custom data interface for type safety
interface CustomUserData {
  interests: string[];
  lastLogin: string;
  deviceType: string;
  isPremium: boolean;
  settings: {
    darkMode: boolean;
    notifications: boolean;
    language: string;
  };
  [key: string]: any; // Index signature for dynamic access
}

// Define full user data structure
interface User extends UserData {
  id: string;
  worldId: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    name: string;
    avatarLevel: number;
    xp: number;
  };
  customData: CustomUserData;
}

// Generate random World ID hash
function generateRandomWorldId(): string {
  return `0x${randomUUID().replace(/-/g, '')}`;
}

// Generate random name
function generateRandomName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

// Generate random profile information
function generateRandomProfile() {
  return {
    name: generateRandomName(),
    avatarLevel: Math.floor(Math.random() * 5) + 1, // Level 1-5
    xp: Math.floor(Math.random() * 10000) // XP 0-9999
  };
}

// Generate random custom data
function generateRandomCustomData(): CustomUserData {
  const interests = ['Reading', 'Movies', 'Programming', 'Cooking', 'Travel', 'Sports', 'Music', 'Gaming', 'Photography', 'Art'];
  const selectedInterests: string[] = [];
  
  // Randomly select 1-5 interests
  const interestCount = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < interestCount; i++) {
    const interest = interests[Math.floor(Math.random() * interests.length)];
    if (!selectedInterests.includes(interest)) {
      selectedInterests.push(interest);
    }
  }
  
  return {
    interests: selectedInterests,
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(), // Random date within last 30 days
    deviceType: Math.random() > 0.7 ? 'desktop' : 'mobile',
    isPremium: Math.random() > 0.8,
    settings: {
      darkMode: Math.random() > 0.5,
      notifications: Math.random() > 0.3,
      language: Math.random() > 0.2 ? 'en' : 'es'
    }
  };
}

// Main function: Generate dummy users
async function generateDummyUsers(count: number) {
  console.log(`Generating ${count} dummy user data...`);
  
  // Initialize the DB file path
  const dbPath = path.join(process.cwd(), 'backend', 'data', 'users.json');
  
  // Create empty object to store users
  const users: Record<string, User> = {};
  
  // Generate new users
  for (let i = 0; i < count; i++) {
    const worldId = generateRandomWorldId();
    const now = new Date().toISOString();
    
    // Create user object
    const user: User = {
      id: randomUUID(),
      worldId,
      createdAt: now,
      updatedAt: now,
      profile: generateRandomProfile(),
      customData: generateRandomCustomData()
    };
    
    // Store user in the collection
    users[worldId] = user;
    
    // Show progress
    if ((i + 1) % 10 === 0 || i === count - 1) {
      console.log(`Generated ${i + 1}/${count} user data`);
    }
  }
  
  // Write all users to the JSON file
  try {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
    console.log(`Successfully saved ${Object.keys(users).length} users to ${dbPath}`);
  } catch (error) {
    console.error('Error saving users data:', error);
    throw error;
  }
  
  return users;
}

// Run the script
generateDummyUsers(100)
  .then((users) => {
    console.log(`Dummy user data generation completed with ${Object.keys(users).length} users`);
    process.exit(0);
  })
  .catch(error => {
    console.error('An error occurred:', error);
    process.exit(1);
  }); 