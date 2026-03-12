const state = {
  history: [],
  index: -1,
  user: JSON.parse(localStorage.getItem("balukUser") || "null"),
  thinkingTimer: null,
  thinkingTicker: null,
  agentModeActive: false,
  selectedInput: null,
};

const THINKING_LINES = [
  "Baluk.ai düşünüyor...",
  "Web sayfasına bakıyorum...",
  "Hakkında/başlık bilgilerini tarıyorum...",
  "Kaynaklardan kısa özet çıkarıyorum...",
  "Cevabı netleştiriyorum..."
];

const SITE_HINTS = {
  "youtube.com": { name: "YouTube", purpose: "kullanıcıların video izleyip içerik yüklediği bir video paylaşım platformu", company: "Google / Alphabet", year: "2005" },
  "google.com": { name: "Google", purpose: "web araması ve internet servisleri sağlamak", company: "Google / Alphabet", year: "1998" },
  "wikipedia.org": { name: "Wikipedia", purpose: "özgür ansiklopedi içeriği sağlamak", company: "Wikimedia Foundation", year: "2001" },
  "github.com": { name: "GitHub", purpose: "yazılım projelerini Git tabanlı barındırma ve işbirliği", company: "GitHub (Microsoft)", year: "2008" },
  "instagram.com": { name: "Instagram", purpose: "fotoğraf/video paylaşımı ve sosyal etkileşim", company: "Meta", year: "2010" },
  "x.com": { name: "X", purpose: "kısa gönderilerle sosyal paylaşım ve haber akışı", company: "X Corp.", year: "2006" },
  "twitter.com": { name: "Twitter (X)", purpose: "kısa gönderilerle sosyal paylaşım ve haber akışı", company: "X Corp.", year: "2006" }
};

const el = {
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
};

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function ensureUrl(value) { return /^https?:\/\//i.test(value) ? value : `https://${value}`; }

function setPanel(open) {
  el.aiPanel.classList.toggle("hidden", !open);
  el.contentGrid.classList.toggle("with-panel", open);
}

function openUrl(url, addToHistory = true) {
  if (!url) return;
  const safe = ensureUrl(url);
  el.siteFrame.src = safe;
  el.adresCubugu.value = safe;
  el.homeView.classList.add("hidden");
  el.webView.classList.remove("hidden");
  state.selectedInput = null;

  if (addToHistory) {
    state.history = state.history.slice(0, state.index + 1);
    state.history.push(safe);
    state.index = state.history.length - 1;
  }
}

function parseSite(urlCandidate) {
  let url;
  try { url = new URL(ensureUrl(urlCandidate)); } catch { return null; }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const matchKey = Object.keys(SITE_HINTS).find((key) => host.endsWith(key));
  if (matchKey) return { ...SITE_HINTS[matchKey], host, url: url.href };

  const base = host.split(".")[0] || "web sitesi";
  return {
    name: base.charAt(0).toUpperCase() + base.slice(1),
    purpose: "webde bilgi/hizmet sunmak",
    company: "kesin şirket bilgisi için site hakkında bölümü gerekir",
    year: "kuruluş yılı net değil"
  };
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

function createFallbackResults(query) {
  const q = encodeURIComponent(query);
  return [
    { title: `DuckDuckGo: ${query}`, href: `https://duckduckgo.com/?q=${q}`, snippet: "DuckDuckGo sonuç sayfasını açar." },
    { title: `Wikipedia araması: ${query}`, href: `https://tr.wikipedia.org/wiki/Özel:Arama?search=${q}`, snippet: "Wikipedia üzerinden hızlı kaynak taraması." }
  ];
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

function askAboutSite(url, customQuestion = "") {
  setPanel(true);
  if (!state.user) {
    el.aiCevap.textContent = "Bu siteyi analiz etmek için önce giriş yapman gerekiyor.";
    return;
  }
  const q = customQuestion || `Bu web sitesi ne amaçla kurulmuştur? (${url})`;
  el.aiSoru.value = q;
  el.aiForm.requestSubmit();
}

function renderResults(results, query) {
  if (!results.length) results = createFallbackResults(query);
  el.sonuclar.innerHTML = "";

  results.forEach((item) => {
    const card = document.createElement("article");
    card.className = "result-item";
    card.innerHTML = `
      <h3><a href="#">${escapeHtml(item.title)}</a></h3>
      <p>${escapeHtml(item.snippet || "Açıklama yok")}</p>
      <div class="result-actions">
        <button type="button" class="open-link">Bağlantıyı Aç</button>
        <button type="button" class="ask-link">✦ Baluk.ai'ye Sor</button>
      </div>
    `;
    card.querySelector("a").addEventListener("click", (e) => { e.preventDefault(); openUrl(item.href); });
    card.querySelector(".open-link").addEventListener("click", () => openUrl(item.href));
    card.querySelector(".ask-link").addEventListener("click", () => askAboutSite(item.href, `${item.title} sitesi ne işe yarar, kim tarafından kuruldu ve ne zaman kuruldu?`));
    el.sonuclar.appendChild(card);
  });
}

function startThinking() {
  el.aiCevap.textContent = "";
  el.thinkingBox.classList.remove("hidden");
  el.spinLogo.classList.add("active");
  document.body.classList.add("web-glow");

  let idx = 0;
  el.thinkingText.textContent = THINKING_LINES[0];
  state.thinkingTicker = setInterval(() => {
    idx = (idx + 1) % THINKING_LINES.length;
    el.thinkingText.textContent = THINKING_LINES[idx];
  }, 2400);
}

function stopThinking() {
  clearInterval(state.thinkingTicker);
  el.thinkingBox.classList.add("hidden");
  el.spinLogo.classList.remove("active");
  document.body.classList.remove("web-glow");
}

function buildAiAnswer(q) {
  const currentUrl = el.adresCubugu.value || q.match(/https?:\/\/\S+/)?.[0] || "";
  const site = parseSite(currentUrl || "example.com");
  const siteName = site?.name || "Bu site";

  if (/kaç yılında|ne zaman/i.test(q)) return `${siteName} için bulduğum bilgi: kuruluş yılı ${site.year}.`;
  if (/hangi şirket|kim tarafından/i.test(q)) return `${siteName} için şirket/kurucu bilgisi: ${site.company}.`;
  if (/amacı|ne için|ne işe yarar/i.test(q)) return `${siteName}, ${site.purpose}.`;

  return `${siteName} özeti: ${site.year} yılında kurulduğu biliniyor, ${site.company} tarafından geliştirildi/işletiliyor ve ana amacı ${site.purpose}.`;
}

function bindAgentSelectionToIframe() {
  if (!state.agentModeActive) return;

  try {
    const doc = el.siteFrame.contentDocument;
    if (!doc) throw new Error("iframe erişimi yok");

    doc.querySelectorAll("input, textarea").forEach((node) => {
      node.classList.remove("baluk-agent-target");
      node.style.outline = "1px dashed rgba(141,69,255,0.45)";
    });

    doc.addEventListener("click", (event) => {
      if (!state.agentModeActive) return;
      const t = event.target;
      if (!(t instanceof HTMLElement)) return;
      if (!(t.matches("input") || t.matches("textarea"))) return;

      event.preventDefault();
      event.stopPropagation();

      if (state.selectedInput) {
        state.selectedInput.style.outline = "1px dashed rgba(141,69,255,0.45)";
      }

      state.selectedInput = t;
      t.style.outline = "2px solid #b486ff";
      el.aiCevap.textContent = "Alan seçildi. Şimdi Baluk.ai kutusuna ne yazılacağını yazıp Gönder'e bas.";
    }, { capture: true });

    el.aiCevap.textContent = "Agent Mode açık: Form alanına tıkla ve hedefi seç.";
  } catch {
    el.aiCevap.textContent = "Agent Mode için bu sayfada seçim yapılamıyor (farklı domain güvenlik sınırı). Aynı domain sayfada deneyebilirsin.";
  }
}

function handleAgentWrite(commandText) {
  if (!state.agentModeActive) return false;

  if (!state.selectedInput) {
    el.aiCevap.textContent = "Önce bir input/textarea alanı seçmelisin. Agent Mode açık.";
    return true;
  }

  state.selectedInput.focus();
  state.selectedInput.value = commandText;
  state.selectedInput.dispatchEvent(new Event("input", { bubbles: true }));
  state.selectedInput.dispatchEvent(new Event("change", { bubbles: true }));
  el.aiCevap.textContent = `Yazıldı: "${commandText}"`;

  state.agentModeActive = false;
  state.selectedInput.style.outline = "1px dashed rgba(141,69,255,0.45)";
  state.selectedInput = null;
  return true;
}

el.siteFrame.addEventListener("load", () => {
  if (state.agentModeActive) bindAgentSelectionToIframe();
});

el.aramaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const q = el.aramaInput.value.trim();
  if (!q) return;
  el.sonuclar.innerHTML = "Aranıyor...";

  try {
    const results = await getSearchResults(q);
    renderResults(results, q);
  } catch {
    renderResults(createFallbackResults(q), q);
  }
});

el.adresCubugu.addEventListener("keydown", (e) => { if (e.key === "Enter") openUrl(el.adresCubugu.value); });
el.geriBtn.addEventListener("click", () => { if (state.index > 0) openUrl(state.history[--state.index], false); });
el.ileriBtn.addEventListener("click", () => { if (state.index < state.history.length - 1) openUrl(state.history[++state.index], false); });
el.yenileBtn.addEventListener("click", () => { if (el.siteFrame.src) el.siteFrame.src = el.siteFrame.src; });
el.newTabBtn.addEventListener("click", () => { el.homeView.classList.remove("hidden"); el.webView.classList.add("hidden"); el.adresCubugu.value = ""; state.selectedInput = null; });
el.balukPanelBtn.addEventListener("click", () => setPanel(el.aiPanel.classList.contains("hidden")));
el.closePanelBtn.addEventListener("click", () => setPanel(false));

el.loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = {
    email: document.getElementById("mail").value.trim(),
    ad: document.getElementById("ad").value.trim(),
    soyad: document.getElementById("soyad").value.trim()
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

el.plusBtn.addEventListener("click", () => el.agentMenu.classList.toggle("hidden"));
el.agentModeBtn.addEventListener("click", () => {
  state.agentModeActive = true;
  state.selectedInput = null;
  el.agentMenu.classList.add("hidden");
  bindAgentSelectionToIframe();
});

el.aiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = el.aiSoru.value.trim();
  if (!q) return;

  if (handleAgentWrite(q)) {
    el.aiSoru.value = "";
    return;
  }

  startThinking();
  clearTimeout(state.thinkingTimer);
  state.thinkingTimer = setTimeout(() => {
    stopThinking();
    el.aiCevap.textContent = buildAiAnswer(q);
    el.aiSoru.value = "";
  }, 20000);
});

el.aiSoru.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    el.aiForm.requestSubmit();
  }
});

renderAuth();
setPanel(false);
