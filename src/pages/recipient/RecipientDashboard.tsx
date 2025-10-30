import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BloodCardModal } from '@/components/BloodCardModal';
import { Badge } from '@/components/ui/badge';
import NotificationDrawer from '@/components/NotificationDrawer';
import { motion } from 'framer-motion';
import {
  Activity,
  Heart,
  Clock,
  MapPin,
  CreditCard,
  AlertCircle,
  FileText,
  Plus,
  Droplet,
  List,
} from 'lucide-react';

// Mock blood card data - In production, fetch from API
const mockBloodCard = {
  id: '1',
  userId: '1',
  user: {
    id: '1',
    email: 'recipient@example.com',
    firstName: 'Priya',
    lastName: 'Sharma',
    role: 'recipient' as const,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  cardNumber: 'BC-2024-REC-001234',
  bloodType: 'B+' as const,
  dateOfBirth: '1990-05-15',
  gender: 'female' as const,
  phoneNumber: '9876543210',
  email: 'priya.sharma@example.com',
  aadharNumber: '123456789012',
  healthInfo: {
    hemoglobinLevel: 11.5,
    weight: 58,
    bloodPressure: '120/80',
    medicalConditions: ['Anemia'],
    allergies: [],
    medications: ['Iron supplements'],
    lastCheckupDate: '2024-01-15',
  },
  status: 'active' as const,
  issueDate: '2024-01-01',
  expiryDate: '2025-01-01',
  qrCode: 'QR_CODE_DATA',
  digitalSignature: 'DIGITAL_SIGNATURE_HASH_12345',
  verifiedBy: 'Dr. Kumar',
  verifiedAt: '2024-01-01',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

export default function RecipientDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showBloodCard, setShowBloodCard] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-muted-foreground mt-2">Manage your health and blood requests</p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationDrawer />
              <Button
                onClick={() => navigate('/recipient/my-requests')}
                variant="outline"
              >
                <List className="w-4 h-4 mr-2" />
                My Requests
              </Button>
              <Button
                onClick={() => navigate('/recipient/create-request')}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Heart className="w-6 h-6" />}
            title="Active Requests"
            value="2"
            description="Pending blood requests"
            color="text-destructive"
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            title="Total Requests"
            value="8"
            description="All time requests"
            color="text-primary"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="Avg Response"
            value="2.5h"
            description="Average match time"
            color="text-info"
          />
          <StatCard
            icon={<MapPin className="w-6 h-6" />}
            title="Nearby Donors"
            value="142"
            description="Available in your area"
            color="text-success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Blood Card Section */}
          <Card className="lg:col-span-2 border-primary/20 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">My Blood Card</CardTitle>
                    <CardDescription>
                      Your official digital blood identification card
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success">
                  ACTIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Card Preview */}
                <div className="bg-gradient-to-br from-card to-primary/5 rounded-lg p-6 border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">Card No: {mockBloodCard.cardNumber}</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-destructive/90 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-destructive-foreground">
                        {mockBloodCard.bloodType}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Issue Date</p>
                      <p className="font-medium">01/01/2024</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valid Until</p>
                      <p className="font-medium">01/01/2025</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={() => setShowBloodCard(true)} className="flex-1">
                    <CreditCard className="w-4 h-4 mr-2" />
                    View Full Card
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Update Health Info
                  </Button>
                </div>

                {/* Health Status Alert */}
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-warning">Health Checkup Due</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your last medical checkup was 3 months ago. Schedule a new checkup to keep your blood card active.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks at your fingertips</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button variant="destructive" className="w-full justify-start" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Blood Request
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="w-5 h-5 mr-2" />
                View Active Requests
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="w-5 h-5 mr-2" />
                Find Nearby Donors
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-5 h-5 mr-2" />
                Medical Records
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-3 border-primary/20 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest blood requests and matches</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <ActivityItem
                  type="request"
                  title="Blood Request Created"
                  description="Requested 2 units of B+ blood for Apollo Hospital"
                  time="2 hours ago"
                  status="pending"
                />
                <ActivityItem
                  type="match"
                  title="Donor Matched"
                  description="Raj Kumar accepted your request"
                  time="5 hours ago"
                  status="success"
                />
                <ActivityItem
                  type="delivery"
                  title="Blood Delivered"
                  description="Successfully delivered to Fortis Hospital"
                  time="2 days ago"
                  status="success"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Blood Card Modal */}
      <BloodCardModal
        card={mockBloodCard}
        open={showBloodCard}
        onOpenChange={setShowBloodCard}
        onRefresh={() => {
          // Refresh card data
          console.log('Refreshing card...');
        }}
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  color: string;
}

const StatCard = ({ icon, title, value, description, color }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 bg-muted rounded-lg ${color}`}>{icon}</div>
        </div>
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className="text-sm font-medium text-foreground mb-1">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

interface ActivityItemProps {
  type: 'request' | 'match' | 'delivery';
  title: string;
  description: string;
  time: string;
  status: 'pending' | 'success' | 'error';
}

const ActivityItem = ({ type, title, description, time, status }: ActivityItemProps) => {
  const getIcon = () => {
    switch (type) {
      case 'request':
        return <AlertCircle className="w-5 h-5" />;
      case 'match':
        return <Heart className="w-5 h-5" />;
      case 'delivery':
        return <Activity className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'text-warning';
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-destructive';
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
      <div className={`p-2 rounded-lg bg-muted ${getStatusColor()}`}>{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <p className="text-xs text-muted-foreground mt-2">{time}</p>
      </div>
    </div>
  );
};
