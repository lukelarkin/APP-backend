# APP-backend

Backend for APP: Node.js & TypeScript, Postgres via Prisma, JWT auth. Provides endpoints for auth, archetypes, mood & IFS check-ins, loved-one letters, journaling & gratitude rituals, triggers, community messages & push tokens. Supports sacred archetypes & trauma-informed interventions.

## 🚀 Quick Start: Merging Frontend and Backend

This backend is designed to work with the [TARU iOS app](https://github.com/lukelarkin/APP) (React Native/Expo frontend). To integrate them:

1. **[Frontend-Backend Integration Guide](./FRONTEND_BACKEND_INTEGRATION.md)** - Complete architecture and integration strategy
2. **[Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md)** - Step-by-step tasks for integration
3. **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Deploy backend to Railway, Render, or Heroku
4. **[API Integration Examples](./API_INTEGRATION_EXAMPLES.md)** - Code examples for each screen

### Next Steps to Make a Fully Functional iOS App

The backend is **production-ready** (see PR #1: `copilot/add-nodejs-express-backend`). To complete the integration:

1. **Merge Backend Code**: Merge PR #1 to get the complete backend implementation
2. **Deploy Backend**: Use Railway.app or Render.com (10-15 minutes)
3. **Add API Layer to Frontend**: Implement API service and sync manager in the React Native app
4. **Update Frontend Screens**: Connect existing screens to backend API endpoints
5. **Test Integration**: Verify data flows between frontend and backend
6. **Deploy to App Store**: Build iOS app with production backend URL

**Estimated Time**: 2-3 weeks for complete integration

See [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for detailed steps.

## Architecture Overview

```
Frontend (React Native/Expo)
         ↓
   API Service Layer
         ↓
   Backend REST API
         ↓
   PostgreSQL Database
```

## Available Documentation

- **[FRONTEND_BACKEND_INTEGRATION.md](./FRONTEND_BACKEND_INTEGRATION.md)** - Full integration architecture, offline-first strategy, migration guide
- **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Complete step-by-step checklist with code examples
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deploy to Railway, Render, Heroku, or DigitalOcean (10-20 minutes)
- **[API_INTEGRATION_EXAMPLES.md](./API_INTEGRATION_EXAMPLES.md)** - Ready-to-use code for authentication, check-ins, community features

## Backend Status

- ✅ Complete REST API implementation (40+ endpoints)
- ✅ JWT authentication with bcrypt password hashing
- ✅ PostgreSQL database with Prisma ORM
- ✅ Docker support for development and production
- ✅ CI/CD with GitHub Actions
- ✅ Comprehensive documentation
- ⏳ Integration with frontend (this guide)

## Key Features

### Authentication
- User registration and login
- JWT tokens with automatic refresh
- Secure password hashing

### Core Functionality
- **Archetypes**: Sacred archetype system (Warrior, Sage, Lover, Seeker)
- **IFS Check-ins**: Daily Internal Family Systems check-ins with parts work
- **Mood Tracking**: Track mood, intensity, and patterns
- **Interventions**: Letters, journal entries, gratitude practice
- **Community**: Anonymous messaging, support, rituals
- **Triggers**: Webhook support for real-time interventions
- **Push Notifications**: Token management for iOS/Android

### Technical Features
- RESTful API design
- Type-safe TypeScript
- Database migrations with Prisma
- Comprehensive error handling
- Rate limiting
- CORS configuration
- Health check endpoints

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

Backend will be running at `http://localhost:3000`

## Production Deployment

### Recommended: Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add postgresql
railway up
```

Your backend will be live at `https://your-app.up.railway.app` in 10-15 minutes.

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Frontend Integration

The frontend repository is at [github.com/lukelarkin/APP](https://github.com/lukelarkin/APP).

To integrate:

1. Create API service layer in frontend (see [API_INTEGRATION_EXAMPLES.md](./API_INTEGRATION_EXAMPLES.md))
2. Update screens to use backend API
3. Implement offline-first sync strategy
4. Configure environment variables with backend URL
5. Test integration end-to-end
6. Deploy to App Store

Complete code examples are available in [API_INTEGRATION_EXAMPLES.md](./API_INTEGRATION_EXAMPLES.md).

## Testing Integration

1. Start backend: `npm run dev`
2. Start frontend: `cd ../APP && npm start`
3. Use ngrok for mobile testing: `ngrok http 3000`
4. Update frontend `.env` with ngrok URL
5. Test on physical device

## Support

- **Issues**: Create issue in GitHub repository
- **Documentation**: See docs linked above
- **Backend API**: See PR #1 for complete implementation

## License

Private project
