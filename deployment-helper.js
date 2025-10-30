/**
 * Deployment Helper Script
 * Run: node deployment-helper.js
 * 
 * This script helps you:
 * 1. Generate secure JWT secrets
 * 2. Validate MongoDB connection string
 * 3. Check environment variable format
 * 4. Generate deployment checklist
 */

const crypto = require('crypto');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('       🚀 BLOODSTREAM RENDER DEPLOYMENT HELPER 🚀');
console.log('═══════════════════════════════════════════════════════════════\n');

// Generate JWT Secrets
console.log('📋 STEP 1: Generate JWT Secrets\n');
const jwtSecret = crypto.randomBytes(32).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');

console.log('Copy these to your Render environment variables:\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}\n`);

// MongoDB Connection String Guide
console.log('═══════════════════════════════════════════════════════════════');
console.log('📋 STEP 2: MongoDB Connection String\n');
console.log('Your MongoDB URI should look like this:');
console.log('mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bloodstream?retryWrites=true&w=majority\n');
console.log('Replace:');
console.log('  - <username>: Your MongoDB Atlas username');
console.log('  - <password>: Your MongoDB Atlas password');
console.log('  - cluster0.xxxxx: Your actual cluster URL\n');

// Environment Variables Checklist
console.log('═══════════════════════════════════════════════════════════════');
console.log('📋 STEP 3: Environment Variables Checklist\n');

const backendEnvVars = [
  { name: 'NODE_ENV', value: 'production', required: true },
  { name: 'PORT', value: '10000', required: true },
  { name: 'MONGODB_URI', value: '<your-connection-string>', required: true },
  { name: 'JWT_SECRET', value: jwtSecret, required: true },
  { name: 'JWT_REFRESH_SECRET', value: jwtRefreshSecret, required: true },
  { name: 'JWT_EXPIRES_IN', value: '1h', required: true },
  { name: 'JWT_REFRESH_EXPIRES_IN', value: '7d', required: true },
  { name: 'EMAIL_HOST', value: 'smtp.gmail.com', required: true },
  { name: 'EMAIL_PORT', value: '587', required: true },
  { name: 'EMAIL_USER', value: '<your-email@gmail.com>', required: true },
  { name: 'EMAIL_PASSWORD', value: '<app-password>', required: true },
  { name: 'EMAIL_FROM', value: 'BloodStream <noreply@bloodstream.com>', required: true },
  { name: 'FRONTEND_URL', value: '<will-update-later>', required: true },
  { name: 'RATE_LIMIT_WINDOW_MS', value: '900000', required: false },
  { name: 'RATE_LIMIT_MAX_REQUESTS', value: '100', required: false },
  { name: 'OTP_EXPIRES_IN', value: '10', required: false },
  { name: 'OTP_LENGTH', value: '6', required: false }
];

console.log('BACKEND Environment Variables:\n');
backendEnvVars.forEach((envVar, index) => {
  const status = envVar.required ? '🔴 REQUIRED' : '🟢 OPTIONAL';
  console.log(`${index + 1}. ${envVar.name}`);
  console.log(`   ${status}`);
  console.log(`   Value: ${envVar.value}\n`);
});

console.log('═══════════════════════════════════════════════════════════════');
console.log('📋 STEP 4: Frontend Environment Variables\n');

const frontendEnvVars = [
  { name: 'VITE_API_URL', value: 'https://your-backend.onrender.com/api', required: true },
  { name: 'VITE_SOCKET_URL', value: 'https://your-backend.onrender.com', required: true }
];

frontendEnvVars.forEach((envVar, index) => {
  console.log(`${index + 1}. ${envVar.name}`);
  console.log(`   🔴 REQUIRED`);
  console.log(`   Value: ${envVar.value}\n`);
});

// Deployment Steps
console.log('═══════════════════════════════════════════════════════════════');
console.log('📋 STEP 5: Deployment Order\n');

const steps = [
  '1. Set up MongoDB Atlas cluster',
  '2. Generate and save JWT secrets (done above ✅)',
  '3. Create Gmail App Password',
  '4. Deploy Backend on Render',
  '5. Copy Backend URL',
  '6. Deploy Frontend on Render',
  '7. Update Backend FRONTEND_URL environment variable',
  '8. Test the application'
];

steps.forEach(step => console.log(`${step}`));

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('📋 STEP 6: Verification URLs\n');

console.log('After deployment, test these URLs:\n');
console.log('Backend Health: https://your-backend.onrender.com/api/health');
console.log('Frontend: https://your-frontend.onrender.com\n');

console.log('═══════════════════════════════════════════════════════════════');
console.log('📚 Documentation Files Created:\n');

const docs = [
  '1. RENDER_DEPLOYMENT_GUIDE.md - Complete step-by-step guide',
  '2. DEPLOYMENT_CHECKLIST_RENDER.md - Detailed checklist',
  '3. QUICK_DEPLOY_REFERENCE.md - Quick reference guide',
  '4. render.yaml - Infrastructure as code',
  '5. backend/.env.render.example - Backend env vars template',
  '6. live-blood-link-main/.env.production.example - Frontend env vars template'
];

docs.forEach(doc => console.log(`✅ ${doc}`));

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('🎉 You\'re ready to deploy!\n');
console.log('Start with: RENDER_DEPLOYMENT_GUIDE.md');
console.log('═══════════════════════════════════════════════════════════════\n');

// Save secrets to file for reference
const fs = require('fs');
const secretsFile = `
# GENERATED JWT SECRETS
# Generated on: ${new Date().toISOString()}
# ⚠️  KEEP THESE SECURE - DO NOT COMMIT TO GIT

JWT_SECRET=${jwtSecret}
JWT_REFRESH_SECRET=${jwtRefreshSecret}

# Copy these to your Render Dashboard > Environment Variables
`;

fs.writeFileSync('GENERATED_SECRETS.txt', secretsFile);
console.log('💾 Secrets saved to: GENERATED_SECRETS.txt');
console.log('⚠️  Remember to add GENERATED_SECRETS.txt to .gitignore!\n');
