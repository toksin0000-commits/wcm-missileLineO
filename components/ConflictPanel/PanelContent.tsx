"use client";

import { useState, useEffect } from "react";
import Timeline from "../Timeline";
import AIChat from "../AIChat";
import { ConflictData } from "./types";
import PanelContentArsenal from "./PanelContentArsenal";

interface PanelContentProps {
  conflict: ConflictData;
  activeTab: string;
}

export default function PanelContent({ conflict, activeTab }: PanelContentProps) {
  const [displayText, setDisplayText] = useState("");
  const [openWeapons, setOpenWeapons] = useState<{ [key: string]: boolean }>({});

  // Animace textu pro context tab
  useEffect(() => {
    if (activeTab === "context" && conflict?.summary_long) {
      setDisplayText("");
      let i = 0;
      const fullText = conflict.summary_long;
      
      const interval = setInterval(() => {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
        if (i >= fullText.length) {
          clearInterval(interval);
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [activeTab, conflict]);

  const toggleWeapon = (weaponId: string) => {
    setOpenWeapons(prev => ({
      ...prev,
      [weaponId]: !prev[weaponId]
    }));
  };

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      paddingRight: '8px',
    }} className="custom-scrollbar">
      
      {/* CONTEXT TAB */}
      {activeTab === "context" && (
        <div style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
          <div style={{ 
            fontSize: '14px', 
            color: 'rgba(0, 242, 255, 0.7)', 
            lineHeight: '1.7',
            fontFamily: 'monospace',
          }}>
            {displayText}
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '16px',
              backgroundColor: '#00f2ff',
              marginLeft: '4px',
              animation: 'pulse 1s infinite',
            }}></span>
          </div>
        </div>
      )}
      
      {/* TIMELINE TAB */}
      {activeTab === "timeline" && (
        <div style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
          <Timeline items={conflict.timeline} />
        </div>
      )}

      {/* ARSENAL TAB - delegováno do samostatného souboru */}
      {activeTab === "arsenal" && (
        <PanelContentArsenal
          arsenal={conflict.arsenal}
          openWeapons={openWeapons}
          onToggleWeapon={toggleWeapon}
        />
      )}

      {/* HUMANITARIAN TAB */}
      {activeTab === "humanitarian" && (
        <div style={{ animation: 'fadeIn 0.2s ease-out forwards' }}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ 
              backgroundColor: 'rgba(0, 242, 255, 0.05)', 
              border: '1px solid rgba(0, 242, 255, 0.1)', 
              padding: '12px', 
              textAlign: 'center',
              animation: 'slideInFromRight 0.4s ease-out forwards',
              animationDelay: '0.2s',
              opacity: 0,
              animationFillMode: 'forwards'
            }}>
              <div style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Refugees</div>
              <div style={{ fontSize: '18px', color: '#00f2ff', fontWeight: 'bold' }}>{conflict.humanitarian.refugees.toLocaleString()}</div>
            </div>
            <div style={{ 
              backgroundColor: 'rgba(0, 242, 255, 0.05)', 
              border: '1px solid rgba(0, 242, 255, 0.1)', 
              padding: '12px', 
              textAlign: 'center',
              animation: 'slideInFromRight 0.4s ease-out forwards',
              animationDelay: '0.4s',
              opacity: 0,
              animationFillMode: 'forwards'
            }}>
              <div style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>IDPs</div>
              <div style={{ fontSize: '18px', color: '#00f2ff', fontWeight: 'bold' }}>{conflict.humanitarian.idps.toLocaleString()}</div>
            </div>
            <div style={{ 
              backgroundColor: 'rgba(0, 242, 255, 0.05)', 
              border: '1px solid rgba(0, 242, 255, 0.1)', 
              padding: '12px', 
              textAlign: 'center',
              animation: 'slideInFromRight 0.4s ease-out forwards',
              animationDelay: '0.6s',
              opacity: 0,
              animationFillMode: 'forwards'
            }}>
              <div style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Casualties</div>
              <div style={{ fontSize: '18px', color: 'rgba(255, 0, 0, 0.8)', fontWeight: 'bold' }}>{conflict.humanitarian.civilian_casualties.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* AI TAB */}
      {activeTab === "ai" && (
        <div style={{ animation: 'fadeIn 0.4s ease-out forwards', height: '320px' }}>
          <AIChat conflictId={conflict.id} />
        </div>
      )}
    </div>
  );
}