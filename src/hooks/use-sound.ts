
'use client';

import type { DependencyList } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

// In a real app, these would be paths to your audio files
// For now, we'll use placeholders. Genkit could potentially generate these if needed.
const SOUND_PATHS = {
  collect: 'https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg', // Changed to a more relaxing chime
  move: 'https://actions.google.com/sounds/v1/sports/pool_ball_pocket.ogg', 
  gameOver: 'https://actions.google.com/sounds/v1/events/completion_positive.ogg', // Changed to a positive completion sound
  backgroundMusic: 'https://actions.google.com/sounds/v1/ambiences/arcade_room.ogg', 
};

export type SoundType = keyof typeof SOUND_PATHS;

interface UseSoundOptions {
  volume?: number;
  loop?: boolean;
  isMutedGlobal?: boolean;
}

export function useSound(soundType: SoundType, options?: UseSoundOptions, deps: DependencyList = []) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { volume = 1, loop = false, isMutedGlobal = false } = options || {};

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(SOUND_PATHS[soundType]);
      audioRef.current = audio;

      const handlePlaying = () => setIsPlaying(true);
      const handleEnded = () => {
        setIsPlaying(false);
        if (loop && audioRef.current && !audioRef.current.muted && !isMutedGlobal) {
            // Restart looped sound if it ended and wasn't manually stopped/paused
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(error => console.warn(`Error re-playing looped sound ${soundType}:`, error));
        }
      };
      const handlePause = () => setIsPlaying(false);


      audio.addEventListener('playing', handlePlaying);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('pause', handlePause);
      
      return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.removeEventListener('playing', handlePlaying);
            audioRef.current.removeEventListener('ended', handleEnded);
            audioRef.current.removeEventListener('pause', handlePause);
        }
        audioRef.current = null; // Clean up ref
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundType, ...deps]); // Re-create audio if soundType or critical deps change

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loop;
    }
  }, [loop]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      const effectivelyMuted = isMutedGlobal;
      if (audioRef.current.muted !== effectivelyMuted) {
         audioRef.current.muted = effectivelyMuted;
      }
      if (effectivelyMuted && isPlaying) {
        audioRef.current.pause(); // Pause if globally muted while playing
      } else if (!effectivelyMuted && loop && !isPlaying && audioRef.current.paused && audioRef.current.currentTime > 0) {
        // If unmuted, was looping, and paused mid-way, resume
        // This case might be complex; for now, focus on mute toggling play/pause
      }
    }
  }, [isMutedGlobal, loop, isPlaying, volume]);


  const play = useCallback(() => {
    if (audioRef.current && !isMutedGlobal) {
      if (!loop) { // For non-looping sounds, always restart
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play().catch(error => console.warn(`Error playing sound ${soundType}:`, error));
    }
  }, [soundType, loop, isMutedGlobal]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset time on explicit stop
    }
  }, []);


  const togglePlay = useCallback(() => {
    if (audioRef.current) {
        if (isPlaying) {
            stop();
        } else {
            play();
        }
    }
  }, [isPlaying, play, stop]);


  return { play, stop, isPlaying, togglePlay, audioEl: audioRef.current };
}

