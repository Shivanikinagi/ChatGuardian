## 🚀 ChatGuardian - Setup Guide

### Prerequisites Checklist

Before starting, make sure you have:

- [x] **Node.js 18+** - [Download here](https://nodejs.org/)
- [x] **Python 3.11+** - [Download here](https://www.python.org/downloads/)
- [x] **Git** - [Download here](https://git-scm.com/)
- [x] **Docker Desktop** (Optional) - [Download here](https://www.docker.com/products/docker-desktop/)
- [x] **Android Studio** or **Expo Go app** on your phone

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/chatguardian.git
cd chatguardian
```

#### 2. Backend Setup

**Option A: Docker (Easiest)**

```bash
# Start all backend services
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f backend
```

Backend will be available at:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

**Option B: Manual Setup**

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install spaCy language model
python -m spacy download en_core_web_sm

# Copy environment file
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux

# Edit .env file with your API keys
# You need:
# - HUGGINGFACE_TOKEN (for AI models)
# - OPENAI_API_KEY (optional, for advanced features)
# - FACT_CHECK_API_KEY (for fake news detection)

# Start PostgreSQL and Redis
# If not using Docker, install and start them manually

# Run the backend
uvicorn main:app --reload
```

#### 3. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start
```

This will open Expo DevTools in your browser.

**Run on Android:**

- Option 1: Press `a` in terminal to open in Android Emulator
- Option 2: Scan QR code with Expo Go app on your Android phone

#### 4. Configuration

**Backend Configuration (backend/.env)**

```bash
# Required
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql+asyncpg://chatguardian:password@localhost:5432/chatguardian

# AI Models (Optional but recommended)
HUGGINGFACE_TOKEN=hf_your_token_here
OPENAI_API_KEY=sk-your-key-here

# Fact Checking
FACT_CHECK_API_KEY=your-google-fact-check-api-key
```

**Mobile App Configuration (mobile/services/api.ts)**

Update the API base URL if backend is not on localhost:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_IP:8000/api/v1'  // Replace YOUR_IP with your computer's IP
  : 'https://api.chatguardian.com/api/v1';
```

### 5. Database Setup

If using manual backend setup:

```bash
cd backend

# Install Alembic (if not already installed)
pip install alembic

# Initialize database
alembic upgrade head

# Create initial data (optional)
python scripts/seed_data.py
```

### 6. Testing the Setup

**Test Backend:**

```bash
# Open in browser
http://localhost:8000/health

# Should return:
{
  "status": "healthy",
  "ai_models_loaded": true,
  "websocket_ready": true
}
```

**Test Mobile App:**

1. Open app on your phone/emulator
2. You should see the ChatGuardian splash screen
3. Go through onboarding
4. Test message processing by sending a test message

### 7. Troubleshooting

**Backend Issues:**

```bash
# Port 8000 already in use?
# Kill the process:
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9

# Database connection error?
# Make sure PostgreSQL is running
docker-compose ps postgres

# AI models not loading?
# Check if you have enough disk space (models are ~2GB)
# Clear cache and retry:
rm -rf backend/models/
```

**Mobile App Issues:**

```bash
# Metro bundler cache issues?
cd mobile
npx expo start --clear

# Cannot connect to backend?
# Make sure you're using your computer's IP, not localhost
# Find your IP:
# Windows: ipconfig
# Mac: ifconfig
# Use this IP in mobile/services/api.ts

# Android build errors?
cd mobile/android
./gradlew clean
cd ..
npx expo run:android
```

### 8. Development Workflow

**Terminal 1: Backend**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload
```

**Terminal 2: Mobile**
```bash
cd mobile
npm start
```

**Terminal 3: Docker Services (if needed)**
```bash
docker-compose up postgres redis
```

### 9. Next Steps

1. **Configure WhatsApp Integration** (Coming soon)
2. **Train AI models on your family's chat data**
3. **Customize auto-response templates**
4. **Set up family members and relationships**
5. **Configure notification preferences**

### 10. Getting Help

- 📖 Read the [full documentation](https://docs.chatguardian.com)
- 💬 Join our [Discord community](https://discord.gg/chatguardian)
- 🐛 Report bugs on [GitHub Issues](https://github.com/yourusername/chatguardian/issues)
- 📧 Email: support@chatguardian.com

---

**Happy ChatGuarding! 🛡️**
