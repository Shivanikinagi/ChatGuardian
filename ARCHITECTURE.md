# ChatGuardian - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MOBILE APP (React Native)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   Home   │  │ Messages │  │Analytics │  │  Family  │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       └─────────────┴─────────────┴─────────────┘                   │
│                         │                                            │
│              ┌──────────┴──────────┐                                 │
│              │   Zustand Stores    │                                 │
│              └──────────┬──────────┘                                 │
│                         │                                            │
│              ┌──────────┴──────────┐                                 │
│              │  WatermelonDB       │                                 │
│              │  (Local SQLite)     │                                 │
│              └─────────────────────┘                                 │
└───────────────────┬─────────────────────────────────────────────────┘
                    │ REST API / WebSocket
                    │
┌───────────────────┴─────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                     API Layer                                   │ │
│  │  ┌────────┐  ┌──────────┐  ┌────────────┐  ┌──────────────┐  │ │
│  │  │Messages│  │  Family  │  │ Analytics  │  │Notifications │  │ │
│  │  │  API   │  │   API    │  │    API     │  │     API      │  │ │
│  │  └────┬───┘  └────┬─────┘  └─────┬──────┘  └──────┬───────┘  │ │
│  └───────┼───────────┼──────────────┼────────────────┼──────────┘ │
│          │           │              │                │              │
│  ┌───────┴───────────┴──────────────┴────────────────┴──────────┐  │
│  │                     Service Layer                             │  │
│  │  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐  │  │
│  │  │  AI Service  │  │ Auto-Response │  │   WebSocket      │  │  │
│  │  │  (Core ML)   │  │    Engine     │  │   Manager        │  │  │
│  │  └──────┬───────┘  └───────┬───────┘  └──────────────────┘  │  │
│  └─────────┼──────────────────┼─────────────────────────────────┘  │
│            │                  │                                     │
│  ┌─────────┴──────────────────┴─────────────────────────────────┐  │
│  │                  Database Layer                               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │  │
│  │  │  Models  │  │  CRUD    │  │Relations │  │Analytics │     │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │  │
│  └───────────────────────────────────────────────────────────────┘  │
└──────────┬──────────────────┬────────────────────┬──────────────────┘
           │                  │                    │
           │                  │                    │
    ┌──────┴──────┐    ┌──────┴──────┐     ┌──────┴──────┐
    │ PostgreSQL  │    │    Redis    │     │   Celery    │
    │  Database   │    │   Cache     │     │   Worker    │
    └─────────────┘    └─────────────┘     └─────────────┘
```

---

## 🧠 AI Processing Pipeline

```
Message Input
    │
    ▼
┌─────────────────────────────────────────────┐
│  1. PREPROCESSING                           │
│  • Language Detection (langdetect)          │
│  • Text Normalization                       │
│  • Media Type Classification                │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│  2. EMERGENCY DETECTION (Tier 1 - Fast)    │
│  • Keyword Matching (Multi-language)        │
│  • Pattern Recognition                      │
│  • Confidence Threshold: 85%                │
│  Keywords: hospital, accident, emergency... │
└───────────────┬─────────────────────────────┘
                │
                ▼
        ┌───────┴────────┐
        │   Emergency?   │
        └───┬────────┬───┘
     YES │        │ NO
         │        │
         ▼        ▼
    ┌────────┐   ┌─────────────────────────────────┐
    │ ALERT! │   │ 3. FAKE NEWS DETECTION          │
    │ Return │   │ • Sensational Indicator Check   │
    └────────┘   │ • Forward Pattern Analysis      │
                 │ • Source Credibility            │
                 │ • Threshold: 75%                │
                 └────────────┬────────────────────┘
                              │
                              ▼
                      ┌───────┴────────┐
                      │   Fake News?   │
                      └───┬────────┬───┘
                   YES │        │ NO
                       │        │
                       ▼        ▼
                  ┌────────┐   ┌──────────────────────────────┐
                  │ BLOCK! │   │ 4. NOISE DETECTION           │
                  │ Educate│   │ • Good morning/night check   │
                  └────────┘   │ • GIF/Sticker detection      │
                               │ • Very short message check   │
                               └────────────┬─────────────────┘
                                            │
                                            ▼
                                    ┌───────┴────────┐
                                    │     Noise?     │
                                    └───┬────────┬───┘
                                 YES │        │ NO
                                     │        │
                                     ▼        ▼
                                ┌────────┐   ┌─────────────────────────┐
                                │ FILTER │   │ 5. IMPORTANCE SCORING   │
                                │ Return │   │ • Keyword Match         │
                                └────────┘   │ • Sender Importance     │
                                             │ • Context Analysis      │
                                             │ • Threshold: 70%        │
                                             └────────┬────────────────┘
                                                      │
                                                      ▼
                                              ┌───────┴────────┐
                                              │   Important?   │
                                              └───┬────────┬───┘
                                           YES │        │ NO
                                               │        │
                                               ▼        ▼
                                          ┌─────────┐  ┌──────────────┐
                                          │IMPORTANT│  │INFORMATIONAL │
                                          └─────────┘  └──────────────┘
                                               │             │
                                               └──────┬──────┘
                                                      │
                                                      ▼
                            ┌─────────────────────────────────────────┐
                            │ 6. ENRICHMENT                           │
                            │ • Generate Embeddings                   │
                            │ • Sentiment Analysis                    │
                            │ • Category Extraction                   │
                            │ • Auto-Response Generation (if needed)  │
                            └────────────┬────────────────────────────┘
                                         │
                                         ▼
                            ┌─────────────────────────┐
                            │   7. STORE & NOTIFY     │
                            │ • Save to Database      │
                            │ • Send Push Notification│
                            │ • WebSocket Broadcast   │
                            └─────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│   WhatsApp   │
│    Group     │
└──────┬───────┘
       │ (Future: Notification Listener)
       │
       ▼
┌──────────────────────────────────────────────┐
│         Mobile App (Message Capture)          │
└──────┬───────────────────────────────────────┘
       │
       │ POST /api/v1/messages
       │ {
       │   group_id: "...",
       │   sender_phone: "...",
       │   content: "..."
       │ }
       │
       ▼
┌──────────────────────────────────────────────┐
│         FastAPI Backend                       │
│  ┌────────────────────────────────────────┐  │
│  │ Message Controller                     │  │
│  │ • Validate Input                       │  │
│  │ • Get/Create Sender                    │  │
│  └───────────┬────────────────────────────┘  │
│              │                                │
│              ▼                                │
│  ┌────────────────────────────────────────┐  │
│  │ AI Service                             │  │
│  │ • classify_message()                   │  │
│  │ • generate_embedding()                 │  │
│  │ • analyze_sentiment()                  │  │
│  └───────────┬────────────────────────────┘  │
│              │                                │
│              ▼                                │
│  ┌────────────────────────────────────────┐  │
│  │ Auto-Response Engine                   │  │
│  │ • generate_response()                  │  │
│  │ • should_auto_respond()                │  │
│  └───────────┬────────────────────────────┘  │
│              │                                │
│              ▼                                │
│  ┌────────────────────────────────────────┐  │
│  │ Database                               │  │
│  │ • Save Message                         │  │
│  │ • Update Sender Stats                  │  │
│  │ • Create Analytics Record              │  │
│  └───────────┬────────────────────────────┘  │
└──────────────┼────────────────────────────────┘
               │
               ├─────────────────────┐
               │                     │
               ▼                     ▼
    ┌──────────────────┐   ┌────────────────────┐
    │ Push Notification│   │ WebSocket Broadcast│
    │  (FCM)           │   │ (Real-time update) │
    └────────┬─────────┘   └─────────┬──────────┘
             │                       │
             └───────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Mobile App         │
              │ • Show Notification  │
              │ • Update UI          │
              │ • Store Locally      │
              └──────────────────────┘
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────┐
│                     messages                         │
├──────────────┬─────────────┬─────────────────────────┤
│ id (PK)      │ VARCHAR     │ UUID                    │
│ group_id     │ VARCHAR     │ FK -> groups.id         │
│ sender_id    │ VARCHAR     │ FK -> family_members.id │
│ content      │ TEXT        │ Message content         │
│ media_type   │ ENUM        │ text/image/video/audio  │
│ media_url    │ VARCHAR     │ URL to media            │
│ timestamp    │ TIMESTAMP   │ Message time            │
│ priority     │ ENUM        │ emergency/important/... │
│ is_read      │ BOOLEAN     │ Read status             │
│ ai_confidence│ FLOAT       │ 0.0 - 1.0               │
│ ai_categories│ JSON        │ ["health", "urgent"]    │
│ sentiment    │ VARCHAR     │ positive/neutral/neg    │
│ is_fake_news │ BOOLEAN     │ Fake news flag          │
│ auto_response│ TEXT        │ Generated response      │
│ embedding    │ JSON        │ Vector embedding        │
└──────────────┴─────────────┴─────────────────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼                        ▼
┌─────────────────┐    ┌──────────────────────┐
│     groups      │    │   family_members     │
├────────┬────────┤    ├─────────┬────────────┤
│ id(PK) │ VARCHAR│    │ id (PK) │ VARCHAR    │
│ name   │ VARCHAR│    │ name    │ VARCHAR    │
│ member │ INT    │    │ phone   │ VARCHAR    │
│ ...    │        │    │ relation│ VARCHAR    │
└────────┴────────┘    │ generat.│ INT        │
                       │ importan│ INT (1-10) │
                       │ message_│ INT        │
                       │ health_.│ BOOLEAN    │
                       └─────────┴────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
         ┌──────────────────┐  ┌───────────────┐
         │ health_records   │  │user_feedback  │
         ├─────────┬────────┤  ├──────┬────────┤
         │ id (PK) │ VARCHAR│  │id(PK)│VARCHAR │
         │ member_.│ FK     │  │msg_id│ FK     │
         │ conditio│ VARCHAR│  │feedba│VARCHAR │
         │ medicati│ VARCHAR│  │correc│ ENUM   │
         │ ...     │        │  │commen│ TEXT   │
         └─────────┴────────┘  └──────┴────────┘
```

---

## 🔄 State Management (Mobile)

```
┌────────────────────────────────────────────────┐
│           Zustand Stores                       │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  messageStore                            │ │
│  │  • messages: Message[]                   │ │
│  │  • emergencyMessages: Message[]          │ │
│  │  • importantMessages: Message[]          │ │
│  │  • unreadCount: number                   │ │
│  │  • fetchMessages()                       │ │
│  │  • markAsRead()                          │ │
│  │  • sendFeedback()                        │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  familyStore                             │ │
│  │  • familyMembers: FamilyMember[]         │ │
│  │  • relationshipMap: RelationshipEdge[]   │ │
│  │  • fetchFamilyData()                     │ │
│  │  • addFamilyMember()                     │ │
│  │  • updateRelationship()                  │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  analyticsStore                          │ │
│  │  • weeklyStats: DayStat[]                │ │
│  │  • messageDistribution: object           │ │
│  │  • topSenders: array                     │ │
│  │  • timeSaved: number                     │ │
│  │  • fetchAnalytics()                      │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  notificationStore                       │ │
│  │  • expoPushToken: string                 │ │
│  │  • notifications: Notification[]         │ │
│  │  • initializeNotifications()             │ │
│  │  • sendLocalNotification()               │ │
│  │  • scheduleEmergencyAlert()              │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Production Deployment                  │
└─────────────────────────────────────────────────────────┘

                        Internet
                           │
                           ▼
                  ┌────────────────┐
                  │  Load Balancer │
                  │  (Nginx/HAProxy│
                  └────────┬───────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────────┐                 ┌──────────────────┐
│ FastAPI Instance │                 │ FastAPI Instance │
│   (Container 1)  │                 │   (Container 2)  │
└────────┬─────────┘                 └─────────┬────────┘
         │                                     │
         └─────────────────┬───────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────────┐                 ┌──────────────────┐
│   PostgreSQL     │                 │     Redis        │
│    (Primary)     │                 │    Cluster       │
│                  │                 │                  │
│  + Read Replica  │                 │  • Cache         │
│                  │                 │  • Queue         │
└──────────────────┘                 │  • Pub/Sub       │
                                     └──────────────────┘

┌────────────────────────────────────────────────────────┐
│              Celery Workers (Background)               │
│  • Batch Processing                                    │
│  • Model Training                                      │
│  • Analytics Generation                                │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                   Monitoring Stack                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │Prometheus│  │ Grafana  │  │  Sentry  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Architecture

```
┌────────────────────────────────────────────────┐
│              Security Layers                   │
├────────────────────────────────────────────────┤
│                                                │
│  Layer 1: Transport Security                  │
│  • TLS 1.3 (HTTPS)                            │
│  • Certificate Pinning                         │
│  └─────────────────────────────────────────┐  │
│                                                │
│  Layer 2: Authentication                      │
│  • JWT Bearer Tokens                          │
│  • Refresh Token Rotation                     │
│  • OAuth 2.0 (optional)                       │
│  └─────────────────────────────────────────┐  │
│                                                │
│  Layer 3: Data Encryption                     │
│  • At Rest: ChaCha20-Poly1305                 │
│  • In Transit: TLS 1.3                        │
│  • Key Management: Android Keystore           │
│  └─────────────────────────────────────────┐  │
│                                                │
│  Layer 4: Privacy                             │
│  • Differential Privacy (Analytics)           │
│  • Zero-Knowledge Proofs                      │
│  • Federated Learning (Model Training)        │
│  └─────────────────────────────────────────┐  │
│                                                │
│  Layer 5: Application Security                │
│  • Input Validation                           │
│  • SQL Injection Prevention (ORM)             │
│  • XSS Protection                             │
│  • CSRF Tokens                                │
│  • Rate Limiting                              │
│  └─────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

---

## 📱 Mobile App Architecture

```
┌─────────────────────────────────────────────────┐
│          React Native (Expo) App                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  Presentation Layer (UI)                        │
│  ┌──────────────────────────────────────────┐  │
│  │ Screens (5 main + onboarding)            │  │
│  │ • Home, Messages, Analytics, Family,     │  │
│  │   Profile                                │  │
│  └────────────┬─────────────────────────────┘  │
│               │                                  │
│               ▼                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Components (Reusable)                    │  │
│  │ • MessageCard, EmergencyBanner,          │  │
│  │   QuickStats, FamilyMemberCard          │  │
│  └────────────┬─────────────────────────────┘  │
│               │                                  │
│               ▼                                  │
│  Business Logic Layer                           │
│  ┌──────────────────────────────────────────┐  │
│  │ Zustand Stores (State Management)        │  │
│  │ • messageStore, familyStore,             │  │
│  │   analyticsStore, notificationStore      │  │
│  └────────────┬─────────────────────────────┘  │
│               │                                  │
│               ▼                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Services                                 │  │
│  │ • API Client (Axios)                     │  │
│  │ • Initialization Service                 │  │
│  │ • WebSocket Client                       │  │
│  └────────────┬─────────────────────────────┘  │
│               │                                  │
│               ▼                                  │
│  Data Layer                                     │
│  ┌──────────────────────────────────────────┐  │
│  │ WatermelonDB (SQLite)                    │  │
│  │ • Offline-first persistence              │  │
│  │ • Sync with backend                      │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

**Key Architectural Principles:**

1. **Separation of Concerns**: Clear layers (UI, Business Logic, Data)
2. **Scalability**: Horizontal scaling with load balancer
3. **Resilience**: Error handling, retry logic, fallbacks
4. **Security**: Multi-layer security (transport, auth, encryption)
5. **Privacy**: On-device processing, minimal data collection
6. **Offline-First**: Mobile app works without internet
7. **Real-time**: WebSocket for instant updates
8. **Modularity**: Microservices-ready architecture
