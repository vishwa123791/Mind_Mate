import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Heart, 
  Zap, 
  Clock, 
  Target,
  ChevronRight,
  BookOpen,
  Users,
  Award,
  Phone  // Added Phone import
} from 'lucide-react';

function SelfAssessmentHome() {
  const assessments = [
    {
      id: 'depression',
      title: 'Depression Screening',
      description: 'Assess symptoms of depression and mood changes over the past two weeks',
      category: 'Mood',
      color: 'from-blue-500 to-blue-600',
      icon: Brain,
      image: '/self assesment/depression.png',
      estimatedTime: '5-7 minutes',
      questions: 9
    },
    {
      id: 'anxiety',
      title: 'Anxiety Assessment',
      description: 'Evaluate generalized anxiety symptoms and worry patterns',
      category: 'Anxiety',
      color: 'from-green-500 to-green-600',
      icon: Zap,
      image: '/self assesment/Anxiety3.png',
      estimatedTime: '4-6 minutes',
      questions: 7
    },
    {
      id: 'stress',
      title: 'Stress Level Check',
      description: 'Measure your current stress levels and coping mechanisms',
      category: 'Stress',
      color: 'from-yellow-500 to-orange-500',
      icon: Target,
      image: '/self assesment/stress.png',
      estimatedTime: '3-5 minutes',
      questions: 10
    },
    {
      id: 'social-media',
      title: 'Social Media Impact',
      description: 'Assess how social media affects your mental wellbeing',
      category: 'Digital Wellness',
      color: 'from-purple-500 to-purple-600',
      icon: Users,
      image: '/self assesment/social media.png',
      estimatedTime: '4-6 minutes',
      questions: 8
    },
    {
      id: 'self-esteem',
      title: 'Self-Esteem Assessment',
      description: 'Evaluate your self-worth and confidence levels',
      category: 'Self-Image',
      color: 'from-pink-500 to-rose-500',
      icon: Heart,
      image: '/self assesment/selfesteem.png',
      estimatedTime: '5-7 minutes',
      questions: 10
    },
    {
      id: 'sleep',
      title: 'Sleep Quality Assessment',
      description: 'Analyze your sleep patterns and quality of rest',
      category: 'Sleep',
      color: 'from-indigo-500 to-indigo-600',
      icon: Clock,
      image: '/self assesment/sleep.png',
      estimatedTime: '3-5 minutes',
      questions: 8
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Hero Image */}
        <div className="text-center mb-12">
          {/* Hero Image */}
          <div className="relative w-full max-w-4xl mx-auto mb-8">
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/mental health photos.zip/student-mental-health-hero.jpeg"
                alt="Mental Health Assessment"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/mental health photos.zip/mentalhealth.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Mental Health Self-Assessment
                </h1>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Take a moment to check in with yourself. These brief, confidential assessments can help you 
            understand your mental health and identify areas where you might benefit from additional support.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex items-start space-x-3">
            <Award className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Important Information
              </h3>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• These assessments are for educational and self-awareness purposes only</li>
                <li>• They are not diagnostic tools and cannot replace professional evaluation</li>
                <li>• If you're experiencing thoughts of self-harm, please seek immediate help</li>
                <li>• Your responses are private and stored locally on your device</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {assessments.map((assessment) => {
            const IconComponent = assessment.icon;
            return (
              <div 
                key={assessment.id}
                className="group bg-card rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-[1.02]"
              >
                {/* Assessment Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={assessment.image}
                    alt={assessment.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-white/90 text-gray-800 rounded-full backdrop-blur-sm">
                      {assessment.category}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute bottom-3 right-3">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${assessment.color} shadow-lg`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {assessment.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {assessment.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {assessment.estimatedTime}
                    </div>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      {assessment.questions} questions
                    </div>
                  </div>

                  <Link
                    to={`/assessment/${assessment.id}`}
                    className="inline-flex items-center w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 group-hover:shadow-sm justify-center group-hover:from-primary/90 group-hover:to-secondary/90"
                  >
                    Start Assessment
                    <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resources Section with Background Image */}
        <div className="relative bg-card rounded-xl overflow-hidden shadow-sm border border-border">
          <div className="absolute inset-0">
            <img
              src="/mental health photos.zip/strategies-to-prioritize-student-mental-health-2.png"
              alt="Mental Health Support"
              className="w-full h-full object-cover opacity-10"
              onError={(e) => {
                e.target.src = "/mental health photos.zip/Student-Well-being_-Balancing-Academics-and-Mental-Health-930x560.png";
              }}
            />
            <div className="absolute inset-0 bg-card/90"></div>
          </div>
          
          <div className="relative p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Need Additional Support?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Remember that self-assessment is just the first step. Professional support 
              is available if you need someone to talk to.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/peer-support"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <Users className="w-5 h-5 mr-2" />
                Find Peer Support
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Resources
              </Link>
            </div>
          </div>
        </div>

        {/* Crisis Support Banner */}
        <div className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-800 mx-auto mb-4">
            <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
            Crisis Support Available 24/7
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            If you're having thoughts of self-harm or suicide, please reach out immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:988"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 988 - Crisis Lifeline
            </a>
            <a
              href="sms:741741"
              className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium text-sm"
            >
              Text HOME to 741741
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelfAssessmentHome;