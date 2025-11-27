const apiKeyInput = document.getElementById("apiKey");
const soruInput = document.getElementById("soruMetni");
const cevapKutusu = document.getElementById("aiCevap");
const gonderButonu = document.getElementById("soruGonder");
const apiDurum = document.getElementById("apiDurum");
const sifirlaButonu = document.getElementById("anahtarSifirla");

let aktifAnahtar = "";
let anahtarKaynak = "";
let dosyaKaynak = "";

initAnahtar();

async function initAnahtar() {
  await (window.__anahtarDosyaSozu || Promise.resolve());

  dosyaKaynak = (window.__anahtarDosyasi || "").trim();
  const baglantiAnahtar = alBaglantiAnahtari();
  const sabitAnahtar = (window.OPENAI_API_KEY || "").trim();
  const sakliAnahtar = (sessionStorage.getItem("openaiApiKey") || "").trim();

  aktifAnahtar = (sabitAnahtar || sakliAnahtar || baglantiAnahtar || "").trim();
  anahtarKaynak = aktifAnahtar
    ? sabitAnahtar
      ? dosyaKaynak === "key.example.js"
        ? "ornekDosya"
        : "dosya"
      : sakliAnahtar
        ? "hafiza"
        : baglantiAnahtar
          ? "baglanti"
          : ""
    : "";

  if (baglantiAnahtar && !sakliAnahtar && !sabitAnahtar) {
    sessionStorage.setItem("openaiApiKey", baglantiAnahtar);
    anahtarKaynak = "baglanti";
    aktifAnahtar = baglantiAnahtar;
    temizleBaglantiAnahtari();
  }

  guncelleAnahtarDurumu();

  gonderButonu.addEventListener("click", soruSor);
  sifirlaButonu.addEventListener("click", anahtariSifirla);
}

async function soruSor() {
  const apiKey = aktifAnahtar || apiKeyInput.value.trim();
  const soru = soruInput.value.trim();

  if (!apiKey || !soru) {
    cevapKutusu.textContent = "API anahtarı ve soru gerekli.";
    return;
  }

  if (!aktifAnahtar && apiKeyInput.value.trim()) {
    aktifAnahtar = apiKeyInput.value.trim();
    anahtarKaynak = "hafiza";
    sessionStorage.setItem("openaiApiKey", aktifAnahtar);
    guncelleAnahtarDurumu();
    apiDurum.textContent = "Anahtar bu sekme boyunca hatırlanacak.";
  }

  cevapKutusu.textContent = "Bekleniyor...";
  gonderButonu.disabled = true;

  try {
    const yanit = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: soru }],
        temperature: 0.7,
      }),
    });

    const veri = await yanit.json();

    if (!yanit.ok) {
      throw new Error(veri?.error?.message || "API hatası");
    }

    const mesaj = veri?.choices?.[0]?.message?.content?.trim();
    cevapKutusu.textContent = mesaj || "Cevap alınamadı.";
  } catch (err) {
    console.error(err);
    cevapKutusu.textContent = "Bağlantı kurulamadı. Anahtarını ve interneti kontrol et.";
  } finally {
    gonderButonu.disabled = false;
  }
}

function guncelleAnahtarDurumu() {
  const anahtarVar = Boolean(aktifAnahtar);
  apiKeyInput.value = anahtarVar ? "••••••••" : "";
  apiKeyInput.setAttribute(
    "aria-label",
    anahtarVar ? "Önceden tanımlı API anahtarı kullanılıyor" : "OpenAI API anahtarını yaz"
  );
  apiKeyInput.disabled = anahtarVar;
  sifirlaButonu.disabled = !anahtarVar;
  apiDurum.textContent = anahtarVar
    ? anahtarKaynak === "dosya"
      ? "Anahtar key.js içinden alındı; Sıfırla'ya basarak değiştirebilirsin."
      : anahtarKaynak === "ornekDosya"
        ? "Anahtar key.example.js içinden alındı; key.js olarak kaydedersen hazır kullanılır."
        : anahtarKaynak === "baglanti"
          ? "Anahtar bağlantıdan alındı, adres çubuğu temizlendi ve sekme boyunca hatırlanacak."
          : "Anahtar bu sekme boyunca hatırlanıyor. Sıfırla'ya basıp yeni anahtar girebilirsin."
    : "Anahtarı bir kez girersen sekme boyunca saklanır veya key.js ile otomatik yüklenir.";
}

function anahtariSifirla() {
  aktifAnahtar = "";
  anahtarKaynak = "";
  sessionStorage.removeItem("openaiApiKey");
  guncelleAnahtarDurumu();
  cevapKutusu.textContent = "Anahtar temizlendi. Yeni anahtarı girip sorunu yollayabilirsin.";
}

function alBaglantiAnahtari() {
  const url = new URL(window.location.href);
  const sorguAnahtar = (url.searchParams.get("key") || "").trim();

  if (sorguAnahtar) {
    return sorguAnahtar;
  }

  const hashEslesme = url.hash.match(/key=([^&]+)/);
  return hashEslesme ? decodeURIComponent(hashEslesme[1]).trim() : "";
}

function temizleBaglantiAnahtari() {
  const url = new URL(window.location.href);
  url.searchParams.delete("key");

  if (url.hash.includes("key=")) {
    url.hash = "";
  }

  history.replaceState({}, "", url);
}
