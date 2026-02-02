#!/bin/bash

# Test script for PHP SQLite API
# Usage: ./test-api.sh [base-url]
# Example: ./test-api.sh http://localhost:8000

BASE_URL="${1:-http://localhost:8000}"
API_URL="$BASE_URL/server/api"

echo "🧪 Testing PHP SQLite API"
echo "Base URL: $BASE_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Submit Score
echo "📝 Test 1: Submit Score (POST /api/scores)"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/scores" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","score":1500}')

body=$(echo "$response" | head -n -1)
status=$(echo "$response" | tail -n 1)

if [ "$status" = "200" ] && echo "$body" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Score submission successful${NC}"
    echo "  Response: $body"
else
    echo -e "${RED}✗ Score submission failed${NC}"
    echo "  Status: $status"
    echo "  Response: $body"
    exit 1
fi
echo ""

# Test 2: Submit Another Score
echo "📝 Test 2: Submit Another Score"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/scores" \
  -H "Content-Type: application/json" \
  -d '{"email":"player2@test.com","score":2500}')

body=$(echo "$response" | head -n -1)
status=$(echo "$response" | tail -n 1)

if [ "$status" = "200" ] && echo "$body" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Second score submission successful${NC}"
else
    echo -e "${RED}✗ Second score submission failed${NC}"
    exit 1
fi
echo ""

# Test 3: Get Leaderboard
echo "📊 Test 3: Get Leaderboard (GET /api/leaderboard)"
response=$(curl -s -w "\n%{http_code}" "$API_URL/leaderboard?limit=10")

body=$(echo "$response" | head -n -1)
status=$(echo "$response" | tail -n 1)

if [ "$status" = "200" ] && echo "$body" | grep -q "email"; then
    echo -e "${GREEN}✓ Leaderboard retrieved successfully${NC}"
    echo "  Leaderboard:"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ Leaderboard retrieval failed${NC}"
    echo "  Status: $status"
    echo "  Response: $body"
    exit 1
fi
echo ""

# Test 4: Invalid Email
echo "🚫 Test 4: Invalid Email Validation"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/scores" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","score":1000}')

body=$(echo "$response" | head -n -1)
status=$(echo "$response" | tail -n 1)

if [ "$status" = "400" ]; then
    echo -e "${GREEN}✓ Invalid email rejected correctly${NC}"
    echo "  Response: $body"
else
    echo -e "${RED}✗ Invalid email not rejected${NC}"
    echo "  Expected status 400, got $status"
    exit 1
fi
echo ""

# Test 5: Missing Fields
echo "🚫 Test 5: Missing Fields Validation"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/scores" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}')

body=$(echo "$response" | head -n -1)
status=$(echo "$response" | tail -n 1)

if [ "$status" = "400" ]; then
    echo -e "${GREEN}✓ Missing fields rejected correctly${NC}"
    echo "  Response: $body"
else
    echo -e "${RED}✗ Missing fields not rejected${NC}"
    echo "  Expected status 400, got $status"
    exit 1
fi
echo ""

# Test 6: Leaderboard Limit
echo "📊 Test 6: Leaderboard Limit Parameter"
response=$(curl -s -w "\n%{http_code}" "$API_URL/leaderboard?limit=1")

body=$(echo "$response" | head -n -1)
status=$(echo "$response" | tail -n 1)

count=$(echo "$body" | grep -o "email" | wc -l)

if [ "$status" = "200" ] && [ "$count" -le 1 ]; then
    echo -e "${GREEN}✓ Leaderboard limit works correctly${NC}"
    echo "  Returned $count results"
else
    echo -e "${RED}✗ Leaderboard limit not working${NC}"
    echo "  Expected 1 result, got $count"
    exit 1
fi
echo ""

echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "Next steps:"
echo "  1. Test with browser: Open http://localhost:8000"
echo "  2. Check SQLite DB: sqlite3 data/highscores.db 'SELECT * FROM game_scores;'"
echo "  3. Deploy to server"
