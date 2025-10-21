# Implementation Checklist for Frontend-Backend Integration

This checklist provides a step-by-step guide for integrating the TARU frontend and backend to create a fully functional iOS app.

## Prerequisites

- [ ] Backend code reviewed (PR #1: `copilot/add-nodejs-express-backend` branch)
- [ ] Frontend repository accessible (`lukelarkin/APP`)
- [ ] Development environment set up (Node.js 18+, PostgreSQL, Expo CLI)
- [ ] Understanding of React Native, TypeScript, and Express.js

## Phase 1: Backend Preparation

### 1.1 Merge Backend PR

- [ ] Review PR #1 (`copilot/add-nodejs-express-backend`)
- [ ] Run tests: `npm test`
- [ ] Verify build: `npm run build`
- [ ] Merge PR #1 to main branch
- [ ] Verify CI passes

### 1.2 Deploy Backend (Development)

Choose deployment platform:

**Option A: Railway.app (Recommended)**
- [ ] Sign up at railway.app
- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Create new project: `railway init`
- [ ] Add PostgreSQL: `railway add postgresql`
- [ ] Configure environment variables in Railway dashboard
- [ ] Deploy: `git push railway main`
- [ ] Note deployed URL: `https://______.up.railway.app`

**Option B: Render.com**
- [ ] Sign up at render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Add PostgreSQL database
- [ ] Configure environment variables
- [ ] Deploy
- [ ] Note deployed URL

**Option C: Local Development (Testing Only)**
- [ ] Start PostgreSQL: `docker-compose up -d postgres`
- [ ] Create `.env` file from `.env.example`
- [ ] Run migrations: `npm run prisma:migrate`
- [ ] Start backend: `npm run dev`
- [ ] Use ngrok for mobile testing: `ngrok http 3000`
- [ ] Note ngrok URL: `https://______.ngrok.io`

### 1.3 Test Backend Endpoints

```bash
# Set your backend URL
export API_URL="https://your-backend-url.com"

# Test health check
curl $API_URL/health

# Test registration
curl -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Save the token from response
export TOKEN="eyJhbGc..."

# Test authenticated endpoint
curl $API_URL/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

- [ ] Health check works
- [ ] Registration works
- [ ] Login works
- [ ] Authenticated endpoints work
- [ ] CORS headers present

## Phase 2: Frontend Setup

### 2.1 Clone and Install Frontend

```bash
# Clone frontend repository
git clone https://github.com/lukelarkin/APP.git
cd APP

# Install dependencies
npm install

# Install additional dependencies for API integration
npm install axios @react-native-async-storage/async-storage @react-native-community/netinfo
```

- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] App runs: `npm start`

### 2.2 Configure Environment

```bash
# Create .env file
cat > .env << EOL
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
EOL
```

- [ ] `.env` file created
- [ ] API URL configured
- [ ] Environment variables loaded in app

### 2.3 Create Directory Structure

```bash
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/types
```

- [ ] `src/services` directory created
- [ ] `src/hooks` directory created
- [ ] `src/types` directory created

## Phase 3: Implement API Layer

### 3.1 Create Type Definitions

Create `src/types/api.ts`:

```typescript
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface MoodCheckIn {
  id: number;
  mood: string;
  intensity: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
}

export interface PartsCheckIn {
  id: number;
  partName: string;
  emotion: string;
  quadrant: string;
  intensity: number;
  burden?: string;
  need?: string;
  createdAt: string;
}

// Add more types as needed
```

- [ ] Type definitions created
- [ ] All API models typed

### 3.2 Implement API Service

Copy the API service from `FRONTEND_BACKEND_INTEGRATION.md` to `src/services/api.ts`

- [ ] API service implemented
- [ ] Authentication methods added
- [ ] CRUD methods for all resources added
- [ ] Error handling configured
- [ ] Token interceptor configured

### 3.3 Implement Sync Manager

Copy the sync manager from `FRONTEND_BACKEND_INTEGRATION.md` to `src/services/syncManager.ts`

- [ ] Sync manager implemented
- [ ] Network listener configured
- [ ] Sync queue implemented
- [ ] Offline-first strategy working

### 3.4 Create Custom Hooks

Create `src/hooks/useAPI.ts`:

```typescript
import { useState, useEffect } from 'react';

export function useAPI<T>(
  apiCall: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiCall();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error, refetch: () => {} };
}
```

- [ ] Custom hooks created
- [ ] `useAPI` hook implemented
- [ ] `useAuth` hook implemented

## Phase 4: Update Frontend Screens

### 4.1 Add Authentication Screen

Create `src/screens/AuthScreen.tsx`:

- [ ] Login form created
- [ ] Registration form created
- [ ] API integration working
- [ ] Token storage working
- [ ] Navigation after login working

### 4.2 Update Archetype Screen

Modify existing archetype quiz to save to backend:

- [ ] Quiz results saved to backend
- [ ] Archetype stored in user profile
- [ ] API call on quiz completion

### 4.3 Update Check-In Screen

Modify daily check-in:

- [ ] Save to AsyncStorage (local)
- [ ] Queue for backend sync
- [ ] Sync when online
- [ ] Display sync status
- [ ] Handle offline mode

### 4.4 Update Community Screen

Modify community features:

- [ ] Fetch messages from backend
- [ ] Post new messages to backend
- [ ] Like messages
- [ ] Real-time or polling updates
- [ ] Offline support

### 4.5 Update Interventions

Modify letters, journal, gratitude:

- [ ] Letters synced to backend
- [ ] Journal entries synced
- [ ] Gratitude entries synced
- [ ] Retrieve from backend on new device

### 4.6 Add Settings Screen

Create settings for account management:

- [ ] View profile
- [ ] Edit profile
- [ ] Change password
- [ ] Logout
- [ ] Delete account

## Phase 5: Navigation Updates

### 5.1 Add Auth Flow

Modify `src/navigation/AppNavigator.tsx`:

```typescript
const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};
```

- [ ] Auth state management added
- [ ] Navigation guards implemented
- [ ] Protected routes configured
- [ ] Splash screen during auth check

## Phase 6: Testing

### 6.1 Unit Tests

- [ ] API service tests
- [ ] Sync manager tests
- [ ] Custom hooks tests
- [ ] All tests passing

### 6.2 Integration Tests

Test complete flows:

- [ ] Registration → Onboarding → Dashboard
- [ ] Login → View data
- [ ] Create check-in (online) → Syncs immediately
- [ ] Create check-in (offline) → Syncs when online
- [ ] Community messaging works
- [ ] Push notifications work

### 6.3 Manual Testing

- [ ] Install on physical device
- [ ] Test with real backend
- [ ] Test offline functionality
- [ ] Test data persistence
- [ ] Test across app restarts
- [ ] Test account logout/login

## Phase 7: Performance & UX

### 7.1 Loading States

- [ ] Loading indicators on all API calls
- [ ] Skeleton screens for lists
- [ ] Optimistic UI updates
- [ ] Error boundaries

### 7.2 Error Handling

- [ ] Network error messages
- [ ] Auth error handling
- [ ] Retry mechanisms
- [ ] User-friendly error messages

### 7.3 Caching

- [ ] Cache API responses
- [ ] Invalidate cache on updates
- [ ] Background refresh
- [ ] Cache expiration

## Phase 8: Production Deployment

### 8.1 Backend Production

- [ ] Environment variables set
- [ ] Database migrations run
- [ ] HTTPS configured
- [ ] Logging configured
- [ ] Monitoring set up (optional)

### 8.2 Frontend Production Build

```bash
# Update app.json with production API URL
# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

- [ ] Production API URL configured
- [ ] App icons and splash screens updated
- [ ] App Store metadata prepared
- [ ] Privacy policy URL added
- [ ] iOS build created
- [ ] TestFlight testing done
- [ ] Submitted to App Store

## Phase 9: Post-Launch

### 9.1 Monitoring

- [ ] Backend error monitoring (Sentry/Rollbar)
- [ ] Frontend crash reporting (Expo crashlytics)
- [ ] Analytics configured (optional)
- [ ] Performance monitoring

### 9.2 User Migration

For existing users with local data:

- [ ] Migration prompt implemented
- [ ] Data migration function tested
- [ ] Migration success rate tracked
- [ ] Rollback plan ready

### 9.3 Documentation

- [ ] User guide created
- [ ] API documentation updated
- [ ] Troubleshooting guide created
- [ ] Support email/system set up

## Verification Checklist

### Essential Features Working

- [ ] User registration and login
- [ ] Daily IFS check-ins syncing
- [ ] Archetype quiz results saved
- [ ] Community messages visible and postable
- [ ] Interventions (letters, journal, gratitude) syncing
- [ ] Offline mode works
- [ ] Data syncs when back online
- [ ] Push notifications registered (if implemented)

### Quality Checks

- [ ] No console errors
- [ ] No memory leaks
- [ ] App doesn't crash
- [ ] Smooth animations
- [ ] Fast response times (<2s for API calls)
- [ ] Works on slow networks
- [ ] Handles backend downtime gracefully

### Security Checks

- [ ] Passwords hashed on backend
- [ ] JWT tokens secure
- [ ] HTTPS only in production
- [ ] No sensitive data in logs
- [ ] No hardcoded secrets
- [ ] Rate limiting tested

## Troubleshooting Common Issues

### Issue: API calls fail with CORS error
**Solution**: 
- Check backend CORS configuration
- Verify API URL is correct
- Ensure HTTPS in production

### Issue: Token expires too quickly
**Solution**:
- Increase JWT expiration time
- Implement refresh token flow
- Add automatic token refresh

### Issue: Offline sync not working
**Solution**:
- Check NetInfo configuration
- Verify sync queue logic
- Test network state changes

### Issue: App crashes on launch
**Solution**:
- Check for missing environment variables
- Verify all dependencies installed
- Check for breaking changes in packages

## Success Criteria

The integration is complete when:

1. ✅ Users can register and login
2. ✅ All data syncs to backend
3. ✅ App works offline with sync
4. ✅ Community features work
5. ✅ No critical bugs
6. ✅ App approved on App Store
7. ✅ Users can access data across devices
8. ✅ Performance is acceptable (<2s load times)

## Timeline Estimate

- **Phase 1-2** (Backend + Frontend Setup): 1-2 days
- **Phase 3** (API Layer): 2-3 days  
- **Phase 4** (Screen Updates): 3-5 days
- **Phase 5** (Navigation): 1 day
- **Phase 6** (Testing): 2-3 days
- **Phase 7** (Polish): 1-2 days
- **Phase 8** (Deployment): 1-2 days
- **Phase 9** (Post-launch): Ongoing

**Total: 2-3 weeks** for complete integration

## Resources

- [Frontend-Backend Integration Guide](./FRONTEND_BACKEND_INTEGRATION.md)
- [Backend README](./README.md)
- [Frontend Repository](https://github.com/lukelarkin/APP)
- [Expo Documentation](https://docs.expo.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
