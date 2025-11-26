const apiKeyInput = document.getElementById("apiKey");
const soruInput = document.getElementById("soruMetni");
const cevapKutusu = document.getElementById("aiCevap");
const gonderButonu = document.getElementById("soruGonder");
const apiDurum = document.getElementById("apiDurum");

const sakliAnahtar = (sessionStorage.getItem("openaiApiKey") || "").trim();
let aktifAnahtar = (window.OPENAI_API_KEY || sakliAnahtar || "").trim();

if (aktifAnahtar) {
  apiKeyInput.value = "••••••••";
  apiKeyInput.setAttribute("aria-label", "Önceden tanımlı API anahtarı kullanılıyor");
  apiKeyInput.disabled = true;
  apiDurum.textContent = "API anahtarı ayarlı. Tarayıcıya ek bir giriş gerekmez.";
} else {
  apiDurum.textContent = "Anahtarı bir kez girersen sekme boyunca saklanır ve yeniden sorulmaz.";
}

gonderButonu.addEventListener("click", soruSor);

async function soruSor() {
  const apiKey = aktifAnahtar || apiKeyInput.value.trim();
  const soru = soruInput.value.trim();

  if (!apiKey || !soru) {
    cevapKutusu.textContent = "API anahtarı ve soru gerekli.";
    return;
  }

  if (!aktifAnahtar && apiKeyInput.value.trim()) {
    aktifAnahtar = apiKeyInput.value.trim();
    sessionStorage.setItem("openaiApiKey", aktifAnahtar);
    apiKeyInput.value = "••••••••";
    apiKeyInput.disabled = true;
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
