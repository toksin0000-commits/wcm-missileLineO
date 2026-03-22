"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MiniMapProps {
  area: {
    lat: number;
    lng: number;
    zoom: number;
  };
}

// SCI-FI MARKER
const sciFiIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="
    background-color: #00f2ff;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    box-shadow: 0 0 10px #00f2ff, 0 0 20px #00f2ff;
    border: 2px solid white;
  "></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

export default function MiniMap({ area }: MiniMapProps) {
  return (
    <div className="w-full h-48 border border-cyan-900/30 relative overflow-hidden group">
      {/* Dekorativní rohy */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400 z-10"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400 z-10"></div>

      <MapContainer
        center={[area.lat, area.lng]}
        zoom={area.zoom}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full mini-map-container"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <Marker position={[area.lat, area.lng]} icon={sciFiIcon} />
      </MapContainer>

      {/* Digitální šum */}
      <div className="absolute inset-0 pointer-events-none bg-cyan-500/5 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
}
