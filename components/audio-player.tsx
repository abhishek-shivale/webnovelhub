"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { useLocalStorage } from "@/hooks/use-local-storage"

type AudioPlayerProps = {
  chapter: {
    chap_title: string
    content: string
    audioUrl?: string
  }
}

type Voice = {
  Name: string
  ShortName: string
  Locale: string
}

type VolumeLevel = "low" | "medium" | "high"

export default function AudioPlayer({ chapter }: AudioPlayerProps) {
  // Use localStorage for user preferences
  const [volume, setVolume] = useLocalStorage("audio-volume", 80)
  const [playbackRate, setPlaybackRate] = useLocalStorage("audio-playback-rate", 1)
  const [selectedVoice, setSelectedVoice] = useLocalStorage("selected-voice", "en-US-ChristopherNeural")
  const [volumeLevel, setVolumeLevel] = useLocalStorage<VolumeLevel>("volume-level", "medium")

  // State variables
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [voices, setVoices] = useState<Voice[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const sourceBufferRef = useRef<SourceBuffer | null>(null)
  const pendingOperationsRef = useRef<Uint8Array[]>([])
  const processingRef = useRef<boolean>(false)

  useEffect(() => {
    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio();
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setAudioLoaded(true);
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        // setIsPaused(false);
      });
      audio.addEventListener('play', () => {
        setIsPlaying(true);
        // setIsPaused(false);
      });
      audio.addEventListener('pause', () => {
        setIsPlaying(false);
        setIsPaused(true);
      });
      audioRef.current = audio;
    }

    // Fetch available voices
    const fetchVoices = async () => {
      try {
        const response = await fetch("https://api.webnovelhub.online/api/tts/voices")
        const data = await response.json()
        setVoices(data)
      } catch (error) {
        console.error("Failed to fetch voices:", error)
      }
    }

    fetchVoices()

    return () => {
      // Clean up
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audioSourceRef.current) {
        audioSourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
      audioRef.current.muted = isMuted
      audioRef.current.playbackRate = playbackRate
    }
  }, [volume, isMuted, playbackRate])

  useEffect(() => {
    if (isPaused) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }else{
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  },[isPaused])

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused)
    if (!audioLoaded && !isGenerating) {
      generateAudio();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        // No need to set isPaused here as the 'pause' event listener will handle it
      } else if (isPaused) {
        // Resume if paused
        audioRef.current.pause();
        // No need to set isPlaying here as the 'play' event listener will handle it
      } else {
        // Start playing if neither playing nor paused
        if(!isPaused){
          audioRef.current.play();
        }
      }
    }
  }


  const handleTimeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds
    }
  }

  // Process pending buffer operations safely
  const processNextBuffer = () => {
    if (processingRef.current || !sourceBufferRef.current || pendingOperationsRef.current.length === 0) {
      return;
    }

    processingRef.current = true;
    const nextChunk = pendingOperationsRef.current.shift();

    if (nextChunk && !sourceBufferRef.current.updating) {
      try {
        sourceBufferRef.current.appendBuffer(nextChunk);
      } catch (err) {
        console.error("Error appending buffer:", err);
        processingRef.current = false;
        processNextBuffer(); // Try the next chunk
        return;
      }
    } else {
      processingRef.current = false;
      return;
    }

    // When this operation completes, process any remaining chunks
    sourceBufferRef.current.addEventListener('updateend', () => {
      processingRef.current = false;
      processNextBuffer();
    }, { once: true });
  }

  // Updated to handle volume level as a string parameter
  const getVolumeParameter = (): string => {
    switch (volumeLevel) {
      case "low": return "-20%";
      case "high": return "+20%";
      default: return "+0%";
    }
  }

  // Setting volume level from numeric volume
  useEffect(() => {
    if (volume < 33) {
      setVolumeLevel("low");
    } else if (volume < 66) {
      setVolumeLevel("medium");
    } else {
      setVolumeLevel("high");
    }
  }, [volume, setVolumeLevel]);

  const generateAudio = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      setAudioLoaded(false);
      // setIsPaused(false);
      pendingOperationsRef.current = [];
      processingRef.current = false;

      // Create the audio stream and connect it
      if (audioRef.current) {
        // Reset the audio element
        audioRef.current.pause();
        audioRef.current.src = '';

        // Set up streaming audio
        const response = await fetch("https://api.webnovelhub.online/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: chapter.content,
            voice: selectedVoice,
            rate: `${playbackRate}%`,
            pitch: "+0%",
            volume: getVolumeParameter(),
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error("Failed to generate audio stream");
        }

        // Create a readable stream from the response
        const reader = response.body.getReader();

        // Create a new MediaSource
        const mediaSource = new MediaSource();
        const sourceUrl = URL.createObjectURL(mediaSource);

        // Set the media source URL to the audio element
        audioRef.current.src = sourceUrl;

        // When the MediaSource is open, create a SourceBuffer
        mediaSource.addEventListener('sourceopen', async () => {
          try {
            const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
            sourceBufferRef.current = sourceBuffer;

            const chunks: Uint8Array[] = [];

            // Handle source buffer update end events
            sourceBuffer.addEventListener('updateend', () => {
              // Start playing after a little buffer is built up
              if (!isPlaying && !isPaused && chunks.length > 5 && audioRef.current) {
                audioRef.current.play();
              }

              processNextBuffer();
            });

            const processStream = async () => {
              try {
                while (true) {
                  const { done, value } = await reader.read();

                  if (done) {
                    // End of stream reached
                    if (pendingOperationsRef.current.length === 0 && !sourceBuffer.updating) {
                      mediaSource.endOfStream();
                    } else {
                      // Wait for all pending operations to complete
                      const checkCompletion = setInterval(() => {
                        if (pendingOperationsRef.current.length === 0 && !sourceBuffer.updating) {
                          clearInterval(checkCompletion);
                          mediaSource.endOfStream();
                        }
                      }, 100);
                    }
                    break;
                  }

                  chunks.push(value);

                  // Add to pending operations queue
                  pendingOperationsRef.current.push(value);

                  // Try to process the next buffer if not already processing
                  if (!processingRef.current) {
                    processNextBuffer();
                  }
                }
              } catch (err) {
                console.error("Error in stream processing:", err);
              }
            };

            processStream();

          } catch (error) {
            console.error("Error setting up MediaSource:", error);
          }
        });

        // Start loading the audio
        audioRef.current.load();
        setAudioLoaded(true);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  // Handle changing volume level directly
  const handleVolumeLevel = (level: VolumeLevel) => {
    setVolumeLevel(level);

    // Also update numerical volume
    switch (level) {
      case "low":
        setVolume(25);
        break;
      case "medium":
        setVolume(50);
        break;
      case "high":
        setVolume(90);
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Volume2 className="h-5 w-5" />
          <span className="sr-only">Audio player</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Audio Player</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-2 space-y-4">
          <p className="text-sm font-medium truncate">{chapter.chap_title}</p>

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => skip(-10)}>
              <SkipBack className="h-4 w-4" />
              <span className="sr-only">Skip back 10 seconds</span>
            </Button>

            <Button onClick={togglePlay} variant="outline" size="icon" className="h-10 w-10">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>

            <Button variant="ghost" size="icon" onClick={() => skip(10)}>
              <SkipForward className="h-4 w-4" />
              <span className="sr-only">Skip forward 10 seconds</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
            </Button>

            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="flex-1"
              aria-label="Volume"
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium">Playback Speed</p>
            <div className="flex gap-1">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <Button
                  key={rate}
                  variant={playbackRate === rate ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs h-7"
                  onClick={() => setPlaybackRate(rate)}
                >
                  {rate}x
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium">Voice</p>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2 border rounded"
            >
             {voices.map((voice) => (
                <option key={voice.Name} value={voice.ShortName}>
                  {voice.ShortName}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={generateAudio} className="w-full" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Audio"}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}