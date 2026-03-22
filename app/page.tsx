"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ConflictPanel from "../components/ConflictPanel";

const Map = dynamic(() => import("../components/map/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-[#020617]" />
});

export default function Home() {
  // 1. selectedConflictId říká MAPĚ, kam má letět
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(null);
  
  // 2. isPanelOpen říká PANELU, kdy má vyjet (vglobals.css ovládá .panel--visible)
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Funkce, která se spustí při kliknutí na terč
  const handleSelect = (id: string) => {
    if (id === selectedConflictId && !isPanelOpen) {
      // Pokud uživatel klikne na stejný terč a panel je zavřený, otevřeme ho hned
      setIsPanelOpen(true);
    } else {
      // Nový výběr: Nejdřív zavřeme panel (pokud byl otevřený) a pošleme mapu na cestu
      setIsPanelOpen(false);
      setSelectedConflictId(id);
    }
  };

  // Funkce, kterou zavolá MAPA ve chvíli, kdy dokončí flyTo animaci
  const handleMapMoveEnd = () => {
    if (selectedConflictId) {
      setIsPanelOpen(true); // Mapa doletěla, teď vytáhneme panel
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
          
          isDimmed={isPanelOpen} // Mapa ztmavne až ve chvíli, kdy vyjede panel
          selectedId={selectedConflictId} 
        />
      </div>

      {/* ConflictPanel teď musí dostat stav isPanelOpen místo selectedConflictId */}
      <ConflictPanel 
        conflictId={selectedConflictId} 
        isOpen={isPanelOpen} // Ujisti se, že ConflictPanel používá tuhle prop pro CSS třídu
        onClose={handleClose} 
      />

    </main>
  );
}