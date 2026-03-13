const state = {
  tabs: [{ id: 1, title: "Yeni Sekme", url: "", history: [], index: -1 }],
  activeTabId: 1,
  nextTabId: 2,
  user: JSON.parse(localStorage.getItem("balukUser") || "null"),
  thinkingTimer: null,
  thinkingTicker: null,
  agentModeActive: false,
  agentBusy: false,
  selectedTargets: [],
};

const THINKING_LINES = [
  "Ekranına bakıyorum...",
  "Kaynakları karşılaştırıyorum...",
  "Anlamlı parçaları ayırıyorum...",
  "En doğru özeti hazırlıyorum..."
];

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
  selectedTargets: document.getElementById("selectedTargets"),
  agentBadge: document.getElementById("agentBadge"),
  agentBadgeClose: document.getElementById("agentBadgeClose"),
  quickPrompts: document.getElementById("quickPrompts"),
  introOverlay: document.getElementById("introOverlay"),
  appShell: document.getElementById("appShell"),
};

const agentCursor = document.createElement("div");
agentCursor.id = "agentCursor";
agentCursor.style.cssText = "position:fixed;width:18px;height:18px;border:2px solid #b78cff;background:radial-gradient(circle,#6b24dd 0%,#141020 75%);border-radius:50%;box-shadow:0 0 18px rgba(141,69,255,.85);z-index:9999;pointer-events:none;opacity:0;transform:translate(-50%,-50%);transition:left .35s ease, top .35s ease, opacity .2s ease;";
document.body.appendChild(agentCursor);

function currentTab() {
  return state.tabs.find((t) => t.id === state.activeTabId);
}
function escapeHtml(text = "") {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function ensureUrl(value) { return /^https?:\/\//i.test(value) ? value : `https://${value}`; }
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function highlight(v) { return `<span class="hl">${escapeHtml(v)}</span>`; }

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
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const introDuration = reducedMotion ? 2350 : 4800;
  playIntroSound();
  setTimeout(() => {
    el.introOverlay.classList.add("hidden");
    el.appShell.classList.remove("app-hidden");
    el.appShell.style.pointerEvents = "auto";
  }, introDuration);
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
    b.innerHTML = `<span>${escapeHtml(tab.title)}</span><span class="tab-close" data-close="${tab.id}">✕</span>`;
    b.addEventListener("click", (e) => {
      const close = e.target.closest(".tab-close");
      if (close) return closeTab(Number(close.dataset.close));
      switchTab(tab.id);
    });
    el.tabs.appendChild(b);
  });
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
  if (state.tabs.length === 1) return;
  state.tabs = state.tabs.filter((t) => t.id !== id);
  if (!state.tabs.some((t) => t.id === state.activeTabId)) state.activeTabId = state.tabs[0].id;
  renderTabs();
  syncTabView();
}

function switchTab(id) {
  state.activeTabId = id;
  renderTabs();
  syncTabView();
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

function openUrl(url, addToHistory = true) {
  const safe = ensureUrl(url);
  const tab = currentTab();
  if (!tab) return;

  tab.url = safe;
  try { tab.title = new URL(safe).hostname.replace(/^www\./, ""); } catch { tab.title = "Yeni Sekme"; }

  if (addToHistory) {
    tab.history = tab.history.slice(0, tab.index + 1);
    tab.history.push(safe);
    tab.index = tab.history.length - 1;
  }

  renderTabs();
  syncTabView();
}

async function getSearchResults(query) {
  const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`);
  if (!response.ok) throw new Error("duckduckgo error");
  const data = await response.json();
  const parsed = [];
  if (data.AbstractURL) parsed.push({ title: data.Heading || query, href: data.AbstractURL, snippet: data.AbstractText || "Özet bilgi" });
  (data.RelatedTopics || []).forEach((item) => {
    if (item.FirstURL && item.Text) parsed.push({ title: item.Text.split(" - ")[0], href: item.FirstURL, snippet: item.Text });
    (item.Topics || []).forEach((sub) => {
      if (sub.FirstURL && sub.Text) parsed.push({ title: sub.Text.split(" - ")[0], href: sub.FirstURL, snippet: sub.Text });
    });
  });
  return parsed.slice(0, 8);
}

function renderResults(results) {
  el.sonuclar.innerHTML = "";
  results.forEach((item) => {
    const card = document.createElement("article");
    card.className = "result-item";
    card.innerHTML = `<h3><a href="#">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.snippet || "Açıklama yok")}</p><div class="result-actions"><button class="open-link" type="button">Bağlantıyı Aç</button><button class="ask-link" type="button">✦ Baluk.ai'ye Sor</button></div>`;
    card.querySelector("a").addEventListener("click", (e) => { e.preventDefault(); openUrl(item.href); });
    card.querySelector(".open-link").addEventListener("click", () => openUrl(item.href));
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

function siteHintFromText(text) {
  const t = text.toLowerCase();
  const m = ["youtube", "google", "wikipedia", "github", "instagram", "twitter", "shopify"].find((x) => t.includes(x));
  return m || "web sitesi";
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
  if (!on) {
    state.selectedTargets = [];
    renderSelectedTargets();
  }
}

function renderSelectedTargets() {
  el.selectedTargets.innerHTML = "";
  state.selectedTargets.forEach((target, i) => {
    const chip = document.createElement("div");
    chip.className = "target-chip";
    chip.innerHTML = `<span>${escapeHtml(target.label)}</span><button type="button">✕</button>`;
    chip.querySelector("button").onclick = () => {
      state.selectedTargets.splice(i, 1);
      renderSelectedTargets();
    };
    el.selectedTargets.appendChild(chip);
  });
}

function bindAgentPicker() {
  try {
    const doc = el.siteFrame.contentDocument;
    if (!doc) throw new Error();
    doc.addEventListener("click", (e) => {
      if (!state.agentModeActive) return;
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      e.preventDefault(); e.stopPropagation();
      const label = (t.innerText || t.placeholder || t.value || t.tagName).trim().slice(0, 26) || t.tagName;
      state.selectedTargets.push({ el: t, label });
      t.style.outline = "2px solid #b171ff";
      renderSelectedTargets();
      el.aiCevap.innerHTML = `Seçildi: ${highlight(label)}. Şimdi ne yapılacağını yaz.`;
    }, { capture: true });
    el.aiCevap.innerHTML = "Agent Mode 2.0 açık. Sayfadan bir veya birden çok öğe seçebilirsin.";
  } catch {
    el.aiCevap.innerHTML = "Bu sayfada güvenlik nedeniyle işaretleme yapılamıyor (farklı domain kısıtı).";
  }
}

function parseSearchCommand(q) {
  const t = q.toLowerCase().trim();
  const m1 = t.match(/^ara\s+(.+)$/);
  const m2 = t.match(/^(.+)\s+ara$/);
  const m3 = t.match(/^(.+)\s+arat$/);
  const m4 = t.match(/^hey baluk\s+(.+)$/);
  const query = (m1?.[1] || m2?.[1] || m3?.[1] || m4?.[1] || "").trim();
  const n = Number((t.match(/(\d+)\.\s*link/) || [])[1] || 1);
  return { query, linkIndex: Math.max(1, n || 1) };
}

function moveCursorTo(element) {
  const rect = element.getBoundingClientRect();
  agentCursor.style.opacity = "1";
  agentCursor.style.left = `${rect.left + rect.width / 2}px`;
  agentCursor.style.top = `${rect.top + rect.height / 2}px`;
}

async function runAgentTask(q) {
  startThinking(["Masaüstümü kuruyorum...", "Hedefleri planlıyorum...", "Hazırım, uyguluyorum..."]);
  await sleep(3000);
  stopThinking();

  const low = q.toLowerCase();
  if (low.includes("geri")) { el.geriBtn.click(); return "İstediğin işlem yapıldı: geri gidildi."; }
  if (low.includes("ileri")) { el.ileriBtn.click(); return "İstediğin işlem yapıldı: ileri gidildi."; }
  if (low.includes("yenile")) { el.yenileBtn.click(); return "İstediğin işlem yapıldı: sayfa yenilendi."; }
  if (low.includes("yeni sekme")) { createTab(); return "İstediğin işlem yapıldı: yeni sekme açıldı."; }

  const parsed = parseSearchCommand(q);
  if (parsed.query) {
    moveCursorTo(el.aramaInput);
    await sleep(250);
    showHome();
    el.aramaInput.value = parsed.query;
    el.aramaForm.requestSubmit();
    await sleep(1200);
    const cards = [...document.querySelectorAll(".result-item")];
    const idx = Math.min(parsed.linkIndex - 1, cards.length - 1);
    const btn = cards[idx]?.querySelector(".open-link");
    if (btn) {
      moveCursorTo(btn);
      await sleep(300);
      btn.click();
      return `Şunu istedin: ${escapeHtml(parsed.query)}. Şunu yaptım: ${parsed.linkIndex}. linki açtım.`;
    }
    return "Sonuç bulunamadı.";
  }

  if (state.selectedTargets.length) {
    if (/tıkla/.test(low)) {
      for (const t of state.selectedTargets) {
        t.el.click();
        await sleep(220);
      }
      return "Seçtiğin öğelere sırayla tıkladım.";
    }

    const write = q.match(/(?:yaz|değiştir|yap)\s+(.+)/i)?.[1]?.trim();
    if (write) {
      for (const t of state.selectedTargets) {
        if ("value" in t.el) {
          t.el.focus();
          t.el.value = write.replace(/"/g, "");
          t.el.dispatchEvent(new Event("input", { bubbles: true }));
          t.el.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      return `Seçili alanlara ${highlight(write)} yazdım.`;
    }
  }

  return "Agent Mode 2.0: komutu anlayamadım. Örn: 'youtube arat 2. linke tıkla' veya 'seçili öğelere tıkla'.";
}

async function answerNormal(q) {
  const low = q.toLowerCase();
  if (/(geri|ileri|yenile|yeni sekme)/.test(low)) {
    return `Bunu ben yapayım dersen ${highlight("Agent Mode 2.0")} açıp tekrar yaz.`;
  }

  const topic = siteHintFromText(q);
  const wiki = await fetchWikipediaSnippet(topic);

  if (/kuruluş|kaç yılında|ne zaman/.test(low)) {
    return `${highlight(topic)} için kuruluş yılı bilgisi: ${highlight(wiki ? "Wikipedia'dan özet bulundu" : "detay için kaynak gerekli")}.`;
  }

  if (/isim|adı/.test(low)) {
    return `Web sitesi adı: ${highlight(topic)}.`;
  }

  if (/amaç|ne işe yarar|hakkında/.test(low)) {
    const summary = wiki || `${topic} genel olarak bilgi/hizmet sunar.`;
    return `${highlight(topic)} amacı:\n${escapeHtml(summary)}`;
  }

  return `${highlight(topic)} hakkında özet:\n${escapeHtml(wiki || "Wikipedia özeti bulunamadı.")}`;
}

function initPrompts() {
  const prompts = [
    { text: "YouTube'un amacı nedir?", agent: false },
    { text: "shopify arat 1. linke tıkla", agent: true },
    { text: "Yeni sekme aç", agent: true },
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
  el.sonuclar.innerHTML = `<span class="searching-status">Ekranında arıyorum...</span>`;
  try { renderResults(await getSearchResults(q)); }
  catch { el.sonuclar.innerHTML = "Sonuç alınamadı."; }
});

el.adresCubugu.addEventListener("keydown", (e) => { if (e.key === "Enter") openUrl(el.adresCubugu.value); });
el.geriBtn.addEventListener("click", () => {
  const t = currentTab();
  if (t && t.index > 0) { t.index -= 1; t.url = t.history[t.index]; syncTabView(); renderTabs(); }
});
el.ileriBtn.addEventListener("click", () => {
  const t = currentTab();
  if (t && t.index < t.history.length - 1) { t.index += 1; t.url = t.history[t.index]; syncTabView(); renderTabs(); }
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
  if (state.agentModeActive) bindAgentPicker();
});
el.agentBadgeClose.addEventListener("click", () => setAgentMode(false));
el.siteFrame.addEventListener("load", () => { if (state.agentModeActive) bindAgentPicker(); });

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
  }, 20000);
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
