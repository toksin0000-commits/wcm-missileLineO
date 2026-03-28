"use client";

import { useState, useEffect } from "react";
import conflicts from "@/data/conflicts.json";
import PanelTabs from "./PanelTabs";
import { ConflictData, ConflictPanelProps } from "./types";
import { useSoundContext } from "@/context/SoundContext";

export default function ConflictPanel({ conflictId, onClose, isOpen }: ConflictPanelProps) {
  const [activeTab, setActiveTab] = useState("context");
  const [panelOpacity, setPanelOpacity] = useState(0);
  
  const { playClick, playPanelClose } = useSoundContext();
  
  const conflict = conflicts.find((c) => c.id === conflictId) as ConflictData | undefined;

  useEffect(() => {
    if (isOpen) {
      setPanelOpacity(0);
      const timeout = setTimeout(() => setPanelOpacity(0.6), 50);
      return () => clearTimeout(timeout);
    } else {
      setPanelOpacity(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (conflictId) {
      setActiveTab("context");
    }
  }, [conflictId]);

  const handleClose = () => {
    playClick();
    playPanelClose();
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '520px',
        zIndex: 1000,
        backgroundColor: `rgba(2, 6, 23, ${panelOpacity})`,
        backdropFilter: `blur(${panelOpacity * 3.33}px)`,
        WebkitBackdropFilter: `blur(${panelOpacity * 3.33}px)`,
        borderTop: '1px solid rgba(0, 242, 255, 0.3)',
        padding: '30px',
        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), background-color 2s ease, backdrop-filter 0.5s ease',
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        pointerEvents: isOpen ? 'auto' : 'none',
        clipPath: 'polygon(0 25px, 25px 0, 100% 0, 100% 100%, 0 100%)',
        animation: 'panelPulse 3s infinite',
      }}
    >
      <button 
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '25px',
          background: 'none',
          border: 'none',
          color: '#00f2ff',
          fontFamily: 'monospace',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 1100,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        [×]
      </button>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'rgba(0, 242, 255, 0.15)',
        boxShadow: '0 0 15px #00f2ff',
        animation: 'scanline 4s linear infinite',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: panelOpacity,
      }} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {isOpen && !conflict && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p style={{ color: '#00f2ff', animation: 'pulse 2s infinite', fontFamily: 'monospace' }}>
              INITIALIZING DATA UPLOAD...
            </p>
          </div>
        )}
        
        {!isOpen && !conflict && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p style={{ color: 'rgba(0, 242, 255, 0.5)', fontFamily: 'monospace' }}>
              AWAITING SECTOR SELECTION
            </p>
          </div>
        )}
        
        {conflict && (
          <>
            <div style={{ marginBottom: '16px', height: '80px' }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#00f2ff', 
                textTransform: 'uppercase', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                <span style={{ 
                  width: '4px', 
                  height: '20px', 
                  backgroundColor: '#00f2ff', 
                  boxShadow: '0 0 10px #00f2ff' 
                }}></span>
                {conflict.name}
              </h2>
              <p style={{ 
                fontSize: '11px', 
                color: '#0891b2', 
                fontStyle: 'italic', 
                marginTop: '4px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {conflict.summary_short}
              </p>
            </div>

            <PanelTabs 
              conflict={conflict} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </>
        )}
      </div>
    </div>
  );
}