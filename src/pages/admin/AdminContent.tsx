import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostEditor } from "@/components/admin/PostEditor";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priorityUpdating, setPriorityUpdating] = useState<string | null>(null);
  const [genres, setGenres] = useState<any[]>([]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts?sortBy=priority');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setPosts(data);
      setError(null);
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetch('/api/genres');
      if (!res.ok) throw new Error('Failed to fetch genres');
      const data = await res.json();
      setGenres(data);
    } catch {
      setGenres([]);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchGenres();
  }, []);

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowPostEditor(true);
  };

  const handleEditPost = async (post: any) => {
    // Fetch full post with media
    try {
      const res = await fetch(`/api/posts/${post.id}`);
      if (!res.ok) throw new Error('Failed to fetch post details');
      const fullPost = await res.json();
      setEditingPost({
        id: fullPost.id,
        title: fullPost.title || '',
        excerpt: fullPost.excerpt || '',
        content: fullPost.content || '',
        author: fullPost.author?.name || '',
        genre_id: fullPost.genre_id || '',
        genre_name: fullPost.genre_name || '',
        tags: typeof fullPost.tags === 'string' ? fullPost.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : (fullPost.tags || []),
        featured: !!fullPost.featured,
        heroImageUrl: fullPost.hero_image_url || '',
        mediaItems: Array.isArray(fullPost.media)
          ? fullPost.media.map((m: any) => ({
              id: String(m.id || m.media_id || m._id || Date.now()),
              type: m.type === 'external' ? 'external' : 'local',
              mediaType: m.media_type || 'audio',
              platform: m.platform || '',
              url: m.url || '',
              title: m.title || '',
              artist: m.artist || '',
            }))
          : [],
        categories: Array.isArray(fullPost.categories) ? fullPost.categories : [],
        created_at: fullPost.created_at || '',
        artist_social_links: (() => {
          try {
            const raw = fullPost.artist_social_links;
            if (typeof raw === 'string') return JSON.parse(raw) || {};
            return raw && typeof raw === 'object' ? raw : {};
          } catch { return {}; }
        })(),
      });
      setShowPostEditor(true);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load post details', variant: 'destructive' });
    }
  };

  const handleSavePost = async (formData: any, isEdit: boolean) => {
    try {
      let response;
      if (editingPost && isEdit) {
        response = await fetch(`/api/posts/${editingPost.id}`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
          },
          body: formData
        });
      } else {
        response = await fetch(`/api/posts`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
          },
          body: formData
        });
      }
      if (!response.ok) throw new Error("Failed to save post");
      const updatedPost = await response.json();
      toast({
        title: "Post saved!",
        description: editingPost ? "Post updated successfully" : "New post created successfully"
      });
      setShowPostEditor(false);
      setEditingPost(null);
      if (editingPost && isEdit) {
        // Update the post in the list with the returned data
        setPosts(posts => posts.map(p => p.id === updatedPost.id ? updatedPost : p));
      } else {
        fetchPosts();
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    setShowPostEditor(false);
    setEditingPost(null);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        }
      });
      if (!response.ok) throw new Error("Failed to delete post");
      toast({ title: "Post deleted", description: "The post has been permanently deleted." });
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handlePriorityChange = async (postId: string, newPriority: number) => {
    setPriorityUpdating(postId);
    try {
      const response = await fetch(`/api/posts/${postId}/priority`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        },
        body: JSON.stringify({ priority: newPriority })
      });
      if (!response.ok) throw new Error("Failed to update priority");
      toast({ title: "Priority updated" });
      fetchPosts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setPriorityUpdating(null);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || (post.featured ? "published" : "draft") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (showPostEditor) {
    return (
      <PostEditor
        initialData={editingPost}
        genres={genres}
        onSave={handleSavePost}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
            <Button onClick={handleCreatePost}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Post
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList>
              <TabsTrigger value="posts">Blog Posts</TabsTrigger>
              <TabsTrigger value="genres">Genre/Category</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Posts List */}
              <div className="grid gap-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{post.title}</h3>
                            {post.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {post.priority > 0 && (
                              <Badge className="bg-blue-100 text-blue-800">
                                Priority: {post.priority}
                              </Badge>
                            )}
                            <Badge variant={post.featured ? "default" : "secondary"}>
                              {post.featured ? "published" : "published"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{post.author?.name || "Admin"}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views?.toLocaleString?.() ?? 0} views</span>
                            </div>
                            <Badge variant="outline">{post.genre}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-4 min-w-[120px]">
                          <div className="flex items-center space-x-2">
                            <label htmlFor={`priority-${post.id}`} className="text-xs text-muted-foreground">Priority</label>
                            <Input
                              id={`priority-${post.id}`}
                              type="number"
                              min={0}
                              value={post.priority || 0}
                              disabled={priorityUpdating === post.id}
                              onChange={e => handlePriorityChange(post.id, parseInt(e.target.value, 10) || 0)}
                              className="w-16 text-center"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditPost(post)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`/blog/post/${post.id}`, '_blank')}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="genres" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Genres/Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={async e => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const name = (form.elements.namedItem('newGenre') as HTMLInputElement).value.trim();
                      if (!name) return;
                      const res = await fetch('/api/genres', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
                        },
                        body: JSON.stringify({ name })
                      });
                      if (res.ok) {
                        fetchGenres();
                        form.reset();
                        toast({ title: 'Genre added!' });
                      } else {
                        toast({ title: 'Error', description: 'Failed to add genre', variant: 'destructive' });
                      }
                    }}
                    className="flex gap-2 mb-4"
                  >
                    <Input name="newGenre" placeholder="Add new genre/category..." />
                    <Button type="submit">Add</Button>
                  </form>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {genres.map((genre: any) => (
                          <tr key={genre.id}>
                            <td className="py-2">
                              <input
                                className="bg-transparent border-b border-muted focus:outline-none focus:border-primary"
                                defaultValue={genre.name}
                                onBlur={async e => {
                                  const newName = e.target.value.trim();
                                  if (newName && newName !== genre.name) {
                                    const res = await fetch(`/api/genres/${genre.id}`, {
                                      method: 'PUT',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
                                      },
                                      body: JSON.stringify({ name: newName })
                                    });
                                    if (res.ok) {
                                      fetchGenres();
                                      toast({ title: 'Genre updated!' });
                                    } else {
                                      toast({ title: 'Error', description: 'Failed to update genre', variant: 'destructive' });
                                    }
                                  }
                                }}
                              />
                            </td>
                            <td className="py-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={async () => {
                                  if (!window.confirm('Delete this genre?')) return;
                                  const res = await fetch(`/api/genres/${genre.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
                                    }
                                  });
                                  if (res.ok) {
                                    fetchGenres();
                                    toast({ title: 'Genre deleted!' });
                                  } else {
                                    toast({ title: 'Error', description: 'Failed to delete genre', variant: 'destructive' });
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;