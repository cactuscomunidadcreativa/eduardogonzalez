"use client";

import { useChat } from "@ai-sdk/react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export function ChatDialog({ onClose }: { onClose: () => void }) {
  const t = useTranslations("chat");
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ parts: [{ type: "text" as const, text: input }] });
    setInput("");
  }

  return (
    <div className="fixed bottom-20 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-brand-light bg-white shadow-2xl">
      <div className="border-b border-brand-light bg-brand-blue px-4 py-3">
        <h3 className="font-title text-sm font-semibold text-white">
          {t("button")}
        </h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="rounded-lg bg-brand-light p-3 text-sm text-brand-blue">
            {t("greeting")}
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg p-3 text-sm ${
              msg.role === "user"
                ? "ml-8 bg-brand-orange text-white"
                : "mr-8 bg-brand-light text-brand-blue"
            }`}
          >
            {msg.parts?.map((part, i) =>
              part.type === "text" ? <span key={i}>{part.text}</span> : null
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="mr-8 rounded-lg bg-brand-light p-3 text-sm text-brand-blue/50">
            ...
          </div>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 border-t border-brand-light p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1 rounded-lg border border-brand-light px-3 py-2 text-sm outline-none focus:border-brand-orange"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-lg bg-brand-orange p-2 text-white disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
