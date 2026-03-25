"use client";

import { useState, useRef, useEffect } from "react";

export default function AIChat({ conflictId }: { conflictId: string }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 🔥 OPRAVENO: správná cesta na backend
      const res = await fetch(`/api/chat`, {
        method: "POST",
        body: JSON.stringify({
          messages,
          conflictId,
        }),
      });

      const data = await res.json();

      // 🔥 Backend vrací { message: reply }
      setMessages((prev) => [...prev, { role: "ai", content: data.message }]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "ERROR: NEURAL LINK INTERRUPTED." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container font-mono text-sm border border-cyan-900/30 bg-black/20 p-2">
      {/* Header status */}
      <div className="flex justify-between items-center mb-2 px-2 text-[10px] text-cyan-600 uppercase tracking-widest border-b border-cyan-900/30 pb-1">
        <span>Neural Link: Active</span>
        <span className="animate-pulse">● SYNC</span>
      </div>

      <div className="chat-messages overflow-y-auto pr-2 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-cyan-900 text-center mt-10 italic">
            [ Waiting for uplink... ]
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`bubble ${
              m.role === "user"
                ? "bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 ml-auto rounded-none rounded-tl-xl"
                : "bg-gray-900/60 border border-gray-700 text-gray-300 mr-auto rounded-none rounded-br-xl"
            } p-3 max-w-[85%] relative`}
          >
            <div
              className={`text-[8px] uppercase mb-1 opacity-50 ${
                m.role === "user" ? "text-right" : "text-left"
              }`}
            >
              {m.role === "user" ? "Authorized User" : "Core Intelligence"}
            </div>
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="text-cyan-500 animate-pulse text-[10px] uppercase">
            [ Decrypting incoming data stream... ]
          </div>
        )}
      </div>

      <div className="chat-input mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="ENTER COMMAND..."
          className="bg-black border border-cyan-900 text-cyan-400 p-2 flex-1 focus:outline-none focus:border-cyan-500 placeholder:text-cyan-950 uppercase text-xs"
        />
        <button
          onClick={sendMessage}
          className="bg-cyan-900/30 border border-cyan-500 text-cyan-400 px-4 hover:bg-cyan-500 hover:text-black transition-all uppercase text-xs font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
