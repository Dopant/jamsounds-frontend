import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const origin = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://jamjournal.com').replace(/\/$/, '');
const description = 'Discover emerging artists from around the world through independent music reviews, artist stories, and new releases on JamJournal.';
export function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const controller = new AbortController();
    const setMeta = (name: string, content: string, property = false) => {
      const key = property ? 'property' : 'name';
      let node = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${name}"]`);
      if (!node) { node = document.createElement('meta'); node.setAttribute(key, name); document.head.append(node); }
      node.content = content;
    };
    const update = (title: string, summary: string, image: string, article = false) => {
      document.title = title;
      setMeta('description', summary);
      const publicPages = ['/', '/blog', '/about', '/contact', '/blog/submit', '/privacy', '/terms', '/dmca', '/disclaimer'];
      const indexable = publicPages.includes(pathname) || /^\/blog\/post\/\d+$/.test(pathname);
      setMeta('robots', indexable ? 'index, follow' : 'noindex, follow');
      setMeta('og:title', title, true); setMeta('og:description', summary, true); setMeta('og:url', origin + pathname, true);
      setMeta('og:type', article ? 'article' : 'website', true); setMeta('og:image', image, true);
      setMeta('twitter:title', title); setMeta('twitter:description', summary); setMeta('twitter:image', image);
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
      canonical.href = origin + pathname;
      document.getElementById('page-schema')?.remove();
    };
    const titles: Record<string, string> = { '/': 'JamJournal | Independent Music Reviews & Emerging Artists', '/blog': 'Music Reviews & Artist Stories | JamJournal', '/about': 'About JamJournal', '/contact': 'Contact JamJournal', '/blog/submit': 'Submit Your Music | JamJournal' };
    update(titles[pathname] || `${pathname.startsWith('/admin') ? 'Admin' : 'JamJournal'} | JamJournal`, description, origin + '/jamjournal-logo.png');
    if (!/^\/blog\/post\/\d+$/.test(pathname) && !pathname.startsWith('/admin')) {
      const script = document.createElement('script'); script.id = 'page-schema'; script.type = 'application/ld+json';
      script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': pathname === '/blog' ? 'Blog' : 'Organization', name: 'JamJournal', url: origin + pathname }); document.head.append(script);
    }
    if (/^\/blog\/post\/\d+$/.test(pathname)) {
      // Metadata endpoint has no view/visit side effects.
      fetch(`/api/seo/article/${pathname.split('/').pop()}`, { signal: controller.signal }).then(res => { if (!res.ok) { if (res.status === 404) setMeta('robots', 'noindex, follow'); throw new Error(); } return res.json(); }).then(data => {
        update(data.title, data.description, data.image, true);
        const script = document.createElement('script'); script.id = 'page-schema'; script.type = 'application/ld+json'; script.textContent = JSON.stringify(data.schema); document.head.append(script);
      }).catch(() => { /* Keep metadata during a transient request failure. */ });
    }
    return () => controller.abort();
  }, [pathname]);
  return null;
}
