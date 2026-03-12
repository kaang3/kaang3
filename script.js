const state = {
  history: [],
  index: -1,
  user: JSON.parse(localStorage.getItem("balukUser") || "null"),
  thinkingTimer: null,
  thinkingTicker: null,
  agentMode: false,
};

const THINKING_LINES = [
  "Baluk.ai düşünüyor...",
  "Web sayfasına bakıyorum...",
  "İçerik kaynaklarını karşılaştırıyorum...",
  "Sayfadaki ipuçlarından anlam çıkarıyorum...",
  "En iyi cevabı hazırlıyorum..."
];

const el = {
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
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ensureUrl(value) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function openUrl(url, addToHistory = true) {
  if (!url) return;
  const safe = ensureUrl(url);
  el.siteFrame.src = safe;
  el.adresCubugu.value = safe;
  el.homeView.classList.add("hidden");
  el.webView.classList.remove("hidden");

  if (addToHistory) {
    state.history = state.history.slice(0, state.index + 1);
    state.history.push(safe);
    state.index = state.history.length - 1;
  }
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
  const safeQuery = encodeURIComponent(query);
  return [
    {
      title: `DuckDuckGo'da "${query}" araması`,
      href: `https://duckduckgo.com/?q=${safeQuery}`,
      snippet: "DuckDuckGo sonuç sayfasını açar."
    },
    {
      title: `Wikipedia sonucu: ${query}`,
      href: `https://tr.wikipedia.org/wiki/Özel:Arama?search=${safeQuery}`,
      snippet: "Wikipedia üzerinden hızlı kaynak taraması."
    }
  ];
}

async function getSearchResults(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("DuckDuckGo API erişimi başarısız.");
  const data = await response.json();

  const parsed = [];

  if (data.AbstractURL) {
    parsed.push({
      title: data.Heading || query,
      href: data.AbstractURL,
      snippet: data.AbstractText || "Özet bilgi"
    });
  }

  (data.RelatedTopics || []).forEach((item) => {
    if (item.FirstURL && item.Text) {
      parsed.push({ title: item.Text.split(" - ")[0], href: item.FirstURL, snippet: item.Text });
    }
    if (Array.isArray(item.Topics)) {
      item.Topics.forEach((sub) => {
        if (sub.FirstURL && sub.Text) {
          parsed.push({ title: sub.Text.split(" - ")[0], href: sub.FirstURL, snippet: sub.Text });
        }
      });
    }
  });

  return parsed.slice(0, 8);
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
    `;
    card.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      openUrl(item.href);
    });
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
  }, 2600);
}

function stopThinking() {
  clearInterval(state.thinkingTicker);
  state.thinkingTicker = null;
  el.thinkingBox.classList.add("hidden");
  el.spinLogo.classList.remove("active");
  document.body.classList.remove("web-glow");
}

function buildAiAnswer(q) {
  if (/kaç yılında|ne zaman/i.test(q)) {
    return "Kuruluş zamanı odaklı analiz: Baluk.ai sayfada tarih/sürüm/hakkında alanlarından kuruluş yılını çıkarmaya çalışır.";
  }
  if (/hangi şirket|kim tarafından/i.test(q)) {
    return "Kurucu/şirket odaklı analiz: Baluk.ai sayfanın footer, about, iletişim ve yasal bölümlerini tarayıp sahiplik bilgisini özetler.";
  }
  if (/amacı|ne için/i.test(q)) {
    return "Amaç odaklı analiz: Baluk.ai ürün açıklamaları ve başlıkları inceleyerek sitenin ana kullanım amacını kısaca anlatır.";
  }

  const page = el.adresCubugu.value || "açık sayfa";
  return `${page} için genel analiz: kuruluş zamanı, amacı ve olası şirket bilgisini tek özetten verir.`;
}

function sendAgentFillInstruction() {
  const instruction = prompt("Seçtiğin input'a ne yazılsın?");
  if (!instruction) return;

  try {
    const doc = el.siteFrame.contentDocument;
    if (!doc) throw new Error("iframe erişimi yok");

    const target = doc.querySelector("input:focus, textarea:focus") || doc.querySelector("input, textarea");
    if (!target) {
      el.aiCevap.textContent = "Agent Mode: Bu sayfada doldurulabilir input bulunamadı.";
      return;
    }

    target.focus();
    target.value = instruction;
    target.dispatchEvent(new Event("input", { bubbles: true }));
    target.dispatchEvent(new Event("change", { bubbles: true }));
    el.aiCevap.textContent = `Agent Mode tamamlandı: Seçilen alana "${instruction}" yazıldı.`;
  } catch {
    el.aiCevap.textContent = "Agent Mode güvenlik sınırı: Bu site farklı domain olduğu için doğrudan input doldurma yapılamadı. Aynı domain sayfalarda çalışır.";
  }
}

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

el.adresCubugu.addEventListener("keydown", (e) => {
  if (e.key === "Enter") openUrl(el.adresCubugu.value);
});

el.geriBtn.addEventListener("click", () => {
  if (state.index > 0) {
    state.index -= 1;
    openUrl(state.history[state.index], false);
  }
});

el.ileriBtn.addEventListener("click", () => {
  if (state.index < state.history.length - 1) {
    state.index += 1;
    openUrl(state.history[state.index], false);
  }
});

el.yenileBtn.addEventListener("click", () => {
  if (el.siteFrame.src) el.siteFrame.src = el.siteFrame.src;
});

el.newTabBtn.addEventListener("click", () => {
  el.homeView.classList.remove("hidden");
  el.webView.classList.add("hidden");
  el.adresCubugu.value = "";
});

el.balukPanelBtn.addEventListener("click", () => el.aiPanel.classList.toggle("hidden"));
el.closePanelBtn.addEventListener("click", () => el.aiPanel.classList.add("hidden"));

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

el.plusBtn.addEventListener("click", () => {
  el.agentMenu.classList.toggle("hidden");
});

el.agentModeBtn.addEventListener("click", () => {
  state.agentMode = true;
  el.agentMenu.classList.add("hidden");
  el.aiCevap.textContent = "Agent Mode aktif. Hedef input alanına tıkla, sonra komut verilecek.";
  sendAgentFillInstruction();
});

el.aiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = el.aiSoru.value.trim();
  if (!q) return;

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
