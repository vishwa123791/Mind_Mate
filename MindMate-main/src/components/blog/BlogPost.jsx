import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Calendar, Clock, Share2, User } from "lucide-react";

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://raw.githubusercontent.com/Veer212004/MindMate/refs/heads/main/docs/blogs1111111%5B2%5D.json');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blog data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const foundPost = data.find(post => (post.id || post.slug) === id);
      
      if (!foundPost) {
        throw new Error('Post not found');
      }
      
      setPost(foundPost);
      
      const related = data
        .filter(p => (p.id || p.slug) !== id && p.category === foundPost.category)
        .slice(0, 3);
      
      setRelatedPosts(related);
      
    } catch (error) {
      console.error('❌ Error fetching blog post:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading blog post...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-8">
                {error || "The blog post you're looking for doesn't exist."}
              </p>
              <Link to="/resources/blog">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safe property access with fallbacks
  const postTitle = post.title || 'Untitled Post';
  const postContent = post.content || post.body || 'No content available';
  const postExcerpt = post.excerpt || post.summary || '';
  const postDate = post.date || post.publishedAt || 'Date not available';
  const postAuthor = post.author || post.writer || 'Mental Care Team';
  const postCategory = post.category || 'General';
  const postImage = post.image || getCategoryImage(postCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/resources/blog">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          <Card className="overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-64 sm:h-80">
              <img
                src={postImage}
                alt={postTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/mental health photos.zip/mentalhealth.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <Badge variant="secondary" className="mb-4">
                  {postCategory}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  {postTitle}
                </h1>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{postAuthor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{postDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: postTitle,
                        text: postExcerpt,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardHeader>

            <CardContent className="prose prose-lg max-w-none">
              {/* Show excerpt if available */}
              {postExcerpt && (
                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                  <p className="text-muted-foreground italic">{postExcerpt}</p>
                </div>
              )}
              
              {/* Main content */}
              <div 
                dangerouslySetInnerHTML={{ __html: postContent }}
                className="text-foreground space-y-6"
              />
            </CardContent>
          </Card>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => {
                  const relatedId = relatedPost.id || relatedPost.slug || '';
                  const relatedTitle = relatedPost.title || 'Untitled Post';
                  const relatedDate = relatedPost.date || relatedPost.publishedAt || '';
                  const relatedImage = relatedPost.image || getCategoryImage(relatedPost.category);
                  
                  return (
                    <Card key={relatedId} className="group hover:shadow-lg transition-all duration-300">
                      <Link to={`/resources/blog/${relatedId}`}>
                        <div className="h-32 overflow-hidden">
                          <img
                            src={relatedImage}
                            alt={relatedTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = "/mental health photos.zip/mentalhealth.jpg";
                            }}
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {relatedTitle}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{relatedDate}</p>
                        </CardHeader>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogPost;