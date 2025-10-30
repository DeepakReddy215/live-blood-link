# 🚀 Render Deployment - Complete Setup Guide

## 📁 What You Have

This repository contains:

### Backend (Node.js/Express/TypeScript)
- Location: `backend/`
- API with MongoDB, Socket.IO, JWT authentication
- Email notifications, QR codes, real-time updates

### Frontend (React/Vite/TypeScript)
- Location: `live-blood-link-main/`
- Modern React app with Shadcn UI components
- Real-time WebSocket integration

---

## 🎯 Deployment Goal

Deploy on **Render.com** (FREE tier available):
- **Backend**: Web Service (dynamic API)
- **Frontend**: Static Site (optimized build)

---

## ⚡ Quick Start (5 Steps)

### 1️⃣ Prepare Environment (10 min)

**Run the helper script:**

```powershell
# PowerShell
.\deployment-helper.ps1
```

OR

```bash
# Node.js
node deployment-helper.js
```

This generates:
- ✅ JWT secrets (secure random strings)
- ✅ Environment variable templates
- ✅ Configuration checklist

### 2️⃣ Setup MongoDB Atlas (10 min)

1. Go to https://cloud.mongodb.com
2. Create FREE cluster (M0)
3. Create database user
4. Whitelist IP: `0.0.0.0/0`
5. Copy connection string

**Connection String Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bloodstream?retryWrites=true&w=majority
```

### 3️⃣ Setup Gmail (5 min)

1. Enable 2-Factor Authentication
2. Go to https://myaccount.google.com/apppasswords
3. Generate App Password (16 characters)
4. Save for later

### 4️⃣ Deploy Backend (15 min)

**On Render Dashboard:**

1. Click **New + → Web Service**
2. Connect your GitHub repo
3. Configure:

```
Name: your-project-backend (choose any name you like)
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

4. Add Environment Variables (see `backend/.env.render.example`):

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<generated-secret>
JWT_REFRESH_SECRET=<generated-secret>
EMAIL_USER=<your-gmail>
EMAIL_PASSWORD=<app-password>
FRONTEND_URL=<temp-placeholder>
```

5. Click **Create Web Service**
6. **Save the URL**: `https://your-backend.onrender.com`

### 5️⃣ Deploy Frontend (10 min)

**On Render Dashboard:**

1. Click **New + → Static Site**
2. Connect your GitHub repo
3. Configure:

```
Name: your-project-frontend (choose any name you like)
Root Directory: live-blood-link-main
Build Command: npm install --legacy-peer-deps && npm run build
Publish Directory: dist
```

4. Add Environment Variables:

```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

5. Click **Create Static Site**
6. **Save the URL**: `https://your-frontend.onrender.com`

### 6️⃣ Final Configuration (5 min)

1. Go back to **Backend service** on Render
2. Update environment variable:
   ```
   FRONTEND_URL=https://your-frontend.onrender.com
   ```
3. Save (triggers auto-redeploy)

---

## ✅ Verify Deployment

### Test Backend
```bash
curl https://your-backend.onrender.com/api/health
```

Expected response: `{ "status": "ok", ... }`

### Test Frontend
1. Visit: `https://your-frontend.onrender.com`
2. Try registration/login
3. Check browser console (no errors)

---

## 📚 Complete Documentation

| File | Purpose |
|------|---------|
| `RENDER_DEPLOYMENT_GUIDE.md` | Detailed step-by-step guide |
| `DEPLOYMENT_CHECKLIST_RENDER.md` | Interactive checklist |
| `QUICK_DEPLOY_REFERENCE.md` | Quick commands reference |
| `render.yaml` | Infrastructure as code |
| `deployment-helper.js` | Secret generator (Node) |
| `deployment-helper.ps1` | Secret generator (PowerShell) |

---

## 🔧 Configuration Files

### Backend
- `backend/.env.render.example` - Environment variables template
- `backend/package.json` - Dependencies and scripts
- `backend/tsconfig.json` - TypeScript configuration

### Frontend
- `live-blood-link-main/.env.production.example` - Environment variables template
- `live-blood-link-main/package.json` - Dependencies and scripts
- `live-blood-link-main/vite.config.ts` - Build configuration

---

## 🆘 Troubleshooting

### "Service Unavailable" Error
**Cause**: Cold start on free tier (service sleeps after 15 min inactivity)
**Solution**: Wait 30-60 seconds for wake-up

### "Database Connection Failed"
**Cause**: MongoDB Atlas network access
**Solution**: 
1. Check IP whitelist includes `0.0.0.0/0`
2. Verify connection string format
3. Test credentials

### "CORS Error" in Browser
**Cause**: Backend FRONTEND_URL mismatch
**Solution**:
1. Update `FRONTEND_URL` in backend env vars
2. Ensure exact match (no trailing slash)
3. Redeploy backend

### Build Failures
**Solution**:
1. Check Render build logs
2. Test locally: `npm run build`
3. Verify all dependencies in package.json

---

## 💰 Cost & Performance

### Free Tier
- ✅ 750 hours/month (both services)
- ✅ Automatic SSL
- ✅ CI/CD from GitHub
- ⚠️ Services sleep after 15 min inactivity
- ⚠️ 30-60s cold start time

### Paid Tier (recommended for production)
- ✅ Always-on services
- ✅ No cold starts
- ✅ Better performance
- ✅ More resources

---

## 🔐 Security Checklist

- ✅ Strong JWT secrets (32+ characters)
- ✅ Environment variables (never hardcode)
- ✅ HTTPS only (automatic on Render)
- ✅ MongoDB user with minimal permissions
- ✅ Gmail App Password (not regular password)
- ✅ CORS restricted to frontend domain
- ✅ Rate limiting enabled
- ✅ Input validation on all endpoints

---

## 📊 Monitoring

### Render Dashboard
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, bandwidth
- **Events**: Deployment history
- **Health**: Automatic health checks

### Recommended External Tools
- **Uptime**: UptimeRobot (free)
- **Errors**: Sentry (free tier)
- **Analytics**: Google Analytics

---

## 🔄 Updates & Maintenance

### Auto-Deploy from GitHub
When you push to `main` branch:
1. Render detects changes
2. Automatically rebuilds
3. Deploys new version
4. Zero downtime

### Manual Deploy
In Render Dashboard:
1. Go to service
2. Click **Manual Deploy**
3. Select branch
4. Deploy

---

## 🌟 Production Checklist

Before going live:

- [ ] MongoDB backups configured
- [ ] Error tracking setup (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Load testing completed
- [ ] Security audit done
- [ ] Documentation updated
- [ ] Team access configured
- [ ] Domain name setup (optional)

---

## 🆘 Support Resources

**Render:**
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

**MongoDB:**
- Docs: https://docs.atlas.mongodb.com
- Support: https://support.mongodb.com

**This Project:**
- Issues: Check deployment logs first
- Checklist: `DEPLOYMENT_CHECKLIST_RENDER.md`
- Guide: `RENDER_DEPLOYMENT_GUIDE.md`

---

## 📞 Emergency Procedures

### Service Down
1. Check Render status page
2. Review recent deployments
3. Check application logs
4. Verify environment variables
5. Test database connectivity

### Data Loss Prevention
1. Regular MongoDB backups
2. Version control (Git)
3. Environment variable backups
4. Documentation updates

---

## 🎉 Success Metrics

After deployment, you should have:

- ✅ Backend API responding at `/api/health`
- ✅ Frontend loading correctly
- ✅ User registration working
- ✅ Login/authentication working
- ✅ Real-time notifications working
- ✅ Email notifications sending
- ✅ No CORS errors
- ✅ HTTPS enabled
- ✅ Mobile responsive

---

## 📝 Deployment Log Template

```
Deployment Date: _______________
Backend URL: https://___________________
Frontend URL: https://___________________
MongoDB Cluster: ___________________
Deployed By: ___________________
Status: ___________________
Notes: ___________________
```

---

**Created**: October 30, 2025
**Version**: 1.0.0
**Last Updated**: October 30, 2025

---

## 🚀 Ready to Deploy?

1. Start with `deployment-helper.ps1` or `deployment-helper.js`
2. Follow `RENDER_DEPLOYMENT_GUIDE.md`
3. Use `DEPLOYMENT_CHECKLIST_RENDER.md` to track progress
4. Reference `QUICK_DEPLOY_REFERENCE.md` for quick commands

**Good luck! 🎉**
