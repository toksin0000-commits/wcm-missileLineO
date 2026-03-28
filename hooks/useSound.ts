"use client";

import { useCallback, useRef, useEffect } from "react";

type SoundName = 
  | "click" 
  | "map-zoom" 
  | "global-ambience"
  | "battle-ambience"
  | "panel-ambience"
  | "panel-open" 
  | "panel-close" 
  | "conflict-select"
  | "tab-switch";

interface UseSoundOptions {
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
}

export function useSound(soundName: SoundName, options: UseSoundOptions = {}) {
  const { volume = 0.5, loop = false, autoplay = false } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = volume;
    audio.loop = loop;
    audioRef.current = audio;

    if (autoplay) {
      audio.play().catch((e) => console.log("Autoplay blocked:", e));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundName, volume, loop, autoplay]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log("Playback failed:", e));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  return { play, stop, setVolume };
}