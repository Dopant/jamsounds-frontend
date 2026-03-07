import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Mail, 
  Bell, 
  Shield, 
  Database, 
  Globe,
  Save,
  RefreshCw,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  Settings,
  Link,
  TrendingUp,
  User,
  Lock,
  Key
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";
import { FaXTwitter, FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa6';

const AdminSettings = () => {
  const { toast } = useToast();
  
  const [submitRedirectUrl, setSubmitRedirectUrl] = useState('');
  
  const [settings, setSettings] = useState({
    // Platform Branding
    siteName: "JAM JOURNAL SOUND",
    tagline: "Discover. Review. Amplify.",
    logoUrl: "/assets/jam-journal-logo.png",
    faviconUrl: "/favicon.ico",
    primaryColor: "#6366f1",
    accentColor: "#8b5cf6",
    
    // Homepage Statistics
    artistsFeaturedCount: localStorage.getItem('artistsFeaturedCount') || '2.5K+',
    reviewsPublishedCount: localStorage.getItem('reviewsPublishedCount') || '15K+',
    monthlyReadersCount: localStorage.getItem('monthlyReadersCount') || '1M+'
  });

  const [profileSettings, setProfileSettings] = useState({
    fullName: localStorage.getItem('adminFullName') || 'Admin User',
    email: localStorage.getItem('adminEmail') || 'admin@jamjournal.com',
    bio: localStorage.getItem('adminBio') || 'Platform Administrator',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: localStorage.getItem('adminAvatar') || null
  });

  const [newsletterSettings, setNewsletterSettings] = useState({
    autoSendOnPublish: localStorage.getItem('autoSendOnPublish') === 'true',
    newsletterEnabled: localStorage.getItem('newsletterEnabled') === 'true',
    welcomeMessage: localStorage.getItem('welcomeMessage') || 'Welcome to JAM JOURNAL SOUND newsletter!',
    subscriberCount: localStorage.getItem('subscriberCount') || '0'
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Homepage stats state
  const [homepageStats, setHomepageStats] = useState({
    artists_featured_count: '',
    reviews_published_count: '',
    monthly_readers_count: ''
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [homepageContent, setHomepageContent] = useState({
    homepage_title: '',
    homepage_subtitle: '',
    homepage_description: '',
    homepage_logo_url: ''
  });
  const [homepageContentLoading, setHomepageContentLoading] = useState(true);
  const [homepageLogoPreview, setHomepageLogoPreview] = useState<string | null>(null);
  const homepageLogoInputRef = useRef<HTMLInputElement>(null);

  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterContent, setNewsletterContent] = useState("");
  const [newsletterSending, setNewsletterSending] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState("");

  const [socialLinks, setSocialLinks] = useState<any>({
    social_x_url: '',
    social_facebook_url: '',
    social_instagram_url: '',
    social_youtube_url: '',
    social_tiktok_url: '',
    social_spotify_url: ''
  });
  const [socialLinksLoading, setSocialLinksLoading] = useState(true);
  const [socialLinksStatus, setSocialLinksStatus] = useState('');

  // Fetch submit redirect URL from backend on mount
  useEffect(() => {
    async function fetchRedirectUrl() {
      try {
        const res = await fetch('/api/auth/settings/submit-redirect-url');
        if (!res.ok) return;
        const data = await res.json();
        setSubmitRedirectUrl(data.url || '');
      } catch {}
    }
    fetchRedirectUrl();
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        setProfileSettings(prev => ({
          ...prev,
          fullName: data.name || prev.fullName,
          email: data.email || prev.email,
          bio: data.bio || prev.bio,
          avatar: data.avatar || null
        }));
        if (data.avatar) setAvatarPreview(data.avatar);
      } catch {}
    }
    fetchProfile();
  }, []);

  // Fetch homepage stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/auth/homepage-stats');
        if (!res.ok) return;
        const data = await res.json();
        setHomepageStats(data);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchHomepageContent() {
      try {
        const res = await fetch('/api/auth/settings/homepage-content');
        if (!res.ok) return;
        const data = await res.json();
        setHomepageContent(data);
        if (data.homepage_logo_url) setHomepageLogoPreview(data.homepage_logo_url);
      } finally {
        setHomepageContentLoading(false);
      }
    }
    fetchHomepageContent();
  }, []);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/newsletter/subscribers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        setSubscribers(data);
      } catch {}
    }
    async function fetchCampaigns() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/newsletter/campaigns', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        setCampaigns(data);
      } catch {}
    }
    fetchSubscribers();
    fetchCampaigns();
  }, []);

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const res = await fetch('/api/auth/settings/social-links');
        if (!res.ok) return;
        const data = await res.json();
        setSocialLinks(data);
      } finally {
        setSocialLinksLoading(false);
      }
    }
    fetchSocialLinks();
  }, []);

  const handleSave = (section: string) => {
    // Save submit redirect URL to localStorage
    if (section === 'platform' || section === 'all') {
      localStorage.setItem('submitRedirectUrl', submitRedirectUrl);
      localStorage.setItem('artistsFeaturedCount', settings.artistsFeaturedCount);
      localStorage.setItem('reviewsPublishedCount', settings.reviewsPublishedCount);
      localStorage.setItem('monthlyReadersCount', settings.monthlyReadersCount);
    }
    
    if (section === 'profile' || section === 'all') {
      localStorage.setItem('adminFullName', profileSettings.fullName);
      localStorage.setItem('adminEmail', profileSettings.email);
      localStorage.setItem('adminBio', profileSettings.bio);
      localStorage.setItem('adminAvatar', profileSettings.avatar || null);
    }
    
    if (section === 'newsletter' || section === 'all') {
      localStorage.setItem('autoSendOnPublish', newsletterSettings.autoSendOnPublish.toString());
      localStorage.setItem('newsletterEnabled', newsletterSettings.newsletterEnabled.toString());
      localStorage.setItem('welcomeMessage', newsletterSettings.welcomeMessage);
      localStorage.setItem('subscriberCount', newsletterSettings.subscriberCount);
    }
    
    toast({
      title: "Settings Saved",
      description: `${section === 'all' ? 'All settings' : `${section} settings`} have been updated successfully.`,
    });
  };

  const handlePasswordChange = async () => {
    if (profileSettings.newPassword !== profileSettings.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (profileSettings.newPassword.length < 8) {
      toast({
        title: "Error", 
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: profileSettings.currentPassword,
          newPassword: profileSettings.newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      setProfileSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update password',
        variant: "destructive"
      });
    }
  };

  const handleBackupDownload = () => {
    toast({
      title: "Backup Started",
      description: "Your backup will be downloaded shortly.",
    });
  };

  const handleSystemRestart = () => {
    toast({
      title: "System Restart Initiated",
      description: "The system will restart in 30 seconds.",
      variant: "destructive"
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSave = async () => {
    const formData = new FormData();
    formData.append('name', profileSettings.fullName);
    formData.append('bio', profileSettings.bio);
    if (avatarInputRef.current?.files?.[0]) {
      formData.append('avatar', avatarInputRef.current.files[0]);
    }
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      toast({ title: 'Profile updated', description: 'Your profile has been updated.' });
      if (data.avatar) setAvatarPreview(data.avatar);
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update profile', variant: 'destructive' });
    }
  };

  const handleSaveRedirectUrl = async () => {
    try {
      const res = await fetch('/api/auth/settings/submit-redirect-url', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        },
        body: JSON.stringify({ url: submitRedirectUrl })
      });
      if (!res.ok) throw new Error('Failed to update redirect URL');
      toast({ title: 'Redirect URL updated', description: 'The submit music redirect URL has been updated.' });
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update redirect URL', variant: 'destructive' });
    }
  };

  // Add handler to save homepage stats
  const handleSaveHomepageStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/auth/homepage-stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(homepageStats)
      });
      if (!res.ok) throw new Error('Failed to update homepage stats');
      toast({ title: 'Homepage stats updated', description: 'Homepage statistics have been updated.' });
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update homepage stats', variant: 'destructive' });
    }
  };

  const handleHomepageLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHomepageLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveHomepageContent = async () => {
    const formData = new FormData();
    // Only append fields that have changed or are non-empty
    if (homepageContent.homepage_title) formData.append('homepage_title', homepageContent.homepage_title);
    if (homepageContent.homepage_subtitle) formData.append('homepage_subtitle', homepageContent.homepage_subtitle);
    if (homepageContent.homepage_description) formData.append('homepage_description', homepageContent.homepage_description);
    if (homepageLogoInputRef.current?.files?.[0]) {
      formData.append('logo', homepageLogoInputRef.current.files[0]);
    } else if (homepageContent.homepage_logo_url) {
      formData.append('homepage_logo_url', homepageContent.homepage_logo_url);
    }
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/auth/settings/homepage-content', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Failed to update homepage content');
      toast({ title: 'Homepage content updated', description: 'Homepage hero and logo have been updated.' });
      // Refetch to update preview
      const data = await res.json();
      setHomepageContent(data);
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update homepage content', variant: 'destructive' });
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus("");
    setNewsletterSending(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subject: newsletterSubject, content: newsletterContent })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send newsletter');
      setNewsletterStatus('Newsletter sent!');
      setNewsletterSubject("");
      setNewsletterContent("");
      // Refresh campaigns
      const campaignsRes = await fetch('/api/newsletter/campaigns', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (campaignsRes.ok) setCampaigns(await campaignsRes.json());
    } catch (err) {
      setNewsletterStatus(err instanceof Error ? err.message : 'Failed to send newsletter');
    } finally {
      setNewsletterSending(false);
    }
  };

  const handleSaveSocialLinks = async () => {
    setSocialLinksStatus('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/auth/settings/social-links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(socialLinks)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update social links');
      setSocialLinksStatus('Social links updated!');
    } catch (err) {
      setSocialLinksStatus(err instanceof Error ? err.message : 'Failed to update social links');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Settings</h1>
            <p className="text-muted-foreground">
              Configure and customize your JAM JOURNAL SOUND platform
            </p>
          </div>
          
        </div>

        <Tabs defaultValue="platform" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="platform">Platform</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="redirect">Submit Redirect</TabsTrigger>
          </TabsList>

          {/* Platform Settings */}
          <TabsContent value="platform" className="space-y-6">
            

            {/* Homepage Content Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Platform Branding
                </CardTitle>
                <CardDescription>
                  Edit the homepage hero section and logo image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {homepageContentLoading ? (
                  <div>Loading homepage content...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="homepage_title">Title</Label>
                      <Input
                        id="homepage_title"
                        value={homepageContent.homepage_title || ''}
                        onChange={e => setHomepageContent(s => ({ ...s, homepage_title: e.target.value }))}
                        placeholder="JAM JOURNAL SOUND"
                      />
                    </div>
                    <div>
                      <Label htmlFor="homepage_subtitle">Subtitle</Label>
                      <Input
                        id="homepage_subtitle"
                        value={homepageContent.homepage_subtitle || ''}
                        onChange={e => setHomepageContent(s => ({ ...s, homepage_subtitle: e.target.value }))}
                        placeholder="Where Music Stories Come Alive"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="homepage_description">Description</Label>
                      <Textarea
                        id="homepage_description"
                        value={homepageContent.homepage_description || ''}
                        onChange={e => setHomepageContent(s => ({ ...s, homepage_description: e.target.value }))}
                        rows={3}
                        placeholder="Discover emerging artists, read exclusive reviews, and explore the sounds shaping tomorrow's music scene."
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center space-x-4">
                      <div className="relative w-20 h-20">
                        <img
                          src={homepageLogoPreview || homepageContent.homepage_logo_url || "/assets/jam-journal-logo.png"}
                          alt="Homepage Logo"
                          className="w-20 h-20 rounded-lg object-cover border"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          ref={homepageLogoInputRef}
                          onChange={handleHomepageLogoChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          title="Upload homepage logo"
                        />
                      </div>
                      <div>
                        <Label>Logo Image</Label>
                        <p className="text-sm text-muted-foreground">Upload a new logo for the homepage hero and footer.</p>
                      </div>
                    </div>
                  </div>
                )}
                <Button onClick={handleSaveHomepageContent} disabled={homepageContentLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Homepage Content
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Homepage Statistics
                </CardTitle>
                <CardDescription>
                  Configure the statistics displayed on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {statsLoading ? (
                  <div>Loading homepage stats...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="artistsFeatured">Artists Featured</Label>
                      <Input
                        id="artistsFeatured"
                        value={homepageStats.artists_featured_count || ''}
                        onChange={e => setHomepageStats(s => ({ ...s, artists_featured_count: e.target.value }))}
                        placeholder="2.5K+"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reviewsPublished">Reviews Published</Label>
                      <Input
                        id="reviewsPublished"
                        value={homepageStats.reviews_published_count || ''}
                        onChange={e => setHomepageStats(s => ({ ...s, reviews_published_count: e.target.value }))}
                        placeholder="15K+"
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyReaders">Monthly Readers</Label>
                      <Input
                        id="monthlyReaders"
                        value={homepageStats.monthly_readers_count || ''}
                        onChange={e => setHomepageStats(s => ({ ...s, monthly_readers_count: e.target.value }))}
                        placeholder="1M+"
                      />
                    </div>
                  </div>
                )}
                <Button onClick={handleSaveHomepageStats} disabled={statsLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Homepage Stats
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaXTwitter className="w-5 h-5 mr-2" />
                  Social Media Links
                </CardTitle>
                <CardDescription>
                  Configure your social media links for the homepage and blog page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialLinksLoading ? (
                  <div>Loading social links...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="social_x_url">X (Twitter)</Label>
                      <Input
                        id="social_x_url"
                        value={socialLinks.social_x_url || ''}
                        onChange={e => setSocialLinks((s: any) => ({ ...s, social_x_url: e.target.value }))}
                        placeholder="https://x.com/yourprofile"
                      />
                    </div>
                    <div>
                      <Label htmlFor="social_facebook_url">Facebook</Label>
                      <Input
                        id="social_facebook_url"
                        value={socialLinks.social_facebook_url || ''}
                        onChange={e => setSocialLinks((s: any) => ({ ...s, social_facebook_url: e.target.value }))}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="social_instagram_url">Instagram</Label>
                      <Input
                        id="social_instagram_url"
                        value={socialLinks.social_instagram_url || ''}
                        onChange={e => setSocialLinks((s: any) => ({ ...s, social_instagram_url: e.target.value }))}
                        placeholder="https://instagram.com/yourprofile"
                      />
                    </div>
                    <div>
                      <Label htmlFor="social_youtube_url">YouTube</Label>
                      <Input
                        id="social_youtube_url"
                        value={socialLinks.social_youtube_url || ''}
                        onChange={e => setSocialLinks((s: any) => ({ ...s, social_youtube_url: e.target.value }))}
                        placeholder="https://youtube.com/yourchannel"
                      />
                    </div>
                    <div>
                      <Label htmlFor="social_tiktok_url">TikTok</Label>
                      <Input
                        id="social_tiktok_url"
                        value={socialLinks.social_tiktok_url || ''}
                        onChange={e => setSocialLinks((s: any) => ({ ...s, social_tiktok_url: e.target.value }))}
                        placeholder="https://tiktok.com/@yourprofile"
                      />
                    </div>
                    <div>
                      <Label htmlFor="social_spotify_url">Spotify</Label>
                      <Input
                        id="social_spotify_url"
                        value={socialLinks.social_spotify_url || ''}
                        onChange={e => setSocialLinks((s: any) => ({ ...s, social_spotify_url: e.target.value }))}
                        placeholder="https://open.spotify.com/user/yourprofile"
                      />
                    </div>
                  </div>
                )}
                <Button onClick={handleSaveSocialLinks} disabled={socialLinksLoading}>
                  Save Social Links
                </Button>
                {socialLinksStatus && (
                  <div className={`text-sm mt-2 ${socialLinksStatus.startsWith('Social links updated') ? 'text-green-600' : 'text-red-600'}`}>{socialLinksStatus}</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-6 mb-4">
                  <div className="relative w-20 h-20">
                    <img
                      src={avatarPreview || profileSettings.avatar || "/assets/default-avatar.png"}
                      alt="Profile Avatar"
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={avatarInputRef}
                      onChange={handleAvatarChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title="Upload avatar"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileSettings.fullName}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileSettings.bio}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div>
                <Button onClick={handleProfileSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={profileSettings.currentPassword}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profileSettings.newPassword}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profileSettings.confirmPassword}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={handlePasswordChange}>
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Management */}
          <TabsContent value="newsletter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Newsletter Management
                </CardTitle>
                <CardDescription>
                  View subscribers, send newsletters, and see send history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Subscribers List */}
                <div>
                  <h4 className="font-semibold mb-2">Subscribers ({subscribers.length})</h4>
                  <div className="max-h-40 overflow-y-auto border rounded p-2 bg-muted/30">
                    {subscribers.length === 0 ? (
                      <div className="text-muted-foreground">No subscribers yet.</div>
                    ) : (
                      <ul className="text-sm space-y-1">
                        {subscribers.map(sub => (
                          <li key={sub.id}>{sub.email} <span className="text-muted-foreground">({new Date(sub.subscribed_at).toLocaleDateString()})</span></li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {/* Send Newsletter Form */}
                <form onSubmit={handleSendNewsletter} className="space-y-4">
                  <h4 className="font-semibold mb-2">Send Newsletter</h4>
                  <div>
                    <Label>Subject</Label>
                    <Input value={newsletterSubject} onChange={e => setNewsletterSubject(e.target.value)} required />
                  </div>
                  <div>
                    <Label>Content (HTML allowed)</Label>
                    <Textarea value={newsletterContent} onChange={e => setNewsletterContent(e.target.value)} rows={5} required />
                  </div>
                  <Button type="submit" disabled={newsletterSending}>
                    {newsletterSending ? 'Sending...' : 'Send Newsletter'}
                  </Button>
                  {newsletterStatus && (
                    <div className={`text-sm mt-2 ${newsletterStatus.startsWith('Newsletter sent') ? 'text-green-600' : 'text-red-600'}`}>{newsletterStatus}</div>
                  )}
                </form>
                {/* Send History */}
                <div>
                  <h4 className="font-semibold mb-2">Send History</h4>
                  <div className="max-h-40 overflow-y-auto border rounded p-2 bg-muted/30">
                    {campaigns.length === 0 ? (
                      <div className="text-muted-foreground">No newsletters sent yet.</div>
                    ) : (
                      <ul className="text-sm space-y-1">
                        {campaigns.map(camp => (
                          <li key={camp.id}><b>{camp.subject}</b> <span className="text-muted-foreground">({new Date(camp.sent_at).toLocaleString()})</span></li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit Redirect Settings */}
          <TabsContent value="redirect" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="w-5 h-5 mr-2" />
                  Submit Music Redirect
                </CardTitle>
                <CardDescription>
                  Configure where users are redirected after submitting music
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="submitRedirectUrl">Redirect URL</Label>
                  <Input
                    id="submitRedirectUrl"
                    value={submitRedirectUrl}
                    onChange={(e) => setSubmitRedirectUrl(e.target.value)}
                    placeholder="https://your-submission-form.com"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Users will be redirected to this URL after clicking the submit music button
                  </p>
                </div>
                <Button onClick={handleSaveRedirectUrl}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Redirect URL
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Homepage Statistics */}
          <TabsContent value="homepageStats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Homepage Statistics
                </CardTitle>
                <CardDescription>
                  These values appear on the public homepage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div>Loading homepage stats...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="artistsFeatured">Artists Featured</Label>
                      <Input
                        id="artistsFeatured"
                        value={homepageStats.artists_featured_count || ''}
                        onChange={e => setHomepageStats(s => ({ ...s, artists_featured_count: e.target.value }))}
                        placeholder="2.5K+"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reviewsPublished">Reviews Published</Label>
                      <Input
                        id="reviewsPublished"
                        value={homepageStats.reviews_published_count || ''}
                        onChange={e => setHomepageStats(s => ({ ...s, reviews_published_count: e.target.value }))}
                        placeholder="15K+"
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyReaders">Monthly Readers</Label>
                      <Input
                        id="monthlyReaders"
                        value={homepageStats.monthly_readers_count || ''}
                        onChange={e => setHomepageStats(s => ({ ...s, monthly_readers_count: e.target.value }))}
                        placeholder="1M+"
                      />
                    </div>
                  </div>
                )}
                <Button onClick={handleSaveHomepageStats} disabled={statsLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Homepage Stats
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;