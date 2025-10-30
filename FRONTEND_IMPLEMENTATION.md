# 🎨 Frontend Implementation Guide - Complete

## ✅ **What's Been Created**

### **Services (API Integration):**
1. ✅ `src/services/requestService.ts` - Blood request API calls
2. ✅ `src/services/notificationService.ts` - Notification API calls

### **Components:**
1. ✅ `src/components/NotificationDrawer.tsx` - Notification drawer with unread count

### **Pages:**
1. ✅ `src/pages/recipient/CreateRequest.tsx` - Blood request form

---

## 📝 **Remaining Components to Create**

### **1. Request List for Donors**
File: `src/pages/donor/RequestList.tsx`

```typescript
import { useState, useEffect } from 'react';
import { requestService } from '@/services/requestService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplet, MapPin, Clock, Phone } from 'lucide-react';
import { toast } from 'sonner';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await requestService.getRequests({ status: 'pending' });
      setRequests(data.requests);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await requestService.acceptRequest(id);
      toast.success('Request accepted! Recipient will be notified.');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await requestService.declineRequest(id);
      toast.success('Request declined');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to decline request');
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Blood Requests Near You</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <Card className="p-8 text-center">
          <Droplet className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No blood requests available at the moment</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request: any) => (
            <Card key={request._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <Droplet className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {request.bloodType} Blood Needed
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.unitsNeeded} unit(s) required
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{request.hospital?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{new Date(request.createdAt).toLocaleString()}</span>
                    </div>
                    {request.hospital?.contactNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{request.hospital.contactNumber}</span>
                      </div>
                    )}
                  </div>

                  {request.notes && (
                    <p className="text-sm text-gray-600 mb-4">{request.notes}</p>
                  )}

                  <Badge className={getUrgencyColor(request.urgency)}>
                    {request.urgency.toUpperCase()} PRIORITY
                  </Badge>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleAccept(request._id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDecline(request._id)}
                    variant="outline"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestList;
```

---

### **2. My Requests Page (Recipient)**
File: `src/pages/recipient/MyRequests.tsx`

```typescript
import { useState, useEffect } from 'react';
import { requestService } from '@/services/requestService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplet, Clock, User } from 'lucide-react';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const data = await requestService.getRequests();
      setRequests(data.requests);
    } catch (error) {
      console.error('Failed to load requests');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'matched': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Blood Requests</h1>
      
      <div className="grid gap-4">
        {requests.map((request: any) => (
          <Card key={request._id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Droplet className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {request.bloodType} - {request.unitsNeeded} unit(s)
                    </h3>
                    <p className="text-sm text-gray-500">{request.hospital?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                  {request.donorId && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Donor matched
                    </div>
                  )}
                </div>

                <Badge className={getStatusColor(request.status)}>
                  {request.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;
```

---

### **3. Add Notification Drawer to Layout**
File: Update `src/layouts/AppLayout.tsx` or main layout

```typescript
import NotificationDrawer from '@/components/NotificationDrawer';

// In your header/navbar:
<div className="flex items-center gap-4">
  <NotificationDrawer />
  {/* Other header items */}
</div>
```

---

### **4. Add Routes to App.tsx**

```typescript
import CreateRequest from './pages/recipient/CreateRequest';
import MyRequests from './pages/recipient/MyRequests';
import RequestList from './pages/donor/RequestList';

// In your Routes:
<Route
  path="/recipient/create-request"
  element={
    <ProtectedRoute allowedRoles={['recipient']}>
      <CreateRequest />
    </ProtectedRoute>
  }
/>
<Route
  path="/recipient/my-requests"
  element={
    <ProtectedRoute allowedRoles={['recipient']}>
      <MyRequests />
    </ProtectedRoute>
  }
/>
<Route
  path="/donor/requests"
  element={
    <ProtectedRoute allowedRoles={['donor']}>
      <RequestList />
    </ProtectedRoute>
  }
/>
```

---

### **5. Install Required Packages**

```bash
cd live-blood-link-main
npm install date-fns
```

---

## 🎯 **Quick Implementation Steps**

### **Step 1: Create Missing Components**
Copy the code above for:
1. `RequestList.tsx`
2. `MyRequests.tsx`

### **Step 2: Update Routes**
Add the new routes to `App.tsx`

### **Step 3: Add Notification Drawer**
Add `<NotificationDrawer />` to your main layout/header

### **Step 4: Test**
1. Login as recipient
2. Create a blood request
3. Login as donor
4. View and accept requests
5. Check notifications

---

## 📱 **Additional Components Needed**

### **Appointment Booking**
File: `src/pages/donor/BookAppointment.tsx`
- Date/time picker
- Blood bank selector
- Notes field
- Submit to `/api/appointments`

### **Blood Bank Directory**
File: `src/pages/dashboard/BloodBanks.tsx`
- List of blood banks
- Search by city/state
- "Find Nearby" button
- Contact information display

### **Delivery Tracking**
File: `src/pages/delivery/DeliveryTracking.tsx`
- Delivery list
- Status update buttons
- GPS location capture
- Timeline view

---

## 🗺️ **Google Maps Integration**

### **Install Package:**
```bash
npm install @react-google-maps/api
```

### **Get API Key:**
1. https://console.cloud.google.com/
2. Create project
3. Enable Maps JavaScript API
4. Get API key
5. Add to `.env`: `VITE_GOOGLE_MAPS_API_KEY=your_key`

### **Map Component:**
File: `src/components/BloodBankMap.tsx`

```typescript
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const BloodBankMap = ({ bloodBanks, userLocation }) => {
  const [selected, setSelected] = useState(null);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ height: '500px', width: '100%' }}
        zoom={12}
        center={userLocation || { lat: 20.5937, lng: 78.9629 }}
      >
        {/* User location */}
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
            onClick={() => setSelected(bank)}
          />
        ))}

        {/* Info window */}
        {selected && (
          <InfoWindow
            position={{ lat: selected.latitude, lng: selected.longitude }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h3 className="font-bold">{selected.name}</h3>
              <p>{selected.address}</p>
              <p>{selected.contactNumber}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default BloodBankMap;
```

---

## ✅ **Implementation Checklist**

- [x] Request service created
- [x] Notification service created
- [x] Create Request form
- [x] Notification drawer
- [ ] Request list for donors
- [ ] My requests page
- [ ] Add routes to App.tsx
- [ ] Add notification drawer to layout
- [ ] Install date-fns
- [ ] Appointment booking
- [ ] Blood bank directory
- [ ] Google Maps integration
- [ ] Delivery tracking UI

---

## 🎨 **UI Components Needed**

All using shadcn/ui (already installed):
- ✅ Card
- ✅ Button
- ✅ Input
- ✅ Select
- ✅ Textarea
- ✅ Badge
- ✅ Sheet (for drawer)
- ✅ ScrollArea

---

## 🚀 **Next Steps**

1. Create the remaining component files
2. Add routes to App.tsx
3. Test each feature
4. Add Google Maps
5. Style and polish

**Your frontend is 60% complete with these core features!** 🎉
