import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { useAuth } from "../context/AuthContext"
import { User, LogOut, Settings, Menu, X, Shield } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
  }

  const navItems = [
    { name: 'Self Assessment', href: '/self-assessment' },
    { name: 'Peer Support', href: '/peer-support' },
    { name: 'AI Support', href: '/chat' },
    { name: 'Book Session', href: '/booking' },
    { name: 'Resources', href: '/resources' },
    { name: 'Community', href: '/forum' },
    {
      name: 'Admin',
      href: '/admin',
      icon: Shield,
      requiresAuth: true,
      adminOnly: true
    }
  ]

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="font-semibold text-xl text-foreground">MindCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              // Skip admin-only items for non-admin users
              if (item.adminOnly && user?.role !== 'admin') return null;
              
              return (
                <Link 
                  key={item.name}
                  to={item.href} 
                  className="text-muted-foreground hover:text-primary calm-transition"
                >
                  {item.name}
                </Link>
              )
            })}
            
            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  Get Help Now
                </Button>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User size={16} className="text-primary-foreground" />
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-foreground">
                      {user?.name || user?.email}
                    </span>
                  </button>
                  
                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-medium text-foreground">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted w-full text-left">
                          <Settings size={16} />
                          <span>Settings</span>
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full text-left"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-muted-foreground hover:text-primary calm-transition"
                >
                  Sign In
                </Link>
                <Link to="/signup">
                  <Button variant="default" className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary focus-calm"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navItems.map((item) => {
              // Skip admin-only items for non-admin users
              if (item.adminOnly && user?.role !== 'admin') return null;
              
              return (
                <Link 
                  key={item.name}
                  to={item.href} 
                  className="block text-muted-foreground hover:text-primary calm-transition"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )
            })}
            
            {/* Mobile Authentication Section */}
            <div className="pt-4 border-t border-border space-y-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 px-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User size={20} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                    Get Help Now
                  </Button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-destructive text-sm w-full px-2"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  )
}