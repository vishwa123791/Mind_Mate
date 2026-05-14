import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft, Shield, RotateCw } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mathCaptcha, setMathCaptcha] = useState({ question: "", answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth(); // Use register instead of login
  const navigate = useNavigate();

  // Generate math captcha
  const generateMathCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer;
    if (operator === '+') {
      answer = num1 + num2;
    } else {
      answer = num1 - num2;
    }
    
    setMathCaptcha({
      question: `${num1} ${operator} ${num2} = ?`,
      answer: answer
    });
    setUserAnswer("");
  };

  React.useEffect(() => {
    generateMathCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Check if email exists
  const checkEmailExists = async (email) => {
    try {
      console.log('📧 Checking if email exists:', email);
      
      const response = await fetch('http://localhost:5002/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('📧 Email check result:', { exists: data.exists });
      
      return data.exists;
    } catch (error) {
      console.error('📧 Error checking email:', error);
      // In case of error, assume email doesn't exist to allow signup attempt
      return false;
    }
  };

  // Form validation
  const validateForm = async () => {
    setError('');

    // Validate name
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }

    // Validate email
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      setError('An account with this email already exists. Please login instead.');
      return false;
    }

    // Validate password
    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Validate captcha
    if (parseInt(userAnswer) !== mathCaptcha.answer) {
      setError('Please solve the math problem correctly');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    console.log('🚀 Starting signup process...');

    try {
      const requestPayload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      console.log('📤 Sending signup request for:', requestPayload.email);

      const response = await fetch('http://localhost:5002/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      
      console.log('📨 Signup response:', { 
        ok: response.ok, 
        status: response.status, 
        hasUser: !!data.user,
        hasToken: !!data.token 
      });
      
      if (response.ok && data.success && data.user && data.token) {
        console.log('✅ Signup successful for:', data.user.email);
        
        // Use the register function from context
        const registerResult = register(data.user, data.token);
        
        if (registerResult.success) {
          // Clear form
          setFormData({ name: "", email: "", password: "" });
          setUserAnswer("");
          setError('');
          
          // Navigate to homepage
          console.log('🏠 Redirecting to homepage...');
          navigate('/', { replace: true });
        } else {
          setError('Failed to save registration data. Please try again.');
        }
        
      } else {
        console.log('❌ Signup failed:', data.message);
        
        if (response.status === 409) {
          setError('An account with this email already exists. Please try logging in instead.');
        } else if (response.status === 400) {
          setError(data.message || 'Please check your input and try again.');
        } else {
          setError(data.message || 'Signup failed. Please try again.');
        }
      }
      
    } catch (error) {
      console.error('💥 Signup error:', error);
      
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please make sure the server is running and try again.');
      } else {
        setError(error.message || 'Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Signup process completed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden flex items-center justify-center p-8 lg:p-12">
        {/* Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 md:px-12 max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <User size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            Start Your Wellness Journey
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed">
            Join a supportive community focused on mental health, professional guidance, and personal growth.
          </p>
          <div className="space-y-3 text-left text-sm md:text-base">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/80">24/7 AI support and guidance</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/80">Professional therapy sessions</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/80">Safe community support</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 bg-background flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')} 
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🧠</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
            <div className="text-primary font-semibold text-lg mb-1">MindCare</div>
            <p className="text-muted-foreground">Join the wellness community</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-foreground font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-card text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-foreground font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-card text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-foreground font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-card text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Math Captcha */}
              <div>
                <label className="block text-foreground font-medium mb-2 flex items-center gap-2">
                  <Shield size={16} className="text-primary" />
                  Security Question
                </label>
                <div className="flex items-center gap-3">
                  <div className="bg-muted border border-input px-4 py-3 rounded-lg font-mono text-lg text-foreground">
                    {mathCaptcha.question}
                  </div>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Answer"
                    className="w-24 px-3 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-card text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateMathCaptcha}
                    className="p-2 text-muted-foreground hover:text-foreground border border-input rounded-lg hover:bg-muted transition-colors"
                    title="Generate new question"
                  >
                    <RotateCw size={16} />
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || !userAnswer}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : (
                  "Join MindCare"
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;