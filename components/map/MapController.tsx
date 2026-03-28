"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useSoundContext } from "@/context/SoundContext";

type ConflictId = "ukraine" | "israel-iran" | null;

export default function MapController({
  selectedId,
  onAnimationComplete,
  isPanelOpen,  // ← nový prop
}: {
  selectedId: ConflictId;
  onAnimationComplete: () => void;
  isPanelOpen: boolean;  // ← nový prop
}) {
  const map = useMap();
  const { playMapZoom, playConflictSelect } = useSoundContext();
  const previousZoomRef = useRef(map.getZoom());
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasPlayedZoomForCurrentSelection = useRef(false);

  // Sledování ručního zoomu (kolečko myši) - žádný zvuk
  useEffect(() => {
    const handleZoomEnd = () => {
      previousZoomRef.current = map.getZoom();
    };

    map.on("zoomend", handleZoomEnd);
    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map]);

  // Zvuk při výběru konfliktu
  useEffect(() => {
    if (selectedId && !isPanelOpen) {
      playConflictSelect();
    }
  }, [selectedId, isPanelOpen, playConflictSelect]);

  // Animace kamery se zvukem zoomu (POUZE PŘI VÝBĚRU KONFLIKTU, NE PŘI OTEVŘENÍ PANELU)
  useEffect(() => {
    const views: Record<Exclude<ConflictId, null>, { center: [number, number]; zoom: number }> = {
      ukraine: { center: [49, 36], zoom: 5 },
      "israel-iran": { center: [30, 45], zoom: 3.8 },
    };

    if (selectedId && selectedId in views && !isPanelOpen) {
      const view = views[selectedId];
      
      // Při animovaném zoomu spustíme zvuk OKAMŽITĚ (pouze pokud ještě nehrál pro tuto volbu)
      if (!hasPlayedZoomForCurrentSelection.current) {
        playMapZoom();
        hasPlayedZoomForCurrentSelection.current = true;
      }
      
      map.flyTo(view.center, view.zoom, {
        animate: true,
        duration: 2,
      });

      // Vyčistíme předchozí timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      animationTimeoutRef.current = setTimeout(() => {
        onAnimationComplete();
        animationTimeoutRef.current = null;
      }, 2100);
      
      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    }
    
    // Reset flagu když není vybraný konflikt nebo je panel otevřený
    if (!selectedId || isPanelOpen) {
      hasPlayedZoomForCurrentSelection.current = false;
    }
    
    // Pokud je panel otevřený, neprovádíme žádnou animaci
    if (!selectedId && !isPanelOpen) {
      map.setView([20, 40], 2, { animate: false });
    }
  }, [selectedId, isPanelOpen, map, onAnimationComplete, playMapZoom]);

  return null;
}