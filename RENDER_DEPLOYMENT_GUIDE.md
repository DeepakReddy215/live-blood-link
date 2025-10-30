# Complete Render Deployment Guide

## 🚀 Overview

This guide will help you deploy:
- **Backend**: Node.js/Express API as a Web Service
- **Frontend**: React/Vite application as a Static Site

---

## 📋 Prerequisites

1. GitHub account with your code pushed to a repository
2. Render account (sign up at https://render.com)
3. MongoDB Atlas account (for database)
4. Gmail account (for email notifications)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user with username and password
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bloodstream?retryWrites=true&w=majority
   ```

---

## 🔧 Step 2: Deploy Backend (Web Service)

### 2.1: Create Web Service on Render

1. Log in to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository containing your backend code

### 2.2: Configure Web Service

**Basic Settings:**
- **Name**: `your-project-backend` (choose any name you want)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch name)
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (or paid for production)

### 2.3: Environment Variables

Add the following environment variables in Render:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/bloodstream?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters-long
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=BloodStream <noreply@bloodstream.com>
FRONTEND_URL=https://your-frontend-url.onrender.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
OTP_EXPIRES_IN=10
OTP_LENGTH=6
```

**Important Notes:**
- Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
- Generate strong random strings for JWT secrets (min 32 characters)
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)
- Update `FRONTEND_URL` after deploying frontend

### 2.4: Deploy

Click **"Create Web Service"**

Your backend will be deployed at: `https://your-project-backend.onrender.com`
(The exact URL depends on the name you chose above)

---

## 🎨 Step 3: Deploy Frontend (Static Site)

### 3.1: Update Frontend API Configuration

Before deploying, update the API base URL in your frontend code:

**File**: `live-blood-link-main/src/services/api.ts`

Update the baseURL to your Render backend URL:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-project-backend.onrender.com/api';
```

**Note**: Replace `your-project-backend` with the actual service name you created in Render.

### 3.2: Create Environment File

Create `.env.production` in `live-blood-link-main/`:

```env
VITE_API_URL=https://your-project-backend.onrender.com/api
VITE_SOCKET_URL=https://your-project-backend.onrender.com
```

**Note**: Replace `your-project-backend` with YOUR actual backend service name from Render.

### 3.3: Create Static Site on Render

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Select the repository

### 3.4: Configure Static Site

**Basic Settings:**
- **Name**: `your-project-frontend` (choose any name you want)
- **Region**: Same as backend (for better performance)
- **Branch**: `main` (or your default branch name)
- **Root Directory**: `live-blood-link-main`
- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Publish Directory**: `dist`

**Note**: The `--legacy-peer-deps` flag resolves dependency conflicts during build.

### 3.5: Environment Variables (for Frontend)

Add these environment variables:

```env
VITE_API_URL=https://your-project-backend.onrender.com/api
VITE_SOCKET_URL=https://your-project-backend.onrender.com
```

**Note**: Use YOUR actual backend service URL from the previous step.

### 3.6: Deploy

Click **"Create Static Site"**

Your frontend will be deployed at: `https://your-project-frontend.onrender.com`
(The exact URL depends on the name you chose above)

---

## 🔄 Step 4: Update Backend Environment

After frontend is deployed:

1. Go to your backend web service on Render
2. Go to **Environment** tab
3. Update `FRONTEND_URL` to your actual frontend URL:
   ```
   FRONTEND_URL=https://your-project-frontend.onrender.com
   ```
   **Important**: Use YOUR actual frontend service URL from the previous step.
4. Save changes (this will trigger a redeploy)

---

## ✅ Step 5: Verify Deployment

### Test Backend:
```bash
curl https://your-project-backend.onrender.com/api/health
```
Replace `your-project-backend` with YOUR actual backend service name.

### Test Frontend:
Visit `https://your-project-frontend.onrender.com` in your browser
Replace `your-project-frontend` with YOUR actual frontend service name.

---

## 🔒 Security Checklist

- ✅ Use strong JWT secrets (min 32 characters, random)
- ✅ Enable CORS only for your frontend domain
- ✅ Use environment variables for all secrets
- ✅ Enable HTTPS (automatic on Render)
- ✅ Set up proper MongoDB user permissions
- ✅ Use Gmail App Passwords (not regular password)
- ✅ Enable rate limiting (already configured)
- ✅ Regular dependency updates

---

## 📊 Monitoring

### Render Dashboard Features:
- **Logs**: View real-time application logs
- **Metrics**: CPU, memory, bandwidth usage
- **Events**: Deployment history
- **Shell**: Access to container shell (paid plans)

### Health Checks:
Render automatically monitors your service health

---

## 🐛 Troubleshooting

### Backend Won't Start:
1. Check logs in Render dashboard
2. Verify all environment variables are set
3. Ensure MongoDB connection string is correct
4. Check build logs for compilation errors

### Frontend Build Fails:
1. Check Node version compatibility
2. Verify all dependencies are in package.json
3. Check for TypeScript errors
4. Review build logs

### CORS Errors:
1. Verify `FRONTEND_URL` is set correctly in backend
2. Check CORS configuration in `server.ts`
3. Ensure no trailing slashes in URLs

### Database Connection Issues:
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check username/password in connection string
3. Ensure database user has proper permissions
4. Test connection string locally first

---

## 💰 Cost Optimization

### Free Tier Limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- 750 hours/month of running time

### Recommendations:
- Use free tier for development/testing
- Upgrade to paid tier for production
- Consider using Render's cron jobs to keep service warm

---

## 🚀 Production Best Practices

1. **Custom Domain**: Add custom domain in Render settings
2. **SSL**: Automatic with Render, configure custom SSL if needed
3. **Backups**: Regular MongoDB backups
4. **Monitoring**: Set up external monitoring (UptimeRobot, etc.)
5. **Logging**: Consider external logging service
6. **CDN**: Use Render's built-in CDN for static assets

---

## 📝 Post-Deployment

1. Test all features thoroughly
2. Monitor logs for errors
3. Set up error tracking (Sentry, etc.)
4. Configure database backups
5. Document API endpoints
6. Set up monitoring alerts

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

---

## 📧 Support

For issues:
1. Check Render logs first
2. Review this guide
3. Check MongoDB Atlas status
4. Verify environment variables

---

**Deployment Date**: October 30, 2025
**Last Updated**: October 30, 2025
