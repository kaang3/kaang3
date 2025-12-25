const konuOzetleri = {
  "9": [
    "Sayılar: doğal, tam, rasyonel, irrasyonel, reel sayılar.",
    "Üslü ve köklü sayılar, çarpanlar ve katlar.",
    "Oran-orantı, mutlak değer, kümeler, Kartezyen çarpım.",
    "Birinci dereceden denklemler ve basit eşitsizlikler.",
    "Mantık, veri analizi (tablo, grafik, ortalama).",
  ],
  "10": [
    "Polinomlar ve ikinci dereceden denklemler.",
    "Fonksiyonlar: tanım, değer, grafik yorumlama.",
    "Permütasyon, kombinasyon, binom ve olasılık.",
    "İstatistik: ortalama, medyan, mod.",
    "Üçgenler, dörtgenler, çokgenler, çember ve daire.",
  ],
  "11": [
    "Trigonometrik oranlar, denklemler ve grafikler.",
    "Analitik geometri: doğrunun ve dairenin analitiği.",
    "Fonksiyonlarda dönüşümler, üstel fonksiyonlar, logaritma.",
    "Diziler, limit, türev ve artan-azalan incelemeleri.",
  ],
  "12": [
    "İntegral ve alan-hacim uygulamaları.",
    "Türev, limit, trigonometri ve logaritma tekrarları.",
    "Olasılık ve analitik geometri tekrarları.",
    "Çember, daire, katı cisimler ve karma problemler (YKS).",
  ],
};

const ornekSorular = [
  "14 + 67",
  "23 + 213",
  "x = 4, x + 3 nedir?",
  "2x + 5 = 17",
  "3/4 + 5/6",
  "10. sınıf polinom",
  "12. sınıf integral uygulamaları",
];

const degiskenler = {};

const konusmaAlani = document.getElementById("konusma");
const soruInput = document.getElementById("soru");
const gonderBtn = document.getElementById("gonder");
const temizleBtn = document.getElementById("temizle");
const orneklerAlani = document.getElementById("ornekler");
const modal = document.getElementById("modal");
const modalKapat = document.getElementById("modalKapat");
const bilgiButon = document.getElementById("bilgiButon");

function temizleMetin(text) {
  return text.replace(/,/g, ".").replace(/\s+/g, " ").trim();
}

function parseSayi(deger) {
  if (deger.includes("/")) {
    const [a, b] = deger.split("/").map(Number);
    if (!isFinite(a) || !isFinite(b) || b === 0) {
      throw new Error("Geçersiz kesir");
    }
    return a / b;
  }
  const n = Number(deger);
  if (!isFinite(n)) {
    throw new Error("Geçersiz sayı");
  }
  return n;
}

function guvenliIfadeDeger(ifade) {
  const izinli = /^[0-9+\-*/(). x]+$/i;
  if (!izinli.test(ifade)) {
    throw new Error("Sadece matematiksel karakterler kullanılabilir.");
  }

  const degisenIfade = ifade.replace(/[a-z]+/gi, (eslesme) => {
    const anahtar = eslesme.toLowerCase();
    if (!(anahtar in degiskenler)) {
      throw new Error(`${anahtar} değişkeni tanımlı değil.`);
    }
    return degiskenler[anahtar];
  });

  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${degisenIfade});`)();
}

function dogrusalDenklemCoz(ifade) {
  const desen = /^([+-]?[0-9./]*)x\s*([+-]\s*[0-9./]+)?\s*=\s*([+-]?[0-9./]+)$/i;
  const eslesme = temizleMetin(ifade).match(desen);
  if (!eslesme) return null;

  const [, katsayiStr, sabitStr = "+0", sonucStr] = eslesme;
  const a = katsayiStr === "" || katsayiStr === "+" ? 1 : katsayiStr === "-" ? -1 : parseSayi(katsayiStr);
  const b = parseSayi(sabitStr.replace(/\s+/g, ""));
  const c = parseSayi(sonucStr);

  if (a === 0) {
    return b === c ? "Sonsuz çözüm (her x sağlar)." : "Çözüm yok (tutarsız denklem).";
  }

  const x = (c - b) / a;
  return `x = ${x}`;
}

function konuYaniti(soru) {
  const sinifDesen = /(\b9\b|\b10\b|\b11\b|\b12\b)\.? sınıf/i;
  const sinifEslesme = soru.match(sinifDesen);
  if (!sinifEslesme) return null;
  const sinif = sinifEslesme[1];
  const ozet = konuOzetleri[sinif];
  if (!ozet) return null;

  return `${sinif}. sınıf konuları:\n- ${ozet.join("\n- ")}`;
}

function yanitOlustur(soru) {
  const temiz = temizleMetin(soru.toLowerCase().replace(/=\s*$/, ""));

  if (!temiz) return "Lütfen bir matematik sorusu yaz.";

  const konu = konuYaniti(temiz);
  if (konu) return konu;

  const cokluAtamaDesen = /([a-z]+)\s*=\s*([-+0-9./ ()]+)/gi;
  const atamaEslesmeleri = [...temiz.matchAll(cokluAtamaDesen)];
  if (atamaEslesmeleri.length) {
    const temizlenmis = temiz
      .replace(cokluAtamaDesen, "")
      .replace(/[,;]+/g, "")
      .replace(/\s+/g, "");
    if (temizlenmis === "") {
      const bildir = [];
      atamaEslesmeleri.forEach((m) => {
        const isim = m[1];
        const ifade = m[2];
        const sonuc = guvenliIfadeDeger(ifade);
        degiskenler[isim.toLowerCase()] = sonuc;
        bildir.push(`${isim} = ${sonuc}`);
      });
      return `Kaydedildi: ${bildir.join(", ")}`;
    }
  }

  const atamaDesen = /^([a-z]+)\s*=\s*([-+0-9./ ()]+)$/i;
  const atama = temiz.match(atamaDesen);
  if (atama) {
    const [, isim, degerIfade] = atama;
    const sonuc = guvenliIfadeDeger(degerIfade);
    degiskenler[isim.toLowerCase()] = sonuc;
    return `${isim} = ${sonuc} olarak kaydedildi.`;
  }

  const dogrusal = dogrusalDenklemCoz(temiz);
  if (dogrusal) return dogrusal;

  try {
    const sonuc = guvenliIfadeDeger(temiz);
    if (!isFinite(sonuc)) throw new Error("Geçersiz ifade");
    return `Sonuç: ${sonuc}`;
  } catch (e) {
    return `Sadece matematik yanıtları veririm. Hata: ${e.message}`;
  }
}

function mesajEkle(icerik, tip = "bot") {
  const kart = document.createElement("div");
  kart.className = `mesaj ${tip}`;
  kart.textContent = icerik;
  konusmaAlani.appendChild(kart);
  konusmaAlani.scrollTop = konusmaAlani.scrollHeight;
}

function soruyuIsle() {
  const soru = soruInput.value.trim();
  if (!soru) return;
  mesajEkle(soru, "kullanici");
  const yanit = yanitOlustur(soru);
  mesajEkle(yanit, "bot");
  soruInput.value = "";
}

function ornekleriYukle() {
  ornekSorular.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "ornek";
    btn.textContent = s;
    btn.onclick = () => {
      soruInput.value = s;
      soruInput.focus();
    };
    orneklerAlani.appendChild(btn);
  });
}

gonderBtn.addEventListener("click", soruyuIsle);
soruInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") soruyuIsle();
});

temizleBtn.addEventListener("click", () => {
  konusmaAlani.innerHTML = "";
  Object.keys(degiskenler).forEach((k) => delete degiskenler[k]);
});

bilgiButon.addEventListener("click", () => {
  modal.classList.remove("gizli");
});

modalKapat.addEventListener("click", () => {
  modal.classList.add("gizli");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("gizli");
});

ornekleriYukle();
mesajEkle("Merhaba! Matematik sorularını yaz, sadece matematik yanıtları veririm.");
