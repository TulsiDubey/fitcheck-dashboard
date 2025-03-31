
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Phone, Clock, Star, Building2 } from 'lucide-react';

// Mock hospital data
const hospitalData = [
  {
    id: 1,
    name: 'City General Hospital',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 123-4567',
    hours: '24/7',
    rating: 4.7,
    specialties: ['Emergency Care', 'Surgery', 'Cardiology', 'Neurology'],
    distance: '1.2 km'
  },
  {
    id: 2,
    name: 'Riverside Medical Center',
    address: '456 Park Avenue, Riverside',
    phone: '+1 (555) 987-6543',
    hours: '24/7',
    rating: 4.5,
    specialties: ['Pediatrics', 'Orthopedics', 'Oncology'],
    distance: '2.8 km'
  },
  {
    id: 3,
    name: 'St. Mary\'s Hospital',
    address: '789 Church Road, Hillside',
    phone: '+1 (555) 456-7890',
    hours: '24/7',
    rating: 4.9,
    specialties: ['Maternity', 'Cardiology', 'Emergency Care'],
    distance: '3.5 km'
  },
  {
    id: 4,
    name: 'Memorial Health Institute',
    address: '321 University Blvd, College Town',
    phone: '+1 (555) 789-0123',
    hours: '24/7',
    rating: 4.6,
    specialties: ['Cancer Treatment', 'Research', 'Specialized Surgery'],
    distance: '5.1 km'
  },
  {
    id: 5,
    name: 'Community Health Clinic',
    address: '555 Neighborhood Ave, Westside',
    phone: '+1 (555) 321-6547',
    hours: '8am - 8pm',
    rating: 4.3,
    specialties: ['Family Medicine', 'Urgent Care', 'Preventive Medicine'],
    distance: '0.7 km'
  }
];

const Hospitals = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitals, setHospitals] = useState(hospitalData);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Filter hospitals based on search query
  const filteredHospitals = hospitals.filter(hospital => 
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Simulated geolocation request
  const requestLocation = () => {
    setIsLoading(true);
    
    // In a real app, this would use the browser's geolocation API
    setTimeout(() => {
      // Mock location (San Francisco coordinates)
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
      setIsLoading(false);
    }, 1500);
  };

  // Request location on component mount
  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('hospital_near_me')}</h1>
        <p className="text-muted-foreground">Find hospitals and medical facilities near your location</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search hospitals, specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map(hospital => (
                <Card key={hospital.id} className="overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{hospital.name}</h3>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{hospital.address}</span>
                            <span className="ml-2 text-xs bg-medical-100 text-medical-800 py-0.5 px-1.5 rounded-full">
                              {hospital.distance}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Phone className="h-4 w-4 mr-1" />
                            <span>{hospital.phone}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{hospital.hours}</span>
                          </div>
                        </div>
                        <div className="flex items-center bg-green-50 px-2 py-1 rounded-md">
                          <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                          <span className="font-medium">{hospital.rating}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {hospital.specialties.map((specialty, index) => (
                            <span 
                              key={index} 
                              className="bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t flex">
                      <Button variant="ghost" className="flex-1 rounded-none py-2 h-auto">
                        View Details
                      </Button>
                      <div className="border-r"></div>
                      <Button variant="ghost" className="flex-1 rounded-none py-2 h-auto">
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No hospitals found</h3>
                <p className="text-gray-500">Try adjusting your search or location</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Your Location</h3>
              {userLocation ? (
                <div className="aspect-video bg-gray-100 rounded-md mb-3 relative">
                  {/* Mock map - in a real app this would be a proper map component */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white p-1 rounded shadow text-xs">
                    Map view
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                  {isLoading ? (
                    <div className="animate-spin h-6 w-6 border-2 border-medical-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <Button onClick={requestLocation}>Enable Location</Button>
                  )}
                </div>
              )}
              
              <h3 className="font-medium mb-2 mt-4">Emergency Contacts</h3>
              <div className="space-y-2">
                <div className="bg-red-50 p-3 rounded-md border border-red-100 flex justify-between">
                  <span className="text-red-700 font-medium">Emergency</span>
                  <span className="font-bold">911</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex justify-between">
                  <span className="text-blue-700 font-medium">Poison Control</span>
                  <span className="font-bold">1-800-222-1222</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;
