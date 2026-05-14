import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Play, Clock, Search, Filter, BookOpen, Video, FileText, Headphones, Users, Phone, X, Maximize2, Globe, RotateCcw, Edit } from 'lucide-react';
import { cn } from "../lib/utils";

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
      icon: Edit,
      description: 'Mental health insights and experiences'
    },
    {
      href: '/resources/audio',
      label: 'Audio Resources',
      icon: Headphones,
      description: 'Meditation and audio guides'
    },
    {
      href: '/resources/support',
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

// Video Player Component
function VideoPlayer({ videoUrl, title, isOpen, onClose }) {
  const getYouTubeVideoId = (url) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  
  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground">Invalid video URL</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold pr-8">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Embedded YouTube video player
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Video will pause when dialog is closed
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.open(videoUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              Watch on YouTube
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Video Thumbnail Component
function VideoThumbnail({ videoUrl, title, onClick }) {
  const getYouTubeVideoId = (url) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : '/placeholder-video.jpg';

  return (
    <div 
      className="relative w-full h-48 bg-muted rounded-lg overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        onError={(e) => {
          e.target.src = '/placeholder-video.jpg';
        }}
      />
      
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
        <div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors">
          <Play className="w-6 h-6 ml-1" fill="currentColor" />
        </div>
      </div>
      
      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
        YouTube
      </div>
    </div>
  );
}

export function VideoResourcesPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Helper functions defined before being used
  const getLanguageFlag = (language) => {
    const flags = {
      'English': '🇺🇸',
      'Hindi': '🇮🇳',
      'Kannada': '🇮🇳',
      'Telugu': '🇮🇳'
    };
    return flags[language] || '🌐';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'anxiety': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'depression': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'stress': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'mindfulness': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'confidence': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'motivation': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'relationships': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'trauma': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'general': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  // FIXED: Get category-specific background image with variety for each video
  const getCategoryImage = (category, videoId) => {
    const images = {
      'anxiety': [
        '/mental health photos.zip/ONLINE COUNSELLING FOR ANXIETY.png',
        '/mental health photos.zip/ONLINE COUNSELL ANXIETY.png',
        '/mental health photos.zip/ONLINE COUNSELLING FOR ANXIETY4.png',
        '/mental health photos.zip/ONLINE COUNSELLING FOR ANXIETY8.png',
        '/mental health photos.zip/ANXIETY-icon.svg'
      ],
      'depression': [
        '/mental health photos.zip/DEPRESSION1.png',
        '/mental health photos.zip/DEPRESSION2.png',
        '/mental health photos.zip/DEPRESSION3e.png',
        '/mental health photos.zip/DEPRESSION49.png',
        '/mental health photos.zip/DEPRESSION5.png'
      ],
      'stress': [
        '/mental health photos.zip/stress1.png',
        '/mental health photos.zip/stress2.png',
        '/mental health photos.zip/stress3.png',
        '/mental health photos.zip/stress4.png',
        '/mental health photos.zip/stress5.png'
      ],
      'mindfulness': [
        '/mental health photos.zip/meditating_caucasian_guy_wooden_pier_thinking_about_life_waterfront_city_background_670147_55258_6e4dc5f46c.png',
        '/mental health photos.zip/mentalhealth_flickr.png',
        '/mental health photos.zip/20240427_STD002.jpg'
      ],
      'confidence': [
        '/mental health photos.zip/student.png',
        '/mental health photos.zip/student-mental-health-screener.png',
        '/mental health photos.zip/1.png'
      ],
      'motivation': [
        '/mental health photos.zip/strategies-to-prioritize-student-mental-health-2.png',
        '/mental health photos.zip/Student-Well-being_-Balancing-Academics-and-Mental-Health-930x560.png',
        '/mental health photos.zip/student-mental-health-hero.jpeg'
      ],
      'relationships': [
        '/mental health photos.zip/LONELINESS2.png',
        '/mental health photos.zip/3ac9c1a4-413f-4c09-a3af-55cbc4d26bbe.jpg',
        '/mental health photos.zip/images.jpg'
      ],
      'trauma': [
        '/mental health photos.zip/3ac9c1a4-413f-4c09-a3af-55cbc4d26bbe.jpg',
        '/mental health photos.zip/20240427_STD002.jpg',
        '/mental health photos.zip/images.jpg'
      ],
      'general': [
        '/mental health photos.zip/mentalhealth.jpg',
        '/mental health photos.zip/mentalhealth_flickr.png',
        '/mental health photos.zip/1.png'
      ]
    };
    
    const categoryImages = images[category] || images['general'];
    
    // Use video ID to create variety - different videos get different images
    const hashCode = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    };
    
    // Use videoId instead of just category to get different images for different videos
    const imageIndex = hashCode(videoId || category) % categoryImages.length;
    return categoryImages[imageIndex];
  };

  // Fetch video data from GitHub
  useEffect(() => {
    fetchVideoData();
  }, []);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://raw.githubusercontent.com/Veer212004/MindMate/refs/heads/main/docs/VedioSource.json');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch video data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the data
      const transformedVideos = [];
      
      Object.entries(data).forEach(([languageCategory, videosArray]) => {
        if (Array.isArray(videosArray)) {
          videosArray.forEach((video, index) => {
            // Determine category based on video title keywords
            const title = video.title.toLowerCase();
            let category = 'general';
            let categoryLabel = 'General';
            
            if (title.includes('anxiety') || title.includes('anxious')) {
              category = 'anxiety';
              categoryLabel = 'Anxiety';
            } else if (title.includes('depression') || title.includes('depressed')) {
              category = 'depression';
              categoryLabel = 'Depression';
            } else if (title.includes('stress') || title.includes('stressed')) {
              category = 'stress';
              categoryLabel = 'Stress Management';
            } else if (title.includes('meditation') || title.includes('mindfulness')) {
              category = 'mindfulness';
              categoryLabel = 'Mindfulness';
            } else if (title.includes('confidence') || title.includes('self-esteem')) {
              category = 'confidence';
              categoryLabel = 'Confidence';
            } else if (title.includes('social') || title.includes('relationship')) {
              category = 'relationships';
              categoryLabel = 'Relationships';
            } else if (title.includes('trauma') || title.includes('healing')) {
              category = 'trauma';
              categoryLabel = 'Trauma & Healing';
            } else if (title.includes('motivat') || title.includes('positive')) {
              category = 'motivation';
              categoryLabel = 'Motivation';
            }

            const videoId = `${languageCategory.replace(/\s+/g, '-').toLowerCase()}-${index}`;
            
            const transformedVideo = {
              id: videoId,
              title: video.title || 'Untitled Video',
              category: category,
              categoryLabel: categoryLabel,
              language: languageCategory.replace(' Videos', ''),
              languageKey: languageCategory.replace(' Videos', '').toLowerCase(),
              description: `${categoryLabel} guidance by ${video.author || 'Expert'} - ${languageCategory.replace(' Videos', '')} language`,
              url: video.url || '#',
              author: video.author || 'Unknown',
              channel: video.channel || 'Unknown Channel',
              duration: 'N/A',
              tags: [category, languageCategory.replace(' Videos', '').toLowerCase(), 'mental health', 'video resource'],
              coverImage: getCategoryImage(category, videoId) // FIXED: Pass videoId to get different images
            };
            
            transformedVideos.push(transformedVideo);
          });
        }
      });
      
      setVideos(transformedVideos);
      setError('');
      
    } catch (error) {
      console.error('❌ Error fetching video data:', error);
      setError(`Failed to load video resources: ${error.message}`);
      setVideos([]);
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
        label: cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      }))
    ];
  }, [videos]);

  // Get unique languages for filter dropdown
  const languages = React.useMemo(() => {
    const uniqueLanguages = [...new Set(videos.map(video => video.languageKey))];
    return [
      { value: 'all', label: 'All Languages' },
      ...uniqueLanguages.map(lang => {
        const sampleVideo = videos.find(v => v.languageKey === lang);
        const languageName = sampleVideo?.language || lang;
        return {
          value: lang,
          label: languageName,
          flag: getLanguageFlag(languageName),
          count: videos.filter(v => v.languageKey === lang).length
        };
      })
    ];
  }, [videos]);

  // Filter function
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || video.languageKey === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const handleWatchVideo = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLanguage('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="pt-16">
          <ResourcesNav />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="pt-16">
          <ResourcesNav />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4 text-4xl">⚠️</div>
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Navigation */}
      <div className="pt-16">
        <ResourcesNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* NEW: Hero Section with Cover Image */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
          <div className="h-64 sm:h-80">
            <img
              src="/mental health photos.zip/student-mental-health-hero.jpeg"
              alt="Video Resources Hero"
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
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Video Resources
                </h1>
                <p className="text-lg text-white/90">
                  Curated video content to support your mental health and wellbeing journey
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Language Stats */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-6 text-sm text-muted-foreground flex-wrap">
            {languages.slice(1).map(lang => (
              <span key={lang.value} className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-full">
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {lang.count}
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
              placeholder="Search videos by title, author, or category..."
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
                      {category.label} ({videos.filter(v => category.value === 'all' || v.category === category.value).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language Filter */}
            <div className="flex-1 sm:max-w-xs relative">
              <Globe className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="pl-9">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      <div className="flex items-center gap-2">
                        <span>{language.flag}</span>
                        <span>{language.label}</span>
                        {language.value !== 'all' && <span className="text-muted-foreground">({language.count})</span>}
                      </div>
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
              disabled={searchQuery === '' && selectedCategory === 'all' && selectedLanguage === 'all'}
            >
              <RotateCcw className="w-4 h-4" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== 'all' || selectedLanguage !== 'all' || searchQuery) && (
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
            {selectedLanguage !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {languages.find(l => l.value === selectedLanguage)?.flag} {languages.find(l => l.value === selectedLanguage)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLanguage('all')} />
              </Badge>
            )}
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredVideos.length} of {videos.length} video resources
            {selectedCategory !== 'all' && (
              <span> in {categories.find(c => c.value === selectedCategory)?.label}</span>
            )}
            {selectedLanguage !== 'all' && (
              <span> in {languages.find(l => l.value === selectedLanguage)?.label}</span>
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
                className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden"
              >
                {/* NEW: Category-specific Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={video.coverImage}
                    alt={video.categoryLabel}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/mental health photos.zip/mentalhealth.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getCategoryColor(video.category)} border-0`}>
                      {video.categoryLabel}
                    </Badge>
                  </div>
                  
                  {/* Language Flag */}
                  <div className="absolute top-3 right-3 flex items-center bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm">
                    <span className="mr-1">{getLanguageFlag(video.language)}</span>
                    {video.language}
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 cursor-pointer" onClick={() => handleWatchVideo(video)}>
                      <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">
                      <strong>By:</strong> {video.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Channel:</strong> {video.channel}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {video.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    onClick={() => handleWatchVideo(video)}
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                    variant="outline"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Videos Found</h3>
            <p className="text-muted-foreground mb-4">
              No video resources match your current search and filter criteria.
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Video Player Dialog */}
        {selectedVideo && (
          <VideoPlayer
            videoUrl={selectedVideo.url}
            title={selectedVideo.title}
            isOpen={!!selectedVideo}
            onClose={handleCloseVideo}
          />
        )}

        {/* Help Section with Background */}
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
          </div>
        </Card>
      </div>
    </div>
  );
}