const state = {
  history: [],
  index: -1,
  user: JSON.parse(localStorage.getItem("balukUser") || "null"),
};

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
  loginForm: document.getElementById("loginForm"),
  authArea: document.getElementById("authArea"),
  assistantArea: document.getElementById("assistantArea"),
  welcomeText: document.getElementById("welcomeText"),
  aiForm: document.getElementById("aiForm"),
  aiSoru: document.getElementById("aiSoru"),
  thinking: document.getElementById("thinking"),
  aiCevap: document.getElementById("aiCevap"),
};

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
    el.welcomeText.textContent = `Hoş geldin ${state.user.ad} ${state.user.soyad}`;
  } else {
    el.authArea.classList.remove("hidden");
    el.assistantArea.classList.add("hidden");
  }
}

el.aramaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const q = el.aramaInput.value.trim();
  if (!q) return;

  el.sonuclar.innerHTML = "Aranıyor...";
  try {
    const response = await fetch(`https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const rows = [...doc.querySelectorAll(".result")].slice(0, 7);

    if (!rows.length) {
      el.sonuclar.innerHTML = "Sonuç bulunamadı.";
      return;
    }

    el.sonuclar.innerHTML = "";
    rows.forEach((row) => {
      const link = row.querySelector(".result__a");
      if (!link) return;
      const title = link.textContent;
      const href = link.getAttribute("href");
      const snippet = row.querySelector(".result__snippet")?.textContent || "Açıklama yok.";

      const card = document.createElement("article");
      card.className = "result-item";
      card.innerHTML = `<h3><a href="#">${title}</a></h3><p>${snippet}</p>`;
      card.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        openUrl(href);
      });
      el.sonuclar.appendChild(card);
    });
  } catch {
    el.sonuclar.innerHTML = "Arama servisine erişilemedi. Tekrar dene.";
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

el.balukPanelBtn.addEventListener("click", () => {
  el.aiPanel.classList.toggle("hidden");
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

el.aiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = el.aiSoru.value.trim();
  if (!q) return;

  el.aiCevap.textContent = "";
  el.thinking.classList.remove("hidden");
  document.body.style.boxShadow = "inset 0 0 80px rgba(141,69,255,0.5)";

  setTimeout(() => {
    el.thinking.classList.add("hidden");
    document.body.style.boxShadow = "none";

    if (/kaç yılında|ne zaman/i.test(q)) {
      el.aiCevap.textContent = "Siteyi analiz ederek kuruluş yılına odaklanılmış bir özet hazırlanır.";
    } else if (/hangi şirket|kim tarafından/i.test(q)) {
      el.aiCevap.textContent = "Siteyi sahiplik açısından tarayıp şirket / kurucu bilgisini özetler.";
    } else if (/amacı|ne için/i.test(q)) {
      el.aiCevap.textContent = "Siteyi kullanım amacı açısından yorumlayıp kısa bir özet verir.";
    } else {
      const page = el.adresCubugu.value || "açık bir sayfa";
      el.aiCevap.textContent = `${page} için genel analiz: kuruluş, amaç ve şirket bilgilerini tek cevapta özetler.`;
    }
  }, 20000);
});

renderAuth();
