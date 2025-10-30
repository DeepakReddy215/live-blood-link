import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { requestService } from '@/services/requestService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplet, MapPin, Clock, Phone, Hospital, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const RequestList = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'matched'>('pending');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await requestService.getRequests({ 
        status: filter === 'all' ? undefined : filter 
      });
      setRequests(data.requests || []);
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await requestService.declineRequest(id);
      toast.success('Request declined');
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to decline request');
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300 animate-pulse';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    if (urgency === 'critical') return <AlertCircle className="w-4 h-4 animate-pulse" />;
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-background p-4">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Droplet className="w-10 h-10 text-red-600" />
            Blood Requests Near You
          </h1>
          <p className="text-gray-600">Help save lives by responding to blood requests</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'matched' ? 'default' : 'outline'}
            onClick={() => setFilter('matched')}
          >
            Matched
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <Card className="p-12 text-center">
            <Droplet className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No requests available</h3>
            <p className="text-gray-500">Check back later for new blood requests</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((request: any, index: number) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                          <CardTitle className="text-2xl">
                            {request.bloodType} Blood Needed
                          </CardTitle>
                          <p className="text-gray-500">
                            {request.unitsNeeded} unit(s) required
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getUrgencyColor(request.urgency)} flex items-center gap-1 px-3 py-1`}>
                        {getUrgencyIcon(request.urgency)}
                        {request.urgency.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3 text-sm">
                        <Hospital className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-semibold">{request.hospital?.name}</p>
                          <p className="text-gray-600">{request.hospital?.address}</p>
                        </div>
                      </div>

                      {request.hospital?.contactNumber && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">{request.hospital.contactNumber}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          Requested {new Date(request.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Distance: ~5 km</span>
                      </div>
                    </div>

                    {request.notes && (
                      <div className="p-3 bg-blue-50 rounded-lg mb-4">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Note:</span> {request.notes}
                        </p>
                      </div>
                    )}

                    {request.status === 'pending' && (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleAccept(request._id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Request
                        </Button>
                        <Button
                          onClick={() => handleDecline(request._id)}
                          variant="outline"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    )}

                    {request.status === 'matched' && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 font-semibold flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          You accepted this request
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

export default RequestList;
