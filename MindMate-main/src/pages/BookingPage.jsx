import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BookingCalendar from '../components/ui/booking-calendar';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Calendar, Clock, CheckCircle, AlertCircle, Phone, Video, MapPin } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';

const BookingPage = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserBookings();
    }
  }, [user]);

  // Load bookings from localStorage
  const loadUserBookings = () => {
    try {
      setLoading(true);
      const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      
      const now = new Date();
      const upcoming = bookings.filter(booking => {
        const bookingDateTime = new Date(`${booking.date} ${booking.time}`);
        return bookingDateTime > now && ['confirmed', 'scheduled'].includes(booking.status);
      });
      
      const past = bookings.filter(booking => {
        const bookingDateTime = new Date(`${booking.date} ${booking.time}`);
        return bookingDateTime <= now || ['completed', 'cancelled'].includes(booking.status);
      });
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = (bookingId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      );
      
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      alert('Appointment cancelled successfully');
      loadUserBookings();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
      case 'confirmed':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="p-6">
          <CardContent className="text-center">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-gray-600">You need to be signed in to book appointments</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Stats */}
      {(upcomingAppointments.length > 0 || pastAppointments.length > 0) && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{upcomingAppointments.length}</div>
                  <div className="text-sm text-gray-600">Upcoming Sessions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {pastAppointments.filter(apt => apt.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed Sessions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {upcomingAppointments.length + pastAppointments.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
            <div className="grid gap-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(appointment.status)}
                          <span className="font-semibold">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </span>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-600" />
                            <span>{appointment.counselor?.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {appointment.sessionMode === 'online' ? (
                              <Video className="h-4 w-4 text-gray-600" />
                            ) : (
                              <MapPin className="h-4 w-4 text-gray-600" />
                            )}
                            <span className="text-sm text-gray-600">
                              {appointment.duration} min • {appointment.sessionMode}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-700">
                          <strong>Reason:</strong> {appointment.reason}
                        </div>
                        
                        {appointment.sessionMode === 'online' && appointment.meetingLink && (
                          <div className="text-sm">
                            <strong>Meeting Link:</strong>{' '}
                            <a 
                              href={appointment.meetingLink} 
                              className="text-blue-600 hover:underline"
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Join Session
                            </a>
                          </div>
                        )}
                        
                        {appointment.sessionMode === 'offline' && appointment.location && (
                          <div className="text-sm">
                            <strong>Location:</strong> {appointment.location}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Booking Calendar */}
        <BookingCalendar 
          user={user} 
          onBookingComplete={(bookingData) => {
            console.log('Booking completed:', bookingData);
            loadUserBookings();
          }} 
        />

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Appointments</h2>
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="p-6 space-y-4">
                    {pastAppointments.slice(0, 10).map((appointment) => (
                      <div key={appointment.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(appointment.status)}
                              <span className="font-medium">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                              </span>
                              <Badge className={getStatusColor(appointment.status)} variant="secondary">
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              {appointment.counselor?.name} • {appointment.duration} minutes
                            </div>
                            
                            <div className="text-sm text-gray-700">
                              <strong>Reason:</strong> {appointment.reason}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border-t border-red-200 mt-12">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center space-x-4">
            <Phone className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Crisis Support</h3>
              <p className="text-red-700 text-sm">
                If you're experiencing a mental health emergency, call the crisis hotline: 
                <strong className="ml-1">+1-800-CRISIS (24/7)</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;