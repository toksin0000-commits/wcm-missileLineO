"use client";

import React from "react";
import { Marker, Polyline } from "react-leaflet";
import L from "leaflet";

export default function AttackLines({
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
      duration: string;   // ⭐ rychlost
      color?: string;     // ⭐ barva
      width?: number;     // ⭐ tloušťka čáry
      length?: number;    // ⭐ délka čáry
      delay?: number;     // ⭐ zpoždění startu
    }[]
  > = {
    ukraine: [
      { from: [54.0, 38.0], to: [50.5, 30.65], size: 13, rotation: 140, duration: "2s", color: "#FF0033", width: 3, length: 900, delay: 0 },
      { from: [50.59, 36.58], to: [50.05, 36.27], size: 10, rotation: 110, duration: "4s", color: "#FF0033", width: 3, length: 600, delay: 300 },
      { from: [47.23, 39.7], to: [48.46, 35.04], size: 12, rotation: 208, duration: "3s", color: "#FF0033", width: 3, length: 1200, delay: 600 },
      { from: [44.51, 34.16], to: [46.48, 30.72], size: 12, rotation: 220, duration: "3.5s", color: "#FF0033", width: 3, length: 1000, delay: 900 },
      { from: [50.45, 30.52], to: [55.75, 37.61], size: 12, rotation: 310, duration: "3s", color: "#0057B7", width: 3, length: 1100, delay: 1200 },
      { from: [49.99, 36.23], to: [51.67, 39.18], size: 12, rotation: 320, duration: "2.5s", color: "#0057B7", width: 3, length: 700, delay: 1500 },
    ],

    "israel-iran": [
      { from: [34.8, 51.38], to: [32.2, 35.2], size: 10, rotation: 160, duration: "2.5s", color: "#1FBD00", width: 3, length: 1000, delay: 0 },
      { from: [32.66, 51.67], to: [32.79, 34.98], size: 10, rotation: 185, duration: "2.5s", color: "#1FBD00", width: 3, length: 700, delay: 300 },
      { from: [34.5, 47.5], to: [36.19, 44.0], size: 12, rotation: 215, duration: "1.5s", color: "#1FBD00", width: 3, length: 1500, delay: 600 },
      { from: [32.0, 48.0], to: [33.51, 36.27], size: 13, rotation: 190, duration: "5s", color: "#1FBD00", width: 3, length: 1300, delay: 900 },
      { from: [30.0, 50.0], to: [29.55, 34.95], size: 10, rotation: 185, duration: "3s", color: "#1FBD00",width: 3, length: 900, delay: 2000 },
      { from: [32.08, 34.78], to: [35.55, 50.8], size: 12, rotation: 345, duration: "3s", color: "#0038B8", width: 3, length: 1100, delay: 1500 },
      { from: [31.04, 34.85], to: [32.6, 51.0], size: 10, rotation: 355, duration: "2.8s", color: "#0038B8", width: 3, length: 800, delay: 1800 },
      { from: [26.5, 54.0], to: [29.0, 56.0], size: 10, rotation: 310, duration: "2s", color: "#FF00FF", width: 3, length: 700, delay: 2100 },
      { from: [25.0, 57.5], to: [27.2, 60.7], size: 10, rotation: 320, duration: "2.2s", color: "#FF00FF", width: 3, length: 800, delay: 2400 },
      { from: [34.5, 33.5], to: [33.7, 35.5], size: 10, rotation: 25, duration: "1.8s", color: "#FF00FF", width: 3, length: 600, delay: 2700 },
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
        const color = attack.color || defaultColor;
        const width = attack.width || 3;
        const length = attack.length || 1000;
        const duration = attack.duration;
        const delay = attack.delay ?? index * 350;
        const rotation = attack.rotation || 0;
        const size = attack.size || 20;
        const isShip = attack.color === "#FF00FF" || attack.color === "#FFFFFF";

        return (
          <React.Fragment key={`${selectedId}-${index}`}>
            {/* START POINT */}
            <Marker
              position={attack.from}
              interactive={false}
              icon={L.divIcon({
                className: "launch-point",
                html: isShip
                  ? `<div style="display:flex;align-items:center;justify-content:center;">${shipSvg(
                      color,
                      SHIP_SIZE
                    )}</div>`
                  : `<div style="width:8px;height:8px;border:2px solid ${color};border-radius:50%;background:${color}44;"></div>`,
                iconSize: isShip ? [SHIP_SIZE, SHIP_SIZE] : [8, 8],
                iconAnchor: isShip ? [SHIP_SIZE / 2, SHIP_SIZE / 2] : [4, 4],
              })}
            />

            {/* STATIC DASHED TRAIL */}
            <Polyline
              positions={[attack.from, attack.to]}
              pathOptions={{
                color,
                weight: width - 2,
                opacity: 0.2,
                dashArray: "4, 8",
              }}
            />

            {/* ANIMATED MISSILE */}
            <Polyline
              positions={[attack.from, attack.to]}
              pathOptions={{
                color,
                weight: width,
                opacity: 1,
                lineCap: "round",
              }}
              eventHandlers={{
                add: (e) => {
                  const el = e.target.getElement();
                  if (el) {
                    // ⭐ nastavíme délku čáry
                    el.style.strokeDasharray = `${length}`;
                    el.style.strokeDashoffset = `${length}`;

                    // ⭐ nastavíme rychlost
                    el.style.animationDuration = duration;

                    // ⭐ spustíme animaci se zpožděním
                    setTimeout(() => {
                      el.classList.add("animate-missile-flow");
                    }, delay);
                  }
                },
              }}
            />

            {/* IMPACT ARROW */}
            <Marker
              position={attack.to}
              interactive={false}
              icon={L.divIcon({
                className: "impact-arrow",
                html: `
                  <div style="transform:rotate(${rotation}deg);color:${color};display:flex;align-items:center;justify-content:center;">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="${size}" height="${size}" style="filter:drop-shadow(0 0 5px ${color});">
                      <path d="M21 12l-18 9v-18z" />
                    </svg>
                  </div>`,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
              })}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
