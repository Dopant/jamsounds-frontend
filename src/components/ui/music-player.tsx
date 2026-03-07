import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, ExternalLink, Music } from "lucide-react";

interface MusicPlayerProps {
  type: "spotify" | "soundcloud" | "youtube";
  url: string;
  title?: string;
  artist?: string;
  className?: string;
}

export function MusicPlayer({ type, url, title, artist, className }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getEmbedUrl = () => {
    switch (type) {
      case "spotify":
        // Convert Spotify URL to embed format
        if (url.includes("open.spotify.com")) {
          return url.replace("open.spotify.com", "open.spotify.com/embed");
        }
        return url;
      case "soundcloud":
        // SoundCloud embed format
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%237c3aed&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
      case "youtube":
        // YouTube embed format
        const videoId = url.includes("youtube.com/watch?v=") 
          ? url.split("v=")[1]?.split("&")[0]
          : url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      default:
        return url;
    }
  };

  const getPlatformName = () => {
    switch (type) {
      case "spotify":
        return "Spotify";
      case "soundcloud":
        return "SoundCloud";
      case "youtube":
        return "YouTube";
      default:
        return "Music";
    }
  };

  const getPlatformColor = () => {
    switch (type) {
      case "spotify":
        return "bg-green-500";
      case "soundcloud":
        return "bg-orange-500";
      case "youtube":
        return "bg-red-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative">
        <iframe
          src={getEmbedUrl()}
          width="100%"
          height={type === "youtube" ? "315" : "166"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full"
        />
        <div className="absolute top-3 right-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open(url, "_blank")}
            className="bg-black/70 text-white hover:bg-black/90"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            {getPlatformName()}
          </Button>
        </div>
      </div>
      
      {(title || artist) && (
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getPlatformColor()} flex items-center justify-center`}>
              <Music className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              {title && (
                <p className="font-semibold text-sm">{title}</p>
              )}
              {artist && (
                <p className="text-xs text-muted-foreground">{artist}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}