
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  className = '',
  autoPlay = false,
  muted = false,
  loop = false,
  controls = false 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Update isPlaying state when video plays or pauses
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      console.error(`Error loading video: ${src}`);
      setError(true);
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('error', handleError);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('error', handleError);
      }
    };
  }, [src]);
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setError(false);
          })
          .catch(err => {
            console.error('Failed to play video:', err);
            setError(true);
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  if (error) {
    return (
      <div className={`relative max-w-4xl mx-auto ${className} bg-gray-200 dark:bg-gray-800 rounded-lg p-8 text-center`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <AlertTriangle size={48} className="text-amber-500" />
          <p>Unable to load video from: {src}</p>
          <p className="text-sm text-muted-foreground">Please check that the video file exists in the public directory.</p>
          <Button onClick={() => setError(false)} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative max-w-4xl mx-auto ${className}`}>
      <video 
        ref={videoRef}
        src={src}
        className="w-full rounded-lg shadow-lg"
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        preload="metadata"
      />
      {!controls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Button 
            variant="default" 
            size="icon" 
            onClick={togglePlay}
            className="rounded-full"
          >
            {!isPlaying ? <Play /> : <Pause />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
