import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward, 
  ExternalLink, 
  Music,
  Video
} from "lucide-react";

interface MediaPlayerProps {
  type: "external" | "local";
  mediaType: "audio" | "video";
  platform?: "spotify" | "soundcloud" | "youtube" | "apple-music";
  url: string;
  title?: string;
  artist?: string;
  className?: string;
}

export function MediaPlayer({ type, mediaType, platform, url, title, artist, className }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement>(null);

  const getEmbedUrl = () => {
    if (type === "local") return url;
    
    switch (platform) {
      case "spotify":
        if (url.includes("open.spotify.com")) {
          return url.replace("open.spotify.com", "open.spotify.com/embed");
        }
        return url;
      case "soundcloud":
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%237c3aed&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
      case "youtube":
        const videoId = url.includes("youtube.com/watch?v=") 
          ? url.split("v=")[1]?.split("&")[0]
          : url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      case "apple-music":
        return url.replace("music.apple.com", "embed.music.apple.com");
      default:
        return url;
    }
  };

  const getPlatformName = () => {
    if (type === "local") return "Local File";
    
    switch (platform) {
      case "spotify": return "Spotify";
      case "soundcloud": return "SoundCloud";
      case "youtube": return "YouTube";
      case "apple-music": return "Apple Music";
      default: return "Media";
    }
  };

  const getPlatformColor = () => {
    switch (platform) {
      case "spotify": return "bg-green-500";
      case "soundcloud": return "bg-orange-500";
      case "youtube": return "bg-red-500";
      case "apple-music": return "bg-gray-800";
      default: return "bg-primary";
    }
  };

  useEffect(() => {
    const media = mediaRef.current;
    if (!media || type === "external") return;

    const updateTime = () => setCurrentTime(media.currentTime);
    const updateDuration = () => setDuration(media.duration);

    media.addEventListener("timeupdate", updateTime);
    media.addEventListener("loadedmetadata", updateDuration);

    return () => {
      media.removeEventListener("timeupdate", updateTime);
      media.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [type]);

  const togglePlay = () => {
    if (type === "external" || !mediaRef.current) return;
    
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (type === "external" || !mediaRef.current) return;
    
    const newTime = value[0];
    mediaRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (type === "external" || !mediaRef.current) return;
    
    const newVolume = value[0];
    mediaRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (type === "external" || !mediaRef.current) return;
    
    if (isMuted) {
      mediaRef.current.volume = volume;
      setIsMuted(false);
    } else {
      mediaRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // External/Embedded Players
  if (type === "external") {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="relative">
          <iframe
            src={getEmbedUrl()}
            width="100%"
            height={mediaType === "video" ? "315" : "166"}
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
                {mediaType === "video" ? (
                  <Video className="w-5 h-5 text-white" />
                ) : (
                  <Music className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                {title && <p className="font-semibold text-sm">{title}</p>}
                {artist && <p className="text-xs text-muted-foreground">{artist}</p>}
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // Local Media Players
  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Media Element */}
        <div className="relative">
          {mediaType === "video" ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={url}
              className="w-full rounded-lg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="bg-gradient-primary rounded-lg p-8 flex items-center justify-center">
              <Music className="w-16 h-16 text-primary-foreground" />
              <audio
                ref={mediaRef as React.RefObject<HTMLAudioElement>}
                src={url}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          )}
        </div>

        {/* Media Info */}
        {(title || artist) && (
          <div className="text-center">
            {title && <h3 className="font-semibold">{title}</h3>}
            {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" size="sm">
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button onClick={togglePlay} size="sm">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button variant="outline" size="sm">
            <SkipForward className="w-4 h-4" />
          </Button>

          <div className="flex items-center space-x-2 ml-4">
            <Button variant="ghost" size="sm" onClick={toggleMute}>
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}