# Quick Start Guide for TARU Backend

## Getting Started with Docker (Recommended)

The easiest way to get started is using Docker Compose, which will automatically set up PostgreSQL and the application:

```bash
# Clone the repository
git clone https://github.com/lukelarkin/APP-backend.git
cd APP-backend

# Start the application with Docker Compose
docker-compose up

# The API will be available at http://localhost:3000
```

That's it! The database migrations will run automatically.

## Manual Setup

If you prefer to run the application manually:

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your database connection:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taru_db"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3000
NODE_ENV=development
```

### 4. Set Up Database

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npm run prisma:generate
```

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

## API Testing

### Using cURL

#### Register a new user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Save the token from the response and use it for authenticated requests:

#### Create a mood check-in:
```bash
curl -X POST http://localhost:3000/api/mood \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "mood": "calm",
    "intensity": 7,
    "notes": "Feeling peaceful today",
    "tags": ["meditation", "morning"]
  }'
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Database Management

### View database with Prisma Studio:
```bash
npm run prisma:studio
```

### Create a new migration:
```bash
npx prisma migrate dev --name your_migration_name
```

### Reset database (⚠️ destroys all data):
```bash
npx prisma migrate reset
```

## API Endpoints Overview

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User (Protected)
- `GET /api/users/me` - Get current user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Archetypes (Protected)
- `GET /api/archetypes` - List user's archetypes
- `POST /api/archetypes` - Create archetype
- `PUT /api/archetypes/:id` - Update archetype
- `DELETE /api/archetypes/:id` - Delete archetype

### Mood Check-ins (Protected)
- `GET /api/mood` - List mood check-ins
- `POST /api/mood` - Create mood check-in
- `GET /api/mood/stats` - Get mood statistics

### IFS Parts (Protected)
- `GET /api/parts` - List all parts check-ins
- `POST /api/parts` - Create parts check-in
- `GET /api/parts/:partName` - Get check-ins for specific part

### Interventions (Protected)
- **Letters**: `GET/POST/PUT/DELETE /api/letters`
- **Journal**: `GET/POST/PUT/DELETE /api/journal`
- **Gratitude**: `GET/POST/DELETE /api/gratitude`

### Community (Protected)
- `GET /api/community` - List messages
- `POST /api/community` - Post message
- `POST /api/community/:id/like` - Like message
- `POST /api/community/:id/flag` - Flag message
- `DELETE /api/community/:id` - Delete own message

### Triggers (Protected)
- `GET /api/triggers` - List triggers
- `POST /api/triggers` - Create trigger
- `PUT /api/triggers/:id` - Update trigger
- `POST /api/triggers/:id/activate` - Activate trigger (calls webhook)
- `DELETE /api/triggers/:id` - Delete trigger

### Push Tokens (Protected)
- `GET /api/push-tokens` - List registered tokens
- `POST /api/push-tokens` - Register token
- `PATCH /api/push-tokens/:token/deactivate` - Deactivate token
- `DELETE /api/push-tokens/:token` - Delete token

## Health Check

```bash
curl http://localhost:3000/health
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Check PostgreSQL logs

### Port Already in Use
- Change PORT in `.env`
- Or stop the process using port 3000: `lsof -ti:3000 | xargs kill -9`

### Prisma Client Not Generated
```bash
npx prisma generate
```

### Migration Issues
```bash
# Reset and reapply all migrations
npx prisma migrate reset
npx prisma migrate dev
```

## Production Deployment

### Environment Variables
Set these environment variables in production:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong secret key for JWT
- `NODE_ENV=production`
- `PORT` - Application port (default: 3000)

### Build and Run
```bash
npm run build
npm start
```

### Using Docker
```bash
docker build -t taru-backend --target production .
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e JWT_SECRET="your-secret" \
  -e NODE_ENV=production \
  taru-backend
```

## Support

For issues or questions:
1. Check the main README.md
2. Review API documentation
3. Check GitHub Issues
4. Refer to trauma-informed design principles

## Next Steps

1. ✅ Backend is ready
2. 🔜 Integrate with React Native app
3. 🔜 Set up production database
4. 🔜 Configure push notifications
5. 🔜 Set up monitoring and logging
