# 🎯 IMPORTANT: Customize Before Deployment

## ⚠️ This Guide Uses Generic Placeholders

All documentation uses **generic placeholders** that you MUST customize for YOUR project.

---

## 🔧 What You Need to Customize

### 1. Service Names on Render

When creating services on Render, you choose the names. These become your URLs.

**Examples of what you'll choose:**
- Backend name: `my-blood-app-api` → URL: `https://my-blood-app-api.onrender.com`
- Frontend name: `my-blood-app` → URL: `https://my-blood-app.onrender.com`

**In this documentation, we use:**
- `your-project-backend` (replace with YOUR chosen backend name)
- `your-project-frontend` (replace with YOUR chosen frontend name)

---

### 2. GitHub Repository

**Your actual repository:**
- Owner: `DeepakReddy215`
- Repository: `live-blood-link-backend`
- Branch: `main`

When connecting to Render, select YOUR repository from YOUR GitHub account.

---

### 3. Database Configuration

**Your MongoDB Atlas:**
- Cluster name: (whatever you create)
- Database name: Can be `bloodstream` or any name you prefer
- Connection string: Your actual MongoDB Atlas connection string

---

### 4. Environment Variables

**Backend - Replace these placeholders:**

```env
# Example placeholders in docs → Your actual values
MONGODB_URI=<your-connection-string> → Your actual MongoDB Atlas URI
JWT_SECRET=<generated-secret> → Generate using deployment helper
JWT_REFRESH_SECRET=<generated-secret> → Generate using deployment helper
EMAIL_USER=your-email@gmail.com → Your actual Gmail
EMAIL_PASSWORD=<app-password> → Your actual Gmail app password
FRONTEND_URL=https://your-project-frontend.onrender.com → Your actual frontend URL
```

**Frontend - Replace these placeholders:**

```env
# Example placeholders in docs → Your actual values
VITE_API_URL=https://your-project-backend.onrender.com/api → Your actual backend URL
VITE_SOCKET_URL=https://your-project-backend.onrender.com → Your actual backend URL
```

---

## 📝 Step-by-Step Customization Process

### Step 1: Choose Your Service Names

Before starting, decide:
- **Backend name**: _________________ (e.g., `blood-donation-api`)
- **Frontend name**: _________________ (e.g., `blood-donation-app`)

### Step 2: Generate Secrets

Run the helper script:
```powershell
.\deployment-helper.ps1
```

This generates:
- JWT_SECRET
- JWT_REFRESH_SECRET
- Save these in `GENERATED_SECRETS.txt`

### Step 3: Setup MongoDB Atlas

1. Create cluster
2. Create database user
3. Copy connection string
4. Replace placeholders in connection string with your actual username/password

### Step 4: Setup Gmail

1. Create app password
2. Save it securely

### Step 5: Deploy Backend

1. Choose YOUR backend name (e.g., `my-blood-api`)
2. Set environment variables with YOUR actual values
3. Note the URL: `https://[your-backend-name].onrender.com`

### Step 6: Deploy Frontend

1. Choose YOUR frontend name (e.g., `my-blood-app`)
2. Set environment variables using the backend URL from Step 5
3. Note the URL: `https://[your-frontend-name].onrender.com`

### Step 7: Update Backend

1. Update `FRONTEND_URL` in backend environment variables
2. Use the frontend URL from Step 6

---

## 🗂️ File Customization Checklist

### Files that need YOUR values:

#### Backend Environment (.env in Render Dashboard)
- [ ] MONGODB_URI → Your MongoDB Atlas connection string
- [ ] JWT_SECRET → Generated secret from helper script
- [ ] JWT_REFRESH_SECRET → Generated secret from helper script
- [ ] EMAIL_USER → Your Gmail address
- [ ] EMAIL_PASSWORD → Your Gmail app password
- [ ] FRONTEND_URL → Your actual frontend Render URL

#### Frontend Environment (.env in Render Dashboard)
- [ ] VITE_API_URL → Your actual backend Render URL + `/api`
- [ ] VITE_SOCKET_URL → Your actual backend Render URL

#### Optional: render.yaml (if using Infrastructure as Code)
- [ ] Line 7: `name: your-project-backend` → Your chosen backend name
- [ ] Line 9: `region: oregon` → Your preferred region
- [ ] Line 11: `branch: main` → Your default branch name
- [ ] Line 41: `name: your-project-frontend` → Your chosen frontend name

---

## 📊 Example: Complete Customization

**Scenario:** You choose these names:
- Backend: `live-blood-backend`
- Frontend: `live-blood-app`

**Your URLs will be:**
- Backend: `https://live-blood-backend.onrender.com`
- Frontend: `https://live-blood-app.onrender.com`

**Your environment variables:**

Backend:
```env
MONGODB_URI=mongodb+srv://john:Pass123@cluster0.abc123.mongodb.net/bloodstream
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
JWT_REFRESH_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
FRONTEND_URL=https://live-blood-app.onrender.com
```

Frontend:
```env
VITE_API_URL=https://live-blood-backend.onrender.com/api
VITE_SOCKET_URL=https://live-blood-backend.onrender.com
```

---

## 🚫 What NOT to Change

**Keep these as-is:**
- Root Directory: `backend` (for backend)
- Root Directory: `live-blood-link-main` (for frontend)
- Build commands: `npm install && npm run build`
- Start command: `npm start` (backend)
- Publish directory: `dist` (frontend)
- PORT: `10000` (Render requires this)
- NODE_ENV: `production`

---

## ✅ Verification

After customization, verify:

1. **Backend URL works:**
   ```bash
   curl https://[YOUR-BACKEND-NAME].onrender.com/api/health
   ```

2. **Frontend URL works:**
   Visit `https://[YOUR-FRONTEND-NAME].onrender.com` in browser

3. **Environment variables match:**
   - Frontend `VITE_API_URL` matches Backend URL
   - Backend `FRONTEND_URL` matches Frontend URL

---

## 💡 Pro Tips

1. **Consistent Naming**: Use related names for easy identification
   - Good: `blood-app-backend` and `blood-app-frontend`
   - Avoid: `myapi123` and `webapp-xyz`

2. **Document Your Choices**: Fill in the deployment log in `DEPLOYMENT_CHECKLIST_RENDER.md`

3. **Test First**: Use placeholder names for initial testing, then create production services

4. **Security**: Never commit actual secrets to Git - they only go in Render Dashboard

---

## 📚 Documentation Files Guide

| File | Purpose | Needs Customization? |
|------|---------|---------------------|
| `RENDER_DEPLOYMENT_GUIDE.md` | Complete guide | Replace URLs when deploying |
| `QUICK_DEPLOY_REFERENCE.md` | Quick reference | Replace URLs when deploying |
| `README_RENDER_DEPLOYMENT.md` | Overview | Replace URLs when deploying |
| `DEPLOYMENT_CHECKLIST_RENDER.md` | Track progress | Fill in your actual values |
| `render.yaml` | Infrastructure code | Optional - customize names |
| `deployment-helper.ps1` | Generate secrets | Run to get YOUR secrets |
| `deployment-helper.js` | Generate secrets | Run to get YOUR secrets |
| `THIS FILE` | Customization guide | Read before deploying |

---

## 🎯 Quick Start Checklist

- [ ] Read this entire file
- [ ] Choose your backend service name
- [ ] Choose your frontend service name
- [ ] Run `deployment-helper.ps1` to generate secrets
- [ ] Setup MongoDB Atlas
- [ ] Setup Gmail app password
- [ ] Deploy backend with YOUR chosen name
- [ ] Deploy frontend with YOUR chosen name
- [ ] Update all environment variables with YOUR actual URLs
- [ ] Test both services
- [ ] Document your URLs for future reference

---

## 🆘 Common Mistakes to Avoid

1. ❌ Using the example names (`bloodstream-backend`) literally
2. ❌ Forgetting to update `FRONTEND_URL` after frontend deployment
3. ❌ Mismatching URLs in frontend environment variables
4. ❌ Using regular Gmail password instead of app password
5. ❌ Not replacing `<placeholders>` with actual values
6. ❌ Committing secrets to Git
7. ❌ Using different branch names without updating configuration

---

**Remember**: The documentation uses placeholders. Every instance of:
- `your-project-backend` → Replace with YOUR backend name
- `your-project-frontend` → Replace with YOUR frontend name
- `<your-something>` → Replace with YOUR actual value

**Created**: October 30, 2025
**Purpose**: Ensure successful customization and deployment
