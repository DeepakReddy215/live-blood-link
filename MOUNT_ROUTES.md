# 🚀 Mount All Routes - Final Step

## ✅ **What's Been Created**

### **Backend Controllers & Routes:**
1. ✅ Blood Request Management
2. ✅ Notification System
3. ✅ Delivery Tracking
4. ❌ Appointment System (create next)
5. ❌ Blood Bank Management (create next)

---

## 📝 **Step-by-Step: Mount Routes in server.ts**

### **1. Open server.ts**
File: `backend/src/server.ts`

### **2. Add Imports (after line 14)**
```typescript
import bloodRequestRoutes from './routes/bloodRequest.routes';
import notificationRoutes from './routes/notification.routes';
import deliveryRoutes from './routes/delivery.routes';
```

### **3. Mount Routes (after line 57, before 404 handler)**
```typescript
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blood-cards', bloodCardRoutes);
app.use('/api/requests', bloodRequestRoutes);        // NEW
app.use('/api/notifications', notificationRoutes);   // NEW
app.use('/api/deliveries', deliveryRoutes);          // NEW
```

---

## 🔧 **Complete server.ts Update**

Replace the routes section with this:

```typescript
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blood-cards', bloodCardRoutes);
app.use('/api/requests', bloodRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/deliveries', deliveryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
  });
});
```

---

## 🏗️ **Rebuild & Restart**

```bash
cd backend
npm run build

# Kill old process
taskkill /F /PID <process_id>

# Start new
npm run dev
```

---

## 🧪 **Test New Endpoints**

### **1. Blood Requests**
```bash
# Create request
POST http://localhost:5000/api/requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "bloodType": "O+",
  "unitsNeeded": 2,
  "urgency": "high",
  "hospital": {
    "name": "Apollo Hospital",
    "address": "123 Main St, Mumbai",
    "contactNumber": "+919876543210"
  },
  "notes": "Urgent requirement"
}

# Get all requests
GET http://localhost:5000/api/requests
Authorization: Bearer <token>

# Accept request (donor)
POST http://localhost:5000/api/requests/:id/accept
Authorization: Bearer <donor_token>
```

### **2. Notifications**
```bash
# Get notifications
GET http://localhost:5000/api/notifications
Authorization: Bearer <token>

# Get unread count
GET http://localhost:5000/api/notifications/unread-count
Authorization: Bearer <token>

# Mark as read
PATCH http://localhost:5000/api/notifications/:id/read
Authorization: Bearer <token>

# Mark all as read
PATCH http://localhost:5000/api/notifications/mark-all-read
Authorization: Bearer <token>
```

### **3. Deliveries**
```bash
# Create delivery (admin)
POST http://localhost:5000/api/deliveries
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "requestId": "...",
  "donorId": "...",
  "recipientId": "...",
  "pickupLocation": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "address": "Mumbai"
  },
  "deliveryLocation": {
    "latitude": 19.0896,
    "longitude": 72.8656,
    "address": "Andheri"
  }
}

# Get deliveries
GET http://localhost:5000/api/deliveries
Authorization: Bearer <token>

# Update status (delivery personnel)
PATCH http://localhost:5000/api/deliveries/:id/status
Authorization: Bearer <delivery_token>
Content-Type: application/json

{
  "status": "picked_up",
  "notes": "Package picked up",
  "coordinates": {
    "latitude": 19.0760,
    "longitude": 72.8777
  }
}
```

---

## 📋 **Still To Create**

### **Appointment System**
Create: `backend/src/controllers/appointment.controller.ts`
Create: `backend/src/routes/appointment.routes.ts`

```typescript
// Appointment Controller
export const createAppointment = async (req, res) => {
  const { bloodBankId, scheduledAt, notes } = req.body;
  
  const appointment = new Appointment({
    donorId: req.userId,
    bloodBankId,
    scheduledAt,
    notes,
    status: 'scheduled'
  });
  
  await appointment.save();
  res.status(201).json({ appointment });
};

export const getAppointments = async (req, res) => {
  const filter: any = {};
  if (req.user?.role === 'donor') {
    filter.donorId = req.userId;
  }
  
  const appointments = await Appointment.find(filter)
    .populate('bloodBankId', 'name address contactNumber')
    .sort({ scheduledAt: -1 });
  
  res.json({ appointments });
};

export const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  
  res.json({ appointment });
};

export const cancelAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  
  if (appointment.status === 'completed') {
    return res.status(400).json({ message: 'Cannot cancel completed appointment' });
  }
  
  appointment.status = 'cancelled';
  await appointment.save();
  
  res.json({ message: 'Appointment cancelled' });
};
```

### **Blood Bank Management**
Create: `backend/src/controllers/bloodBank.controller.ts`
Create: `backend/src/routes/bloodBank.routes.ts`

```typescript
// Blood Bank Controller
export const searchNearby = async (req, res) => {
  const { latitude, longitude, radius = 50 } = req.query;
  
  const bloodBanks = await BloodBank.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(longitude), Number(latitude)]
        },
        $maxDistance: Number(radius) * 1000 // km to meters
      }
    }
  });
  
  res.json({ bloodBanks });
};

export const getAllBloodBanks = async (req, res) => {
  const { city, state } = req.query;
  const filter: any = {};
  
  if (city) filter['address.city'] = city;
  if (state) filter['address.state'] = state;
  
  const bloodBanks = await BloodBank.find(filter);
  res.json({ bloodBanks });
};

export const createBloodBank = async (req, res) => {
  const bloodBank = new BloodBank(req.body);
  await bloodBank.save();
  res.status(201).json({ bloodBank });
};

export const updateInventory = async (req, res) => {
  const { bloodType, units } = req.body;
  
  const bloodBank = await BloodBank.findById(req.params.id);
  
  const inventoryItem = bloodBank.inventory.find(i => i.bloodType === bloodType);
  if (inventoryItem) {
    inventoryItem.unitsAvailable = units;
  } else {
    bloodBank.inventory.push({ bloodType, unitsAvailable: units });
  }
  
  await bloodBank.save();
  res.json({ bloodBank });
};
```

---

## 🎯 **API Endpoints Summary**

### **Authentication** (Already Working)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-otp
- POST /api/auth/logout
- GET /api/auth/me

### **Blood Cards** (Already Working)
- GET /api/blood-cards/me
- POST /api/blood-cards
- PATCH /api/blood-cards/me/health
- POST /api/blood-cards/verify

### **Blood Requests** ✅ NEW
- POST /api/requests
- GET /api/requests
- GET /api/requests/:id
- POST /api/requests/:id/match
- POST /api/requests/:id/accept
- POST /api/requests/:id/decline
- PATCH /api/requests/:id/status
- POST /api/requests/:id/escalate

### **Notifications** ✅ NEW
- GET /api/notifications
- GET /api/notifications/unread-count
- GET /api/notifications/:id
- PATCH /api/notifications/:id/read
- PATCH /api/notifications/mark-all-read
- DELETE /api/notifications/:id
- DELETE /api/notifications/read/all

### **Deliveries** ✅ NEW
- POST /api/deliveries
- GET /api/deliveries
- GET /api/deliveries/:id
- PATCH /api/deliveries/:id/status
- POST /api/deliveries/:id/tracking
- PATCH /api/deliveries/:id/assign
- PATCH /api/deliveries/:id/cancel

### **Appointments** (To Add)
- POST /api/appointments
- GET /api/appointments
- GET /api/appointments/:id
- PATCH /api/appointments/:id/status
- PATCH /api/appointments/:id/cancel

### **Blood Banks** (To Add)
- GET /api/blood-banks
- GET /api/blood-banks/nearby
- GET /api/blood-banks/:id
- POST /api/blood-banks (admin)
- PATCH /api/blood-banks/:id (admin)
- PATCH /api/blood-banks/:id/inventory (admin)

---

## ✅ **Progress: 60% Complete!**

**Completed:**
- ✅ Authentication
- ✅ Blood Cards
- ✅ Blood Requests (Backend)
- ✅ Notifications (Backend)
- ✅ Deliveries (Backend)

**Next:**
- ❌ Appointment System
- ❌ Blood Bank Management
- ❌ Frontend for all features
- ❌ Google Maps Integration

---

**Mount the routes now and test the API!** 🚀
