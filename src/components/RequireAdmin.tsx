import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'valid' | 'denied' | 'unavailable'>('checking');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { setStatus('denied'); return; }
    const controller = new AbortController();
    setStatus('checking');
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
      .then(res => {
        if (controller.signal.aborted) return;
        if (res.status === 401 || res.status === 403 || res.status === 404) { localStorage.removeItem('adminToken'); setStatus('denied'); }
        else setStatus(res.ok ? 'valid' : 'unavailable');
      }).catch(() => { if (!controller.signal.aborted) setStatus('unavailable'); });
    return () => controller.abort();
  }, [attempt]);
  if (status === 'denied') return <Navigate to="/admin/login" replace />;
  if (status === 'unavailable') return <div className="p-8 text-center"><p className="mb-4">Unable to verify your session. Please try again.</p><Button onClick={() => setAttempt(a => a + 1)}>Retry</Button></div>;
  if (status === 'checking') return <p className="p-8 text-center">Checking your session...</p>;
  return <>{children}</>;
}
