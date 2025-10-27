# IFS Backend Endpoints - Verification Guide

This document confirms that the IFS (Internal Family Systems) backend endpoints have been implemented.

## ✅ Backend Endpoints Exist

The following endpoints have been created:

### 1. POST `/ifs/checkin`
Creates a single IFS check-in.

**Location**: `src/routes/ifs.routes.ts` → `src/controllers/ifs.controller.ts`

**Request Body**:
```json
{
  "partName": "Anxious Protector",
  "emotion": "anxious",
  "quadrant": "activated",
  "intensity": 7,
  "burden": "Fear of rejection",
  "need": "Safety and reassurance",
  "notes": "Feeling worried about upcoming presentation"
}
```

**Response** (201 Created):
```json
{
  "message": "IFS check-in created successfully",
  "checkIn": {
    "id": 1,
    "userId": 1,
    "partName": "Anxious Protector",
    "emotion": "anxious",
    "quadrant": "activated",
    "intensity": 7,
    "burden": "Fear of rejection",
    "need": "Safety and reassurance",
    "notes": "Feeling worried about upcoming presentation",
    "createdAt": "2025-10-27T18:00:00.000Z",
    "updatedAt": "2025-10-27T18:00:00.000Z",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 2. POST `/ifs/sync`
Syncs multiple IFS check-ins (batch create).

**Location**: `src/routes/ifs.routes.ts` → `src/controllers/ifs.controller.ts`

**Request Body**:
```json
{
  "checkIns": [
    {
      "partName": "Inner Critic",
      "emotion": "angry",
      "quadrant": "challenged",
      "intensity": 6,
      "notes": "Being harsh on myself",
      "timestamp": "2025-10-27T10:00:00.000Z"
    },
    {
      "partName": "Nurturing Self",
      "emotion": "calm",
      "quadrant": "centered",
      "intensity": 8,
      "notes": "Practicing self-compassion",
      "timestamp": "2025-10-27T14:00:00.000Z"
    }
  ]
}
```

**Response** (200 OK):
```json
{
  "message": "Successfully synced 2 check-ins",
  "syncedCount": 2,
  "checkIns": [...]
}
```

### 3. GET `/ifs/checkins`
Retrieves IFS check-ins with pagination.

**Location**: `src/routes/ifs.routes.ts` → `src/controllers/ifs.controller.ts`

**Query Parameters**:
- `limit` (optional, default: 50): Number of items per page
- `offset` (optional, default: 0): Number of items to skip

**Example**: `GET /ifs/checkins?limit=10&offset=0`

**Response** (200 OK):
```json
{
  "checkIns": [...],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

## 📁 File Structure

```
src/
├── routes/
│   └── ifs.routes.ts          ✅ IFS routes defined here
├── controllers/
│   └── ifs.controller.ts      ✅ Business logic for IFS endpoints
├── middleware/
│   └── auth.middleware.ts     ✅ Authentication (optional for these endpoints)
├── tests/
│   ├── setup.ts
│   └── ifs.test.ts            ✅ Tests for IFS endpoints
└── index.ts                   ✅ Main server file with route mounting
```

## 🔍 Verification Commands

### 1. Search for IFS Routes
```bash
grep -R "ifs/checkin" src/
```
Output: Shows matches in `src/routes/ifs.routes.ts`

### 2. Search for IFS Sync
```bash
grep -R "ifs/sync" src/
```
Output: Shows matches in `src/routes/ifs.routes.ts`

### 3. List Route and Controller Files
```bash
find src -name "*ifs*" -type f
```
Output:
```
src/routes/ifs.routes.ts
src/controllers/ifs.controller.ts
src/tests/ifs.test.ts
```

## 🧪 Testing

Run the test suite to verify endpoints work correctly:

```bash
npm install
npm test
```

The test file `src/tests/ifs.test.ts` includes comprehensive tests for:
- Creating single check-ins
- Syncing multiple check-ins
- Fetching check-ins with pagination
- Error handling and validation

## 🚀 Running the Server

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL
```

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Start the development server:
```bash
npm run dev
```

Server will be available at `http://localhost:3000`

## 📝 Manual Testing with curl

### Create a check-in:
```bash
curl -X POST http://localhost:3000/ifs/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "partName": "Anxious Protector",
    "emotion": "anxious",
    "quadrant": "activated",
    "intensity": 7,
    "notes": "Test check-in"
  }'
```

### Sync multiple check-ins:
```bash
curl -X POST http://localhost:3000/ifs/sync \
  -H "Content-Type: application/json" \
  -d '{
    "checkIns": [
      {
        "partName": "Inner Critic",
        "emotion": "angry",
        "quadrant": "challenged",
        "intensity": 6
      }
    ]
  }'
```

### Get check-ins:
```bash
curl http://localhost:3000/ifs/checkins?limit=10&offset=0
```

## ✅ Confirmation

✅ **Great — backend is ready!**

The following endpoints have been confirmed:
- ✅ `router.post('/ifs/checkin', createIFSCheckIn)` 
- ✅ `router.post('/ifs/sync', syncIFSCheckIns)`
- ✅ `router.get('/ifs/checkins', getIFSCheckIns)`

All files exist in their expected locations:
- ✅ `/src/routes/ifs.routes.ts`
- ✅ `/src/controllers/ifs.controller.ts`
- ✅ Tests in `/src/tests/ifs.test.ts`
