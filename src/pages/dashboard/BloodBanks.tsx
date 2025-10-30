import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Hospital, MapPin, Phone, Mail, Clock, Droplet, Navigation, Search } from 'lucide-react';
import { toast } from 'sonner';
import { bloodBankService, BloodBank } from '@/services/bloodBankService';

const BloodBanks = () => {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchState, setSearchState] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    fetchBloodBanks();
  }, []);

  const fetchBloodBanks = async (filters?: any) => {
    setLoading(true);
    try {
      const data = await bloodBankService.getAllBloodBanks(filters);
      setBloodBanks(data.bloodBanks || []);
    } catch (error) {
      toast.error('Failed to load blood banks');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filters: any = {};
    if (searchCity) filters.city = searchCity;
    if (searchState) filters.state = searchState;
    fetchBloodBanks(filters);
  };

  const handleFindNearby = () => {
    if (navigator.geolocation) {
      toast.info('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          
          try {
            const data = await bloodBankService.searchNearby(latitude, longitude, 50);
            setBloodBanks(data.bloodBanks || []);
            toast.success(`Found ${data.bloodBanks?.length || 0} blood banks nearby`);
          } catch (error) {
            toast.error('Failed to find nearby blood banks');
          }
        },
        (error) => {
          toast.error('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const getBloodTypeColor = (bloodType: string) => {
    const colors: any = {
      'O+': 'bg-red-100 text-red-800',
      'O-': 'bg-red-200 text-red-900',
      'A+': 'bg-blue-100 text-blue-800',
      'A-': 'bg-blue-200 text-blue-900',
      'B+': 'bg-green-100 text-green-800',
      'B-': 'bg-green-200 text-green-900',
      'AB+': 'bg-purple-100 text-purple-800',
      'AB-': 'bg-purple-200 text-purple-900',
    };
    return colors[bloodType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-background p-4">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Hospital className="w-10 h-10 text-blue-600" />
            Blood Banks Directory
          </h1>
          <p className="text-gray-600">Find blood banks near you</p>
        </motion.div>

        {/* Search Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search by city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="md:col-span-1"
              />
              <Input
                placeholder="Search by state..."
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
                className="md:col-span-1"
              />
              <Button
                onClick={handleSearch}
                className="md:col-span-1"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                onClick={handleFindNearby}
                variant="outline"
                className="md:col-span-1"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Find Nearby
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Blood Banks List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : bloodBanks.length === 0 ? (
          <Card className="p-12 text-center">
            <Hospital className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No blood banks found</h3>
            <p className="text-gray-500">Try searching in a different location</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bloodBanks.map((bank, index) => (
              <motion.div
                key={bank._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Hospital className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{bank.name}</CardTitle>
                          {bank.distance && (
                            <Badge variant="outline" className="mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {bank.distance} km away
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Address */}
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-700">
                            {bank.address.street}, {bank.address.city}
                          </p>
                          <p className="text-gray-500">
                            {bank.address.state} - {bank.address.pincode}
                          </p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <a href={`tel:${bank.contactNumber}`} className="text-blue-600 hover:underline">
                          {bank.contactNumber}
                        </a>
                      </div>

                      {bank.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <a href={`mailto:${bank.email}`} className="text-blue-600 hover:underline">
                            {bank.email}
                          </a>
                        </div>
                      )}

                      {bank.operatingHours && (
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">{bank.operatingHours}</span>
                        </div>
                      )}

                      {/* Blood Inventory */}
                      {bank.inventory && bank.inventory.length > 0 && (
                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-2 mb-3">
                            <Droplet className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-semibold">Available Blood Types:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {bank.inventory.map((item, idx) => (
                              <Badge
                                key={idx}
                                className={getBloodTypeColor(item.bloodType)}
                              >
                                {item.bloodType}: {item.unitsAvailable} units
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${bank.address.street},${bank.address.city}`, '_blank')}
                          variant="outline"
                          size="sm"
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                        <Button
                          onClick={() => window.location.href = `tel:${bank.contactNumber}`}
                          size="sm"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      </div>
                    </div>
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

export default BloodBanks;
