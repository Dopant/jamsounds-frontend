import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface AuthorProfile { id: number; name: string; bio: string; avatar: string }
interface Props { name: string; profileId?: number; onChange: (author: { name: string; id?: number }) => void }

export function AuthorPicker({ name, profileId, onChange }: Props) {
  const [authors, setAuthors] = useState<AuthorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number>();
  const [draft, setDraft] = useState({ name: '', bio: '', avatar: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const selected = authors.find(a => a.id === profileId);
  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}` });
  const load = async (signal?: AbortSignal) => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/authors', { headers: headers(), signal });
      if (!response.ok) throw new Error('Could not load authors. Check your session and try again.');
      const data: AuthorProfile[] = await response.json();
      setAuthors(data);
      if (!profileId) {
        const match = data.find(a => a.name.toLowerCase() === name.trim().toLowerCase());
        if (match) onChange({ id: match.id, name: match.name });
      }
    } catch (err) {
      if (!signal?.aborted) setError(err instanceof Error ? err.message : 'Could not load authors');
    } finally { if (!signal?.aborted) setLoading(false); }
  };
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
    // Load once for this article editor; selection changes do not refetch profiles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const begin = (profile?: AuthorProfile) => {
    setEditingId(profile?.id);
    setDraft(profile ? { name: profile.name, bio: profile.bio, avatar: profile.avatar } : { name, bio: '', avatar: '' });
    setSaveError(''); setOpen(true);
  };
  const save = async () => {
    setSaving(true); setSaveError('');
    try {
      const response = await fetch(editingId ? `/api/authors/${editingId}` : '/api/authors', {
        method: editingId ? 'PUT' : 'POST', headers: { ...headers(), 'Content-Type': 'application/json' }, body: JSON.stringify(draft)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not save author');
      const profile = data as AuthorProfile;
      setAuthors(previous => [...previous.filter(a => a.id !== profile.id), profile].sort((a, b) => a.name.localeCompare(b.name)));
      onChange({ id: profile.id, name: profile.name }); setOpen(false);
    } catch (err) { setSaveError(err instanceof Error ? err.message : 'Could not save author'); }
    finally { setSaving(false); }
  };
  return <div className="space-y-3">
    <div className="grid sm:grid-cols-[1fr_auto_auto] items-end gap-2">
      <div>
        <Label htmlFor="author">Author</Label>
        <Input id="author" list="author-profiles" value={name} disabled={loading || !!error}
          placeholder={loading ? 'Loading authors…' : 'Type or select an author'}
          onChange={event => {
            const value = event.target.value;
            const match = authors.find(a => a.name.toLowerCase() === value.trim().toLowerCase());
            onChange({ name: match?.name || value, id: match?.id });
          }} />
        <datalist id="author-profiles">{authors.map(a => <option key={a.id} value={a.name} />)}</datalist>
      </div>
      <Button type="button" variant="outline" disabled={loading || !!error} onClick={() => begin()}>Add author</Button>
      <Button type="button" variant="outline" disabled={!selected} onClick={() => begin(selected)}>Edit profile</Button>
    </div>
    {error ? <div role="alert" className="text-sm text-destructive">{error} <Button type="button" variant="outline" onClick={() => void load()}>Retry</Button></div>
      : selected ? <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selected.bio || 'No bio yet. Use Edit profile to add one.'}</p>
      : !loading && <p className="text-sm text-muted-foreground">Select an existing author or use Add author to save a new profile.</p>}
    <Dialog open={open} onOpenChange={value => { if (!saving) setOpen(value); }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editingId ? 'Edit author profile' : 'Add author'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label htmlFor="profile-name">Author name</Label><Input id="profile-name" value={draft.name} maxLength={191} disabled={saving} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} /></div>
          <div><Label htmlFor="profile-bio">Author bio</Label><Textarea id="profile-bio" value={draft.bio} maxLength={5000} rows={5} disabled={saving} onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))} /></div>
          <div><Label htmlFor="profile-avatar">Photo URL (optional)</Label><Input id="profile-avatar" value={draft.avatar} maxLength={2048} disabled={saving} placeholder="https://… or /uploads/…" onChange={e => setDraft(d => ({ ...d, avatar: e.target.value }))} /></div>
          {editingId && <p className="text-sm text-muted-foreground">Changes apply to every article linked to this author.</p>}
          {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={saving} onClick={() => setOpen(false)}>Cancel</Button><Button type="button" disabled={saving || !draft.name.trim()} onClick={() => void save()}>{saving ? 'Saving…' : 'Save author'}</Button></div>
        </div>
      </DialogContent>
    </Dialog>
  </div>;
}
