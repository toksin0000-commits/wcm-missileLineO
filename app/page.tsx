"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ConflictPanel from "../components/ConflictPanel";

// ⭐ Importujeme typ ConflictId z Map komponenty
import type { ConflictId } from "../components/map/Map";

const Map = dynamic(() => import("../components/map/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-[#020617]" />
});

export default function Home() {

  // ⭐ selectedConflictId musí být typu ConflictId
  const [selectedConflictId, setSelectedConflictId] = useState<ConflictId>(null);
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // ⭐ handleSelect musí přijímat ConflictId
  const handleSelect = (id: ConflictId) => {
    if (id === selectedConflictId && !isPanelOpen) {
      setIsPanelOpen(true);
    } else {
      setIsPanelOpen(false);
      setSelectedConflictId(id);
    }
  };

  const handleMapMoveEnd = () => {
    if (selectedConflictId) {
      setIsPanelOpen(true);
    }
  };

  const handleClose = () => {
    setIsPanelOpen(false);
    setSelectedConflictId(null);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#020617]">
      
      <div className="absolute inset-0 z-0">
        <Map 
          onSelectConflict={handleSelect} 
          isDimmed={isPanelOpen}
          selectedId={selectedConflictId} 
        />
      </div>

      <ConflictPanel 
        conflictId={selectedConflictId} 
        isOpen={isPanelOpen}
        onClose={handleClose} 
      />

    </main>
  );
}
