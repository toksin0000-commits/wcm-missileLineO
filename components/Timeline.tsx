"use client";

import { useEffect, useState } from "react";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    if (!items) return;
    // Resetujeme viditelné položky při změně dat
    setVisibleItems([]);
    
    items.forEach((_, i) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, i]);
      }, i * 100);
    });
  }, [items]);

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center gap-2 text-cyan-900 font-mono text-sm uppercase">
        <span className="animate-pulse">▶</span> No data records found in archives.
      </div>
    );
  }

  return (
    <div className="timeline font-mono">
      {/* Dekorativní záhlaví osy */}
      <div className="text-[10px] text-cyan-600 mb-4 opacity-50 flex justify-between uppercase">
        <span>Temporal Log Entry</span>
        <span>ID_SEC: {Math.random().toString(36).substring(7).toUpperCase()}</span>
      </div>

      {items.map((item, i) => (
        <div
          key={i}
          className={`timeline-item group ${visibleItems.includes(i) ? "show" : ""}`}
        >
          {/* Datum s technickým prefixem */}
          <div className="timeline-date flex items-center gap-2 text-cyan-400!">
            <span className="text-[10px] opacity-40">T-</span>
            {item.date}
          </div>

          {/* Titulek s efektem aktivního bodu */}
          <div className="timeline-title group-hover:text-white transition-colors flex items-center gap-2">
            {item.title}
            <span className="h-px flex-1 bg-cyan-900/30 group-hover:bg-cyan-500/30 transition-all"></span>
          </div>

          {/* Popis jako "System Output" */}
          <div className="timeline-desc text-gray-400! border-l border-cyan-900/50 pl-4 mt-1 italic text-xs leading-relaxed">
            {item.description}
          </div>

          {/* Boční "technický" kód pro každou položku */}
          <div className="absolute -left-8.75 top-1 text-[8px] text-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity">
            LOG_{i.toString().padStart(3, '0')}
          </div>
        </div>
      ))}

      {/* Dekorativní ukončení osy */}
      <div className="h-4 border-l-2 border-dashed border-cyan-900/30 ml-5 mt-2"></div>
      <div className="text-[9px] text-cyan-900 uppercase ml-4 tracking-widest">
        End of Data Stream
      </div>
    </div>
  );
}