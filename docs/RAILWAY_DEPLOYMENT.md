# Railway Deployment Guide

## Overview
This document covers the Railway deployment configuration for the TARU backend API.

## Railway Configuration

### Build Command
```bash
npm ci && npm run build && npm run prisma:migrate:deploy
```

### Start Command
```bash
npm start
```

### Environment Variables
- `NODE_ENV=production`
- `JWT_SECRET=<secure-random-string>`
- `DATABASE_URL` (auto-provided by Railway PostgreSQL)

### Generated JWT Secret
```bash
openssl rand -base64 32
```

## Deployment URL
- **Production**: `https://beneficial-illumination-production-ddb6.up.railway.app`

## Smoke Tests

### Health Check
```bash
curl https://beneficial-illumination-production-ddb6.up.railway.app/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### IFS Check-in
```bash
curl -X POST https://beneficial-illumination-production-ddb6.up.railway.app/ifs/checkin \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","emotions":["anxiety"],"parts":["inner-critic"],"burdens":["perfectionism"]}'
```
Expected: `201 Created`

### IFS Sync
```bash
curl -X POST https://beneficial-illumination-production-ddb6.up.railway.app/ifs/sync \
  -H "Content-Type: application/json" \
  -d '[{"userId":"test","emotions":["anxiety"],"parts":["inner-critic"],"burdens":["perfectionism"]}]'
```
Expected: `201 Created`

## Frontend Integration

### Environment Variable
Create `.env` in frontend:
```
EXPO_PUBLIC_API_URL=https://beneficial-illumination-production-ddb6.up.railway.app
```

### Cache Clear
After updating environment:
```bash
expo start -c
```

## Troubleshooting

### Database Issues
- Ensure `prisma:migrate:deploy` runs during build
- Check Railway logs for migration errors
- Verify `DATABASE_URL` is set correctly

### Build Failures
- Check that all dependencies are in `package.json`
- Verify TypeScript compilation succeeds locally
- Ensure `postinstall` script runs `prisma generate`

### Runtime Errors
- Check Railway logs for application errors
- Verify environment variables are set
- Test endpoints individually with curl
