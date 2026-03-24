"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

type ConflictId = "ukraine" | "israel-iran" | null;

export default function MapController({
  selectedId,
  onAnimationComplete,
}: {
  selectedId: ConflictId;
  onAnimationComplete: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    const views: Record<Exclude<ConflictId, null>, { center: [number, number]; zoom: number }> = {
      ukraine: { center: [49, 36], zoom: 5 },
      "israel-iran": { center: [30, 45], zoom: 3.8 },
    };

    if (selectedId && selectedId in views) {
      const view = views[selectedId];

      map.flyTo(view.center, view.zoom, {
        animate: true,
        duration: 2,
      });

      const t = setTimeout(onAnimationComplete, 2100);
      return () => clearTimeout(t);
    }

    map.setView([20, 40], 2, { animate: false });
  }, [selectedId, map, onAnimationComplete]);

  return null;
}
