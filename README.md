# TARU Backend

A robust, scalable backend API for the TARU (Trauma-informed Addiction Recovery Utility) mobile application. This backend provides just-in-time interventions for men battling behavioral addictions through trauma-informed care, IFS (Internal Family Systems) therapy, and archetype-based personalization.

## 🎯 Mission Alignment

TARU's backend supports the mission of real-time AI intervention by enabling:

- **Just-in-Time Intervention** - Accept trigger webhooks and deliver interventions within 5 seconds via push notifications
- **Story & State Transformation** - Store check-in and intervention data to analyze patterns and tailor interventions
- **Community Connection** - Persist community messages, letters, and rituals for collective support (Ubuntu)
- **Emotionally Resonant Substitutions** - Deliver archetype-specific content through AI/IFS logic

## 🏗️ Architecture

Built with modern, production-ready technologies:

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis with BullMQ
- **Authentication**: JWT-based auth with refresh tokens
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with Supertest
- **CI/CD**: GitHub Actions with CodeQL scanning

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional, for local development)

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository
2. Copy environment variables: \`cp .env.example .env\`
3. Start all services: \`docker-compose up -d\`
4. Run migrations: \`docker-compose exec api npm run prisma:migrate\`
5. Access the API at http://localhost:3000

### Manual Setup

1. Install dependencies: \`npm install\`
2. Setup environment: \`cp .env.example .env\`
3. Start PostgreSQL and Redis
4. Generate Prisma Client: \`npm run prisma:generate\`
5. Run migrations: \`npm run prisma:migrate\`
6. Start dev server: \`npm run dev\`

## 📚 API Documentation

- **Swagger UI**: http://localhost:3000/docs
- **OpenAPI JSON**: http://localhost:3000/docs.json

## 🛣️ API Endpoints

### Authentication
- POST /api/v1/auth/register - Register new user
- POST /api/v1/auth/login - Login user
- POST /api/v1/auth/refresh - Refresh access token
- POST /api/v1/auth/logout - Logout user

### Users
- GET /api/v1/users/me - Get current user profile
- PUT /api/v1/users/me - Update user profile
- PUT /api/v1/users/archetype - Update user archetype
- GET /api/v1/users/stats - Get user statistics

### Check-ins & Streaks
- POST /api/v1/checkins - Create daily IFS check-in
- GET /api/v1/checkins - List user check-ins
- GET /api/v1/streaks - Get current and best streaks

### Interventions
- GET /api/v1/interventions/:archetype - Get archetype-specific interventions
- POST /api/v1/letters - Create loved one letter
- GET /api/v1/letters - List user's letters
- PUT /api/v1/letters/:id - Update letter
- DELETE /api/v1/letters/:id - Delete letter

### Community
- POST /api/v1/messages - Send community message
- GET /api/v1/messages - List community messages
- GET /api/v1/rituals - List upcoming rituals
- POST /api/v1/rituals/:id/join - Join a ritual

### Triggers & Push
- POST /api/v1/webhooks/trigger - Process trigger webhook
- POST /api/v1/push/register - Register push notification token

## 🧪 Testing

\`\`\`bash
npm test
npm run test:watch
npm test -- --coverage
\`\`\`

## 🔧 Development

\`\`\`bash
npm run dev          # Start dev server
npm run lint         # Run linter
npm run format       # Format code
npm run typecheck    # Type check
\`\`\`

## 🎭 Archetypes

- **Warrior** - Strength, resilience, protection
- **Sage** - Wisdom, understanding, guidance
- **Lover** - Connection, compassion, care
- **Seeker** - Curiosity, exploration, growth

Built with ❤️ for trauma-informed recovery and just-in-time intervention.
