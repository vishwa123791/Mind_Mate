"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Video, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Textarea } from './textarea';
import { Input } from './input';
import { Badge } from './badge';
import { Separator } from './separator';

// Mock counselor data - frontend only
const MOCK_COUNSELORS = [
  {
    id: 'c1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Anxiety & Depression',
    rating: 4.9,
    experience: '8 years',
    image: '/placeholder-user.jpg',
    availability: {
      monday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      wednesday: ['10:00', '11:00', '14:00', '15:00', '16:00'],
      thursday: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      friday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      saturday: ['10:00', '11:00', '14:00'],
      sunday: []
    }
  },
  {
    id: 'c2',
    name: 'Dr. Michael Chen',
    specialization: 'Stress Management',
    rating: 4.8,
    experience: '6 years',
    image: '/placeholder-user.jpg',
    availability: {
      monday: ['10:00', '11:00', '14:00', '15:00', '16:00'],
      tuesday: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      wednesday: ['09:00', '11:00', '14:00', '15:00'],
      thursday: ['10:00', '11:00', '14:00', '15:00'],
      friday: ['09:00', '10:00', '11:00', '15:00', '16:00'],
      saturday: ['09:00', '10:00', '11:00'],
      sunday: ['10:00', '11:00']
    }
  },
  {
    id: 'c3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Academic Pressure',
    rating: 4.9,
    experience: '10 years',
    image: '/placeholder-user.jpg',
    availability: {
      monday: ['09:00', '10:00', '15:00', '16:00'],
      tuesday: ['10:00', '11:00', '14:00', '15:00'],
      wednesday: ['09:00', '10:00', '11:00', '16:00'],
      thursday: ['09:00', '14:00', '15:00', '16:00'],
      friday: ['10:00', '11:00', '14:00', '15:00'],
      saturday: ['09:00', '10:00'],
      sunday: []
    }
  }
];

const BookingCalendar = ({ user, onBookingComplete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [sessionMode, setSessionMode] = useState('online');
  const [duration, setDuration] = useState('60');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Get available time slots for selected counselor and date
  const getAvailableSlots = () => {
    if (!selectedCounselor || !selectedDate) return [];
    
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const availableSlots = selectedCounselor.availability[dayName] || [];
    
    // Filter out past times if selected date is today
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    if (isToday) {
      const currentHour = today.getHours();
      return availableSlots.filter(slot => {
        const slotHour = parseInt(slot.split(':')[0]);
        return slotHour > currentHour;
      });
    }
    
    return availableSlots;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startOfWeek = new Date(startOfMonth);
    startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today.setHours(0, 0, 0, 0);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isPast,
        isSelected,
        disabled: isPast || !isCurrentMonth
      });
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    if (!date.disabled) {
      setSelectedDate(date.date);
      setSelectedTime('');
    }
  };

  const handleBooking = () => {
    if (!selectedCounselor || !selectedDate || !selectedTime || !reason.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      const booking = {
        id: `booking_${Date.now()}`,
        counselor: selectedCounselor,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        duration: parseInt(duration),
        sessionMode,
        reason: reason.trim(),
        urgency,
        status: 'confirmed',
        meetingLink: sessionMode === 'online' ? `https://meet.mentalcare.com/room/${Date.now()}` : null,
        location: sessionMode === 'offline' ? 'Mental Health Center, Room 101' : null,
        createdAt: new Date().toISOString()
      };

      // Store booking in localStorage
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('userBookings', JSON.stringify(existingBookings));

      alert(`Booking confirmed! 
      
Counselor: ${selectedCounselor.name}
Date: ${selectedDate.toLocaleDateString()}
Time: ${selectedTime}
Session: ${sessionMode}
      
${sessionMode === 'online' ? `Meeting link: ${booking.meetingLink}` : `Location: ${booking.location}`}`);

      // Reset form
      setSelectedDate(null);
      setSelectedTime('');
      setSelectedCounselor(null);
      setReason('');
      setStep(1);
      setLoading(false);

      if (onBookingComplete) {
        onBookingComplete(booking);
      }
    }, 2000);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const today = new Date();
    if (newDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentDate(newDate);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Book Your Counseling Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step Indicator */}
          <div className="flex items-center mb-6">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-medium ${
                      step >= stepNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 text-gray-400 border-gray-300'
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`w-16 h-1 ${
                        step > stepNum ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="ml-4">
              <span className="text-sm text-gray-600">
                Step {step} of 3: {
                  step === 1 ? 'Select Counselor' :
                  step === 2 ? 'Choose Date & Time' :
                  'Session Details'
                }
              </span>
            </div>
          </div>

          {/* Step 1: Select Counselor */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Your Counselor</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOCK_COUNSELORS.map((counselor) => (
                  <Card
                    key={counselor.id}
                    className={`cursor-pointer transition-all ${
                      selectedCounselor?.id === counselor.id
                        ? 'ring-2 ring-blue-500 border-blue-500'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCounselor(counselor)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <img
                          src={counselor.image}
                          alt={counselor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{counselor.name}</h4>
                          <p className="text-sm text-gray-600">{counselor.specialization}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm ml-1">{counselor.rating}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{counselor.experience}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedCounselor}
                >
                  Next: Select Date & Time
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && selectedCounselor && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Date & Time</h3>
                <div className="text-sm text-gray-600">
                  Counselor: <span className="font-medium">{selectedCounselor.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="outline" size="sm" onClick={prevMonth}>
                      ←
                    </Button>
                    <h4 className="font-medium">
                      {currentDate.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h4>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      →
                    </Button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays().map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(day)}
                        disabled={day.disabled}
                        className={`p-2 text-sm rounded-lg transition-colors ${
                          day.disabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : day.isSelected
                            ? 'bg-blue-600 text-white'
                            : day.isToday
                            ? 'bg-blue-100 text-blue-600 font-medium'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {day.date.getDate()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h4 className="font-medium mb-4">Available Time Slots</h4>
                  {selectedDate ? (
                    <div className="grid grid-cols-3 gap-2">
                      {getAvailableSlots().map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTime === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(slot)}
                          className="text-sm"
                        >
                          {slot}
                        </Button>
                      ))}
                      {getAvailableSlots().length === 0 && (
                        <div className="col-span-3 text-center text-gray-500 py-4">
                          No available slots for this date
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Please select a date first
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back: Change Counselor
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedDate || !selectedTime}
                >
                  Next: Session Details
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Session Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Session Details</h3>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Counselor:</span>
                    <p className="font-medium">{selectedCounselor?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Specialization:</span>
                    <p className="font-medium">{selectedCounselor?.specialization}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">{selectedDate?.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Mode *
                  </label>
                  <Select value={sessionMode} onValueChange={setSessionMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">
                        <div className="flex items-center space-x-2">
                          <Video className="w-4 h-4" />
                          <span>Online Video Call</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="offline">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>In-Person Meeting</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Duration *
                  </label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General wellbeing</SelectItem>
                    <SelectItem value="normal">Normal - Regular support</SelectItem>
                    <SelectItem value="high">High - Need immediate help</SelectItem>
                    <SelectItem value="urgent">Urgent - Crisis situation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Session *
                </label>
                <Textarea
                  placeholder="Please describe what you'd like to discuss in this session..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This information helps your counselor prepare for the session
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back: Change Date/Time
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={loading || !reason.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Booking...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCalendar;

