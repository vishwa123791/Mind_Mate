import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  MessageCircle, 
  Star, 
  Clock, 
  Globe, 
  Heart,
  Shield,
  Search,
  Filter,
  ChevronDown,
  UserCheck
} from 'lucide-react';

function PeerSupportPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVolunteers();
  }, [selectedSpecialty]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        console.log('No auth token found, using mock data');
        setVolunteers(getMockVolunteers());
        return;
      }

      const queryParams = selectedSpecialty ? `?specialty=${selectedSpecialty}` : '';
      const response = await fetch(`http://localhost:5002/api/peer-support/volunteers${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Volunteers fetched successfully:', result);
        
        if (result.success && result.data) {
          setVolunteers(result.data);
        } else {
          console.log('Invalid response, using mock data');
          setVolunteers(getMockVolunteers());
        }
      } else {
        console.log(`API failed with status ${response.status}, using mock data`);
        setVolunteers(getMockVolunteers());
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      console.log('Using fallback mock data');
      setVolunteers(getMockVolunteers());
    } finally {
      setLoading(false);
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.specialties.some(spec => 
                           spec.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesOnlineFilter = !showOnlineOnly || volunteer.isOnline;
    
    return matchesSearch && matchesOnlineFilter;
  });

  const specialties = [
    'Anxiety', 'Depression', 'Academic Stress', 'Loneliness', 
    'Social Anxiety', 'Self-Esteem', 'Academic Burnout', 'Sleep Issues',
    'Addiction', 'Peer Pressure', 'Phobias', 'Panic Attacks'
  ];

  const startChat = async (volunteerId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        alert('Please log in to start a chat');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5002/api/peer-support/start-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ volunteerId })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Chat started successfully:', result);
        
        if (result.success && result.data) {
          navigate(`/peer-chat/${volunteerId}`, { 
            state: { 
              chatRoomId: result.data.chatRoomId,
              volunteer: result.data.volunteer
            }
          });
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(`Failed to start chat: ${response.status}`);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Using demo mode.');
      // For demo purposes, navigate anyway
      navigate(`/peer-chat/${volunteerId}`, { 
        state: { 
          chatRoomId: `demo_${volunteerId}_${Date.now()}`,
          volunteer: volunteers.find(v => v.id === volunteerId)
        }
      });
    }
  };

  const getMockVolunteers = () => [
    {
      id: 'vol_1',
      name: 'Sarah Chen',
      avatar: '/placeholder-user.jpg',
      bio: 'I understand the challenges of academic pressure and anxiety. Having gone through similar experiences, I want to help others find their path to wellness.',
      specialties: ['Anxiety', 'Academic Stress', 'Self-Esteem'],
      languages: ['English', 'Mandarin'],
      ageRange: '22-25',
      experience: '2 years',
      rating: 4.9,
      isOnline: true,
      totalChats: 156,
      responseTime: '< 5 min'
    },
    {
      id: 'vol_2',
      name: 'Marcus Johnson',
      avatar: '/placeholder-user.jpg',
      bio: 'Former athlete who dealt with depression and social anxiety. I believe in the power of community and shared experiences in healing.',
      specialties: ['Depression', 'Social Anxiety', 'Loneliness'],
      languages: ['English'],
      ageRange: '20-23',
      experience: '1.5 years',
      rating: 4.8,
      isOnline: false,
      totalChats: 89,
      responseTime: '< 10 min'
    },
    {
      id: 'vol_3',
      name: 'Emily Rodriguez',
      avatar: '/placeholder-user.jpg',
      bio: 'Graduate student who overcame academic burnout and sleep issues. I love helping peers develop healthy coping strategies.',
      specialties: ['Academic Burnout', 'Sleep Issues', 'Academic Stress'],
      languages: ['English', 'Spanish'],
      ageRange: '24-27',
      experience: '3 years',
      rating: 4.9,
      isOnline: true,
      totalChats: 203,
      responseTime: '< 3 min'
    },
    {
      id: 'vol_4',
      name: 'Alex Kim',
      avatar: '/placeholder-user.jpg',
      bio: 'Peer supporter specializing in addiction recovery and peer pressure. I believe everyone deserves support without judgment.',
      specialties: ['Addiction', 'Peer Pressure', 'Self-Esteem'],
      languages: ['English', 'Korean'],
      ageRange: '21-24',
      experience: '2.5 years',
      rating: 4.7,
      isOnline: true,
      totalChats: 134,
      responseTime: '< 7 min'
    },
    {
      id: 'vol_5',
      name: 'Maya Patel',
      avatar: '/placeholder-user.jpg',
      bio: 'Having experienced panic attacks and phobias, I understand how overwhelming these feelings can be. Here to listen and support.',
      specialties: ['Panic Attacks', 'Phobias', 'Anxiety'],
      languages: ['English', 'Hindi'],
      ageRange: '19-22',
      experience: '1 year',
      rating: 4.6,
      isOnline: false,
      totalChats: 67,
      responseTime: '< 15 min'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Peer Support Community
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Connect with trained peer supporters who understand your journey. 
            Our community members have lived experiences and are here to listen, support, and share hope.
          </p>
        </div>

        {/* Safety Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Safety & Guidelines
              </h3>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Peer supporters are not professional therapists or counselors</li>
                <li>• If you're in crisis or having thoughts of self-harm, please contact emergency services</li>
                <li>• All conversations are confidential, but please don't share personal identifying information</li>
                <li>• Be respectful and kind in all interactions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, specialty, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Specialty Filter */}
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="appearance-none bg-background border border-input rounded-lg px-4 py-3 pr-10 text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>

            {/* Online Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="onlineOnly"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <label htmlFor="onlineOnly" className="text-sm text-foreground">
                Show online only
              </label>
            </div>
          </div>
        </div>

        {/* Volunteers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading peer supporters...</p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No supporters found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVolunteers.map(volunteer => (
              <div 
                key={volunteer.id}
                className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={volunteer.avatar}
                          alt={volunteer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          volunteer.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-foreground">
                          {volunteer.name}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {volunteer.experience} experience
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-foreground font-medium">
                        {volunteer.rating}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {volunteer.bio}
                  </p>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {volunteer.specialties.map(specialty => (
                        <span
                          key={specialty}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages and Age */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      <span>{volunteer.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center">
                      <UserCheck className="w-4 h-4 mr-1" />
                      <span>Age {volunteer.ageRange}</span>
                    </div>
                  </div>

                  {/* Status and Action */}
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center text-sm ${
                      volunteer.isOnline ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        volunteer.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      {volunteer.isOnline ? 'Available now' : 'Offline'}
                    </div>
                    
                    <button
                      onClick={() => startChat(volunteer.id)}
                      disabled={!volunteer.isOnline}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {volunteer.isOnline ? 'Start Chat' : 'Offline'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Crisis Support CTA */}
        <div className="mt-16 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl p-8 max-w-4xl mx-auto border border-red-200/50">
          <div className="text-center">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Need Immediate Help?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you're experiencing a mental health crisis or having thoughts of self-harm, 
              please reach out for immediate professional help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:988"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                <Shield className="w-5 h-5 mr-2" />
                Call 988 - Crisis Lifeline
              </a>
              <Link
                to="/resources"
                className="inline-flex items-center px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
              >
                View Crisis Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PeerSupportPage;