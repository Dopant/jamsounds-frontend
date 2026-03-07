import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  TrendingUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Music,
  Clock,
  User
} from "lucide-react";
import { getApiUrl, handleSubmitMusicRedirect, getImageUrl } from "@/lib/utils";
import { FaXTwitter, FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaSpotify } from 'react-icons/fa6';

const Blog = () => {
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [sortBy, setSortBy] = useState("latest");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingLoading, setRatingLoading] = useState({});
  const [popularPosts, setPopularPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [errorPopular, setErrorPopular] = useState(null);
  const [errorRecent, setErrorRecent] = useState(null);
  const [socialLinks, setSocialLinks] = useState<any>({});
  const [genres, setGenres] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    console.log('Blog.tsx useEffect running');
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write('Blog.tsx useEffect running (server)\n');
    }
    setLoading(true);
    fetch(getApiUrl('/api/posts'))
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setPosts(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load posts:', err);
        if (typeof process !== 'undefined' && process.stdout) {
          process.stdout.write('Failed to load posts: ' + err + '\n');
        }
        setError('Failed to load posts');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoadingPopular(true);
    fetch(getApiUrl('/api/posts?category=popular&limit=4'))
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
    setLoadingRecent(true);
    fetch(getApiUrl('/api/posts?category=latest&limit=4'))
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setRecentPosts(data);
        setErrorRecent(null);
        setLoadingRecent(false);
      })
      .catch(() => {
        setErrorRecent('Failed to load recent reviews');
        setLoadingRecent(false);
      });
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

  // Filter and sort posts (filterBy handled client-side for now)
  let filteredPosts = posts
    .filter(post => {
      // Filter by genre
      if (selectedGenre !== 'All Genres' && post.genre_name !== selectedGenre) return false;
      return true;
    })
    .filter(post => {
      // Additional filterBy logic (featured/recent)
      const matchesFilter = filterBy === "all" || 
        (filterBy === "featured" && post.featured) ||
        (filterBy === "recent" && new Date(post.created_at) > new Date(Date.now() - 7*24*60*60*1000));
      return matchesFilter;
    });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (!views) return '0 views';
    if (views >= 10000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const handleRatePost = async (postId) => {
    setRatingLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      await fetch(getApiUrl(`/api/posts/${postId}/rate`), { method: 'POST' });
      setPosts((prev) => prev.map(p => p.id === postId ? { ...p, rating: (p.rating || 0) + 1 } : p));
    } finally {
      setRatingLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div>
      <PublicNavigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-playfair font-bold mb-6">
              Music Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover emerging artists, read in-depth reviews, and stay ahead of music trends
            </p>
            
            {/* Search – autocomplete, click opens article */}
            <div className="max-w-md mx-auto">
              <SearchAutocomplete
                placeholder="Search articles, artists, genres..."
                inputClassName="pl-10 py-3 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Filters and Sort */}
            <div className="mb-8 space-y-4 animate-slide-up">
              {/* Genre Filter */}
              <div className="flex flex-wrap gap-2">
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

              {/* Advanced Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="text-sm text-muted-foreground">
                  {filteredPosts.length} articles found
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {currentPosts.map((post, index) => (
                <Link key={post.id} to={`/blog/post/${post.id}`} style={{ textDecoration: 'none' }}>
                  <Card className={`article-card group animate-scale-in stagger-${index + 1}`} tabIndex={0} style={{ cursor: 'pointer' }}>
                    <div className="relative overflow-hidden">
                                              <img
                          src={getImageUrl(post.hero_image_url || post.image || '')}
                          alt={post.title}
                          className="w-full h-auto object-contain max-h-56 transition-transform duration-500 group-hover:scale-105"
                          onError={e => e.currentTarget.style.display = 'none'}
                        />
                      {/* <div className="absolute top-4 left-4 flex gap-2">
                        {post.featured && (
                          <Badge className="bg-secondary text-secondary-foreground">
                            Featured
                          </Badge>
                        )}
                        <Badge className="genre-tag">
                          {post.genre}
                        </Badge>
                      </div> */}
                      <div className="absolute top-4 right-4">
                        <button
                          className="flex items-center bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs focus:outline-none"
                          onClick={e => { e.preventDefault(); e.stopPropagation(); handleRatePost(post.id); }}
                          disabled={ratingLoading[post.id]}
                          title="Rate this post"
                        >
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {post.rating || 0}
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-2">
                          <img
                            src={getImageUrl(post.author_image || post.author?.avatar)}
                            alt={post.author_name || post.author?.name || 'Admin'}
                            className="w-6 h-6 rounded-full object-contain border"
                            style={{ minWidth: 24, minHeight: 24 }}
                            onError={(e) => {
                              console.error('Blog - Author image failed to load:', post.author_image || post.author?.avatar, 'Attempted URL:', e.currentTarget.src);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <span>{post.author_name || post.author?.name || 'Admin'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.created_at || post.date)}</span>
                        </div>
                        {/* <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{formatViews(post.views)}</span>
                        </div> */}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 sm:gap-2 animate-fade-in">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const pagesPerGroup = 5;
                    const currentGroup = Math.ceil(currentPage / pagesPerGroup);
                    if (currentGroup > 1) {
                      const previousGroupStart = (currentGroup - 2) * pagesPerGroup + 1;
                      setCurrentPage(previousGroupStart);
                    } else {
                      setCurrentPage(1);
                    }
                  }}
                  disabled={currentPage === 1}
                  className="text-xs sm:text-sm"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                
                <div className="flex items-center gap-1">
                  {(() => {
                    const pagesPerGroup = 5;
                    const currentGroup = Math.ceil(currentPage / pagesPerGroup);
                    const startPage = (currentGroup - 1) * pagesPerGroup + 1;
                    const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);
                    
                    const pages = [];
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i);
                    }
                    
                    return pages.map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm"
                      >
                        {page}
                      </Button>
                    ));
                  })()}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const pagesPerGroup = 5;
                    const currentGroup = Math.ceil(currentPage / pagesPerGroup);
                    const nextGroupStart = currentGroup * pagesPerGroup + 1;
                    if (nextGroupStart <= totalPages) {
                      setCurrentPage(nextGroupStart);
                    } else {
                      setCurrentPage(totalPages);
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-8">
              {/* Popular Posts */}
              <Card className="p-6 animate-fade-in">
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
                      <Link key={post.id} to={`/blog/post/${post.id}`}>
                        <div className="group cursor-pointer">
                          <div className="flex space-x-3">
                            <img 
                              src={getImageUrl(post.hero_image_url || post.image || '')} 
                              alt={post.title}
                              className="w-16 h-auto object-contain max-h-16 rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                {post.title}
                              </h4>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>{post.author_name || post.author?.name || 'Admin'}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                              </div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {post.genre}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </Card>

              {/* Recent Reviews */}
              <Card className="p-6 animate-slide-up stagger-1">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  Recent Reviews
                </h3>
                <div className="space-y-4">
                  {loadingRecent ? (
                    <div>Loading recent reviews...</div>
                  ) : errorRecent ? (
                    <div className="text-red-500">{errorRecent}</div>
                  ) : recentPosts.length === 0 ? (
                    <div className="text-muted-foreground">No recent reviews found.</div>
                  ) : (
                    recentPosts.map((post, index) => (
                      <Link key={post.id} to={`/blog/post/${post.id}`}>
                        <div className="group cursor-pointer">
                          <div className="flex space-x-3">
                            <img 
                              src={getImageUrl(post.hero_image_url || post.image || '')} 
                              alt={post.title}
                              className="w-16 h-auto object-contain max-h-16 rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                {post.title}
                              </h4>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>{post.author_name || post.author?.name || 'Admin'}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                              </div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {post.genre}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </Card>

              {/* Genre Categories */}
              {/* <Card className="p-6 animate-slide-up stagger-2">
                <h3 className="font-semibold mb-4">Genre Categories</h3>
                <div className="space-y-2">
                  {genres.slice(1).map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedGenre === genre
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </Card> */}

              {/* Newsletter Subscription */}
              <Card className="p-6 bg-gradient-secondary text-secondary-foreground animate-slide-up stagger-3">
                <h3 className="font-semibold mb-2">Subscribe to Newsletter</h3>
                <p className="text-secondary-foreground/80 text-sm mb-4">
                  Stay updated with the latest music reviews and industry trends
                </p>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setNewsletterStatus("");
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
                    className="bg-white/20 border-white/30 placeholder:text-secondary-foreground/60 text-secondary-foreground"
                    type="email"
                    required
                  />
                  <Button className="w-full bg-white text-secondary hover:bg-white/90" type="submit" disabled={newsletterLoading}>
                    {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                  {newsletterStatus && (
                    <div className={`text-sm mt-2 ${newsletterStatus.startsWith('Subscribed') ? 'text-green-200' : 'text-red-200'}`}>{newsletterStatus}</div>
                  )}
                </form>
              </Card>

              {/* Call to Action */}
              <Card className="p-6 bg-gradient-primary text-primary-foreground animate-slide-up stagger-4">
                <h3 className="font-semibold mb-2">Share Your Music</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Ready to get your music reviewed by our expert curators?
                </p>
                <Button className="w-full bg-white text-primary hover:bg-white/90" onClick={handleSubmitMusicRedirect}>
                  Submit Your Track
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-footer border-t border-border/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <p className="text-muted-foreground text-sm">
                We are passionate about music and dedicated to bringing you the best in music reviews, news, and trends.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/blog/submit" className="hover:text-primary transition-colors">Submit Music</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              </ul>
            </div>
            {/* <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                {genres.filter(g => g !== 'All Genres').map((genre) => (
                  <li key={genre}>
                    <Link to={`/blog?genre=${genre}`} className="hover:text-primary transition-colors">{genre}</Link>
                  </li>
                ))}
              </ul>
            </div> */}
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
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
              <p className="text-sm text-muted-foreground">
                &copy; 2023 Music Blog. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;