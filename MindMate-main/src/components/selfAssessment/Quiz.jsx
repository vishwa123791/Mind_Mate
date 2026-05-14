import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

function Quiz() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz data - stored locally instead of backend
  const quizData = {
    depression: {
      id: 'depression',
      title: 'Depression Assessment',
      description: 'This assessment helps identify symptoms of depression',
      questions: [
        { id: 1, text: 'Little interest or pleasure in doing things?' },
        { id: 2, text: 'Feeling down, depressed, or hopeless?' },
        { id: 3, text: 'Trouble falling or staying asleep, or sleeping too much?' },
        { id: 4, text: 'Feeling tired or having little energy?' },
        { id: 5, text: 'Poor appetite or overeating?' },
        { id: 6, text: 'Feeling bad about yourself or that you are a failure?' },
        { id: 7, text: 'Trouble concentrating on things?' },
        { id: 8, text: 'Moving or speaking slowly, or being restless?' },
        { id: 9, text: 'Thoughts that you would be better off dead?' }
      ]
    },
    anxiety: {
      id: 'anxiety',
      title: 'Anxiety Assessment',
      description: 'This assessment evaluates anxiety symptoms',
      questions: [
        { id: 1, text: 'Feeling nervous, anxious, or on edge?' },
        { id: 2, text: 'Not being able to stop or control worrying?' },
        { id: 3, text: 'Worrying too much about different things?' },
        { id: 4, text: 'Trouble relaxing?' },
        { id: 5, text: 'Being so restless that it is hard to sit still?' },
        { id: 6, text: 'Becoming easily annoyed or irritable?' },
        { id: 7, text: 'Feeling afraid as if something awful might happen?' }
      ]
    },
    stress: {
      id: 'stress',
      title: 'Stress Assessment',
      description: 'Evaluate your current stress levels',
      questions: [
        { id: 1, text: 'How often have you been upset because of unexpected events?' },
        { id: 2, text: 'How often have you felt unable to control important things in your life?' },
        { id: 3, text: 'How often have you felt nervous and stressed?' },
        { id: 4, text: 'How often have you felt confident about handling personal problems?' },
        { id: 5, text: 'How often have you felt that things were going your way?' },
        { id: 6, text: 'How often have you found that you could not cope with things you had to do?' },
        { id: 7, text: 'How often have you been able to control irritations in your life?' },
        { id: 8, text: 'How often have you felt on top of things?' },
        { id: 9, text: 'How often have you been angered by things outside of your control?' },
        { id: 10, text: 'How often have you felt difficulties were piling up so high that you could not overcome them?' }
      ]
    },
    'social-media': {
      id: 'social-media',
      title: 'Social Media Impact Assessment',
      description: 'Assess how social media affects your wellbeing',
      questions: [
        { id: 1, text: 'Do you spend more time on social media than you intended?' },
        { id: 2, text: 'Do you feel anxious when you can\'t check social media?' },
        { id: 3, text: 'Do you compare yourself to others on social media?' },
        { id: 4, text: 'Does social media make you feel worse about your life?' },
        { id: 5, text: 'Do you check social media first thing in the morning?' },
        { id: 6, text: 'Do you use social media to avoid real-world problems?' },
        { id: 7, text: 'Has social media affected your sleep or productivity?' },
        { id: 8, text: 'Do you feel like you need to post constantly to feel validated?' }
      ]
    },
    'self-esteem': {
      id: 'self-esteem',
      title: 'Self-Esteem Assessment',
      description: 'Evaluate your self-worth and confidence',
      questions: [
        { id: 1, text: 'Do you feel satisfied with yourself?' },
        { id: 2, text: 'Do you sometimes think you are no good at all?' },
        { id: 3, text: 'Do you feel that you have good qualities?' },
        { id: 4, text: 'Are you able to do things as well as most other people?' },
        { id: 5, text: 'Do you feel you do not have much to be proud of?' },
        { id: 6, text: 'Do you sometimes feel useless?' },
        { id: 7, text: 'Do you feel that you\'re a person of worth?' },
        { id: 8, text: 'Do you wish you could have more respect for yourself?' },
        { id: 9, text: 'Do you tend to think you are a failure?' },
        { id: 10, text: 'Do you take a positive attitude toward yourself?' }
      ]
    },
    sleep: {
      id: 'sleep',
      title: 'Sleep Quality Assessment',
      description: 'Analyze your sleep patterns and quality',
      questions: [
        { id: 1, text: 'Do you have trouble falling asleep?' },
        { id: 2, text: 'Do you wake up frequently during the night?' },
        { id: 3, text: 'Do you wake up too early and can\'t get back to sleep?' },
        { id: 4, text: 'Do you feel tired during the day?' },
        { id: 5, text: 'Does your sleep problem affect your daily activities?' },
        { id: 6, text: 'Do you worry about your sleep?' },
        { id: 7, text: 'Do you use your phone or screen devices before bed?' },
        { id: 8, text: 'Do you feel rested when you wake up?' }
      ]
    }
  };

  const answerOptions = [
    { value: 'never', label: 'Never', score: 0 },
    { value: 'sometimes', label: 'Sometimes', score: 1 },
    { value: 'often', label: 'Often', score: 2 },
    { value: 'always', label: 'Always', score: 3 }
  ];

  useEffect(() => {
    console.log('Assessment ID from params:', assessmentId);
    console.log('Available quiz data:', Object.keys(quizData));
    
    if (assessmentId && quizData[assessmentId]) {
      console.log('Setting quiz data for:', assessmentId);
      setQuiz(quizData[assessmentId]);
      setLoading(false);
    } else {
      console.log('Assessment ID not found, redirecting...');
      navigate('/self-assessment');
    }
  }, [assessmentId, navigate]);

  const handleAnswerSelect = (questionId, answerValue) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerValue
    }));
  };

  const nextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeAssessment = () => {
    if (!quiz) return;
    
    // Calculate score
    const score = Object.values(answers).reduce((total, answer) => {
      const answerObj = answerOptions.find(opt => opt.value === answer);
      return total + (answerObj ? answerObj.score : 0);
    }, 0);

    const maxScore = quiz.questions.length * 3; // Max score is 3 per question
    const percentage = Math.round((score / maxScore) * 100);

    // Navigate to results with score data
    navigate(`/assessment-result/${assessmentId}`, {
      state: {
        score,
        maxScore,
        percentage,
        answers,
        quiz,
        assessmentType: assessmentId
      }
    });
  };

  const isCurrentQuestionAnswered = () => {
    if (!quiz || !quiz.questions[currentQuestion]) return false;
    return answers[quiz.questions[currentQuestion].id] !== undefined;
  };

  // Add null checks for all quiz-dependent calculations
  const progress = quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;
  const answeredQuestions = Object.keys(answers).length;

  if (loading || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Additional safety check
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Assessment not available</p>
          <button
            onClick={() => navigate('/self-assessment')}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/self-assessment')}
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessments
            </button>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{quiz.title}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Over the last 2 weeks, how often have you been bothered by:
            </h2>
            <p className="text-xl text-foreground font-medium">
              {currentQuestionData.text}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {answerOptions.map((option) => {
              const isSelected = answers[currentQuestionData.id] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(currentQuestionData.id, option.value)}
                  className={`w-full p-4 text-left border rounded-lg transition-all duration-200 hover:border-primary/50 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 text-primary font-medium' 
                      : 'border-border bg-background text-foreground'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      isSelected 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground'
                    }`}>
                      {isSelected && (
                        <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    {option.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="inline-flex items-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={completeAssessment}
              disabled={answeredQuestions < quiz.questions.length}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Assessment
              <Target className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!isCurrentQuestionAnswered()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {answeredQuestions} of {quiz.questions.length} questions answered
          </p>
        </div>
      </div>
    </div>
  );
}

export default Quiz;