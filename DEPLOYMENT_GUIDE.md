# Quick Deployment Guide

This guide provides the fastest path to deploying the integrated TARU app (frontend + backend).

## Option 1: Railway.app (Recommended - Easiest)

### Backend Deployment

1. **Sign up**: Go to [railway.app](https://railway.app) and sign up with GitHub

2. **Create new project**: Click "New Project" → "Deploy from GitHub repo"

3. **Select repository**: Choose `lukelarkin/APP-backend`

4. **Add PostgreSQL**: 
   - In your project, click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically sets `DATABASE_URL` environment variable

5. **Configure environment variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-with: openssl rand -base64 32>
   PORT=3000
   ```

6. **Deploy**: 
   - Click "Deploy"
   - Railway will automatically build and deploy
   - Get your URL: `https://your-app.up.railway.app`

7. **Run migrations**:
   - Go to "Settings" → "Build Command"
   - Set to: `npm run build && npm run prisma:migrate:deploy`

**Estimated time: 10-15 minutes**

### Frontend Configuration

1. **Update API URL** in frontend:
   ```bash
   cd APP
   echo "EXPO_PUBLIC_API_URL=https://your-app.up.railway.app/api" > .env
   ```

2. **Test locally**:
   ```bash
   npm start
   ```

3. **Build for iOS**:
   ```bash
   eas build --platform ios --profile production
   ```

## Option 2: Render.com (Free Tier Available)

### Backend Deployment

1. **Sign up**: Go to [render.com](https://render.com) and sign up

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub repository: `lukelarkin/APP-backend`
   - Name: `taru-backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build && npm run prisma:generate`
   - Start Command: `npm start`

3. **Add PostgreSQL**:
   - Click "New +" → "PostgreSQL"
   - Name: `taru-db`
   - Copy the "Internal Database URL"

4. **Configure Environment Variables**:
   - Go to your Web Service → "Environment"
   - Add:
     ```
     DATABASE_URL=<paste-internal-database-url>
     JWT_SECRET=<generate-random-string>
     NODE_ENV=production
     PORT=10000
     ```

5. **Run migrations**:
   - Go to "Shell" tab
   - Run: `npm run prisma:migrate:deploy`

6. **Deploy**: Render auto-deploys on git push

**Your URL**: `https://taru-backend.onrender.com`

**Estimated time: 15-20 minutes**

### Frontend Configuration

Same as Railway option above, just use Render URL instead.

## Option 3: Heroku (Classic, Requires Credit Card)

### Backend Deployment

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
cd APP-backend
heroku create taru-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configure environment
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate:deploy

# Open app
heroku open
```

**Your URL**: `https://taru-backend.herokuapp.com`

**Estimated time: 15-20 minutes**

## Option 4: DigitalOcean App Platform

### Backend Deployment

1. **Sign up**: Go to [digitalocean.com](https://digitalocean.com)

2. **Create App**:
   - Click "Create" → "App Platform"
   - Connect GitHub: `lukelarkin/APP-backend`
   - Auto-detect Node.js settings

3. **Add PostgreSQL Database**:
   - In app settings, click "Create Component" → "Database"
   - Select PostgreSQL
   - Name: `taru-db`

4. **Environment Variables**:
   ```
   DATABASE_URL=${db.DATABASE_URL}
   NODE_ENV=production
   JWT_SECRET=<generate-random>
   PORT=8080
   ```

5. **Deploy**: Click "Deploy"

**Your URL**: `https://taru-backend-xxxxx.ondigitalocean.app`

**Estimated time: 15-20 minutes**

## Local Development Setup (For Testing)

### Quick Start

```bash
# Terminal 1 - Backend
cd APP-backend
npm install
cp .env.example .env
# Edit .env and set DATABASE_URL
npm run prisma:migrate
npm run dev

# Terminal 2 - Expose backend to mobile
ngrok http 3000
# Copy ngrok URL (e.g., https://abc123.ngrok.io)

# Terminal 3 - Frontend
cd APP
npm install
echo "EXPO_PUBLIC_API_URL=https://abc123.ngrok.io/api" > .env
npm start
```

**Estimated time: 10 minutes**

## Docker Deployment (Any Cloud Provider)

### Build and Deploy

```bash
# Build image
cd APP-backend
docker build -t taru-backend .

# Test locally
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  taru-backend

# Push to registry (Docker Hub example)
docker tag taru-backend your-username/taru-backend
docker push your-username/taru-backend

# Deploy to any cloud (AWS, GCP, Azure)
```

## Frontend Deployment (iOS App Store)

### Prerequisites

```bash
npm install -g eas-cli
eas login
```

### Build and Submit

```bash
cd APP

# Configure
eas build:configure

# Update app.json with production API URL
# {
#   "expo": {
#     "extra": {
#       "apiUrl": "https://your-backend-url.com/api"
#     }
#   }
# }

# Build for iOS
eas build --platform ios --profile production

# When build completes, submit to App Store
eas submit --platform ios
```

**Estimated time**: 
- Build: 10-20 minutes
- App Store review: 1-3 days

## Environment Variables Summary

### Backend (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT tokens | Generate with `openssl rand -base64 32` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Port to run on | `3000` (default) |

### Frontend (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API URL | `https://your-backend.com/api` |

## Testing Deployment

### Test Backend

```bash
# Health check
curl https://your-backend-url.com/health

# Register user
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Should return token
```

### Test Frontend

1. Open Expo Go app on phone
2. Scan QR code from `npm start`
3. Try to register/login
4. Create a check-in
5. Verify data appears in backend database

## Production Checklist

Before launching to users:

- [ ] Backend deployed and accessible
- [ ] PostgreSQL database created
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] HTTPS enabled
- [ ] Health check endpoint working
- [ ] Frontend built with production API URL
- [ ] API calls working from app
- [ ] Authentication working
- [ ] Data persistence verified
- [ ] Offline mode tested
- [ ] App Store metadata complete
- [ ] Privacy policy URL added
- [ ] TestFlight testing completed

## Costs Estimate

### Development/Testing (Free Options)

- **Render.com**: Free (with limitations - sleeps after 15 min inactivity)
- **Supabase**: Free tier (PostgreSQL)
- **Expo**: Free for development

### Production (Paid)

| Service | Cost | Specs |
|---------|------|-------|
| **Railway** | ~$5-10/month | Small instance + PostgreSQL |
| **Render** | ~$7-15/month | Starter instance + PostgreSQL |
| **Heroku** | ~$7-15/month | Eco dyno + Mini PostgreSQL |
| **DigitalOcean** | ~$12/month | Basic app + PostgreSQL |
| **Expo EAS** | Free for builds | Unlimited builds |
| **Apple Developer** | $99/year | Required for App Store |

**Total estimated: $15-25/month + $99/year**

## Support Resources

### If deployment fails:

1. **Check logs**: All platforms have log viewers
2. **Verify environment variables**: Check they're set correctly
3. **Database connection**: Test DATABASE_URL separately
4. **Build errors**: Check build logs for missing dependencies
5. **Runtime errors**: Check application logs

### Getting Help:

- **Railway**: [railway.app/help](https://railway.app/help)
- **Render**: [render.com/docs](https://render.com/docs)
- **Expo**: [docs.expo.dev](https://docs.expo.dev)
- **GitHub Issues**: Create issue in repository

## Next Steps After Deployment

1. **Test thoroughly**: Register, login, create data, sync
2. **Monitor performance**: Check response times
3. **Set up monitoring**: Use Sentry or LogRocket
4. **Enable analytics**: Track user behavior (optional)
5. **Plan updates**: Set up CI/CD for automatic deployments
6. **User feedback**: Create feedback mechanism
7. **Marketing**: Prepare App Store listing and launch!

## Recommended Setup (Best Value)

For production launch:

1. **Backend**: Railway.app ($5-10/month)
   - Easy deployment
   - Auto-scaling
   - Built-in PostgreSQL
   - Good logging

2. **Frontend**: Expo EAS (Free)
   - Easy builds
   - TestFlight integration
   - Over-the-air updates

3. **Monitoring**: Sentry (Free tier)
   - Error tracking
   - Performance monitoring

**Total: ~$5-10/month + $99/year = ~$190/year**

## Quick Commands Reference

```bash
# Backend - Railway
railway login
railway init
railway add postgresql
railway up

# Backend - Render (via web UI)

# Frontend - Build iOS
eas build --platform ios

# Frontend - Submit iOS
eas submit --platform ios

# Test backend
curl https://your-backend.com/health

# Generate JWT secret
openssl rand -base64 32

# Check Expo config
npx expo config

# Check backend env
heroku config  # or railway vars
```
