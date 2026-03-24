"use client";

import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import MapController from "./MapController";
import AttackLines from "./AttackLines";
import ConflictCountries from "./ConflictCountries";

// ⭐ JEDINÁ ÚPRAVA — EXPORTUJEME TYP
export type ConflictId = "ukraine" | "israel-iran" | null;

type MapProps = {
  onSelectConflict: (id: ConflictId) => void;
  isDimmed: boolean;
  selectedId: ConflictId;
};

export default function Map({
  onSelectConflict,
  isDimmed,
  selectedId,
}: MapProps) {
  const [showAttacks, setShowAttacks] = useState(false);
  const [showBorders, setShowBorders] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const COLORS = { UKR_RUS: "#FF0000", ISR_IRN: "#39FF14" };

  const handleArrival = useCallback(() => {
    setShowAttacks(true);
    setShowBorders(true);
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setShowAttacks(false);
      setShowBorders(false);
      setPanelOpen(false);
    }
  }, [selectedId]);

  return (
    <div className="w-full h-full bg-[#020617] relative overflow-hidden">

      {showAttacks && selectedId && !panelOpen && (
        <div className="absolute top-5 right-5 z-[9999] flex gap-3">

          <button
            onClick={() => setShowBorders(!showBorders)}
            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg ${
              showBorders 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
            }`}
          >
            {showBorders ? 'HIDE BORDERS' : 'SHOW BORDERS'}
          </button>

          <button
            onClick={() => { onSelectConflict(null); setPanelOpen(false); }}
            className="px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600 transition-all duration-300 shadow-lg"
          >
            GLOBAL MAP
          </button>

        </div>
      )}

      <div className={`w-full h-full transition-all duration-1000 ${isDimmed ? "brightness-[0.3] grayscale" : "brightness-100"}`}>
        <MapContainer
  center={[20, 0]}
  zoom={2}
  className="w-full h-full"
  zoomControl={false}
  style={{ background: "#020617" }}
  maxBounds={[[-85, -180], [85, 180]]}
  maxBoundsViscosity={1.0}
>

          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png" />

          <MapController selectedId={selectedId} onAnimationComplete={handleArrival} />

          <ConflictCountries selectedId={selectedId} show={showBorders} />

          <Marker 
            position={[48.3794, 31.1656]} 
            icon={L.divIcon({ 
              html: `
                <div class="scope-container">
                  <div class="scope-pulse scope-pulse-ukr"></div>
                  <div class="scope-cross-h" style="background: ${COLORS.UKR_RUS}"></div>
                  <div class="scope-cross-v" style="background: ${COLORS.UKR_RUS}"></div>
                </div>`, 
              className: "" 
            })} 
            eventHandlers={{ click: () => { onSelectConflict("ukraine"); setPanelOpen(false); } }} 
          />

          <Marker 
            position={[31.0461, 34.8516]} 
            icon={L.divIcon({ 
              html: `
                <div class="scope-container">
                  <div class="scope-pulse scope-pulse-isr"></div>
                  <div class="scope-cross-h" style="background: ${COLORS.ISR_IRN}"></div>
                  <div class="scope-cross-v" style="background: ${COLORS.ISR_IRN}"></div>
                </div>`, 
              className: "" 
            })} 
            eventHandlers={{ click: () => { onSelectConflict("israel-iran"); setPanelOpen(false); } }} 
          />

          {showAttacks && <AttackLines selectedId={selectedId} colors={COLORS} />}
        </MapContainer>
      </div>

      {showAttacks && (
        <div className="absolute bottom-10 right-10 z-[9999] flex items-center justify-center animate-slide-in-up">
          <div className="absolute inset-0 bg-red-600/30 rounded-xl animate-ping duration-[2000ms]"></div>
          
          <button
            onClick={() => { 
              onSelectConflict(selectedId);
              setPanelOpen(true);
            }}
            className="group relative flex items-center gap-3 px-6 py-4 bg-slate-900 border border-red-900/50 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:border-red-500 hover:scale-105 active:scale-95 animate-pulse-slow"
          >
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-black animate-pulse">
                System Active
              </span>
              <span className="text-sm font-black text-white uppercase tracking-widest">
                Conflict Panel
              </span>
            </div>
            
            <div className="w-10 h-10 flex items-center justify-center bg-red-600/20 rounded-lg group-hover:bg-red-600 transition-all duration-300 shadow-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-red-500 group-hover:text-white group-hover:rotate-12 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse { 
          0% { transform: scale(1); opacity: 1; } 
          100% { transform: scale(2.2); opacity: 0; } 
        }

        .scope-container { 
          position: relative; 
          width: 30px; 
          height: 30px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer;
        }

        .scope-pulse { 
          position: absolute; 
          width: 20px; 
          height: 20px; 
          border-radius: 50%; 
        }

        .scope-pulse-ukr { 
          border: 2px solid #FF0000; 
          animation: pulse 0.8s infinite ease-out; 
        }

        .scope-pulse-isr { 
          border: 2px solid #39FF14; 
          animation: pulse 2.5s infinite ease-in-out; 
          animation-delay: -0.75s;
        }

        .scope-cross-h, .scope-cross-v {
          position: absolute;
          background: currentColor;
          opacity: 0.7;
        }
        .scope-cross-h { width: 15px; height: 1px; }
        .scope-cross-v { width: 1px; height: 15px; }
      `}</style>

    </div>
  );
}
