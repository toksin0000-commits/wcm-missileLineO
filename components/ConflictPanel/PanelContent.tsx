"use client";

import { useState, useEffect } from "react";
import Timeline from "../Timeline";
import AIChat from "../AIChat";
import { ConflictData } from "./types";

interface PanelContentProps {
  conflict: ConflictData;
  activeTab: string;
}

export default function PanelContent({ conflict, activeTab }: PanelContentProps) {
  const [displayText, setDisplayText] = useState("");

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

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      paddingRight: '8px',
    }} className="custom-scrollbar">
      
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
      
      {activeTab === "timeline" && (
        <div style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
          <Timeline items={conflict.timeline} />
        </div>
      )}

      {activeTab === "arsenal" && conflict.arsenal && (
        <div style={{ 
          animation: 'fadeIn 0.4s ease-out forwards',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {conflict.arsenal.map((group: any, i: number) => (
            <div key={i} style={{
              backgroundColor: 'rgba(0, 242, 255, 0.03)',
              border: '1px solid rgba(0, 242, 255, 0.15)',
              padding: '16px',
              borderRadius: '4px'
            }}>
              <h3 style={{ color: '#00f2ff', fontSize: '13px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid rgba(0, 242, 255, 0.3)', paddingBottom: '5px', fontFamily: 'monospace' }}>
                {group.country}
              </h3>
              {Object.entries(group.categories || {}).map(([catName, items]: any) => (
                <div key={catName} style={{ marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>
                    {catName}
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((item: string, idx: number) => (
                      <li key={idx} style={{ fontSize: '11px', color: 'white', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', fontFamily: 'monospace' }}>
                        <span style={{ width: '3px', height: '3px', background: '#00f2ff' }}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {activeTab === "humanitarian" && (
        <div style={{ 
          animation: 'fadeIn 0.4s ease-out forwards',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}>
          <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Refugees</div>
            <div style={{ fontSize: '18px', color: '#00f2ff', fontWeight: 'bold' }}>{conflict.humanitarian.refugees.toLocaleString()}</div>
          </div>
          <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>IDPs</div>
            <div style={{ fontSize: '18px', color: '#00f2ff', fontWeight: 'bold' }}>{conflict.humanitarian.idps.toLocaleString()}</div>
          </div>
          <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Casualties</div>
            <div style={{ fontSize: '18px', color: 'rgba(255, 0, 0, 0.8)', fontWeight: 'bold' }}>{conflict.humanitarian.civilian_casualties.toLocaleString()}</div>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div style={{ animation: 'fadeIn 0.4s ease-out forwards', height: '320px' }}>
          <AIChat conflictId={conflict.id} />
        </div>
      )}
    </div>
  );
}