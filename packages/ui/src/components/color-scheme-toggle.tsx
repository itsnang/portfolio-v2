"use client";

import { useSyncExternalStore } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { cn } from "../cn";
import {
  COLOR_SCHEME_CHANGE_EVENT,
  COLOR_SCHEME_COOKIE,
  DARK_QUERY,
  type ColorScheme,
  type ColorSchemePreference,
} from "./color-scheme";

const COOKIE_PATTERN = new RegExp(`(?:^|; )${COLOR_SCHEME_COOKIE}=(light|dark)`);

function readPreference(): ColorSchemePreference {
  const match = document.cookie.match(COOKIE_PATTERN);
  return match ? (match[1] as ColorScheme) : "system";
}

// The same steps as the inline script in ./color-scheme.
function applyColorScheme() {
  const preference = readPreference();
  const dark = preference === "dark" || (preference === "system" && matchMedia(DARK_QUERY).matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

/** The parent domain (lornsamnang.com) so every Site shares the cookie; none on localhost or an IP. */
function cookieDomain() {
  const { hostname } = location;
  if (hostname === "localhost" || /^[\d.]+$/.test(hostname) || hostname.includes(":")) return "";
  const labels = hostname.split(".");
  return labels.length > 2 ? `; domain=.${labels.slice(-2).join(".")}` : "";
}

function setPreference(preference: ColorSchemePreference) {
  const value = preference === "system" ? "" : preference;
  const maxAge = preference === "system" ? 0 : 60 * 60 * 24 * 365;
  const write = (domain: string) => {
    document.cookie = `${COLOR_SCHEME_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax${domain}`;
  };
  const domain = cookieDomain();
  write(domain);
  // A host such as *.vercel.app refuses a parent-domain cookie; keep the choice on this host instead.
  if (domain && readPreference() !== preference) write("");
  applyColorScheme();
  dispatchEvent(new Event(COLOR_SCHEME_CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  addEventListener(COLOR_SCHEME_CHANGE_EVENT, onChange);
  return () => removeEventListener(COLOR_SCHEME_CHANGE_EVENT, onChange);
}

// One string, so the snapshot compares by value.
const getSnapshot = () =>
  `${readPreference()}:${document.documentElement.classList.contains("dark") ? "dark" : "light"}`;
const getServerSnapshot = () => "system:light";

/** The visitor's preference and the scheme showing now. On the server and during hydration: system, light. */
export function useColorScheme() {
  const [preference, scheme] = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot).split(
    ":"
  ) as [ColorSchemePreference, ColorScheme];
  return { preference, scheme, setPreference };
}

const NEXT: Record<ColorSchemePreference, ColorSchemePreference> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const LABEL: Record<ColorSchemePreference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const ICON = { system: MonitorIcon, light: SunIcon, dark: MoonIcon };

// The public Sites float the switch in the bottom-right corner, in the theme's own
// style. A page with its own switch (the Modern dock) hides it: see base.css.
const FLOATING = "color-scheme-floating fixed bottom-4 right-4 z-40 size-9";
const VARIANT = {
  wireframe: `${FLOATING} rounded-[4px] border-2 border-foreground bg-background text-foreground shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-px`,
  modern: `${FLOATING} rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground`,
};

/** One button that steps through System, Light and Dark. */
export function ColorSchemeToggle({
  variant,
  className,
}: {
  /** A floating corner button for a public Site's theme. Leave out to place and style it with `className`. */
  variant?: keyof typeof VARIANT;
  className?: string;
}) {
  const { preference } = useColorScheme();
  const Icon = ICON[preference];
  const next = NEXT[preference];

  return (
    <button
      type="button"
      onClick={() => setPreference(next)}
      aria-label={`Colour scheme: ${LABEL[preference]}. Switch to ${LABEL[next]}`}
      title={`Colour scheme: ${LABEL[preference]}`}
      className={cn("inline-grid place-items-center", variant && VARIANT[variant], className)}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
