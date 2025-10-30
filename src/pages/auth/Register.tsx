import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { BLOOD_TYPES } from '@/utils/constants';
import { UserRole, BloodType } from '@/types';
import { toast } from 'sonner';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor' as UserRole,
    phoneNumber: '',
    bloodType: '' as BloodType | '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required';
        else if (value.trim().length < 2) error = 'First name must be at least 2 characters';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Last name is required';
        else if (value.trim().length < 2) error = 'Last name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        else if (!/(?=.*[a-z])/.test(value)) error = 'Password must contain a lowercase letter';
        else if (!/(?=.*[A-Z])/.test(value)) error = 'Password must contain an uppercase letter';
        else if (!/(?=.*\d)/.test(value)) error = 'Password must contain a number';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'phoneNumber':
        if (value) {
          // Indian phone number format: +91XXXXXXXXXX or 91XXXXXXXXXX or XXXXXXXXXX (10 digits)
          const cleanNumber = value.replace(/[\s\-()]/g, '');
          if (!/^(\+91|91)?[6-9]\d{9}$/.test(cleanNumber)) {
            error = 'Invalid Indian phone number. Format: +91XXXXXXXXXX (10 digits starting with 6-9)';
          }
        }
        break;
      case 'bloodType':
        if ((formData.role === 'donor' || formData.role === 'recipient') && !value) {
          error = 'Blood type is required for donors and recipients';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData] as string);
  };

  const handleChange = (name: string, value: string) => {
    // Auto-format Indian phone number
    if (name === 'phoneNumber') {
      // Remove all non-digits
      let cleaned = value.replace(/\D/g, '');
      
      // If starts with 91, add +
      if (cleaned.startsWith('91') && cleaned.length > 2) {
        cleaned = '+91' + cleaned.substring(2);
      } else if (cleaned.length > 0 && !cleaned.startsWith('91')) {
        // If doesn't start with 91, add +91
        cleaned = '+91' + cleaned;
      }
      
      // Limit to +91 + 10 digits
      if (cleaned.length > 13) {
        cleaned = cleaned.substring(0, 13);
      }
      
      value = cleaned;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phoneNumber', 'bloodType'];
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    // Mark all fields as touched
    const allTouched = fieldsToValidate.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(allTouched);

    if (hasErrors) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData as any);
      toast.success('Account created! Please verify your email with the OTP sent.');
      navigate('/auth/verify-otp', { state: { email: formData.email } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      
      // Show detailed errors if available
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Droplet className="w-10 h-10 text-primary heartbeat" />
            <span className="text-3xl font-bold">
              Blood<span className="gradient-text">Stream</span>
            </span>
          </Link>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>Join BloodStream and start saving lives</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      onBlur={() => handleBlur('firstName')}
                      className={`pl-10 ${touched.firstName && errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      required
                    />
                  </div>
                  {touched.firstName && errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      onBlur={() => handleBlur('lastName')}
                      className={`pl-10 ${touched.lastName && errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      required
                    />
                  </div>
                  {touched.lastName && errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`pl-10 ${touched.email && errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    required
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    onBlur={() => handleBlur('phoneNumber')}
                    className={`pl-10 ${touched.phoneNumber && errors.phoneNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                </div>
                {touched.phoneNumber && errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
                )}
                <p className="text-xs text-muted-foreground">Indian format: +91 followed by 10 digits</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select
                    name="role"
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                  >
                    <SelectTrigger id="role" name="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="donor">Donor</SelectItem>
                      <SelectItem value="recipient">Recipient</SelectItem>
                      <SelectItem value="delivery">Delivery Personnel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.role === 'donor' || formData.role === 'recipient') && (
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type *</Label>
                    <Select
                      name="bloodType"
                      value={formData.bloodType}
                      onValueChange={(value) => {
                        handleChange('bloodType', value);
                        setTouched(prev => ({ ...prev, bloodType: true }));
                      }}
                    >
                      <SelectTrigger 
                        id="bloodType" 
                        name="bloodType"
                        className={touched.bloodType && errors.bloodType ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.bloodType && errors.bloodType && (
                      <p className="text-sm text-red-500 mt-1">{errors.bloodType}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`pl-10 ${touched.password && errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    required
                  />
                </div>
                {touched.password && errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-muted-foreground">Must be 6+ characters with uppercase, lowercase, and number</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={`pl-10 ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    required
                  />
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
