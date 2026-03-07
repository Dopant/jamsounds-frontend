import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { 
  Plus, 
  X, 
  Upload, 
  ExternalLink, 
  Music, 
  Video,
  Image,
  Save,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  type: "external" | "local";
  mediaType: "audio" | "video";
  platform?: "spotify" | "soundcloud" | "youtube" | "apple-music";
  url?: string;
  file?: File;
  title: string;
  artist: string;
}

interface ArtistSocialLinks {
  facebook?: string;
  x?: string;
  spotify?: string;
  youtube?: string;
  apple_music?: string;
}

interface PostData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage?: File;
  authorImageUrl?: string;
  genre_id?: number | string;
  genre_name?: string;
  tags: string[];
  featured: boolean;
  heroImage?: File;
  heroImageUrl?: string;
  mediaItems: MediaItem[];
  created_at?: string;
  categories: string[];
  artist_social_links?: ArtistSocialLinks;
}

interface PostEditorProps {
  initialData?: Partial<PostData>;
  genres: Array<{ id: number; name: string }>;
  onSave: (data: FormData, isEdit: boolean) => void;
  onCancel: () => void;
}

export function PostEditor({ initialData, genres, onSave, onCancel }: PostEditorProps) {
  const [postData, setPostData] = useState<PostData>({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    author: initialData?.author || "",
    authorImageUrl: initialData?.authorImageUrl || "",
    genre_id: initialData?.genre_id || (genres[0]?.id ?? ''),
    genre_name: initialData?.genre_name || '',
    tags: initialData?.tags || [],
    featured: initialData?.featured || false,
    heroImageUrl: initialData?.heroImageUrl || "",
    mediaItems: initialData?.mediaItems || [],
    created_at: initialData?.created_at || '',
    categories: initialData?.categories || [],
    artist_social_links: initialData?.artist_social_links || { facebook: '', x: '', spotify: '', youtube: '', apple_music: '' },
  });

  const [newTag, setNewTag] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();

  // Add categories state
  const categoryOptions = ["featured", "latest", "popular"];
  const [categories, setCategories] = useState<string[]>(initialData?.categories || []);

  const handleAddTag = () => {
    if (newTag.trim() && !postData.tags.includes(newTag.trim())) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddMediaItem = () => {
    const newItem: MediaItem = {
      id: Date.now().toString(),
      type: "external",
      mediaType: "audio",
      platform: "spotify",
      url: "",
      title: "",
      artist: ""
    };

    setPostData(prev => ({
      ...prev,
      mediaItems: [...prev.mediaItems, newItem]
    }));
  };

  const handleUpdateMediaItem = (id: string, updates: Partial<MediaItem>) => {
    setPostData(prev => ({
      ...prev,
      mediaItems: prev.mediaItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const handleRemoveMediaItem = (id: string) => {
    setPostData(prev => ({
      ...prev,
      mediaItems: prev.mediaItems.filter(item => item.id !== id)
    }));
  };

  const handleFileUpload = (id: string, file: File) => {
    handleUpdateMediaItem(id, { file, url: URL.createObjectURL(file) });
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostData(prev => ({
        ...prev,
        heroImage: file,
        heroImageUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleAuthorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostData(prev => ({
        ...prev,
        authorImage: file,
        authorImageUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleCategoryChange = (cat: string) => {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSave = () => {
    if (!postData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please add a title for your post.",
        variant: "destructive"
      });
      return;
    }
    if (!postData.content.trim()) {
      toast({
        title: "Missing content",
        description: "Please add content for your post.",
        variant: "destructive"
      });
      return;
    }

    // Validate author name
    if (!postData.author.trim()) {
      toast({
        title: "Missing author",
        description: "Please enter an author name for the post.",
        variant: "destructive"
      });
      return;
    }
    // Build FormData for multipart/form-data
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("excerpt", postData.excerpt);
    formData.append("content", postData.content);
    
    // Debug: Log what's being sent
    console.log('Saving post with content:', postData.content);
    console.log('Content type:', typeof postData.content);
    console.log('Content length:', postData.content?.length);
    formData.append("author_name", postData.author);
    formData.append("genre_id", String(postData.genre_id));
    formData.append("tags", postData.tags.join(","));
    formData.append("featured", String(postData.featured));
    if (postData.heroImage) {
      formData.append("heroImage", postData.heroImage);
    }
    
    // Add author image if provided
    if (postData.authorImage) {
      formData.append("authorImage", postData.authorImage);
    }
    // Add created_at if present
    if (postData.created_at) {
      formData.append("created_at", postData.created_at);
    }
    // Add categories
    categories.forEach(cat => formData.append("categories", cat));
    // Artist social links
    const artistSocial = postData.artist_social_links || {};
    if (Object.keys(artistSocial).length) {
      formData.append("artist_social_links", JSON.stringify(artistSocial));
    }
    // Add media items (local files only)
    postData.mediaItems.forEach((item, idx) => {
      if (item.type === "local" && item.file) {
        formData.append(`mediaFiles`, item.file);
        formData.append(`mediaTypes`, item.mediaType);
        formData.append(`mediaTitles`, item.title);
        formData.append(`mediaArtists`, item.artist);
      } else if (item.type === "external") {
        formData.append(`externalMediaUrls`, item.url || "");
        formData.append(`externalMediaTypes`, item.mediaType);
        formData.append(`externalMediaPlatforms`, item.platform || "");
        formData.append(`externalMediaTitles`, item.title);
        formData.append(`externalMediaArtists`, item.artist);
      }
    });
    onSave(formData, !!initialData);
    toast({
      title: "Post saved!",
      description: "Your blog post has been saved successfully."
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {initialData ? "Edit Post" : "Create New Post"}
        </h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? "Edit" : "Preview"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Post
          </Button>
        </div>
      </div>

      {!isPreview ? (
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={postData.title}
                  onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title..."
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={postData.excerpt}
                  onChange={(e) => setPostData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post..."
                  rows={3}
                />
              </div>
              {/* Created At */}
              <div>
                <Label htmlFor="created_at">Created At</Label>
                <Input
                  id="created_at"
                  type="datetime-local"
                  value={postData.created_at ? postData.created_at.slice(0, 16) : ''}
                  onChange={e => setPostData(prev => ({ ...prev, created_at: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={postData.author}
                    onChange={(e) => setPostData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <Label htmlFor="genre_id">Genre</Label>
                  <Select
                    value={String(postData.genre_id)}
                    onValueChange={(value) => setPostData(prev => ({ ...prev, genre_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map(genre => (
                        <SelectItem key={genre.id} value={String(genre.id)}>{genre.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Artist social media */}
              <div className="pt-4 border-t">
                <Label className="text-base">Artist social media</Label>
                <p className="text-sm text-muted-foreground mb-3">Optional links for the featured artist (shown on the post page).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="artist_facebook" className="text-xs">Facebook</Label>
                    <Input
                      id="artist_facebook"
                      value={postData.artist_social_links?.facebook || ''}
                      onChange={(e) => setPostData(prev => ({
                        ...prev,
                        artist_social_links: { ...(prev.artist_social_links || {}), facebook: e.target.value }
                      }))}
                      placeholder="https://facebook.com/artist"
                    />
                  </div>
                  <div>
                    <Label htmlFor="artist_x" className="text-xs">X (Twitter)</Label>
                    <Input
                      id="artist_x"
                      value={postData.artist_social_links?.x || ''}
                      onChange={(e) => setPostData(prev => ({
                        ...prev,
                        artist_social_links: { ...(prev.artist_social_links || {}), x: e.target.value }
                      }))}
                      placeholder="https://x.com/artist"
                    />
                  </div>
                  <div>
                    <Label htmlFor="artist_spotify" className="text-xs">Spotify</Label>
                    <Input
                      id="artist_spotify"
                      value={postData.artist_social_links?.spotify || ''}
                      onChange={(e) => setPostData(prev => ({
                        ...prev,
                        artist_social_links: { ...(prev.artist_social_links || {}), spotify: e.target.value }
                      }))}
                      placeholder="https://open.spotify.com/artist/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="artist_youtube" className="text-xs">YouTube</Label>
                    <Input
                      id="artist_youtube"
                      value={postData.artist_social_links?.youtube || ''}
                      onChange={(e) => setPostData(prev => ({
                        ...prev,
                        artist_social_links: { ...(prev.artist_social_links || {}), youtube: e.target.value }
                      }))}
                      placeholder="https://youtube.com/artist"
                    />
                  </div>
                  <div>
                    <Label htmlFor="artist_apple_music" className="text-xs">Apple Music</Label>
                    <Input
                      id="artist_apple_music"
                      value={postData.artist_social_links?.apple_music || ''}
                      onChange={(e) => setPostData(prev => ({
                        ...prev,
                        artist_social_links: { ...(prev.artist_social_links || {}), apple_music: e.target.value }
                      }))}
                      placeholder="https://music.apple.com/artist/..."
                    />
                  </div>
                </div>
              </div>

              {/* Author Image */}
              <div className="space-y-4">
                <div>
                  <Label>Author Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAuthorImageUpload}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: Square image, 200x200px minimum, max 5MB. Will be automatically optimized.
                  </p>
                </div>
                {postData.authorImageUrl && (
                  <div className="flex items-center space-x-4">
                    <img
                      src={postData.authorImageUrl}
                      alt="Author preview"
                      className="w-16 h-16 object-cover rounded-full border"
                    />
                    <span className="text-sm text-muted-foreground">Author image preview</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={postData.featured}
                  onCheckedChange={(checked) => setPostData(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>
            </CardContent>
          </Card>

          {/* Hero Image */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Upload Hero Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                  />
                </div>
                {postData.heroImageUrl && (
                  <div className="relative">
                    <img
                      src={postData.heroImageUrl}
                      alt="Hero preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={postData.content}
                onChange={(content) => {
                  console.log('RichTextEditor onChange called with:', content);
                  console.log('Content length:', content.length);
                  setPostData(prev => ({ ...prev, content }));
                }}
                placeholder="Write your post content here..."
              />
              
              {/* Debug Content Preview */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
                  <strong>Debug - Content State:</strong>
                  <div className="mt-2 p-2 bg-white border rounded">
                    <strong>Content Length:</strong> {postData.content?.length || 0}
                  </div>
                  <div className="mt-2 p-2 bg-white border rounded">
                    <strong>Content Preview:</strong>
                    <div dangerouslySetInnerHTML={{ __html: postData.content || '' }} />
                  </div>
                  <div className="mt-2 p-2 bg-gray-200 border rounded">
                    <strong>Raw HTML:</strong>
                    <pre className="whitespace-pre-wrap text-xs">{postData.content || ''}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Media Items
                <Button onClick={handleAddMediaItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Media
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {postData.mediaItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Media Item</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMediaItem(item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <Tabs 
                        value={item.type} 
                        onValueChange={(value: "external" | "local") => 
                          handleUpdateMediaItem(item.id, { type: value })
                        }
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="external">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            External Link
                          </TabsTrigger>
                          <TabsTrigger value="local">
                            <Upload className="w-4 h-4 mr-2" />
                            Local Upload
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="external" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Platform</Label>
                              <Select 
                                value={item.platform} 
                                onValueChange={(value: any) => 
                                  handleUpdateMediaItem(item.id, { platform: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="spotify">Spotify</SelectItem>
                                  <SelectItem value="soundcloud">SoundCloud</SelectItem>
                                  <SelectItem value="youtube">YouTube</SelectItem>
                                  <SelectItem value="apple-music">Apple Music</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Media Type</Label>
                              <Select 
                                value={item.mediaType} 
                                onValueChange={(value: "audio" | "video") => 
                                  handleUpdateMediaItem(item.id, { mediaType: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="audio">Audio</SelectItem>
                                  <SelectItem value="video">Video</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label>URL</Label>
                            <Input
                              value={item.url || ""}
                              onChange={(e) => 
                                handleUpdateMediaItem(item.id, { url: e.target.value })
                              }
                              placeholder="Paste the link here..."
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="local" className="space-y-4">
                          <div>
                            <Label>Media Type</Label>
                            <Select 
                              value={item.mediaType} 
                              onValueChange={(value: "audio" | "video") => 
                                handleUpdateMediaItem(item.id, { mediaType: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="audio">Audio</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Upload File</Label>
                            <Input
                              type="file"
                              accept={item.mediaType === "audio" ? "audio/*" : "video/*"}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(item.id, file);
                              }}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) => 
                              handleUpdateMediaItem(item.id, { title: e.target.value })
                            }
                            placeholder="Media title"
                          />
                        </div>
                        <div>
                          <Label>Artist</Label>
                          <Input
                            value={item.artist}
                            onChange={(e) => 
                              handleUpdateMediaItem(item.id, { artist: e.target.value })
                            }
                            placeholder="Artist name"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button onClick={handleAddTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {postData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      #{tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-6">
                {categoryOptions.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="accent-primary"
                    />
                    <span className="capitalize">{cat}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h1>{postData.title}</h1>
              <p className="text-muted-foreground">{postData.excerpt}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>By {postData.author}</span>
                <Badge>{postData.genre_name}</Badge>
                {postData.featured && <Badge variant="secondary">Featured</Badge>}
              </div>
              {postData.heroImageUrl && (
                <img 
                  src={postData.heroImageUrl} 
                  alt="Hero" 
                  className="w-full h-64 object-cover rounded-lg my-4"
                />
              )}
              <div dangerouslySetInnerHTML={{ __html: postData.content }} />
              {postData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {postData.tags.map(tag => (
                    <Badge key={tag} variant="outline">#{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}