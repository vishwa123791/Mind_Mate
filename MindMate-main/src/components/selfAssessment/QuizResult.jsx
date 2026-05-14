import React from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft, 
  Repeat,
  Users,
  Lightbulb,
  Heart,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';

function QuizResult() {
  const location = useLocation();
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  
  const { score, maxScore, percentage, answers, quiz, assessmentType } = location.state || {};

  // If no data, redirect back
  if (!score && score !== 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Results Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Unable to load assessment results. Please take the assessment again.
          </p>
          <Link 
            to="/self-assessment"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  // Determine severity based on percentage
  const getSeverity = (percentage) => {
    if (percentage <= 25) return 'low';
    if (percentage <= 60) return 'moderate';
    return 'high';
  };

  const severity = getSeverity(percentage);

  // Get recommendations based on assessment type and severity
  const getRecommendations = (assessmentType, severity) => {
    const recommendations = {
      depression: {
        low: [
          'Continue with healthy habits like regular exercise and good sleep',
          'Stay connected with supportive friends and family',
          'Practice gratitude and mindfulness exercises',
          'Monitor your mood and seek help if symptoms worsen'
        ],
        moderate: [
          'Consider speaking with a counselor or therapist',
          'Establish a daily routine with physical activity',
          'Practice self-care activities you enjoy',
          'Reach out to trusted friends or support groups'
        ],
        high: [
          'Strongly consider professional help from a mental health provider',
          'Contact a crisis helpline if you have thoughts of self-harm',
          'Reach out to trusted friends, family, or support groups immediately',
          'Consider calling 988 (Suicide & Crisis Lifeline) if needed'
        ]
      },
      anxiety: {
        low: [
          'Practice deep breathing and relaxation techniques',
          'Maintain regular exercise and good sleep habits',
          'Limit caffeine and practice stress management',
          'Stay aware of your triggers and coping strategies'
        ],
        moderate: [
          'Consider learning more anxiety management techniques',
          'Practice mindfulness and meditation regularly',
          'Consider talking to a counselor about your anxiety',
          'Join a support group or find others who understand'
        ],
        high: [
          'Consider professional treatment from a mental health provider',
          'Learn and practice anxiety management techniques daily',
          'Consider whether medication might be helpful',
          'Avoid isolation and maintain social connections'
        ]
      },
      stress: {
        low: [
          'Continue your current stress management practices',
          'Maintain work-life balance and regular relaxation',
          'Keep up with healthy lifestyle habits',
          'Stay aware of stress levels and early warning signs'
        ],
        moderate: [
          'Implement better time management and organization',
          'Practice regular relaxation and stress-reduction techniques',
          'Consider what stressors you can reduce or eliminate',
          'Make sure you\'re getting adequate rest and recreation'
        ],
        high: [
          'Take immediate steps to reduce your stress load',
          'Consider professional help for stress management',
          'Prioritize self-care and say no to additional stressors',
          'Talk to someone about what\'s causing your stress'
        ]
      },
      'social-media': {
        low: [
          'Continue being mindful of your social media usage',
          'Maintain healthy boundaries with technology',
          'Focus on real-world connections and activities',
          'Keep following accounts that inspire and uplift you'
        ],
        moderate: [
          'Set daily time limits for social media apps',
          'Turn off non-essential notifications',
          'Unfollow accounts that make you feel bad about yourself',
          'Practice taking regular breaks from social media'
        ],
        high: [
          'Consider taking a social media break or detox',
          'Strictly limit your daily usage time',
          'Focus on real-world relationships and activities',
          'Consider talking to someone about your relationship with social media'
        ]
      },
      'self-esteem': {
        low: [
          'Continue practicing self-acceptance and self-compassion',
          'Maintain positive relationships that support you',
          'Celebrate your achievements, both big and small',
          'Keep focusing on your strengths and growth'
        ],
        moderate: [
          'Practice daily positive self-affirmations',
          'Keep a journal of your accomplishments and positive qualities',
          'Surround yourself with supportive and encouraging people',
          'Consider working on specific self-esteem building activities'
        ],
        high: [
          'Consider working with a therapist on self-esteem issues',
          'Challenge negative self-talk patterns actively',
          'Focus on your strengths and past achievements',
          'Consider joining a support group or finding others with similar experiences'
        ]
      },
      sleep: {
        low: [
          'Continue with your current good sleep habits',
          'Maintain a regular bedtime routine',
          'Keep your sleep environment comfortable',
          'Stay aware of factors that might affect your sleep'
        ],
        moderate: [
          'Implement better sleep hygiene practices',
          'Keep a consistent sleep schedule, even on weekends',
          'Limit screen time before bed',
          'Create a relaxing bedtime routine'
        ],
        high: [
          'Consider consulting with a sleep specialist or doctor',
          'Establish a strict bedtime routine and sleep schedule',
          'Address any underlying stress or anxiety affecting sleep',
          'Consider whether your sleep environment needs improvement'
        ]
      }
    };

    return recommendations[assessmentType]?.[severity] || recommendations.depression[severity];
  };

  const recommendations = getRecommendations(assessmentType, severity);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'moderate':
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      case 'high':
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return <CheckCircle className="w-12 h-12 text-green-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-400';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400';
      default:
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400';
    }
  };

  const getSeverityMessage = (severity) => {
    switch (severity) {
      case 'low':
        return 'Your responses suggest minimal concerns in this area. Keep up the good work!';
      case 'moderate':
        return 'Your responses suggest some concerns that may benefit from attention and care.';
      case 'high':
        return 'Your responses suggest significant concerns. Consider reaching out for professional support.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Assessment Complete
          </h1>
          <p className="text-xl text-muted-foreground">
            {quiz?.title || `${assessmentType?.charAt(0).toUpperCase() + assessmentType?.slice(1)} Assessment`}
          </p>
          <div className="flex items-center justify-center text-sm text-muted-foreground mt-2">
            <Calendar className="w-4 h-4 mr-2" />
            Completed on {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden mb-8">
          <div className="p-8">
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                {getSeverityIcon(severity)}
              </div>
              
              <div className="mb-4">
                <div className="text-6xl font-bold text-foreground mb-2">
                  {score}<span className="text-2xl text-muted-foreground">/{maxScore}</span>
                </div>
                <div className="text-2xl font-semibold text-muted-foreground">
                  {percentage}% Score
                </div>
              </div>

              <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold border ${getSeverityColor(severity)}`}>
                <TrendingUp className="w-5 h-5 mr-2" />
                {severity.charAt(0).toUpperCase() + severity.slice(1)} Level
              </div>

              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                {getSeverityMessage(severity)}
              </p>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
                Recommendations
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link 
            to="/self-assessment"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Repeat className="w-4 h-4 mr-2" />
            Take Another Assessment
          </Link>
          
          <Link 
            to="/peer-support"
            className="inline-flex items-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
          >
            <Users className="w-4 h-4 mr-2" />
            Find Support
          </Link>

          <button
            onClick={() => navigate(`/assessment/${assessmentId}`)}
            className="inline-flex items-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retake Assessment
          </button>
        </div>

        {/* Crisis Support */}
        {severity === 'high' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6">
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
                Need Immediate Help?
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-6">
                If you're experiencing thoughts of self-harm or are in crisis, please reach out for immediate help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:988"
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Call 988 - Crisis Lifeline
                </a>
                <a
                  href="tel:911"
                  className="inline-flex items-center px-6 py-3 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-900 transition-colors"
                >
                  Emergency: 911
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizResult;