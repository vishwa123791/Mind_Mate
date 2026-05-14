import React, { useState } from 'react';
import { Eye, EyeOff, Heart, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    console.log('🔑 Starting login process...');

    try {
      const requestPayload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      console.log('📤 Sending login request for:', requestPayload.email);

      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      
      console.log('📨 Login response:', { 
        ok: response.ok, 
        status: response.status, 
        hasUser: !!data.user,
        hasToken: !!data.token 
      });

      if (response.ok && data.success && data.user && data.token) {
        console.log('✅ Login successful for:', data.user.email);
        
        // Use the login function from context
        const loginResult = login(data.user, data.token);
        
        if (loginResult.success) {
          // Clear form
          setFormData({ email: "", password: "" });
          setError('');
          
          // Navigate to homepage
          console.log('🏠 Redirecting to homepage...');
          navigate('/', { replace: true });
        } else {
          setError('Failed to save login data. Please try again.');
        }
        
      } else {
        console.log('❌ Login failed:', data.message);
        
        if (response.status === 401) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (response.status === 404) {
          setError('No account found with this email. Please sign up first.');
        } else if (response.status === 400) {
          setError(data.message || 'Please check your input and try again.');
        } else {
          setError(data.message || 'Login failed. Please try again.');
        }
      }
      
    } catch (error) {
      console.error('💥 Login error:', error);
      
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please make sure the server is running and try again.');
      } else {
        setError(error.message || 'Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Login process completed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 right-20 text-white/30 animate-bounce" style={{animationDuration: '6s'}}>
          <Heart size={40} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center text-white">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
              <Heart size={60} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Your Mental Wellness Journey
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-md">
              Access compassionate support, professional guidance, and a community that understands your journey to better mental health.
            </p>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>24/7 AI support and guidance</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
              <span>Professional therapy sessions</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '700ms'}}></div>
              <span>Safe community support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')} 
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          {/* Mobile Hero Header (visible only on mobile) */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Heart size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">MindCare</h1>
            <p className="text-muted-foreground">Your mental wellness companion</p>   
          </div>

            {/* Login Form */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Welcome Back
                </h2>
                <p className="text-muted-foreground">Sign in to continue your wellness journey</p>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 hover:shadow-md bg-card text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 hover:shadow-md bg-card text-foreground placeholder:text-muted-foreground"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 focus:ring-4 focus:ring-ring/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Footer Links */}
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
              <Link 
                to="/forgot-password" 
                className="block text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;