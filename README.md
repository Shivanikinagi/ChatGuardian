# ChatGuardian 🛡️

**AI-Powered WhatsApp Family Chat Assistant**

Transform family WhatsApp chaos into organized, meaningful communication with intelligent message filtering, auto-responses, and emergency detection.

## 🎯 Problem We Solve

- **47 family members** in one group
- **283 unread messages** daily
- **Critical messages lost** in noise (wedding dates, emergencies)
- **2 hours/week wasted** scrolling through spam

## ✨ Features

### Core Features (MVP)
- ✅ **Intelligent Message Triage**: Emergency, Important, Informational, Noise, Blocked
- ✅ **Smart Auto-Responses**: Context-aware, relationship-appropriate replies
- ✅ **Emergency Detection**: Instant alerts for critical messages
- ✅ **Fake News Firewall**: Real-time fact-checking with educational responses
- ✅ **Family Relationship Mapping**: AI-powered family tree and hierarchy
- ✅ **Health Monitoring**: Track family health mentions and medical updates
- ✅ **Cultural Calendar**: Festival, ritual, and event reminders

### AI Classification System
```
🟢 EMERGENCY (Immediate Push + Call)
• Health emergencies, critical events, financial crises

🟡 IMPORTANT (Hourly Digest)
• Family events, travel plans, financial discussions

🟠 INFORMATIONAL (Daily Digest)
• General updates, photo albums, achievements

🔴 NOISE (Weekly Summary)
• Good morning messages, chain forwards, memes

⚫ BLOCKED (Auto-responded)
• Fake news, spam links, scams
```

## 🏗️ Project Structure

```
Whatsapp-summarizer/
├── mobile/                 # React Native (Expo) App
│   ├── app/               # Screens and navigation
│   ├── components/        # Reusable UI components
│   ├── store/             # Zustand state management
│   ├── services/          # API and utilities
│   └── package.json
│
├── backend/               # FastAPI Backend
│   ├── app/
│   │   ├── api/          # REST API endpoints
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   │   ├── ai_service.py          # Core AI classification
│   │   │   ├── auto_response_service.py # Auto-response generation
│   │   │   └── websocket_service.py    # Real-time updates
│   │   └── core/         # Configuration
│   ├── main.py
│   └── requirements.txt
│
├── ai-models/            # ML Models (downloaded at runtime)
└── docker-compose.yml    # Docker orchestration
```

## 🛠️ Tech Stack

### Mobile App (Android)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI**: NativeWind (Tailwind CSS)
- **State**: Zustand
- **Database**: WatermelonDB (SQLite)
- **Notifications**: Firebase Cloud Messaging

### Backend
- **API**: FastAPI (Python)
- **Database**: PostgreSQL + TimescaleDB
- **Cache**: Redis
- **Queue**: Celery
- **Real-time**: WebSocket (Socket.IO)

### AI/ML Stack
- **Text Classification**: Microsoft Phi-3-mini (4B params)
- **Embeddings**: BAAI/bge-small-en-v1.5
- **Vision**: MobileViT
- **Audio**: Whisper Tiny
- **Fake News**: Ensemble of fact-checking APIs
- **Frameworks**: Transformers, PyTorch, Sentence-Transformers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for mobile app)
- Python 3.11+ (for backend)
- Docker & Docker Compose (optional, recommended)
- Android Studio or Expo Go app

### Option 1: Docker (Recommended)

```bash
# Clone repository
cd Whatsapp-summarizer

# Create environment file
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Start all services
docker-compose up -d

# Backend will be at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start server
uvicorn main:app --reload
```

#### Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on Android
npm run android

# Or scan QR code with Expo Go app
```

## 📱 Mobile App Features

### Screens
1. **Home**: Quick stats, emergency alerts, important messages
2. **Messages**: Filtered view with search and priority filters
3. **Analytics**: Visual dashboard of message patterns and time saved
4. **Family**: Relationship map, health monitoring, cultural events
5. **Profile**: Settings, preferences, subscription

### Key Components
- `MessageCard`: Displays message with AI classification
- `EmergencyBanner`: Pulsing alert for critical messages
- `QuickStats`: Real-time message category counts
- `FamilyMemberCard`: Family member with relationship info

## 🧠 AI Pipeline

### Message Processing Flow

```
1. Message Ingestion
   ↓
2. Language Detection (Hindi/English/Tamil)
   ↓
3. Multimodal Analysis
   • Text: NLP Classification
   • Images: Vision Model
   • Audio: Transcription + Emotion
   ↓
4. Context Enrichment
   • Sender Importance
   • Time Context
   • Conversation Thread
   ↓
5. Priority Scoring (0-100)
   • Emergency Score
   • Importance Score
   • Personal Relevance
   ↓
6. Action Decision
   • Immediate Alert
   • Hourly Digest
   • Daily Summary
   • Auto-Response
   • Block + Educate
```

### AI Models

**On-Device Processing**
- Emergency keyword detection
- Basic sentiment analysis
- Image type classification
- Voice transcription

**Cloud-Assisted (when connected)**
- Complex reasoning (GPT-4o Mini)
- Fact verification (Google Fact Check)
- Cultural context analysis
- Model updates

## 🔒 Privacy & Security

- **End-to-End Encryption**: All messages encrypted with ChaCha20-Poly1305
- **On-Device Processing**: Critical operations run locally
- **Zero-Knowledge Proofs**: Stats shared without exposing content
- **Federated Learning**: Model training on-device, only updates shared
- **Data Control**: User owns all data, can export/delete anytime

## 📊 API Endpoints

### Messages
- `POST /api/v1/messages` - Process new message
- `GET /api/v1/messages` - Get filtered messages
- `POST /api/v1/messages/{id}/read` - Mark as read
- `POST /api/v1/messages/{id}/feedback` - Submit AI feedback

### Family
- `GET /api/v1/family` - Get family members and relationships
- `POST /api/v1/family/members` - Add family member

### Analytics
- `GET /api/v1/analytics?period=week` - Get analytics data

### Notifications
- `POST /api/v1/notifications/register` - Register push token

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Mobile tests
cd mobile
npm test
```

## 📈 Roadmap

### Phase 1 (Current - MVP)
- [x] Core message classification
- [x] Emergency detection
- [x] Auto-response system
- [x] Fake news detection
- [x] Mobile app UI

### Phase 2 (Next 3 months)
- [ ] Advanced relationship mapping with graph neural networks
- [ ] Voice note emotion detection
- [ ] Multi-language support (10+ Indian languages)
- [ ] Health monitoring dashboard
- [ ] Memory compilation & yearly retrospectives

### Phase 3 (6 months)
- [ ] On-device AI inference (TensorFlow Lite)
- [ ] iOS app
- [ ] WhatsApp Web integration
- [ ] Premium features (advanced analytics, AI customization)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- Hugging Face for open-source models
- OpenAI for GPT-4o Mini
- Google Fact Check Tools API
- Indian fact-checking organizations (AltNews, BoomLive, FactChecker.in)

## 📞 Support

- **Email**: support@chatguardian.com
- **Discord**: [Join our community](https://discord.gg/chatguardian)
- **Docs**: [docs.chatguardian.com](https://docs.chatguardian.com)

---

**Built with ❤️ to solve real family communication problems**

*Transforming 283 daily messages into 5 that actually matter*
