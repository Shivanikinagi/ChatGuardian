# ChatGuardian - Quick Start Guide 🚀

Get ChatGuardian running in **5 minutes**!

## 📦 Prerequisites (2 minutes)

Make sure you have installed:

✅ **Node.js 18+** → https://nodejs.org/  
✅ **Python 3.11+** → https://python.org/downloads/  
✅ **Git** → https://git-scm.com/  
✅ **Docker Desktop** (optional) → https://docker.com/  

## 🎯 Option 1: Docker Setup (Easiest - 3 minutes)

```bash
# 1. Navigate to project
cd Whatsapp-summarizer

# 2. Start backend services
docker-compose up -d

# 3. Install mobile dependencies
cd mobile
npm install

# 4. Start mobile app
npm start
```

**That's it!** 🎉

- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Mobile: Scan QR code with Expo Go app

---

## 💻 Option 2: Manual Setup (5 minutes)

### Step 1: Backend (2 minutes)

```bash
cd backend

# Create & activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux

# Start server
uvicorn main:app --reload
```

✅ Backend running at http://localhost:8000

### Step 2: Mobile App (3 minutes)

```bash
cd mobile

# Install dependencies
npm install

# Start Expo
npm start
```

✅ Mobile app ready!

**Run on your phone:**
1. Install "Expo Go" from Play Store
2. Scan the QR code
3. ChatGuardian opens!

---

## ✨ Test It Out

### Test the AI Classification

```bash
# In a new terminal, test the API
curl -X POST http://localhost:8000/api/v1/messages \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": "test-group",
    "sender_phone": "+919876543210",
    "content": "Emergency! Dad fell down, taking him to hospital"
  }'
```

**Response:**
```json
{
  "priority": "emergency",
  "confidence": 0.95,
  "auto_response": "Saw your message! Calling you right now. ☎️"
}
```

---

## 🎓 What You Get

### Mobile App Features
- 📱 **5 Screens**: Home, Messages, Analytics, Family, Profile
- 🚨 **Emergency Alerts**: Instant notifications for critical messages
- 📊 **Analytics**: Charts showing message patterns
- 👨‍👩‍👧‍👦 **Family Management**: Track relationships and importance
- ⚙️ **Settings**: Customize AI behavior

### AI Features
- ✅ Emergency detection (multi-language)
- ✅ Fake news detection with fact-checking
- ✅ Auto-response generation
- ✅ Sentiment analysis
- ✅ Message categorization

---

## 🎯 Next Steps

### 1. Configure Family Members

Open the app → Profile → Manage Family Members → Add members

### 2. Customize AI Settings

Profile → Preferences → Configure:
- Emergency keywords
- Auto-response style
- Notification preferences

### 3. Test Different Message Types

**Emergency:**
```json
{"content": "Hospital emergency! Come fast!"}
// Priority: emergency
```

**Important:**
```json
{"content": "Wedding on Dec 15, booking tickets"}
// Priority: important
```

**Noise:**
```json
{"content": "Good morning! 🌅"}
// Priority: noise (filtered)
```

**Fake News:**
```json
{"content": "Shocking! Government hiding truth! Forward immediately!"}
// Priority: blocked (with fact-check)
```

---

## 📚 Learn More

- 📖 **Full Documentation**: [README.md](README.md)
- 🏗️ **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- 🔌 **API Reference**: [API_REFERENCE.md](API_REFERENCE.md)
- 🛠️ **Detailed Setup**: [SETUP.md](SETUP.md)

---

## 🐛 Troubleshooting

### Backend won't start?

```bash
# Port already in use?
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

### Mobile app can't connect?

1. Get your computer's IP address:
   ```bash
   # Windows: ipconfig
   # Mac: ifconfig
   # Linux: ip addr
   ```

2. Update [mobile/services/api.ts](mobile/services/api.ts):
   ```typescript
   const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8000/api/v1';
   ```

### AI models not loading?

```bash
# Check if you have enough disk space (need ~2GB)
# Clear model cache
cd backend
rm -rf models/
```

### Docker issues?

```bash
# Restart services
docker-compose restart

# View logs
docker-compose logs -f backend

# Rebuild
docker-compose up --build
```

---

## 🎉 You're Ready!

ChatGuardian is now running and classifying messages! 

**Try it:**
1. Open the mobile app
2. Go to Messages tab
3. You'll see categorized messages
4. Check Analytics for insights
5. View Family for relationship map

**Need help?**
- 💬 Discord: https://discord.gg/chatguardian
- 📧 Email: support@chatguardian.com
- 🐛 Issues: GitHub Issues

---

## 🚀 Production Deployment

When ready to deploy:

```bash
# Build for production
cd mobile
eas build --platform android

# Deploy backend
docker-compose -f docker-compose.prod.yml up -d
```

---

**Happy ChatGuarding! Transform your family WhatsApp chaos into organized bliss! 🛡️✨**

---

## 📊 Quick Stats

⏱️ **Setup Time**: 3-5 minutes  
📁 **Project Size**: 50+ files  
🧠 **AI Models**: 4 different models  
📱 **Screens**: 5 main screens  
🎯 **Priority Levels**: 5 categories  
💾 **Database Tables**: 7 tables  
🔌 **API Endpoints**: 10+ endpoints  

---

## 🎯 What Makes It Special

1. **Family-First AI**: Understands Indian family dynamics
2. **Multi-Language**: English, Hindi, Hinglish support
3. **Cultural Awareness**: Respects hierarchies and relationships
4. **Time-Saving**: Filters 450+ noise messages to ~45 important ones
5. **Educational**: Teaches family about fake news

---

**Status**: ✅ Production-Ready  
**Version**: 1.0.0  
**License**: MIT  
**Author**: Shivani
