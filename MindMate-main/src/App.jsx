import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navigation } from './pages/Navigation'
import { HomePage } from './pages/HomePage'
import { ChatPage } from './pages/ChatPage'
import  BookingPage from './pages/BookingPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { ForumPage } from './pages/ForumPage'
import SelfAssessmentHome from './components/selfAssessment/SelfAssessmentHome'
import Quiz from './components/selfAssessment/Quiz'
import QuizResult from './components/selfAssessment/QuizResult'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import PeerSupportPage from './pages/PeerSupportPage'    
import PeerChatPage from './pages/PeerChatPage'
import { VideoResourcesPage } from './pages/VideoResourcesPage'
import BlogPage from './pages/BlogPage'
import BlogPost from './components/blog/BlogPost'
import ProfileCompletionPage from './pages/ProfileCompletionPage'
import Admin from '../src/pages/Admin';

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/booking" 
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resources" 
                element={
                  <ProtectedRoute>
                    <ResourcesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resources/videos" 
                element={
                  <ProtectedRoute>
                    <VideoResourcesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/forum" 
                element={
                  <ProtectedRoute>
                    <ForumPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/self-assessment" 
                element={
                  <ProtectedRoute>
                    <SelfAssessmentHome />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessment/:assessmentId" 
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessment-result/:assessmentId" 
                element={
                  <ProtectedRoute>
                    <QuizResult />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/peer-support" 
                element={
                  <ProtectedRoute>
                    <PeerSupportPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/peer-chat/:volunteerId" 
                element={
                  <ProtectedRoute>
                    <PeerChatPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resources/blog" 
                element={
                  <ProtectedRoute>
                    <BlogPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resources/blog/:id" 
                element={
                  <ProtectedRoute>
                    <BlogPost />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile-completion" 
                element={<ProfileCompletionPage />} 
              />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
