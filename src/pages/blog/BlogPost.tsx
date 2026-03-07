import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MusicPlayer } from "@/components/ui/music-player";
import { MediaPlayer } from "@/components/ui/media-player";
import { SocialShare } from "@/components/ui/social-share";
import { 
  Calendar, 
  Clock, 
  Star, 
  Share2, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Heart,
  Play,
  Pause,
  Volume2,
  SkipBack,
  SkipForward,
  User,
  Eye,
  ThumbsUp,
  Music,
  TrendingUp
} from "lucide-react";
import { FaXTwitter, FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaSpotify, FaApple } from 'react-icons/fa6';
import { getImageUrl } from "@/lib/utils";
import { analyzeImageColors, ColorAnalysis } from "@/lib/colorAnalysis";

// Utility to convert plain text to HTML with paragraphs and line breaks
// This function is no longer used since we're rendering HTML directly
// function plainTextToHtml(text: string) {
//   // If it looks like HTML, return as is
//   if (/<[a-z][\s\S]*>/i.test(text)) return text;
//   // Split by double newlines for paragraphs, single newline for <br>
//   return text
//     .split(/\n{2,}/)
//     .map(paragraph =>
//       `<p>${paragraph.replace(/\n/g, '<br />')}</p>`
//     )
//     .join('');
// }

const BlogPost = () => {
  const { id } = useParams();
  console.log('BlogPost: id param', id);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState<any>({});
  const [heroColorAnalysis, setHeroColorAnalysis] = useState<ColorAnalysis | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    console.log('Fetching post with id:', id);
    fetch(`/api/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then(data => {
        console.log('Fetched post data:', data);
        console.log('Content field:', data.content);
        console.log('Content type:', typeof data.content);
        console.log('Content length:', data.content?.length);
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching post:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const res = await fetch('/api/auth/settings/social-links');
        if (!res.ok) return;
        const data = await res.json();
        setSocialLinks(data);
      } catch {}
    }
    fetchSocialLinks();
  }, []);

  // Fetch related posts (same genre or latest, excluding current)
  useEffect(() => {
    if (!id) return;
    const genreId = post?.genre_id;
    const url = genreId
      ? `/api/posts?limit=8&genre_id=${genreId}`
      : '/api/posts?limit=8&sortBy=latest';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const related = (Array.isArray(data) ? data : [])
          .filter((p: any) => String(p.id) !== String(id))
          .slice(0, 4);
        setRelatedArticles(related);
      })
      .catch(() => setRelatedArticles([]));
  }, [id, post?.genre_id]);

  // Analyze hero image colors for dynamic background
  useEffect(() => {
    if (post?.hero_image_url) {
      const analyzeColors = async () => {
        try {
          const analysis = await analyzeImageColors(post.hero_image_url);
          setHeroColorAnalysis(analysis);
        } catch (error) {
          console.warn('Failed to analyze hero image colors:', error);
        }
      };
      
      analyzeColors();
    }
  }, [post?.hero_image_url]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-muted-foreground">Loading post...</span>
      </div>
    );
  }
  if (error) {
    console.log('Error state:', error);
    return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Link to="/blog">
          <Button>Return to Blog</Button>
        </Link>
      </div>
    </div>
  );
  }
  console.log('Rendering post:', post);
  console.log('Post content on render:', post?.content);
  console.log('Post content type on render:', typeof post?.content);

  // Use hero_image_url for the main image
  const heroImage = post.hero_image_url || post.image || '';
  // Split tags string into array
  const tags = typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : Array.isArray(post.tags) ? post.tags : [];
  // Use media array from backend
  const mediaItems = Array.isArray(post.media) ? post.media : [];
  // Use author object from backend
  const authorName = post.author_name || post.author?.name || 'Admin';
  const authorAvatar = post.author_image || post.author?.avatar || '';
  const authorBio = post.author?.bio || '';
  const postDate = post.created_at || post.date || '';
  const readTime = post.read_time || post.readTime || '—';

  // Parse artist social links (may be JSON string from API)
  const artistSocial = (() => {
    try {
      const raw = post.artist_social_links;
      if (typeof raw === 'string') return JSON.parse(raw) || {};
      return raw && typeof raw === 'object' ? raw : {};
    } catch { return {}; }
  })();
  const hasArtistSocial = artistSocial && (artistSocial.facebook || artistSocial.x || artistSocial.spotify || artistSocial.youtube || artistSocial.apple_music);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'tiktok':
        shareUrl = `https://www.tiktok.com/share?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleRatePost = async () => {
    setRatingLoading(true);
    try {
      await fetch(`/api/posts/${id}/rate`, { method: 'POST' });
      setPost((prev) => ({ ...prev, rating: (prev.rating || 0) + 1 }));
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${heroColorAnalysis ? (heroColorAnalysis.isLight ? 'bg-white' : 'bg-black') : 'bg-background'}`}>
      <PublicNavigation />
      
      {/* Hero Image */}
      <div className="relative w-full overflow-hidden">
        {heroImage ? (
          <img 
            src={heroImage} 
            alt={post.title}
            className="w-full h-auto object-contain max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-[500px]"
            onError={e => e.currentTarget.style.display = 'none'}
          />
        ) : (
          <div className="w-full h-32 bg-muted flex items-center justify-center text-muted-foreground">
            No Image Available
          </div>
        )}
        
        {/* Desktop/Tablet Text Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent hidden sm:block" />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 lg:p-8 hidden sm:block">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              {/* <div className="flex flex-wrap gap-2 mb-2 sm:mb-3 md:mb-4">
                {post.featured && (
                  <Badge className="bg-secondary text-secondary-foreground text-xs sm:text-sm px-2 py-1">Featured</Badge>
                )}
                <Badge className="bg-primary/20 text-primary border-primary text-xs sm:text-sm px-2 py-1">
                  {post.genre}
                </Badge>
              </div> */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-playfair font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/95 mb-3 sm:mb-4 md:mb-6 max-w-3xl leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Text Section - Shows below image on small screens */}
      <div className={`sm:hidden p-4 ${
        heroColorAnalysis 
          ? (heroColorAnalysis.isLight ? 'bg-white text-black' : 'bg-black text-white')
          : 'bg-black text-white'
      }`}>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.featured && (
                <Badge className="bg-secondary text-secondary-foreground text-xs px-2 py-1">Featured</Badge>
              )}
              <Badge className="bg-primary/20 text-primary border-primary text-xs px-2 py-1">
                {post.genre_name || post.genre}
              </Badge>
            </div>
            <h1 className={`text-2xl font-playfair font-bold mb-3 leading-tight ${
              heroColorAnalysis?.isLight ? 'text-black' : 'text-white'
            }`}>
              {post.title}
            </h1>
            <p className={`text-sm leading-relaxed ${
              heroColorAnalysis?.isLight ? 'text-black/90' : 'text-white/90'
            }`}>
              {post.excerpt}
            </p>
          </div>
        </div>
      </div>

      <div className={`container mx-auto px-4 py-12 ${
        heroColorAnalysis?.isLight ? 'bg-white' : 'bg-background'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <article className="lg:w-2/3">
              {/* Article Meta */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={authorAvatar || '/assets/default-avatar.png'} alt={authorName} />
                    <AvatarFallback>
                      {authorName.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{authorName}</p>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(postDate)}</span>
                      </div>
                      {/* <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{readTime}</span>
                      </div> */}
                      {/* <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{((post.views || 0) / 1000).toFixed(1)}K views</span>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="flex items-center bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 rounded-full focus:outline-none"
                    onClick={handleRatePost}
                    disabled={ratingLoading}
                    title="Rate this post"
                  >
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium ml-1">{post.rating || 0}</span>
                  </button>
                </div>
              </div>

              {/* Audio Player */}
              {post.audioTrack && (
                <Card className="audio-player mb-8 animate-fade-in">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{post.audioTrack.title}</h3>
                      <p className="text-sm text-muted-foreground">{post.audioTrack.artist}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline">
                        <SkipForward className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {post.audioTrack.duration}
                    </div>
                  </div>
                </Card>
              )}

              {/* Media Items */}
              {mediaItems.length > 0 && (
                <div className="mb-8 space-y-4">
                  <h3 className="text-lg font-semibold">Featured Media</h3>
                  {mediaItems.map((item, index) => (
                    <MediaPlayer
                      key={index}
                      type={item.type}
                      mediaType={item.media_type}
                      platform={item.platform}
                      url={item.type === 'local' ? item.file_url : item.url}
                      title={item.title}
                      artist={item.artist}
                    />
                  ))}
                </div>
              )}

              {/* Article Content */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-4 bg-gray-100 rounded text-xs">
                  <strong>Debug - Received Content:</strong>
                  <div className="mt-2 p-2 bg-white border rounded">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  </div>
                  <div className="mt-2 p-2 bg-gray-200 border rounded">
                    <strong>Raw HTML:</strong>
                    <pre className="whitespace-pre-wrap text-xs">{post.content}</pre>
                  </div>
                </div>
              )}
              
              <div 
                className="prose prose-lg max-w-none dark:prose-invert animate-fade-in blog-content"
                style={{
                  '--tw-prose-body': 'inherit',
                  '--tw-prose-headings': 'inherit',
                  '--tw-prose-links': 'inherit',
                  '--tw-prose-bold': 'inherit',
                  '--tw-prose-counters': 'inherit',
                  '--tw-prose-bullets': 'inherit',
                  '--tw-prose-hr': 'inherit',
                  '--tw-prose-quotes': 'inherit',
                  '--tw-prose-quote-borders': 'inherit',
                  '--tw-prose-captions': 'inherit',
                  '--tw-prose-code': 'inherit',
                  '--tw-prose-pre-code': 'inherit',
                  '--tw-prose-pre-bg': 'inherit',
                  '--tw-prose-pre-border': 'inherit',
                  '--tw-prose-th-borders': 'inherit',
                  '--tw-prose-td-borders': 'inherit'
                } as React.CSSProperties}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Custom CSS for paragraph spacing */}
              <style dangerouslySetInnerHTML={{
                __html: `
                  .blog-content p {
                    margin-bottom: 1.5rem !important;
                    min-height: 1.5rem !important;
                    line-height: 1.6 !important;
                  }
                  .blog-content p:last-child {
                    margin-bottom: 0 !important;
                  }
                  .blog-content br {
                    margin-bottom: 0.5rem !important;
                  }
                  .blog-content .mb-3 {
                    margin-bottom: 1rem !important;
                  }
                  .blog-content p:empty {
                    min-height: 2rem !important;
                    background-color: transparent !important;
                  }
                `
              }} />

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {tags.length > 0 ? tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      #{tag}
                    </Badge>
                  )) : <span className="text-muted-foreground">No tags</span>}
                </div>
              </div>

              {/* Artist social links – below hashtags */}
              {hasArtistSocial && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground mr-1">Artist:</span>
                  {artistSocial.facebook && (
                    <a href={artistSocial.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm" aria-label="Facebook">
                      <FaFacebook className="w-4 h-4" /> Facebook
                    </a>
                  )}
                  {artistSocial.x && (
                    <a href={artistSocial.x} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm" aria-label="X">
                      <FaXTwitter className="w-4 h-4" /> X
                    </a>
                  )}
                  {artistSocial.spotify && (
                    <a href={artistSocial.spotify} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm" aria-label="Spotify">
                      <FaSpotify className="w-4 h-4" /> Spotify
                    </a>
                  )}
                  {artistSocial.youtube && (
                    <a href={artistSocial.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm" aria-label="YouTube">
                      <FaYoutube className="w-4 h-4" /> YouTube
                    </a>
                  )}
                  {artistSocial.apple_music && (
                    <a href={artistSocial.apple_music} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm" aria-label="Apple Music">
                      <FaApple className="w-4 h-4" /> Apple Music
                    </a>
                  )}
                </div>
              )}

              {/* Engagement Actions */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <div className="flex items-center space-x-4">
                  
                 
                </div>
                
                <SocialShare
                  url={window.location.href}
                  title={post.title}
                  excerpt={post.excerpt}
                />
              </div>

              {/* Comments Section */}
              {commentsVisible && (
                <div className="mt-8 animate-fade-in">
                  <h3 className="text-xl font-semibold mb-6">Comments</h3>
                  <div className="space-y-6">
                    {post.comments.map((comment: any) => (
                      <div key={comment.id} className="flex space-x-4">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={comment.avatar} alt={comment.author} />
                          <AvatarFallback>{comment.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(comment.date)}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{comment.content}</p>
                          <Button size="sm" variant="ghost" className="text-xs">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {comment.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:w-1/3">
              <div className="sticky top-24 space-y-8">
                {/* Author Bio */}
                <Card className="p-6 animate-fade-in">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    About the Author
                  </h3>
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16 flex-shrink-0">
                      <AvatarImage src={authorAvatar} alt={authorName} />
                      <AvatarFallback>
                        {authorName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{authorName}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {authorBio}
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Twitter className="w-3 h-3 mr-1" />
                          Follow
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Related Articles */}
                <Card className="p-6 animate-slide-up stagger-1">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No related articles at the moment.</p>
                    ) : (
                      relatedArticles.map((article) => (
                        <Link key={article.id} to={`/blog/post/${article.id}`}>
                          <div className="group cursor-pointer">
                            <div className="flex space-x-3">
                              <img 
                                src={getImageUrl(article.hero_image_url || article.image || '')} 
                                alt={article.title}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                  {article.title}
                                </h4>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <span>{article.author_name || article.author?.name || 'Admin'}</span>
                                  <span>•</span>
                                  <span>{article.read_time || article.readTime || '—'}</span>
                                </div>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {article.genre_name || article.genre}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </Card>

                {/* Newsletter Signup */}
                <Card className="p-6 bg-gradient-primary text-primary-foreground animate-slide-up stagger-2">
                  <h3 className="font-semibold mb-2">Never Miss a Beat</h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Get the latest music reviews and industry insights delivered to your inbox.
                  </p>
                  <Button className="w-full bg-white text-primary hover:bg-white/90">
                    Subscribe to Newsletter
                  </Button>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;