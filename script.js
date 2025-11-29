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
const artiBtn = document.getElementById("artiBtn");
const artiMenu = document.getElementById("artiMenu");
const webBaglan = document.getElementById("webBaglan");
const webEtiketi = document.getElementById("webEtiketi");
const webKapat = document.getElementById("webKapat");
const webBaglanMetni = document.getElementById("webBaglanMetni");
const dusunKart = document.getElementById("dusunKart");
const dusunMetin = document.getElementById("dusunMetin");
const gptEtiketi = document.getElementById("gptEtiketi");
const gptKapat = document.getElementById("gptKapat");
const gptBaglan = document.getElementById("gptBaglan");
const gptBaglanMetni = document.getElementById("gptBaglanMetni");
const gptModal = document.getElementById("gptModal");
const gptAnahtar = document.getElementById("gptAnahtar");
const gptModel = document.getElementById("gptModel");
const gptURL = document.getElementById("gptURL");
const gptKaydet = document.getElementById("gptKaydet");
const gptSil = document.getElementById("gptSil");

let webAcik = false;
let gptAcik = false;
let gptAyar = {
  anahtar: "",
  model: "gpt-4o-mini",
  url: "https://api.openai.com/v1/chat/completions"
};

const gecmis = [];

function bekle(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function secRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function dusunmeGoster(metin) {
  dusunMetin.textContent = metin;
  dusunKart.classList.remove("gizli");
}

function dusunmeGizle() {
  dusunKart.classList.add("gizli");
}

function gptModalAc() {
  gptModal.classList.add("acik");
  gptAnahtar.focus();
}

function gptModalKapat() {
  gptModal.classList.remove("acik");
}

function yazdirAnimasyon(hedef, metin, hiz = 12) {
  return new Promise((resolve) => {
    if (!metin) {
      hedef.textContent = "";
      resolve();
      return;
    }
    let indeks = 1;
    const artis = metin.length > 400 ? 3 : 1;
    hedef.textContent = metin.slice(0, indeks);
    const timer = setInterval(() => {
      hedef.textContent = metin.slice(0, indeks);
      sohbetAlani.scrollTop = sohbetAlani.scrollHeight;
      indeks += artis;
      if (indeks >= metin.length) {
        hedef.textContent = metin;
        sohbetAlani.scrollTop = sohbetAlani.scrollHeight;
        clearInterval(timer);
        resolve();
      }
    }, hiz);
  });
}

function balonEkle(tip, metin, kod = null, kodBaslik = null, animasyon = false) {
  const kutu = document.createElement("div");
  kutu.className = `balon ${tip}`;

  const icerik = document.createElement("div");
  icerik.className = "balon-icerik";
  kutu.appendChild(icerik);

  const kodEkle = () => {
    if (!kod) return;
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
  };

  sohbetAlani.appendChild(kutu);
  sohbetAlani.scrollTop = sohbetAlani.scrollHeight;

  if (animasyon) {
    return yazdirAnimasyon(icerik, metin).then(() => {
      kodEkle();
    });
  }

  icerik.textContent = metin;
  kodEkle();
  return Promise.resolve();
}

function sohbetiBaslat() {
  sohbetAlani.innerHTML = "";
  gecmis.length = 0;
  balonEkle("asistan", "Merhaba, ben GAI 1.0. Sorularını buradan bana yazabilirsin.");
  balonEkle("asistan", "Kod, yazı, plan, özet, hesap veya günlük sohbet; kısacası her konuda yanıt veririm.");
  balonEkle("asistan", "Sol alttaki + ile web erişimini açabilir, hesaplama ve örnek kodları hemen görebilirsin.");
  sonuc.textContent = "Hazır.";
  dusunmeGizle();
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

function ortalamaBul(metin) {
  if (!/(ortalama|mean|average)/i.test(metin)) return null;
  const sayilar = [...metin.matchAll(/(-?\d+(?:[.,]\d+)?)/g)].map((m) => Number(m[1].replace(/,/g, ".")));
  if (sayilar.length === 0) return null;
  const toplam = sayilar.reduce((t, s) => t + s, 0);
  return Number((toplam / sayilar.length).toFixed(2));
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

function printIcerikBul(metin) {
  const parantezli = metin.match(/print\(([^)]*)\)/i);
  if (parantezli && parantezli[1].trim()) {
    return parantezli[1].trim().replace(/^['"]|['"]$/g, "");
  }

  const pythonYazdir = /python[^\n]*yazd[ıi]r\s+([\p{L}0-9 .,'"!?-]+)/iu;
  const genelYazdir = /yazd[ıi]r\s+([\p{L}0-9 .,'"!?-]+)/iu;
  const eslesme = metin.match(pythonYazdir) || metin.match(genelYazdir);
  if (eslesme && eslesme[1]) {
    return eslesme[1].trim().replace(/^['"]|['"]$/g, "");
  }
  return null;
}

function sozluAritmetik(metin) {
  const sayilar = [...metin.matchAll(/(-?\d+)/g)].map((m) => Number(m[1]));
  if (sayilar.length < 2) return null;
  const [ilk, ikinci] = sayilar;

  const cikarmaKelimeleri = /(yedi|çıkar|azal|gitti|kaldı|kaybet|çaldı|harca|tüket|eksildi|azaldı)/i;
  const toplamaKelimeleri = /(aldı|ekle|ekledi|eklendi|arttı|kazandı|topla|birikti|koydu|verdi|verildi|katıldı|daha|eklen)/i;

  if (cikarmaKelimeleri.test(metin)) {
    return Math.max(0, ilk - ikinci);
  }
  if (toplamaKelimeleri.test(metin)) {
    return ilk + ikinci;
  }
  return null;
}

function carpmaBolmeMetinsel(metin) {
  const sayilar = [...metin.matchAll(/(-?\d+)/g)].map((m) => Number(m[1]));
  if (sayilar.length === 0) return null;

  if (/kat[ıi]/i.test(metin) && sayilar.length >= 2) {
    const [a, b] = sayilar;
    return a * b;
  }

  if (/(yarı|böl|paylaştır|paylaş)/i.test(metin)) {
    if (sayilar.length >= 2 && sayilar[1] !== 0) {
      return sayilar[0] / sayilar[1];
    }
    if (sayilar.length === 1) {
      return sayilar[0] / 2;
    }
  }

  return null;
}

function varyasyonluNot(isim) {
  const havuz = [
    `✨ Hazır ${isim}, anlatmaya devam edebilirsin.`,
    `🤖 ${isim}, ayrıntı verirsen nokta atışı yaparım.`,
    `👂 Dinliyorum ${isim}, neye ihtiyacın varsa yaz.`,
    `🚀 ${isim}, buradayım; kod veya yazı için hazırım.`,
    `🧠 Anladım ${isim}, birkaç örnekle ilerleyelim.`,
    `📌 ${isim}, devam et lütfen—yardımcı olayım.`,
    `👁️ Dinlemedeyim ${isim}, detay ekleyebilirsin.`,
    `🛠️ ${isim}, sorunu gördüm, çözüm önerisi hazırlıyorum.`,
    `✅ Tamamlandı ${isim}, şimdi yanıtı getiriyorum.`,
    `💡 ${isim}, küçük bir ipucu daha verirsen daha iyi sonuç çıkar.`,
    `🧾 ${isim}, ister hesap ister yazı olsun, hazırım.`,
    `🧪 Bir örnek paylaşırsan ${isim}, hızla kod yazabilirim.`,
    `⏩ ${isim}, önce kısa yanıt vereyim; gerekirse detaylandırırız.`,
    `🧭 ${isim}, istersen kodu test edecek küçük girdiler de önerebilirim.`,
    `🎯 ${isim}, farklı yollar da var; birini seçip deneyelim.`
  ];
  return secRandom(havuz);
}

function dusunNotu() {
  const havuz = [
    "İsteklerini derliyorum...",
    "En iyi cevabı arıyorum...",
    "Örnek ve ipuçlarını hazırlıyorum...",
    "Web ve yerel bilgileri harmanlıyorum...",
    "Kod ve matematik kontrolleri yapılıyor...",
    "Düşünüyorum, birkaç saniye sürebilir...",
    "Doğruluk için tekrar gözden geçiriyorum..."
  ];
  return secRandom(havuz);
}

function pythonYazdirIstek(metin) {
  if (!/python/i.test(metin)) return null;
  const icerik = printIcerikBul(metin) || metin.replace(/.*python[^a-zğüşıöç0-9]+/i, "").replace(/yazd[ıi]r.*/i, "").trim();
  if (icerik) {
    const temiz = icerik.replace(/^['"]|['"]$/g, "").trim();
    if (temiz.length > 0) {
      return {
        yanit: "İstediğin ifadeyi Python'da ekrana yazdırabilirsin:",
        kod: `print("${temiz}")`,
        kodBaslik: "Python"
      };
    }
  }
  return null;
}

function printOrnegi(metin) {
  const eslesme = metin.match(/print\(([^)]*)\)/i);
  const icerik = eslesme ? eslesme[1].trim() : null;

  if (icerik && /['"][^'"]+['"]/.test(icerik)) {
    const temiz = icerik.replace(/^['"]|['"]$/g, "");
    return {
      yanit: `Bu kodun çıktısı: ${temiz}`,
      kod: `print(${icerik})`,
      kodBaslik: "Python"
    };
  }

  const metinIcerik = printIcerikBul(metin);
  if (metinIcerik) {
    return {
      yanit: "İstediğin çıktıyı yazdıran Python kodunu hazırladım:",
      kod: `print("${metinIcerik}")`,
      kodBaslik: "Python"
    };
  }

  return null;
}

function satirliListe(baslik, maddeler) {
  return `${baslik}\n${maddeler.map((m, i) => `${i + 1}. ${m}`).join("\n")}`;
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

function butonOrnegi() {
  return {
    yanit: "İstediğin tarzda bir buton için basit HTML/CSS önerisi hazırladım.",
    kod: "<button class=\"parlak-btn\">Merhaba de</button>\n\n<style>\n.parlak-btn {\n  padding: 12px 20px;\n  border-radius: 12px;\n  border: none;\n  color: #fff;\n  background: linear-gradient(135deg, #6d5cfb, #7ae1ff);\n  box-shadow: 0 14px 32px rgba(109, 92, 251, 0.35);\n  cursor: pointer;\n  font-weight: 700;\n  letter-spacing: 0.3px;\n}\n.parlak-btn:hover {\n  transform: translateY(-1px);\n}\n</style>",
    kodBaslik: "HTML + CSS"
  };
}

function merhabaKodlari() {
  return {
    yanit: "İşte iki dilde basit bir selamlama örneği:",
    kod: "# Python\nprint('Merhaba')\n\n// JavaScript\nconsole.log('Merhaba');",
    kodBaslik: "Python & JS"
  };
}

const bilgiKutuphanesi = [
  "Kavramsal özet → Tanım + 2 örnek + kısa sonuç cümlesi.",
  "Hata ayıklama → Beklenen nedir? Gerçekte ne oluyor? Kısa adımlarla karşılaştır.",
  "Zaman yönetimi → 50/10 odak blokları, ardından kısa dinlenme döngüleri.",
  "Metin düzenleme → Giriş, gelişme, sonuç + destekleyici 3 madde yapısı iş görür.",
  "Sunum taslağı → 1) Problem 2) Çözüm 3) Kanıt 4) Demo 5) Çağrı.",
  "Verimli arama → Konu + bağlam + beklenen çıktı; örn. 'JS fetch json örneği'.",
  "Algoritma → Girdi, çıktı, varsayım ve karmaşıklık tahmini ile başla.",
  "Matematik → Soruyu sembolik yaz, verilenleri çıkar, denklem kur, sadeleştir.",
  "Çeviri → Kaynak dil, hedef dil ve özel terimleri netleştir; aksi halde genel çeviri yapılır.",
  "Yazma tonu → Resmî, samimi, teknik, mizahi; tonu başta belirtmek işini kolaylaştırır.",
  "Çalışma planı → Bugün/hafta ayır; 'en küçük işe yarar çıktı' tanımı belirle.",
  "Ödev yardımı → Soruyu parçala, hangi bölüm kendi çalışman olmalı onu koru, ipucu ver." ,
  "Şiir → Dize uzunluğu dengesi ve ses uyumu için iç kafiyeler kullan; 4-6 dize başlangıç için ideal.",
  "Kod stil → İsimleri açık tut, hataları yakala, küçük örneklerle test et.",
  "Frontend → Küçük bileşenlere böl, mobil uyumu kontrol et, erişilebilirlik ekle.",
  "Backend → Giriş doğrulaması, hata loglama ve basit sağlık kontrolü eklemek güven verir.",
  "Veri → Küçük örnek veriyle başlayıp yapı doğru mu kontrol et; sonra büyüt.",
  "Performans → Gereksiz tekrarları kaldır, önbellek kullan, gereğinde lazy-load uygula.",
  "Soru sorma → Bağlam + mevcut çıktı + istenen çıktı; en net formül budur.",
  "Deneme → Küçük değişiklik yap, sonucu gözle, gerektiğinde geri al; iteratif yaklaşım en güvenlisi.",
  "Matematik sözel → Kilit kelimeleri bul, verilenleri sırala, işlemi kur, sonucu kontrol et.",
  "Python ipucu → print() içinde tırnak, döngüde range, liste için list comprehension pratik yollar sağlar.",
  "HTML/CSS → Basit grid/flex yapısı, contrast ve boşluk yönetimi ile okunaklı arayüz kur.",
  "Algoritma sözel → Girdi-çıktıyı örneklerle listele, sonra kuralları if/else olarak yaz.",
  "Yaratıcı yazı → 5N1K yanıtlarını doldur, olay örgüsü otomatik oluşur."
];

const hataSozlugu = [
  { tetik: "print(", aciklama: "Python'da metin yazdırırken tırnak eklemeyi unutma: print(\"merhaba\")." },
  { tetik: "console.log", aciklama: "Tarayıcı konsolunda log almak için console.log('mesaj') kullanılır." },
  { tetik: "syntaxerror", aciklama: "Sözdizimi hatalarında eksik parantez veya tırnak olup olmadığını kontrol et." },
  { tetik: "referenceerror", aciklama: "Tanımlanmamış değişken kullanılıyor olabilir; isimleri kontrol et." },
  { tetik: "typeerror", aciklama: "Beklenen türde olmayan bir değeri çağırıyor olabilirsin; örn. number üstünde split()." }
];

async function kurGetir(metin, webAcil) {
  const kurlar = ["dolar", "usd", "eur", "euro", "sterlin", "gbp", "tl", "try", "kur", "döviz", "doviz"];
  if (!kurlar.some((k) => metin.includes(k))) return null;

  if (!webAcil) {
    return {
      yanit: "💱 Canlı kura bakmak için sol alttaki + menüsünden 🌐 Web'e bağlan'ı aç. Şimdilik tahmini oran: 1 USD ≈ 32.00 TRY, 1 EUR ≈ 34.00 TRY.",
      kaynak: "offline"
    };
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return {
      yanit: "💱 Web açıldı ama çevrimdışı görünüyorsun; bağlantı olmayınca canlı kur alamam. Şimdilik varsayım: 1 USD ≈ 32.00 TRY.",
      kaynak: "offline"
    };
  }

  async function kaynakDenemesi(url, coz) {
    const yanit = await fetch(url, { headers: { Accept: "application/json" } });
    if (!yanit.ok) throw new Error(`Ağ yanıtı başarısız (${yanit.status})`);
    const veri = await yanit.json();
    return coz(veri);
  }

  const denemeler = [
    {
      ad: "open.er-api.com",
      url: "https://open.er-api.com/v6/latest/USD",
      coz: (veri) => {
        if (!veri?.rates?.TRY) throw new Error("TRY oranı yok");
        const usdTry = veri.rates.TRY?.toFixed(2);
        const eurTry = (veri.rates.TRY / veri.rates.EUR)?.toFixed(2);
        const gbpTry = (veri.rates.TRY / veri.rates.GBP)?.toFixed(2);
        const zaman = veri.time_last_update_utc || "zaman bilgisi gelmedi";
        return {
          yanit: `Güncel kurlar: 1 USD ≈ ${usdTry} TRY | 1 EUR ≈ ${eurTry} TRY | 1 GBP ≈ ${gbpTry} TRY (kaynak: ${zaman})`,
          kaynak: "open.er-api.com"
        };
      }
    },
    {
      ad: "exchangerate.host",
      url: "https://api.exchangerate.host/latest?base=USD&symbols=TRY,EUR,GBP",
      coz: (veri) => {
        if (!veri?.rates?.TRY) throw new Error("TRY oranı yok");
        const usdTry = veri.rates.TRY?.toFixed(2);
        const eurTry = (veri.rates.TRY / veri.rates.EUR)?.toFixed(2);
        const gbpTry = (veri.rates.TRY / veri.rates.GBP)?.toFixed(2);
        const zaman = veri.date || "tarih bilgisi gelmedi";
        return {
          yanit: `Canlı kurlar: 1 USD ≈ ${usdTry} TRY | 1 EUR ≈ ${eurTry} TRY | 1 GBP ≈ ${gbpTry} TRY (tarih: ${zaman})`,
          kaynak: "exchangerate.host"
        };
      }
    }
  ];

  for (const deneme of denemeler) {
    try {
      return await kaynakDenemesi(deneme.url, deneme.coz);
    } catch (err) {
      console.warn(`Kur kaynağı başarısız (${deneme.ad})`, err);
    }
  }

  return {
    yanit: "💱 Canlı kura erişemedim (web açık olsa bile kaynaklar cevap vermedi). Örnek: 1 USD ≈ 32.00 TRY varsayımını kullanabilirsin.",
    kaynak: "yerel varsayım"
  };
}

async function webAra(metin, hamMetin, webAcil) {
  const aramaKelimeleri = /(web.?de|internette|google'da|ara(t)?|search)/i;
  if (!aramaKelimeleri.test(hamMetin)) return null;

  const eslesmeTirnakli = hamMetin.match(/(?:ara|arat|search|webde|web'de)[^"=]*[=:]\s*"([^"]+)"/i);
  const eslesmeEsitle = hamMetin.match(/(?:ara|arat|search|webde|web'de)[^\s]*=([^\s]+)/i);
  const query = eslesmeTirnakli?.[1]
    || (eslesmeEsitle ? eslesmeEsitle[1].replace(/"/g, "").trim() : null)
    || hamMetin.replace(/.*?(?:ara|arat|search|webde|web'de)/i, "").replace(/"/g, "").trim();

  if (!query) {
    return { yanit: "Aramak için bir ifade bulamadım. Lütfen tırnak içinde veya 'ara ...' şeklinde yaz." };
  }

  if (!webAcil) {
    return { yanit: `"${query}" için web taraması yapmamı istersen 🌐 Web'e bağlan düğmesini açmalısın.` };
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { yanit: "Web açık ama çevrimdışı görünüyorsun; bağlantı gelince yeniden dene." };
  }

  const kaynaklar = [
    {
      ad: "Google (proxy)",
      url: (sorgu) => `https://r.jina.ai/https://www.google.com/search?q=${encodeURIComponent(sorgu)}`,
      cozumle: async (yanit) => {
        const metinSonuc = await yanit.text();
        const satirlar = metinSonuc.split("\n").filter((s) => s.trim().length > 0);
        const basliklar = satirlar.filter((s) => s.startsWith("# ")).slice(0, 3).map((s) => s.replace(/^#\s*/, "").trim());
        const linkler = satirlar.filter((s) => s.startsWith("http"));
        const ilkLinkler = linkler.slice(0, 3);
        const ozet = basliklar.length ? basliklar.join(" • ") : "Öne çıkan başlık bulunamadı; en ilgili bağlantıları ekledim.";
        const baglantilar = ilkLinkler.length ? ilkLinkler.map((l) => l.trim()) : [];
        return { ozet, baglantilar };
      }
    },
    {
      ad: "DuckDuckGo",
      url: (sorgu) => `https://api.duckduckgo.com/?q=${encodeURIComponent(sorgu)}&format=json&no_redirect=1&no_html=1`,
      cozumle: async (yanit) => {
        const veri = await yanit.json();
        const baslik = veri.Heading || "İlk sonuç başlığı gelmedi.";
        const aciklama = veri.AbstractText || "Kısa bir özet bulunamadı, bağlantıları paylaşıyorum.";
        const baglantilar = (veri.RelatedTopics || [])
          .map((t) => (t.FirstURL ? `${t.Text || "Sonuç"} → ${t.FirstURL}` : null))
          .filter(Boolean)
          .slice(0, 3);
        return { ozet: `${baslik}: ${aciklama}`, baglantilar };
      }
    }
  ];

  for (const kaynak of kaynaklar) {
    try {
      const yanit = await fetch(kaynak.url(query), { headers: { Accept: "application/json,text/plain" } });
      if (!yanit.ok) throw new Error(`${kaynak.ad} başarısız (${yanit.status})`);
      const { ozet, baglantilar } = await kaynak.cozumle(yanit);
      const liste = (baglantilar && baglantilar.length)
        ? baglantilar.map((l, i) => `• ${i + 1}. ${l}`).join("\n")
        : "• Ek bağlantı yakalanamadı, farklı anahtar kelime deneyebiliriz.";
      return {
        yanit: `🔎 Web araması (${kaynak.ad})\n📝 Sorgu: "${query}"\n✨ Özet: ${ozet}\n🔗 Bağlantılar:\n${liste}`,
        kaynak: kaynak.ad
      };
    } catch (err) {
      console.warn("Arama hatası", kaynak.ad, err);
    }
  }

  return { yanit: "Web'e bağlanmayı denedim ama sonuç alamadım. Farklı bir anahtar kelime deneyebiliriz." };
}

async function chatgptYaniti(metin) {
  if (!gptAcik || !gptAyar.anahtar) return null;
  const mesajlar = [
    {
      role: "system",
      content: "You are GAI, a concise and helpful assistant that answers in Turkish by default. Provide direct solutions, short code blocks when helpful, and avoid refusing unless the request is unsafe."
    },
    ...gecmis.slice(-6),
    { role: "user", content: metin }
  ];

  const istekGovde = {
    model: gptAyar.model || "gpt-4o-mini",
    messages: mesajlar,
    max_tokens: 400,
    temperature: 0.4
  };

  const yanit = await fetch(gptAyar.url || "https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${gptAyar.anahtar}`
    },
    body: JSON.stringify(istekGovde)
  });

  if (!yanit.ok) {
    throw new Error(`ChatGPT isteği başarısız: ${yanit.status}`);
  }

  const veri = await yanit.json();
  const cevap = veri?.choices?.[0]?.message?.content?.trim();
  if (cevap) {
    return { yanit: cevap, kaynak: "chatgpt" };
  }
  return null;
}

function gptDurumGuncelle() {
  if (gptAcik && gptAyar.anahtar) {
    gptEtiketi.classList.remove("gizli");
    gptBaglanMetni.textContent = "ChatGPT'den çık";
    sonuc.textContent = "ChatGPT bağlı, yanıtlar önce oradan gelecek.";
  } else {
    gptEtiketi.classList.add("gizli");
    gptBaglanMetni.textContent = "ChatGPT'ye bağlan";
  }
}

function gptTercihiniYukle() {
  const kayit = localStorage.getItem("gaiGpt");
  if (!kayit) return;
  try {
    const veri = JSON.parse(kayit);
    gptAyar = {
      anahtar: veri.anahtar || "",
      model: veri.model || "gpt-4o-mini",
      url: veri.url || "https://api.openai.com/v1/chat/completions"
    };
    const acikKaydi = localStorage.getItem("gaiGptAcik");
    const acikIsareti = acikKaydi === null ? true : acikKaydi === "1";
    gptAcik = Boolean(gptAyar.anahtar) && acikIsareti;
    gptAnahtar.value = gptAyar.anahtar;
    gptModel.value = gptAyar.model;
    gptURL.value = gptAyar.url;
  } catch (e) {
    console.warn("GPT kaydı okunamadı", e);
  }
}

function gptKaydetHandler() {
  const anahtar = gptAnahtar.value.trim();
  const model = gptModel.value.trim() || "gpt-4o-mini";
  const url = gptURL.value.trim() || "https://api.openai.com/v1/chat/completions";
  gptAyar = { anahtar, model, url };
  gptAcik = Boolean(anahtar);
  localStorage.setItem("gaiGpt", JSON.stringify(gptAyar));
  localStorage.setItem("gaiGptAcik", gptAcik ? "1" : "0");
  gptDurumGuncelle();
  gptModalKapat();
}

function gptSilHandler() {
  gptAyar = { anahtar: "", model: "gpt-4o-mini", url: "https://api.openai.com/v1/chat/completions" };
  gptAnahtar.value = "";
  gptModel.value = gptAyar.model;
  gptURL.value = gptAyar.url;
  gptAcik = false;
  localStorage.removeItem("gaiGpt");
  localStorage.setItem("gaiGptAcik", "0");
  gptDurumGuncelle();
}

function gptBaglantiKapat() {
  gptAcik = false;
  localStorage.setItem("gaiGptAcik", "0");
  gptDurumGuncelle();
}

function metinUretici(metin, isim) {
  if (metin.includes("özet")) {
    return "Özet: Konunun ana fikrini 2-3 maddede çıkar, ardından tek cümle sonuç ekle.";
  }
  if (metin.includes("ödev") || metin.includes("assignment") || metin.includes("homework")) {
    return satirliListe("Ödev akışı", [
      "Soruyu maddelere böl ve her madde için hedefi yaz.",
      "Kaynak topla: ders notu, resmi doküman, basit örnek.",
      "Önce taslak hazırla, sonra kendi cümlelerinle genişlet.",
      "Sonunda kontrol listesiyle dilbilgisi ve kaynakça ekle."
    ]);
  }
  if (metin.includes("şiir")) return temelSiir(isim);
  if (metin.includes("merhaba")) return "Selam! İşte hızlı selamlama: Merhaba, nasılsın?";
  return secRandom(bilgiKutuphanesi);
}

async function cevapOlustur(metin) {
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
  const kodKelimeler = ["kod", "bug", "hata", "javascript", "python", "html", "css", "react", "c#", "java", "php", "sql", "algoritma", "print(", "console.log", "function", "merhaba yazdır", "hello world"];
  const kimlik = ["seni kim", "kim yaptı", "nerelisin", "kimsin", "hangi model", "gpt", "gai"];
  const hesap = ["topla", "çıkar", "çarp", "böl", "+", "-", "*", "/", "kaç eder", "hesapla", "aritmetik", "matematik", "denklem"];
  const bilgi = ["nedir", "nasıl", "niye", "neden", "kimdir", "ne demek", "öğret", "anlat", "felsefe", "tarih", "bilim", "coğrafya", "kaç tl"];
  const duygu = ["üzgün", "mutlu", "sinir", "moral", "motivasyon", "ilham", "yorgun", "stres", "korku", "heyecan"];
  const pratik = ["alışveriş", "yemek", "tarif", "spor", "uyku", "alışkanlık", "alıştırma", "alışma", "tempo", "program"];
  const sanat = ["müzik", "film", "dizi", "oyuncu", "yönetmen", "şarkı", "albüm", "ritim", "ton", "renk"];
  const teknoloji = ["yapay zeka", "ai", "model", "veri", "sunucu", "cloud", "cihaz", "donanım", "performans", "optimizasyon"];
  const odev = ["ödev", "assignment", "proje", "tez", "rapor", "makale", "yazı yaz", "kompozisyon", "metin yaz", "essay"];
  const tasarim = ["buton", "button", "tasarla", "tasarım", "ui", "buton tasarla"];
  const selamlamaKod = ["merhaba yazdır", "merhaba yaz", "hello world", "print('merhaba')", "console.log('merhaba')"];
  const webIstek = ["internet", "web", "bağlan", "webden", "online", "google", "aran"];

  const kurSonucu = await kurGetir(kucuk, webAcik);
  if (kurSonucu) {
    return { yanit: `${kurSonucu.yanit} (${kurSonucu.kaynak})`, kod, kodBaslik };
  }

  const aramaSonucu = await webAra(kucuk, metin, webAcik);
  if (aramaSonucu) {
    return { yanit: aramaSonucu.yanit, kod, kodBaslik };
  }

  const aritmetikSonuc = aritmetikDegerlendir(kucuk);
  if (aritmetikSonuc !== null) {
    return { yanit: `Hesapladım: ${metin.trim()} = ${aritmetikSonuc}`, kod, kodBaslik };
  }

  const ortalamaSonuc = ortalamaBul(metin);
  if (ortalamaSonuc !== null) {
    return { yanit: `Aritmetik ortalama: ${ortalamaSonuc}`, kod, kodBaslik };
  }

  const carpmaBolme = carpmaBolmeMetinsel(metin);
  if (carpmaBolme !== null) {
    return { yanit: `İfadeden çıkardım: sonuç ${carpmaBolme}.`, kod, kodBaslik };
  }

  const sozluHesap = sozluAritmetik(metin);
  if (sozluHesap !== null) {
    return { yanit: `Hikayeden çıkardım: sonuç ${sozluHesap}. Daha fazla ayrıntı varsa paylaşabilirsin.`, kod, kodBaslik };
  }

  const printHata = pythonPrintHata(metin);
  if (printHata) {
    return {
      yanit: printHata,
      kod: "# Doğru kullanım\nprint('merhaba')\n\n# Sayısal toplama\nprint(5 + 3)",
      kodBaslik: "Python"
    };
  }

  const printYanit = printOrnegi(metin);
  if (printYanit) {
    return printYanit;
  }

  const pythonYazdir = pythonYazdirIstek(metin);
  if (pythonYazdir) {
    return pythonYazdir;
  }

  if (gptAcik && gptAyar.anahtar) {
    try {
      const gptYanit = await chatgptYaniti(metin);
      if (gptYanit?.yanit) {
        return { yanit: gptYanit.yanit, kod, kodBaslik };
      }
    } catch (err) {
      console.warn("ChatGPT hatası", err);
    }
  }

  if (kucuk.includes("http")) {
    yanit = "Tarayıcıdan dış web'e bağlanmıyorum; tamamen yerelde çalışıyorum ama sorunu burada birlikte çözebiliriz.";
  } else if (selamlar.some((kelime) => kucuk.includes(kelime))) {
    yanit = secRandom([
      `Selam ${isim}! Nasıl gidiyor? Sorunu yaz, birlikte çözelim.`,
      `Merhaba ${isim}, kod, şiir veya bilgi için hazırım.`,
      `Hey ${isim}, bugün neye odaklanmak istersin?`,
      `Hoş geldin ${isim}! İstersen bir örnek kodla başlayalım.`,
      `Günaydın/iyi akşamlar ${isim}! Sorunu yaz, hesap veya yazı üretirim.`,
      `${isim}, buradayım. Kısa mı uzun mu bir yanıt istiyorsun?`,
      `Selam ${isim}! Şu an çevrim içi/çevrim dışı fark etmez, yanındayım.`,
      `Merhaba ${isim}! Matematik, tasarım, yazılım… hangisi?`,
      `Naber ${isim}? Hemen bir öneri veya kod hazırlayabilirim.`,
      `Hey ${isim}! Başlamak için küçük bir örnek ver, devamını getiririm.`
    ]);
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
  } else if (selamlamaKod.some((kelime) => kucuk.includes(kelime))) {
    const selamKod = merhabaKodlari();
    yanit = selamKod.yanit;
    kod = selamKod.kod;
    kodBaslik = selamKod.kodBaslik;
  } else if (tasarim.some((kelime) => kucuk.includes(kelime))) {
    const b = butonOrnegi();
    yanit = b.yanit;
    kod = b.kod;
    kodBaslik = b.kodBaslik;
  } else if (oyun.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Oyun taktiği: mesafe, sağlık ve kaynak durumunu paylaş. Baskı kurma, savunma veya geri çekilme önerileri sunabilirim.";
  } else if (hesap.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Aritmetik için ifadeyi yaz: örn. 12.5 * 3 - (4 / 2). Toplama, çıkarma, çarpma ve bölme yapabiliyorum.";
  } else if (odev.some((kelime) => kucuk.includes(kelime))) {
    yanit = "Ödevini adım adım planlayalım:";
    kod = satirliListe("Çalışma rehberi", [
      "Konuyu 3 alt başlığa ayır.",
      "Her başlık için 2 kaynak bul (kitap/not/resmî site).",
      "Taslak cümleleri kendi sözlerinle yaz.",
      "Giriş ve sonuç ekle, son okuma yap."
    ]);
    kodBaslik = "Ödev Akışı";
    if (kucuk.includes("yaz")) {
      kod = "Giriş: Konuyu tanıt ve neden önemli olduğunu söyle.\nGelişme: 2-3 paragrafta örnek ve karşılaştırma ver.\nSonuç: Öğrendiklerini özetle, kısa yorum ekle.";
    }
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
    kod = metinUretici(kucuk, isim);
    kodBaslik = "Bilgi Notu";
  } else if (kucuk.includes("şikayet") || kucuk.includes("sorun") || kucuk.includes("çalışmıyor")) {
    yanit = "Sorunu anladım. Beklenen davranışı ve gördüğün sonucu paylaş; hata ayıklama adımlarını birlikte yazalım.";
  } else if (webIstek.some((kelime) => kucuk.includes(kelime))) {
    yanit = webAcik
      ? "Web açık; kur bilgisi, basit aramalar veya örnek veriler için deneme yapabilirim. Tam arama yerine hızlı özetler veriyorum."
      : "Web kapalı. Sol alttaki + menüsünden 🌐 Web'e bağlan dersen bazı güncel verileri çekmeyi denerim, aksi halde yerel bilgiyle yanıtlarım.";
  } else if (kucuk.includes("soru") || kucuk.includes("cevap")) {
    yanit = "Sorunu tam olarak yazarsan doğrudan cevaplayabilirim. Hesaplama, tanım, kod veya şiir fark etmez.";
  } else if (kucuk.includes("zaman") || kucuk.includes("tarih") || kucuk.includes("takvim")) {
    yanit = "Tarih veya zamanlama için bağlamı paylaş; önemli kilometre taşlarını sıralayalım.";
  } else if (kucuk.includes("öneri") || kucuk.includes("fikir") || kucuk.includes("ilham")) {
    yanit = "Yaratıcı fikir modundayım. Konu, hedef kitle ve ton bilgisini verirsen hızlıca öneriler sıralarım.";
  } else if (kucuk.includes("çevirm") || kucuk.includes("translate") || kucuk.includes("çeviri")) {
    yanit = "Çevirmek istediğin metni ve hedef dili yaz; kısa çeviriyle başlayalım.";
  } else if (hataSozlugu.some((kural) => kucuk.includes(kural.tetik))) {
    const kural = hataSozlugu.find((k) => kucuk.includes(k.tetik));
    yanit = kural.aciklama;
  } else if (kucuk.length > 120) {
    yanit = "Uzun bir metin gördüm; önce 3 maddede özetleyebilir, sonra detaylandırabiliriz. İçinde hangi kısmı hedefliyorsun?";
    kod = metinUretici(kucuk, isim);
    kodBaslik = "Özetleme önerisi";
  } else {
    yanit = varyasyonluNot(isim);
    kod = metinUretici(kucuk, isim);
    kodBaslik = "Hızlı İpucu";
  }

  return { yanit, kod, kodBaslik };
}

async function mesajiIsle() {
  const metin = girdi.value.trim();
  if (!metin) return;
  balonEkle("kullanici", metin);
  gecmis.push({ role: "user", content: metin });
  const beklemeMesaji = dusunNotu();
  dusunmeGoster(beklemeMesaji);
  sonuc.textContent = "Düşünüyorum...";
  try {
    const { yanit, kod, kodBaslik } = await cevapOlustur(metin);
    await bekle(220);
    await balonEkle("asistan", yanit, kod, kodBaslik, true);
    gecmis.push({ role: "assistant", content: yanit });
    sonuc.textContent = yanit;
  } catch (err) {
    console.error(err);
    sonuc.textContent = "Bir şeyler ters gitti, tekrar dener misin?";
    balonEkle("asistan", "Bir şeyler ters gitti, tekrar dener misin?");
  } finally {
    dusunmeGizle();
    girdi.value = "";
    girdi.focus();
  }
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

function webTercihiniYukle() {
  const kayit = localStorage.getItem("gaiWebAcik");
  if (kayit === "1") {
    webAcik = true;
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

function artiMenuToggle() {
  const acik = artiMenu.classList.toggle("gizli");
  artiBtn.setAttribute("aria-expanded", (!acik).toString());
}

function artiMenuKapat() {
  artiMenu.classList.add("gizli");
  artiBtn.setAttribute("aria-expanded", "false");
}

function webDurumGuncelle() {
  if (webAcik) {
    webEtiketi.classList.remove("gizli");
    webBaglanMetni.textContent = "Web'den çık";
    webBaglan.setAttribute("aria-pressed", "true");
    const durum = typeof navigator !== "undefined" && navigator.onLine === false
      ? "Web açık ama bağlantı yok gibi görünüyor."
      : "Web'e bağlısın. Canlı veriler denenebilir.";
    sonuc.textContent = durum;
  } else {
    webEtiketi.classList.add("gizli");
    webBaglanMetni.textContent = "Web'e bağlan";
    webBaglan.removeAttribute("aria-pressed");
    sonuc.textContent = "Hazır.";
  }
}

function webBaglanToggle() {
  webAcik = !webAcik;
  localStorage.setItem("gaiWebAcik", webAcik ? "1" : "0");
  webDurumGuncelle();
  artiMenuKapat();
}

function webBaglantiKapat() {
  webAcik = false;
  localStorage.setItem("gaiWebAcik", "0");
  webDurumGuncelle();
}

function baglantilariKur() {
  sohbetiBaslat();
  oturumuYukle();
  webTercihiniYukle();
  gptTercihiniYukle();
  webDurumGuncelle();
  gptDurumGuncelle();

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

  gptBaglan.addEventListener("click", (e) => {
    e.stopPropagation();
    gptModalAc();
    artiMenuKapat();
  });
  gptKaydet.addEventListener("click", gptKaydetHandler);
  gptSil.addEventListener("click", gptSilHandler);
  gptKapat.addEventListener("click", gptBaglantiKapat);
  gptModal.addEventListener("click", (e) => {
    if (e.target === gptModal) gptModalKapat();
  });

  artiBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    artiMenuToggle();
  });

  webBaglan.addEventListener("click", webBaglanToggle);
  webKapat.addEventListener("click", webBaglantiKapat);

  document.addEventListener("click", (e) => {
    if (!artiMenu.contains(e.target) && e.target !== artiBtn) {
      artiMenuKapat();
    }
  });
}

document.addEventListener("DOMContentLoaded", baglantilariKur);
