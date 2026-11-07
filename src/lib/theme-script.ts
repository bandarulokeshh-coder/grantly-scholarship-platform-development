/**
 * Applies the saved theme before the first paint so a manual light/dark choice
 * never flashes the wrong colours. Kept tiny, self-contained and failure-safe.
 */
export const themeInitScript = `(function(){try{var raw=localStorage.getItem("grantly.theme.v1");var pref="system";if(raw){var parsed=JSON.parse(raw);if(parsed==="light"||parsed==="dark"||parsed==="system"){pref=parsed;}}var media=window.matchMedia("(prefers-color-scheme: dark)").matches;var dark=pref==="dark"||(pref!=="light"&&media);var root=document.documentElement;root.dataset.theme=dark?"dark":"light";root.style.colorScheme=dark?"dark":"light";}catch(error){/* storage may be blocked */}})();`;
