const state = {
  tabs: [{ id: 1, title: "Yeni Sekme", url: "", history: [], index: -1 }],
  activeTabId: 1,
  nextTabId: 2,
  user: JSON.parse(localStorage.getItem("balukUser") || "null"),
  thinkingTimer: null,
  thinkingTicker: null,
  agentModeActive: false,
  agentBusy: false,
};

const THINKING_LINES = [
  "Baluk.ai ağına bağlanılıyor...",
  "Ekranındaki sayfayı satır satır tarıyorum...",
  "Web + Wikipedia kaynaklarını birleştiriyorum...",
  "Doğrulayıp net cevabı hazırlıyorum..."
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
  agentBadge: document.getElementById("agentBadge"),
  agentBadgeClose: document.getElementById("agentBadgeClose"),
  quickPrompts: document.getElementById("quickPrompts"),
  introOverlay: document.getElementById("introOverlay"),
  appShell: document.getElementById("appShell"),
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

function currentTab() { return state.tabs.find((t) => t.id === state.activeTabId); }
function escapeHtml(text = "") { return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function ensureUrl(value) { return /^https?:\/\//i.test(value) ? value : `https://${value}`; }
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
function highlight(v) { return `<span class="hl">${escapeHtml(v)}</span>`; }
function normalize(s = "") { return s.toLowerCase().trim(); }

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
    b.dataset.tabId = String(tab.id);
    b.innerHTML = `<span>${escapeHtml(tab.title)}</span><span class="tab-close" data-close="${tab.id}">✕</span>`;
    b.addEventListener("click", (e) => {
      const close = e.target.closest(".tab-close");
      if (close) return closeTab(Number(close.dataset.close));
      switchTab(tab.id);
    });
    el.tabs.appendChild(b);
  });
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
  renderTabs();
  syncTabView();
}

function buildFallbackResults(query) {
  const q = encodeURIComponent(query);
  return [
    { title: `${query} - DuckDuckGo`, href: `https://duckduckgo.com/?q=${q}`, snippet: "DuckDuckGo sonuç sayfasını aç." },
    { title: `${query} - Wikipedia araması`, href: `https://tr.wikipedia.org/wiki/Özel:Arama?search=${q}`, snippet: "Wikipedia içinde ara." },
    { title: `${query} - Google araması`, href: `https://www.google.com/search?q=${q}`, snippet: "Google sonuç sayfasını aç." },
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

async function fetchWikipediaSnippet(topic) {
  try {
    const r = await fetch(`https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
    if (!r.ok) return "";
    const data = await r.json();
    return (data.extract || "").trim().slice(0, 200);
  } catch { return ""; }
}



async function fetchWebModeAnswer(query) {
  const cleaned = query.trim();
  if (!cleaned) return "";

  const parts = [];
  try {
    const ddgResp = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(cleaned)}&format=json&no_redirect=1&no_html=1`);
    if (ddgResp.ok) {
      const ddg = await ddgResp.json();
      if (ddg.AbstractText) parts.push(ddg.AbstractText);
      const related = (ddg.RelatedTopics || [])
        .flatMap((item) => item.Topics || [item])
        .map((item) => item?.Text)
        .filter(Boolean);
      if (related.length) parts.push(related.slice(0, 2).join(" "));
    }
  } catch {}

  const wiki = await fetchWikipediaSnippet(cleaned);
  if (wiki) parts.push(wiki);

  const merged = parts.join(" ").replace(/\s+/g, " ").trim();
  return merged.slice(0, 450);
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
  el.agentModeBtn.textContent = on ? "Agent Mode 2.0 (Açık)" : "Agent Mode 2.0";
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

    return "Agent Mode 2.0 komutu anlaşılamadı.";
  } finally {
    state.agentBusy = false;
    agentCursor.style.opacity = "0";
  }
}

async function answerNormal(q) {
  const low = normalize(q);
  if (/(geri|ileri|yenile|yeni sekme|kapat)/.test(low)) {
    return `Bunu otomatik yapmam için ${highlight("Agent Mode 2.0")} aç.`;
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

  const asksCurrentSite = /\bbu\s+web\s*site|\bbu\s+site|ekrandaki\s+site|açık\s+site|şu\s+site/.test(low);
  const asksGenericWeb = /web\s*site\s*nedir|webin\s+ne\s+oldu|web\s*sitenin\s+amacı\s+ne/.test(low);

  if (asksGenericWeb && !asksCurrentSite) {
    return genericWebsiteDefinition();
  }

  const current = getCurrentSiteContext();
  if (asksCurrentSite && !current) {
    return `Önce bir site aç, sonra ${highlight("bu web sitenin amacı ne")} diye sor; ekrandaki siteyi yorumlayayım.`;
  }

  const topic = asksCurrentSite ? current : null;
  const genericTopic = siteHintFromText(q);
  const sourceText = await fetchWebModeAnswer(asksCurrentSite ? (topic?.name || topic?.host || "") : q);

  if (asksCurrentSite) {
    if (/kuruluş|kaç yılında|ne zaman/.test(low)) {
      return `${highlight(topic.name)} kuruluş yılı: ${highlight(topic.year)}.`;
    }
    if (/kim tarafından|hangi şirket|kurucu/.test(low)) {
      return `${highlight(topic.name)} kurucu/şirket bilgisi:
${escapeHtml(topic.company)}`;
    }
    if (/amaç|ne işe yarar/.test(low)) {
      return `${highlight("Ekrandaki site")}: ${highlight(topic.name)}
Amaç: ${escapeHtml(topic.purpose)}`;
    }
    if (/özet|özeti|nedir/.test(low)) {
      const sum = sourceText || topic.summary;
      return `${highlight(topic.name)} özeti:
${escapeHtml(sum)}`;
    }
    const sum = sourceText || topic.summary;
    return `${highlight("Baluk.ai ağına bağlanıldı")}
${highlight(topic.name)} için hızlı analiz:
Kuruluş: ${highlight(topic.year)}
Şirket/Kurucu: ${escapeHtml(topic.company)}
Amaç: ${escapeHtml(topic.purpose)}
Web modu özeti: ${escapeHtml(sum)}`;
  }

  if (/kuruluş|kaç yılında|ne zaman/.test(low)) {
    return `${highlight(genericTopic)} kuruluş bilgisi: ${highlight("web kaynaklarından derlendi")}.`;
  }
  if (/isim|adı/.test(low)) {
    return `Site adı: ${highlight(genericTopic)}.`;
  }
  if (/amaç|ne işe yarar|hakkında|nasıl/.test(low)) {
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
el.agentBadgeClose.addEventListener("click", () => setAgentMode(false));

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

  startThinking();
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
setPanel(false);
runIntro();
