# 🩸 BloodStream - Frontend & Backend Integration Guide

## 📁 Project Structure

```
Blood_Stream-WS/
├── live-blood-link-main/     # Frontend (React + TypeScript + Vite)
│   ├── src/
│   ├── package.json
│   └── .env
│
└── backend/                   # Backend (Node.js + Express + MongoDB)
    ├── src/
    ├── package.json
    ├── .env
    └── README.md
```

## 🚀 Complete Setup (Both Frontend & Backend)

### Step 1: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bloodstream
JWT_SECRET=your-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-change-this
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

### Step 2: Frontend Setup

```bash
cd ../live-blood-link-main

# Install dependencies (if not already done)
npm install

# Check .env file exists
```

Edit `live-blood-link-main/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

## 🔗 How They Connect

### API Communication

The frontend communicates with backend through:

1. **REST API** (HTTP requests)
   - Authentication: `/api/auth/*`
   - Blood Cards: `/api/blood-cards/*`
   - User data, requests, etc.

2. **Socket.IO** (Real-time)
   - Live notifications
   - Delivery tracking
   - Blood request matches

### Authentication Flow

```
Frontend                          Backend
   |                                 |
   |-- POST /api/auth/register ----->|
   |<---- OTP sent to email ---------|
   |                                 |
   |-- POST /api/auth/verify-otp --->|
   |<---- JWT tokens ----------------|
   |                                 |
   |-- All requests with ----------->|
   |   Authorization: Bearer token   |
```

## 📡 API Endpoints Used by Frontend

### Authentication (`authService.ts`)

| Frontend Method | Backend Endpoint | Description |
|----------------|------------------|-------------|
| `login()` | `POST /api/auth/login` | User login |
| `register()` | `POST /api/auth/register` | User registration |
| `verifyOTP()` | `POST /api/auth/verify-otp` | Email verification |
| `resendOTP()` | `POST /api/auth/resend-otp` | Resend OTP |
| `forgotPassword()` | `POST /api/auth/forgot-password` | Password reset request |
| `resetPassword()` | `POST /api/auth/reset-password` | Reset password |
| `getCurrentUser()` | `GET /api/auth/me` | Get current user |
| `logout()` | `POST /api/auth/logout` | Logout |

### Blood Cards (`bloodCardService.ts`)

| Frontend Method | Backend Endpoint | Description |
|----------------|------------------|-------------|
| `getMyCard()` | `GET /api/blood-cards/me` | Get user's card |
| `createCard()` | `POST /api/blood-cards` | Create new card |
| `updateHealthInfo()` | `PATCH /api/blood-cards/me/health` | Update health info |
| `requestRevalidation()` | `POST /api/blood-cards/me/revalidate` | Request revalidation |
| `verifyCard()` | `POST /api/blood-cards/verify` | Verify via QR |
| `updateCardStatus()` | `PATCH /api/blood-cards/:id/status` | Admin: Update status |

## 🔌 Socket.IO Integration

### Frontend Connection (`socketService.ts`)

```typescript
import io from 'socket.io-client';

const socket = io(SOCKET_URL, {
  auth: {
    token: authStore.token
  }
});

// Listen for events
socket.on('notification:new', (data) => {
  // Handle new notification
});

socket.on('blood:match', (data) => {
  // Handle blood match
});
```

### Backend Events

The backend sends these events:
- `notification:new` - New notification
- `blood:match` - Blood request matched
- `delivery:status` - Delivery update
- `alert:emergency` - Emergency alert
- `location:updated` - Location update

## 🩸 Digital Blood Card Feature

### Complete Flow

1. **User Registration**
   ```
   Frontend → POST /api/auth/register
   Backend → Send OTP email
   Frontend → POST /api/auth/verify-otp
   Backend → User verified ✅
   ```

2. **Create Blood Card**
   ```
   Frontend → POST /api/blood-cards
   Backend → Generate QR code
   Backend → Create card (status: pending)
   Frontend → Display card
   ```

3. **Admin Verification**
   ```
   Admin → PATCH /api/blood-cards/:id/status
   Backend → Update status to 'active'
   User → Card now active ✅
   ```

4. **QR Code Verification**
   ```
   Scanner → POST /api/blood-cards/verify
   Backend → Verify card number
   Backend → Return card details
   ```

## 🔐 Authentication & Security

### Token Management

**Frontend (Zustand store):**
```typescript
{
  token: 'eyJhbGciOiJIUzI1NiIs...',
  refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
  user: { ... }
}
```

**Backend validates:**
- JWT signature
- Token expiration
- User existence
- User role (for protected routes)

### Auto Token Refresh

Frontend `api.ts` interceptor:
```typescript
// If 401 error
→ POST /api/auth/refresh with refreshToken
← New access token
→ Retry original request
```

## 🌍 Indian Localization

Both frontend and backend support:
- ✅ Phone: `+91XXXXXXXXXX` format
- ✅ Aadhar: 12-digit validation
- ✅ States & Districts: Indian locations
- ✅ Date format: DD/MM/YYYY
- ✅ Currency: ₹ (Rupees)

## 🧪 Testing the Integration

### 1. Test Registration Flow

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd live-blood-link-main
npm run dev

# Browser: http://localhost:5173
# 1. Click "Register"
# 2. Fill form
# 3. Check email for OTP
# 4. Enter OTP
# 5. Login successful ✅
```

### 2. Test Blood Card Creation

```bash
# After login:
# 1. Go to Profile
# 2. Complete profile (blood type, DOB, gender, phone)
# 3. Click "Create Blood Card"
# 4. Card created with QR code ✅
```

### 3. Test Real-time Features

```bash
# Open two browser windows
# Window 1: Donor
# Window 2: Recipient

# Recipient creates blood request
# Donor should receive notification instantly ✅
```

## 🚀 Deployment

### Separate Deployment (Recommended)

**Backend (Render.com):**
```bash
cd backend
git init
git add .
git commit -m "Backend"
# Push to GitHub repo 1
# Deploy on Render
# URL: https://bloodstream-api.onrender.com
```

**Frontend (Render/Vercel/Netlify):**
```bash
cd live-blood-link-main
# Update .env.production:
VITE_API_URL=https://bloodstream-api.onrender.com/api
VITE_SOCKET_URL=https://bloodstream-api.onrender.com

git init
git add .
git commit -m "Frontend"
# Push to GitHub repo 2
# Deploy on Render/Vercel
# URL: https://bloodstream.onrender.com
```

### Update CORS

In `backend/.env` (production):
```env
FRONTEND_URL=https://bloodstream.onrender.com
```

## 📊 Data Flow Examples

### Example 1: User Login

```
Frontend                     Backend                    Database
   |                            |                           |
   |-- login(email, pass) ----->|                           |
   |                            |-- findUser(email) ------->|
   |                            |<-- user data -------------|
   |                            |-- verify password         |
   |                            |-- generate tokens         |
   |<-- { user, token } --------|                           |
   |-- save to store            |                           |
   |-- redirect to dashboard    |                           |
```

### Example 2: Create Blood Request (with Socket.IO)

```
Recipient                    Backend                    Donor
   |                            |                           |
   |-- POST /api/requests ----->|                           |
   |                            |-- save to DB              |
   |                            |-- find matching donors    |
   |                            |-- socket.emit() --------->|
   |                            |                           |-- notification!
   |<-- request created --------|                           |
```

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution:** Check `FRONTEND_URL` in backend `.env` matches frontend URL

### Issue: Socket not connecting
**Solution:** Ensure `VITE_SOCKET_URL` is correct and backend is running

### Issue: 401 Unauthorized
**Solution:** Token expired, logout and login again

### Issue: Email not sending
**Solution:** Check Gmail app password and 2-step verification

### Issue: MongoDB connection failed
**Solution:** Ensure MongoDB is running or Atlas connection string is correct

## 📝 Environment Variables Summary

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bloodstream
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=BloodStream <noreply@bloodstream.com>
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## ✅ Checklist Before Going Live

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] MongoDB Atlas configured
- [ ] Environment variables set (production)
- [ ] CORS configured correctly
- [ ] Email service working
- [ ] JWT secrets are strong and unique
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test blood card creation
- [ ] Test real-time notifications
- [ ] SSL/HTTPS enabled
- [ ] Error monitoring setup

## 🎉 Success!

If everything is working:
- ✅ Users can register and login
- ✅ OTP emails are received
- ✅ Blood cards can be created
- ✅ QR codes are generated
- ✅ Real-time notifications work
- ✅ All API endpoints respond correctly

---

**You now have a fully functional BloodStream application! 🩸💻**

For detailed API documentation, see `backend/README.md`
For setup instructions, see `backend/SETUP.md`
