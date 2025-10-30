# 🔧 BloodStream Troubleshooting Guide

## ❌ **Issue: Frontend and Backend Not Connected**

### **Problem:**
Buttons not working, API calls failing, no data loading.

### **Root Cause:**
Missing `.env` file in frontend with API URL configuration.

---

## ✅ **SOLUTION (FIXED)**

### **1. Created `.env` File** ✅
File: `live-blood-link-main/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

### **2. Restart Frontend** (REQUIRED)
```bash
# Kill frontend process
# Then restart:
cd live-blood-link-main
npm run dev
```

---

## 🔍 **Verification Steps**

### **Step 1: Check Servers Running**
```bash
# Backend should be on port 5000
netstat -ano | findstr :5000

# Frontend should be on port 8080
netstat -ano | findstr :8080
```

### **Step 2: Test Backend Health**
```bash
curl http://localhost:5000/health
# Should return: {"status":"OK","timestamp":"...","uptime":...}
```

### **Step 3: Test API Endpoint**
```bash
# Try a public endpoint
curl http://localhost:5000/api/auth/login
# Should return error (no credentials) but proves API is accessible
```

### **Step 4: Check Frontend Console**
1. Open http://localhost:8080
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Look for errors
5. Go to Network tab
6. Try clicking a button
7. Check if API calls are being made to `http://localhost:5000/api`

---

## 🚀 **Complete Restart Instructions**

### **If Still Not Working:**

#### **1. Kill All Processes**
```bash
# Find and kill backend
netstat -ano | findstr :5000
taskkill /F /PID <backend_pid>

# Find and kill frontend
netstat -ano | findstr :8080
taskkill /F /PID <frontend_pid>
```

#### **2. Restart Backend**
```bash
cd backend
npm run dev
```

Wait for: `✅ Server running on port 5000`

#### **3. Restart Frontend**
```bash
cd live-blood-link-main
npm run dev
```

Wait for: `Local: http://localhost:8080/`

#### **4. Test Connection**
1. Open http://localhost:8080
2. Try to register/login
3. Check browser console for errors

---

## 🔧 **Common Issues & Fixes**

### **Issue 1: CORS Errors**
**Symptoms:** 
- Console shows: `Access to XMLHttpRequest blocked by CORS policy`

**Fix:**
Backend CORS is already configured for port 8080. If you see this:
1. Make sure backend is running
2. Check backend console for CORS errors
3. Verify frontend is on port 8080

### **Issue 2: 404 Not Found**
**Symptoms:**
- API calls return 404
- Console shows: `GET http://localhost:8080/api/... 404`

**Fix:**
Frontend is trying to call API on wrong port. This means `.env` file not loaded.
1. Verify `.env` file exists in `live-blood-link-main/`
2. Restart frontend (MUST restart after creating .env)
3. Check console: `import.meta.env.VITE_API_URL` should be `http://localhost:5000/api`

### **Issue 3: Network Error**
**Symptoms:**
- Console shows: `Network Error` or `ERR_CONNECTION_REFUSED`

**Fix:**
Backend is not running.
1. Start backend: `cd backend && npm run dev`
2. Wait for server to start
3. Test: `curl http://localhost:5000/health`

### **Issue 4: 401 Unauthorized**
**Symptoms:**
- API calls return 401
- User gets logged out

**Fix:**
This is normal for protected routes when not logged in.
1. Register a new account
2. Login
3. Token will be stored
4. Protected routes will work

### **Issue 5: 500 Internal Server Error**
**Symptoms:**
- API calls return 500
- Backend console shows errors

**Fix:**
1. Check backend console for error details
2. Common causes:
   - MongoDB not connected
   - Missing environment variables
   - Code errors

---

## 📋 **Quick Checklist**

Before reporting issues, verify:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 8080
- [ ] `.env` file exists in `live-blood-link-main/`
- [ ] `.env` contains: `VITE_API_URL=http://localhost:5000/api`
- [ ] Frontend restarted after creating `.env`
- [ ] MongoDB running (for backend)
- [ ] No console errors in browser
- [ ] Network tab shows API calls to correct URL

---

## 🧪 **Test Each Feature**

### **Test 1: Registration**
1. Go to http://localhost:8080/auth/register
2. Fill form
3. Submit
4. Check Network tab - should POST to `http://localhost:5000/api/auth/register`
5. Should see success message or validation errors

### **Test 2: Login**
1. Go to http://localhost:8080/auth/login
2. Enter credentials
3. Submit
4. Check Network tab - should POST to `http://localhost:5000/api/auth/login`
5. Should redirect to dashboard on success

### **Test 3: Protected Route**
1. Login first
2. Go to `/donor/requests` or `/recipient/create-request`
3. Check Network tab - should GET/POST to API with Authorization header
4. Should see data or form

---

## 🔍 **Debug Mode**

### **Enable Detailed Logging:**

**Frontend (Browser Console):**
```javascript
// Check API URL
console.log(import.meta.env.VITE_API_URL);
// Should show: http://localhost:5000/api

// Check if token exists
console.log(localStorage.getItem('token'));
// Should show token after login
```

**Backend (Terminal):**
- Already has Morgan logging enabled
- Shows all HTTP requests
- Check for errors in red

---

## ✅ **Expected Behavior After Fix**

### **When Working Correctly:**

1. **Registration:**
   - Form submits
   - Network tab shows POST to `http://localhost:5000/api/auth/register`
   - Returns 201 Created
   - Shows success message

2. **Login:**
   - Form submits
   - Network tab shows POST to `http://localhost:5000/api/auth/login`
   - Returns 200 OK with token
   - Redirects to dashboard

3. **Protected Routes:**
   - Network tab shows Authorization header
   - API calls succeed
   - Data loads
   - Buttons work

4. **Notifications:**
   - Bell icon shows count
   - Drawer opens
   - Notifications load

---

## 🚨 **Emergency Reset**

If nothing works:

```bash
# 1. Kill everything
taskkill /F /IM node.exe

# 2. Clean install backend
cd backend
rm -rf node_modules
npm install
npm run build
npm run dev

# 3. Clean install frontend
cd ../live-blood-link-main
rm -rf node_modules
npm install
npm run dev

# 4. Verify .env exists
cat .env
# Should show: VITE_API_URL=http://localhost:5000/api
```

---

## 📞 **Still Not Working?**

Check these files:
1. `live-blood-link-main/.env` - Must exist with correct URL
2. `live-blood-link-main/src/utils/constants.ts` - Check API_BASE_URL
3. `backend/src/server.ts` - Check CORS configuration
4. Browser Console - Check for errors
5. Backend Console - Check for errors

---

## ✅ **Success Indicators**

You'll know it's working when:
- ✅ Registration form submits successfully
- ✅ Login redirects to dashboard
- ✅ Notifications load
- ✅ Blood requests can be created
- ✅ Network tab shows API calls to port 5000
- ✅ No CORS errors in console
- ✅ No 404 errors for API calls

---

**After following this guide, your frontend and backend should be properly connected!** 🎉
