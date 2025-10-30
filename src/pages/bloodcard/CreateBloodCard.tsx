import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Loader2, User, Droplet, Calendar, Phone, Mail, IdCard } from 'lucide-react';
import { toast } from 'sonner';
import { bloodCardService } from '@/services/bloodCardService';

const CreateBloodCard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    aadharNumber: '',
    healthInfo: {
      hemoglobinLevel: '',
      weight: '',
      bloodPressure: '',
      medicalConditions: '',
      allergies: '',
      medications: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bloodType || !formData.dateOfBirth || !formData.gender) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      toast.error('Please enter a valid Indian phone number');
      return;
    }

    // Validate Aadhar number (12 digits)
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) {
      toast.error('Aadhar number must be 12 digits');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        healthInfo: {
          hemoglobinLevel: formData.healthInfo.hemoglobinLevel ? parseFloat(formData.healthInfo.hemoglobinLevel) : undefined,
          weight: formData.healthInfo.weight ? parseFloat(formData.healthInfo.weight) : undefined,
          bloodPressure: formData.healthInfo.bloodPressure || undefined,
          medicalConditions: formData.healthInfo.medicalConditions ? formData.healthInfo.medicalConditions.split(',').map(s => s.trim()) : [],
          allergies: formData.healthInfo.allergies ? formData.healthInfo.allergies.split(',').map(s => s.trim()) : [],
          medications: formData.healthInfo.medications ? formData.healthInfo.medications.split(',').map(s => s.trim()) : [],
        },
      };

      await bloodCardService.createCard(payload);
      toast.success('Blood card created successfully!');
      navigate('/donor/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create blood card');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-8"
      >
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create Digital Blood Card</CardTitle>
                <p className="text-sm text-gray-500">Fill in your details to get your digital blood card</p>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadharNumber">Aadhar Number</Label>
                    <Input
                      id="aadharNumber"
                      type="text"
                      placeholder="123456789012"
                      maxLength={12}
                      value={formData.aadharNumber}
                      onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>
              </div>

              {/* Health Information */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-900">
                  <Droplet className="w-5 h-5" />
                  Health Information (Optional)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hemoglobin">Hemoglobin Level (g/dL)</Label>
                    <Input
                      id="hemoglobin"
                      type="number"
                      step="0.1"
                      placeholder="13.5"
                      value={formData.healthInfo.hemoglobinLevel}
                      onChange={(e) => setFormData({
                        ...formData,
                        healthInfo: { ...formData.healthInfo, hemoglobinLevel: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.healthInfo.weight}
                      onChange={(e) => setFormData({
                        ...formData,
                        healthInfo: { ...formData.healthInfo, weight: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure</Label>
                    <Input
                      id="bloodPressure"
                      type="text"
                      placeholder="120/80"
                      value={formData.healthInfo.bloodPressure}
                      onChange={(e) => setFormData({
                        ...formData,
                        healthInfo: { ...formData.healthInfo, bloodPressure: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">Medical Conditions (comma-separated)</Label>
                    <Input
                      id="medicalConditions"
                      type="text"
                      placeholder="Diabetes, Hypertension"
                      value={formData.healthInfo.medicalConditions}
                      onChange={(e) => setFormData({
                        ...formData,
                        healthInfo: { ...formData.healthInfo, medicalConditions: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                    <Input
                      id="allergies"
                      type="text"
                      placeholder="Penicillin, Peanuts"
                      value={formData.healthInfo.allergies}
                      onChange={(e) => setFormData({
                        ...formData,
                        healthInfo: { ...formData.healthInfo, allergies: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications (comma-separated)</Label>
                    <Input
                      id="medications"
                      type="text"
                      placeholder="Aspirin, Vitamin D"
                      value={formData.healthInfo.medications}
                      onChange={(e) => setFormData({
                        ...formData,
                        healthInfo: { ...formData.healthInfo, medications: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Important Information:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Your blood card will be verified by our medical team</li>
                  <li>• You must be between 18-65 years old to donate blood</li>
                  <li>• Minimum weight requirement is 50 kg</li>
                  <li>• You can donate blood every 3 months</li>
                  <li>• All information provided should be accurate</li>
                </ul>
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
                    Creating Blood Card...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Create Blood Card
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

export default CreateBloodCard;
