# TARU Backend

Backend for TARU (Trauma-Aware Recovery Utility): A Node.js & TypeScript Express backend using Prisma & PostgreSQL with JWT auth. Provides comprehensive endpoints for trauma-informed interventions, including archetypes, mood & IFS check-ins, loved-one letters, journaling & gratitude rituals, triggers, community messages & push tokens.

## Features

- 🔐 JWT Authentication (register/login)
- 👤 User Profile Management
- 🎭 Sacred Archetype System
- 💭 Mood Check-ins with Analytics
- 🧠 IFS (Internal Family Systems) Parts Check-ins
- 💌 Loved One Letters
- 📓 Private Journaling
- 🙏 Gratitude Practice
- 👥 Anonymous Community Support
- ⚠️ Trigger Management with Webhooks
- 📱 Push Notification Token Management
- 🧪 Comprehensive Test Suite
- 🚀 CI/CD with GitHub Actions

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Testing**: Jest + Supertest
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 13 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lukelarkin/APP-backend.git
cd APP-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taru_db"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV=development
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Generate Prisma Client:
```bash
npm run prisma:generate
```

6. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### User Profile

All endpoints require authentication with JWT token in header:
```
Authorization: Bearer <token>
```

#### Get Current User
```http
GET /api/users/me
```

#### Get Profile
```http
GET /api/users/profile
```

#### Update Profile
```http
PUT /api/users/profile
Content-Type: application/json

{
  "bio": "My story...",
  "timezone": "America/New_York",
  "preferredArchetype": "Warrior"
}
```

### Archetypes

#### Get All Archetypes
```http
GET /api/archetypes
```

#### Create Archetype
```http
POST /api/archetypes
Content-Type: application/json

{
  "archetype": "Warrior",
  "strength": 75,
  "description": "Protector and fighter"
}
```

#### Update Archetype
```http
PUT /api/archetypes/:id
Content-Type: application/json

{
  "strength": 85,
  "isActive": true
}
```

### Mood Check-ins

#### Create Mood Check-in
```http
POST /api/mood
Content-Type: application/json

{
  "mood": "calm",
  "intensity": 7,
  "notes": "Feeling peaceful",
  "tags": ["meditation", "morning"]
}
```

#### Get Mood Check-ins
```http
GET /api/mood?limit=30&offset=0
```

#### Get Mood Statistics
```http
GET /api/mood/stats?days=7
```

### IFS Parts Check-ins

#### Create Parts Check-in
```http
POST /api/parts
Content-Type: application/json

{
  "partName": "Inner Critic",
  "emotion": "anxious",
  "message": "Not good enough",
  "burden": "Perfectionism",
  "needs": "Compassion"
}
```

#### Get All Parts Check-ins
```http
GET /api/parts
```

#### Get Parts by Name
```http
GET /api/parts/:partName
```

### Interventions

#### Letters to Loved Ones

```http
POST /api/letters
Content-Type: application/json

{
  "recipient": "Mom",
  "content": "Dear Mom, I wanted to say..."
}
```

#### Journal Entries

```http
POST /api/journal
Content-Type: application/json

{
  "title": "Today's reflection",
  "content": "Today I learned...",
  "mood": "contemplative",
  "tags": ["growth", "insight"],
  "isPrivate": true
}
```

#### Gratitude Entries

```http
POST /api/gratitude
Content-Type: application/json

{
  "content": "I'm grateful for...",
  "category": "experience"
}
```

### Community

#### Get Community Messages
```http
GET /api/community?limit=50&offset=0
```

#### Post Community Message
```http
POST /api/community
Content-Type: application/json

{
  "content": "Just wanted to share my progress...",
  "isAnonymous": true
}
```

#### Like a Message
```http
POST /api/community/:id/like
```

### Triggers

#### Create Trigger
```http
POST /api/triggers
Content-Type: application/json

{
  "name": "Loud noises",
  "description": "Sudden loud sounds",
  "severity": 8,
  "coping": "Deep breathing, safe space",
  "webhookUrl": "https://example.com/webhook"
}
```

#### Activate Trigger (calls webhook)
```http
POST /api/triggers/:id/activate
```

### Push Tokens

#### Register Push Token
```http
POST /api/push-tokens
Content-Type: application/json

{
  "token": "expo-push-token-xyz",
  "platform": "ios"
}
```

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Watch mode:
```bash
npm run test:watch
```

## Building for Production

```bash
npm run build
npm start
```

## Database Management

### Create a new migration
```bash
npx prisma migrate dev --name migration_name
```

### Open Prisma Studio (database GUI)
```bash
npm run prisma:studio
```

### Reset database (⚠️ destroys data)
```bash
npx prisma migrate reset
```

## Project Structure

```
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── __tests__/        # Test files
│   └── index.ts          # Application entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── .github/
│   └── workflows/        # CI/CD workflows
└── dist/                 # Compiled JavaScript
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Support

For trauma-informed design principles and best practices, please refer to:
- IFS (Internal Family Systems) therapy resources
- Trauma-aware care guidelines
- Sacred archetypes in psychology
