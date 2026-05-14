import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"

export function ChatPage() {
  const iframeRef = useRef(null)
  const [chatStarted, setChatStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Your Botpress webchat configuration URL
  const BOTPRESS_WEBCHAT_URL = "https://cdn.botpress.cloud/webchat/v3.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/09/24/08/20250924085045-XG15E0YL.json"

  useEffect(() => {
    // Ensure iframe loads properly when chat is started
    if (chatStarted && iframeRef.current) {
      setIsLoading(true)
      iframeRef.current.src = BOTPRESS_WEBCHAT_URL
    }
  }, [chatStarted])

  const handleStartChat = () => {
    setChatStarted(true)
  }

  const handleIframeLoad = () => {
    // Hide loading overlay after iframe loads
    setTimeout(() => {
      setIsLoading(false)
    }, 1500) // Give extra time to ensure chat is fully loaded
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-teal-800">
            Chat Support
          </h1>
          <p className="text-xl text-teal-600 max-w-2xl mx-auto">
            Connect with our AI assistant for immediate emotional support and guidance
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!chatStarted ? (
            // Start Chat Card
            <Card className="border-teal-200 shadow-lg">
              <CardHeader className="bg-teal-50 border-b border-teal-200 text-center">
                <CardTitle className="text-teal-800 text-2xl">Welcome to Mental Health Support</CardTitle>
                <CardDescription className="text-teal-600 text-lg">
                  Your privacy is protected. This conversation is confidential and secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-4">
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-teal-800 mb-2">What to Expect</h3>
                    <ul className="text-teal-700 space-y-2 text-left">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                        Compassionate AI support available 24/7
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                        Private and confidential conversations
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                        Immediate emotional support and guidance
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                        Resources for mental wellness
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Remember</h3>
                    <p className="text-blue-700 text-sm">
                      This AI assistant provides support and guidance, but is not a replacement for professional medical care. 
                      If you're experiencing a crisis, please contact emergency services or the resources below.
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleStartChat}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Chat Interface
            <Card className="h-[600px] border-teal-200 shadow-lg">
              <CardHeader className="bg-teal-50 border-b border-teal-200">
                <CardTitle className="text-teal-800">Mental Health Support Chat</CardTitle>
                <CardDescription className="text-teal-600">
                  Your privacy is protected. This conversation is confidential and secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 h-[620px]">
                {/* Embedded Botpress Webchat with padding for better spacing */}
                <div className="h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-0 rounded-lg"
                    title="Mental Health Support Chat"
                    allow="microphone; camera"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                    onLoad={handleIframeLoad}
                  />
                  
                  {/* Loading Overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-white rounded-lg flex flex-col items-center justify-center z-10">
                      <div className="space-y-4 text-center">
                        {/* Loading Spinner */}
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        
                        {/* Loading Text */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-teal-800">Connecting you to support...</h3>
                          <p className="text-teal-600 text-sm">Preparing your private conversation space</p>
                        </div>
                        
                        {/* Loading Dots Animation */}
                        <div className="flex space-x-1 justify-center">
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Crisis Resources */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                🚨 Crisis Resources
              </CardTitle>
              <CardDescription className="text-red-700">
                If you're experiencing a mental health crisis, please reach out immediately:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-800">National Crisis Hotline</h4>
                  <p className="text-red-700">988 - Available 24/7</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-800">Crisis Text Line</h4>
                  <p className="text-red-700">Text HOME to 741741</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}