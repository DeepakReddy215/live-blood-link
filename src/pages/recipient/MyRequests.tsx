import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { requestService } from '@/services/requestService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplet, Clock, User, Hospital, Plus, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const data = await requestService.getRequests();
      setRequests(data.requests || []);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'matched': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_transit': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'matched': return <User className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-background p-4">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Droplet className="w-10 h-10 text-red-600" />
                My Blood Requests
              </h1>
              <p className="text-gray-600">Track your blood request status</p>
            </div>
            <Button
              onClick={() => navigate('/recipient/create-request')}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <Card className="p-12 text-center">
            <Droplet className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No requests yet</h3>
            <p className="text-gray-500 mb-6">Create your first blood request to get started</p>
            <Button
              onClick={() => navigate('/recipient/create-request')}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Request
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((request: any, index: number) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-full">
                          <Droplet className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {request.bloodType} Blood - {request.unitsNeeded} unit(s)
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {request.hospital?.name}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1 px-3 py-1`}>
                        {getStatusIcon(request.status)}
                        {request.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className={`w-4 h-4 ${getUrgencyColor(request.urgency)}`} />
                        <span className={`font-semibold ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency.toUpperCase()} Priority
                        </span>
                      </div>
                    </div>

                    {request.donorId && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                        <div className="flex items-center gap-2 text-green-800">
                          <User className="w-4 h-4" />
                          <span className="font-semibold">Donor Matched!</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          A donor has accepted your request
                        </p>
                      </div>
                    )}

                    {request.hospital?.address && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                        <Hospital className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span>{request.hospital.address}</span>
                      </div>
                    )}

                    {request.notes && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Notes:</span> {request.notes}
                        </p>
                      </div>
                    )}

                    {request.status === 'pending' && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          🔍 Searching for compatible donors in your area...
                        </p>
                      </div>
                    )}

                    {request.status === 'completed' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 font-semibold">
                          ✅ Request completed successfully!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
