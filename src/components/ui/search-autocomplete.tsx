import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "@/lib/utils";

interface SearchPost {
  id: number;
  title: string;
  excerpt?: string;
  author_name?: string;
  author?: { name?: string };
  genre_name?: string;
  hero_image_url?: string;
}

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  /** Optional: when provided, navigate is not used; caller handles selection */
  onSelect?: (post: SearchPost) => void;
}

const DEBOUNCE_MS = 280;
const MIN_LENGTH = 2;
const MAX_RESULTS = 8;

export function SearchAutocomplete({
  placeholder = "Search articles, artists...",
  className = "",
  inputClassName = "",
  onSelect,
}: SearchAutocompleteProps) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [results, setResults] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const fetchResults = useCallback(async (term: string) => {
    if (!term || term.length < MIN_LENGTH) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?search=${encodeURIComponent(term)}&limit=${MAX_RESULTS}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      setOpen(true);
      setActiveIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = value.trim();
    if (t.length < MIN_LENGTH) {
      setResults([]);
      setOpen(false);
      return;
    }
    const id = window.setTimeout(() => fetchResults(t), DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [value, fetchResults]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (post: SearchPost) => {
    setOpen(false);
    setValue("");
    setResults([]);
    if (onSelect) {
      onSelect(post);
    } else {
      navigate(`/blog/post/${post.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
      return;
    }
    if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => value.trim().length >= MIN_LENGTH && results.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          className={`pl-10 ${inputClassName}`}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          role="combobox"
        />
      </div>
      {open && (value.trim().length >= MIN_LENGTH || results.length > 0) && (
        <ul
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-auto rounded-lg border bg-background shadow-lg py-1"
          role="listbox"
        >
          {loading ? (
            <li className="px-4 py-3 text-sm text-muted-foreground">Searching...</li>
          ) : results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted-foreground">No articles found.</li>
          ) : (
            results.map((post, index) => (
              <li
                key={post.id}
                role="option"
                aria-selected={index === activeIndex}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                  index === activeIndex ? "bg-muted" : "hover:bg-muted/70"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelect(post)}
              >
                {post.hero_image_url ? (
                  <img
                    src={getImageUrl(post.hero_image_url)}
                    alt=""
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-muted flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {post.author_name || post.author?.name || "Admin"}
                    {post.genre_name && ` · ${post.genre_name}`}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
