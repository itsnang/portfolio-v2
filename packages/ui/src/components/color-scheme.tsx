/**
 * Light or dark for every Site. The visitor's choice lives in one cookie on the
 * parent domain, so picking Dark on the Main Site carries to the Blog and Admin
 * Sites; with no cookie, each Site follows the device setting.
 *
 * <ColorSchemeScript /> goes in each root layout's <head>: it sets the `dark`
 * class before the first paint, so there is no flash of the wrong scheme, and
 * keeps following the device while the preference is "system". The switch and
 * the hook are in ./color-scheme-toggle.
 */

export type ColorSchemePreference = "light" | "dark" | "system";
export type ColorScheme = "light" | "dark";

export const COLOR_SCHEME_COOKIE = "color-scheme";
export const COLOR_SCHEME_CHANGE_EVENT = "color-scheme-change";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

// Runs before React. Keep it in step with applyColorScheme in ./color-scheme-toggle.
const script = `(function(){try{var d=document.documentElement,m=matchMedia("${DARK_QUERY}");function a(){var c=document.cookie.match(/(?:^|; )${COLOR_SCHEME_COOKIE}=(light|dark)/),p=c?c[1]:"system",k=p==="dark"||(p==="system"&&m.matches);d.classList.toggle("dark",k);d.style.colorScheme=k?"dark":"light"}a();m.addEventListener("change",function(){a();dispatchEvent(new Event("${COLOR_SCHEME_CHANGE_EVENT}"))})}catch(e){}})()`;

/** A constant inline script, no user content. */
export function ColorSchemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
