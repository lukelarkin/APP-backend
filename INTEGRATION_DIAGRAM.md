# Integration Diagram: Frontend + Backend

## Visual Overview

### Current Situation

```
┌──────────────────────────────────┐     ┌──────────────────────────────────┐
│  Frontend Repository             │     │  Backend Repository              │
│  (lukelarkin/APP)                │     │  (lukelarkin/APP-backend)        │
├──────────────────────────────────┤     ├──────────────────────────────────┤
│                                  │     │                                  │
│  ✅ React Native/Expo            │     │  ✅ Node.js/TypeScript           │
│  ✅ All screens built            │     │  ✅ Express REST API             │
│  ✅ Beautiful UI                 │     │  ✅ PostgreSQL + Prisma          │
│  ✅ Dark theme                   │     │  ✅ JWT Authentication           │
│  ✅ Navigation                   │     │  ✅ 40+ API endpoints            │
│  ✅ Offline storage              │     │  ✅ All tests passing            │
│                                  │     │  ✅ Docker ready                 │
│  ❌ No backend connection        │     │  ⏸️  Not deployed                │
│  ❌ Data only on device          │     │  ⏸️  Not connected to frontend   │
│  ❌ No cloud sync                │     │                                  │
│                                  │     │                                  │
└──────────────────────────────────┘     └──────────────────────────────────┘
         Fully functional                       Fully functional
         (offline only)                         (no frontend yet)
```

### After Integration

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    Fully Functional iOS App                               │
└───────────────────────────────────────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         │                                                     │
         ▼                                                     ▼
┌────────────────────────┐                         ┌─────────────────────┐
│  Frontend (iOS App)    │                         │  Backend (Cloud)    │
├────────────────────────┤                         ├─────────────────────┤
│                        │                         │                     │
│  📱 React Native/Expo  │◄────── HTTPS API ──────►│  🖥️  Express API    │
│                        │      (REST/JSON)        │                     │
│  ┌──────────────────┐ │                         │  ┌───────────────┐  │
│  │ Screens          │ │                         │  │ Controllers   │  │
│  │ - Auth           │ │                         │  │ - auth        │  │
│  │ - Check-in       │ │                         │  │ - users       │  │
│  │ - Community      │ │                         │  │ - checkins    │  │
│  │ - Profile        │ │                         │  │ - community   │  │
│  └────────┬─────────┘ │                         │  └───────┬───────┘  │
│           │           │                         │          │          │
│  ┌────────▼─────────┐ │                         │  ┌───────▼───────┐  │
│  │ API Service NEW  │ │                         │  │ Business      │  │
│  │ - HTTP client    │ │                         │  │ Logic         │  │
│  │ - Auth tokens    │ │                         │  └───────┬───────┘  │
│  │ - Error handling │ │                         │          │          │
│  └────────┬─────────┘ │                         │  ┌───────▼───────┐  │
│           │           │                         │  │ Prisma ORM    │  │
│  ┌────────▼─────────┐ │                         │  └───────┬───────┘  │
│  │ Sync Manager NEW │ │                         │          │          │
│  │ - Queue          │ │                         │  ┌───────▼───────┐  │
│  │ - Network check  │ │                         │  │ PostgreSQL    │  │
│  │ - Retry logic    │ │                         │  │ Database      │  │
│  └────────┬─────────┘ │                         │  └───────────────┘  │
│           │           │                         │                     │
│  ┌────────▼─────────┐ │                         │  Railway/Render     │
│  │ AsyncStorage     │ │                         │  $5-10/month        │
│  │ (Local Cache)    │ │                         │                     │
│  └──────────────────┘ │                         └─────────────────────┘
│                        │
│  iPhone/iPad           │
│  Free download         │
│                        │
└────────────────────────┘
```

## Data Flow

### Creating a Check-In (Integrated)

```
User fills form on iPhone
         │
         ▼
   ┌─────────────┐
   │ CheckInScreen│
   └──────┬──────┘
          │ 1. Immediate save
          ▼
   ┌─────────────┐
   │AsyncStorage │ ◄── User sees instant feedback
   └──────┬──────┘
          │ 2. Queue for sync
          ▼
   ┌─────────────┐
   │ SyncManager │
   └──────┬──────┘
          │ 3. Check network
          ▼
    Network online?
          │
    ┌─────┴─────┐
    │           │
 YES│           │NO
    │           │
    ▼           ▼
┌────────┐  ┌────────┐
│ Sync   │  │ Queue  │
│ Now    │  │ Later  │
└───┬────┘  └────┬───┘
    │            │
    ▼            │ (Will retry when online)
┌────────────────┴───┐
│  API: POST /parts  │
└────────┬───────────┘
         │ 4. Save to cloud
         ▼
   ┌─────────────┐
   │ Backend API │
   └──────┬──────┘
          │ 5. Store in DB
          ▼
   ┌─────────────┐
   │ PostgreSQL  │
   └─────────────┘

Result: ✅ Data on device (instant)
        ✅ Data in cloud (when online)
        ✅ Accessible from other devices
```

## Authentication Flow

### Current (Offline Only)

```
Open App ──► Home Screen ──► Use App
                             (no account needed)
                             (no cloud sync)
```

### After Integration

```
Open App
    │
    ▼
Check token?
    │
    ├─── Token exists ───► Verify with backend ───► Home Screen
    │                            │
    │                            ▼
    │                        Token invalid
    │                            │
    └─── No token ──────────────┘
                │
                ▼
        ┌───────────────┐
        │ Auth Screen   │
        │               │
        │ [Login]       │
        │ [Register]    │
        │ [Skip]        │  ◄── Still allows offline use!
        └───────┬───────┘
                │
        ┌───────┴───────┐
        │               │
    Login/Register    Skip
        │               │
        ▼               ▼
    ┌────────┐    ┌─────────┐
    │ Cloud  │    │ Offline │
    │ Synced │    │ Only    │
    └────────┘    └─────────┘
```

## File Structure After Integration

### Frontend Changes

```
APP/
├── src/
│   ├── services/           ⬅️ NEW FOLDER
│   │   ├── api.ts         ⬅️ NEW - Main API client
│   │   ├── syncManager.ts ⬅️ NEW - Offline sync
│   │   └── storage.ts     ⬅️ NEW - Storage wrapper
│   │
│   ├── hooks/              ⬅️ NEW FOLDER
│   │   ├── useAPI.ts      ⬅️ NEW - API hook
│   │   ├── useAuth.ts     ⬅️ NEW - Auth hook
│   │   └── useSync.ts     ⬅️ NEW - Sync status
│   │
│   ├── types/              ⬅️ NEW FOLDER
│   │   ├── api.ts         ⬅️ NEW - API types
│   │   └── models.ts      ⬅️ NEW - Data models
│   │
│   ├── screens/
│   │   ├── AuthScreen.tsx        ⬅️ NEW
│   │   ├── LoginScreen.tsx       ⬅️ NEW
│   │   ├── RegisterScreen.tsx    ⬅️ NEW
│   │   ├── ProfileScreen.tsx     ⬅️ NEW
│   │   ├── CheckInScreen.tsx     ⬅️ MODIFIED (add sync)
│   │   ├── CommunityScreen.tsx   ⬅️ MODIFIED (real data)
│   │   └── ...                   ⬅️ OTHERS (minor updates)
│   │
│   └── navigation/
│       └── AppNavigator.tsx ⬅️ MODIFIED (add auth flow)
│
├── .env                     ⬅️ NEW - API URL config
└── package.json             ⬅️ MODIFIED (new dependencies)
```

### Backend (Already Complete)

```
APP-backend/
├── src/
│   ├── controllers/     ✅ Ready
│   ├── services/        ✅ Ready
│   ├── routes/          ✅ Ready
│   ├── middleware/      ✅ Ready
│   └── config/          ✅ Ready
├── prisma/
│   └── schema.prisma    ✅ Ready
├── Dockerfile           ✅ Ready
└── docker-compose.yml   ✅ Ready
```

## Integration Phases Visual

```
Phase 1: Backend Deployment (Day 1)
┌────────────────────────────────┐
│ Deploy to Railway.app          │ 10-15 minutes
│ PostgreSQL automatically added │
│ Get backend URL                │
└───────────────┬────────────────┘
                │
                ▼

Phase 2: API Layer (Days 2-4)
┌────────────────────────────────┐
│ Create src/services/api.ts     │ Day 2-3
│ Create src/services/sync.ts    │ Day 3-4
│ Add authentication screens     │ Day 4
└───────────────┬────────────────┘
                │
                ▼

Phase 3: Screen Updates (Days 5-10)
┌────────────────────────────────┐
│ Update CheckInScreen           │ Day 5
│ Update InterventionsScreen     │ Day 6-7
│ Update CommunityScreen         │ Day 8
│ Update ProfileScreen           │ Day 9
│ Testing & fixes                │ Day 10
└───────────────┬────────────────┘
                │
                ▼

Phase 4: Testing (Days 11-13)
┌────────────────────────────────┐
│ Test offline sync              │ Day 11
│ Test on physical device        │ Day 12
│ User acceptance testing        │ Day 13
└───────────────┬────────────────┘
                │
                ▼

Phase 5: Deployment (Days 14-15)
┌────────────────────────────────┐
│ Build iOS app with EAS         │ Day 14
│ Submit to App Store            │ Day 15
│ Wait for review (1-3 days)     │
└────────────────────────────────┘
```

## Communication Between Components

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (iOS App)                     │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  User Action (e.g., Create Check-in)                     │
│         │                                                 │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │ React Screen │ 1. User interaction                    │
│  └──────┬───────┘                                        │
│         │                                                 │
│         │ 2. Call API service                            │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │ API Service  │ 3. Format request                      │
│  │              │    Add auth token                      │
│  └──────┬───────┘    Handle errors                       │
│         │                                                 │
│         │ 4. HTTP POST                                   │
│         │                                                 │
└─────────┼─────────────────────────────────────────────────┘
          │
          │ 5. HTTPS Request
          │    POST /api/parts
          │    Authorization: Bearer <token>
          │    Body: { partName, emotion, ... }
          │
          ▼
┌──────────────────────────────────────────────────────────┐
│                  Backend (Cloud Server)                   │
├──────────────────────────────────────────────────────────┤
│         │                                                 │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │ Auth Middleware 6. Verify JWT token                   │
│  └──────┬───────┘                                        │
│         │                                                 │
│         │ 7. Token valid, extract user                   │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │ Controller   │ 8. Validate input                      │
│  └──────┬───────┘    Route to service                    │
│         │                                                 │
│         │ 9. Process business logic                      │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │ Service      │ 10. Format data                        │
│  └──────┬───────┘     Call Prisma                        │
│         │                                                 │
│         │ 11. Database query                             │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │ Prisma ORM   │ 12. Execute SQL                        │
│  └──────┬───────┘                                        │
│         │                                                 │
│         │ 13. INSERT INTO parts_check_in                 │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │ PostgreSQL   │ 14. Store data                         │
│  └──────┬───────┘     Return ID                          │
│         │                                                 │
│         │ 15. Success response                           │
│         │                                                 │
└─────────┼─────────────────────────────────────────────────┘
          │
          │ 16. JSON Response
          │    { id: 123, partName: "...", ... }
          │
          ▼
┌──────────────────────────────────────────────────────────┐
│                    Frontend (iOS App)                     │
│         │                                                 │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │ API Service  │ 17. Receive response                   │
│  └──────┬───────┘     Parse JSON                         │
│         │                                                 │
│         │ 18. Return to screen                           │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │ React Screen │ 19. Update UI                          │
│  └──────────────┘     Show success                       │
│                       Navigate away                       │
│                                                           │
└──────────────────────────────────────────────────────────┘

Total time: ~200-500ms
```

## Offline Sync Process

```
TIME: User is OFFLINE
┌──────────────────────────────┐
│ User creates check-in        │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ 1. Save to AsyncStorage      │ ✅ Instant success
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ 2. Add to sync queue         │
│    Queue: [item1, item2]     │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ 3. Try to sync (fails)       │ ❌ No network
│    Status: "Pending sync"    │
└──────────────────────────────┘

TIME: User comes back ONLINE
┌──────────────────────────────┐
│ Network reconnected          │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ 4. Sync manager detects      │ ✅ Network available
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ 5. Process queue             │
│    For each item:            │
│    - Send to backend         │
│    - Wait for confirmation   │
│    - Remove from queue       │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ 6. All items synced          │ ✅ Queue empty
│    Status: "All synced"      │
└──────────────────────────────┘
```

## Multi-Device Sync

```
Device A (iPhone)                      Device B (iPad)
     │                                      │
     │ 1. User creates check-in             │
     │    on iPhone                         │
     ▼                                      │
┌──────────┐                               │
│AsyncStorage                               │
└────┬─────┘                               │
     │ 2. Sync to backend                  │
     │                                      │
     ▼                                      │
┌─────────────────────────────────────────┐│
│         Backend API + Database          ││
└─────────────────────────────────────────┘│
                    │                       │
                    │ 3. User opens iPad    │
                    │                       ▼
                    │                  ┌──────────┐
                    │                  │ App Launch
                    │                  └────┬─────┘
                    │                       │ 4. Fetch data
                    │                       ▼
                    │                  ┌──────────┐
                    │◄─────────────────│API Call  │
                    │                  └────┬─────┘
                    │ 5. Return all data    │
                    │                       ▼
                    │                  ┌──────────┐
                    │                  │Display   │
                    │                  │check-ins │
                    │                  └──────────┘
                    │                       ✅ Sees data
                    │                          from iPhone!
```

## Summary: What Gets Built

### NEW Components (Frontend)
1. ✅ API Service - HTTP client with auth
2. ✅ Sync Manager - Offline queue system
3. ✅ Auth Screens - Login & register
4. ✅ Network Indicator - Show sync status

### UPDATED Components (Frontend)
1. 🔄 All data screens - Add API calls
2. 🔄 Navigation - Add auth flow
3. 🔄 Storage - Wrap with sync

### DEPLOYED (Backend)
1. 🚀 Backend API - To Railway/Render
2. 🚀 PostgreSQL - Database in cloud

### Time Investment
- **Code**: 2-3 weeks
- **Testing**: Included
- **Deployment**: Day 1 (backend) + Day 15 (iOS)

### Cost Investment
- **Monthly**: $5-10 (backend)
- **Yearly**: $99 (Apple)
- **Total**: ~$190/year

### Value Delivered
- ✅ Cloud sync across devices
- ✅ Real community features
- ✅ Push notifications ready
- ✅ Data backup & recovery
- ✅ Multi-user support
- ✅ Analytics ready

---

**Ready to start?** → [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)

**Need more details?** → [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)
