import React, { useState, useEffect } from 'react';
import BlogPostCard from '../components/blog/BlogPostCard';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Search, Filter, BookOpen, RotateCcw, X } from "lucide-react";

function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Define illustrations array inside the component
  const illustrations = [
    "/mental health photos.zip/ONLINE COUNSELLING FOR ANXIETY.png",
    "/mental health photos.zip/ONLINE COUNSELLING FOR ANXIETY4.png",
    "/mental health photos.zip/ONLINE COUNSELLING FOR ANXIETY8.png",
    "/mental health photos.zip/DEPRESSION1.png",
    "/mental health photos.zip/DEPRESSION2.png",
    "/mental health photos.zip/DEPRESSION3e.png",
    "/mental health photos.zip/stress1.png",
    "/mental health photos.zip/stress2.png",
    "/mental health photos.zip/stress3.png",
    "/mental health photos.zip/student-mental-health-hero.jpeg",
    "/mental health photos.zip/Student-Well-being_-Balancing-Academics-and-Mental-Health-930x560.png",
    "/mental health photos.zip/strategies-to-prioritize-student-mental-health-2.png",
    "/mental health photos.zip/LONELINESS2.png",
    "/mental health photos.zip/meditating_caucasian_guy_wooden_pier_thinking_about_life_waterfront_city_background_670147_55258_6e4dc5f46c.png",
    "/mental health photos.zip/mentalhealth.jpg",
    "/mental health photos.zip/mentalhealth_flickr.png",
    "/mental health photos.zip/1.png"
  ];

  // Function to get illustration by category
  const getIllustrationByCategory = (category, index) => {
    const categoryImages = {
      'anxiety': [
        "/mental health photos.zip/ONLINE COUNSELLING FOR ANXIETY.png",
        "/mental health photos.zip/ONLINE COUNSELLING FOR ANXIETY4.png",
        "/mental health photos.zip/ONLINE COUNSELLING FOR ANXIETY8.png"
      ],
      'depression': [
        "/mental health photos.zip/DEPRESSION1.png",
        "/mental health photos.zip/DEPRESSION2.png",
        "/mental health photos.zip/DEPRESSION3e.png"
      ],
      'stress': [
        "/mental health photos.zip/stress1.png",
        "/mental health photos.zip/stress2.png",
        "/mental health photos.zip/stress3.png"
      ],
      'academic': [
        "/mental health photos.zip/student-mental-health-hero.jpeg",
        "/mental health photos.zip/strategies-to-prioritize-student-mental-health-2.png",
        "/mental health photos.zip/Student-Well-being_-Balancing-Academics-and-Mental-Health-930x560.png"
      ],
      'mindfulness': [
        "/mental health photos.zip/meditating_caucasian_guy_wooden_pier_thinking_about_life_waterfront_city_background_670147_55258_6e4dc5f46c.png"
      ],
      'loneliness': [
        "/mental health photos.zip/LONELINESS2.png"
      ],
      'general': [
        "/mental health photos.zip/mentalhealth.jpg",
        "/mental health photos.zip/mentalhealth_flickr.png",
        "/mental health photos.zip/1.png"
      ]
    };

    const lowerCategory = category?.toLowerCase() || 'general';
    let categoryArray = categoryImages[lowerCategory];
    
    // If category not found, use general images
    if (!categoryArray) {
      categoryArray = categoryImages['general'];
    }
    
    // Use index to select image from category array, or fallback to all illustrations
    const imageIndex = index % categoryArray.length;
    return categoryArray[imageIndex] || illustrations[index % illustrations.length];
  };

  // Fetch blog data from GitHub
  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://raw.githubusercontent.com/Veer212004/MindMate/refs/heads/main/docs/blogs1111111%5B2%5D.json');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blog data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Ensure data is an array and transform it properly
      const transformedPosts = Array.isArray(data) ? data.map((post, index) => {
        const category = post.category || post.tags?.[0] || 'general';
        
        return {
          // Use existing id or create one from index
          id: post.id || post.slug || `post-${index}`,
          title: post.title || 'Untitled Post',
          excerpt: post.excerpt || post.summary || post.description || 'No description available',
          content: post.content || post.body || '',
          date: post.date || post.publishedAt || post.createdAt || 'Date not available',
          author: typeof post.author === 'object' ? post.author?.name || 'Mental Care Team' : post.author || 'Mental Care Team',
          category: category,
          image: post.image || post.coverImage || post.thumbnail || getIllustrationByCategory(category, index),
          tags: Array.isArray(post.tags) ? post.tags : (post.tags ? [post.tags] : []),
          // Add illustration as fallback
          illustration: getIllustrationByCategory(category, index)
        };
      }) : [];
      
      setBlogPosts(transformedPosts);
      setError('');
      
    } catch (error) {
      console.error('❌ Error fetching blog data:', error);
      setError(`Failed to load blog posts: ${error.message}`);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter dropdown
  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(blogPosts.map(post => post.category?.toLowerCase()).filter(Boolean))];
    return [
      { value: 'all', label: 'All Categories', count: blogPosts.length },
      ...uniqueCategories.map(cat => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: blogPosts.filter(post => post.category?.toLowerCase() === cat).length
      }))
    ];
  }, [blogPosts]);

  // Filter function
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = !searchQuery || (
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const matchesCategory = selectedCategory === 'all' || post.category?.toLowerCase() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading blog posts...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center py-12">
              <div className="text-red-500 mb-4 text-4xl">⚠️</div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Blog Posts</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchBlogData} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header with Hero Image */}
          <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg">
            <div className="h-64 sm:h-80">
              <img
                src="/mental health photos.zip/student-mental-health-hero.jpeg"
                alt="Mental Health Blog"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/mental health photos.zip/mentalhealth.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mr-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    Mental Health Blog
                  </h1>
                  <p className="text-lg text-white/90">
                    Insights, experiences, and expert advice on student mental health and wellbeing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="text-center mb-8">
            <div className="flex justify-center gap-6 text-sm text-muted-foreground flex-wrap">
              {categories.slice(1).map(category => (
                <span key={category.value} className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-full">
                  <span className="font-medium">{category.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </span>
              ))}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search blog posts by title, author, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex-1 sm:max-w-xs relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="pl-9">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="flex items-center gap-2 whitespace-nowrap"
                disabled={searchQuery === '' && selectedCategory === 'all'}
              >
                <RotateCcw className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'all' || searchQuery) && (
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find(c => c.value === selectedCategory)?.label}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </Badge>
              )}
            </div>
          )}

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredPosts.length} of {blogPosts.length} blog posts
              {selectedCategory !== 'all' && (
                <span> in {categories.find(c => c.value === selectedCategory)?.label}</span>
              )}
              {searchQuery && <span> matching "{searchQuery}"</span>}
            </p>
          </div>

          {/* Featured Post */}
          {filteredPosts.length > 0 && (
            <Card className="mb-12 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={filteredPosts[0].image}
                  alt={filteredPosts[0].title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = filteredPosts[0].illustration || "/mental health photos.zip/mentalhealth.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl">{filteredPosts[0].title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>By {filteredPosts[0].author}</span>
                  <span>{filteredPosts[0].date}</span>
                  <Badge variant="outline">{filteredPosts[0].category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {filteredPosts[0].excerpt}
                </p>
                <Button asChild>
                  <a href={`/resources/blog/${filteredPosts[0].id}`}>
                    Read Full Article
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {filteredPosts.slice(1).map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Blog Posts Found</h3>
              <p className="text-muted-foreground mb-4">
                No blog posts match your current search and filter criteria.
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Help Section */}
          <Card className="mt-12 relative overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="absolute inset-0">
              <img
                src="/mental health photos.zip/Student-Well-being_-Balancing-Academics-and-Mental-Health-930x560.png"
                alt="Mental Health Support"
                className="w-full h-full object-cover opacity-10"
                onError={(e) => {
                  e.target.src = "/mental health photos.zip/strategies-to-prioritize-student-mental-health-2.png";
                }}
              />
            </div>
            
            <div className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Need Personal Support?</CardTitle>
                <p className="text-lg text-muted-foreground">
                  While these blog posts provide valuable insights, remember that professional support is available when you need it.
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg">
                    Find Professional Help
                  </Button>
                  <Button variant="outline" size="lg">
                    Chat with AI Support
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;