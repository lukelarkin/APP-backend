# APP-backend

Backend for APP: Node.js & TypeScript, Postgres via Prisma, JWT auth. Provides endpoints for auth, archetypes, mood & IFS check-ins, loved-one letters, journaling & gratitude rituals, triggers, community messages & push tokens. Supports sacred archetypes & trauma-informed interventions.

## 🚀 Quick Start: Merging Frontend and Backend

> **New here?** Start with the [Executive Summary](./EXECUTIVE_SUMMARY.md) for a complete overview.

This backend is designed to work with the [TARU iOS app](https://github.com/lukelarkin/APP) (React Native/Expo frontend).

### 📚 Complete Documentation

1. **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - ⭐ Start here! Complete overview, timeline, costs
2. **[FRONTEND_BACKEND_INTEGRATION.md](./FRONTEND_BACKEND_INTEGRATION.md)** - Technical architecture and strategy
3. **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Step-by-step tasks with code
4. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deploy in 10-15 minutes
5. **[API_INTEGRATION_EXAMPLES.md](./API_INTEGRATION_EXAMPLES.md)** - Copy-paste React Native code
6. **[CURRENT_STATE_AND_ROADMAP.md](./CURRENT_STATE_AND_ROADMAP.md)** - What we have vs. what we need

### 🎯 Next Steps to Make a Fully Functional iOS App

The backend is **production-ready** (see PR #1: `copilot/add-nodejs-express-backend`). To complete the integration:

1. **Merge Backend Code**: Merge PR #1 to get the complete backend implementation
2. **Deploy Backend**: Use Railway.app (10-15 minutes) - [Guide](./DEPLOYMENT_GUIDE.md)
3. **Add API Layer to Frontend**: Follow the [Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md)
4. **Update Frontend Screens**: Use [Code Examples](./API_INTEGRATION_EXAMPLES.md)
5. **Test Integration**: Verify data flows between frontend and backend
6. **Deploy to App Store**: Build iOS app with production backend URL

**Estimated Time**: 2-3 weeks for complete integration

See [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) for the complete plan.

## Architecture Overview

```
Frontend (React Native/Expo)
         ↓
   API Service Layer (NEW)
         ↓
   Backend REST API (READY)
         ↓
   PostgreSQL Database
```

**Current Status**:
- ✅ Backend: Complete and tested
- ✅ Frontend: Working but offline-only
- 🔄 Integration: Documented and ready to implement

## Backend Features

### Authentication & Security
- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ Protected routes with middleware
- ✅ Rate limiting
- ✅ CORS configuration

### Core API Endpoints (40+)
- **Auth**: `/api/auth/*` - Register, login, logout, refresh tokens
- **Users**: `/api/users/*` - Profile management, settings
- **Archetypes**: `/api/archetypes/*` - Sacred archetype system
- **Check-ins**: `/api/parts/*`, `/api/mood/*` - IFS and mood tracking
- **Interventions**: `/api/letters/*`, `/api/journal/*`, `/api/gratitude/*`
- **Community**: `/api/community/*` - Messages, likes, moderation
- **Triggers**: `/api/webhooks/*` - Real-time intervention webhooks
- **Push**: `/api/push/*` - Notification token management

### Technical Stack
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Testing**: Jest + Supertest (14 tests)
- **CI/CD**: GitHub Actions
- **Deployment**: Docker ready

## Quick Local Setup

```bash
# Clone and install
git clone https://github.com/lukelarkin/APP-backend.git
cd APP-backend
npm install

# Set up environment
cp .env.example .env
# Edit .env with your PostgreSQL URL

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Backend runs at `http://localhost:3000`

## Production Deployment

### Recommended: Railway.app (10-15 minutes)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add postgresql
railway up
```

Your backend will be live at `https://your-app.up.railway.app`

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for other platforms (Render, Heroku, DigitalOcean).

## Frontend Integration

The frontend repository is at [github.com/lukelarkin/APP](https://github.com/lukelarkin/APP).

**Integration Steps**:

1. **Deploy this backend** (10-15 minutes)
2. **Add API service layer** to frontend (2-3 days)
3. **Update screens** to use backend (3-5 days)
4. **Test and deploy** to App Store (1-2 days)

Complete code examples available in [API_INTEGRATION_EXAMPLES.md](./API_INTEGRATION_EXAMPLES.md).

### Example: API Service (Frontend)

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

class APIService {
  async register(email, password, name) {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email, password, name
    });
    // Store token
    await AsyncStorage.setItem('auth_token', response.data.token);
    return response.data;
  }
  
  // More methods...
}

export default new APIService();
```

See [API_INTEGRATION_EXAMPLES.md](./API_INTEGRATION_EXAMPLES.md) for complete implementations.

## Testing Integration

1. **Start backend**: `npm run dev`
2. **Start frontend**: `cd ../APP && npm start`
3. **Use ngrok** for mobile testing: `ngrok http 3000`
4. **Update frontend** `.env` with ngrok URL
5. **Test on device**: Register, login, create check-in, view community

## Database Schema

11 models supporting complete TARU functionality:

- **User** - Accounts with profile and settings
- **UserProfile** - Extended profile (bio, timezone, archetype)
- **UserArchetype** - Sacred archetype assignments
- **MoodCheckIn** - Daily mood tracking
- **PartsCheckIn** - IFS parts work
- **LovedOneLetter** - Therapeutic letters
- **JournalEntry** - Private journaling
- **GratitudeEntry** - Gratitude practice
- **CommunityMessage** - Community support
- **Trigger** - Trigger tracking and webhooks
- **PushToken** - Notification tokens

All models use cascade deletion for data privacy.

## Project Status

| Component | Status | Location |
|-----------|--------|----------|
| Backend API | ✅ Complete | PR #1 |
| Database Schema | ✅ Complete | PR #1 |
| Authentication | ✅ Complete | PR #1 |
| Tests | ✅ Passing | PR #1 |
| Docker | ✅ Ready | PR #1 |
| CI/CD | ✅ Configured | .github/workflows |
| Documentation | ✅ Complete | This repo |
| Frontend Integration | 📋 Documented | This repo |
| Deployment | 🔄 Ready | [Guide](./DEPLOYMENT_GUIDE.md) |

**Ready to integrate!** Follow [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)

## Costs

### Development (Free Options Available)
- **Render.com**: Free tier (with limitations)
- **Supabase**: Free PostgreSQL
- **Expo**: Free builds

### Production
- **Backend**: $5-10/month (Railway or Render)
- **Apple Developer**: $99/year
- **Total**: ~$16/month average

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed cost comparison.

## Support

- **Getting Started**: [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)
- **Implementation**: [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
- **Code Examples**: [API_INTEGRATION_EXAMPLES.md](./API_INTEGRATION_EXAMPLES.md)
- **Issues**: Create issue in this repository

## License

Private project
