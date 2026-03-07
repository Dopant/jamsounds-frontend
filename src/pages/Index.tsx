import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { 
  Music, 
  Star, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Play,
  Heart,
  Share2,
  Filter,
  Search
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { getApiUrl, handleSubmitMusicRedirect, getImageUrl } from "@/lib/utils";
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";
import Unsubscribe from './Unsubscribe';
import { FaXTwitter, FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaSpotify } from 'react-icons/fa6';

const Index = () => {
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [email, setEmail] = useState("");
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState(null);
  const [errorLatest, setErrorLatest] = useState(null);
  const [errorPopular, setErrorPopular] = useState(null);
  const [homepageStats, setHomepageStats] = useState({
    artists_featured_count: '',
    reviews_published_count: '',
    monthly_readers_count: ''
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [homepageContent, setHomepageContent] = useState({
    homepage_title: '',
    homepage_subtitle: '',
    homepage_description: '',
    homepage_logo_url: ''
  });
  const [homepageContentLoading, setHomepageContentLoading] = useState(true);
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState<any>({});
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    console.log('Index.tsx loaded');
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write('Index.tsx loaded (server)\n');
    }
  }, []);

  useEffect(() => {
    setLoadingLatest(true);
    const genreParam = selectedGenre !== 'All Genres' ? `&genre=${encodeURIComponent(selectedGenre)}` : '';
    fetch(getApiUrl(`/api/posts?category=latest&limit=6${genreParam}`))
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setLatestPosts(data);
        setErrorLatest(null);
        setLoadingLatest(false);
      })
      .catch(() => {
        setErrorLatest('Failed to load latest posts');
        setLoadingLatest(false);
      });
  }, [selectedGenre]);

  useEffect(() => {
    // Log when the featured posts fetch starts
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write('Fetching featured posts...\n');
    }
    setLoadingFeatured(true);
    fetch(getApiUrl('/api/posts?category=featured&limit=4'))
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (typeof process !== 'undefined' && process.stdout) {
          process.stdout.write('Featured posts data: ' + JSON.stringify(data) + '\n');
        }
        setFeaturedPosts(data);
        setErrorFeatured(null);
        setLoadingFeatured(false);
      })
      .catch((err) => {
        if (typeof process !== 'undefined' && process.stdout) {
          process.stdout.write('Failed to load featured posts: ' + err + '\n');
        }
        setErrorFeatured('Failed to load featured posts');
        setLoadingFeatured(false);
      });
  }, []);

  useEffect(() => {
    setLoadingPopular(true);
    fetch(getApiUrl('/api/posts?category=popular&limit=3'))
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setPopularPosts(data);
        setErrorPopular(null);
        setLoadingPopular(false);
      })
      .catch(() => {
        setErrorPopular('Failed to load popular posts');
        setLoadingPopular(false);
      });
  }, []);

  useEffect(() => {
    async function fetchHomepageStats() {
      try {
        const res = await fetch('/api/auth/homepage-stats');
        if (!res.ok) return;
        const data = await res.json();
        setHomepageStats(data);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchHomepageStats();
  }, []);

  useEffect(() => {
    async function fetchHomepageContent() {
      try {
        const res = await fetch('/api/auth/settings/homepage-content');
        if (!res.ok) return;
        const data = await res.json();
        setHomepageContent(data);
      } finally {
        setHomepageContentLoading(false);
      }
    }
    fetchHomepageContent();
  }, []);

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

  useEffect(() => {
    // Fetch genres dynamically
    fetch('/api/genres')
      .then(res => res.json())
      .then(data => {
        setGenres(['All Genres', ...data.map((g: any) => g.name)]);
      })
      .catch(() => setGenres(['All Genres']));
  }, []);

  useEffect(() => {
    // Inject Tawk.to chat bot script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/6877fa9390f2ce1914205220/1j0aalled';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Add view formatting helper
  const formatViews = (views) => {
    if (!views) return '0 views';
    if (views >= 10000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  // Latest posts are now fetched by genre from API when selectedGenre changes
  const filteredLatestPosts = latestPosts;

  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />
      
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Music Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
             
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">  </span>
            </h1>
            <h2 className="text-2xl lg:text-3xl font-playfair font-semibold text-white mb-4 leading-tight">
              {homepageContent.homepage_subtitle || 'Where Music Stories Come Alive'}
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              {homepageContent.homepage_description || "Discover emerging artists, read exclusive reviews, and explore the sounds shaping tomorrow's music scene."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-1">
              <Button className="btn-hero text-lg px-8 py-3" onClick={handleSubmitMusicRedirect}>
                Submit Your Music
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link to="/blog">
                <Button variant="outline" className="text-lg px-8 py-3 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                  Explore Articles
                  <Music className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-scale-in stagger-1">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {statsLoading ? '...' : homepageStats.artists_featured_count || '2.5K+'}
              </div>
              <p className="text-muted-foreground">Artists Featured</p>
            </div>
            <div className="text-center animate-scale-in stagger-2">
              <div className="text-3xl lg:text-4xl font-bold text-secondary mb-2">
                {statsLoading ? '...' : homepageStats.reviews_published_count || '15K+'}
              </div>
              <p className="text-muted-foreground">Reviews Published</p>
            </div>
            <div className="text-center animate-scale-in stagger-3">
              <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">
                {statsLoading ? '...' : homepageStats.monthly_readers_count || '1M+'}
              </div>
              <p className="text-muted-foreground">Monthly Readers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold mb-4">Featured Articles</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dive deep into our most compelling stories and reviews
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {loadingFeatured ? (
              <div>Loading featured articles...</div>
            ) : errorFeatured ? (
              <div className="text-red-500">{errorFeatured}</div>
            ) : featuredPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No featured articles available.</div>
            ) : (
              featuredPosts.map((post, index) => (
                <Link key={post.id} to={`/blog/post/${post.id}`}>
                  <Card className={`article-card group animate-slide-up stagger-${index + 1}`}>
                    <div className="relative overflow-hidden">
                      <img 
                        src={getImageUrl(post.hero_image_url || post.image || '')} 
                        alt={post.title}
                        className="w-full h-auto object-contain max-h-64 lg:max-h-80 transition-transform duration-500 group-hover:scale-105"
                        onError={e => e.currentTarget.style.display = 'none'}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="genre-tag">
                          {post.genre}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-playfair font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                                                      <img
                              src={getImageUrl(post.author_image || post.author?.avatar)}
                              alt={post.author_name || post.author?.name || 'Admin'}
                              className="w-8 h-8 rounded-full object-contain border"
                              style={{ minWidth: 32, minHeight: 32 }}
                              onError={(e) => {
                                console.error('Author image failed to load:', post.author_image || post.author?.avatar, 'Attempted URL:', e.currentTarget.src);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <span>{post.author_name || post.author?.name || 'Admin'}</span>
                          <span>•</span>
                          <span>{new Date(post.created_at || post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        {/* <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{post.rating}</span>
                           <TrendingUp className="w-4 h-4 ml-2" />
                          <span>{formatViews(post.views)}</span> 
                        </div> */}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest Posts Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-8 animate-fade-in">
                <h2 className="text-3xl lg:text-4xl font-playfair font-bold">Latest Posts</h2>
                <Link to="/blog">
                  <Button variant="outline">
                    View All
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              {/* Genre Filter */}
              <div className="flex flex-wrap gap-2 mb-8 animate-slide-up">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedGenre === genre
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border hover:border-primary"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              {/* Posts Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {loadingLatest ? (
                  <div>Loading latest posts...</div>
                ) : errorLatest ? (
                  <div className="text-red-500">{errorLatest}</div>
                ) : filteredLatestPosts.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <h2 className="text-xl font-semibold mb-2">No posts available, come back later.</h2>
                  </div>
                ) : (
                  filteredLatestPosts.map((post, index) => (
                    <Link key={post.id} to={`/blog/post/${post.id}`}>
                      <Card className={`article-card group animate-scale-in stagger-${index + 1}`}>
                        <div className="relative overflow-hidden">
                          <img 
                            src={getImageUrl(post.hero_image_url || post.image || '')} 
                            alt={post.title}
                            className="w-full h-auto object-contain max-h-48 transition-transform duration-500 group-hover:scale-105"
                            onError={e => e.currentTarget.style.display = 'none'}
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className="genre-tag">
                              {post.genre_name}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                                                                  <img
                            src={getImageUrl(post.author_image || post.author?.avatar)}
                            alt={post.author_name || post.author?.name || 'Admin'}
                            className="w-6 h-6 rounded-full object-contain border"
                            style={{ minWidth: 24, minHeight: 24 }}
                            onError={(e) => {
                              console.error('Author image failed to load:', post.author_image || post.author?.avatar, 'Attempted URL:', e.currentTarget.src);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <span>{post.author_name || post.author?.name || 'Admin'}</span>
                              <span>•</span>
                              <span>{post.readTime}</span>
                              <span>•</span>
                              <span>{new Date(post.created_at || post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            {/* <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{post.rating}</span>
                              <TrendingUp className="w-4 h-4 ml-2" />
                              <span>{formatViews(post.views)}</span>
                            </div> */}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-24 space-y-8">
                {/* Search – autocomplete, click opens article */}
                <Card className="p-6 animate-fade-in">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Search Articles
                  </h3>
                  <SearchAutocomplete placeholder="Search by title, artist, genre..." />
                </Card>
                {/* Popular Posts */}
                <Card className="p-6 animate-slide-up stagger-1">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Popular This Week
                  </h3>
                  <div className="space-y-4">
                    {loadingPopular ? (
                      <div>Loading popular posts...</div>
                    ) : errorPopular ? (
                      <div className="text-red-500">{errorPopular}</div>
                    ) : popularPosts.length === 0 ? (
                      <div className="text-muted-foreground">No popular posts found.</div>
                    ) : (
                      popularPosts.map((post, index) => (
                        <div key={index} className="flex items-start space-x-3 group cursor-pointer">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                              <span>{post.genre}</span>
                              <span>•</span>
                              <span>{post.views} views</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                {/* Newsletter Signup */}
                <Card className="p-6 bg-gradient-primary text-primary-foreground animate-slide-up stagger-2">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Music className="w-5 h-5 mr-2" />
                    Stay in the Loop
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Get the latest music reviews and artist spotlights delivered to your inbox.
                  </p>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setNewsletterStatus('');
                      setNewsletterLoading(true);
                      try {
                        const res = await fetch('/api/newsletter/subscribe', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.message || 'Failed to subscribe');
                        setNewsletterStatus('Subscribed! Check your inbox.');
                        setEmail('');
                      } catch (err) {
                        setNewsletterStatus(err instanceof Error ? err.message : 'Failed to subscribe');
                      } finally {
                        setNewsletterLoading(false);
                      }
                    }}
                    className="space-y-3"
                  >
                    <Input
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/20 border-white/30 placeholder:text-primary-foreground/60 text-primary-foreground"
                      type="email"
                      required
                    />
                    <Button className="w-full bg-white text-primary hover:bg-white/90" type="submit" disabled={newsletterLoading}>
                      {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                    {newsletterStatus && (
                      <div className={`text-sm mt-2 ${newsletterStatus.startsWith('Subscribed') ? 'text-green-200' : 'text-red-200'}`}>{newsletterStatus}</div>
                    )}
                  </form>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6 animate-slide-up stagger-3">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={handleSubmitMusicRedirect}>
                      <Music className="w-4 h-4 mr-2" />
                      Submit Your Music
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold mb-6">
              Ready to Share Your Sound?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of artists who've found their audience through our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={handleSubmitMusicRedirect}>
                Submit Music Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link to="/blog">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Explore Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                {homepageContent.homepage_logo_url ? (
                  <img src={homepageContent.homepage_logo_url} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
                {/* Remove homepage title from footer to avoid duplicate rendering */}
              </div>
              <p className="text-background/70 mb-4 max-w-md">
                {homepageContent.homepage_description || 'The premier music blog platform where stories come alive through in-depth reviews, artist spotlights, and exclusive content.'}
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="text-background/70 hover:text-background">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-background/70 hover:text-background">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-background/70 hover:text-background">
                  <Music className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Content</h4>
              <div className="space-y-2 text-background/70">
                <Link to="/blog" className="block hover:text-background transition-colors">All Articles</Link>
                <Link to="#" className="block hover:text-background transition-colors" onClick={e => { e.preventDefault(); handleSubmitMusicRedirect(); }}>Submit Music</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <div className="space-y-2 text-background/70">
                <Link to="/about" className="block hover:text-background transition-colors">About Us</Link>
                <Link to="/contact" className="block hover:text-background transition-colors">Contact</Link>
                <Link to="/privacy" className="block hover:text-background transition-colors">Privacy</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-12 pt-8 text-center text-background/60">
            <div className="flex space-x-4 mb-4">
              {socialLinks.social_x_url && (
                <a href={socialLinks.social_x_url} target="_blank" rel="noopener noreferrer" aria-label="X">
                  <FaXTwitter className="w-6 h-6 hover:text-primary transition-colors" />
                </a>
              )}
              {socialLinks.social_facebook_url && (
                <a href={socialLinks.social_facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebook className="w-6 h-6 hover:text-primary transition-colors" />
                </a>
              )}
              {socialLinks.social_instagram_url && (
                <a href={socialLinks.social_instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram className="w-6 h-6 hover:text-primary transition-colors" />
                </a>
              )}
              {socialLinks.social_youtube_url && (
                <a href={socialLinks.social_youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <FaYoutube className="w-6 h-6 hover:text-primary transition-colors" />
                </a>
              )}
              {socialLinks.social_tiktok_url && (
                <a href={socialLinks.social_tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <FaTiktok className="w-6 h-6 hover:text-primary transition-colors" />
                </a>
              )}
              {socialLinks.social_spotify_url && (
                <a href={socialLinks.social_spotify_url} target="_blank" rel="noopener noreferrer" aria-label="Spotify">
                  <FaSpotify className="w-6 h-6 hover:text-primary transition-colors" />
                </a>
              )}
            </div>
            <p>&copy; 2023 JAM JOURNAL SOUND. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
