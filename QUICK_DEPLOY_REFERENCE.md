# Quick Reference for Render Deployment

## 🎯 Quick Deploy Commands

### Backend Service Configuration
```
Name: your-project-backend (choose any name)
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

### Frontend Static Site Configuration
```
Name: your-project-frontend (choose any name)
Root Directory: live-blood-link-main
Build Command: npm install --legacy-peer-deps && npm run build
Publish Directory: dist
```

**Note**: The service names you choose will become part of your URLs:
- Backend: `https://your-project-backend.onrender.com`
- Frontend: `https://your-project-frontend.onrender.com`

**Important**: Use `--legacy-peer-deps` flag to resolve dependency conflicts.

---

## 🔑 Generate JWT Secrets

Run in terminal (Node.js):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or in PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🌐 URLs After Deployment

### Your Services (Examples - yours will be different)
- Backend API: `https://your-project-backend.onrender.com`
- Frontend App: `https://your-project-frontend.onrender.com`
- Health Check: `https://your-project-backend.onrender.com/api/health`

**Replace with YOUR actual service names chosen during deployment**

### Management
- Render Dashboard: https://dashboard.render.com
- MongoDB Atlas: https://cloud.mongodb.com
- Gmail App Passwords: https://myaccount.google.com/apppasswords

---

## 📋 Environment Variables Quick Copy

### Backend (Render Dashboard)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/bloodstream
JWT_SECRET=<generated-32-char-string>
JWT_REFRESH_SECRET=<generated-32-char-string>
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<app-password>
EMAIL_FROM=BloodStream <noreply@bloodstream.com>
FRONTEND_URL=https://your-project-frontend.onrender.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
OTP_EXPIRES_IN=10
OTP_LENGTH=6
```

### Frontend (Render Dashboard)
```
VITE_API_URL=https://your-project-backend.onrender.com/api
VITE_SOCKET_URL=https://your-project-backend.onrender.com
```

**IMPORTANT**: Replace `your-project-backend` and `your-project-frontend` with YOUR actual service names!

---

## 🧪 Test Commands

### Test Backend Health
```bash
curl https://your-project-backend.onrender.com/api/health
```
(Replace `your-project-backend` with your actual service name)

### Test Backend API
```bash
curl -X POST https://your-project-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","name":"Test User"}'
```
(Replace `your-project-backend` with your actual service name)

---

## 🚨 Common Issues & Fixes

### Issue: "Service Unavailable"
**Solution**: Check Render logs, service might be starting up (cold start)

### Issue: "Database connection failed"
**Solution**: 
1. Check MongoDB Atlas IP whitelist (0.0.0.0/0)
2. Verify connection string format
3. Check database user credentials

### Issue: "CORS Error"
**Solution**: 
1. Update FRONTEND_URL in backend env vars
2. Ensure no trailing slashes
3. Redeploy backend

### Issue: "Build Failed"
**Solution**:
1. Check package.json dependencies
2. Review build logs
3. Test build locally: `npm run build`

---

## 📊 Deployment Timeline

1. **MongoDB Setup** - 10 minutes
2. **Backend Deploy** - 15 minutes
3. **Frontend Deploy** - 10 minutes
4. **Final Config** - 5 minutes
5. **Testing** - 10 minutes

**Total**: ~50 minutes

---

## 💡 Pro Tips

1. **Cold Starts**: Free tier services sleep after 15 min inactivity
2. **Logs**: Always check logs first when debugging
3. **Environment Variables**: Changes trigger automatic redeployment
4. **Custom Domain**: Can be added in service settings
5. **SSL**: Automatic and free on Render

---

## 🔗 Essential Links

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 📞 Need Help?

1. Check the detailed guide: `RENDER_DEPLOYMENT_GUIDE.md`
2. Review checklist: `DEPLOYMENT_CHECKLIST_RENDER.md`
3. Check Render community: https://community.render.com
4. Review logs in Render dashboard

---

**Created**: October 30, 2025
