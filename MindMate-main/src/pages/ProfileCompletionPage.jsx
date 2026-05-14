import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  AlertCircle,
  CheckCircle,
  Save
} from 'lucide-react';
import { apiRequest } from '../config/api';

const ProfileCompletionPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    // Basic Information
    name: user?.name || '',
    email: user?.email || '',
    
    // Student Profile
    studentId: user?.studentProfile?.studentId || '',
    program: user?.studentProfile?.program || '',
    year: user?.studentProfile?.year || '',
    department: user?.studentProfile?.department || '',
    university: user?.studentProfile?.university || '',
    graduationYear: user?.studentProfile?.graduationYear || '',
    
    // Personal Information
    age: user?.personalInfo?.age || '',
    gender: user?.personalInfo?.gender || '',
    phone: user?.personalInfo?.phone || '',
    
    // Emergency Contact
    emergencyContact: {
      name: user?.emergencyContact?.name || '',
      relationship: user?.emergencyContact?.relationship || '',
      phone: user?.emergencyContact?.phone || '',
      email: user?.emergencyContact?.email || ''
    },
    
    // Preferences
    preferences: {
      preferredLanguage: user?.preferences?.preferredLanguage || 'english',
      preferredSessionMode: user?.preferences?.preferredSessionMode || 'no_preference',
      preferredCommunication: user?.preferences?.preferredCommunication || 'email',
      timeZone: user?.preferences?.timeZone || 'Asia/Kolkata'
    },
    
    // Mental Health Information (Optional)
    mentalHealthInfo: {
      previousTherapy: user?.mentalHealthInfo?.previousTherapy || false,
      currentMedication: user?.mentalHealthInfo?.currentMedication || false,
      medicationDetails: user?.mentalHealthInfo?.medicationDetails || '',
      allergies: user?.mentalHealthInfo?.allergies || [],
      emergencyConditions: user?.mentalHealthInfo?.emergencyConditions || []
    },
    
    // Notification Preferences
    notificationPreferences: {
      emailNotifications: user?.notificationPreferences?.emailNotifications !== false,
      smsNotifications: user?.notificationPreferences?.smsNotifications !== false,
      appointmentReminders: user?.notificationPreferences?.appointmentReminders !== false,
      marketingEmails: user?.notificationPreferences?.marketingEmails || false
    }
  });

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!profileData.studentId.trim()) newErrors.studentId = 'Student ID is required';
      if (!profileData.program.trim()) newErrors.program = 'Academic program is required';
      if (!profileData.year) newErrors.year = 'Year of study is required';
      if (!profileData.department.trim()) newErrors.department = 'Department is required';
      if (!profileData.university.trim()) newErrors.university = 'University is required';
    }

    if (step === 2) {
      if (!profileData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!profileData.age) newErrors.age = 'Age is required';
      if (!profileData.gender) newErrors.gender = 'Gender selection is required';
    }

    if (step === 3) {
      if (!profileData.emergencyContact.name.trim()) {
        newErrors.emergencyContactName = 'Emergency contact name is required';
      }
      if (!profileData.emergencyContact.relationship.trim()) {
        newErrors.emergencyContactRelationship = 'Relationship is required';
      }
      if (!profileData.emergencyContact.phone.trim()) {
        newErrors.emergencyContactPhone = 'Emergency contact phone is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setProfileData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      console.log('Submitting profile data...');

      const profilePayload = {
        studentProfile: {
          studentId: profileData.studentId,
          program: profileData.program,
          year: parseInt(profileData.year),
          department: profileData.department,
          university: profileData.university,
          graduationYear: parseInt(profileData.graduationYear)
        },
        personalInfo: {
          age: parseInt(profileData.age),
          gender: profileData.gender,
          phone: profileData.phone
        },
        emergencyContact: profileData.emergencyContact,
        preferences: profileData.preferences,
        mentalHealthInfo: profileData.mentalHealthInfo,
        notificationPreferences: profileData.notificationPreferences
      };

      console.log('Sending payload:', profilePayload);

      // Submit profile data to backend
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(profilePayload)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Profile update response:', result);

      if (result.success) {
        // Update user context
        if (updateUser) {
          updateUser(result.user);
        }
        
        alert('Profile completed successfully! You can now book appointments.');
        
        // Redirect to booking page
        navigate('/booking');
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = (step) => {
    switch (step) {
      case 1: return 'Academic Information';
      case 2: return 'Personal Information';
      case 3: return 'Emergency Contact';
      case 4: return 'Preferences & Settings';
      default: return 'Profile Setup';
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 1: return profileData.studentId && profileData.program && profileData.year && profileData.department;
      case 2: return profileData.phone && profileData.age && profileData.gender;
      case 3: return profileData.emergencyContact.name && profileData.emergencyContact.phone;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">
            Help us provide you with the best counseling services by completing your profile.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep === step
                        ? 'bg-primary text-white border-primary'
                        : isStepComplete(step)
                        ? 'bg-green-100 text-green-600 border-green-600'
                        : 'bg-gray-100 text-gray-400 border-gray-300'
                    }`}
                  >
                    {isStepComplete(step) && currentStep > step ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-16 h-1 ${
                        currentStep > step ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Step {currentStep}: {getStepTitle(currentStep)}
            </h2>
          </div>
        </div>

        {/* Form Content */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            {/* Step 1: Academic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID *
                    </label>
                    <Input
                      placeholder="Enter your student ID"
                      value={profileData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                      className={errors.studentId ? 'border-red-500' : ''}
                    />
                    {errors.studentId && (
                      <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year of Study *
                    </label>
                    <Select
                      value={profileData.year.toString()}
                      onValueChange={(value) => handleInputChange('year', value)}
                    >
                      <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                        <SelectItem value="5">5th Year</SelectItem>
                        <SelectItem value="6">6th Year</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.year && (
                      <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Program *
                  </label>
                  <Select
                    value={profileData.program}
                    onValueChange={(value) => handleInputChange('program', value)}
                  >
                    <SelectTrigger className={errors.program ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer_science">Computer Science</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="business">Business Administration</SelectItem>
                      <SelectItem value="psychology">Psychology</SelectItem>
                      <SelectItem value="arts">Liberal Arts</SelectItem>
                      <SelectItem value="sciences">Sciences</SelectItem>
                      <SelectItem value="law">Law</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.program && (
                    <p className="text-red-500 text-sm mt-1">{errors.program}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <Input
                    placeholder="e.g., Computer Science, Mechanical Engineering"
                    value={profileData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={errors.department ? 'border-red-500' : ''}
                  />
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      University *
                    </label>
                    <Input
                      placeholder="Your university name"
                      value={profileData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className={errors.university ? 'border-red-500' : ''}
                    />
                    {errors.university && (
                      <p className="text-red-500 text-sm mt-1">{errors.university}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Graduation Year
                    </label>
                    <Select
                      value={profileData.graduationYear.toString()}
                      onValueChange={(value) => handleInputChange('graduationYear', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 8 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <Select
                      value={profileData.age.toString()}
                      onValueChange={(value) => handleInputChange('age', value)}
                    >
                      <SelectTrigger className={errors.age ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => i + 16).map(age => (
                          <SelectItem key={age} value={age.toString()}>
                            {age}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.age && (
                      <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <Select
                      value={profileData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                    >
                      <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Emergency Contact */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800">Important</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        This contact will be notified only in case of emergencies. 
                        Please choose someone you trust.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <Input
                      placeholder="Emergency contact name"
                      value={profileData.emergencyContact.name}
                      onChange={(e) => handleInputChange('name', e.target.value, 'emergencyContact')}
                      className={errors.emergencyContactName ? 'border-red-500' : ''}
                    />
                    {errors.emergencyContactName && (
                      <p className="text-red-500 text-sm mt-1">{errors.emergencyContactName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship *
                    </label>
                    <Select
                      value={profileData.emergencyContact.relationship}
                      onValueChange={(value) => handleInputChange('relationship', value, 'emergencyContact')}
                    >
                      <SelectTrigger className={errors.emergencyContactRelationship ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="guardian">Guardian</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="relative">Relative</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.emergencyContactRelationship && (
                      <p className="text-red-500 text-sm mt-1">{errors.emergencyContactRelationship}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={profileData.emergencyContact.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value, 'emergencyContact')}
                      className={errors.emergencyContactPhone ? 'border-red-500' : ''}
                    />
                    {errors.emergencyContactPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.emergencyContactPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address (Optional)
                    </label>
                    <Input
                      type="email"
                      placeholder="contact@example.com"
                      value={profileData.emergencyContact.email}
                      onChange={(e) => handleInputChange('email', e.target.value, 'emergencyContact')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preferences & Settings */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Communication Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Language
                      </label>
                      <Select
                        value={profileData.preferences.preferredLanguage}
                        onValueChange={(value) => handleInputChange('preferredLanguage', value, 'preferences')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Session Mode
                      </label>
                      <Select
                        value={profileData.preferences.preferredSessionMode}
                        onValueChange={(value) => handleInputChange('preferredSessionMode', value, 'preferences')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online Only</SelectItem>
                          <SelectItem value="offline">In-Person Only</SelectItem>
                          <SelectItem value="no_preference">No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Notification Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <Checkbox
                        checked={profileData.notificationPreferences.emailNotifications}
                        onCheckedChange={(checked) => 
                          handleInputChange('emailNotifications', checked, 'notificationPreferences')
                        }
                      />
                      <span className="text-sm">Email notifications for appointments</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <Checkbox
                        checked={profileData.notificationPreferences.smsNotifications}
                        onCheckedChange={(checked) => 
                          handleInputChange('smsNotifications', checked, 'notificationPreferences')
                        }
                      />
                      <span className="text-sm">SMS reminders</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <Checkbox
                        checked={profileData.notificationPreferences.appointmentReminders}
                        onCheckedChange={(checked) => 
                          handleInputChange('appointmentReminders', checked, 'notificationPreferences')
                        }
                      />
                      <span className="text-sm">Appointment reminders (24h before)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Mental Health Information (Optional)</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <Checkbox
                        checked={profileData.mentalHealthInfo.previousTherapy}
                        onCheckedChange={(checked) => 
                          handleInputChange('previousTherapy', checked, 'mentalHealthInfo')
                        }
                      />
                      <span className="text-sm">I have received therapy/counseling before</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <Checkbox
                        checked={profileData.mentalHealthInfo.currentMedication}
                        onCheckedChange={(checked) => 
                          handleInputChange('currentMedication', checked, 'mentalHealthInfo')
                        }
                      />
                      <span className="text-sm">I am currently taking medication for mental health</span>
                    </label>
                  </div>

                  {profileData.mentalHealthInfo.currentMedication && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medication Details (Optional)
                      </label>
                      <Textarea
                        placeholder="Please list your current medications (this helps your counselor provide better care)"
                        value={profileData.mentalHealthInfo.medicationDetails}
                        onChange={(e) => handleInputChange('medicationDetails', e.target.value, 'mentalHealthInfo')}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={loading}
                >
                  Previous
                </Button>
              )}
              
              <div className="ml-auto">
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving Profile...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Complete Profile
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCompletionPage;