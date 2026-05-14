import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ResourcePlayer } from "../components/ui/resource-player"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Video, FileText, Headphones, Users, Phone, ArrowRight, BookOpen, Filter, FileText as BlogIcon } from "lucide-react"
import { cn } from "../lib/utils"

// Resources Navigation Component
function ResourcesNav() {
  const location = useLocation();

  const navItems = [
    {
      href: '/resources',
      label: 'All Resources',
      icon: BookOpen,
      description: 'Browse all available resources'
    },
    {
      href: '/resources/videos',
      label: 'Video Resources',
      icon: Video,
      description: 'Curated video content'
    },
    {
      href: '/resources/articles',
      label: 'Articles & Guides',
      icon: FileText,
      description: 'In-depth articles and guides'
    },
    {
      href: '/resources/blog',
      label: 'Blog Posts',
      icon: FileText,
      description: 'Mental health insights and experiences'
    },
    {
      href: '/resources/audio',
      label: 'Audio Resources',
      icon: Headphones,
      description: 'Meditation and audio guides'
    },
    {
      href: '/forum',
      label: 'Support Groups',
      icon: Users,
      description: 'Find community support'
    },
    {
      href: '/resources/crisis',
      label: 'Crisis Support',
      icon: Phone,
      description: 'Immediate help resources'
    }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 overflow-x-auto scrollbar-hide py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const resources = [
    {
      id: 1,
      title: "Managing Anxiety: Breathing Techniques",
      type: "video",
      category: "anxiety",
      duration: "8 min",
      description: "Learn effective breathing exercises to help manage anxiety and panic attacks.",
      url: "/videos/breathing-techniques.mp4",
      tags: ["anxiety", "breathing", "techniques"]
    },
    {
      id: 2,
      title: "Understanding Depression: A Guide",
      type: "article",
      category: "depression",
      readTime: "12 min",
      description: "Comprehensive guide to understanding depression, its symptoms, and treatment options.",
      url: "/articles/depression-guide.pdf",
      tags: ["depression", "mental health", "treatment"]
    },
    {
      id: 3,
      title: "Mindfulness Meditation for Beginners",
      type: "audio",
      category: "mindfulness",
      duration: "15 min",
      description: "Guided meditation session perfect for those new to mindfulness practice.",
      url: "/audio/mindfulness-meditation.mp3",
      tags: ["mindfulness", "meditation", "relaxation"]
    },
    {
      id: 4,
      title: "Building Healthy Relationships",
      type: "video",
      category: "relationships",
      duration: "22 min",
      description: "Learn the foundations of healthy communication and relationship building.",
      url: "/videos/healthy-relationships.mp4",
      tags: ["relationships", "communication", "social"]
    },
    {
      id: 5,
      title: "Sleep Hygiene: Better Rest for Better Health",
      type: "article",
      category: "wellness",
      readTime: "8 min",
      description: "Evidence-based tips for improving sleep quality and establishing healthy sleep habits.",
      url: "/articles/sleep-hygiene.pdf",
      tags: ["sleep", "wellness", "health"]
    },
    {
      id: 6,
      title: "Stress Management at Work",
      type: "video",
      category: "stress",
      duration: "18 min",
      description: "Practical strategies for managing workplace stress and maintaining work-life balance.",
      url: "/videos/workplace-stress.mp4",
      tags: ["stress", "work", "productivity"]
    }
  ]

  const categories = [
    { value: 'all', label: 'All Resources' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'depression', label: 'Depression' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'wellness', label: 'Wellness' },
    { value: 'stress', label: 'Stress Management' }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8M7 7h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
          </svg>
        )
      case 'audio':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )
      case 'article':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      default:
        return null
    }
  }

  const quickAccessCards = [
    {
      title: "Video Resources",
      description: "Curated video content for mental health support",
      icon: Video,
      href: "/resources/videos",
      color: "from-blue-500 to-blue-600",
      count: "50+ videos"
    },
    {
      title: "Blog Posts", // Add this new card
      description: "Student mental health insights and experiences",
      icon: BlogIcon,
      href: "/resources/blog",
      color: "from-purple-500 to-purple-600",
      count: "Latest posts"
    },
    {
      title: "Audio Resources",
      description: "Meditation and guided audio sessions",
      icon: Headphones,
      href: "/resources/audio",
      color: "from-purple-500 to-purple-600",
      count: "30+ sessions"
    },
    {
      title: "Support Groups",
      description: "Connect with community support",
      icon: Users,
      href: "/forum",
      color: "from-pink-500 to-pink-600",
      count: "Active groups"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Navigation */}
      <div className="pt-16">
        <ResourcesNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Mental Health Resources</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive collection of curated resources to support your mental health and wellbeing journey
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link to={card.href} key={card.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {card.title}
                    </CardTitle>
                    <CardDescription>
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{card.count}</Badge>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="sm:w-64 relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="pl-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Resource */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Featured</Badge>
              <Badge variant="outline">New</Badge>
            </div>
            <CardTitle className="text-xl">Managing Anxiety: Breathing Techniques</CardTitle>
            <CardDescription>
              Master proven breathing techniques that can help you manage anxiety and panic attacks in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResourcePlayer
              resource={{
                type: "video",
                title: "Managing Anxiety: Breathing Techniques",
                url: "/videos/breathing-techniques.mp4"
              }}
            />
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-primary">
                      {getResourceIcon(resource.type)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {resource.type}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {resource.duration || resource.readTime}
                  </span>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {resource.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-4 line-clamp-3">
                  {resource.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                  {resource.type === 'video' ? 'Watch' : resource.type === 'audio' ? 'Listen' : 'Read'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No resources found matching your search.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-12 bg-secondary/50">
          <CardHeader className="text-center">
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>
              These resources are supplementary to professional care. If you're in crisis, please seek immediate help.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>Book a Session</Button>
              <Button variant="outline">Chat with AI Support</Button>
            </div>
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Crisis Support:</strong> If you're in immediate danger or having thoughts of self-harm, 
                please call 988 (Crisis Lifeline) or go to your nearest emergency room.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}