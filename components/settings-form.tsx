"use client";

import { useRouter } from "next/navigation";
import type { dictionaries } from "@/lib/i18n";

type SettingsDict = (typeof dictionaries)["en"]["settings"];

export default function SettingsForm({
  theme,
  locale,
  t,
}: {
  theme: "light" | "dark";
  locale: "en" | "id";
  t: SettingsDict;
}) {
  const router = useRouter();

  function setCookie(name: string, value: string) {
    document.cookie = `${name}=${value}; path=/; max-age=31536000`;
  }

  function setTheme(value: "light" | "dark") {
    setCookie("theme", value);
    document.documentElement.classList.toggle("dark", value === "dark");
    router.refresh();
  }

  function setLocale(value: "en" | "id") {
    setCookie("locale", value);
    router.refresh();
  }

  const activeClass =
    "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900";
  const inactiveClass =
    "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">{t.theme}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${theme === "light" ? activeClass : inactiveClass}`}
          >
            {t.light}
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${theme === "dark" ? activeClass : inactiveClass}`}
          >
            {t.dark}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{t.language}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${locale === "en" ? activeClass : inactiveClass}`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLocale("id")}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${locale === "id" ? activeClass : inactiveClass}`}
          >
            Bahasa Indonesia
          </button>
        </div>
      </div>
    </div>
  );
}
