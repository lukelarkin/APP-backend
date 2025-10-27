#!/bin/bash

# Test script for deployed TARU Backend
BACKEND_URL=${1:-"https://taru-backend-production.up.railway.app"}

echo "🧪 Testing TARU Backend Deployment"
echo "=================================="
echo "Backend URL: $BACKEND_URL"
echo ""

# Test health endpoint
echo "1. Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/health")
if [[ $HEALTH_RESPONSE == *"ok"* ]]; then
    echo "✅ Health check passed: $HEALTH_RESPONSE"
else
    echo "❌ Health check failed: $HEALTH_RESPONSE"
fi
echo ""

# Test IFS checkin endpoint (should return 400 for missing data)
echo "2. Testing IFS Check-in Endpoint..."
IFS_RESPONSE=$(curl -s -X POST "$BACKEND_URL/ifs/checkin" \
  -H "Content-Type: application/json" \
  -d '{}')
if [[ $IFS_RESPONSE == *"Missing required fields"* ]]; then
    echo "✅ IFS endpoint working (validation working): $IFS_RESPONSE"
else
    echo "❌ IFS endpoint failed: $IFS_RESPONSE"
fi
echo ""

# Test IFS sync endpoint
echo "3. Testing IFS Sync Endpoint..."
SYNC_RESPONSE=$(curl -s -X POST "$BACKEND_URL/ifs/sync" \
  -H "Content-Type: application/json" \
  -d '{}')
if [[ $SYNC_RESPONSE == *"Invalid payload"* ]]; then
    echo "✅ IFS sync endpoint working (validation working): $SYNC_RESPONSE"
else
    echo "❌ IFS sync endpoint failed: $SYNC_RESPONSE"
fi
echo ""

# Test with valid data
echo "4. Testing with Valid IFS Check-in Data..."
VALID_RESPONSE=$(curl -s -X POST "$BACKEND_URL/ifs/checkin" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "archetype": "Warrior",
    "partStage": "Notice",
    "reflection": "Testing the deployed backend"
  }')
if [[ $VALID_RESPONSE == *"id"* ]]; then
    echo "✅ Valid IFS check-in successful: $VALID_RESPONSE"
else
    echo "❌ Valid IFS check-in failed: $VALID_RESPONSE"
fi
echo ""

echo "🎉 Deployment test complete!"
echo "If all tests passed, your backend is ready for frontend integration."
