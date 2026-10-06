import { useState, useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getImageUrl } from '@/lib/utils';
interface SearchPost { id: number; title: string; excerpt?: string; author_name?: string; genre_name?: string; hero_image_url?: string }
interface Props { placeholder?: string; className?: string; inputClassName?: string; onSelect?: (post: SearchPost) => void }
export function SearchAutocomplete({ placeholder = 'Search articles, artists, genres...', className = '', inputClassName = '', onSelect }: Props) {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [results, setResults] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0, maxHeight: 320 });
  const container = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const request = useRef<AbortController | null>(null);
  const listId = useId();
  useEffect(() => {
    const term = value.trim();
    if (term.length < 2) { setOpen(false); setLoading(false); return; }
    const controller = new AbortController(); request.current = controller;
    setLoading(true); setError(false); setOpen(true);
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/posts?search=${encodeURIComponent(term)}&limit=8`, { signal: controller.signal });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!controller.signal.aborted) setResults(Array.isArray(data) ? data : []);
      } catch { if (!controller.signal.aborted) { setResults([]); setError(true); } }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 280);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [value]);
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const box = container.current?.getBoundingClientRect(); if (!box) return;
      const below = window.innerHeight - box.bottom - 12;
      const height = Math.min(320, Math.max(100, below >= 160 ? below : box.top - 12));
      setPosition({ left: box.left, top: below >= 160 ? box.bottom + 4 : Math.max(4, box.top - height - 4), width: box.width, maxHeight: height });
    };
    update(); window.addEventListener('resize', update); window.addEventListener('scroll', update, true);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [open]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node) && !list.current?.contains(event.target as Node)) setOpen(false); };
    const focusOutside = (event: FocusEvent) => { if (!container.current?.contains(event.target as Node) && !list.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside); document.addEventListener('focusin', focusOutside);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('focusin', focusOutside); };
  }, []);
  useEffect(() => { list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }); }, [active]);
  const select = (post: SearchPost) => { request.current?.abort(); setOpen(false); setValue(''); setResults([]); if (onSelect) onSelect(post); else navigate(`/blog/post/${post.id}`); };
  return <div ref={container} className={`relative ${className}`}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    <Input placeholder={placeholder} value={value} className={`pl-10 ${inputClassName}`} autoComplete="off" aria-label={placeholder}
      role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
      onChange={e => { request.current?.abort(); setValue(e.target.value); setResults([]); setActive(-1); }}
      onFocus={() => { if (value.trim().length >= 2) setOpen(true); }}
      onKeyDown={e => {
        if (e.key === 'Escape') { setOpen(false); setActive(-1); }
        else if (open && results.length && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); setActive(i => e.key === 'ArrowDown' ? (i + 1) % results.length : (i - 1 + results.length) % results.length); }
        else if (open && e.key === 'Enter' && results[active]) { e.preventDefault(); select(results[active]); }
      }} />
    {open && createPortal(<ul ref={list} id={listId} role="listbox" style={position} className="fixed z-[100] overflow-auto rounded-lg border bg-background shadow-lg py-1">
      {loading || error || !results.length ? <li className="px-4 py-3 text-sm text-muted-foreground" role="presentation">{loading ? 'Searching...' : error ? 'Search unavailable. Please try again.' : 'No articles found.'}</li> : results.map((post, index) => <li key={post.id} id={`${listId}-${index}`} role="option" aria-selected={index === active}
        className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer ${index === active ? 'bg-muted' : 'hover:bg-muted/70'}`} onMouseEnter={() => setActive(index)} onClick={() => select(post)}>
        {post.hero_image_url && <img src={getImageUrl(post.hero_image_url)} alt="" className="w-10 h-10 rounded object-cover shrink-0" />}
        <div className="min-w-0"><p className="font-medium text-sm truncate">{post.title}</p><p className="text-xs text-muted-foreground truncate">{post.genre_name || 'Music review'}{post.author_name && ` · ${post.author_name}`}</p></div>
      </li>)}
    </ul>, document.body)}
  </div>;
}
