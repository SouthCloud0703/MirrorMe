# MirrorMe Backend

This is the backend service for the MirrorMe application, providing API endpoints for user authentication, avatar profile management, and revenue tracking.

## Technologies Used

- Node.js with Express
- TypeScript
- MongoDB (via Mongoose)
- JWT Authentication
- World ID integration

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required values (MongoDB URI, JWT Secret, etc.)

4. Start the development server:
   ```
   npm run dev
   ```

5. For production:
   ```
   npm run build
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/users/auth` - Authenticate with World ID
- `GET /api/users/me` - Get current user info

### Avatar Profiles

- `POST /api/avatars` - Create avatar profile
- `GET /api/avatars` - Get user's avatar profile
- `PUT /api/avatars` - Update avatar profile

### Revenue

- `GET /api/revenue` - Get user's revenue data
- `POST /api/revenue/claim` - Claim daily tokens
- `POST /api/revenue/ad-reward` - Add reward from ad viewing

## Database Schema

The application uses three main collections:

1. **Users** - Stores basic user authentication data
2. **AvatarProfiles** - Stores avatar information and preferences
3. **Revenue** - Tracks token earnings and rewards

## Development Notes

- Run tests: `npm test`
- Generate API documentation: `npm run docs`
