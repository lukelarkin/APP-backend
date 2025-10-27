# TARU Backend API Structure

```
TARU Backend API
├── Health Check
│   └── GET /health
│
├── Authentication (Public)
│   ├── POST /api/auth/register
│   └── POST /api/auth/login
│
├── User Management (Protected)
│   ├── GET /api/users/me
│   ├── GET /api/users/profile
│   └── PUT /api/users/profile
│
├── Sacred Archetypes (Protected)
│   ├── GET /api/archetypes
│   ├── POST /api/archetypes
│   ├── PUT /api/archetypes/:id
│   └── DELETE /api/archetypes/:id
│
├── Mood Tracking (Protected)
│   ├── GET /api/mood
│   ├── POST /api/mood
│   └── GET /api/mood/stats
│
├── IFS Parts Work (Protected)
│   ├── GET /api/parts
│   ├── POST /api/parts
│   └── GET /api/parts/:partName
│
├── Interventions (Protected)
│   │
│   ├── Letters to Loved Ones
│   │   ├── GET /api/letters
│   │   ├── POST /api/letters
│   │   ├── PUT /api/letters/:id
│   │   └── DELETE /api/letters/:id
│   │
│   ├── Private Journaling
│   │   ├── GET /api/journal
│   │   ├── POST /api/journal
│   │   ├── PUT /api/journal/:id
│   │   └── DELETE /api/journal/:id
│   │
│   └── Gratitude Practice
│       ├── GET /api/gratitude
│       ├── POST /api/gratitude
│       └── DELETE /api/gratitude/:id
│
├── Community Support (Protected)
│   ├── GET /api/community
│   ├── POST /api/community
│   ├── POST /api/community/:id/like
│   ├── POST /api/community/:id/flag
│   └── DELETE /api/community/:id
│
├── Trigger Management (Protected)
│   ├── GET /api/triggers
│   ├── POST /api/triggers
│   ├── PUT /api/triggers/:id
│   ├── POST /api/triggers/:id/activate
│   └── DELETE /api/triggers/:id
│
└── Push Notifications (Protected)
    ├── GET /api/push-tokens
    ├── POST /api/push-tokens
    ├── PATCH /api/push-tokens/:token/deactivate
    └── DELETE /api/push-tokens/:token
```

## Data Flow Architecture

```
┌─────────────────┐
│  React Native   │
│   Mobile App    │
└────────┬────────┘
         │
         │ HTTPS + JWT
         │
    ┌────▼─────┐
    │  Express │
    │  Router  │
    └────┬─────┘
         │
    ┌────▼────────┐
    │ Middleware  │
    │  - CORS     │
    │  - Auth     │
    │  - Validate │
    └────┬────────┘
         │
    ┌────▼──────────┐
    │  Controllers  │
    │  - Business   │
    │    Logic      │
    └────┬──────────┘
         │
    ┌────▼────────┐
    │   Prisma    │
    │   Client    │
    └────┬────────┘
         │
    ┌────▼────────┐
    │ PostgreSQL  │
    │  Database   │
    └─────────────┘
```

## Database Schema Relationships

```
User (1) ──┬──> (1) UserProfile
           │
           ├──> (*) UserArchetype
           │
           ├──> (*) MoodCheckIn
           │
           ├──> (*) PartsCheckIn
           │
           ├──> (*) LovedOneLetter
           │
           ├──> (*) JournalEntry
           │
           ├──> (*) GratitudeEntry
           │
           ├──> (*) CommunityMessage
           │
           ├──> (*) Trigger
           │
           └──> (*) PushToken
```

## Request/Response Flow Examples

### 1. User Registration & Login
```
Client                  Server                  Database
  │                        │                        │
  ├──POST /register──────>│                        │
  │  {email, password}     │                        │
  │                        ├──hash password────────>│
  │                        ├──create user──────────>│
  │                        │<─user created──────────┤
  │                        ├──generate JWT──────────>│
  │<─{token, user}─────────┤                        │
  │                        │                        │
```

### 2. Creating Protected Resource
```
Client                  Server                  Database
  │                        │                        │
  ├──POST /api/mood──────>│                        │
  │  Bearer <JWT>          │                        │
  │  {mood, intensity}     │                        │
  │                        ├──verify JWT───────────>│
  │                        ├──validate input───────>│
  │                        ├──create record────────>│
  │                        │<─record created────────┤
  │<─{moodCheckIn}─────────┤                        │
  │                        │                        │
```

### 3. Trigger Activation with Webhook
```
Client          Server          Database        External Webhook
  │                │                │                  │
  ├─POST activate─>│                │                  │
  │   Bearer JWT   │                │                  │
  │                ├──get trigger──>│                  │
  │                │<─trigger data──┤                  │
  │                ├──POST webhook─────────────────────>│
  │                │                │    {trigger      │
  │                │                │     details}     │
  │                │<─ack────────────────────────────┤
  │<─success───────┤                │                  │
  │                │                │                  │
```

## Security Layers

```
┌──────────────────────────────────────┐
│          SSL/TLS (HTTPS)             │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│       JWT Authentication             │
│   - Token verification               │
│   - User identification              │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│       Request Validation             │
│   - express-validator                │
│   - Type checking                    │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│       Authorization                  │
│   - User-specific data access        │
│   - userId filtering                 │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│       Database Layer                 │
│   - Prisma ORM                       │
│   - SQL injection prevention         │
└──────────────────────────────────────┘
```

## Deployment Configurations

### Development (docker-compose)
```yaml
services:
  postgres:
    - Port: 5432
    - Volume: postgres_data
  
  app:
    - Port: 3000
    - Hot reload enabled
    - Prisma migrate on start
```

### Production (Docker)
```
Multi-stage build:
1. Build stage (compile TypeScript)
2. Production stage (optimized runtime)
   - Node 18 Alpine
   - Only production dependencies
   - Health checks enabled
```

## Error Handling Flow

```
Error Occurs
    │
    ├─> Validation Error
    │   └─> 400 Bad Request
    │       └─> {errors: [...]}
    │
    ├─> Authentication Error
    │   └─> 401 Unauthorized
    │       └─> {error: "message"}
    │
    ├─> Not Found Error
    │   └─> 404 Not Found
    │       └─> {error: "message"}
    │
    └─> Server Error
        └─> 500 Internal Server Error
            └─> {error: "message"}
                (detailed in dev, generic in prod)
```

## Integration Points

### For React Native App
```typescript
// Example client setup
const API_BASE_URL = 'https://api.taru.app';

// Register
const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email, password, name})
});

// Authenticated request
const mood = await fetch(`${API_BASE_URL}/api/mood`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({mood: 'calm', intensity: 7})
});
```

### Webhook Integration
```typescript
// Server will POST to your webhook:
{
  userId: "user-uuid",
  triggerId: "trigger-uuid",
  triggerName: "Loud noises",
  severity: 8,
  timestamp: "2024-01-01T12:00:00Z"
}

// Respond with 200 OK to acknowledge
```

## Monitoring Endpoints

```
Health Check: GET /health
Response: {
  status: "ok",
  timestamp: "2024-01-01T12:00:00Z"
}
```

---

## Summary

**Total Endpoints**: 40+
**Protected Routes**: 37
**Public Routes**: 3
**Database Models**: 11
**Controllers**: 11
**Route Files**: 11

Ready for production deployment! 🚀
