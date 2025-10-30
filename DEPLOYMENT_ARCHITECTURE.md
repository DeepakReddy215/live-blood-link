# Render Deployment Architecture & Flow

## 🏗️ System Architecture on Render

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS / CLIENTS                          │
│                    (Web Browsers, Mobile)                        │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTPS
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                     RENDER PLATFORM                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         STATIC SITE (Frontend)                         │    │
│  │  Name: bloodstream-frontend                            │    │
│  │  URL: https://bloodstream-frontend.onrender.com        │    │
│  │                                                         │    │
│  │  • React + Vite (optimized build)                      │    │
│  │  • Served from /dist folder                            │    │
│  │  • CDN distributed                                     │    │
│  │  • Automatic SSL/HTTPS                                 │    │
│  │  • Auto-deploy from GitHub                             │    │
│  └─────────────────────┬──────────────────────────────────┘    │
│                        │                                         │
│                        │ API Calls (HTTPS + WebSocket)          │
│                        │                                         │
│  ┌─────────────────────▼──────────────────────────────────┐    │
│  │         WEB SERVICE (Backend)                          │    │
│  │  Name: bloodstream-backend                             │    │
│  │  URL: https://bloodstream-backend.onrender.com         │    │
│  │                                                         │    │
│  │  • Node.js + Express + TypeScript                      │    │
│  │  • Socket.IO (real-time)                               │    │
│  │  • JWT Authentication                                  │    │
│  │  • REST API (/api/*)                                   │    │
│  │  • Email service (nodemailer)                          │    │
│  │  • Auto-deploy from GitHub                             │    │
│  └─────────────────────┬──────────────────────────────────┘    │
│                        │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ MongoDB Wire Protocol
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                    MONGODB ATLAS                                 │
│                 (Cloud Database)                                 │
│                                                                  │
│  • Cluster: M0 (Free Tier)                                      │
│  • Database: bloodstream                                        │
│  • Collections: users, bloodrequests, notifications, etc.       │
│  • Automatic backups                                            │
│  • Replica set for high availability                            │
└──────────────────────────────────────────────────────────────────┘

        ┌────────────────────────────────────────────┐
        │         GMAIL SMTP                         │
        │     (Email Notifications)                  │
        │                                            │
        │  • smtp.gmail.com:587                      │
        │  • App-specific password                   │
        │  • Send OTP, alerts, updates               │
        └────────────────────────────────────────────┘
```

---

## 🔄 Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 1: PREPARATION                           │
└─────────────────────────────────────────────────────────────────┘

    Developer                                    Local Machine
        │                                              │
        │  1. Run deployment-helper.ps1               │
        │  ─────────────────────────────────────────► │
        │                                              │
        │  2. Generate JWT secrets                    │
        │  ◄───────────────────────────────────────── │
        │                                              │
        │  3. Setup MongoDB Atlas                     │
        │  ─────────────────────────────────────────► │
        │                                              │
        │  4. Create Gmail App Password               │
        │  ─────────────────────────────────────────► │
        │                                              │

┌─────────────────────────────────────────────────────────────────┐
│                 STEP 2: BACKEND DEPLOYMENT                       │
└─────────────────────────────────────────────────────────────────┘

    Developer              Render                     GitHub
        │                    │                           │
        │  1. Create Web     │                           │
        │     Service        │                           │
        │  ─────────────────►│                           │
        │                    │  2. Connect repo          │
        │                    │  ────────────────────────►│
        │                    │                           │
        │  3. Configure:     │                           │
        │     - Root: backend│                           │
        │     - Build: npm   │                           │
        │     - Start: npm   │                           │
        │  ─────────────────►│                           │
        │                    │                           │
        │  4. Set env vars   │                           │
        │  ─────────────────►│                           │
        │                    │  5. Pull code             │
        │                    │  ◄────────────────────────│
        │                    │                           │
        │                    │  6. npm install           │
        │                    │  7. npm run build         │
        │                    │  8. npm start             │
        │                    │                           │
        │  9. Deploy success │                           │
        │  ◄─────────────────│                           │
        │                    │                           │
        │  Backend URL:      │                           │
        │  https://xxx.      │                           │
        │  onrender.com      │                           │
        │                    │                           │

┌─────────────────────────────────────────────────────────────────┐
│                STEP 3: FRONTEND DEPLOYMENT                       │
└─────────────────────────────────────────────────────────────────┘

    Developer              Render                     GitHub
        │                    │                           │
        │  1. Create Static  │                           │
        │     Site           │                           │
        │  ─────────────────►│                           │
        │                    │  2. Connect repo          │
        │                    │  ────────────────────────►│
        │                    │                           │
        │  3. Configure:     │                           │
        │     - Root: live-  │                           │
        │       blood-link   │                           │
        │     - Build: npm   │                           │
        │     - Publish: dist│                           │
        │  ─────────────────►│                           │
        │                    │                           │
        │  4. Set env vars:  │                           │
        │     - VITE_API_URL │                           │
        │     - VITE_SOCKET  │                           │
        │  ─────────────────►│                           │
        │                    │  5. Pull code             │
        │                    │  ◄────────────────────────│
        │                    │                           │
        │                    │  6. npm install           │
        │                    │  7. npm run build         │
        │                    │  8. Deploy to CDN         │
        │                    │                           │
        │  9. Deploy success │                           │
        │  ◄─────────────────│                           │
        │                    │                           │
        │  Frontend URL:     │                           │
        │  https://yyy.      │                           │
        │  onrender.com      │                           │
        │                    │                           │

┌─────────────────────────────────────────────────────────────────┐
│              STEP 4: FINAL CONFIGURATION                         │
└─────────────────────────────────────────────────────────────────┘

    Developer              Backend Service
        │                        │
        │  1. Update env var:    │
        │     FRONTEND_URL       │
        │  ─────────────────────►│
        │                        │
        │  2. Save changes       │
        │  ─────────────────────►│
        │                        │
        │                        │  3. Auto redeploy
        │                        │  ─────────────►
        │                        │
        │  4. Services linked    │
        │  ◄─────────────────────│
        │                        │
```

---

## 🔌 API Communication Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │         │   Backend   │         │   MongoDB   │
│  (Frontend) │         │     API     │         │    Atlas    │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │  1. GET /api/health   │                       │
       │ ─────────────────────►│                       │
       │                       │                       │
       │  2. { status: "ok" }  │                       │
       │ ◄─────────────────────│                       │
       │                       │                       │
       │  3. POST /api/auth/   │                       │
       │     register          │                       │
       │ ─────────────────────►│                       │
       │                       │  4. Insert user       │
       │                       │ ─────────────────────►│
       │                       │                       │
       │                       │  5. User created      │
       │                       │ ◄─────────────────────│
       │                       │                       │
       │  6. { token, user }   │                       │
       │ ◄─────────────────────│                       │
       │                       │                       │
       │  7. WebSocket connect │                       │
       │ ◄────────────────────►│                       │
       │                       │                       │
       │  8. Real-time events  │                       │
       │ ◄────────────────────►│                       │
       │                       │                       │
```

---

## 🔐 Authentication Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │         │   Backend   │         │   MongoDB   │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │  1. Enter email/pwd   │                       │
       │ ─────────────────────►│                       │
       │                       │  2. Find user         │
       │                       │ ─────────────────────►│
       │                       │                       │
       │                       │  3. User data         │
       │                       │ ◄─────────────────────│
       │                       │                       │
       │                       │  4. Verify password   │
       │                       │     (bcrypt)          │
       │                       │                       │
       │                       │  5. Generate JWT      │
       │                       │     (jsonwebtoken)    │
       │                       │                       │
       │  6. Return token      │                       │
       │ ◄─────────────────────│                       │
       │                       │                       │
       │  7. Store in cookie/  │                       │
       │     localStorage      │                       │
       │                       │                       │
       │  8. Future requests   │                       │
       │     with JWT header   │                       │
       │ ─────────────────────►│                       │
       │                       │  9. Verify JWT        │
       │                       │                       │
       │  10. Protected data   │                       │
       │ ◄─────────────────────│                       │
       │                       │                       │
```

---

## 📧 Email Notification Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Backend   │     │  Nodemailer │     │    Gmail    │     │    User     │
│     API     │     │   Service   │     │    SMTP     │     │   Email     │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │  1. Event occurs  │                   │                   │
       │     (new request) │                   │                   │
       │                   │                   │                   │
       │  2. Send email    │                   │                   │
       │ ─────────────────►│                   │                   │
       │                   │  3. Connect SMTP  │                   │
       │                   │ ─────────────────►│                   │
       │                   │                   │                   │
       │                   │  4. Send message  │                   │
       │                   │ ─────────────────►│                   │
       │                   │                   │  5. Deliver email │
       │                   │                   │ ─────────────────►│
       │                   │                   │                   │
       │  6. Email sent    │                   │                   │
       │ ◄─────────────────│                   │                   │
       │                   │                   │                   │
```

---

## 🔄 Continuous Deployment Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Developer  │         │   GitHub    │         │   Render    │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │  1. git commit        │                       │
       │     git push          │                       │
       │ ─────────────────────►│                       │
       │                       │                       │
       │                       │  2. Webhook trigger   │
       │                       │ ─────────────────────►│
       │                       │                       │
       │                       │  3. Pull latest code  │
       │                       │ ◄─────────────────────│
       │                       │                       │
       │                       │  4. Build & Deploy    │
       │                       │     (automatic)       │
       │                       │                       │
       │                       │  5. Deploy complete   │
       │  6. Email             │ ◄─────────────────────│
       │     notification      │                       │
       │ ◄─────────────────────┤                       │
       │                       │                       │
       │  7. New version live  │                       │
       │ ◄─────────────────────┼───────────────────────┤
       │                       │                       │
```

---

## 🌐 Environment Variables Flow

```
DEVELOPMENT (Local)
├── .env.local
├── NODE_ENV=development
├── MONGODB_URI=localhost
└── FRONTEND_URL=localhost:5173

        │
        │  git push
        ▼

PRODUCTION (Render)
├── Render Dashboard
├── Environment Tab
├── NODE_ENV=production
├── MONGODB_URI=mongodb+srv://...
└── FRONTEND_URL=https://xxx.onrender.com

        │
        │  Automatic injection
        ▼

APPLICATION RUNTIME
├── process.env.NODE_ENV
├── process.env.MONGODB_URI
├── config/env.ts
└── Used throughout app
```

---

## 📊 Data Flow Example: Blood Request

```
1. USER ACTION (Frontend)
   └─► Click "Request Blood"

2. FORM SUBMISSION (Frontend)
   └─► POST /api/blood-requests
       Body: { bloodType: "A+", urgency: "high", ... }

3. API VALIDATION (Backend)
   └─► Validate input
       Check authentication
       Verify user permissions

4. DATABASE OPERATION (MongoDB)
   └─► Insert new blood request document
       Update user's request count
       Create notification documents

5. REAL-TIME NOTIFICATION (Socket.IO)
   └─► Emit event to connected clients
       Notify matching donors
       Update dashboard

6. EMAIL NOTIFICATION (Nodemailer)
   └─► Send email to donors
       Send confirmation to requester

7. RESPONSE (Frontend)
   └─► Show success message
       Update UI
       Navigate to request page
```

---

**Last Updated**: October 30, 2025
