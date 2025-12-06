const searchInput = document.getElementById("searchInput");
const urlInput = document.getElementById("urlInput");
const searchBtn = document.getElementById("searchBtn");
const goUrlBtn = document.getElementById("goUrlBtn");
const backBtn = document.getElementById("backBtn");
const refreshBtn = document.getElementById("refreshBtn");
const pasteUrlBtn = document.getElementById("pasteUrlBtn");
const historyList = document.getElementById("historyList");
const resultsWrapper = document.getElementById("resultsWrapper");
const resultsList = document.getElementById("resultsList");
const openSettingsInline = document.getElementById("openSettingsInline");
const openSettingsFromResults = document.getElementById("openSettingsFromResults");
const settingsHistory = document.getElementById("settingsHistory");
const clearHistoryBtn = document.getElementById("clearHistory");
const settingsPanel = document.getElementById("settingsPanel");
const openSettingsBtn = document.getElementById("openSettings");
const closeSettingsBtn = document.getElementById("closeSettings");
const themeToggle = document.getElementById("themeToggle");
const settingsThemeToggle = document.getElementById("settingsThemeToggle");
const viewer = document.getElementById("viewer");
const viewerFrame = document.getElementById("viewerFrame");
const viewerTitle = document.getElementById("viewerTitle");
const closeViewerBtn = document.getElementById("closeViewer");
const openInTabBtn = document.getElementById("openInTab");
const backToResults = document.getElementById("backToResults");

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
  fetchResults(clean);
  resultsWrapper.hidden = false;
  const history = getHistory();
  history.unshift(clean);
  saveHistory([...new Set(history)]); // benzersiz sırayı koru
  renderHistory();
}

async function fetchResults(query) {
  resultsList.innerHTML = `<div class="loading">Aranıyor…</div>`;
  viewer.hidden = true;

  try {
    const response = await fetch(
      `https://ddg-webapp-aagd.vercel.app/search?max_results=20&q=${encodeURIComponent(query)}`
    );

    if (!response.ok) throw new Error("Sonuç alınamadı");
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      resultsList.innerHTML = `<div class="empty">Sonuç bulunamadı.</div>`;
      return;
    }

    resultsList.innerHTML = "";
    data.results.forEach((item) => {
      const card = document.createElement("article");
      card.className = "result-card";

      const title = document.createElement("a");
      title.className = "result-title";
      title.href = item.url;
      title.textContent = item.title || item.url;
      title.target = "_blank";
      title.rel = "noopener";

      const snippet = document.createElement("p");
      snippet.className = "result-snippet";
      snippet.textContent = item.body || "Özet bulunamadı.";

      const meta = document.createElement("div");
      meta.className = "result-meta";
      meta.textContent = item.url;

      const openBtn = document.createElement("button");
      openBtn.className = "pill-btn";
      openBtn.textContent = "Göster";
      openBtn.onclick = () => openInViewer(item);

      const row = document.createElement("div");
      row.className = "result-row";
      row.appendChild(meta);
      row.appendChild(openBtn);

      card.appendChild(title);
      card.appendChild(snippet);
      card.appendChild(row);
      resultsList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    resultsList.innerHTML = `<div class="error">Sonuçlar yüklenemedi. Bağlantıyı kontrol edin.</div>`;
  }
}

function openInViewer(item) {
  const url = item.url || item.href;
  if (!url) return;

  const restrictedHosts = ["youtube.com", "instagram.com", "facebook.com", "tiktok.com"];
  const isRestricted = restrictedHosts.some((host) => url.includes(host));

  urlInput.value = url;
  viewerTitle.textContent = item.title || url;

  if (isRestricted) {
    window.open(url, "_blank", "noopener");
    alert("Bu site dış sekmede açıldı.");
    return;
  }

  viewerFrame.src = url.startsWith("http") ? url : `https://${url}`;
  viewer.hidden = false;
  resultsList.scrollIntoView({ behavior: "smooth" });
  openInTabBtn.onclick = () => window.open(viewerFrame.src, "_blank", "noopener");
}

function closeViewer() {
  viewerFrame.src = "";
  viewer.hidden = true;
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
openSettingsInline.addEventListener("click", () => toggleSettings(true));
openSettingsFromResults.addEventListener("click", () => toggleSettings(true));
closeSettingsBtn.addEventListener("click", () => toggleSettings(false));
themeToggle.addEventListener("click", toggleTheme);
settingsThemeToggle.addEventListener("click", toggleTheme);
closeViewerBtn.addEventListener("click", closeViewer);
openInTabBtn.addEventListener("click", () => {
  if (viewerFrame.src) window.open(viewerFrame.src, "_blank", "noopener");
});
backToResults.addEventListener("click", () => {
  resultsWrapper.scrollIntoView({ behavior: "smooth" });
});

window.addEventListener("click", (e) => {
  if (settingsPanel.classList.contains("active") && !settingsPanel.contains(e.target) && !openSettingsBtn.contains(e.target)) {
    toggleSettings(false);
  }
});

restoreTheme();
renderHistory();
