# ChatGuardian - API Reference

## Base URL
- Development: `http://localhost:8000/api/v1`
- Production: `https://api.chatguardian.com/api/v1`

## Authentication
All requests require Bearer token authentication (except health check):
```
Authorization: Bearer <your-token>
```

---

## 📨 Messages API

### Process New Message
**POST** `/messages`

Process a WhatsApp message through the AI pipeline.

**Request Body:**
```json
{
  "group_id": "family-main-group",
  "sender_phone": "+919876543210",
  "content": "Emergency! Dad fell down, taking him to hospital",
  "media_type": "text",
  "media_url": null
}
```

**Response:**
```json
{
  "id": "msg_123abc",
  "group_id": "family-main-group",
  "sender": {
    "id": "user_456",
    "name": "Mom",
    "phone_number": "+919876543210",
    "relationship": "mother"
  },
  "content": "Emergency! Dad fell down, taking him to hospital",
  "media_type": "text",
  "timestamp": "2026-01-21T10:30:00Z",
  "priority": "emergency",
  "is_read": false,
  "ai_classification": {
    "confidence": 0.95,
    "categories": ["emergency", "health", "urgent"],
    "sentiment": "negative",
    "is_fake_news": false,
    "needs_response": true
  },
  "auto_response": "Saw your message! Calling you right now. ☎️"
}
```

**Priority Levels:**
- `emergency` - Immediate alert + call suggestion
- `important` - Hourly digest
- `informational` - Daily summary
- `noise` - Weekly summary
- `blocked` - Fake news, auto-responded

---

### Get Messages
**GET** `/messages?priority=emergency&limit=50&offset=0`

Retrieve messages with optional filtering.

**Query Parameters:**
- `priority` (optional): Filter by priority level
- `limit` (default: 50): Number of messages to return
- `offset` (default: 0): Pagination offset

**Response:**
```json
[
  {
    "id": "msg_123",
    "group_id": "family-main",
    "sender": {...},
    "content": "Message text...",
    "priority": "important",
    ...
  }
]
```

---

### Mark Message as Read
**POST** `/messages/{message_id}/read`

Mark a message as read.

**Response:**
```json
{
  "status": "success"
}
```

---

### Submit Feedback
**POST** `/messages/{message_id}/feedback`

Submit user feedback to improve AI accuracy.

**Request Body:**
```json
{
  "feedback": "incorrect",
  "correct_priority": "informational",
  "comment": "This should have been informational, not important"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Feedback recorded. AI will learn from this!"
}
```

---

## 👨‍👩‍👧‍👦 Family API

### Get Family Data
**GET** `/family`

Get all family members and relationship map.

**Response:**
```json
{
  "members": [
    {
      "id": "user_123",
      "name": "Mom",
      "phone_number": "+919876543210",
      "relationship": "mother",
      "generation": -1,
      "importance": 10,
      "message_count": 450,
      "health_tracking_enabled": true
    }
  ],
  "relationships": []
}
```

**Generation Values:**
- `-2`: Grandparents
- `-1`: Parents, uncles, aunts
- `0`: Self, siblings, cousins
- `1`: Children, nieces, nephews

---

### Add Family Member
**POST** `/family/members`

Add a new family member.

**Request Body:**
```json
{
  "name": "Uncle Raj",
  "phone_number": "+919123456789",
  "relationship": "uncle"
}
```

**Response:**
```json
{
  "id": "user_789",
  "name": "Uncle Raj",
  "phone_number": "+919123456789",
  "relationship": "uncle",
  "generation": -1,
  "importance": 5,
  "message_count": 0,
  "health_tracking_enabled": false
}
```

---

## 📊 Analytics API

### Get Analytics
**GET** `/analytics?period=week`

Get analytics data for specified period.

**Query Parameters:**
- `period`: `week`, `month`, or `year`

**Response:**
```json
{
  "dailyStats": [
    {
      "date": "2026-01-15",
      "count": 120
    }
  ],
  "distribution": {
    "emergency": 2,
    "important": 45,
    "informational": 120,
    "noise": 450,
    "blocked": 23
  },
  "topSenders": [
    {
      "name": "Mom",
      "count": 85
    }
  ],
  "timeSaved": 270,
  "accuracy": {
    "emergencyDetection": 0.98,
    "importantMessages": 0.94,
    "fakeNewsDetection": 0.91,
    "autoResponseQuality": 0.87
  }
}
```

---

## 🔔 Notifications API

### Register Push Token
**POST** `/notifications/register`

Register device for push notifications.

**Request Body:**
```json
{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Notification token registered"
}
```

---

## 🏥 Health Check

### Health Check
**GET** `/health`

Check if backend is healthy.

**Response:**
```json
{
  "status": "healthy",
  "ai_models_loaded": true,
  "websocket_ready": true
}
```

---

## 🧠 AI Classification Details

### Priority Determination Logic

1. **Emergency Detection** (Priority 1)
   - Keywords: hospital, accident, emergency, urgent, died, ICU
   - Confidence threshold: 85%
   - Action: Immediate push notification

2. **Fake News Detection** (Priority 2)
   - Indicators: "shocking", "miracle", "forward immediately"
   - Forward patterns detected
   - Threshold: 75%
   - Action: Block + educational response

3. **Noise Detection** (Priority 3)
   - Good morning/night messages
   - Very short messages (<5 chars)
   - GIF/sticker references
   - Action: Filter to weekly summary

4. **Importance Scoring** (Priority 4)
   - Keywords: wedding, flight, doctor, exam, etc.
   - Sender importance score (1-10)
   - Threshold: 70%
   - Action: Hourly digest

5. **Default: Informational**
   - Action: Daily summary

---

## 🤖 Auto-Response Templates

### Emergency Responses
- **To Parents**: "Saw your message! Calling you right now. ☎️"
- **To Elders**: "Just saw this uncle/aunty. Calling you right away."
- **To Peers**: "Saw this! Calling you now."

### Important Responses
- **To Parents**: "Thanks for letting me know, Mom/Dad! 🙏"
- **To Elders**: "Thank you for sharing this, uncle/aunty! 🙏"
- **To Peers**: "Got it! Thanks for the heads up."

### Fake News Responses
- "I checked this and it seems to be misinformation. Here's the fact-check: [link]"
- "This appears to be fake news. Fact-check: [link]"
- Includes educational tips about verifying news

---

## 📡 WebSocket Events

### Connect
```javascript
const socket = io('ws://localhost:8000');
```

### Events
- `message:new` - New message received
- `message:classified` - Message classification complete
- `emergency:alert` - Emergency detected
- `analytics:update` - Analytics updated

---

## 🔒 Error Codes

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "detail": "Error message here"
}
```

---

## 📝 Examples

### cURL Examples

**Process a message:**
```bash
curl -X POST http://localhost:8000/api/v1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "group_id": "family-main",
    "sender_phone": "+919876543210",
    "content": "Good morning everyone! 🌅"
  }'
```

**Get important messages:**
```bash
curl http://localhost:8000/api/v1/messages?priority=important \
  -H "Authorization: Bearer your-token"
```

### JavaScript/TypeScript Example

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Process message
const response = await api.post('/messages', {
  group_id: 'family-main',
  sender_phone: '+919876543210',
  content: 'Emergency! Need help!'
});

console.log(response.data.priority); // 'emergency'
console.log(response.data.auto_response); // Auto-generated response
```

---

## 🎯 Rate Limits

- **Messages API**: 100 requests/minute
- **Analytics API**: 30 requests/minute
- **Family API**: 50 requests/minute

---

For more details, visit the interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
