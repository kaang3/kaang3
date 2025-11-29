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

function balonEkle(tip, metin, kod = null, kodBaslik = null) {
  const kutu = document.createElement("div");
  kutu.className = `balon ${tip}`;

  const icerik = document.createElement("div");
  icerik.className = "balon-icerik";
  icerik.textContent = metin;
  kutu.appendChild(icerik);

  if (kod) {
    const kapsayici = document.createElement("div");
    kapsayici.className = "kod-kapsayici";

    if (kodBaslik) {
      const baslik = document.createElement("div");
      baslik.className = "kod-baslik";
      baslik.textContent = kodBaslik;
      kapsayici.appendChild(baslik);
    }

    const tus = document.createElement("button");
    tus.className = "kopyala";
    tus.type = "button";
    tus.textContent = "Kopyala";
    tus.addEventListener("click", () => {
      navigator.clipboard.writeText(kod).then(() => {
        tus.textContent = "Kopyalandı";
        setTimeout(() => {
          tus.textContent = "Kopyala";
        }, 1200);
      });
    });

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = kod;
    pre.appendChild(code);

    kapsayici.appendChild(tus);
    kapsayici.appendChild(pre);
    kutu.appendChild(kapsayici);
  }

  sohbetAlani.appendChild(kutu);
  sohbetAlani.scrollTop = sohbetAlani.scrollHeight;
}

function sohbetiBaslat() {
  sohbetAlani.innerHTML = "";
  balonEkle("asistan", "Merhaba, ben GAI 1.0. Sorularını buradan bana yazabilirsin.");
  balonEkle("asistan", "Kod, yazı, plan, özet, hesap veya günlük sohbet; kısacası her konuda yanıt veririm.");
  sonuc.textContent = "Hazır.";
}

function temizIfade(ifade) {
  const izinli = /^[0-9+\-*/().,\s]+$/;
  if (!izinli.test(ifade)) return null;
  return ifade.replace(/,/g, ".");
}

function aritmetikDegerlendir(metin) {
  let temiz = temizIfade(metin);
  if (!temiz) {
    const eslesme = metin.match(/([-+]?\d+(?:[.,]\d+)?(?:\s*[+\-*/]\s*[-+]?\d+(?:[.,]\d+)?)+)/);
    if (eslesme) {
      temiz = temizIfade(eslesme[1]);
    }
  }

  if (!temiz) return null;
  try {
    // eslint-disable-next-line no-new-func
    const deger = new Function(`return (${temiz})`)();
    if (Number.isFinite(deger)) {
      return deger;
    }
  } catch (e) {
    return null;
  }
  return null;
}

function pythonPrintHata(metin) {
  const eslesme = metin.match(/print\(([^)]*)\)/i);
  if (!eslesme) return null;
  const icerik = eslesme[1].trim();
  if (!icerik) return "print() içinde yazdırılacak bir ifade yok.";
  const tirnakli = /^(".*"|'.*')$/.test(icerik);
  if (!tirnakli && !/[+\-*/]/.test(icerik)) {
    return "Metin yazdırmak için tırnak eklemelisin: print(\"merhaba\").";
  }
  return null;
}

function temelKodUret(lower, isim) {
  if (lower.includes("python")) {
    return {
      yanit: `${isim}, aşağıdaki Python örneğini çalıştırabilirsin.`,
      kod: "def selam_ver(isim):\n    return f'\u2728 Merhaba, {isim}!\n'\n\nprint(selam_ver('Dünya'))",
      kodBaslik: "Python"
    };
  }
  if (lower.includes("javascript") || lower.includes("js")) {
    return {
      yanit: "İstediğin çıktıyı veren küçük bir JavaScript örneği hazırladım.",
      kod: "function selamla(isim) {\n  return `Merhaba, ${isim}!`;\n}\n\nconsole.log(selamla('Ziyaretçi'));",
      kodBaslik: "JavaScript"
    };
  }
  return {
    yanit: "İşte kısa bir Python örneği; dil belirtmediğin için varsayılan verdim.",
    kod: "print('Merhaba! Eğer özel bir çıktı istersen metni değiştir.')",
    kodBaslik: "Python"
  };
}

function temelSiir(isim) {
  return `Maviyle mor arasında sessiz bir iz,\n${isim} sorar, sokak yanıt verir giz giz.\nRüzgar ince, heceler hafifçe uçar,\nHer cümle yeni bir kapı açar.`;
}

function cevapOlustur(metin) {
  const kucuk = metin.toLowerCase();
  const isim = hesapKimlik.textContent !== "Oturum aç" ? hesapKimlik.textContent : "Arkadaş";
  let yanit = "Sorunu anladım, yardımcı oluyorum.";
  let kod = null;
  let kodBaslik = null;

  const selamlar = ["merhaba", "selam", "hey", "gai", "naber", "günaydın", "iyi akşamlar"];
  const yazma = ["şiir", "şarkı", "hikaye", "roman", "deneme", "senaryo", "aforizma", "mektup"];
  const planlama = ["plan", "adım", "takvim", "roadmap", "görev", "hedef", "kontrol listesi"];
  const ozet = ["özet", "kısalt", "madde", "notlar", "bullet"];
  const oyun = ["oyun", "npc", "boss", "taktik", "level", "level tasarım", "quest", "gorev", "düşman"];
  const kodKelimeler = ["kod", "bug", "hata", "javascript", "python", "html", "css", "react", "c#", "java", "php", "sql", "algoritma", "print(", "console.log", "function"];
  const kimlik = ["seni kim", "kim yaptı", "nerelisin", "kimsin", "hangi model", "gpt", "gai"];
  const hesap = ["topla", "çıkar", "çarp", "böl", "+", "-", "*", "/", "kaç eder", "hesapla", "aritmetik", "matematik", "denklem"];
  const bilgi = ["nedir", "nasıl", "niye", "neden", "kimdir", "ne demek", "öğret", "anlat", "felsefe", "tarih", "bilim", "coğrafya"];
  const duygu = ["üzgün", "mutlu", "sinir", "moral", "motivasyon", "ilham", "yorgun", "stres", "korku", "heyecan"];
  const pratik = ["alışveriş", "yemek", "tarif", "spor", "uyku", "alışkanlık", "alıştırma", "alışma", "tempo", "program"];
  const sanat = ["müzik", "film", "dizi", "oyuncu", "yönetmen", "şarkı", "albüm", "ritim", "ton", "renk"];
  const teknoloji = ["yapay zeka", "ai", "model", "veri", "sunucu", "cloud", "cihaz", "donanım", "performans", "optimizasyon"];

  const aritmetikSonuc = aritmetikDegerlendir(kucuk);
  if (aritmetikSonuc !== null) {
    return { yanit: `Hesapladım: ${metin.trim()} = ${aritmetikSonuc}`, kod, kodBaslik };
  }

  const printHata = pythonPrintHata(metin);
  if (printHata) {
    return { yanit: printHata, kod, kodBaslik };
  }

  if (kucuk.includes("http")) {
    yanit = "Tarayıcıdan dış web'e bağlanmıyorum; tamamen yerelde çalışıyorum ama sorunu burada birlikte çözebiliriz.";
  } else if (selamlar.some((kelime) => kucuk.includes(kelime))) {
    yanit = `Merhaba ${isim}! Nasıl yardımcı olabilirim? Kod, şiir, özet, plan ya da genel bilgi soruları için hazırım.`;
  } else if (kimlik.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Ben GAI. Yerelde çalışan, if/else kural setiyle konuşan bir asistanım; tasarımım bu sayfa için geliştirildi.";
  } else if (yazma.some((kelime) => kucuk.includes(kelime))) {
    yanit = "İşte kısa bir şiir yazdım:";
    kod = temelSiir(isim);
    kodBaslik = "Şiir";
  } else if (planlama.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Plan örneği hazırladım:";
    kod = "1) Hedef: ...\n2) Kaynak & kısıtlar: ...\n3) Takvim: ...\n4) Risk & B planı: ...\n5) Kontrol listesi: ...";
    kodBaslik = "Plan";
  } else if (ozet.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Özet kuralım: Ana fikir → 3 destek maddesi → kısa sonuç. Metni paylaş, hemen kısaltayım.";
  } else if (kodKelimeler.some((kelime) => kucuk.includes(kelime))) {
    const uretilen = temelKodUret(kucuk, isim);
    yanit = uretilen.yanit;
    kod = uretilen.kod;
    kodBaslik = uretilen.kodBaslik;
  } else if (oyun.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Oyun taktiği: mesafe, sağlık ve kaynak durumunu paylaş. Baskı kurma, savunma veya geri çekilme önerileri sunabilirim.";
  } else if (hesap.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Aritmetik için ifadeyi yaz: örn. 12.5 * 3 - (4 / 2). Toplama, çıkarma, çarpma ve bölme yapabiliyorum.";
  } else if (duygu.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Duygu desteği modu: kısa nefes egzersizi (4-4-4), küçük bir mola ve net bir sonraki adım öneririm. Anlatmak ister misin?";
  } else if (pratik.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Pratik öneriler sunabilirim: basit tarif, alışveriş listesi, 20 dakikalık egzersiz veya gün planı gibi. Hangisi lazım?";
  } else if (sanat.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Sanat köşesi: film/dizi önerisi, müzik türü veya renk/ton seçimi için kısa listeler hazırlayabilirim.";
  } else if (teknoloji.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Teknoloji sorusu algıladım. Kavramı basitçe tanımlayıp avantaj/dezavantaj ve tipik kullanım alanlarını anlatabilirim.";
  } else if (bilgi.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Kavramsal anlatım için hazırım. Sorunu netleştir: tanım + örnek + kısa özet formatında yanıt verebilirim.";
  } else if (kucuk.includes("şikayet") || kucuk.includes("sorun") || kucuk.includes("çalışmıyor")) {
    yanit = "Sorunu anladım. Beklenen davranışı ve gördüğün sonucu paylaş; hata ayıklama adımlarını birlikte yazalım.";
  } else if (kucuk.includes("soru") || kucuk.includes("cevap")) {
    yanit = "Sorunu tam olarak yazarsan doğrudan cevaplayabilirim. Hesaplama, tanım, kod veya şiir fark etmez.";
  } else if (kucuk.includes("zaman") || kucuk.includes("tarih") || kucuk.includes("takvim")) {
    yanit = "Tarih veya zamanlama için bağlamı paylaş; önemli kilometre taşlarını sıralayalım.";
  } else if (kucuk.includes("öneri") || kucuk.includes("fikir") || kucuk.includes("ilham")) {
    yanit = "Yaratıcı fikir modundayım. Konu, hedef kitle ve ton bilgisini verirsen hızlıca öneriler sıralarım.";
  } else if (kucuk.includes("çevirm") || kucuk.includes("translate") || kucuk.includes("çeviri")) {
    yanit = "Çevirmek istediğin metni ve hedef dili yaz; kısa çeviriyle başlayalım.";
  } else {
    yanit = "Anladım. Kod, şiir, tanım, plan veya matematik isteğini açık yazarsan hemen üretebilirim.";
  }

  return { yanit, kod, kodBaslik };
}

function mesajiIsle() {
  const metin = girdi.value.trim();
  if (!metin) return;
  balonEkle("kullanici", metin);
  const { yanit, kod, kodBaslik } = cevapOlustur(metin);
  balonEkle("asistan", yanit, kod, kodBaslik);
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
