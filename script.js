const THEME_KEY = "minance-theme";
const themeToggle = document.querySelector(".theme-toggle");
const body = document.body;
const root = document.documentElement;

const safelyPersistTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // storage might be unavailable (private mode, etc.) — ignore silently
  }
};

const readStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;
  }
};

const setTheme = (mode) => {
  const theme = mode === "dark" ? "dark" : "light";
  body.setAttribute("data-theme", theme);
  root.setAttribute("data-theme", theme);
  themeToggle?.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  themeToggle?.setAttribute("data-theme-state", theme);
  safelyPersistTheme(theme);
};

const getPreferredTheme = () => {
  const stored = readStoredTheme();
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  const prefersDark =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
  return prefersDark ? "dark" : "light";
};

const applyInitialTheme = () => {
  const theme = getPreferredTheme();
  setTheme(theme);
};

const toggleTheme = () => {
  const isDark = body.getAttribute("data-theme") === "dark";
  setTheme(isDark ? "light" : "dark");
};

applyInitialTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);

  const mql =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
  const handleSystemChange = (event) => {
    const stored = readStoredTheme();
    if (!stored) {
      setTheme(event.matches ? "dark" : "light");
    }
  };

  if (mql?.addEventListener) {
    mql.addEventListener("change", handleSystemChange);
  } else if (mql?.addListener) {
    mql.addListener(handleSystemChange);
  }
}
