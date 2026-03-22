"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Polyline,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- 1. OVLADAČ KAMERY ---
function MapController({
  selectedId,
  onAnimationComplete,
}: {
  selectedId: string | null;
  onAnimationComplete: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    const views: Record<
      string,
      { center: [number, number]; zoom: number }
    > = {
      ukraine: { center: [49.0, 36.0], zoom: 5 },
      "israel-iran": { center: [33.5, 43.0], zoom: 4 },
    };

    if (selectedId && views[selectedId]) {
      map.flyTo(views[selectedId].center, views[selectedId].zoom, {
        animate: true,
        duration: 2.0,
      });

      const timer = setTimeout(onAnimationComplete, 2100);
      return () => clearTimeout(timer);
    } else {
      map.setView([20, 40], 2, {
        animate: false,
      });
    }
  }, [selectedId, map, onAnimationComplete]);

  return null;
}

// --- 2. KOMPONENTA PRO ÚTOKY ---
function AttackLines({
  selectedId,
  colors,
}: {
  selectedId: string | null;
  colors: any;
}) {
  if (!selectedId) return null;

  const SHIP_SIZE = 15;

  const attacks: Record<
    string,
    {
      from: [number, number];
      to: [number, number];
      size?: number;
      rotation?: number;
      duration: string;
      color?: string;
    }[]
  > = {
    ukraine: [
      {
        from: [54.0, 38.0],
        to: [50.5, 30.65],
        size: 13,
        rotation: 140,
        duration: "2s",
        color: "#FF5555",
      },
      {
        from: [50.59, 36.58],
        to: [50.05, 36.27],
        size: 10,
        rotation: 110,
        duration: "4s",
        color: "#FFAAAA",
      },
      {
        from: [47.23, 39.7],
        to: [48.46, 35.04],
        size: 12,
        rotation: 208,
        duration: "3s",
      },
      {
        from: [44.51, 34.16],
        to: [46.48, 30.72],
        size: 12,
        rotation: 220,
        duration: "3.5s",
      },
      {
        from: [50.45, 30.52],
        to: [55.75, 37.61],
        size: 12,
        rotation: 310,
        duration: "3s",
        color: "#0057B7",
      },
      {
        from: [49.99, 36.23],
        to: [51.67, 39.18],
        size: 12,
        rotation: 320,
        duration: "2.5s",
        color: "#0057B7",
      },
    ],
    "israel-iran": [
      {
        from: [35.68, 51.38],
        to: [32.2, 35.2],
        size: 10,
        rotation: 160,
        duration: "2.5s",
        color: "#39FF14",
      },
      {
        from: [32.66, 51.67],
        to: [32.79, 34.98],
        size: 10,
        rotation: 185,
        duration: "2.5s",
        color: "#1FBD00",
      },
      {
        from: [34.5, 47.5],
        to: [36.19, 44.0],
        size: 12,
        rotation: 215,
        duration: "1.5s",
        color: "#39FF14",
      },
      {
        from: [32.0, 48.0],
        to: [33.51, 36.27],
        size: 13,
        rotation: 190,
        duration: "5s",
        color: "#39FF14",
      },
      {
        from: [30.0, 50.0],
        to: [29.55, 34.95],
        size: 10,
        rotation: 185,
        duration: "3s",
      },
      {
        from: [32.08, 34.78],
        to: [35.55, 50.8],
        size: 12,
        rotation: 345,
        duration: "3s",
        color: "#0038B8",
      },
      {
        from: [31.04, 34.85],
        to: [32.6, 51.0],
        size: 10,
        rotation: 355,
        duration: "2.8s",
        color: "#0038B8",
      },
      {
        from: [26.5, 54.0],
        to: [29.0, 56.0],
        size: 10,
        rotation: 310,
        duration: "2s",
        color: "#FF00FF",
      },
      {
        from: [25.0, 57.5],
        to: [27.2, 60.7],
        size: 10,
        rotation: 320,
        duration: "2.2s",
        color: "#FF00FF",
      },
      {
        from: [34.5, 33.5],
        to: [33.7, 35.5],
        size: 10,
        rotation: 25,
        duration: "1.8s",
        color: "#FF00FF",
      },
    ],
  };

  const currentAttacks = attacks[selectedId] || [];
  const defaultColor =
    selectedId === "ukraine" ? colors.UKR_RUS : colors.ISR_IRN;

  const shipSvg = (color: string, size: number) => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px ${color});">
      <path d="M2 10h20l-3 9H5l-3-9z" />
      <path d="M12 2v8" />
      <path d="M9 6h6" />
    </svg>
  `;

  return (
    <>
      {currentAttacks.map((attack, index) => {
        const activeColor = attack.color || defaultColor;
        const s = attack.size || 20;
        const r = attack.rotation || 0;
        const isFromShip =
          attack.color === "#FF00FF" || attack.color === "#FFFFFF";

        return (
          <React.Fragment key={`${selectedId}-${index}`}>
            <Marker
              position={attack.from}
              interactive={false}
              icon={L.divIcon({
                className: "launch-point",
                html: isFromShip
                  ? `<div style="display: flex; align-items: center; justify-content: center;">${shipSvg(
                      activeColor,
                      SHIP_SIZE
                    )}</div>`
                  : `<div style="width: 8px; height: 8px; border: 2px solid ${activeColor}; border-radius: 50%; background: ${activeColor}44;"></div>`,
                iconSize: isFromShip ? [SHIP_SIZE, SHIP_SIZE] : [8, 8],
                iconAnchor: isFromShip ? [SHIP_SIZE / 2, SHIP_SIZE / 2] : [4, 4],
              })}
            />

            {/* statická přerušovaná linka */}
            <Polyline
              positions={[attack.from, attack.to]}
              pathOptions={{
                color: activeColor,
                weight: 1,
                opacity: 0.2,
                dashArray: "4, 8",
              }}
            />

            {/* animovaná střela – třídy přidáme až po mountu */}
            <Polyline
              positions={[attack.from, attack.to]}
              pathOptions={{
                color: activeColor,
                weight: 3,
                opacity: 1,
                lineCap: "round",
              }}
              eventHandlers={{
                add: (e) => {
                  const el = e.target.getElement();
                  if (el) {
                    el.classList.add("animate-missile-flow");
                    el.classList.add(`delay-m-${index}`);
                  }
                },
              }}
            />

            <Marker
              position={attack.to}
              interactive={false}
              icon={L.divIcon({
                className: "impact-arrow",
                html: `<div style="transform: rotate(${r}deg); color: ${activeColor}; display: flex; align-items: center; justify-content: center;">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="${s}" height="${s}" style="filter: drop-shadow(0 0 5px ${activeColor});">
                    <path d="M21 12l-18 9v-18z" />
                  </svg>
                </div>`,
                iconSize: [s, s],
                iconAnchor: [s / 2, s / 2],
              })}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

// --- 3. ZVÝRAZNĚNÍ STÁTŮ ---
function ConflictCountries({
  selectedId,
  show,
}: {
  selectedId: string | null;
  show: boolean;
}) {
  const [borderData, setBorderData] = useState<any>(null);

  useEffect(() => {
    fetch("/data/countries.json")
      .then((response) => response.json())
      .then((data) => {
        setBorderData(data);
      })
      .catch((error) => console.error("Chyba při načítání:", error));
  }, []);

  const getCountryStyle = (feature: any) => {
    const name =
      feature.properties.NAME ||
      feature.properties.ADMIN ||
      feature.properties.NAME_LONG;

    if (!selectedId) return { weight: 0, fillOpacity: 0, opacity: 0 };

    if (selectedId === "ukraine") {
      if (name === "Ukraine")
        return {
          color: "#0057B7",
          weight: 1,
          fillColor: "#0057B7",
          fillOpacity: 0.15,
        };
      if (name === "Russia")
        return {
          color: "#FF5555",
          weight: 1,
          fillColor: "#FF5555",
          fillOpacity: 0.15,
        };
    }

    if (selectedId === "israel-iran") {
      if (name === "Israel")
        return {
          color: "#0057B7",
          weight: 1,
          fillColor: "#0057B7",
          fillOpacity: 0.15,
        };
      if (name === "Iran")
        return {
          color: "#39FF14",
          weight: 1,
          fillColor: "#39FF14",
          fillOpacity: 0.15,
        };
    }

    return { weight: 0, fillOpacity: 0, opacity: 0 };
  };

  if (!borderData || !show || !selectedId) return null;

  return <GeoJSON data={borderData} style={getCountryStyle} />;
}

// --- 4. HLAVNÍ KOMPONENTA MAPY ---
export default function Map({
  onSelectConflict,
  isDimmed,
  selectedId,
}: any) {
  const [showAttacks, setShowAttacks] = useState(false);
  const [showBorders, setShowBorders] = useState(false);
  const COLORS = { UKR_RUS: "#FF0000", ISR_IRN: "#39FF14" };

  const handleArrival = useCallback(() => {
    setShowAttacks(true);
    setShowBorders(true);
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setShowAttacks(false);
      setShowBorders(false);
    }
  }, [selectedId]);

  return (
    <div className="w-full h-full bg-[#020617] relative overflow-hidden">
      <div
        className={`w-full h-full transition-all duration-1000 ${
          isDimmed ? "brightness-[0.3] grayscale" : "brightness-100"
        }`}
      >
        <MapContainer
          center={[20, 0]}
          zoom={2}
          className="w-full h-full"
          zoomControl={false}
          style={{ background: "#020617" }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png" />

          <MapController
            selectedId={selectedId}
            onAnimationComplete={handleArrival}
          />

          <ConflictCountries selectedId={selectedId} show={showBorders} />

          <Marker
            position={[48.3794, 31.1656]}
            icon={L.divIcon({
              html: `
                <div class="scope-container">
                  <div class="scope-ukr-pulse"></div>
                  <div class="scope-cross-h" style="background: ${COLORS.UKR_RUS}"></div>
                  <div class="scope-cross-v" style="background: ${COLORS.UKR_RUS}"></div>
                </div>`,
              className: "",
            })}
            eventHandlers={{ click: () => onSelectConflict("ukraine") }}
          />

          <Marker
            position={[31.0461, 34.8516]}
            icon={L.divIcon({
              html: `
                <div class="scope-container">
                  <div class="scope-isr-pulse"></div>
                  <div class="scope-cross-h" style="background: ${COLORS.ISR_IRN}"></div>
                  <div class="scope-cross-v" style="background: ${COLORS.ISR_IRN}"></div>
                </div>`,
              className: "",
            })}
            eventHandlers={{ click: () => onSelectConflict("israel-iran") }}
          />

          {showAttacks && (
            <AttackLines selectedId={selectedId} colors={COLORS} />
          )}
        </MapContainer>
      </div>

      {showAttacks && (
        <div className="absolute top-5 right-5 z-[9999]">
          <button
            onClick={() => setShowBorders(!showBorders)}
            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg ${
              showBorders
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
            }`}
          >
            {showBorders ? "HIDE BORDERS" : "SHOW BORDERS"}
          </button>
        </div>
      )}

      {showAttacks && (
        <div className="absolute bottom-10 right-10 z-[9999] flex items-center justify-center animate-slide-in-up">
          <div className="absolute inset-0 bg-red-600/30 rounded-xl animate-ping duration-2000"></div>

          <button
            onClick={() => onSelectConflict(selectedId)}
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="w-5 h-5 text-red-500 group-hover:text-white group-hover:rotate-12 transition-transform"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scope-container {
          position: relative;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scope-ukr-pulse {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid #ff0000;
          border-radius: 50%;
          animation: pulse 0.8s infinite ease-out;
        }

        .scope-isr-pulse {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid #39ff14;
          border-radius: 50%;
          animation: pulse 2.5s infinite ease-in-out;
          animation-delay: -0.75s;
        }

        .scope-cross-h {
          position: absolute;
          width: 15px;
          height: 1px;
        }
        .scope-cross-v {
          position: absolute;
          width: 1px;
          height: 15px;
        }

        @keyframes missile-move {
          0% {
            stroke-dashoffset: 400;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .animate-missile-flow {
          stroke-dasharray: 20, 360 !important;
          animation: missile-move 3s linear infinite !important;
          -webkit-animation: missile-move 3s linear infinite !important;
          filter: drop-shadow(0 0 8px currentColor);
          will-change: stroke-dashoffset;
          transform: translateZ(0);
        }

        .delay-m-0 {
          animation-delay: 0s !important;
        }
        .delay-m-1 {
          animation-delay: 0.4s !important;
        }
        .delay-m-2 {
          animation-delay: 0.8s !important;
        }
        .delay-m-3 {
          animation-delay: 1.2s !important;
        }
        .delay-m-4 {
          animation-delay: 1.6s !important;
        }
        .delay-m-5 {
          animation-delay: 2s !important;
        }
        .delay-m-6 {
          animation-delay: 2.4s !important;
        }
        .delay-m-7 {
          animation-delay: 2.8s !important;
        }
        .delay-m-8 {
          animation-delay: 3.2s !important;
        }
        .delay-m-9 {
          animation-delay: 3.6s !important;
        }
      `}</style>
    </div>
  );
}
