import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Hospital, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { appointmentService } from '@/services/appointmentService';
import { bloodBankService, BloodBank } from '@/services/bloodBankService';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [formData, setFormData] = useState({
    bloodBankId: '',
    scheduledAt: '',
    notes: '',
  });

  useEffect(() => {
    fetchBloodBanks();
  }, []);

  const fetchBloodBanks = async () => {
    try {
      const data = await bloodBankService.getAllBloodBanks();
      setBloodBanks(data.bloodBanks || []);
    } catch (error) {
      toast.error('Failed to load blood banks');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bloodBankId || !formData.scheduledAt) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      await appointmentService.createAppointment(formData);
      toast.success('Appointment booked successfully!');
      navigate('/donor/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-8"
      >
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Book Appointment</CardTitle>
                <p className="text-sm text-gray-500">Schedule your blood donation</p>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Blood Bank Selection */}
              <div className="space-y-2">
                <Label htmlFor="bloodBank">Blood Bank *</Label>
                <Select
                  value={formData.bloodBankId}
                  onValueChange={(value) => setFormData({ ...formData, bloodBankId: value })}
                >
                  <SelectTrigger id="bloodBank">
                    <SelectValue placeholder="Select blood bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodBanks.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No blood banks available
                      </div>
                    ) : (
                      bloodBanks.map((bank) => (
                        <SelectItem key={bank._id} value={bank._id}>
                          <div className="flex flex-col">
                            <span className="font-semibold">{bank.name}</span>
                            <span className="text-xs text-gray-500">
                              {bank.address.city}, {bank.address.state}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Blood Bank Details */}
              {formData.bloodBankId && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  {(() => {
                    const selectedBank = bloodBanks.find(b => b._id === formData.bloodBankId);
                    if (!selectedBank) return null;
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Hospital className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold">{selectedBank.name}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          <span>
                            {selectedBank.address.street}, {selectedBank.address.city}, {selectedBank.address.state} - {selectedBank.address.pincode}
                          </span>
                        </div>
                        {selectedBank.contactNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{selectedBank.contactNumber}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Date & Time */}
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Appointment Date & Time *</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  min={today}
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500">
                  Please select a date and time for your donation
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or information..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Important Information */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Before You Donate:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Eat a healthy meal before donation</li>
                  <li>• Stay well hydrated</li>
                  <li>• Get adequate sleep the night before</li>
                  <li>• Bring a valid ID proof</li>
                  <li>• Minimum 3 months gap between donations</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
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

export default BookAppointment;
