import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Instagram, 
  Copy,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FaXTwitter, FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaSpotify } from 'react-icons/fa6';

interface SocialShareProps {
  url: string;
  title: string;
  excerpt?: string;
  className?: string;
}

export function SocialShare({ url, title, excerpt, className }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [socialLinks, setSocialLinks] = useState<any>({});

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const res = await fetch('/api/auth/settings/social-links');
        if (!res.ok) return;
        const data = await res.json();
        setSocialLinks(data);
      } catch {}
    }
    fetchSocialLinks();
  }, []);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    tiktok: `https://www.tiktok.com/share?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Share:</span>
      {socialLinks.social_x_url && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleShare("twitter")}
          className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
        >
          <FaXTwitter className="w-4 h-4" />
        </Button>
      )}
      {socialLinks.social_facebook_url && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleShare("facebook")}
          className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
        >
          <FaFacebook className="w-4 h-4" />
        </Button>
      )}
      {socialLinks.social_instagram_url && (
        <a
          href={socialLinks.social_instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600"
          >
            <FaInstagram className="w-4 h-4" />
          </Button>
        </a>
      )}
      {socialLinks.social_youtube_url && (
        <a
          href={socialLinks.social_youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <FaYoutube className="w-4 h-4" />
          </Button>
        </a>
      )}
      {socialLinks.social_tiktok_url && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleShare("tiktok")}
          className="hover:bg-black/10 hover:border-black/30 hover:text-black"
        >
          <FaTiktok className="w-4 h-4" />
        </Button>
      )}
      {socialLinks.social_spotify_url && (
        <a
          href={socialLinks.social_spotify_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Spotify"
        >
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-green-50 hover:border-green-300 hover:text-green-600"
          >
            <FaSpotify className="w-4 h-4" />
          </Button>
        </a>
      )}
    </div>
  );
}