const searchInput = document.getElementById("searchInput");
const urlInput = document.getElementById("urlInput");
const searchBtn = document.getElementById("searchBtn");
const goUrlBtn = document.getElementById("goUrlBtn");
const backBtn = document.getElementById("backBtn");
const refreshBtn = document.getElementById("refreshBtn");
const pasteUrlBtn = document.getElementById("pasteUrlBtn");
const historyList = document.getElementById("historyList");
const settingsHistory = document.getElementById("settingsHistory");
const clearHistoryBtn = document.getElementById("clearHistory");
const settingsPanel = document.getElementById("settingsPanel");
const openSettingsBtn = document.getElementById("openSettings");
const closeSettingsBtn = document.getElementById("closeSettings");
const themeToggle = document.getElementById("themeToggle");
const settingsThemeToggle = document.getElementById("settingsThemeToggle");

const HISTORY_KEY = "gefind_history";
const THEME_KEY = "gefind_theme";

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch (err) {
    console.error("Geçmiş okunamadı", err);
    return [];
  }
}

function saveHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 12)));
}

function renderHistory() {
  const history = getHistory();
  historyList.innerHTML = "";
  settingsHistory.innerHTML = "";

  const preview = history.slice(0, 4);
  if (preview.length === 0) {
    historyList.innerHTML = '<li>Henüz arama yapılmadı.</li>';
  } else {
    preview.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = item;
      const button = document.createElement("button");
      button.textContent = "Ara";
      button.onclick = () => performSearch(item);
      li.appendChild(button);
      historyList.appendChild(li);
    });
  }

  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    const button = document.createElement("button");
    button.textContent = "Ara";
    button.onclick = () => performSearch(item);
    li.appendChild(button);
    settingsHistory.appendChild(li);
  });
}

function performSearch(query) {
  const clean = query.trim();
  if (!clean) return;
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(clean)}`;
  window.open(url, "_blank", "noopener");
  const history = getHistory();
  history.unshift(clean);
  saveHistory([...new Set(history)]); // benzersiz sırayı koru
  renderHistory();
}

function navigateToUrl(urlValue) {
  const clean = urlValue.trim();
  if (!clean) return;
  const hasProtocol = /^https?:\/\//i.test(clean);
  const target = hasProtocol ? clean : `https://${clean}`;
  window.open(target, "_blank", "noopener");
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  const icon = theme === "light" ? "☀️" : "🌙";
  themeToggle.querySelector(".icon").textContent = icon;
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme || "dark";
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
}

function restoreTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "dark";
  setTheme(saved);
}

async function pasteToUrlInput() {
  if (!navigator.clipboard) {
    alert("Panoya erişilemiyor");
    return;
  }
  try {
    const text = await navigator.clipboard.readText();
    urlInput.value = text;
  } catch (err) {
    alert("Pano okunamadı");
    console.error(err);
  }
}

function toggleSettings(show) {
  if (show) {
    settingsPanel.classList.add("active");
    settingsPanel.setAttribute("aria-hidden", "false");
  } else {
    settingsPanel.classList.remove("active");
    settingsPanel.setAttribute("aria-hidden", "true");
  }
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

// Event listeners
searchBtn.addEventListener("click", () => performSearch(searchInput.value));
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") performSearch(searchInput.value);
});

backBtn.addEventListener("click", () => window.history.back());
refreshBtn.addEventListener("click", () => window.location.reload());
pasteUrlBtn.addEventListener("click", pasteToUrlInput);
goUrlBtn.addEventListener("click", () => navigateToUrl(urlInput.value));
urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") navigateToUrl(urlInput.value);
});

clearHistoryBtn.addEventListener("click", clearHistory);
openSettingsBtn.addEventListener("click", () => toggleSettings(true));
closeSettingsBtn.addEventListener("click", () => toggleSettings(false));
themeToggle.addEventListener("click", toggleTheme);
settingsThemeToggle.addEventListener("click", toggleTheme);

window.addEventListener("click", (e) => {
  if (settingsPanel.classList.contains("active") && !settingsPanel.contains(e.target) && !openSettingsBtn.contains(e.target)) {
    toggleSettings(false);
  }
});

restoreTheme();
renderHistory();
