import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Textarea } from "../components/ui/textarea"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

export function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showNewPost, setShowNewPost] = useState(false)

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'anxiety', label: 'Anxiety Support' },
    { value: 'depression', label: 'Depression' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'workplace', label: 'Workplace Stress' },
    { value: 'general', label: 'General Discussion' }
  ]

  const posts = [
    {
      id: 1,
      title: "Dealing with social anxiety at work",
      category: "anxiety",
      author: {
        name: "Sarah M.",
        avatar: "/api/placeholder/32/32",
        joined: "3 months ago"
      },
      content: "I've been struggling with social anxiety, especially during team meetings. Has anyone found effective strategies for managing this?",
      timestamp: "2 hours ago",
      replies: 12,
      likes: 8,
      tags: ["social-anxiety", "workplace", "coping-strategies"]
    },
    {
      id: 2,
      title: "Finding motivation during depressive episodes",
      category: "depression",
      author: {
        name: "Michael R.",
        avatar: "/api/placeholder/32/32",
        joined: "6 months ago"
      },
      content: "I'm looking for gentle ways to maintain some productivity and self-care when depression makes everything feel overwhelming.",
      timestamp: "5 hours ago",
      replies: 18,
      likes: 15,
      tags: ["depression", "motivation", "self-care"]
    },
    {
      id: 3,
      title: "Success story: 6 months of therapy",
      category: "general",
      author: {
        name: "Jennifer L.",
        avatar: "/api/placeholder/32/32",
        joined: "1 year ago"
      },
      content: "I wanted to share my progress after 6 months of regular therapy sessions. For anyone hesitating to start, it's been incredibly helpful...",
      timestamp: "1 day ago",
      replies: 24,
      likes: 32,
      tags: ["success-story", "therapy", "mental-health-journey"]
    },
    {
      id: 4,
      title: "Healthy boundaries with family",
      category: "relationships",
      author: {
        name: "David K.",
        avatar: "/api/placeholder/32/32",
        joined: "2 months ago"
      },
      content: "How do you set and maintain healthy boundaries with family members who don't understand mental health struggles?",
      timestamp: "2 days ago",
      replies: 9,
      likes: 6,
      tags: ["boundaries", "family", "relationships"]
    }
  ]

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Community Forum</h1>
            <p className="text-muted-foreground">
              Connect with others on similar journeys in a supportive, moderated environment
            </p>
          </div>
          <Button onClick={() => setShowNewPost(true)}>
            New Post
          </Button>
        </div>

        {/* Community Guidelines */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This is a safe space for peer support. Please be respectful, avoid giving medical advice, 
              and remember that our moderators review all posts to ensure a supportive environment.
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Forum Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Posts</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Members</span>
                  <span className="font-semibold">892</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Online Now</span>
                  <span className="font-semibold text-green-600">24</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* New Post Form */}
            {showNewPost && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                  <CardDescription>Share your thoughts, questions, or experiences with the community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="post-title">Title</Label>
                    <Input id="post-title" placeholder="What's on your mind?" />
                  </div>
                  
                  <div>
                    <Label htmlFor="post-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="post-content">Content</Label>
                    <Textarea 
                      id="post-content" 
                      placeholder="Share your thoughts, experiences, or questions..."
                      rows={6}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="post-tags">Tags (optional)</Label>
                    <Input id="post-tags" placeholder="e.g., anxiety, coping-strategies, support" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button>Post</Button>
                    <Button variant="outline" onClick={() => setShowNewPost(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg calm-transition">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{post.author.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Member for {post.author.joined}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{post.timestamp}</div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs mb-2">
                      {categories.find(c => c.value === post.category)?.label}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg mb-2 group-hover:text-primary calm-transition">
                    {post.title}
                  </CardTitle>
                  
                  <CardDescription className="mb-4 line-clamp-2">
                    {post.content}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 hover:text-primary calm-transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likes}
                      </button>
                      
                      <button className="flex items-center gap-1 hover:text-primary calm-transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.replies} replies
                      </button>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPosts.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground text-lg">No posts found in this category.</p>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory('all')}
                    className="mt-4"
                  >
                    View All Posts
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Crisis Resources */}
        <Card className="mt-8 bg-destructive/10 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Need Immediate Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you're having thoughts of self-harm or are in crisis, please reach out for immediate support:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="destructive">Crisis Hotline: 988</Button>
              <Button variant="outline">Emergency: 911</Button>
              <Button variant="outline">Crisis Text: 741741</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}