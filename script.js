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
  if (!sohbetAlani) return;
  const kutu = document.createElement("div");
  kutu.className = `balon ${tip}`;
  kutu.textContent = metin;
  sohbetAlani.appendChild(kutu);
  sohbetAlani.scrollTop = sohbetAlani.scrollHeight;
}

function sohbetiBaslat() {
  sohbetAlani.innerHTML = "";
  balonEkle("kullanici", "Merhaba Gai!");
  balonEkle("asistan", "Merhaba, ben Gai. Kod, yazı, plan, özet, oyun ve sorular için buradayım.");
  balonEkle("kullanici", "Bugün hangi konularda iyisin?");
  balonEkle("asistan", "Hızlı fikir, detaylı plan, hata analizi, yazı taslağı ve daha fazlası için yanındayım.");
  sonuc.textContent = "Hazır.";
}

function tonlayici(ton) {
  if (ton === "teknik") return "Ton: teknik ve doğrudan.";
  if (ton === "samimi") return "Ton: samimi ve sıcak.";
  return "Ton: dengeli ve anlaşılır.";
}

function niyetBelirle(metin) {
  const kucuk = metin.toLowerCase();
  let niyet = "genel";

  if (kucuk.includes("kod") || kucuk.includes("hata") || kucuk.includes("bug") || kucuk.includes("error") || kucuk.includes("function") || kucuk.includes("html") || kucuk.includes("css") || kucuk.includes("javascript") || kucuk.includes("java") || kucuk.includes("python")) {
    niyet = "kod";
  } else if (kucuk.includes("özet") || kucuk.includes("kısalt") || kucuk.includes("madde") || kucuk.includes("kısa") || kucuk.includes("basitçe")) {
    niyet = "ozet";
  } else if (kucuk.includes("plan") || kucuk.includes("adım") || kucuk.includes("yol haritası") || kucuk.includes("takvim") || kucuk.includes("görev")) {
    niyet = "plan";
  } else if (kucuk.includes("fikir") || kucuk.includes("ilham") || kucuk.includes("senaryo") || kucuk.includes("konsept") || kucuk.includes("beyin fırtınası") || kucuk.includes("hikaye") || kucuk.includes("story")) {
    niyet = "fikir";
  } else if (kucuk.includes("oyun") || kucuk.includes("npc") || kucuk.includes("boss") || kucuk.includes("taktik") || kucuk.includes("savaş") || kucuk.includes("level") || kucuk.includes("xp")) {
    niyet = "oyun";
  } else if (kucuk.includes("yaz") || kucuk.includes("metin") || kucuk.includes("blog") || kucuk.includes("mail") || kucuk.includes("e-posta") || kucuk.includes("hikâye")) {
    niyet = "yaz";
  } else if (kucuk.includes("?")) {
    niyet = "soru";
  }

  return niyet;
}

function cevapOlustur(metin) {
  const niyet = niyetBelirle(metin);
  const detayUzun = metin.length > 120;
  let cevap = "";

  if (niyet === "kod") {
    cevap = `${tonlayici("teknik")} \nTanı: girdiyi, beklenen çıktıyı ve hatayı netleştir.\nİpucu: değişken adlarını kontrol et, konsol çıktısına bak, sınır değerleri dene.\nMini plan: giriş → işlem → test → doğrulama → sadeleştir.`;
  } else if (niyet === "ozet") {
    cevap = `${tonlayici("dengeli")}\nÖzet akışı: Ana fikir → 3 destek noktası → sonuç. Gereksiz tekrarları çıkar, özel isim ve rakamları koru.`;
  } else if (niyet === "plan") {
    cevap = `${tonlayici("dengeli")} \nPlan şablonu: Hazırlık (kaynak/araç) → Uygulama (3 adım) → Kontrol (kontrol listesi). Süreleri kısa tut.`;
  } else if (niyet === "fikir") {
    cevap = `${tonlayici("samimi")} \n3 seçenek: Güvenli, yaratıcı, deneysel. Her biri için tema, hedef kitle, güç ve risk ekle.`;
  } else if (niyet === "oyun") {
    cevap = `${tonlayici("dengeli")} \nNPC taktiği: sağlık, mesafe, kaynak, moral ve çevreyi ölç. Duruma göre savun, baskı kur, kaçın veya yan yol bul. Bonus: rastgele %10 sürpriz hareket ekle.`;
  } else if (niyet === "yaz") {
    cevap = `${tonlayici("samimi")} \nMetin iskeleti: Açılış (bağlam) → Gövde (2-3 paragraf) → Kapanış (çağrı veya özet). Tonu hitap biçimiyle hizala.`;
  } else if (niyet === "soru") {
    cevap = `${tonlayici("dengeli")} \nYanıt sırası: Tanım → Neden önemli → Nasıl uygulanır → Küçük örnek. Takip sorusu öner: 'Daha detay ister misin?'`;
  } else {
    cevap = `${tonlayici("samimi")} \nKısa cevap: ${metin.slice(0, 60)}... gibi bir konu için isteğini netleştir. İstersen kod, özet, plan, fikir veya oyun moduna geçebilirim.`;
  }

  if (detayUzun) {
    cevap += "\nDetaylı mod: daha uzun giriş yaptın, istersen daha derin örnekler sağlayabilirim.";
  }

  return cevap;
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
      oturumButon.textContent = "Oturumu değiştir";
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
  oturumButon.textContent = "Oturumu değiştir";
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
