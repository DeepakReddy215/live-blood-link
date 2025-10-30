# Render Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster (free tier M0)
- [ ] Create database user with strong password
- [ ] Add IP whitelist: `0.0.0.0/0` (allow from anywhere)
- [ ] Get connection string
- [ ] Test connection locally

### 2. Email Setup (Gmail)
- [ ] Have Gmail account ready
- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App-Specific Password
- [ ] Save password securely

### 3. Code Preparation
- [ ] Push all code to GitHub
- [ ] Ensure `package.json` has all dependencies
- [ ] Test build locally: `npm run build`
- [ ] Test backend locally: `npm start`
- [ ] Verify all environment variables are documented

### 4. Security
- [ ] Generate strong JWT secrets (min 32 chars)
- [ ] Review CORS settings
- [ ] Check rate limiting configuration
- [ ] Ensure no sensitive data in code

---

## 🚀 Deployment Steps

### Phase 1: Backend Deployment (15 minutes)

1. **Create Render Account**
   - [ ] Sign up at https://render.com
   - [ ] Connect GitHub account

2. **Create Web Service**
   - [ ] Click "New +" → "Web Service"
   - [ ] Select repository
   - [ ] Configure settings (see guide)

3. **Set Environment Variables**
   - [ ] NODE_ENV=production
   - [ ] PORT=10000
   - [ ] MONGODB_URI=<your-connection-string>
   - [ ] JWT_SECRET=<32-char-random>
   - [ ] JWT_REFRESH_SECRET=<32-char-random>
   - [ ] EMAIL_USER=<your-email>
   - [ ] EMAIL_PASSWORD=<app-password>
   - [ ] FRONTEND_URL=<temporary-placeholder>

4. **Deploy Backend**
   - [ ] Click "Create Web Service"
   - [ ] Wait for build to complete
   - [ ] Check logs for errors
   - [ ] Copy backend URL: `https://[your-service].onrender.com`

5. **Verify Backend**
   - [ ] Visit: `https://[your-backend].onrender.com/api/health`
   - [ ] Should return health check response

---

### Phase 2: Frontend Deployment (10 minutes)

1. **Update API Configuration**
   - [ ] Update `src/services/api.ts` with backend URL
   - [ ] Create `.env.production` with backend URL
   - [ ] Commit and push changes

2. **Create Static Site**
   - [ ] Click "New +" → "Static Site"
   - [ ] Select repository
   - [ ] Configure settings (see guide)

3. **Set Environment Variables**
   - [ ] VITE_API_URL=https://[your-backend].onrender.com/api
   - [ ] VITE_SOCKET_URL=https://[your-backend].onrender.com

4. **Deploy Frontend**
   - [ ] Click "Create Static Site"
   - [ ] Wait for build to complete
   - [ ] Copy frontend URL: `https://[your-frontend].onrender.com`

---

### Phase 3: Final Configuration (5 minutes)

1. **Update Backend Environment**
   - [ ] Go to backend service on Render
   - [ ] Update FRONTEND_URL to actual frontend URL
   - [ ] Save (triggers automatic redeploy)

2. **Verify Integration**
   - [ ] Visit frontend URL
   - [ ] Test registration/login
   - [ ] Check network tab for API calls
   - [ ] Verify WebSocket connection

---

## 🧪 Post-Deployment Testing

### Backend Tests
- [ ] Health check: `GET /api/health`
- [ ] Registration: `POST /api/auth/register`
- [ ] Login: `POST /api/auth/login`
- [ ] Protected route with JWT

### Frontend Tests
- [ ] Home page loads
- [ ] Registration form works
- [ ] Login form works
- [ ] Dashboard loads after login
- [ ] Real-time notifications work
- [ ] All pages are accessible

### Integration Tests
- [ ] CORS works (no errors in console)
- [ ] WebSocket connects successfully
- [ ] Email notifications sent
- [ ] Session persistence works
- [ ] Mobile responsive

---

## 🔧 Troubleshooting Guide

### Backend Issues

**Build Fails:**
- Check `package.json` for missing dependencies
- Verify TypeScript configuration
- Review build logs in Render

**Service Won't Start:**
- Check `PORT` environment variable
- Verify start command: `npm start`
- Check MongoDB connection string
- Review application logs

**Database Connection Fails:**
- Verify MongoDB URI format
- Check IP whitelist in Atlas
- Ensure database user exists
- Test connection string locally

### Frontend Issues

**Build Fails:**
- Check Node version compatibility
- Verify all dependencies in package.json
- Check for TypeScript errors
- Review Vite configuration

**API Calls Fail:**
- Verify VITE_API_URL is correct
- Check CORS settings on backend
- Verify backend is running
- Check browser console for errors

**404 on Refresh:**
- Ensure routes configuration in render.yaml
- Check staticPublishPath is `dist`
- Verify React Router configuration

---

## 📊 Monitoring Setup

### Daily Checks
- [ ] Review application logs
- [ ] Check error rates
- [ ] Monitor response times
- [ ] Verify database connectivity

### Weekly Checks
- [ ] Review security logs
- [ ] Check for dependency updates
- [ ] Monitor disk/memory usage
- [ ] Review user feedback

---

## 🔐 Security Hardening

### Immediate Actions
- [ ] Change default JWT secrets
- [ ] Enable HTTPS only (automatic on Render)
- [ ] Review CORS whitelist
- [ ] Set up rate limiting

### Ongoing
- [ ] Regular dependency updates
- [ ] Security patch monitoring
- [ ] Log review for suspicious activity
- [ ] Backup database regularly

---

## 📈 Production Readiness

### Before Going Live
- [ ] Load testing completed
- [ ] Error tracking setup (Sentry)
- [ ] Monitoring setup (UptimeRobot)
- [ ] Backup strategy in place
- [ ] SSL certificate configured
- [ ] Custom domain setup (optional)
- [ ] CDN configured (optional)
- [ ] Documentation updated

---

## 🆘 Emergency Contacts

**Render Support:**
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

**MongoDB Atlas Support:**
- Documentation: https://docs.atlas.mongodb.com
- Support: https://support.mongodb.com

---

## 📝 Deployment Log

### Backend
- Service Name: ________________
- URL: ________________
- Deploy Date: ________________
- Status: ________________

### Frontend
- Service Name: ________________
- URL: ________________
- Deploy Date: ________________
- Status: ________________

### Database
- Cluster Name: ________________
- Region: ________________
- Setup Date: ________________
- Backup Status: ________________

---

**Last Updated**: October 30, 2025
