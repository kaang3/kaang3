const state = {
  tabs: [{ id: 1, title: "Yeni Sekme", url: "", history: [], index: -1 }],
  activeTabId: 1,
  nextTabId: 2,
  user: JSON.parse(localStorage.getItem("balukUser") || "null"),
  thinkingTimer: null,
  thinkingTicker: null,
  agentModeActive: false,
  agentBusy: false,
  customizeMode: false,
  dragTabId: null,
  theme: JSON.parse(localStorage.getItem("balukTheme") || "null"),
  uiEditMode: false,
  editingTarget: null,
};

const THEME_COLORS = {
  "mavi": "#3498ff", "kırmızı": "#ff3b4f", "yesil": "#29b35f", "yeşil": "#29b35f", "sarı": "#ffd84c", "turuncu": "#ff8b2b", "mor": "#8d45ff", "pembe": "#ff6bc9", "siyah": "#0b0b10", "beyaz": "#f5f7ff", "gri": "#8f96a8", "lacivert": "#1a2f7a", "bordo": "#6c1d31", "kahverengi": "#6a4935", "bej": "#d8c3a5", "krem": "#f4e9d4",
  "bebek mavisi": "#9fd7ff", "gök mavisi": "#65b8ff", "buz mavisi": "#b7e6ff", "deniz mavisi": "#2e8bbd", "okyanus mavisi": "#245f99", "saks mavisi": "#2f52d6", "kobalt mavisi": "#3d59d8", "çelik mavisi": "#5b7a9b", "petrol mavisi": "#0f4f63", "turkuaz": "#23c5c8", "camgöbeği": "#00b7b7", "akuamarin": "#6ad5c2", "buzul mavisi": "#8fd6f1", "gece mavisi": "#1a2a5e", "kraliyet mavisi": "#3553d8", "indigo": "#3f2f9a",
  "mint yeşili": "#9ff7cb", "nane yeşili": "#89e3b3", "çağla yeşili": "#b8d67a", "fıstık yeşili": "#95c867", "zümrüt yeşili": "#13a86b", "orman yeşili": "#17663a", "çam yeşili": "#1f5b3d", "zeytin yeşili": "#687c39", "haki": "#7a7b47", "avokado yeşili": "#70a95d", "su yeşili": "#5ecab6", "deniz köpüğü": "#9ee8d5", "yeşim yeşili": "#00a86b", "nefti": "#4f7942", "çimen yeşili": "#5ab84d",
  "lila": "#b38cff", "leylak": "#c8a7ff", "lavanta": "#c3b1ff", "menekşe": "#8f5add", "eflatun": "#c154c1", "erguvan": "#9d3f7a", "mürdüm": "#6d1f68", "patlıcan moru": "#4b2042", "ametist": "#9966cc", "orkide moru": "#b86fd9", "fuşya": "#d946ef", "magenta": "#ff00aa", "gece moru": "#2d184f", "dumanlı mor": "#6f5e82",
  "pudra pembesi": "#f4c7d5", "şeker pembesi": "#ff8ecf", "gül pembesi": "#f07aaf", "bebe pembe": "#ffb7d8", "pastel pembe": "#f7b8cf", "somon pembe": "#ff8b82", "nar pembesi": "#d95a80", "toz pembe": "#d9a0b3", "gül kurusu": "#b76e79",
  "nar çiçeği": "#f04a4a", "gül kırmızısı": "#c72c48", "karmen": "#9f1d35", "yakut kırmızısı": "#9b111e", "ateş kırmızısı": "#ff3f34", "vişne çürüğü": "#5c1a2e", "şarap kırmızısı": "#722f37", "kiremit": "#b24f3e", "tuğla kırmızısı": "#aa4a44", "mercan": "#ff6f61",
  "şeftali": "#ffb58a", "kayısı rengi": "#f4a460", "mandalina": "#ff9f1a", "yavruağzı": "#ffad8a", "balkabağı": "#ff7518", "bakır turuncu": "#b87333", "pas turuncusu": "#c5683a", "gün batımı turuncusu": "#ff7e48", "altın turuncu": "#ffb347", "mercan turuncusu": "#ff7f50",
  "limon sarısı": "#fff44f", "altın sarısı": "#ffcf33", "bal sarısı": "#f5b942", "hardal sarısı": "#d9a520", "safran": "#f4c430", "kanarya sarısı": "#ffe94d", "pastel sarı": "#fff4a3", "kum sarısı": "#e4c57a", "güneş sarısı": "#ffd447", "kehribar": "#ffbf00",
  "fildişi": "#fffff0", "ekru": "#f3ecd3", "kum beji": "#d8c8a5", "taş rengi": "#b7a899", "vizon": "#9c8b75", "camel": "#c19a6b", "sütlü kahve": "#a67c52", "karamel": "#b97745", "gümüş gri": "#c0c0c0", "antrasit": "#32343c", "füme": "#6b6f76", "kömür grisi": "#3b3f46", "duman grisi": "#9ca3af", "inci beyazı": "#f8f6f0",
  "ay ışığı": "#dde7ff", "derin deniz": "#123f63", "kutup mavisi": "#84d1ff", "buz kristali": "#d7f3ff", "lavanta sisi": "#c8b6ff", "dumanlı gül": "#c08a95", "kum fırtınası": "#c7b089", "çöl beji": "#d9bf8f", "zeytin taşı": "#7d7f54", "orman sisi": "#5f7b64", "ay taşı": "#d6d6e8", "inci gri": "#d9dde4", "gölgeli lila": "#9e8bb8", "bulut grisi": "#cfd4db", "gün doğumu pembesi": "#ffc3c8", "kuzey ışığı yeşili": "#58e6a9"
};

const THINKING_LINES = [
  "Baluk.ai düşünüyor...",
  "Sorunu anlamlandırıyorum...",
  "En doğru cevabı hazırlıyorum...",
  "Cevap hazır, son kontrol yapıyorum..."
];

const WEB_MODE_THINKING_LINES = [
  "Baluk.ai uygulamasına bağlanıyorum...",
  "Web modu özelliğini alıyorum...",
  "DuckDuckGo sonuçlarını çekiyorum...",
  "Wikipedia metnini süzüp 400 harfe indiriyorum..."
];
const SITE_KNOWLEDGE = {
  "youtube.com": {
    name: "YouTube",
    year: "2005",
    company: "Jawed Karim, Steve Chen ve Chad Hurley tarafından kuruldu; daha sonra Google (Alphabet) tarafından satın alındı.",
    purpose: "Video izleme, paylaşma ve içerik üreticilerinin yayın yapması için tasarlanmış bir platformdur.",
    summary: "YouTube, kullanıcıların video yükleyip izleyebildiği, canlı yayın yapabildiği ve içerik ekosistemi oluşturabildiği küresel bir video platformudur."
  },
  "google.com": {
    name: "Google",
    year: "1998",
    company: "Larry Page ve Sergey Brin tarafından kuruldu.",
    purpose: "Web üzerinde bilgiye hızlı erişim sağlayan arama motoru ve internet servisleri sunmak.",
    summary: "Google, arama motoru merkezli başlayan ve e-posta, haritalar, bulut, reklam gibi alanlarda büyüyen bir teknoloji platformudur."
  },
  "wikipedia.org": {
    name: "Wikipedia",
    year: "2001",
    company: "Jimmy Wales ve Larry Sanger tarafından başlatıldı; Wikimedia Foundation tarafından yönetilir.",
    purpose: "Özgür ve ortaklaşa düzenlenen ansiklopedi içeriği sunmak.",
    summary: "Wikipedia, gönüllüler tarafından düzenlenen çok dilli, açık lisanslı bir çevrimiçi ansiklopedidir."
  },
  "github.com": {
    name: "GitHub",
    year: "2008",
    company: "Tom Preston-Werner, Chris Wanstrath, PJ Hyett ve Scott Chacon tarafından kuruldu; Microsoft bünyesindedir.",
    purpose: "Yazılım projeleri için Git tabanlı kod barındırma ve iş birliği sağlamak.",
    summary: "GitHub, geliştiricilerin kod depoladığı, sürüm takip ettiği ve ekip olarak yazılım geliştirdiği bir platformdur."
  },
  "instagram.com": {
    name: "Instagram",
    year: "2010",
    company: "Kevin Systrom ve Mike Krieger tarafından kuruldu; Meta bünyesindedir.",
    purpose: "Fotoğraf ve video paylaşımı ile sosyal etkileşim sağlamak.",
    summary: "Instagram, görsel odaklı paylaşım, hikaye/reels formatları ve sosyal etkileşim özellikleri sunan bir platformdur."
  },
  "shopify.com": {
    name: "Shopify",
    year: "2006",
    company: "Tobias Lütke, Daniel Weinand ve Scott Lake tarafından kuruldu.",
    purpose: "İşletmelerin çevrimiçi mağaza kurup yönetmesini sağlamak.",
    summary: "Shopify, e-ticaret sitesi kurma, ödeme alma ve sipariş yönetimi gibi süreçleri tek panelde sunan bir altyapıdır."
  }
};


const el = {
  tabs: document.getElementById("tabs"),
  addTabBtn: document.getElementById("addTabBtn"),
  contentGrid: document.getElementById("contentGrid"),
  aramaForm: document.getElementById("aramaForm"),
  aramaInput: document.getElementById("aramaInput"),
  sonuclar: document.getElementById("sonuclar"),
  homeView: document.getElementById("homeView"),
  webView: document.getElementById("webView"),
  siteFrame: document.getElementById("siteFrame"),
  adresCubugu: document.getElementById("adresCubugu"),
  geriBtn: document.getElementById("geriBtn"),
  ileriBtn: document.getElementById("ileriBtn"),
  yenileBtn: document.getElementById("yenileBtn"),
  newTabBtn: document.getElementById("newTabBtn"),
  balukPanelBtn: document.getElementById("balukPanelBtn"),
  aiPanel: document.getElementById("aiPanel"),
  closePanelBtn: document.getElementById("closePanelBtn"),
  loginForm: document.getElementById("loginForm"),
  authArea: document.getElementById("authArea"),
  assistantArea: document.getElementById("assistantArea"),
  welcomeText: document.getElementById("welcomeText"),
  profileMail: document.getElementById("profileMail"),
  profileAvatar: document.getElementById("profileAvatar"),
  aiForm: document.getElementById("aiForm"),
  aiSoru: document.getElementById("aiSoru"),
  thinkingBox: document.getElementById("thinkingBox"),
  thinkingText: document.getElementById("thinkingText"),
  spinLogo: document.getElementById("spinLogo"),
  aiCevap: document.getElementById("aiCevap"),
  plusBtn: document.getElementById("plusBtn"),
  agentMenu: document.getElementById("agentMenu"),
  agentModeBtn: document.getElementById("agentModeBtn"),
  themeModeBtn: document.getElementById("themeModeBtn"),
  agentBadge: document.getElementById("agentBadge"),
  agentBadgeClose: document.getElementById("agentBadgeClose"),
  quickPrompts: document.getElementById("quickPrompts"),
  introOverlay: document.getElementById("introOverlay"),
  appShell: document.getElementById("appShell"),
  customizeBtn: document.getElementById("customizeBtn"),
  customizePanel: document.getElementById("customizePanel"),
  closeCustomizeBtn: document.getElementById("closeCustomizeBtn"),
  themeColorSelect: document.getElementById("themeColorSelect"),
  fontStyleSelect: document.getElementById("fontStyleSelect"),
  cursorShapeSelect: document.getElementById("cursorShapeSelect"),
  cursorSizeRange: document.getElementById("cursorSizeRange"),
  saveCustomizeBtn: document.getElementById("saveCustomizeBtn"),
  advancedEditBtn: document.getElementById("advancedEditBtn"),
};



function forceRevealApp() {
  if (el.introOverlay) el.introOverlay.classList.add("hidden");
  if (el.appShell) {
    el.appShell.classList.remove("app-hidden");
    el.appShell.style.pointerEvents = "auto";
  }
}

window.addEventListener("load", () => {
  setTimeout(forceRevealApp, 1200);
});
setTimeout(forceRevealApp, 9000);

const agentCursor = document.createElement("div");
agentCursor.id = "agentCursor";
agentCursor.style.cssText = "position:fixed;width:18px;height:18px;border:2px solid #b78cff;background:radial-gradient(circle,#6b24dd 0%,#141020 75%);border-radius:50%;box-shadow:0 0 18px rgba(141,69,255,.85);z-index:9999;pointer-events:none;opacity:0;transform:translate(-50%,-50%);transition:left .25s ease, top .25s ease, opacity .15s ease;";
document.body.appendChild(agentCursor);

function getAccentForTheme(themeName = "mor") {
  const key = normalize(themeName);
  return THEME_COLORS[key] || "#8d45ff";
}

function setCursorStyle(shape = "circle", size = 18, color = "#8d45ff") {
  const px = `${Math.max(14, Math.min(42, Number(size) || 18))}px`;
  agentCursor.style.width = px;
  agentCursor.style.height = px;
  agentCursor.style.borderColor = color;
  agentCursor.style.boxShadow = `0 0 18px ${color}`;
  if (shape === "square") {
    agentCursor.style.borderRadius = "4px";
    agentCursor.style.transform = "translate(-50%,-50%)";
  } else if (shape === "diamond") {
    agentCursor.style.borderRadius = "2px";
    agentCursor.style.transform = "translate(-50%,-50%) rotate(45deg)";
  } else {
    agentCursor.style.borderRadius = "50%";
    agentCursor.style.transform = "translate(-50%,-50%)";
  }
}

function setCustomizeMode(open) {
  state.customizeMode = open;
  el.customizePanel.classList.toggle("hidden", !open);
}

function applyTheme(theme) {
  if (!theme) return;
  const accent = getAccentForTheme(theme.colorName);
  document.documentElement.style.setProperty("--glow-purple", accent);
  document.documentElement.style.setProperty("--soft-border", `${accent}55`);
  document.documentElement.style.setProperty("--theme-font", theme.font || "Inter, Arial, sans-serif");
  document.body.style.cursor = "default";
  setCursorStyle(theme.cursorShape, theme.cursorSize, accent);
}

function initThemeOptions() {
  if (!el.themeColorSelect) return;
  const names = Object.keys(THEME_COLORS).sort((a, b) => a.localeCompare(b, "tr"));
  el.themeColorSelect.innerHTML = names.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");

  const existing = state.theme || { colorName: "mor", font: "Inter, Arial, sans-serif", cursorShape: "circle", cursorSize: 18 };
  state.theme = existing;
  el.themeColorSelect.value = existing.colorName;
  el.fontStyleSelect.value = existing.font;
  el.cursorShapeSelect.value = existing.cursorShape;
  el.cursorSizeRange.value = String(existing.cursorSize);
  applyTheme(existing);
}

async function runThemeAnimation(colorName) {
  const accent = getAccentForTheme(colorName);
  const layer = document.createElement("div");
  layer.className = "theme-anim-layer";
  const status = document.createElement("div");
  status.className = "theme-anim-status";
  status.textContent = "Baluk.ai: Kişiselleştirme moduna bağlanıyorum...";
  layer.appendChild(status);

  for (let i = 0; i < 16; i += 1) {
    const b = document.createElement("span");
    b.className = "theme-ball";
    b.style.setProperty("--c", accent);
    b.style.left = `${Math.random() * 90 + 5}%`;
    b.style.top = `${Math.random() * 90 + 5}%`;
    b.style.animationDelay = `${Math.random() * 1.8}s`;
    layer.appendChild(b);
  }

  document.body.appendChild(layer);
  startThinking([
    "Baluk.ai uygulamasına bağlanıyorum...",
    "Tema motorunu hazırlıyorum...",
    `${colorName} rengini enerji kürelerinde birleştiriyorum...`,
    "Animasyon tamamlanıyor, tema ayarlanıyor...",
  ]);

  await sleep(5500);
  stopThinking();
  layer.remove();
}

function getEditableTargets() {
  return [
    { key: 'title', el: document.querySelector('#homeView h1') },
    { key: 'search', el: document.getElementById('aramaForm') },
  ].filter((t) => t.el);
}

function beginDragOrResize(target, startEvent) {
  const node = target.el;
  const rect = node.getBoundingClientRect();
  const isResize = startEvent.shiftKey || startEvent.offsetX > rect.width - 24 || startEvent.offsetY > rect.height - 24;
  const startX = startEvent.clientX;
  const startY = startEvent.clientY;
  const startDX = Number(node.dataset.dx || 0);
  const startDY = Number(node.dataset.dy || 0);
  const startW = rect.width;
  const startH = rect.height;

  const onMove = (ev) => {
    if (isResize) {
      node.style.width = `${Math.max(140, startW + (ev.clientX - startX))}px`;
      node.style.height = `${Math.max(40, startH + (ev.clientY - startY))}px`;
    } else {
      const nextDX = startDX + (ev.clientX - startX);
      const nextDY = startDY + (ev.clientY - startY);
      node.dataset.dx = String(nextDX);
      node.dataset.dy = String(nextDY);
      node.style.transform = `translate(${nextDX}px, ${nextDY}px)`;
    }
  };
  const onUp = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    const key = `balukEdit:${target.key}`;
    localStorage.setItem(key, JSON.stringify({
      dx: Number(node.dataset.dx || 0),
      dy: Number(node.dataset.dy || 0),
      width: node.style.width,
      height: node.style.height,
    }));
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp, { once: true });
}

function restoreEditableLayout() {
  getEditableTargets().forEach((target) => {
    const saved = localStorage.getItem(`balukEdit:${target.key}`);
    if (!saved) return;
    try {
      const d = JSON.parse(saved);
      const oldDX = Number.parseFloat(d.left || '0') || 0;
      const oldDY = Number.parseFloat(d.top || '0') || 0;
      const dx = Number.isFinite(d.dx) ? d.dx : oldDX;
      const dy = Number.isFinite(d.dy) ? d.dy : oldDY;
      target.el.dataset.dx = String(dx);
      target.el.dataset.dy = String(dy);
      target.el.style.transform = `translate(${dx}px, ${dy}px)`;
      if (d.width) target.el.style.width = d.width;
      if (d.height) target.el.style.height = d.height;
      target.el.style.left = '';
      target.el.style.top = '';
      target.el.style.position = '';
    } catch {}
  });
}

function setUiEditMode(on) {
  state.uiEditMode = on;
  el.customizePanel.classList.toggle('editing-active', on);

  getEditableTargets().forEach((target) => {
    const node = target.el;
    if (on) {
      node.classList.add('editing-mode-target');
      node.onmousedown = (ev) => {
        ev.preventDefault();
        beginDragOrResize(target, ev);
      };
    } else {
      node.classList.remove('editing-mode-target');
      node.onmousedown = null;
    }
  });
}


function currentTab() { return state.tabs.find((t) => t.id === state.activeTabId); }
function escapeHtml(text = "") { return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function ensureUrl(value) { return /^https?:\/\//i.test(value) ? value : `https://${value}`; }
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
function highlight(v) { return `<span class="hl">${escapeHtml(v)}</span>`; }
function normalize(s = "") { return s.toLowerCase().trim(); }

function hexToRgb(hex) {
  const v = (hex || '').replace('#', '').trim();
  const clean = v.length === 3 ? v.split('').map((x) => x + x).join('') : v;
  const num = Number.parseInt(clean || '000000', 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function shade(hex, delta) {
  const { r, g, b } = hexToRgb(hex);
  const adj = (n) => Math.max(0, Math.min(255, n + delta));
  return `rgb(${adj(r)}, ${adj(g)}, ${adj(b)})`;
}

function isTouchLikeDevice() {
  return window.matchMedia('(max-width: 1100px)').matches || /android|iphone|ipad|mobile|tablet/i.test(navigator.userAgent);
}

function isIframeBlockedHost(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return [
      'duckduckgo.com',
      'google.com',
      'bing.com',
      'search.yahoo.com',
      'yahoo.com',
    ].some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

function isLikelyFrameDeniedHost(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return [
      'youtube.com',
      'youtu.be',
      'shopify.com',
      'accounts.google.com',
      'instagram.com',
      'x.com',
      'twitter.com',
      'facebook.com',
      'tiktok.com',
      'linkedin.com',
      'google.com',
      'duckduckgo.com',
      'bing.com',
      'search.yahoo.com',
      'yahoo.com',
      'shopify.com',
    ].some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

function getEmbeddableUrl(url) {
  if (!isLikelyFrameDeniedHost(url)) return url;
  const stripped = url.replace(/^https?:\/\//i, '');
  return `https://r.jina.ai/http://${stripped}`;
}

function escapeForHtml(str = '') {
  return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function setFrameDoc(title, body) {
  el.siteFrame.removeAttribute('src');
  el.siteFrame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;font-family:Inter,Arial,sans-serif;background:#070b18;color:#e9ecff;padding:26px} .card{max-width:980px;margin:0 auto;background:#0f1634;border:1px solid #2c3f7a;border-radius:14px;padding:18px} h2{margin:0 0 8px} p{line-height:1.55;color:#cfd6ff;white-space:pre-wrap} a{display:inline-block;margin-top:10px;padding:10px 14px;border-radius:10px;text-decoration:none;background:#2a4ea8;color:#fff}</style></head><body><div class="card"><h2>${title}</h2><p>${body}</p></div></body></html>`;
}

async function renderProtectedSiteView(originalUrl) {
  const title = 'Bu site iframe korumalı (Baluk Screatch Görüntü Modu)';
  setFrameDoc(title, `Site: ${escapeForHtml(originalUrl)}

İçeriği getiriyorum...`);

  try {
    const stripped = originalUrl.replace(/^https?:\/\//i, '');
    const proxy = `https://r.jina.ai/http://${stripped}`;
    const res = await fetch(proxy);
    if (!res.ok) throw new Error('proxy fail');
    const text = (await res.text()).replace(/\s+/g, ' ').trim().slice(0, 3500);
    const body = `${escapeForHtml(text || 'İçerik okunamadı.')}

Orijinal siteyi yeni sekmede açmak için aşağıya tıkla.`;
    setFrameDoc(title, body + `

`);
    const doc = el.siteFrame.contentDocument;
    if (doc?.body) {
      const card = doc.querySelector('.card');
      const a = doc.createElement('a');
      a.href = originalUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Orijinal siteyi yeni sekmede aç';
      card?.appendChild(a);
    }
  } catch {
    setFrameDoc(title, `Site: ${escapeForHtml(originalUrl)}

Bu içeriği gömülü okuyamadım. Orijinal siteyi yeni sekmede açabilirsin.`);
    const doc = el.siteFrame.contentDocument;
    if (doc?.body) {
      const card = doc.querySelector('.card');
      const a = doc.createElement('a');
      a.href = originalUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Orijinal siteyi yeni sekmede aç';
      card?.appendChild(a);
    }
  }
}

function showOpenHint(message) {
  const hint = document.createElement('div');
  hint.className = 'searching-status';
  hint.textContent = message;
  el.sonuclar.prepend(hint);
  setTimeout(() => hint.remove(), 4200);
}

function tryInternalSearchFromBlockedUrl(url) {
  try {
    const u = new URL(url);
    const params = u.searchParams;
    const q = (params.get('q') || params.get('p') || params.get('query') || '').trim();
    if (!q) return false;
    const tab = currentTab();
    if (tab) setTabTitle(tab, q);
    showHome();
    el.aramaInput.value = q;
    el.aramaForm.requestSubmit();
    return true;
  } catch {
    return false;
  }
}

function playIntroSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(180, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(520, audioCtx.currentTime + 0.32);
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.82);
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + 0.85);
    o.onended = () => audioCtx.close();
  } catch {}
}

function runIntro() {
  let revealed = false;

  const revealApp = () => {
    if (revealed) return;
    revealed = true;
    forceRevealApp();
  };

  if (!el.appShell || !el.introOverlay) {
    revealApp();
    return;
  }

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const introDuration = reducedMotion ? 2350 : 4800;

  playIntroSound();

  const finishTimer = setTimeout(revealApp, introDuration);
  const hardFailSafeTimer = setTimeout(revealApp, introDuration + 2500);

  const skipIntro = () => {
    clearTimeout(finishTimer);
    clearTimeout(hardFailSafeTimer);
    revealApp();
    window.removeEventListener("keydown", skipIntro);
    window.removeEventListener("pointerdown", skipIntro);
  };

  window.addEventListener("keydown", skipIntro, { once: true });
  window.addEventListener("pointerdown", skipIntro, { once: true });
}


function setPanel(open) {
  el.aiPanel.classList.toggle("hidden", !open);
  el.contentGrid.classList.toggle("with-panel", open);
}

function renderTabs() {
  el.tabs.innerHTML = "";
  state.tabs.forEach((tab) => {
    const b = document.createElement("button");
    b.className = `tab-item ${tab.id === state.activeTabId ? "active" : ""}`;
    b.draggable = true;
    b.dataset.tabId = String(tab.id);
    b.innerHTML = `<span>${escapeHtml(tab.title)}</span><span class="tab-close" data-close="${tab.id}">✕</span>`;
    b.addEventListener("click", (e) => {
      const close = e.target.closest(".tab-close");
      if (close) return closeTab(Number(close.dataset.close));
      switchTab(tab.id);
    });
    b.addEventListener("dragstart", () => {
      state.dragTabId = tab.id;
      b.classList.add("dragging");
    });
    b.addEventListener("dragend", () => {
      state.dragTabId = null;
      b.classList.remove("dragging");
    });
    b.addEventListener("dragover", (e) => e.preventDefault());
    b.addEventListener("drop", (e) => {
      e.preventDefault();
      reorderTab(state.dragTabId, tab.id);
    });
    el.tabs.appendChild(b);
  });
}

function reorderTab(fromId, toId) {
  if (!fromId || !toId || fromId === toId) return;
  const fromIdx = state.tabs.findIndex((t) => t.id === fromId);
  const toIdx = state.tabs.findIndex((t) => t.id === toId);
  if (fromIdx < 0 || toIdx < 0) return;
  const [moved] = state.tabs.splice(fromIdx, 1);
  state.tabs.splice(toIdx, 0, moved);
  renderTabs();
}

function showHome() {
  el.homeView.classList.remove("hidden");
  el.webView.classList.add("hidden");
  el.adresCubugu.value = "";
}

function syncTabView() {
  const tab = currentTab();
  if (!tab || !tab.url) return showHome();
  el.adresCubugu.value = tab.url;
  el.siteFrame.srcdoc = '';
  el.siteFrame.src = tab.url;
  el.homeView.classList.add("hidden");
  el.webView.classList.remove("hidden");
}

function setTabTitle(tab, title) {
  tab.title = (title || "Yeni Sekme").slice(0, 22);
}

function createTab(url = "") {
  const tab = { id: state.nextTabId++, title: "Yeni Sekme", url: "", history: [], index: -1 };
  state.tabs.push(tab);
  state.activeTabId = tab.id;
  renderTabs();
  if (url) openUrl(url);
  else showHome();
}

function closeTab(id) {
  if (state.tabs.length === 1) return false;
  state.tabs = state.tabs.filter((t) => t.id !== id);
  if (!state.tabs.some((t) => t.id === state.activeTabId)) state.activeTabId = state.tabs[0].id;
  renderTabs();
  syncTabView();
  return true;
}

function switchTab(id) {
  state.activeTabId = id;
  renderTabs();
  syncTabView();
}

function openUrl(url, addToHistory = true, titleHint = "") {
  const safe = ensureUrl(url);
  const tab = currentTab();
  if (!tab) return;
  tab.url = safe;
  if (titleHint) {
    setTabTitle(tab, titleHint);
  } else {
    try { setTabTitle(tab, new URL(safe).hostname.replace(/^www\./, "")); } catch { setTabTitle(tab, "Yeni Sekme"); }
  }

  if (addToHistory) {
    tab.history = tab.history.slice(0, tab.index + 1);
    tab.history.push(safe);
    tab.index = tab.history.length - 1;
  }

  if (isTouchLikeDevice()) {
    const opened = window.open(safe, '_blank', 'noopener,noreferrer');
    if (!opened) window.location.href = safe;
    renderTabs();
    showHome();
    return;
  }

  if (isIframeBlockedHost(safe) || isLikelyFrameDeniedHost(safe)) {
    const handled = isIframeBlockedHost(safe) ? tryInternalSearchFromBlockedUrl(safe) : false;
    if (!handled) {
      const opened = window.open(safe, '_blank', 'noopener,noreferrer');
      if (!opened) window.location.href = safe;
      showOpenHint('Bu site güvenlik nedeniyle gömülü açılamıyor. Yeni sekmede açıldı.');
      showHome();
    }
    renderTabs();
    return;
  }

  renderTabs();
  syncTabView();
}

function buildFallbackResults(query) {
  const q = encodeURIComponent(query);
  return [
    { title: `${query} - Wikipedia araması`, href: `https://tr.wikipedia.org/wiki/Özel:Arama?search=${q}`, snippet: "Wikipedia içinde ara." },
    { title: `${query} - YouTube araması`, href: `https://www.youtube.com/results?search_query=${q}`, snippet: "YouTube içinde ara." },
    { title: `${query} - GitHub araması`, href: `https://github.com/search?q=${q}`, snippet: "GitHub içinde ara." },
  ];
}

async function getSearchResults(query) {
  try {
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`);
    if (!response.ok) return buildFallbackResults(query);
    const data = await response.json();
    const parsed = [];

    if (data.AbstractURL) parsed.push({ title: data.Heading || query, href: data.AbstractURL, snippet: data.AbstractText || "Özet bilgi" });
    (data.RelatedTopics || []).forEach((item) => {
      if (item.FirstURL && item.Text) parsed.push({ title: item.Text.split(" - ")[0], href: item.FirstURL, snippet: item.Text });
      (item.Topics || []).forEach((sub) => {
        if (sub.FirstURL && sub.Text) parsed.push({ title: sub.Text.split(" - ")[0], href: sub.FirstURL, snippet: sub.Text });
      });
    });

    return parsed.length ? parsed.slice(0, 8) : buildFallbackResults(query);
  } catch {
    return buildFallbackResults(query);
  }
}

function renderResults(results, query) {
  el.sonuclar.innerHTML = "";
  const safeResults = results.length ? results : buildFallbackResults(query);

  safeResults.forEach((item) => {
    const card = document.createElement("article");
    card.className = "result-item";
    card.innerHTML = `<h3><a href="#">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.snippet || "Açıklama yok")}</p><div class="result-actions"><button class="open-link" type="button">Bağlantıyı Aç</button><button class="ask-link" type="button">✦ Baluk.ai'ye Sor</button></div>`;
    card.querySelector("a").addEventListener("click", (e) => { e.preventDefault(); openUrl(item.href, true, query); });
    card.querySelector(".open-link").addEventListener("click", () => openUrl(item.href, true, query));
    card.querySelector(".ask-link").addEventListener("click", () => {
      setPanel(true);
      el.aiSoru.value = `${item.title} web sitesi ne işe yarar?`;
      el.aiForm.requestSubmit();
    });
    el.sonuclar.appendChild(card);
  });
}

async function fetchWebResults(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const out = [];

    if (data.AbstractURL) {
      out.push({
        title: data.Heading || query,
        description: data.AbstractText || "Öne çıkan sonuç",
        link: data.AbstractURL,
      });
    }

    const pushTopic = (topic) => {
      if (!topic) return;
      if (topic.FirstURL && topic.Text) {
        const title = topic.Text.split(" - ")[0].trim() || topic.Text.slice(0, 64);
        out.push({ title, description: topic.Text, link: topic.FirstURL });
      }
      if (Array.isArray(topic.Topics)) topic.Topics.forEach(pushTopic);
    };

    (data.RelatedTopics || []).forEach(pushTopic);

    const seen = new Set();
    const uniq = [];
    for (const item of out) {
      if (!item?.link || seen.has(item.link)) continue;
      seen.add(item.link);
      uniq.push(item);
    }

    return uniq.slice(0, 12);
  } catch {
    return [];
  }
}

function isWikipediaLink(link = "") {
  return /https?:\/\/(?:[a-z]{2}\.)?wikipedia\.org\/wiki\//i.test(link);
}

function extractWikiTitleFromLink(link = "") {
  try {
    const u = new URL(link);
    if (!u.pathname.startsWith("/wiki/")) return "";
    return decodeURIComponent(u.pathname.replace("/wiki/", "")).replace(/_/g, " ").trim();
  } catch {
    return "";
  }
}

async function fetchWikipediaLongExcerpt(link) {
  if (!isWikipediaLink(link)) return null;
  const title = extractWikiTitleFromLink(link);
  if (!title) return null;

  const endpoints = [
    `https://tr.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exsectionformat=plain&titles=${encodeURIComponent(title)}&format=json&origin=*`,
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exsectionformat=plain&titles=${encodeURIComponent(title)}&format=json&origin=*`,
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep);
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const page = Object.values(pages)[0];
      const raw = (page?.extract || "").replace(/\s+/g, " ").trim();
      if (raw) return raw.slice(0, 400);
    } catch {}
  }
  return null;
}

async function fetchWebModeAnswer(query) {
  const cleaned = query.trim();
  if (!cleaned) return "";

  try {
    const results = await fetchWebResults(cleaned);
    if (!results.length) return "";

    const primary = results[0];
    let text = (primary.description || primary.title || "").trim();

    for (const item of results) {
      const wikiExcerpt = await fetchWikipediaLongExcerpt(item.link);
      if (wikiExcerpt) {
        text = `${text} ${wikiExcerpt}`.trim();
        break;
      }
    }

    return text.replace(/\s+/g, " ").trim().slice(0, 400);
  } catch {
    return "";
  }
}

function getCurrentSiteContext() {
  const tab = currentTab();
  const raw = tab?.url || el.adresCubugu.value || "";
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");
    const name = host.split(".")[0] || host;
    const key = Object.keys(SITE_KNOWLEDGE).find((k) => host.endsWith(k));
    const known = key ? SITE_KNOWLEDGE[key] : null;
    return {
      host,
      name: known?.name || (name.charAt(0).toUpperCase() + name.slice(1)),
      url: u.href,
      year: known?.year || "kesin yıl bilgisi bulunamadı",
      company: known?.company || "kurucu/şirket bilgisi için resmi Hakkında sayfasına bakılmalı",
      purpose: known?.purpose || "kullanıcıya bilgi/hizmet sunmak için tasarlanmış bir web platformu",
      summary: known?.summary || `${name.charAt(0).toUpperCase() + name.slice(1)} için özet bilgi çıkarıldı; detay için resmi kaynaklar incelenmeli.`,
    };
  } catch {
    return null;
  }
}

function getCurrentHost() {
  const c = getCurrentSiteContext();
  return c?.host || "";
}

function genericWebsiteDefinition() {
  return `${highlight("Web sitesi")}, internet üzerinde çalışan sayfalardan oluşan bir bilgi/hizmet alanıdır. Genelde amacı içerik sunmak, işlem yaptırmak veya kullanıcıyı bir hizmete ulaştırmaktır.`;
}

function siteHintFromText(text) {
  const t = normalize(text);
  return ["youtube", "google", "wikipedia", "github", "instagram", "twitter", "shopify"].find((x) => t.includes(x)) || "web sitesi";
}

function getKnownSiteFromText(text) {
  const q = normalize(text);
  for (const [host, info] of Object.entries(SITE_KNOWLEDGE)) {
    const hostShort = host.replace(/^www\./, "").split(".")[0];
    const name = normalize(info.name || hostShort);
    if (q.includes(hostShort) || q.includes(name)) {
      return {
        host,
        name: info.name,
        year: info.year,
        company: info.company,
        purpose: info.purpose,
        summary: info.summary,
      };
    }
  }
  return null;
}

function shouldUseWebModeThinking(query) {
  const q = normalize(query);
  return /(web|site|ekrandaki|bu web|bu site|youtube|shopify|wikipedia|kuruluş|kurucu|şirket|amaç|özet|hakkında|nasıl)/.test(q);
}

function startThinking(customLines = THINKING_LINES) {
  el.aiCevap.innerHTML = "";
  el.thinkingBox.classList.remove("hidden");
  el.spinLogo.classList.add("active");
  document.body.classList.add("web-glow");
  let idx = 0;
  el.thinkingText.textContent = customLines[0];
  clearInterval(state.thinkingTicker);
  state.thinkingTicker = setInterval(() => {
    idx = (idx + 1) % customLines.length;
    el.thinkingText.textContent = customLines[idx];
  }, 1400);
}

function stopThinking() {
  clearInterval(state.thinkingTicker);
  el.thinkingBox.classList.add("hidden");
  el.spinLogo.classList.remove("active");
  document.body.classList.remove("web-glow");
}

function setAgentMode(on) {
  state.agentModeActive = on;
  el.agentBadge.classList.toggle("hidden", !on);
  el.agentModeBtn.innerHTML = on ? 'Agent Mode 3.0 (Açık) <span class="new-pill">NEW</span>' : 'Agent Mode 3.0 <span class="new-pill">NEW</span>';
}

function parseSearchCommand(q) {
  const t = normalize(q).replace(/^hey baluk\s+/i, "");
  const m1 = t.match(/^ara\s+(.+)$/i);
  const m2 = t.match(/^(.+)\s+ara$/i);
  const m3 = t.match(/^(.+)\s+arat$/i);
  const m4 = t.match(/^(.+)\s+arat\s+çıkan\s+(\d+)\.?\s+link/i);
  const query = (m4?.[1] || m1?.[1] || m2?.[1] || m3?.[1] || "").trim();
  const n = Number((t.match(/(\d+)\.?\s*link/) || [])[1] || m4?.[2] || 1);
  return { query, linkIndex: Math.max(1, n || 1) };
}

function detectThemeColorFromText(text) {
  const q = normalize(text);
  let found = null;
  for (const name of Object.keys(THEME_COLORS)) {
    if (q.includes(normalize(name))) {
      if (!found || name.length > found.length) found = name;
    }
  }
  return found;
}

function saveThemeFromUi() {
  const theme = {
    colorName: el.themeColorSelect.value,
    font: el.fontStyleSelect.value,
    cursorShape: el.cursorShapeSelect.value,
    cursorSize: Number(el.cursorSizeRange.value || 18),
  };
  state.theme = theme;
  localStorage.setItem("balukTheme", JSON.stringify(theme));
  applyTheme(theme);
  return theme;
}

function moveCursorTo(element) {
  const rect = element.getBoundingClientRect();
  agentCursor.style.opacity = "1";
  agentCursor.style.left = `${rect.left + rect.width / 2}px`;
  agentCursor.style.top = `${rect.top + rect.height / 2}px`;
}
function moveCursorToPoint(x, y) {
  agentCursor.style.opacity = "1";
  agentCursor.style.left = `${x}px`;
  agentCursor.style.top = `${y}px`;
}

function clickByViewportPoint(x, y) {
  const under = document.elementFromPoint(x, y);
  if (!under) return false;
  try {
    ["pointerdown", "mousedown", "mouseup", "click"].forEach((type) => {
      under.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, view: window }));
    });
    return true;
  } catch {
    return false;
  }
}

function getElementCenterInViewport(element) {
  const rect = element.getBoundingClientRect();
  let x = rect.left + rect.width / 2;
  let y = rect.top + rect.height / 2;

  const doc = element.ownerDocument;
  const frameEl = doc?.defaultView?.frameElement;
  if (frameEl) {
    const fr = frameEl.getBoundingClientRect();
    x += fr.left;
    y += fr.top;
  }
  return { x, y };
}

async function clickElement(element) {
  moveCursorTo(element);
  await sleep(280);
  element.click();
  await sleep(160);
}

function findTabByName(name) {
  const q = normalize(name);
  return state.tabs.find((t) => normalize(t.title).includes(q));
}

function parseCloseNames(text) {
  const quoted = [...text.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  if (quoted.length) return quoted;
  const single = text.match(/(.+?)\s+isimli\s+sekmeyi\s+kapat/i);
  return single ? [single[1].trim()] : [];
}

async function closeTabViaCursor(tabId) {
  const closeBtn = document.querySelector(`.tab-item [data-close="${tabId}"]`);
  if (!closeBtn) return false;
  await clickElement(closeBtn);
  return true;
}

async function closeMany(order, count) {
  let tabs = [...state.tabs];
  if (tabs.length <= 1) return "Kapatılacak sekme yok.";
  if (order === "right") tabs = tabs.reverse();

  let done = 0;
  for (const tab of tabs) {
    if (state.tabs.length <= 1 || done >= count) break;
    const ok = await closeTabViaCursor(tab.id);
    if (ok) done += 1;
  }
  return `${done} sekme kapatıldı.`;
}

async function runAgentTask(q) {
  if (state.agentBusy) return "Agent Mode meşgul, bekle.";
  state.agentBusy = true;
  startThinking(["Masaüstümü kuruyorum...", "Hedefleri planlıyorum...", "Hazırım, uyguluyorum..."]);
  await sleep(3000);
  stopThinking();

  try {
    const low = normalize(q);

    const themeColor = detectThemeColorFromText(q);
    if ((/tema|renk|rengi|kişiselleştir|kisisellestir|tarayıcı rengimi|tarayici rengimi/.test(low)) && themeColor) {
      await runThemeAnimation(themeColor);
      if (el.themeColorSelect) el.themeColorSelect.value = themeColor;
      const theme = saveThemeFromUi();
      return `Şunu istedin: tema ${highlight(themeColor)}. Şunu yaptım: tema rengini ${highlight(theme.colorName)} olarak ayarladım.`;
    }

    if (/yazı stili|font/.test(low)) {
      if (low.includes("klasik")) el.fontStyleSelect.value = "'Georgia', serif";
      else if (low.includes("poppins")) el.fontStyleSelect.value = "'Poppins', 'Segoe UI', sans-serif";
      else if (low.includes("dengeli")) el.fontStyleSelect.value = "'Trebuchet MS', Arial, sans-serif";
      else el.fontStyleSelect.value = "Inter, Arial, sans-serif";
      const theme = saveThemeFromUi();
      return `Yazı stilini güncelledim: ${highlight(theme.font)}.`;
    }

    if (/imlec|cursor/.test(low)) {
      if (low.includes("kare")) el.cursorShapeSelect.value = "square";
      else if (low.includes("elmas")) el.cursorShapeSelect.value = "diamond";
      else el.cursorShapeSelect.value = "circle";
      const sizeMatch = low.match(/(\d{2})/);
      if (sizeMatch) el.cursorSizeRange.value = String(Math.max(14, Math.min(42, Number(sizeMatch[1]))));
      saveThemeFromUi();
      return "İmleç şeklini/boyutunu güncelledim.";
    }

    if (/sekmeleri soldan saga diz|sekmeleri soldan sağa diz|sekmeleri ters cevir|sekmeleri ters çevir/.test(low)) {
      state.tabs.reverse();
      renderTabs();
      return "Sekmelerin sırasını değiştirdim.";
    }

    if (low.includes("geri")) { await clickElement(el.geriBtn); return "Şunu istedin: geri. Şunu yaptım: geri gittim."; }
    if (low.includes("ileri")) { await clickElement(el.ileriBtn); return "Şunu istedin: ileri. Şunu yaptım: ileri gittim."; }
    if (low.includes("yenile")) { await clickElement(el.yenileBtn); return "Şunu istedin: yenile. Şunu yaptım: sayfayı yeniledim."; }

    if (/\d+\s+yeni\s+sekme\s+aç/.test(low)) {
      const n = Number(low.match(/(\d+)\s+yeni\s+sekme\s+aç/)?.[1] || 1);
      for (let i = 0; i < n; i += 1) await clickElement(el.addTabBtn);
      return `${n} yeni sekme açtım.`;
    }
    if (low.includes("yeni sekme")) { await clickElement(el.addTabBtn); return "Yeni sekme açtım."; }

    if (low.includes("tüm sekmeleri kapat")) {
      while (state.tabs.length > 1) {
        await closeTabViaCursor(state.tabs[state.tabs.length - 1].id);
      }
      return "Tüm sekmeleri kapattım (en az 1 sekme kaldı).";
    }

    if (/soldan\s+sağa\s+\d+\s+sekme\s+kapat/.test(low)) {
      const n = Number(low.match(/soldan\s+sağa\s+(\d+)\s+sekme\s+kapat/)?.[1] || 1);
      return closeMany("left", n);
    }
    if (/sağdan\s+sola\s+\d+\s+sekme\s+kapat/.test(low)) {
      const n = Number(low.match(/sağdan\s+sola\s+(\d+)\s+sekme\s+kapat/)?.[1] || 1);
      return closeMany("right", n);
    }

    if (low.includes("isimli sekmeyi kapat") || /"[^"]+"/.test(q)) {
      const names = parseCloseNames(q);
      if (!names.length) return "Sekme adı anlayamadım.";
      let closed = 0;
      for (const name of names) {
        const tab = findTabByName(name);
        if (tab && state.tabs.length > 1) {
          await closeTabViaCursor(tab.id);
          closed += 1;
        }
      }
      return `${closed} isimli sekme kapatıldı.`;
    }

    const parsed = parseSearchCommand(q);
    if (parsed.query) {
      await clickElement(el.newTabBtn);
      moveCursorTo(el.aramaInput);
      await sleep(220);
      const tab = currentTab();
      if (tab) setTabTitle(tab, parsed.query);
      el.aramaInput.value = "";
      for (const ch of parsed.query) {
        el.aramaInput.value += ch;
        await sleep(26);
      }
      el.aramaForm.requestSubmit();
      await sleep(1200);
      const cards = [...document.querySelectorAll(".result-item")];
      const idx = Math.min(parsed.linkIndex - 1, cards.length - 1);
      const btn = cards[idx]?.querySelector(".open-link");
      if (!btn) return "Sonuç bulunamadı.";
      await clickElement(btn);
      return `Şunu istedin: ${escapeHtml(parsed.query)}. Şunu yaptım: ${parsed.linkIndex}. linke girdim.`;
    }

    return "Agent Mode 3.0 komutu anlaşılamadı.";
  } finally {
    state.agentBusy = false;
    agentCursor.style.opacity = "0";
  }
}

async function answerNormal(q) {
  const low = normalize(q);
  const themeColor = detectThemeColorFromText(q);
  if (themeColor && /(tema|renk|tarayıcı|tarayici|kişiselleştir|kisisellestir)/.test(low)) {
    return `Bunu direkt yapmam için ${highlight("Agent Mode 3.0")} açabilirsin veya 🖌 kişiselleştirme butonundan ${highlight(themeColor)} seçebilirsin.`;
  }
  if (/(geri|ileri|yenile|yeni sekme|kapat)/.test(low)) {
    return `Bunu otomatik yapmam için ${highlight("Agent Mode 3.0")} aç.`;
  }

  if (/(merhaba|selam|hey|günaydın|iyi akşamlar)/.test(low)) {
    return `${highlight("Merhaba!")} İyiyim, hazırım ✦ İstersen web araştırması, istersen normal sohbet yapabiliriz.`;
  }

  if (/(nasılsın|naber|iyi misin)/.test(low)) {
    return `Gayet iyiyim 🙌 ${highlight("Baluk.ai")} olarak hem web tarafında hem de genel konularda yardımcı olabilirim.`;
  }

  if (/(sen kimsin|nesin|kimsin)/.test(low)) {
    return `${highlight("Ben Baluk.ai")}, Baluk Screatch içinde çalışan yardımcı modelim. Web analiz, özetleme ve genel soru-cevap yapabilirim.`;
  }

  const asksCurrentSite = /\bekranımdaki\s+uygulama|\bekrandaki\s+uygulama|\bbu\s+uygulama|\baçık\s+uygulama|\bbu\s+web\s*site|\bbu\s+site|ekrandaki\s+site|açık\s+site|şu\s+site/.test(low);
  const asksGenericWeb = /web\s*site\s*nedir|webin\s+ne\s+oldu|web\s*sitenin\s+amacı\s+ne/.test(low);

  const asksYear = /kuruluş|kurulus|kaç yılında|kac yilinda|ne zaman/.test(low);
  const asksCompany = /kim tarafından|kim tarafindan|hangi şirket|hangi sirket|kurucu|kim kurdu/.test(low);
  const asksPurpose = /amaç|amac|amacı|amaci|ne işe yarar|ne ise yarar/.test(low);
  const asksSummary = /özet|özeti/.test(low);
  const asksGeneralProfile = /nedir|açıkla|açıklar mısın|anlat|genel bilgi/.test(low) && !asksYear && !asksCompany && !asksPurpose;

  if (asksGenericWeb && !asksCurrentSite) {
    return genericWebsiteDefinition();
  }

  const current = getCurrentSiteContext();
  const mentionedSite = getKnownSiteFromText(q);

  if (asksCurrentSite && !current) {
    return `Önce bir site aç, sonra ${highlight("bu web sitenin amacı ne")} diye sor; ekrandaki siteyi yorumlayayım.`;
  }

  const topic = asksCurrentSite ? current : mentionedSite;
  const genericTopic = siteHintFromText(q);
  const sourceText = await fetchWebModeAnswer(asksCurrentSite ? (topic?.name || topic?.host || "") : (topic?.name || q));

  if (topic) {
    if (asksYear) {
      return `${highlight(topic.name)} kuruluş yılı: ${highlight(topic.year || "bilinmiyor")}.`;
    }
    if (asksCompany) {
      return `${highlight(topic.name)} kurucu/şirket bilgisi:
${escapeHtml(topic.company || "bilgi bulunamadı")}`;
    }
    if (asksPurpose) {
      return `${highlight(topic.name)} amacı:
${escapeHtml(topic.purpose || "bilgi bulunamadı")}`;
    }
    if (asksSummary) {
      const sum = sourceText || topic.summary;
      return `${highlight(topic.name)} özeti:
${escapeHtml(sum || "Özet bulunamadı")}`;
    }

    if (asksGeneralProfile) {
      const sum = sourceText || topic.summary;
      return `${highlight(topic.name)} genel bilgi:
Kuruluş: ${highlight(topic.year || "bilinmiyor")}
Şirket/Kurucu: ${escapeHtml(topic.company || "bilgi yok")}
Amaç: ${escapeHtml(topic.purpose || "bilgi yok")}
Özet: ${escapeHtml(sum || "Özet bulunamadı")}`;
    }

    const sum = sourceText || topic.summary;
    return `${highlight("Baluk.ai ağına bağlanıldı")}
${highlight(topic.name)} için hızlı analiz:
Kuruluş: ${highlight(topic.year || "bilinmiyor")}
Şirket/Kurucu: ${escapeHtml(topic.company || "bilgi yok")}
Amaç: ${escapeHtml(topic.purpose || "bilgi yok")}
Web modu özeti: ${escapeHtml(sum || "Özet bulunamadı")}`;
  }

  if (asksYear) {
    const known = getKnownSiteFromText(q);
    if (known?.year) return `${highlight(known.name)} kuruluş yılı: ${highlight(known.year)}.`;
    return `${highlight(genericTopic)} kuruluş bilgisi: ${highlight("web kaynaklarından derlendi")}.`;
  }
  if (/isim|adı/.test(low)) {
    return `Site adı: ${highlight(genericTopic)}.`;
  }
  if (asksPurpose || /hakkında|nasıl/.test(low)) {
    return `${highlight("Baluk.ai web modu aktif")}
${highlight(genericTopic)} hakkında:
${escapeHtml(sourceText || `${genericTopic} hakkında yeterli veri bulunamadı.`)}`;
  }

  if (!asksCurrentSite && !asksGenericWeb) {
    const general = await fetchWebModeAnswer(q);
    if (general) {
      return `${highlight("Baluk.ai genel mod")}
${escapeHtml(general)}`;
    }
    return `${highlight("Baluk.ai genel mod")}
Bu konuda sohbet edebiliriz. Daha net istersen sorunu biraz detaylandır.`;
  }

  return `${highlight(genericTopic)} özeti:
${escapeHtml(sourceText || "Özet bulunamadı")}`;
}

function initPrompts() {
  const prompts = [
    { text: "YouTube'un amacı nedir?", agent: false },
    { text: "shopify arat 1. linke tıkla", agent: true },
    { text: "10 yeni sekme aç", agent: true },
    { text: "tarayıcı temamı gece mavisi yap", agent: true },
  ];

  prompts.forEach((p) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = p.text;
    b.onclick = () => {
      setPanel(true);
      if (p.agent) setAgentMode(true);
      el.aiSoru.value = p.text;
      el.aiForm.requestSubmit();
    };
    el.quickPrompts.appendChild(b);
  });
}

function renderAuth() {
  if (state.user) {
    el.authArea.classList.add("hidden");
    el.assistantArea.classList.remove("hidden");
    el.welcomeText.textContent = `${state.user.ad} ${state.user.soyad}`;
    el.profileMail.textContent = state.user.email;
    el.profileAvatar.src = state.user.profil || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70'%3E%3Crect width='100%25' height='100%25' fill='%23212a57'/%3E%3Ctext x='50%25' y='53%25' text-anchor='middle' fill='%23fff' font-size='22' font-family='Arial' dy='.3em'%3EB%3C/text%3E%3C/svg%3E";
  } else {
    el.authArea.classList.remove("hidden");
    el.assistantArea.classList.add("hidden");
  }
}

el.aramaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = el.aramaInput.value.trim();
  if (!q) return;
  const tab = currentTab();
  if (tab) { setTabTitle(tab, q); renderTabs(); }
  el.sonuclar.innerHTML = `<span class="searching-status">Ekranında arıyorum...</span>`;
  const results = await getSearchResults(q);
  renderResults(results, q);
});

el.adresCubugu.addEventListener("keydown", (e) => { if (e.key === "Enter") openUrl(el.adresCubugu.value); });
el.geriBtn.addEventListener("click", () => {
  const t = currentTab();
  if (t && t.index > 0) { t.index -= 1; t.url = t.history[t.index]; syncTabView(); }
});
el.ileriBtn.addEventListener("click", () => {
  const t = currentTab();
  if (t && t.index < t.history.length - 1) { t.index += 1; t.url = t.history[t.index]; syncTabView(); }
});
el.yenileBtn.addEventListener("click", () => { if (el.siteFrame.src) el.siteFrame.src = el.siteFrame.src; });
el.newTabBtn.addEventListener("click", () => createTab());
el.addTabBtn.addEventListener("click", () => createTab());

el.balukPanelBtn.addEventListener("click", () => setPanel(el.aiPanel.classList.contains("hidden")));
el.closePanelBtn.addEventListener("click", () => setPanel(false));
el.plusBtn.addEventListener("click", () => el.agentMenu.classList.toggle("hidden"));
el.agentModeBtn.addEventListener("click", () => {
  setAgentMode(!state.agentModeActive);
  el.agentMenu.classList.add("hidden");
});
el.themeModeBtn.addEventListener("click", () => {
  setCustomizeMode(true);
  el.agentMenu.classList.add("hidden");
});
el.agentBadgeClose.addEventListener("click", () => setAgentMode(false));
el.customizeBtn.addEventListener("click", () => setCustomizeMode(!state.customizeMode));
el.closeCustomizeBtn.addEventListener("click", () => setCustomizeMode(false));
el.saveCustomizeBtn.addEventListener("click", async () => {
  const selectedColor = el.themeColorSelect.value;
  await runThemeAnimation(selectedColor);
  saveThemeFromUi();
});
el.advancedEditBtn.addEventListener("click", () => {
  const next = !state.uiEditMode;
  setUiEditMode(next);
  el.advancedEditBtn.textContent = next ? "Düzenleme Modunu Kapat" : "Düzenleme Modu";
});

el.loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = {
    email: document.getElementById("mail").value.trim(),
    ad: document.getElementById("ad").value.trim(),
    soyad: document.getElementById("soyad").value.trim(),
  };
  const file = document.getElementById("profil").files[0];
  if (!user.email || !user.ad || !user.soyad) return;

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      user.profil = reader.result;
      state.user = user;
      localStorage.setItem("balukUser", JSON.stringify(user));
      renderAuth();
    };
    reader.readAsDataURL(file);
  } else {
    state.user = user;
    localStorage.setItem("balukUser", JSON.stringify(user));
    renderAuth();
  }
});

el.aiForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = el.aiSoru.value.trim();
  if (!q) return;

  if (state.agentModeActive) {
    el.aiCevap.innerHTML = await runAgentTask(q);
    el.aiSoru.value = "";
    return;
  }

  startThinking(shouldUseWebModeThinking(q) ? WEB_MODE_THINKING_LINES : THINKING_LINES);
  clearTimeout(state.thinkingTimer);
  state.thinkingTimer = setTimeout(async () => {
    stopThinking();
    el.aiCevap.innerHTML = await answerNormal(q);
    el.aiSoru.value = "";
  }, 3000);
});

el.aiSoru.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    el.aiForm.requestSubmit();
  }
});

renderTabs();
renderAuth();
initPrompts();
initThemeOptions();
restoreEditableLayout();
setPanel(false);
runIntro();
