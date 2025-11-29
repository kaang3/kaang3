const sohbetAlani = document.getElementById("sohbetAlani");
const girdi = document.getElementById("girdi");
const gonderBtn = document.getElementById("gonderBtn");
const resetBtn = document.getElementById("resetBtn");
const sonuc = document.getElementById("sonuc");
const hesapKimlik = document.getElementById("hesapKimlik");
const oturumButon = document.getElementById("oturumButon");
const modal = document.getElementById("oturumModal");
const modalKaydet = document.getElementById("modalKaydet");
const modalIptal = document.getElementById("modalIptal");
const adInput = document.getElementById("ad");
const soyadInput = document.getElementById("soyad");

function balonEkle(tip, metin) {
  const kutu = document.createElement("div");
  kutu.className = `balon ${tip}`;
  kutu.textContent = metin;
  sohbetAlani.appendChild(kutu);
  sohbetAlani.scrollTop = sohbetAlani.scrollHeight;
}

function sohbetiBaslat() {
  sohbetAlani.innerHTML = "";
  balonEkle("asistan", "Merhaba, ben GAI 1.0. Sorularını buradan bana yazabilirsin.");
  balonEkle("asistan", "Kod, yazı, plan, özet veya günlük sohbet; kısacası her konuda yanıt veririm.");
  sonuc.textContent = "Hazır.";
}

function cevapOlustur(metin) {
  const kucuk = metin.toLowerCase();
  let yanit;

  if (kucuk.includes("kod") || kucuk.includes("bug") || kucuk.includes("hata")) {
    yanit = "Kod sorununu anlat: beklenen çıktı, hata mesajı ve ilgili satır. Buna göre adım adım bakalım.";
  } else if (kucuk.includes("özet") || kucuk.includes("kısalt") || kucuk.includes("madde")) {
    yanit = "Kısaca özetliyorum: ana fikir, 3 maddeyle destek ve kısa sonuç. Daha fazla detay istersen söyle.";
  } else if (kucuk.includes("plan") || kucuk.includes("adım") || kucuk.includes("takvim")) {
    yanit = "Plan fikri: hedefi yaz, 3 adımda yol haritası çıkar, sonuna kontrol listesi ekle. Uygun mu?";
  } else if (kucuk.includes("oyun") || kucuk.includes("npc") || kucuk.includes("taktik")) {
    yanit = "Oyun için basit taktik: durumu anlat (sağlık, mesafe, kaynak). Savun, baskı veya geri çekilme öneririm.";
  } else if (kucuk.includes("hikaye") || kucuk.includes("yaz") || kucuk.includes("blog")) {
    yanit = "Yazı taslağı hazırlayabilirim. Konuyu, hedef kitleyi ve uzunluğu yaz; giriş-gelişme-sonuç olarak kuralım.";
  } else if (kucuk.includes("?")) {
    yanit = "Sorunu not aldım. Kısa bir açıklama ve örnekle yanıtlayabilirim; eklemek istediğin ayrıntı var mı?";
  } else {
    yanit = "Not ettim. Biraz daha ayrıntı verirsen daha net cevap oluşturabilirim. İstersen doğrudan başlıyorum.";
  }

  return yanit;
}

function mesajiIsle() {
  const metin = girdi.value.trim();
  if (!metin) return;
  balonEkle("kullanici", metin);
  const yanit = cevapOlustur(metin);
  balonEkle("asistan", yanit);
  sonuc.textContent = yanit;
  girdi.value = "";
  girdi.focus();
}

function oturumuYukle() {
  const kayit = localStorage.getItem("gaiKullanici");
  if (!kayit) return;
  try {
    const veri = JSON.parse(kayit);
    if (veri.ad && veri.soyad) {
      hesapKimlik.textContent = `${veri.ad} ${veri.soyad}`;
    }
  } catch (e) {
    console.warn("Kayıt okunamadı", e);
  }
}

function oturumAcModal() {
  modal.classList.add("acik");
  adInput.focus();
}

function modalKapat() {
  modal.classList.remove("acik");
  adInput.value = "";
  soyadInput.value = "";
}

function modalKaydetHandler() {
  const ad = adInput.value.trim();
  const soyad = soyadInput.value.trim();
  if (!ad || !soyad) return;
  const veri = { ad, soyad };
  localStorage.setItem("gaiKullanici", JSON.stringify(veri));
  hesapKimlik.textContent = `${ad} ${soyad}`;
  modalKapat();
}

function baglantilariKur() {
  sohbetiBaslat();
  oturumuYukle();

  gonderBtn.addEventListener("click", mesajiIsle);
  girdi.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      mesajiIsle();
    }
  });

  resetBtn.addEventListener("click", sohbetiBaslat);
  oturumButon.addEventListener("click", oturumAcModal);
  modalIptal.addEventListener("click", modalKapat);
  modalKaydet.addEventListener("click", modalKaydetHandler);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modalKapat();
  });
}

document.addEventListener("DOMContentLoaded", baglantilariKur);
