import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  MoreVertical, 
  Shield, 
  Phone, 
  Star,
  AlertCircle,
  Clock
} from 'lucide-react';

function PeerChatPage() {
  const { volunteerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [volunteer, setVolunteer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatRoomId, setChatRoomId] = useState(location.state?.chatRoomId);
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchVolunteer();
    if (chatRoomId) {
      fetchMessages();
      // Set up polling for new messages
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [volunteerId, chatRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchVolunteer = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.log('❌ No auth token found');
        navigate('/login');
        return;
      }

      console.log('🔍 Fetching volunteer:', volunteerId);
      const response = await fetch(`http://localhost:5002/api/peer-support/volunteers/${volunteerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setVolunteer(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        console.error('❌ API response not ok:', response.status);
        // Use fallback from location state
        if (location.state?.volunteer) {
          setVolunteer(location.state.volunteer);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching volunteer:', error);
      // Use fallback volunteer data
      if (location.state?.volunteer) {
        setVolunteer(location.state.volunteer);
      } else {
        // Create a mock volunteer
        setVolunteer({
          id: volunteerId,
          name: 'Support Volunteer',
          avatar: '/placeholder-user.jpg',
          bio: 'Here to help you through your challenges.',
          specialties: ['General Support'],
          isOnline: true
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!chatRoomId) return;
    
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;

      const response = await fetch(`http://localhost:5002/api/peer-support/chat/${chatRoomId}/messages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.messages) {
          setMessages(result.data.messages);
        }
      } else {
        console.log('❌ Failed to fetch messages, using local state');
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      // Continue with local messages
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isTyping) return;

    // If no chat room exists, create one first
    if (!chatRoomId) {
      try {
        const response = await fetch('http://localhost:5002/api/peer-support/start-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ 
            volunteerId: parseInt(volunteerId), 
            message: newMessage.trim() 
          })
        });

        if (!response.ok) {
          throw new Error('Failed to start chat');
        }

        const data = await response.json();
        setChatRoomId(data.data.chatRoomId);
        setNewMessage('');
        fetchMessages();
        return;
      } catch (error) {
        console.error('Error starting chat:', error);
        return;
      }
    }

    // Send message to existing chat
    try {
      setIsTyping(true);
      const response = await fetch(`http://localhost:5002/api/peer-support/chat/${chatRoomId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ message: newMessage.trim() })
      });

      if (response.ok) {
        setNewMessage('');
        setTimeout(() => {
          fetchMessages();
          setIsTyping(false);
        }, 1000);
      } else {
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const endChat = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/peer-support/chat/${chatRoomId}/end`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ rating, feedback })
      });

      if (response.ok) {
        navigate('/peer-support');
      }
    } catch (error) {
      console.error('Error ending chat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Volunteer Not Found</h2>
          <Link 
            to="/peer-support"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Back to Peer Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/peer-support')}
              className="mr-4 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={volunteer.avatar}
                  alt={volunteer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  volunteer.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              
              <div className="ml-3">
                <h2 className="font-semibold text-foreground">
                  {volunteer.name}
                </h2>
                <div className="flex items-center text-sm text-muted-foreground">
                  {volunteer.isOnline ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Available now
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 mr-1" />
                      Offline
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span>{volunteer.rating}</span>
            </div>
            
            <button 
              onClick={() => setShowEndChatModal(true)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center mb-8">
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border max-w-2xl mx-auto">
                <img
                  src={volunteer.avatar}
                  alt={volunteer.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Welcome to your chat with {volunteer.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {volunteer.bio}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {volunteer.specialties.map(specialty => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isUser = message.senderId !== `volunteer_${volunteerId}`;
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    isUser
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={sendMessage} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isTyping}
              className="flex-1 px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-700 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-start space-x-3">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <strong>Safety Reminder:</strong> If you're experiencing thoughts of self-harm, 
              please contact emergency services (911) or the National Suicide Prevention Lifeline (988) immediately.
            </p>
          </div>
        </div>
      </div>

      {/* End Chat Modal */}
      {showEndChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              End Chat Session
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                How would you rate this session?
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-8 h-8 ${
                      star <= rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    <Star className="w-full h-full" fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Any feedback for {volunteer.name}?
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Optional feedback..."
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                rows="3"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowEndChatModal(false)}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={endChat}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PeerChatPage;