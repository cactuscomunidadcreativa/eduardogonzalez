"use client";

import { useChat } from "@ai-sdk/react";
import { useTranslations } from "next-intl";
import { Send, AlertCircle, ThumbsUp, ThumbsDown, X } from "lucide-react";
import { useRef, useEffect, useState, useMemo } from "react";

// Convert URLs in text to clickable links
function MessageContent({ text }: { text: string }) {
  const parts = useMemo(() => {
    const urlRegex = /(https?:\/\/[^\s)<]+|www\.[^\s)<]+)/gi;
    const segments: { type: "text" | "link"; value: string; href: string }[] = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: "text",
          value: text.slice(lastIndex, match.index),
          href: "",
        });
      }
      const url = match[0];
      const href = url.startsWith("http") ? url : `https://${url}`;
      segments.push({ type: "link", value: url, href });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      segments.push({
        type: "text",
        value: text.slice(lastIndex),
        href: "",
      });
    }

    return segments;
  }, [text]);

  return (
    <>
      {parts.map((part, i) =>
        part.type === "link" ? (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-orange underline underline-offset-2 break-all hover:opacity-80"
          >
            {part.value}
          </a>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </>
  );
}

// Feedback buttons for assistant messages
function MessageFeedback({ messageId }: { messageId: string }) {
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  function handleFeedback(type: "like" | "dislike") {
    setFeedback(type);
    fetch("/api/chat-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, feedback: type }),
    }).catch(() => {});
  }

  if (feedback) {
    return (
      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-brand-blue/30">
        {feedback === "like" ? (
          <span className="flex items-center gap-1">
            <ThumbsUp size={10} className="text-brand-green" />
            Gracias
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <ThumbsDown size={10} className="text-brand-orange" />
            Gracias por tu feedback
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-1.5 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      <button
        onClick={() => handleFeedback("like")}
        className="rounded p-0.5 text-brand-blue/25 transition hover:bg-brand-green/10 hover:text-brand-green"
        title="Útil"
      >
        <ThumbsUp size={12} />
      </button>
      <button
        onClick={() => handleFeedback("dislike")}
        className="rounded p-0.5 text-brand-blue/25 transition hover:bg-red-50 hover:text-red-400"
        title="No útil"
      >
        <ThumbsDown size={12} />
      </button>
    </div>
  );
}

export function ChatDialog({ onClose }: { onClose: () => void }) {
  const t = useTranslations("chat");
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();
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
    <div className="fixed bottom-20 right-4 sm:right-6 z-50 flex h-[480px] w-[calc(100vw-2rem)] sm:w-[380px] flex-col overflow-hidden rounded-2xl border border-brand-light bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-brand-light bg-brand-blue px-4 py-3">
        <h3 className="font-title text-sm font-semibold text-white">
          {t("button")}
        </h3>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="rounded-lg bg-brand-light p-3 text-sm text-brand-blue">
            {t("greeting")}
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`group rounded-lg p-3 text-sm whitespace-pre-wrap ${
              msg.role === "user"
                ? "ml-8 bg-brand-orange text-white"
                : "mr-8 bg-brand-light text-brand-blue"
            }`}
          >
            {msg.parts?.map((part, i) =>
              part.type === "text" ? (
                msg.role === "assistant" ? (
                  <MessageContent key={i} text={part.text} />
                ) : (
                  <span key={i}>{part.text}</span>
                )
              ) : null
            )}
            {msg.role === "assistant" && <MessageFeedback messageId={msg.id} />}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="mr-8 rounded-lg bg-brand-light p-3 text-sm text-brand-blue/50">
            <span className="inline-flex gap-1">
              <span className="animate-bounce">·</span>
              <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>·</span>
            </span>
          </div>
        )}
        {error && (
          <div className="mr-8 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>Error al conectar con el asistente. Intenta de nuevo.</span>
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
