"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const themeChangeEvent = "finledger-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(themeChangeEvent, callback);

  return () => {
    window.removeEventListener(themeChangeEvent, callback);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function toggleTheme() {
    const nextDark = !dark;
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.classList.toggle("light", !nextDark);
    document.cookie = `finledger-theme=${nextDark ? "dark" : "light"}; path=/; max-age=31536000; samesite=lax`;
    localStorage.setItem("finledger-theme", nextDark ? "dark" : "light");
    window.dispatchEvent(new Event(themeChangeEvent));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Gunakan mode terang" : "Gunakan mode gelap"}
      className="grid size-11 place-items-center rounded-full border bg-card text-primary-dark transition hover:bg-primary-bg"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
