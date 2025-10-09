const THEME_KEY = "minance-theme";
const themeToggle = document.querySelector(".theme-toggle");
const body = document.body;

const setTheme = (mode) => {
  const theme = mode === "dark" ? "dark" : "light";
  body.setAttribute("data-theme", theme);
  themeToggle?.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  localStorage.setItem(THEME_KEY, theme);
};

const getPreferredTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const initTheme = () => {
  const theme = getPreferredTheme();
  setTheme(theme);
};

const toggleTheme = () => {
  const isDark = body.getAttribute("data-theme") === "dark";
  setTheme(isDark ? "light" : "dark");
};

initTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}
