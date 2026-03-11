"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatDialog } from "./chat-dialog";

export function ChatButton() {
  const t = useTranslations("chat");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 font-title text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-brand-orange/90"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        <span className="hidden sm:inline">{t("button")}</span>
      </button>
      {open && <ChatDialog onClose={() => setOpen(false)} />}
    </>
  );
}
