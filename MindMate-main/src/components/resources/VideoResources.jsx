import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Play, Clock, ExternalLink, Search, Filter } from 'lucide-react';

export function VideoResources() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch video data from GitHub
  useEffect(() => {
    fetchVideoData();
  }, []);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://raw.githubusercontent.com/Veer212004/MindMate/refs/heads/main/docs/VedioSource.json');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch video data: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched video data:', data);
      
      const transformedVideos = [];
      
      Object.entries(data).forEach(([category, categoryData]) => {
        if (categoryData.videos && Array.isArray(categoryData.videos)) {
          categoryData.videos.forEach((video, index) => {
            transformedVideos.push({
              id: `${category}-${index}`,
              title: video.title,
              category: category.toLowerCase(),
              categoryLabel: category,
              description: video.description || `${category} related video resource`,
              url: video.url,
              thumbnail: video.thumbnail || null,
              duration: video.duration || 'N/A',
              tags: [category.toLowerCase(), 'mental health', 'video resource']
            });
          });
        }
      });

      setVideos(transformedVideos);
      setError('');
    } catch (error) {
      console.error('Error fetching video data:', error);
      setError('Failed to load video resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter dropdown
  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(videos.map(video => video.category))];
    return [
      { value: 'all', label: 'All Categories' },
      ...uniqueCategories.map(cat => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1)
      }))
    ];
  }, [videos]);

  // Filter videos based on search and category
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleWatchVideo = (videoUrl) => {
    // Open video in new tab
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'anxiety': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'depression': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'stress': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'mindfulness': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'sleep': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'motivation': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'relationships': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'self-care': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading video resources...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Videos</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchVideoData} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Video Resources
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Curated video content to support your mental health and wellbeing journey
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search videos by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
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

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredVideos.length} of {videos.length} video resources
            {selectedCategory !== 'all' && (
              <span> in {categories.find(c => c.value === selectedCategory)?.label}</span>
            )}
            {searchQuery && <span> matching "{searchQuery}"</span>}
          </p>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card 
                key={video.id} 
                className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(video.category)}>
                      {video.categoryLabel}
                    </Badge>
                    {video.duration !== 'N/A' && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="mb-4 line-clamp-3">
                    {video.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {video.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    onClick={() => handleWatchVideo(video.url)}
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                    variant="outline"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Videos Found</h3>
            <p className="text-muted-foreground mb-4">
              No video resources match your current search criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Need Personal Support?</CardTitle>
            <CardDescription className="text-lg">
              While these videos provide valuable information, remember that professional support is available when you need it.
            </CardDescription>
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
  );
}