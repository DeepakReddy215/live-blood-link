import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, Hospital, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { requestService } from '@/services/requestService';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: '',
    unitsNeeded: 1,
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    hospital: {
      name: '',
      address: '',
      contactNumber: '',
    },
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bloodType) {
      toast.error('Please select blood type');
      return;
    }

    setIsLoading(true);

    try {
      await requestService.createRequest(formData);
      toast.success('Blood request created successfully!');
      navigate('/recipient/dashboard');
    } catch (error: any) {
      console.error('Create request error:', error);
      toast.error(error.response?.data?.message || 'Failed to create request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto py-8"
      >
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <Droplet className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create Blood Request</CardTitle>
                <CardDescription>Request blood for urgent medical needs</CardDescription>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Blood Type & Units */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type *</Label>
                  <Select
                    value={formData.bloodType}
                    onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
                  >
                    <SelectTrigger id="bloodType">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitsNeeded">Units Needed *</Label>
                  <Input
                    id="unitsNeeded"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.unitsNeeded}
                    onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value: any) => setFormData({ ...formData, urgency: value })}
                >
                  <SelectTrigger id="urgency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Low - Scheduled procedure
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        Medium - Within 24 hours
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        High - Within 6 hours
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Critical - Immediate
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hospital Information */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-900">
                  <Hospital className="w-5 h-5" />
                  <h3 className="font-semibold">Hospital Information</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name *</Label>
                  <Input
                    id="hospitalName"
                    placeholder="e.g., Apollo Hospital"
                    value={formData.hospital.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      hospital: { ...formData.hospital, name: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospitalAddress">Hospital Address *</Label>
                  <Textarea
                    id="hospitalAddress"
                    placeholder="Full address with city and state"
                    value={formData.hospital.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      hospital: { ...formData.hospital, address: e.target.value }
                    })}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospitalContact">Hospital Contact Number</Label>
                  <Input
                    id="hospitalContact"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.hospital.contactNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      hospital: { ...formData.hospital, contactNumber: e.target.value }
                    })}
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or medical information..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Alert */}
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important:</p>
                  <p>Once submitted, our system will automatically match you with compatible donors in your area. You'll receive notifications when donors respond.</p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Request...
                  </>
                ) : (
                  <>
                    <Droplet className="mr-2 h-5 w-5" />
                    Create Blood Request
                  </>
                )}
              </Button>
            </CardContent>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateRequest;
