# 🚀 BloodStream Complete Implementation Guide

## 🎯 Implementation Order

This guide will implement ALL missing features in the correct order for your BloodStream application.

---

## ✅ **Phase 1: Blood Card Fix (IMMEDIATE)**

### **Issue:** Blood card uses pre-loaded data instead of registered user data

### **Fix Required:**

#### **Backend: Already Correct** ✅
The `bloodCard.controller.ts` already pulls data from the authenticated user:
```typescript
const user = await User.findById(req.userId);
// Uses: user.bloodType, user.dateOfBirth, user.gender, user.phoneNumber, user.email
```

#### **Frontend: Check Data Flow**
When creating a blood card, ensure the form pre-fills with user data from `authStore`.

---

## 📝 **Phase 2: First-Time Blood Card Creation**

### **User Flow:**
1. User registers → Login
2. Dashboard shows "Create Your Blood Card" prompt
3. User fills required fields (DOB, Gender, Blood Type if not provided)
4. Card is created with QR code
5. Card appears in dashboard

### **Implementation:**

#### **1. Check if user has blood card (Backend - Already exists)**
```typescript
GET /api/blood-cards/me
// Returns 404 if no card exists
```

#### **2. Frontend: Add Blood Card Check**
Create: `src/components/BloodCardPrompt.tsx`
```typescript
// Show banner if user doesn't have blood card
// "Create your digital blood card to start donating/receiving"
```

#### **3. Frontend: Blood Card Creation Page**
Create: `src/pages/dashboard/CreateBloodCard.tsx`
- Form with: Date of Birth, Gender, Blood Type (if missing)
- Health information (optional)
- Submit → Creates card with QR code

---

## 🩸 **Phase 3: Blood Request Management**

### **Backend Implementation:**

#### **1. Blood Request Controller**
Create: `backend/src/controllers/bloodRequest.controller.ts`

```typescript
// Create request (recipient/admin)
export const createRequest = async (req, res) => {
  const { bloodType, units, urgency, hospital, notes } = req.body;
  
  const request = new BloodRequest({
    recipientId: req.userId,
    bloodType,
    unitsNeeded: units,
    urgency,
    hospital,
    notes,
    status: 'pending'
  });
  
  await request.save();
  
  // Trigger donor matching
  await matchDonors(request._id);
  
  res.status(201).json({ request });
};

// Match donors
export const matchDonors = async (requestId) => {
  const request = await BloodRequest.findById(requestId);
  const compatibleTypes = getCompatibleBloodTypes(request.bloodType);
  
  // Find donors within 50km radius
  const donors = await User.find({
    role: 'donor',
    bloodType: { $in: compatibleTypes },
    isVerified: true,
    // Add geospatial query here
  });
  
  // Notify matched donors via Socket.IO
  donors.forEach(donor => {
    socketService.notifyBloodMatch(donor._id, request);
  });
};

// Accept request (donor)
export const acceptRequest = async (req, res) => {
  const { requestId } = req.params;
  
  const request = await BloodRequest.findById(requestId);
  request.status = 'matched';
  request.donorId = req.userId;
  await request.save();
  
  // Notify recipient
  socketService.emitToUser(request.recipientId, 'request:matched', request);
  
  res.json({ request });
};
```

#### **2. Blood Request Routes**
Create: `backend/src/routes/bloodRequest.routes.ts`

```typescript
router.post('/', authenticate, authorize('recipient', 'admin'), createRequest);
router.get('/', authenticate, getMyRequests);
router.get('/:id', authenticate, getRequestById);
router.post('/:id/accept', authenticate, authorize('donor'), acceptRequest);
router.post('/:id/decline', authenticate, authorize('donor'), declineRequest);
router.post('/:id/escalate', authenticate, authorize('admin'), escalateRequest);
```

### **Frontend Implementation:**

#### **1. Create Request Form**
Create: `src/pages/recipient/CreateRequest.tsx`

```typescript
// Form fields:
- Blood Type (dropdown)
- Units Needed (number)
- Urgency (low/medium/high/critical)
- Hospital Name
- Hospital Address
- Contact Number
- Notes
```

#### **2. Request List**
Create: `src/pages/recipient/MyRequests.tsx`
- Show all requests with status
- Real-time updates via Socket.IO

#### **3. Donor Response UI**
Create: `src/pages/donor/RequestNotifications.tsx`
- Show matched requests
- Accept/Decline buttons
- Distance from donor

---

## 🔔 **Phase 4: Notification System**

### **Backend Implementation:**

#### **1. Notification Controller**
Create: `backend/src/controllers/notification.controller.ts`

```typescript
export const getNotifications = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const notifications = await Notification.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
    
  const unreadCount = await Notification.countDocuments({
    userId: req.userId,
    isRead: false
  });
  
  res.json({ notifications, unreadCount });
};

export const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: 'Marked as read' });
};

export const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    { userId: req.userId, isRead: false },
    { isRead: true }
  );
  res.json({ message: 'All marked as read' });
};
```

#### **2. Notification Routes**
Create: `backend/src/routes/notification.routes.ts`

### **Frontend Implementation:**

#### **1. Notification Drawer**
Create: `src/components/NotificationDrawer.tsx`

```typescript
// Features:
- Bell icon with unread count badge
- Slide-out drawer
- List of notifications
- Mark as read on click
- "Mark all as read" button
- Real-time updates via Socket.IO
```

#### **2. Notification Toast**
Create: `src/components/NotificationToast.tsx`
- Show toast when new notification arrives
- Auto-dismiss after 5 seconds

---

## 🚚 **Phase 5: Delivery Tracking**

### **Backend Implementation:**

#### **1. Delivery Controller**
Create: `backend/src/controllers/delivery.controller.ts`

```typescript
export const updateDeliveryStatus = async (req, res) => {
  const { status, notes, coordinates } = req.body;
  
  const delivery = await Delivery.findById(req.params.id);
  delivery.status = status;
  delivery.tracking.push({
    status,
    timestamp: new Date(),
    notes,
    coordinates
  });
  
  await delivery.save();
  
  // Notify recipient
  socketService.updateDeliveryStatus(delivery.recipientId, delivery);
  
  res.json({ delivery });
};
```

### **Frontend Implementation:**

#### **1. Delivery Dashboard (Delivery Role)**
Create: `src/pages/delivery/DeliveryDashboard.tsx`
- List of assigned deliveries
- Status update buttons
- GPS location capture
- Timeline view

#### **2. Delivery Tracking (Recipient)**
Create: `src/pages/recipient/TrackDelivery.tsx`
- Real-time status updates
- Map with delivery location
- Estimated arrival time

---

## 📅 **Phase 6: Appointment System**

### **Backend Implementation:**

#### **1. Appointment Controller**
Create: `backend/src/controllers/appointment.controller.ts`

```typescript
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
  
  // Send confirmation notification
  
  res.status(201).json({ appointment });
};
```

### **Frontend Implementation:**

#### **1. Appointment Booking**
Create: `src/pages/donor/BookAppointment.tsx`
- Select blood bank
- Choose date/time
- Add notes
- Calendar integration

---

## 🏥 **Phase 7: Blood Bank Management with Indian Map**

### **Map API Options for India:**

#### **Option 1: Google Maps API (Recommended)**
```bash
npm install @react-google-maps/api
```

**Features:**
- Accurate Indian locations
- Places API for blood banks
- Directions API
- Geocoding

**Setup:**
```typescript
// Get API key from: https://console.cloud.google.com/
VITE_GOOGLE_MAPS_API_KEY=your_api_key
```

#### **Option 2: Mapbox (Alternative)**
```bash
npm install mapbox-gl react-map-gl
```

#### **Option 3: OpenStreetMap with Leaflet (Free)**
```bash
npm install react-leaflet leaflet
```

### **Backend Implementation:**

#### **1. Blood Bank Controller with Geospatial**
Create: `backend/src/controllers/bloodBank.controller.ts`

```typescript
export const searchNearby = async (req, res) => {
  const { latitude, longitude, radius = 50 } = req.query;
  
  const bloodBanks = await BloodBank.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: radius * 1000 // Convert km to meters
      }
    }
  });
  
  res.json({ bloodBanks });
};
```

#### **2. Update BloodBank Model for Geospatial**
```typescript
// Add index
bloodBankSchema.index({ location: '2dsphere' });
```

### **Frontend Implementation:**

#### **1. Blood Bank Map**
Create: `src/pages/dashboard/BloodBankMap.tsx`

```typescript
// Features:
- Show user's current location
- Display nearby blood banks as markers
- Click marker to see details
- "Get Directions" button
- Filter by blood type availability
- Search by city/area
```

#### **2. Blood Bank List**
Create: `src/pages/dashboard/BloodBankList.tsx`
- List view with distance
- Filter and sort options
- Contact information

---

## 📊 **Phase 8: Analytics Dashboard**

### **Backend Implementation:**

#### **1. Analytics Controller**
Create: `backend/src/controllers/analytics.controller.ts`

```typescript
export const getOverview = async (req, res) => {
  const stats = {
    totalUsers: await User.countDocuments(),
    totalDonors: await User.countDocuments({ role: 'donor' }),
    totalRequests: await BloodRequest.countDocuments(),
    activeRequests: await BloodRequest.countDocuments({ status: 'pending' }),
    completedDeliveries: await Delivery.countDocuments({ status: 'delivered' }),
    totalAppointments: await Appointment.countDocuments()
  };
  
  res.json({ stats });
};

export const getDonorPerformance = async (req, res) => {
  // Top donors by donations
  // Availability distribution
  // Response time metrics
};
```

### **Frontend Implementation:**

#### **1. Analytics Dashboard**
Create: `src/pages/admin/Analytics.tsx`

```bash
npm install recharts
```

```typescript
// Components:
- Metric cards (total users, requests, etc.)
- Line chart (requests over time)
- Bar chart (blood type distribution)
- Pie chart (request status)
- Donor leaderboard
```

---

## 🗺️ **Indian Map Integration - Detailed**

### **Step 1: Install Dependencies**

```bash
cd live-blood-link-main
npm install @react-google-maps/api
```

### **Step 2: Get Google Maps API Key**

1. Go to: https://console.cloud.google.com/
2. Create new project: "BloodStream"
3. Enable APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API
4. Create credentials → API Key
5. Restrict key to your domain

### **Step 3: Add to .env**

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...your_key
```

### **Step 4: Create Map Component**

Create: `src/components/IndianMap.tsx`

```typescript
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const IndianMap = ({ bloodBanks, userLocation }) => {
  const mapStyles = {
    height: "500px",
    width: "100%"
  };
  
  const defaultCenter = {
    lat: 20.5937, // Center of India
    lng: 78.9629
  };
  
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={6}
        center={userLocation || defaultCenter}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: '/user-marker.png',
              scaledSize: new google.maps.Size(40, 40)
            }}
          />
        )}
        
        {/* Blood bank markers */}
        {bloodBanks.map(bank => (
          <Marker
            key={bank._id}
            position={{ lat: bank.latitude, lng: bank.longitude }}
            onClick={() => setSelectedBank(bank)}
          />
        ))}
        
        {/* Info window */}
        {selectedBank && (
          <InfoWindow
            position={{ lat: selectedBank.latitude, lng: selectedBank.longitude }}
            onCloseClick={() => setSelectedBank(null)}
          >
            <div>
              <h3>{selectedBank.name}</h3>
              <p>{selectedBank.address}</p>
              <button>Get Directions</button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};
```

### **Step 5: Get User Location**

```typescript
const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        // Fallback to IP-based location or ask user to enter city
      }
    );
  }
};
```

---

## 📦 **Complete Package.json Updates**

### **Frontend:**
```json
{
  "dependencies": {
    "@react-google-maps/api": "^2.19.2",
    "recharts": "^2.10.3",
    "date-fns": "^3.0.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.4",
    "zod": "^3.22.4"
  }
}
```

### **Backend:**
```json
{
  "dependencies": {
    "node-cron": "^3.0.3",
    "bull": "^4.12.0"
  }
}
```

---

## 🚀 **Deployment Steps**

1. Install all dependencies
2. Update environment variables
3. Restart backend
4. Test each feature
5. Deploy to production

---

## ✅ **Testing Checklist**

- [ ] User can register and create blood card
- [ ] Blood card shows actual user data
- [ ] Blood requests can be created
- [ ] Donors receive match notifications
- [ ] Donors can accept/decline requests
- [ ] Deliveries can be tracked
- [ ] Appointments can be booked
- [ ] Map shows nearby blood banks
- [ ] Notifications work in real-time
- [ ] Analytics show correct data

---

**This is your complete implementation guide. Start with Phase 1 and work through each phase systematically!** 🩸🚀
