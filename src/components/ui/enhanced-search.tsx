import { useState, useEffect } from "react";
import { Search, X, Filter, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SearchResult {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  genre: string;
  type: "post";
  url: string;
}

interface EnhancedSearchProps {
  onSearch: (term: string) => void;
  onClose: () => void;
  className?: string;
}

export function EnhancedSearch({ onSearch, onClose, className }: EnhancedSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const trendingSearches = [
    "AI music production",
    "Indie artists 2025",
    "Hip-hop trends",
    "Electronic fusion",
    "Music streaming"
  ];

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsLoading(true);
      setError(null);
      fetch(`/api/posts?search=${encodeURIComponent(searchTerm)}`)
        .then(res => res.json())
        .then(data => {
          setResults(
            data.map((post: any) => ({
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              author: post.author?.name ?? post.author_name ?? "Admin",
              date: post.created_at,
              genre: post.genre_name ?? post.genre,
              type: "post",
              url: `/blog/post/${post.id}`
            }))
          );
          setIsLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch search results");
          setIsLoading(false);
        });
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      const newRecent = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem("recentSearches", JSON.stringify(newRecent));
      onSearch(term);
      onClose();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search articles, authors, genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(searchTerm);
              }
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {searchTerm.trim() ? (
          <div className="p-4 pt-0">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
                    onClick={() => handleSearch(result.title)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm line-clamp-1">{result.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.excerpt}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {result.genre}
                          </Badge>
                          <span className="text-xs text-muted-foreground">by {result.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No results found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 pt-0">
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Recent Searches
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(search)}
                      className="text-xs"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(search)}
                    className="text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}