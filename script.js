const STORAGE_KEY = "gaiState";
const sohbet = document.getElementById("sohbet");
const durum = document.getElementById("durum");
const form = document.getElementById("gaiForm");
const girdi = document.getElementById("girdi");

const varsayilanDurum = {
  history: [],
  decisions: [],
  outcomes: [],
  weights: {
    clarity: 0.6,
    context: 0.4
  },
  lastTopic: null,
  successPatterns: [],
  failurePatterns: []
};

const anahtarSozluk = {
  risk: ["şifre", "hack", "zararlı", "dolandır", "suistimal"],
  acil: ["acil", "hemen", "şimdi"],
  duygu: ["üzgün", "mutlu", "kızgın", "heyecan"],
  onceki: ["önce", "az önce", "değiştir", "devam", "bağla"]
};

const niyetHaritasi = [
  { etiket: "bilgi", ipucu: ["nedir", "nasıl", "neden", "ne zaman", "hangi"] },
  { etiket: "talep", ipucu: ["oluştur", "yap", "yaz", "özetle", "planla"] },
  { etiket: "duygu", ipucu: ["hissediyorum", "benim için", "zor", "stres"] }
];

const cevapHavuzu = {
  bilgi: ["Kısa cevap: {cevap}.", "Özet: {cevap}.", "Net: {cevap}."] ,
  talep: ["Tamam. {cevap}.", "Şu şekilde: {cevap}.", "Hemen: {cevap}."] ,
  duygu: ["Anlıyorum. {cevap}.", "Not ettim. {cevap}.", "Duydum. {cevap}."] ,
  risk: ["Bu konuda yardımcı olamam.", "Bu istek riskli.", "Bunu yapamam."] ,
  belirsiz: ["Netleştir: {cevap}.", "Kısa odak: {cevap}.", "Tek bir hedef belirt."]
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

function kararVer(state, input) {
  const text = normalize(input);
  const riskli = kelimeVarMi(text, anahtarSozluk.risk);
  const acil = kelimeVarMi(text, anahtarSozluk.acil);
  const oncekiBag = kelimeVarMi(text, anahtarSozluk.onceki);
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

  const karar = agirlikliSecim(skorlar);

  return {
    karar,
    niyet,
    konu,
    riskli,
    oncekiBag
  };
}

function cevapUret(state, input) {
  const sonuc = kararVer(state, input);
  const text = normalize(input);
  const onceki = state.history[state.history.length - 1];
  const bag = sonuc.oncekiBag && onceki ? `Önceki: ${onceki.input}` : "";

  if (sonuc.riskli) {
    return {
      cevap: cevapHavuzu.risk[Math.floor(Math.random() * cevapHavuzu.risk.length)],
      karar: sonuc
    };
  }

  let kisaCevap = "";
  if (sonuc.karar === "belirsiz") {
    kisaCevap = "Tek bir niyet belirt";
  } else if (sonuc.karar === "bilgi") {
    kisaCevap = `${bag ? bag + ". " : ""}Kısa bilgi veriyorum`;
  } else if (sonuc.karar === "talep") {
    kisaCevap = `${bag ? bag + ". " : ""}İstediğini daralt`;
  } else if (sonuc.karar === "duygu") {
    kisaCevap = "Buradayım";
  } else {
    kisaCevap = "Devam et";
  }

  const havuz = cevapHavuzu[sonuc.karar] || cevapHavuzu.belirsiz;
  const secilen = havuz[Math.floor(Math.random() * havuz.length)];
  const cevap = secilen.replace("{cevap}", kisaCevap);

  const basarili = !oncekiBasariliMi(state, cevap);
  guncelleUyum(state, cevap, basarili);

  return {
    cevap,
    karar: sonuc
  };
}

function mesajEkle(icerik, tip) {
  const div = document.createElement("div");
  div.className = `message ${tip}`;
  div.textContent = icerik;
  sohbet.appendChild(div);
  sohbet.scrollTop = sohbet.scrollHeight;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const deger = girdi.value.trim();
  if (!deger) return;

  mesajEkle(deger, "user");
  girdi.value = "";

  const state = yukleDurum();
  const sonuc = cevapUret(state, deger);

  state.history.push({
    input: deger,
    karar: sonuc.karar.karar,
    niyet: sonuc.karar.niyet,
    risk: sonuc.karar.riskli,
    outcome: sonuc.cevap
  });
  state.decisions.push(sonuc.karar);
  state.outcomes.push(sonuc.cevap);
  state.lastTopic = sonuc.karar.konu || state.lastTopic;
  state.weights.context = Math.min(0.8, state.weights.context + 0.02);
  state.weights.clarity = Math.max(0.2, state.weights.clarity - 0.01);

  kaydetDurum(state);

  durum.textContent = sonuc.karar.riskli ? "Kısıtlı" : "Aktif";
  setTimeout(() => {
    mesajEkle(sonuc.cevap, "bot");
  }, 200);
});
