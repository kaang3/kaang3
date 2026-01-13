const STORAGE_KEY = "gaiState";
const sohbet = document.getElementById("sohbet");
const durum = document.getElementById("durum");
const form = document.getElementById("gaiForm");
const girdi = document.getElementById("girdi");
const temizleBtn = document.getElementById("temizle");

const varsayilanDurum = {
  history: [],
  decisions: [],
  outcomes: [],
  weights: {
    clarity: 0.6,
    context: 0.4
  },
  lastTopic: null,
  lastAction: null,
  pendingAction: null,
  variationIndex: 0,
  successPatterns: [],
  failurePatterns: []
};

const sozluk = {
  risk: ["şifre", "hack", "zararlı", "dolandır", "suistimal"],
  acil: ["acil", "hemen", "şimdi"],
  duygu: ["üzgün", "mutlu", "kızgın", "heyecan", "stres"],
  onceki: ["önce", "az önce", "değiştir", "devam", "bağla", "daha"],
  selam: ["merhaba", "selam", "hey", "hi", "hello", "günaydın", "iyi akşamlar"],
  onay: ["evet", "olur", "tamam", "ok"],
  red: ["hayır", "yok", "istemem"],
  yetenek: ["neler yaparsın", "ne yapabilirsin", "yetenek", "yapabildiklerin"],
  matematik: ["matematik", "hesapla", "işlem"],
  siir: ["şiir", "siir"],
  mantik: ["mantık", "mantik"],
  oneri: ["buna", "şuna", "böyle", "şöyle"]
};

const niyetHaritasi = [
  { etiket: "bilgi", ipucu: ["nedir", "nasıl", "neden", "ne zaman", "hangi"] },
  { etiket: "talep", ipucu: ["oluştur", "yap", "yaz", "özetle", "planla", "hazırla"] },
  { etiket: "duygu", ipucu: ["hissediyorum", "benim için", "zor", "stres"] }
];

const cevapHavuzu = {
  selam: ["Merhaba! Nasıl yardımcı olayım?", "Selam! Ne yapalım?", "Merhaba! Kısa bir istek yaz."] ,
  bilgi: ["Kısa cevap: {cevap}.", "Özet: {cevap}.", "Net: {cevap}."] ,
  talep: ["Hemen: {cevap}.", "Tamam: {cevap}.", "Şu şekilde: {cevap}."] ,
  duygu: ["Anlıyorum. {cevap}.", "Not ettim. {cevap}.", "Buradayım. {cevap}."] ,
  risk: ["Bu konuda yardımcı olamam.", "Bu istek riskli.", "Bunu yapamam."] ,
  belirsiz: ["Netleştir: {cevap}.", "Kısa odak: {cevap}.", "Tek bir hedef belirt."] ,
  matematik: ["Cevap: {cevap}.", "Hemen: {cevap}.", "Sonuç: {cevap}."] ,
  siir: ["Şiir: {cevap}", "Kısa şiir: {cevap}", "İşte şiir: {cevap}"] ,
  model: ["GPT-5.2-Codex, OpenAI tarafından geliştirildi.", "Modelim: GPT-5.2-Codex (OpenAI).", "OpenAI tarafından üretilen GPT-5.2-Codex."]
};

function yukleDurum() {
  const sakli = localStorage.getItem(STORAGE_KEY);
  if (!sakli) {
    return structuredClone(varsayilanDurum);
  }
  try {
    return JSON.parse(sakli);
  } catch (err) {
    return structuredClone(varsayilanDurum);
  }
}

function kaydetDurum(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalize(text) {
  return text.toLowerCase().trim();
}

function kelimeVarMi(text, kelimeler) {
  return kelimeler.some((kelime) => text.includes(kelime));
}

function niyetBul(text) {
  for (const niyet of niyetHaritasi) {
    if (kelimeVarMi(text, niyet.ipucu)) {
      return niyet.etiket;
    }
  }
  return "belirsiz";
}

function konuBul(text) {
  const kelimeler = text.split(" ").filter(Boolean);
  return kelimeler.length ? kelimeler[0] : null;
}

function agirlikliSecim(skorlar) {
  return skorlar.sort((a, b) => b.skor - a.skor)[0]?.etiket || "belirsiz";
}

function oncekiBasariliMi(state, cevap) {
  return state.successPatterns.some((p) => cevap.includes(p));
}

function guncelleUyum(state, cevap, basarili) {
  if (basarili) {
    state.successPatterns.push(cevap);
    state.failurePatterns = state.failurePatterns.filter((p) => p !== cevap);
  } else {
    state.failurePatterns.push(cevap);
    state.successPatterns = state.successPatterns.filter((p) => p !== cevap);
  }
}

function seciliCevap(state, kategori, degisken) {
  const havuz = cevapHavuzu[kategori] || cevapHavuzu.belirsiz;
  const secim = havuz[state.variationIndex % havuz.length];
  state.variationIndex += 1;
  return degisken ? secim.replace("{cevap}", degisken) : secim;
}

function matematikCoz(text) {
  const temiz = text.replace(/[^0-9+\-*/(). ]/g, "");
  if (!/[0-9]/.test(temiz)) return null;
  if (/[*+\-/.]{3,}/.test(temiz)) return null;
  try {
    const sonuc = Function(`"use strict"; return (${temiz})`)();
    if (!Number.isFinite(sonuc)) return null;
    return sonuc;
  } catch (err) {
    return null;
  }
}

function siirUret(theme, index) {
  const temalar = [theme || "mavi-beyaz", "gece", "deniz", "ışık"];
  const secili = temalar[index % temalar.length];
  const satirlar = [
    `Maviye açılır ${secili} bir kapı`,
    `Beyaz bir çizgi, sessiz bir akı`,
    `Zihnimde dolaşır kısa bir rüzgar`,
    `Gai söyler: ${secili} kadar saf bir karar`
  ];
  return satirlar.join(" / ");
}

function niyetAnaliz(state, input) {
  const text = normalize(input);
  const riskli = kelimeVarMi(text, sozluk.risk);
  const acil = kelimeVarMi(text, sozluk.acil);
  const oncekiBag = kelimeVarMi(text, sozluk.onceki);
  const selam = kelimeVarMi(text, sozluk.selam);
  const onay = kelimeVarMi(text, sozluk.onay);
  const red = kelimeVarMi(text, sozluk.red);
  const niyet = niyetBul(text);
  const konu = konuBul(text);

  const skorlar = [
    { etiket: "risk", skor: riskli ? 1 : 0 },
    { etiket: "belirsiz", skor: niyet === "belirsiz" ? 0.55 : 0.1 },
    { etiket: niyet, skor: niyet !== "belirsiz" ? 0.7 : 0.2 }
  ];

  const bagSkoru = oncekiBag && state.lastTopic ? 0.3 : 0;
  const acilSkoru = acil ? 0.2 : 0;
  skorlar.forEach((s) => {
    if (s.etiket !== "risk") {
      s.skor += bagSkoru + acilSkoru;
    }
  });

  return {
    karar: agirlikliSecim(skorlar),
    niyet,
    konu,
    riskli,
    oncekiBag,
    selam,
    onay,
    red,
    text
  };
}

function cevapUret(state, input) {
  const analiz = niyetAnaliz(state, input);

  if (analiz.riskli) {
    return {
      cevap: seciliCevap(state, "risk"),
      karar: analiz
    };
  }

  if (analiz.onay && state.pendingAction) {
    const sonuc = state.pendingAction.handler();
    state.pendingAction = null;
    return sonuc;
  }

  if (analiz.red && state.pendingAction) {
    state.pendingAction = null;
    return { cevap: "Tamam, başka bir şey iste.", karar: analiz };
  }

  if (analiz.selam) {
    return {
      cevap: seciliCevap(state, "selam"),
      karar: analiz
    };
  }

  const modelSorusu = [
    "seni kim yaptı",
    "hangi model",
    "kullandığın dil modeli",
    "modelin ne",
    "hangi dil modeli"
  ];

  if (modelSorusu.some((kalip) => analiz.text.includes(kalip))) {
    return {
      cevap: seciliCevap(state, "model"),
      karar: analiz
    };
  }

  if (kelimeVarMi(analiz.text, sozluk.yetenek)) {
    return {
      cevap: "Matematik çözebilirim, şiir yazabilirim, özet/plan çıkarabilirim, mantık sorusu çözebilirim.",
      karar: { ...analiz, karar: "bilgi" }
    };
  }

  if (kelimeVarMi(analiz.text, sozluk.siir)) {
    const tema = analiz.text.includes("mavi") || analiz.text.includes("beyaz") ? "mavi-beyaz" : null;
    const siir = siirUret(tema, state.variationIndex);
    return {
      cevap: seciliCevap(state, "siir", siir),
      karar: { ...analiz, karar: "talep" }
    };
  }

  const math = matematikCoz(analiz.text);
  if (math !== null) {
    return {
      cevap: seciliCevap(state, "matematik", math.toString()),
      karar: { ...analiz, karar: "bilgi" }
    };
  }

  if (kelimeVarMi(analiz.text, sozluk.matematik)) {
    return {
      cevap: "Hangi işlemi çözeyim? Örn: 12*(3+2)",
      karar: { ...analiz, karar: "talep" }
    };
  }

  if (kelimeVarMi(analiz.text, sozluk.mantik)) {
    return {
      cevap: "Mantık sorunu yaz, kısa ve net çözerim.",
      karar: { ...analiz, karar: "talep" }
    };
  }

  if (analiz.oncekiBag && state.lastAction) {
    const sonuc = state.lastAction();
    return {
      ...sonuc,
      karar: { ...analiz, karar: "talep" }
    };
  }

  if (analiz.karar === "belirsiz") {
    if (state.lastAction && kelimeVarMi(analiz.text, sozluk.oneri)) {
      state.pendingAction = { handler: state.lastAction };
      return {
        cevap: "Önceki işi devam ettireyim mi? (Evet/Hayır)",
        karar: analiz
      };
    }
    state.pendingAction = {
      handler: () => ({
        cevap: "Ne üretmemi istersin: şiir, matematik, özet, plan?",
        karar: analiz
      })
    };
    return {
      cevap: "Ne yapmamı istersin? (şiir / matematik / özet / plan)",
      karar: analiz
    };
  }

  return {
    cevap: seciliCevap(state, analiz.karar, "Bunu kısa yapabilirim"),
    karar: analiz
  };
}

function mesajEkle(icerik, tip) {
  const div = document.createElement("div");
  div.className = `message ${tip}`;
  div.textContent = icerik;
  sohbet.appendChild(div);
  sohbet.scrollTop = sohbet.scrollHeight;
}

function sohbetiYukle() {
  const state = yukleDurum();
  if (!state.history.length) return;
  sohbet.innerHTML = "";
  state.history.forEach((item) => {
    mesajEkle(item.text, item.role);
  });
}

function sohbeteEkle(state, role, text, meta = {}) {
  state.history.push({ role, text, meta });
  if (state.history.length > 60) {
    state.history.shift();
  }
}

function durumGuncelle(text) {
  durum.textContent = text;
}

window.addEventListener("load", () => {
  sohbetiYukle();
});

temizleBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  sohbet.innerHTML = "";
  mesajEkle("Sohbet temizlendi.", "bot");
  durumGuncelle("Hazır");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const deger = girdi.value.trim();
  if (!deger) return;

  mesajEkle(deger, "user");
  girdi.value = "";

  const state = yukleDurum();
  sohbeteEkle(state, "user", deger);

  const sonuc = cevapUret(state, deger);
  const botCevap = sonuc.cevap;

  state.decisions.push(sonuc.karar);
  state.outcomes.push(botCevap);
  state.lastTopic = sonuc.karar.konu || state.lastTopic;
  state.weights.context = Math.min(0.8, state.weights.context + 0.02);
  state.weights.clarity = Math.max(0.2, state.weights.clarity - 0.01);

  state.lastAction = () => ({
    cevap: botCevap,
    karar: sonuc.karar
  });

  const basarili = !oncekiBasariliMi(state, botCevap);
  guncelleUyum(state, botCevap, basarili);

  sohbeteEkle(state, "bot", botCevap, { karar: sonuc.karar });
  kaydetDurum(state);

  durumGuncelle(sonuc.karar.riskli ? "Kısıtlı" : "Aktif");
  setTimeout(() => {
    mesajEkle(botCevap, "bot");
  }, 160);
});
