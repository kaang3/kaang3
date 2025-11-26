const apiKeyInput = document.getElementById("apiKey");
const soruInput = document.getElementById("soruMetni");
const cevapKutusu = document.getElementById("aiCevap");
const gonderButonu = document.getElementById("soruGonder");

gonderButonu.addEventListener("click", soruSor);

async function soruSor() {
  const apiKey = apiKeyInput.value.trim();
  const soru = soruInput.value.trim();

  if (!apiKey || !soru) {
    cevapKutusu.textContent = "API anahtarı ve soru gerekli.";
    return;
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
