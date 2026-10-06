import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/utils';

interface Review { id: number; title: string; excerpt?: string; hero_image_url?: string; genre_name?: string }

export function ReviewCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<number | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/posts/rediscover?limit=8', { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error('Unavailable'); return res.json(); })
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener('change', update);
    return () => { controller.abort(); media.removeEventListener('change', update); };
  }, []);
  useEffect(() => {
    if (reviews.length < 2 || paused || hovered || focused || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex(i => (i + 1) % reviews.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [reviews.length, paused, hovered, focused, reducedMotion]);
  const move = (direction: number) => setIndex(i => (i + direction + reviews.length) % reviews.length);
  const review = reviews[index];
  if (!review) return <section className="py-12 border-b"><div className="container mx-auto px-4"><h2 className="text-2xl font-playfair font-bold mb-3">Rediscover our reviews</h2><Link to="/blog" className="text-primary underline">Explore music stories from around the world</Link></div></section>;
  return (
    <section className="py-12 bg-gradient-card border-b border-border/50" aria-label="Rediscover our reviews" aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between gap-4 mb-6"><h2 className="text-2xl md:text-3xl font-playfair font-bold">Rediscover our reviews</h2>
          {reviews.length > 1 && <div className="flex gap-2">
            <Button variant="outline" size="icon" aria-label="Previous review" onClick={() => move(-1)}><ChevronLeft /></Button>
            {!reducedMotion && <Button variant="outline" size="icon" aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setPaused(p => !p)}>{paused ? <Play /> : <Pause />}</Button>}
            <Button variant="outline" size="icon" aria-label="Next review" onClick={() => move(1)}><ChevronRight /></Button>
          </div>}
        </div>
        <div onTouchStart={e => { touchStart.current = e.changedTouches[0].clientX; }} onTouchEnd={e => {
          if (touchStart.current !== null && reviews.length > 1) { const distance = e.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 50) move(distance < 0 ? 1 : -1); } touchStart.current = null;
        }}>
          <Link to={`/blog/post/${review.id}`} className="grid md:grid-cols-[240px_1fr] gap-6 items-center rounded-xl bg-card p-5 border focus-visible:outline focus-visible:outline-primary" aria-live={paused || reducedMotion ? 'polite' : 'off'}>
            {review.hero_image_url && <img src={getImageUrl(review.hero_image_url)} alt={review.title} className="w-full h-48 md:h-40 object-cover rounded-lg" loading="lazy" />}
            <div><p className="text-sm text-primary mb-2">{review.genre_name || 'Music review'}</p><h3 className="text-xl md:text-2xl font-semibold mb-3">{review.title}</h3><p className="text-muted-foreground line-clamp-2 mb-4">{review.excerpt}</p><span className="font-semibold text-primary">Read Review →</span></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
