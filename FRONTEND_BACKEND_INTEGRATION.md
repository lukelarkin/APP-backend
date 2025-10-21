# Frontend-Backend Integration Guide

This guide explains how to integrate the TARU iOS app (React Native/Expo frontend in `lukelarkin/APP`) with the Node.js/TypeScript backend (in `lukelarkin/APP-backend`).

## Overview

The TARU app consists of two separate repositories:
- **Frontend**: `lukelarkin/APP` - React Native/Expo iOS app
- **Backend**: `lukelarkin/APP-backend` - Node.js/TypeScript Express API

This integration allows the app to:
- Sync user data across devices
- Enable community features with real backend support
- Support push notifications
- Enable trigger webhooks for just-in-time interventions
- Provide analytics and insights

## Architecture

```
┌─────────────────────────────────────────┐
│   TARU iOS App (React Native/Expo)     │
│  ┌───────────────────────────────────┐  │
│  │  Screens & Components             │  │
│  └────────────┬──────────────────────┘  │
│               │                          │
│  ┌────────────▼──────────────────────┐  │
│  │  API Service Layer (NEW)          │  │
│  │  - Authentication                 │  │
│  │  - Data fetching & caching        │  │
│  │  - Offline-first strategy         │  │
│  └────────────┬──────────────────────┘  │
│               │                          │
│  ┌────────────▼──────────────────────┐  │
│  │  AsyncStorage (Local Cache)       │  │
│  └───────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │ HTTPS/REST API
               │
┌──────────────▼──────────────────────────┐
│   Backend API (Express/Node.js)         │
│  ┌───────────────────────────────────┐  │
│  │  Auth, Users, Check-ins           │  │
│  │  Interventions, Community          │  │
│  │  Triggers, Push Tokens            │  │
│  └────────────┬──────────────────────┘  │
│               │                          │
│  ┌────────────▼──────────────────────┐  │
│  │  PostgreSQL Database              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Integration Strategy

### Phase 1: API Service Layer (Frontend Changes)

Create a new API service layer in the frontend that handles all backend communication.

#### 1.1 Install Dependencies

In the frontend (`lukelarkin/APP`), add:

```bash
npm install axios
npm install @react-native-async-storage/async-storage
```

#### 1.2 Create API Service (`src/services/api.ts`)

```typescript
import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class APIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token expiration
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('auth_token');
          // Navigate to login screen
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async register(email: string, password: string, name: string) {
    const response = await this.client.post('/auth/register', { email, password, name });
    const { token } = response.data;
    await AsyncStorage.setItem('auth_token', token);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    const { token } = response.data;
    await AsyncStorage.setItem('auth_token', token);
    return response.data;
  }

  async logout() {
    await AsyncStorage.removeItem('auth_token');
  }

  // User Profile
  async getProfile() {
    const response = await this.client.get('/users/me');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.client.put('/users/me', data);
    return response.data;
  }

  // Archetypes
  async createArchetype(data: any) {
    const response = await this.client.post('/archetypes', data);
    return response.data;
  }

  async getArchetypes() {
    const response = await this.client.get('/archetypes');
    return response.data;
  }

  // Mood Check-ins
  async createMoodCheckIn(data: any) {
    const response = await this.client.post('/mood', data);
    return response.data;
  }

  async getMoodCheckIns() {
    const response = await this.client.get('/mood');
    return response.data;
  }

  // Parts Check-ins (IFS)
  async createPartsCheckIn(data: any) {
    const response = await this.client.post('/parts', data);
    return response.data;
  }

  async getPartsCheckIns() {
    const response = await this.client.get('/parts');
    return response.data;
  }

  // Letters
  async createLetter(data: any) {
    const response = await this.client.post('/letters', data);
    return response.data;
  }

  async getLetters() {
    const response = await this.client.get('/letters');
    return response.data;
  }

  // Journal Entries
  async createJournalEntry(data: any) {
    const response = await this.client.post('/journal', data);
    return response.data;
  }

  async getJournalEntries() {
    const response = await this.client.get('/journal');
    return response.data;
  }

  // Gratitude Entries
  async createGratitudeEntry(data: any) {
    const response = await this.client.post('/gratitude', data);
    return response.data;
  }

  async getGratitudeEntries() {
    const response = await this.client.get('/gratitude');
    return response.data;
  }

  // Community Messages
  async getCommunityMessages() {
    const response = await this.client.get('/community');
    return response.data;
  }

  async createCommunityMessage(data: any) {
    const response = await this.client.post('/community', data);
    return response.data;
  }

  async likeCommunityMessage(id: number) {
    const response = await this.client.post(`/community/${id}/like`);
    return response.data;
  }

  // Push Tokens
  async registerPushToken(token: string) {
    const response = await this.client.post('/push/register', { token });
    return response.data;
  }
}

export default new APIService();
```

### Phase 2: Hybrid Local-First Approach

The app should work offline-first, syncing with the backend when online.

#### 2.1 Create Sync Manager (`src/services/syncManager.ts`)

```typescript
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIService from './api';

class SyncManager {
  private syncQueue: any[] = [];
  private isOnline: boolean = true;

  constructor() {
    this.initNetworkListener();
  }

  private initNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      if (this.isOnline) {
        this.processSyncQueue();
      }
    });
  }

  async queueSync(action: string, data: any) {
    const syncItem = {
      id: Date.now().toString(),
      action,
      data,
      timestamp: new Date().toISOString(),
    };

    // Store in local queue
    const queue = await this.getSyncQueue();
    queue.push(syncItem);
    await AsyncStorage.setItem('sync_queue', JSON.stringify(queue));

    // Try to sync immediately if online
    if (this.isOnline) {
      await this.processSyncQueue();
    }
  }

  private async getSyncQueue() {
    const queueStr = await AsyncStorage.getItem('sync_queue');
    return queueStr ? JSON.parse(queueStr) : [];
  }

  private async processSyncQueue() {
    const queue = await this.getSyncQueue();
    const processedIds: string[] = [];

    for (const item of queue) {
      try {
        // Execute the sync action
        await this.executeSyncAction(item);
        processedIds.push(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item.id, error);
      }
    }

    // Remove successfully synced items
    const remainingQueue = queue.filter(
      (item: any) => !processedIds.includes(item.id)
    );
    await AsyncStorage.setItem('sync_queue', JSON.stringify(remainingQueue));
  }

  private async executeSyncAction(item: any) {
    const { action, data } = item;
    
    switch (action) {
      case 'CREATE_MOOD_CHECKIN':
        return APIService.createMoodCheckIn(data);
      case 'CREATE_PARTS_CHECKIN':
        return APIService.createPartsCheckIn(data);
      case 'CREATE_LETTER':
        return APIService.createLetter(data);
      case 'CREATE_JOURNAL':
        return APIService.createJournalEntry(data);
      case 'CREATE_GRATITUDE':
        return APIService.createGratitudeEntry(data);
      case 'CREATE_COMMUNITY_MESSAGE':
        return APIService.createCommunityMessage(data);
      default:
        console.warn('Unknown sync action:', action);
    }
  }
}

export default new SyncManager();
```

### Phase 3: Update Frontend Screens

#### 3.1 Authentication Flow

Update login/register screens to use the API:

```typescript
// src/screens/LoginScreen.tsx
import APIService from '../services/api';

const handleLogin = async () => {
  try {
    const user = await APIService.login(email, password);
    // Navigate to main app
    navigation.navigate('Main');
  } catch (error) {
    Alert.alert('Login Failed', error.message);
  }
};

const handleRegister = async () => {
  try {
    const user = await APIService.register(email, password, name);
    // Navigate to main app
    navigation.navigate('Main');
  } catch (error) {
    Alert.alert('Registration Failed', error.message);
  }
};
```

#### 3.2 Check-in Screen

Update daily check-in to sync with backend:

```typescript
// src/screens/CheckInScreen.tsx
import APIService from '../services/api';
import SyncManager from '../services/syncManager';

const handleSubmitCheckIn = async () => {
  const checkInData = {
    part: selectedPart,
    emotion: selectedEmotion,
    quadrant: selectedQuadrant,
    intensity: intensity,
    notes: notes,
  };

  // Save locally first
  await saveToLocalStorage(checkInData);

  // Queue for sync
  await SyncManager.queueSync('CREATE_PARTS_CHECKIN', checkInData);

  // Update UI
  navigation.goBack();
};
```

#### 3.3 Community Screen

Update community to fetch from backend:

```typescript
// src/screens/CommunityScreen.tsx
import APIService from '../services/api';

const CommunityScreen = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await APIService.getCommunityMessages();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
      await APIService.createCommunityMessage({
        content: text,
        type: 'support',
        isAnonymous: false,
      });
      await loadMessages();
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  // ... render UI
};
```

### Phase 4: Environment Configuration

#### 4.1 Frontend Environment Variables

Create `.env` in the frontend:

```bash
# .env (frontend)
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# For production
# EXPO_PUBLIC_API_URL=https://your-backend-domain.com/api
```

#### 4.2 Backend Environment Variables

Already configured in `.env.example`:

```bash
# .env (backend)
DATABASE_URL=postgresql://user:password@localhost:5432/taru
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
```

### Phase 5: Deployment

#### 5.1 Backend Deployment

Options:
1. **Railway.app** (Recommended for PostgreSQL + Node.js)
2. **Render.com** (Free tier available)
3. **Heroku** (PostgreSQL add-on available)
4. **DigitalOcean App Platform**

Steps for Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway link
railway up

# Add PostgreSQL
railway add postgresql

# Deploy
git push railway main
```

#### 5.2 Frontend Deployment

Update `app.json` with backend URL:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://your-backend-domain.com/api"
    }
  }
}
```

Build and submit to App Store:
```bash
# Build iOS app
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Phase 6: Testing Integration

#### 6.1 Local Testing

1. Start backend:
```bash
cd APP-backend
npm install
npm run dev
```

2. Start frontend:
```bash
cd APP
npm install
npm start
```

3. Use ngrok to test on physical device:
```bash
ngrok http 3000
# Update EXPO_PUBLIC_API_URL to ngrok URL
```

#### 6.2 Integration Tests

Create end-to-end tests:

```typescript
// __tests__/integration.test.ts
import APIService from '../src/services/api';

describe('API Integration', () => {
  let authToken: string;

  it('should register a new user', async () => {
    const result = await APIService.register(
      'test@example.com',
      'password123',
      'Test User'
    );
    expect(result.token).toBeDefined();
    authToken = result.token;
  });

  it('should create a mood check-in', async () => {
    const result = await APIService.createMoodCheckIn({
      mood: 'calm',
      intensity: 7,
      notes: 'Feeling good',
    });
    expect(result.id).toBeDefined();
  });

  // Add more tests...
});
```

## Migration Strategy

For existing users with local data:

1. **First Launch with Backend**:
   - Detect if user has local data but no account
   - Prompt to create account or continue offline
   - If account created, migrate local data to backend

2. **Data Migration Function**:

```typescript
async function migrateLocalDataToBackend() {
  const localCheckIns = await AsyncStorage.getItem('checkIns');
  const localLetters = await AsyncStorage.getItem('letters');
  
  if (localCheckIns) {
    const checkIns = JSON.parse(localCheckIns);
    for (const checkIn of checkIns) {
      await APIService.createPartsCheckIn(checkIn);
    }
  }
  
  if (localLetters) {
    const letters = JSON.parse(localLetters);
    for (const letter of letters) {
      await APIService.createLetter(letter);
    }
  }
  
  // Mark migration as complete
  await AsyncStorage.setItem('migrated_to_backend', 'true');
}
```

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **Token Storage**: JWT tokens stored securely in AsyncStorage
3. **Token Expiration**: Handle 401 responses and re-authenticate
4. **Rate Limiting**: Backend has rate limiting configured
5. **Input Validation**: All inputs validated on backend
6. **Sensitive Data**: Use secure storage for push tokens

## Troubleshooting

### Common Issues

1. **CORS Errors**: 
   - Backend has CORS configured
   - Check API_URL is correct

2. **Network Errors**:
   - Check backend is running
   - Verify firewall settings
   - Test with curl first

3. **Authentication Fails**:
   - Clear AsyncStorage
   - Check JWT_SECRET matches
   - Verify token format

4. **Sync Not Working**:
   - Check network connectivity
   - Review sync queue
   - Check backend logs

## Next Steps

1. **Phase 1**: Implement API service layer in frontend ✓
2. **Phase 2**: Add sync manager for offline support ✓
3. **Phase 3**: Update all screens to use API ✓
4. **Phase 4**: Configure environment variables ✓
5. **Phase 5**: Deploy backend and update frontend ✓
6. **Phase 6**: Test integration end-to-end ✓
7. **Phase 7**: Migrate existing users
8. **Phase 8**: Submit to App Store

## Additional Resources

- [Backend API Documentation](./README.md)
- [Frontend Repository](https://github.com/lukelarkin/APP)
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
