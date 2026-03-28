"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useSound } from "@/hooks/useSound";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playMapZoom: () => void;
  playGlobalAmbience: () => void;
  stopGlobalAmbience: () => void;
  playBattleAmbience: () => void;
  stopBattleAmbience: () => void;
  playPanelAmbience: () => void;
  stopPanelAmbience: () => void;
  playPanelOpen: () => void;
  playPanelClose: () => void;
  playConflictSelect: () => void;
  playTabSwitch: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  
  const click = useSound("click", { volume: 0.3 });
  const mapZoom = useSound("map-zoom", { volume: 0.4 });
  const globalAmbience = useSound("global-ambience", { volume: 0.2, loop: true });
  const battleAmbience = useSound("battle-ambience", { volume: 0.5, loop: true });
  const panelAmbience = useSound("panel-ambience", { volume: 0.3, loop: true });
  const panelOpen = useSound("panel-open", { volume: 0.4 });
  const panelClose = useSound("panel-close", { volume: 0.4 });
  const conflictSelect = useSound("conflict-select", { volume: 0.5 });
  const tabSwitch = useSound("tab-switch", { volume: 0.25 });

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const playIfNotMuted = useCallback((playFn: () => void) => {
    if (!isMuted) {
      playFn();
    }
  }, [isMuted]);

  const playGlobalAmbience = useCallback(() => {
    if (!isMuted) {
      globalAmbience.play();
    }
  }, [isMuted, globalAmbience]);

  const stopGlobalAmbience = useCallback(() => {
    globalAmbience.stop();
  }, [globalAmbience]);

  const playBattleAmbience = useCallback(() => {
    if (!isMuted) {
      battleAmbience.play();
    }
  }, [isMuted, battleAmbience]);

  const stopBattleAmbience = useCallback(() => {
    battleAmbience.stop();
  }, [battleAmbience]);

  const playPanelAmbience = useCallback(() => {
    if (!isMuted) {
      panelAmbience.play();
    }
  }, [isMuted, panelAmbience]);

  const stopPanelAmbience = useCallback(() => {
    panelAmbience.stop();
  }, [panelAmbience]);

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playClick: () => playIfNotMuted(click.play),
        playMapZoom: () => playIfNotMuted(mapZoom.play),
        playGlobalAmbience,
        stopGlobalAmbience,
        playBattleAmbience,
        stopBattleAmbience,
        playPanelAmbience,
        stopPanelAmbience,
        playPanelOpen: () => playIfNotMuted(panelOpen.play),
        playPanelClose: () => playIfNotMuted(panelClose.play),
        playConflictSelect: () => playIfNotMuted(conflictSelect.play),
        playTabSwitch: () => playIfNotMuted(tabSwitch.play),
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSoundContext must be used within SoundProvider");
  }
  return context;
}