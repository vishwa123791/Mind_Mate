"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "./button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

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
            <Link to="/chat" className="text-muted-foreground hover:text-primary calm-transition">
              AI Support
            </Link>
            <Link to="/booking" className="text-muted-foreground hover:text-primary calm-transition">
              Book Session
            </Link>
            <Link to="/resources" className="text-muted-foreground hover:text-primary calm-transition">
              Resources
            </Link>
            <Link to="/forum" className="text-muted-foreground hover:text-primary calm-transition">
              Community
            </Link>
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              Get Help Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary focus-calm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/chat" className="block text-muted-foreground hover:text-primary calm-transition">
              AI Support
            </Link>
            <Link to="/booking" className="block text-muted-foreground hover:text-primary calm-transition">
              Book Session
            </Link>
            <Link to="/resources" className="block text-muted-foreground hover:text-primary calm-transition">
              Resources
            </Link>
            <Link to="/forum" className="block text-muted-foreground hover:text-primary calm-transition">
              Community
            </Link>
            <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
              Get Help Now
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}

