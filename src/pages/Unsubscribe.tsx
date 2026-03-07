import { useState } from 'react';

function getEmailFromQuery() {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get('email') || '';
}

const Unsubscribe = () => {
  const [email, setEmail] = useState(getEmailFromQuery());
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to unsubscribe');
      setStatus('You have been unsubscribed.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to unsubscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Unsubscribe from Newsletter</h1>
        <form onSubmit={handleUnsubscribe} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              readOnly={!!getEmailFromQuery()}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Unsubscribing...' : 'Unsubscribe'}
          </button>
          {status && <div className={`text-center mt-2 ${status.startsWith('You have been') ? 'text-green-600' : 'text-red-600'}`}>{status}</div>}
        </form>
      </div>
    </div>
  );
};

export default Unsubscribe; 