function kelimePuanla(metin, anahtarlar) {
  let puan = 0;
  for (const { kelime, agirlik } of anahtarlar) {
    if (metin.includes(kelime)) puan += agirlik;
  }
  return puan;
}

function detaySeviyesiMetni(detay) {
  if (detay <= 2) return "Hızlı cevap:";
  if (detay >= 5) return "Ayrıntılı rehber:";
  return "Özet:";
}

function tonMetni(ton) {
  return {
    dengeli: "Ton: dengeli ve net.",
    resmi: "Ton: resmî ve profesyonel.",
    samimi: "Ton: samimi ve sohbet tarzında."
  }[ton];
}

function niyetleriBelirle(kucuk) {
  const niyetler = {
    kod: kelimePuanla(kucuk, [
      { kelime: "kod", agirlik: 2 },
      { kelime: "javascript", agirlik: 2 },
      { kelime: "html", agirlik: 1 },
      { kelime: "css", agirlik: 1 },
      { kelime: "hata", agirlik: 1 },
      { kelime: "error", agirlik: 2 },
      { kelime: "bug", agirlik: 2 },
      { kelime: "function", agirlik: 1 },
      { kelime: "api", agirlik: 1 }
    ]) >= 2,
    ozet: kelimePuanla(kucuk, [
      { kelime: "özet", agirlik: 2 },
      { kelime: "kısalt", agirlik: 2 },
      { kelime: "madde", agirlik: 1 },
      { kelime: "öğren", agirlik: 1 }
    ]) >= 2,
    plan: kelimePuanla(kucuk, [
      { kelime: "plan", agirlik: 2 },
      { kelime: "adım", agirlik: 1 },
      { kelime: "yol haritası", agirlik: 2 },
      { kelime: "nasıl", agirlik: 1 },
      { kelime: "todo", agirlik: 2 }
    ]) >= 2,
    fikir: kelimePuanla(kucuk, [
      { kelime: "fikir", agirlik: 2 },
      { kelime: "ilham", agirlik: 2 },
      { kelime: "hikaye", agirlik: 1 },
      { kelime: "senaryo", agirlik: 1 },
      { kelime: "konsept", agirlik: 1 }
    ]) >= 2,
    oyun: kelimePuanla(kucuk, [
      { kelime: "oyun", agirlik: 2 },
      { kelime: "npc", agirlik: 2 },
      { kelime: "taktik", agirlik: 1 },
      { kelime: "görev", agirlik: 1 }
    ]) >= 2,
    soru: kucuk.includes("?") || kelimePuanla(kucuk, [
      { kelime: "nedir", agirlik: 1 },
      { kelime: "neden", agirlik: 1 },
      { kelime: "açıkla", agirlik: 2 }
    ]) >= 2,
    yaz: kelimePuanla(kucuk, [
      { kelime: "yaz", agirlik: 1 },
      { kelime: "metin", agirlik: 1 },
      { kelime: "mail", agirlik: 1 },
      { kelime: "blog", agirlik: 1 },
      { kelime: "taslak", agirlik: 1 }
    ]) >= 2
  };

  const secili = Object.entries(niyetler).filter(([, deger]) => deger).map(([anahtar]) => anahtar);
  return secili.length ? secili : ["genel"];
}

function cevapOlustur(metin, ton, detay) {
  const kucuk = metin.toLowerCase();
  const niyetler = niyetleriBelirle(kucuk);
  const baslik = detaySeviyesiMetni(detay);
  const tonBilgisi = tonMetni(ton);
  const kisalt = detay <= 2;

  const maddeler = [];

  if (niyetler.includes("kod")) {
    maddeler.push("Problemi 3-4 adıma böl ve hatayı yeniden üret.");
    maddeler.push("Kısa örnek: giriş → işlem → çıktı sırasını doğrula.");
    maddeler.push("Edge case: boş veri, yanlış tür, ağ yok senaryolarını ekle.");
  }

  if (niyetler.includes("ozet")) {
    maddeler.push("Ana fikir, destekleyici 2 nokta ve sonucu kısaca ver.");
    maddeler.push("Gereksiz tekrarları çıkar, rakam/isimleri koru.");
  }

  if (niyetler.includes("plan")) {
    maddeler.push("Hedefi 3 aşamaya ayır: Hazırlık → Uygulama → Kontrol.");
    maddeler.push("Her aşama için en fazla 3 görev ve tahmini süre ekle.");
  }

  if (niyetler.includes("fikir")) {
    maddeler.push("3 alternatif üret: güvenli, yaratıcı, deneysel.");
    maddeler.push("Her alternatif için 1 güçlü ve 1 riskli yan belirt.");
  }

  if (niyetler.includes("yaz")) {
    maddeler.push("Kısa giriş, gövde, kapanış sırası kullan.");
    maddeler.push("Ton seçimine göre hitap ve kapanış cümlesini ayarla.");
  }

  if (niyetler.includes("oyun")) {
    maddeler.push("NPC durumu: sağlık, mesafe, kaynak, moral kontrol et.");
    maddeler.push("Duruma göre savun/taarruz/kaçın ve çevreyi kullan.");
  }

  if (niyetler.includes("soru")) {
    maddeler.push("Tanım → neden → nasıl uygulanır sırasıyla açıkla.");
    maddeler.push("Kısa örnek veya benzetme ekle.");
  }

  if (niyetler.includes("genel")) {
    maddeler.push("Kısa bir cevap, ardından takip sorusu önerisi sun.");
    maddeler.push("Gerekiyorsa yapılacaklar veya örnek ekle.");
  }

  const satinir = maddeler.filter(Boolean);
  const govde = kisalt ? satinir.join(" | ") : "• " + satinir.join("\n• ");
  const niyetEtiketi = `Mod(lar): ${niyetler.join(", ")}`;

  return `${baslik} ${tonBilgisi}\n${niyetEtiketi}\n${govde}`;
}

function formHazirla() {
  const form = document.getElementById("aiForm");
  const sonuc = document.getElementById("sonuc");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const metin = document.getElementById("girdi").value.trim();
    if (!metin) return;

    const ton = document.getElementById("ton").value;
    const detay = Number(document.getElementById("detay").value) || 3;

    const cevap = cevapOlustur(metin, ton, detay);
    sonuc.textContent = cevap;
  });
}

document.addEventListener("DOMContentLoaded", formHazirla);
