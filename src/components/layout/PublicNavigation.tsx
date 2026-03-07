import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Music, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import jamJournalLogo from "@/assets/jam-journal-logo.png";
import { handleSubmitMusicRedirect } from "@/lib/utils";
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";

const PublicNavigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [homepageContent, setHomepageContent] = useState({ homepage_logo_url: '', homepage_title: '' });

  useEffect(() => {
    let isMounted = true;
    async function fetchHomepageContent() {
      try {
        const res = await fetch('/api/auth/settings/homepage-content');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) setHomepageContent(data);
      } catch {}
    }
    fetchHomepageContent();
    return () => { isMounted = false; };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/blog", label: "Blog", icon: Music },
    { label: "Submit Music", icon: Music, onClick: handleSubmitMusicRedirect },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={homepageContent.homepage_logo_url || jamJournalLogo} 
              alt={homepageContent.homepage_title } 
              className="h-8 w-auto"
            />
            <span className="font-playfair font-bold text-xl">{homepageContent.homepage_title }</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, idx) => (
              item.onClick ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
            <ThemeToggle />
          </div>

          {/* Search Bar – autocomplete, click opens article */}
          <div className="hidden lg:flex items-center space-x-4 w-64">
            <SearchAutocomplete
              placeholder="Search articles, artists..."
              inputClassName="bg-muted rounded-lg border-0 focus:ring-2 focus:ring-primary w-full"
            />
          </div>


          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      item.onClick();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavigation;