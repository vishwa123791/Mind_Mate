import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, User, ArrowRight } from "lucide-react";

function BlogPostCard({ post }) {
  // Add safety checks for undefined post or missing properties
  if (!post) {
    return null;
  }

  // Get category-specific image with fallback
  const getCategoryImage = (category) => {
    const images = {
      'anxiety': '/mental health photos.zip/ONLINE COUNSELLING FOR ANXIETY.png',
      'depression': '/mental health photos.zip/DEPRESSION1.png',
      'stress': '/mental health photos.zip/stress1.png',
      'academic': '/mental health photos.zip/student-mental-health-hero.jpeg',
      'mindfulness': '/mental health photos.zip/meditating_caucasian_guy_wooden_pier_thinking_about_life_waterfront_city_background_670147_55258_6e4dc5f46c.png',
      'motivation': '/mental health photos.zip/strategies-to-prioritize-student-mental-health-2.png',
      'relationships': '/mental health photos.zip/LONELINESS2.png',
      'general': '/mental health photos.zip/mentalhealth.jpg'
    };
    
    return images[category?.toLowerCase()] || images['general'];
  };

  const getCategoryColor = (category) => {
    const colors = {
      'anxiety': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'depression': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'stress': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'academic': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'mindfulness': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'motivation': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'relationships': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'general': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[category?.toLowerCase()] || colors['general'];
  };

  // Safe property access with fallbacks
  const postId = post.id || post.slug || '';
  const postTitle = post.title || 'Untitled Post';
  const postExcerpt = post.excerpt || post.summary || 'No description available';
  const postDate = post.date || post.publishedAt || 'Date not available';
  const postAuthor = post.author || post.writer || 'Mental Care Team';
  const postCategory = post.category || 'General';
  const postImage = post.image || getCategoryImage(postCategory);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          src={postImage}
          alt={postTitle}
          onError={(e) => {
            e.target.src = "/mental health photos.zip/mentalhealth.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className={`${getCategoryColor(postCategory)} border-0`}>
            {postCategory}
          </Badge>
        </div>
        
        {/* Blog Label */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 text-black">
            Blog
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <User className="w-4 h-4" />
          <span>{postAuthor}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{postDate}</span>
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
          <Link 
            to={`/resources/blog/${postId}`} 
            className="hover:text-primary block"
          >
            {postTitle}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {postExcerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 mt-auto">
        <Link 
          to={`/resources/blog/${postId}`} 
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm group-hover:underline"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}

export default BlogPostCard;