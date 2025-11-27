function kelimePuanla(metin, anahtarlar) {
  let puan = 0;
  for (const { kelime, agirlik } of anahtarlar) {
    if (metin.includes(kelime)) puan += agirlik;
  }
  return puan;
}

function detaySeviyesiMetni(detay) {
  if (detay <= 2) return "Kısa yanıt:";
  if (detay >= 5) return "Ayrıntılı plan:";
  return "Özet:";
}

function kararVerSenaryo(metin, stil, detay) {
  const kucuk = metin.toLowerCase();

  const saglikDusuk = kelimePuanla(kucuk, [
    { kelime: "%10", agirlik: 2 },
    { kelime: "%20", agirlik: 2 },
    { kelime: "düşük", agirlik: 1 },
    { kelime: "yaralı", agirlik: 1 },
    { kelime: "kan", agirlik: 1 }
  ]) > 1;

  const mesafeYakin = kelimePuanla(kucuk, [
    { kelime: "5 m", agirlik: 2 },
    { kelime: "10 m", agirlik: 2 },
    { kelime: "yakın", agirlik: 1 },
    { kelime: "içeride", agirlik: 1 }
  ]) > 1;

  const mermiAz = kelimePuanla(kucuk, [
    { kelime: "cephane yok", agirlik: 3 },
    { kelime: "mermi bitti", agirlik: 3 },
    { kelime: "az", agirlik: 1 },
    { kelime: "bitiyor", agirlik: 1 }
  ]) > 1;

  const moralYuksek = kelimePuanla(kucuk, [
    { kelime: "morali yüksek", agirlik: 2 },
    { kelime: "özgüvenli", agirlik: 1 },
    { kelime: "hazır", agirlik: 1 },
    { kelime: "güçlü", agirlik: 1 }
  ]) > 1;

  const aksiyonlar = [];

  if (saglikDusuk && mesafeYakin) {
    aksiyonlar.push("Derhal siper al, duman at ve görüş hattını kes");
  } else if (saglikDusuk) {
    aksiyonlar.push("Siper bul, destek bekle, sağlık topla");
  }

  if (mermiAz) {
    aksiyonlar.push("Yakın çatışmadan kaçın, mühimmat veya alternatif silah bul");
  } else {
    aksiyonlar.push("Kaynak yeterli, kontrollü baskı kur");
  }

  if (mesafeYakin && !mermiAz) {
    aksiyonlar.push("Kısa süreli saldırı + flank dene");
  } else if (!mesafeYakin) {
    aksiyonlar.push("Mesafe koru, keşif yap ve tuzak kur");
  }

  if (moralYuksek) {
    aksiyonlar.push("Ekip moralini kullan, agresif tempo tut");
  } else {
    aksiyonlar.push("Morali yükseltmek için güvenli ilerle");
  }

  const stilEtkisi = {
    dengeli: "Risk ve güvenlik dengeleniyor.",
    agresif: "Daha yüksek tempo ve girişken hamleler öncelikli.",
    defansif: "Kaybı azalt, hayatta kalma öncelikli." 
  }[stil];

  const detayEtiketi = detaySeviyesiMetni(detay);
  const kisalt = detay <= 2;

  const metinParcalari = aksiyonlar.filter(Boolean);
  const eylem = kisalt ? metinParcalari.join(" | ") : "• " + metinParcalari.join("\n• ");

  return `${detayEtiketi} ${stilEtkisi}\n${eylem}`;
}

function formHazirla() {
  const form = document.getElementById("aiForm");
  const sonuc = document.getElementById("sonuc");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const metin = document.getElementById("girdi").value.trim();
    if (!metin) return;

    const stil = document.getElementById("stil").value;
    const detay = Number(document.getElementById("detay").value) || 3;

    const cevap = kararVerSenaryo(metin, stil, detay);
    sonuc.textContent = cevap;
  });
}

document.addEventListener("DOMContentLoaded", formHazirla);
