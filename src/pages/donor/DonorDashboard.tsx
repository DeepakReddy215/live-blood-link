import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useSocket } from '@/hooks/useSocket';
import { BloodCardModal } from '@/components/BloodCardModal';
import NotificationDrawer from '@/components/NotificationDrawer';
import { Heart, Calendar, MapPin, Award, Bell, Activity, CreditCard, Droplet } from 'lucide-react';

// Mock blood card data - In production, fetch from API
const mockBloodCard = {
  id: '1',
  userId: '1',
  user: {
    id: '1',
    email: 'donor@example.com',
    firstName: 'Rahul',
    lastName: 'Kumar',
    role: 'donor' as const,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  cardNumber: 'BC-2024-DON-001234',
  bloodType: 'O+' as const,
  dateOfBirth: '1995-03-20',
  gender: 'male' as const,
  phoneNumber: '9876543210',
  email: 'rahul.kumar@example.com',
  aadharNumber: '123456789012',
  healthInfo: {
    hemoglobinLevel: 14.5,
    weight: 70,
    bloodPressure: '120/80',
    medicalConditions: [],
    allergies: [],
    medications: [],
    lastCheckupDate: '2024-01-15',
  },
  lastDonationDate: '2023-10-15',
  status: 'active' as const,
  issueDate: '2024-01-01',
  expiryDate: '2025-01-01',
  qrCode: 'QR_CODE_DATA',
  digitalSignature: 'DIGITAL_SIGNATURE_HASH_12345',
  verifiedBy: 'Dr. Mehta',
  verifiedAt: '2024-01-01',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const DonorDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showBloodCard, setShowBloodCard] = useState(false);
  useSocket(); // Connect to real-time updates

  const stats = [
    {
      title: 'Total Donations',
      value: '12',
      icon: Heart,
      color: 'text-primary',
    },
    {
      title: 'Lives Saved',
      value: '36',
      icon: Activity,
      color: 'text-success',
    },
    {
      title: 'Next Eligible',
      value: '45 days',
      icon: Calendar,
      color: 'text-info',
    },
    {
      title: 'Badges Earned',
      value: '5',
      icon: Award,
      color: 'text-warning',
    },
  ];

  const recentRequests = [
    {
      id: 1,
      bloodType: 'O+',
      location: '2.5 km away',
      urgency: 'high',
      hospital: 'City General Hospital',
      time: '15 minutes ago',
    },
    {
      id: 2,
      bloodType: 'O+',
      location: '5.2 km away',
      urgency: 'medium',
      hospital: 'St. Mary Medical Center',
      time: '1 hour ago',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-muted-foreground">
                Thank you for being a life-saver. Here's your donation dashboard.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationDrawer />
              <Button
                onClick={() => navigate('/donor/requests')}
                className="bg-red-600 hover:bg-red-700"
              >
                <Droplet className="w-4 h-4 mr-2" />
                View Requests
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <span className="text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Nearby Requests */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary pulse-ring" />
                    Nearby Blood Requests
                  </CardTitle>
                  <CardDescription>
                    People near you need your blood type
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Map
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-lg px-3">
                          {request.bloodType}
                        </Badge>
                        <Badge
                          variant={request.urgency === 'high' ? 'default' : 'secondary'}
                          className={request.urgency === 'high' ? 'urgent-glow' : ''}
                        >
                          {request.urgency}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{request.hospital}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {request.location}
                        </span>
                        <span>{request.time}</span>
                      </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                      Respond
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your donations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setShowBloodCard(true)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                My Blood Card
              </Button>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
              <Button variant="outline" className="w-full">
                <Activity className="w-4 h-4 mr-2" />
                View History
              </Button>
              <Button variant="outline" className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Find Blood Banks
              </Button>
              <Button variant="outline" className="w-full">
                <Award className="w-4 h-4 mr-2" />
                My Badges
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Your Impact</h3>
            <p className="text-4xl font-bold text-primary mb-2 heartbeat">36</p>
            <p className="text-muted-foreground mb-4">
              Lives potentially saved through your donations
            </p>
            <p className="text-sm text-muted-foreground">
              Each donation can save up to 3 lives. Keep up the amazing work!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Blood Card Modal */}
      <BloodCardModal
        card={mockBloodCard}
        open={showBloodCard}
        onOpenChange={setShowBloodCard}
        onRefresh={() => {
          console.log('Refreshing card...');
        }}
      />
    </div>
  );
};

export default DonorDashboard;
