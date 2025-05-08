'use client';

import type { DependencyList } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

// IMPORTANT: AUDIO FILE PLACEHOLDERS
// The URLs below for '*Voice' sounds (e.g., cakeVoice, sushiVoice) are PLACEHOLDERS.
// You MUST replace them with actual audio files of a little girl's voice saying the food item's name.
// For example, cakeVoice should be a recording of "Cake!", sushiVoice "Sushi!", etc.
const SOUND_PATHS = {
  collect: 'https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg', // Kept for reference, but new voice sounds will be used
  move: 'https://actions.google.com/sounds/v1/sports/pool_ball_pocket.ogg', 
  gameOver: 'https://actions.google.com/sounds/v1/events/completion_positive.ogg', 
  backgroundMusic: 'https://actions.google.com/sounds/v1/ambiences/arcade_room.ogg', 
  // --- Voice sound placeholders ---
  // Replace these URLs with your actual audio files
  cakeVoice: 'https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg', // Placeholder for "Cake!"
  sushiVoice: 'https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg', // Placeholder for "Sushi!"
  donutVoice: 'https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg', // Placeholder for "Donut!"
  appleVoice: 'https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg', // Placeholder for "Apple!"
  cherryVoice: 'https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg', // Placeholder for "Cherry!"
  // --- End of voice sound placeholders ---
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
      const audioUrl = SOUND_PATHS[soundType];
      if (!audioUrl) {
        console.warn(`Sound type "${soundType}" not found in SOUND_PATHS.`);
        return;
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      const handlePlaying = () => setIsPlaying(true);
      const handleEnded = () => {
        setIsPlaying(false);
        if (loop && audioRef.current && !audioRef.current.muted && !isMutedGlobal) {
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
        audioRef.current = null; 
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundType, ...deps]); 

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
        audioRef.current.pause(); 
      }
    }
  }, [isMutedGlobal, isPlaying, volume]); // Removed 'loop' as it's handled separately and doesn't directly affect muting logic


  const play = useCallback(() => {
    if (audioRef.current && !isMutedGlobal) {
      if (!audioRef.current.loop) { 
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play().catch(error => console.warn(`Error playing sound ${soundType}:`, error));
    }
  }, [soundType, isMutedGlobal]); // Removed loop from deps as audioRef.current.loop handles it

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; 
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