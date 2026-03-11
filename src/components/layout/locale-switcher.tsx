"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const locales = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
];

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = pathname.split("/")[1] || "es";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-white/70 hover:bg-white/10"
      >
        <Globe size={16} />
        <span className="uppercase">{currentLocale}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 rounded-lg border border-brand-light bg-white py-1 shadow-lg">
          {locales.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => switchLocale(code)}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-brand-light ${
                code === currentLocale
                  ? "font-bold text-brand-orange"
                  : "text-brand-blue"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
