"use client";

import PanelContent from "./PanelContent";
import { ConflictData } from "./types";

interface PanelTabsProps {
  conflict: ConflictData;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function PanelTabs({ conflict, activeTab, onTabChange }: PanelTabsProps) {
  const tabs = [
    { id: "context", label: "Context" },
    { id: "timeline", label: "Timeline" },
    { id: "arsenal", label: "Arsenal" },
    { id: "humanitarian", label: "Impact" },
    { id: "ai", label: "Tactical AI" },
  ];

  return (
    <>
      <div style={{
        display: 'flex',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(0, 242, 255, 0.1)',
        padding: '4px',
        marginBottom: '16px',
        height: '45px', 
        overflowX: 'auto', 
        whiteSpace: 'nowrap', 
        scrollbarWidth: 'none', 
        WebkitOverflowScrolling: 'touch', 
      }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            style={{
              flex: '0 0 auto',
              padding: '0 20px',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: activeTab === t.id ? '#00f2ff' : '#0891b2',
              backgroundColor: activeTab === t.id ? 'rgba(0, 242, 255, 0.1)' : 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: activeTab === t.id ? '2px solid #00f2ff' : '2px solid transparent',
              transition: 'all 0.2s',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'monospace'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <PanelContent conflict={conflict} activeTab={activeTab} />
    </>
  );
}