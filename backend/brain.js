const PREMIUM_VERIFY_CODES = new Set(["8345767"]);

function buildReply(rawMessage) {
  const message = String(rawMessage || "").trim();
  const text = normalize(message);

  if (!message) {
    return "Boş mesaj aldım. Bir şey yazarsan yardımcı olayım.";
  }

  if (containsAny(text, ["merhaba", "selam", "naber", "nasilsin"])) {
    return "Merhaba! Bugün sana nasıl yardımcı olabilirim? İstersen matematik, teknoloji, günlük plan ya da genel bilgi konularından başlayabiliriz.";
  }

  if (containsAny(text, ["saat kac", "tarih", "bugun gunlerden ne"])) {
    const now = new Date();
    return `Şu an saat ${now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}. Tarih ise ${now.toLocaleDateString("tr-TR")}.`;
  }

  if (containsAny(text, ["espiri", "espri", "saka", "fıkra", "fikra"])) {
    return choose([
      "Matematik kitabı neden üzgün? Çok problemi var 😄",
      "Bilgisayar neden hasta oldu? Virüs kaptı 💻",
      "Balık neden ders çalışmaz? Okyanus bilgi zaten 😄"
    ]);
  }

  if (containsAny(text, ["openai", "youtube", "chatgpt", "gemini", "deepseek", "claude"])) {
    return "Bu platformlar farklı amaçlara odaklanan yapay zeka servisleri. İstersen bunları hız, kullanım alanı, fiyat ve doğruluk başlıklarında karşılaştırabilirim.";
  }

  return "Bu sorunu aldım. Daha net bir yanıt için isteğini bir cümle daha detaylandırabilirsin; örneğin konu + hedef + istediğin format (kısa/uzun).";
}

function verifyPremiumCode(code) {
  const normalized = String(code || "").trim();
  return PREMIUM_VERIFY_CODES.has(normalized);
}

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function containsAny(text, words) {
  return words.some((word) => text.includes(word));
}

function choose(list) {
  return list[Math.floor(Math.random() * list.length)];
}

module.exports = {
  buildReply,
  verifyPremiumCode
};
