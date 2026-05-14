import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function QuizPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, [assessmentId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5002/api/assessments/${assessmentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load assessment');
      }

      const data = await response.json();
      setQuiz(data.data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Failed to load assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const goToNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((score, answer) => {
      if (answer === 'yes') return score + 1;
      if (answer === 'sometimes') return score + 0.5;
      return score;
    }, 0);
  };

  const submitQuiz = async () => {
    try {
      setSubmitting(true);
      
      // Calculate the score
      const score = Object.values(answers).reduce((total, answer) => {
        return total + (answer === 'often' ? 2 : answer === 'sometimes' ? 1 : 0);
      }, 0);

      console.log('Submitting assessment:', {
        assessmentId,
        answers: Object.values(answers),
        score
      });

      const response = await fetch('http://localhost:5002/api/assessments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          assessmentId: assessmentId,
          answers: Object.values(answers),
          score: score
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Failed to submit assessment: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response data:', data);
      
      if (data.success && data.data) {
        console.log('Navigating with result data:', data.data);
        
        // Navigate with the result data in state
        navigate(`/assessment-result/${data.data.id}`, { 
          replace: true, // Use replace to avoid back button issues
          state: { 
            result: {
              id: data.data.id,
              assessmentType: data.data.assessmentType,
              score: data.data.score,
              severity: data.data.severity,
              recommendations: data.data.recommendations,
              completedAt: data.data.completedAt
            },
            quizTitle: quiz?.title || `${assessmentId.charAt(0).toUpperCase() + assessmentId.slice(1)} Assessment`,
            quizCategory: assessmentId
          } 
        });
      } else {
        console.error('Invalid response structure:', data);
        throw new Error(data.message || 'Failed to submit assessment');
      }
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError(`Failed to submit assessment: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Assessment Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => navigate('/self-assessment')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Assessment not found</p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const allQuestionsAnswered = quiz.questions.every(q => answers[q.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/self-assessment')}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Assessments
          </button>
          
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {quiz.title}
            </h1>
            <p className="text-muted-foreground mb-4">
              {quiz.description || `Assessment for ${quiz.category}`}
            </p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {quiz.questions[currentQuestion].text}
          </h2>

          <div className="space-y-3">
            {['yes', 'sometimes', 'no'].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(quiz.questions[currentQuestion].id, option)}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  answers[quiz.questions[currentQuestion].id] === option
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                    answers[quiz.questions[currentQuestion].id] === option
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}>
                    {answers[quiz.questions[currentQuestion].id] === option && (
                      <div className="w-full h-full rounded-full bg-white transform scale-50" />
                    )}
                  </div>
                  <span className="font-medium capitalize">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
            className="inline-flex items-center px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={submitQuiz}
              disabled={!allQuestionsAnswered || submitting}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Assessment
                </>
              )}
            </button>
          ) : (
            <button
              onClick={goToNext}
              disabled={!answers[quiz.questions[currentQuestion].id]}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>

        {/* Question indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {quiz.questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentQuestion
                  ? 'bg-primary scale-125'
                  : answers[quiz.questions[index].id]
                  ? 'bg-primary/60'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;