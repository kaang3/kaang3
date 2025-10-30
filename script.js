const mesajlarKutusu = document.getElementById("mesajlar");
const form = document.getElementById("girdiFormu");
const kullaniciMesajiInput = document.getElementById("kullaniciMesaji");
const gonderButon = form.querySelector("button[type='submit']");
const kilitUyari = document.getElementById("kilitUyari");
const sohbetListesi = document.getElementById("sohbetListesi");
const yeniSohbetButonu = document.getElementById("yeniSohbet");

const oturumFormu = document.getElementById("oturumFormu");
const oturumEmail = document.getElementById("oturumEmail");
const oturumSifre = document.getElementById("oturumSifre");
const oturumBilgisi = document.getElementById("oturumBilgisi");
const oturumKapat = document.getElementById("oturumKapat");
const aktifEmail = document.getElementById("aktifEmail");

let dusunmeSatiri = null;
let sesContext;

const durum = {
  loggedIn: false,
  userEmail: null,
  history: [],
  entities: {},
  lastEntity: null,
  lastTopic: null,
  topicMemory: {},
  pendingOffer: null,
  lastAssistantQuestion: null,
  creativeState: null,
  sohbetler: [],
  aktifSohbetId: null,
  sohbetSayaci: 0
};

const sozluk = {
  muktedir: { kelime: "muktedir", tanim: "Bir işi yapmaya gücü yeten, kudretli." },
  tevazu: { kelime: "tevazu", tanim: "Alçakgönüllülük, kendini olduğundan büyük görmeme." },
  feraset: { kelime: "feraset", tanim: "Olayları sezgisel olarak kavrama ve doğru değerlendirme yetisi." },
  muspet: { kelime: "müspet", tanim: "Olumlu, yararlı, pozitif." },
  izlek: { kelime: "izlek", tanim: "Bir edebî eserde olayların ilerlediği yol, tema." },
  sukunet: { kelime: "sükûnet", tanim: "Sakinlik, dinginlik." },
  munazara: { kelime: "münazara", tanim: "Belirli kurallar çerçevesinde yapılan tartışma." },
  tezgah: { kelime: "tezgâh", tanim: "Bir işin hazırlandığı düzenek veya kurulan plan." },
  yordam: { kelime: "yordam", tanim: "İzlenen yöntem, yol, usul." },
  muhakeme: { kelime: "muhakeme", tanim: "Akıl yürütme, yargıya varma yetisi." },
  bilakis: { kelime: "bilakis", tanim: "Aksine, tam tersine." }
};

const bilgiKumeleri = [
  {
    id: "matematik",
    anahtarlar: ["matematik", "aritmetik", "sayı", "denklem", "geometri", "hesap", "problem"],
    yanitlar: [
      "Matematikte problemleri çözerken önce verilenleri sadeleştirip işlem sırasını belirlemek işleri hızlandırır.",
      "Bir toplamı zihinden çözerken sayıları onluklarına ayırıp parça parça eklemek pratik bir taktiktir.",
      "Geometride şekilleri parçalara ayırarak alan veya açı hesaplamak daha kolay hale gelir."
    ]
  },
  {
    id: "bilim",
    anahtarlar: ["bilim", "fizik", "kimya", "biyoloji", "deney", "evren", "gezegen"],
    yanitlar: [
      "Bilimsel yöntemde gözlem, hipotez kurma, deney yapma ve sonuçları yorumlama adımları birbirini takip eder.",
      "Bir deney tasarlarken tek bir değişkeni kontrol etmek sonucu yorumlamayı kolaylaştırır.",
      "Gezegenlerin yörüngeleri elips biçimindedir; bu bilgi Kepler yasalarıyla açıklanır."
    ]
  },
  {
    id: "teknoloji",
    anahtarlar: ["yazılım", "uygulama", "program", "teknoloji", "kod", "veri", "algoritma"],
    yanitlar: [
      "Temiz kod, fonksiyonları tek sorumluluğa indirgemek ve okunabilir isimler kullanmakla başlar.",
      "Veri yapısı seçimi performansı doğrudan etkiler; örneğin arama için hash tablosu çoğu zaman avantaj sağlar.",
      "Algoritma tasarlarken önce problemi küçük adımlara bölmek süreci sadeleştirir."
    ]
  },
  {
    id: "plan",
    anahtarlar: ["plan", "hedef", "program", "alışkanlık", "motivasyon", "zaman", "takvim"],
    yanitlar: [
      "Hedeflerini haftalık ve günlük parçalara bölmek motivasyonunu canlı tutar.",
      "Pomodoro tekniği gibi odak yöntemleri kısa molalarla verimi artırır.",
      "İlerlemeni gözden geçirmek için gün sonunda üç küçük kazanımı not etmek iyi bir alışkanlıktır."
    ]
  },
  {
    id: "dil",
    anahtarlar: ["kelime", "anlam", "dilbilgisi", "yazım", "cümle", "metin", "şiir"],
    yanitlar: [
      "Yeni bir kelimeyi öğrenirken onu bir cümlede kullanmak kalıcılığını artırır.",
      "Metin yazarken önce ana fikri belirlemek, paragrafların yönünü netleştirir.",
      "Şiirde ölçü ve kafiyeyi çözümlemek yazarın ritmini anlamaya yardımcı olur."
    ]
  },
  {
    id: "gundem",
    anahtarlar: ["gündem", "haber", "durum", "soru", "konu", "yorum", "analiz"],
    yanitlar: [
      "Bir konuyu tartışırken farklı kaynaklardan veri toplamak görüşünü güçlendirir.",
      "Sorunu netleştirmek için önce 'ne biliyorum, ne öğrenmek istiyorum' sorularını sormak faydalıdır.",
      "Gözlemlerini paylaşman bana daha isabetli yorum yapma fırsatı verir."
    ]
  }
];

const creativeSablonlari = {
  poem: {
    giris: "İşte sana birkaç dizeden oluşan kısa bir şiir:",
    icerik: (tema = "") => `Bir nefeslik anda ${tema || "kelimeler"} ışıldar,\nSessizliğin içinden yavaşça umut sızar.\nAdımların yankısı ufka çizgi çizer,\nGönlün dilediği her düş bir gün kanatlanır.`,
    kapanis: "Başka bir tür ister misin?"
  },
  story: {
    giris: "Hızlıca bir mini hikâye toparladım:",
    icerik: (tema = "bir sabah") => `Bu ${tema} Ayşe küçük defterine yeni bir fikir not etti.\nNot, gün içinde karşılaştığı herkese küçük bir iyilik yapmaktı.\nAkşam olduğunda defterindeki tek cümle onlarca gülümsemeye dönüşmüştü.`,
    kapanis: "Devamını merak edersen ayrıntı ekleyebilirim."
  }
};

const fallbackTeklifleri = [
  "Buradayım; neye odaklanmak istersen birlikte ilerleyebiliriz.",
  "Konuyu biraz daha açarsan sana daha net yardımcı olabilirim.",
  "Hazırım, birkaç ayrıntı paylaşırsan hemen çözüme odaklanırım."
];

function yeniBosSohbetDurumu() {
  return {
    entities: {},
    lastEntity: null,
    lastTopic: null,
    topicMemory: {},
    pendingOffer: null,
    creativeState: null
  };
}

function aktifSohbetObjesi() {
  return durum.sohbetler.find((sohbet) => sohbet.id === durum.aktifSohbetId) || null;
}

function formatSohbetZamani(tarih) {
  if (!tarih) {
    return "";
  }
  try {
    return new Date(tarih).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "";
  }
}

function sohbetListesiniYenile() {
  if (!sohbetListesi) {
    return;
  }
  sohbetListesi.innerHTML = "";
  if (!durum.sohbetler.length) {
    const bos = document.createElement("li");
    bos.className = "sohbet-bos";
    bos.textContent = "Henüz sohbet yok.";
    sohbetListesi.appendChild(bos);
    return;
  }
  durum.sohbetler.forEach((sohbet) => {
    sohbetListesi.appendChild(sohbetKartiniOlustur(sohbet));
  });
}

function sohbetKartiniOlustur(sohbet) {
  const li = document.createElement("li");
  li.className = "sohbet-karti";
  if (sohbet.id === durum.aktifSohbetId) {
    li.classList.add("aktif");
    li.setAttribute("aria-current", "true");
  }
  li.setAttribute("role", "button");
  li.tabIndex = 0;

  const baslik = document.createElement("h3");
  baslik.textContent = sohbet.baslik || "Sohbet";
  li.appendChild(baslik);

  const ozet = document.createElement("p");
  ozet.className = "sohbet-ozet";
  if (sohbet.mesajlar.length) {
    const sonMesaj = sohbet.mesajlar[sohbet.mesajlar.length - 1].metin;
    ozet.textContent = sonMesaj.length > 80 ? `${sonMesaj.slice(0, 77)}…` : sonMesaj;
  } else {
    ozet.textContent = "Henüz mesaj yok";
  }
  li.appendChild(ozet);

  const zaman = document.createElement("p");
  zaman.className = "sohbet-zaman";
  zaman.textContent = formatSohbetZamani(sohbet.guncellenme || sohbet.olusturma);
  li.appendChild(zaman);

  const sec = () => sohbetSec(sohbet.id);
  li.addEventListener("click", sec);
  li.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      sec();
    }
  });

  return li;
}

function senkronizeDurum() {
  const aktif = aktifSohbetObjesi();
  if (!aktif) {
    return;
  }
  aktif.durum.entities = durum.entities;
  aktif.durum.lastEntity = durum.lastEntity;
  aktif.durum.lastTopic = durum.lastTopic;
  aktif.durum.topicMemory = durum.topicMemory;
  aktif.durum.pendingOffer = durum.pendingOffer;
  aktif.durum.creativeState = durum.creativeState;
}

function sohbetMesajlariniYukle(sohbet) {
  mesajlarKutusu.innerHTML = "";
  sohbet.mesajlar.forEach((kayit) => {
    mesajOlustur(kayit.rol === "user" ? "kullanici" : "yapayzeka", kayit.metin, { kaydet: false });
  });
}

function sohbetSec(sohbetId) {
  if (!sohbetId || sohbetId === durum.aktifSohbetId) {
    return;
  }
  senkronizeDurum();
  const hedef = durum.sohbetler.find((sohbet) => sohbet.id === sohbetId);
  if (!hedef) {
    return;
  }
  durum.aktifSohbetId = hedef.id;
  durum.history = hedef.mesajlar;
  durum.entities = hedef.durum.entities;
  durum.lastEntity = hedef.durum.lastEntity;
  durum.lastTopic = hedef.durum.lastTopic;
  durum.topicMemory = hedef.durum.topicMemory;
  durum.pendingOffer = hedef.durum.pendingOffer;
  durum.creativeState = hedef.durum.creativeState;
  sohbetMesajlariniYukle(hedef);
  sohbetListesiniYenile();
}

function yeniSohbetBaslat(ayar = {}) {
  senkronizeDurum();
  const tarih = new Date();
  durum.sohbetSayaci += 1;
  const varsayilanBaslik = ayar.baslik || `Sohbet ${durum.sohbetSayaci}`;
  const sohbet = {
    id: `sohbet-${tarih.getTime()}-${Math.floor(Math.random() * 1000)}`,
    baslik: varsayilanBaslik,
    olusturma: tarih,
    guncellenme: tarih,
    mesajlar: [],
    ilkKullaniciMesaji: false,
    varsayilanBaslik,
    durum: yeniBosSohbetDurumu()
  };
  durum.sohbetler = [sohbet, ...durum.sohbetler];
  durum.aktifSohbetId = sohbet.id;
  durum.history = sohbet.mesajlar;
  durum.entities = sohbet.durum.entities;
  durum.lastEntity = sohbet.durum.lastEntity;
  durum.lastTopic = sohbet.durum.lastTopic;
  durum.topicMemory = sohbet.durum.topicMemory;
  durum.pendingOffer = sohbet.durum.pendingOffer;
  durum.creativeState = sohbet.durum.creativeState;
  mesajlarKutusu.innerHTML = "";
  sohbetListesiniYenile();
  return sohbet;
}

function konusmaKaydiEkle(tur, metin) {
  const aktif = aktifSohbetObjesi();
  if (!aktif) {
    return;
  }
  const rol = tur === "kullanici" ? "user" : "assistant";
  aktif.mesajlar.push({ rol, metin });
  aktif.guncellenme = new Date();
  if (rol === "user" && !aktif.ilkKullaniciMesaji) {
    aktif.baslik = metin.length > 40 ? `${metin.slice(0, 37)}…` : metin;
    aktif.ilkKullaniciMesaji = true;
  }
  durum.sohbetler = [aktif, ...durum.sohbetler.filter((sohbet) => sohbet.id !== aktif.id)];
  durum.aktifSohbetId = aktif.id;
  senkronizeDurum();
  sohbetListesiniYenile();
}

const additionSet = new Set(["ekle", "ekledi", "ekledim", "ekledik", "eklersen", "ekleyince", "topla", "toplam", "topladi", "topladı", "arti", "artti", "arttı", "artir", "artır", "artirdi", "artırdı", "kazandi", "kazandı", "aldi", "aldı", "alinca", "alınca", "daha", "koydu", "katildi", "katıldı", "cogaldi", "çoğaldi", "çoğaldı", "yukseldi", "yükseldi", "birikti"]);
const subtractionSet = new Set(["cikar", "çikar", "cikardi", "çıkardı", "cikti", "çıktı", "kaldi", "kaldı", "azaldi", "azaldı", "verdi", "yedi", "yiyince", "harcadi", "harcadı", "kaybetti", "dusurdu", "düşürdü", "atti", "attı", "azaltti", "azalttı"]);
const baseSet = new Set(["var", "vardir", "vardi", "sahip", "bulunuyor", "mevcut", "oldu", "sayisi", "adet"]);
const questionSet = new Set(["kac", "kaç", "kaldimi", "ne", "nedir", "kaldı", "kaldi", "sonuc"]);
const skipAfterNumber = new Set([
  "tane",
  "adet",
  "tanesi",
  "tanesini",
  "tanesine",
  "tanelerini",
  "kadar",
  "daha",
  "fazla",
  "fazlasi",
  "fazlasini",
  "ini",
  "in",
  "ni",
  "mi",
  "mu",
  "oldu",
  "olur",
  "olsun",
  "olsa",
  "olaydi",
  "olacak",
  "oldugu",
  "olacakti"
]);

function degrade(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]/gi, "");
}

const greetingKelimeleri = new Set(
  [
    "merhaba",
    "selam",
    "selamlar",
    "hey",
    "günaydın",
    "iyi akşamlar",
    "iyi geceler",
    "selamün aleyküm",
    "selamün",
    "selamun",
    "aleyküm",
    "aleykum"
  ].map((kelime) => degrade(kelime))
);

const greetingEkleri = new Set(
  ["nasılsın", "nasilsin", "naber", "iyi", "müsün", "musun", "misin", "mısın", "nasiller", "oralar", "buralar"].map((kelime) =>
    degrade(kelime)
  )
);

function normalizeMetin(metin) {
  return metin.toLowerCase("tr-TR");
}

function tokenize(metin) {
  return normalizeMetin(metin)
    .replace(/[^a-zçğıöşü0-9\s]/gi, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function sanitizeNumberToken(token) {
  let temiz = token.replace(/[^0-9a-zçğıöşü]/gi, "");
  const sonEkler = ["inin", "inin", "inin", "ini", "ını", "unu", "ünü", "sini", "sını", "sunu", "sünü", "tane", "tanesi", "tanesini", "adet", "er", "ar", "şer", "ser"];
  for (const ek of sonEkler) {
    if (temiz.endsWith(ek)) {
      temiz = temiz.slice(0, -ek.length);
      break;
    }
  }
  return temiz;
}

const numberWordMap = new Map([
  ["sifir", 0],
  ["bir", 1],
  ["iki", 2],
  ["uc", 3],
  ["uc", 3],
  ["dort", 4],
  ["bes", 5],
  ["alti", 6],
  ["alti", 6],
  ["yedi", 7],
  ["sekiz", 8],
  ["dokuz", 9],
  ["on", 10],
  ["onbir", 11],
  ["oniki", 12],
  ["onuc", 13],
  ["ondort", 14],
  ["onbes", 15],
  ["onalti", 16],
  ["onyedi", 17],
  ["onsekiz", 18],
  ["ondokuz", 19],
  ["yirmi", 20],
  ["otuz", 30],
  ["kirk", 40],
  ["elli", 50],
  ["altmis", 60],
  ["yetmis", 70],
  ["seksen", 80],
  ["doksan", 90],
  ["yuz", 100]
]);

function extractNumbers(tokens) {
  const numbers = [];
  let current = 0;
  let building = false;

  for (const rawToken of tokens) {
    let token = sanitizeNumberToken(rawToken);
    if (!token) {
      if (building) {
        numbers.push(current);
        current = 0;
        building = false;
      }
      continue;
    }

    const digitMatch = token.match(/^\d+/);
    if (digitMatch) {
      if (building) {
        numbers.push(current);
        current = 0;
        building = false;
      }
      numbers.push(parseInt(digitMatch[0], 10));
      continue;
    }

    const plain = degrade(token);
    if (!plain) {
      if (building) {
        numbers.push(current);
        current = 0;
        building = false;
      }
      continue;
    }

    const direct = numberWordMap.get(plain);
    if (typeof direct === "number") {
      current += direct;
      building = true;
      continue;
    }

    if (building) {
      numbers.push(current);
      current = 0;
      building = false;
    }
  }

  if (building) {
    numbers.push(current);
  }

  return numbers;
}

function includesWord(tokens, set) {
  return tokens.some((token) => set.has(degrade(token)) || set.has(token));
}

function stripPossessive(word) {
  let temiz = word.replace(/[’']/g, "");
  const plain = degrade(temiz);
  const ekler = ["nin", "nın", "nun", "nün", "in", "ın", "un", "ün"];
  for (const ek of ekler) {
    if (plain.endsWith(degrade(ek)) && temiz.length > ek.length) {
      temiz = temiz.slice(0, temiz.length - ek.length);
      break;
    }
  }
  return degrade(temiz);
}

function stripItem(word) {
  let temiz = word.replace(/[’']/g, "");
  const plain = degrade(temiz);
  const ekler = ["si", "sı", "su", "sü", "i", "ı", "u", "ü", "yu", "yü"];
  for (const ek of ekler) {
    if (plain.endsWith(degrade(ek)) && temiz.length > ek.length + 1) {
      temiz = temiz.slice(0, temiz.length - ek.length);
      break;
    }
  }
  return degrade(temiz);
}

function capitalize(word) {
  if (!word) {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function detectEntity(tokens) {
  let owner = null;
  let item = null;
  let baseValue = null;

  for (const token of tokens) {
    const stripped = stripPossessive(token);
    if (stripped && stripped !== degrade(token)) {
      owner = stripped;
      break;
    }
    if (!owner) {
      const plain = degrade(token);
      const ekler = ["nin", "nın", "nun", "nün", "in", "ın", "un", "ün"];
      for (const ek of ekler) {
        if (plain.endsWith(ek) && plain.length > ek.length) {
          owner = plain.slice(0, -ek.length);
          break;
        }
      }
      if (owner) {
        break;
      }
    }
  }

  const numberIndex = tokens.findIndex((tok) => {
    const plain = degrade(sanitizeNumberToken(tok));
    if (!plain) {
      return false;
    }
    if (/^\d+$/.test(plain)) {
      return true;
    }
    return numberWordMap.has(plain);
  });

  if (numberIndex !== -1) {
    for (let i = numberIndex + 1; i < tokens.length; i++) {
      const candidate = tokens[i];
      const plain = degrade(candidate);
      if (skipAfterNumber.has(plain) || additionSet.has(plain) || subtractionSet.has(plain) || questionSet.has(plain)) {
        continue;
      }
      const cleaned = stripItem(candidate);
      if (cleaned.length > 1) {
        item = cleaned;
        break;
      }
    }
  }

  if (numberIndex !== -1) {
    const erkenParca = tokens.slice(0, numberIndex + 2);
    if (erkenParca.some((tok) => baseSet.has(degrade(tok)))) {
      const sayilar = extractNumbers(erkenParca);
      if (sayilar.length) {
        baseValue = sayilar[sayilar.length - 1];
      }
    }
  }

  return { owner, item, baseValue };
}

function splitClauses(metin) {
  return metin
    .split(/[\.,;!?]+/)
    .map((parca) => parca.trim())
    .filter(Boolean);
}

function formatEntity(owner, item) {
  const ownerAdi = owner ? `${capitalize(owner)}'in` : "Toplam";
  const itemAdi = item ? `${capitalize(item)} sayısı` : "değer";
  return { ownerAdi, itemAdi };
}

function handleMath(metin, tokens) {
  const numbers = extractNumbers(tokens);
  const hasMathCue = numbers.length > 1 || includesWord(tokens, additionSet) || includesWord(tokens, subtractionSet) || includesWord(tokens, baseSet);
  const soruVar = includesWord(tokens, questionSet) || normalizeMetin(metin).includes("kaç");

  if (!hasMathCue && !soruVar) {
    return null;
  }

  const entity = detectEntity(tokens);
  let owner = entity.owner;
  let item = entity.item;
  let sonuc = entity.baseValue != null ? entity.baseValue : null;
  let hesapBaslangici = sonuc;
  const islemler = [];

  if (!owner && durum.lastEntity) {
    owner = durum.lastEntity.owner;
  }
  if (!item && durum.lastEntity) {
    item = durum.lastEntity.item;
  }

  if (owner && item && sonuc == null) {
    const kayit = durum.entities[owner];
    if (kayit && typeof kayit[item] === "number") {
      sonuc = kayit[item];
      hesapBaslangici = sonuc;
    }
  }

  const clauses = splitClauses(metin);
  let islemYapildi = false;
  let ilkSayi = null;

  for (const clause of clauses) {
    const clauseTokens = tokenize(clause);
    if (!clauseTokens.length) {
      continue;
    }
    const clauseNumbers = extractNumbers(clauseTokens);
    if (!clauseNumbers.length) {
      continue;
    }
    const clauseHasBase = includesWord(clauseTokens, baseSet);
    let numbersForOps = clauseNumbers;
    if (clauseHasBase && clauseNumbers.length) {
      const deger = clauseNumbers[0];
      sonuc = deger;
      hesapBaslangici = deger;
      ilkSayi = deger;
      numbersForOps = clauseNumbers.slice(1);
      islemYapildi = true;
    }
    if (ilkSayi == null && clauseNumbers.length) {
      ilkSayi = clauseNumbers[0];
    }
    if (sonuc == null && clauseNumbers.length) {
      sonuc = clauseNumbers[0];
      hesapBaslangici = sonuc;
    }
    const addition = includesWord(clauseTokens, additionSet);
    const subtraction = includesWord(clauseTokens, subtractionSet);
    if (!numbersForOps.length) {
      continue;
    }
    const toplamDeger = numbersForOps.reduce((acc, sayi) => acc + sayi, 0);
    if (addition && !subtraction) {
      sonuc += toplamDeger;
      islemler.push({ tur: "add", deger: toplamDeger });
      islemYapildi = true;
      continue;
    }
    if (subtraction && !addition) {
      sonuc -= toplamDeger;
      islemler.push({ tur: "sub", deger: toplamDeger });
      islemYapildi = true;
      continue;
    }
    if (addition && subtraction) {
      const sonTetik = [...clauseTokens]
        .reverse()
        .find((tok) => additionSet.has(degrade(tok)) || subtractionSet.has(degrade(tok)));
      if (sonTetik && subtractionSet.has(degrade(sonTetik))) {
        sonuc -= toplamDeger;
        islemler.push({ tur: "sub", deger: toplamDeger });
      } else {
        sonuc += toplamDeger;
        islemler.push({ tur: "add", deger: toplamDeger });
      }
      islemYapildi = true;
      continue;
    }
  }

  if (sonuc == null && numbers.length >= 1) {
    sonuc = numbers[0];
    hesapBaslangici = sonuc;
    ilkSayi = numbers[0];
    if (numbers.length > 1) {
      const geriKalan = numbers.slice(1).reduce((acc, sayi) => acc + sayi, 0);
      if (includesWord(tokens, subtractionSet) || normalizeMetin(metin).includes("kald")) {
        sonuc -= geriKalan;
        islemler.push({ tur: "sub", deger: geriKalan });
      } else {
        sonuc += geriKalan;
        islemler.push({ tur: "add", deger: geriKalan });
      }
      islemYapildi = true;
    }
  }

  if (sonuc == null) {
    return null;
  }

  if (sonuc < 0) {
    sonuc = 0;
  }

  if (owner && item) {
    if (!durum.entities[owner]) {
      durum.entities[owner] = {};
    }
    durum.entities[owner][item] = sonuc;
    durum.lastEntity = { owner, item };
  }

  const { ownerAdi, itemAdi } = formatEntity(owner, item);
  let yanit;
  const metinKucuk = normalizeMetin(metin);
  if (includesWord(tokens, subtractionSet) || metinKucuk.includes("kald")) {
    yanit = `${ownerAdi} ${itemAdi} ${sonuc} kaldı.`;
  } else if (includesWord(tokens, additionSet)) {
    yanit = `${ownerAdi} ${itemAdi} ${sonuc} oldu.`;
  } else if (soruVar) {
    yanit = `${ownerAdi} ${itemAdi} ${sonuc}.`;
  } else {
    yanit = `${ownerAdi} ${itemAdi} ${sonuc} olarak kaydettim.`;
  }

  if ((islemYapildi || (islemler.length && hesapBaslangici != null)) && hesapBaslangici != null) {
    const adimlar = islemler
      .map((adim) => `${adim.tur === "add" ? "+" : "-"} ${adim.deger}`)
      .join(" ");
    if (adimlar) {
      yanit += ` (Başlangıç ${hesapBaslangici} ${adimlar}.)`;
    }
  }

  return yanit;
}

function handleDictionary(tokens) {
  for (const token of tokens) {
    const plain = degrade(token);
    const kayit = sozluk[plain];
    if (kayit) {
      const kelime = kayit.kelime.charAt(0).toUpperCase() + kayit.kelime.slice(1);
      return `${kelime}: ${kayit.tanim}`;
    }
  }
  return null;
}

function handleCreative(tokens) {
  const metin = tokens.join(" ");
  if (metin.includes("siir") || metin.includes("şiir")) {
    if (tokens.some((tok) => degrade(tok).includes("yaz"))) {
      const sablon = creativeSablonlari.poem;
      return `${sablon.giris}\n${sablon.icerik()}\n${sablon.kapanis}`;
    }
  }
  if (metin.includes("hikaye") || metin.includes("hikâye")) {
    if (tokens.some((tok) => degrade(tok).includes("yaz"))) {
      const sablon = creativeSablonlari.story;
      return `${sablon.giris}\n${sablon.icerik()}\n${sablon.kapanis}`;
    }
  }
  return null;
}

function handleGreeting(tokens, hamMetin) {
  const metinKucuk = normalizeMetin(hamMetin);
  const hasGreetingWord = tokens.some((tok) => greetingKelimeleri.has(degrade(tok)));
  if (!hasGreetingWord) {
    return null;
  }
  const sadeceSelam = tokens.every((tok) => {
    const plain = degrade(tok);
    if (!plain) {
      return true;
    }
    return greetingKelimeleri.has(plain) || greetingEkleri.has(plain) || plain === "ya" || plain === "selamunaleykum";
  });
  if (!sadeceSelam) {
    return null;
  }
  if (metinKucuk.includes("nasilsin") || metinKucuk.includes("nasılsın")) {
    return "Merhaba! Gayet iyiyim, senin için ne yapabilirim?";
  }
  return "Merhaba! Buradayım, sorularını dinlemeye hazırım.";
}

function handleKnowledge(tokens) {
  let enIyi = { puan: 0, kum: null };

  for (const kum of bilgiKumeleri) {
    let puan = 0;
    for (const kelime of kum.anahtarlar) {
      if (tokens.some((tok) => degrade(tok) === degrade(kelime))) {
        puan += 2;
      }
      if (tokens.join(" ").includes(kelime)) {
        puan += 1;
      }
    }
    if (puan > enIyi.puan) {
      enIyi = { puan, kum };
    }
  }

  if (!enIyi.kum || enIyi.puan === 0) {
    return null;
  }

  const kum = enIyi.kum;
  const indeks = durum.topicMemory[kum.id] || 0;
  const yanit = kum.yanitlar[indeks % kum.yanitlar.length];
  durum.topicMemory[kum.id] = (indeks + 1) % kum.yanitlar.length;
  durum.lastTopic = { id: kum.id };
  return yanit;
}

function handleFollowup(tokens) {
  const metin = tokens.join(" ");
  if (!durum.lastTopic) {
    return null;
  }
  if (metin.includes("devam") || metin.includes("daha") || metin.includes("sürdür")) {
    const kum = bilgiKumeleri.find((k) => k.id === durum.lastTopic.id);
    if (!kum) {
      return null;
    }
    const indeks = durum.topicMemory[kum.id] || 0;
    const yanit = kum.yanitlar[indeks % kum.yanitlar.length];
    durum.topicMemory[kum.id] = (indeks + 1) % kum.yanitlar.length;
    return `Devam edelim: ${yanit}`;
  }
  return null;
}

function handlePendingOffer(tokens) {
  if (!durum.pendingOffer) {
    return null;
  }
  const metin = tokens.join(" ");
  if (metin === "evet" || metin.includes("evet")) {
    const teklif = durum.pendingOffer;
    durum.pendingOffer = null;
    if (teklif.tur === "poem") {
      const sablon = creativeSablonlari.poem;
      return `${sablon.giris}\n${sablon.icerik()}\n${sablon.kapanis}`;
    }
    if (teklif.tur === "plan") {
      return "Başlamak için üç adımlı bir plan öneriyorum: 1) Hedefini netleştir, 2) Güne üç öncelik belirle, 3) Gün sonunda kendine kısa bir değerlendirme yap.";
    }
    if (teklif.tur === "motivation") {
      return "Kendine küçük hedefler koyup başardıkça kutlamayı unutma; ilerleme küçük adımlarla büyür.";
    }
  }
  if (metin === "hayir" || metin.includes("hayır") || metin.includes("hayir")) {
    durum.pendingOffer = null;
    return "Tamam, nasıl istersen. Başka bir konuda yardımcı olabilirim.";
  }
  return null;
}

function fallbackYaniti() {
  durum.pendingOffer = null;
  return fallbackTeklifleri[Math.floor(Math.random() * fallbackTeklifleri.length)];
}

function yanitUret(metin) {
  const tokens = tokenize(metin);

  const bekleyen = handlePendingOffer(tokens);
  if (bekleyen) {
    return bekleyen;
  }

  const selam = handleGreeting(tokens, metin);
  if (selam) {
    return selam;
  }

  const matematik = handleMath(metin, tokens);
  if (matematik) {
    return matematik;
  }

  const sozlukYanit = handleDictionary(tokens);
  if (sozlukYanit) {
    return sozlukYanit;
  }

  const devam = handleFollowup(tokens);
  if (devam) {
    return devam;
  }

  const creative = handleCreative(tokens);
  if (creative) {
    return creative;
  }

  const bilgi = handleKnowledge(tokens);
  if (bilgi) {
    return bilgi;
  }

  return fallbackYaniti();
}

function mesajOlustur(tur, metin, secenekler = {}) {
  const satir = document.createElement("div");
  const thinking = Boolean(secenekler.thinking);
  const kaydet = secenekler.kaydet !== undefined ? secenekler.kaydet : !thinking;
  satir.className = `mesaj ${tur}${thinking ? " dusunme" : ""}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${tur === "kullanici" ? "avatar-kullanici" : "avatar-yapayzeka"}`;
  avatar.textContent = tur === "kullanici" ? "Sen" : "G";
  if (thinking && tur === "yapayzeka") {
    avatar.classList.add("donuyor");
  }

  const icerik = document.createElement("div");
  icerik.className = "icerik";

  if (thinking) {
    const isaret = document.createElement("span");
    isaret.className = "dusunme-isaret";
    const metinSpan = document.createElement("span");
    metinSpan.textContent = metin || "Gai düşünüyor...";
    icerik.appendChild(isaret);
    icerik.appendChild(metinSpan);
  } else {
    icerik.textContent = metin;
  }

  satir.appendChild(avatar);
  satir.appendChild(icerik);
  mesajlarKutusu.appendChild(satir);
  mesajlarKutusu.scrollTop = mesajlarKutusu.scrollHeight;
  if (kaydet) {
    konusmaKaydiEkle(tur, metin);
  }
  return satir;
}

function sistemMesaji(metin) {
  mesajOlustur("yapayzeka", metin);
}

function kullaniciMesaji(metin) {
  mesajOlustur("kullanici", metin);
}

function dusunmeBaslat() {
  if (dusunmeSatiri && dusunmeSatiri.isConnected) {
    dusunmeSatiri.remove();
  }
  dusunmeSatiri = mesajOlustur("yapayzeka", "Gai düşünüyor...", { thinking: true });
  return dusunmeSatiri;
}

function oynatTitremeSesi() {
  if (typeof AudioContext === "undefined" && typeof webkitAudioContext === "undefined") {
    return;
  }
  if (!sesContext) {
    const Context = window.AudioContext || window.webkitAudioContext;
    sesContext = new Context();
  }
  sesContext.resume().then(() => {
    const oscil = sesContext.createOscillator();
    const gain = sesContext.createGain();
    oscil.type = "triangle";
    const baslangic = sesContext.currentTime;
    oscil.frequency.setValueAtTime(420, baslangic);
    oscil.frequency.linearRampToValueAtTime(680, baslangic + 0.16);
    oscil.frequency.linearRampToValueAtTime(520, baslangic + 0.3);
    gain.gain.setValueAtTime(0.0001, baslangic);
    gain.gain.exponentialRampToValueAtTime(0.08, baslangic + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, baslangic + 0.32);
    oscil.connect(gain);
    gain.connect(sesContext.destination);
    oscil.start(baslangic);
    oscil.stop(baslangic + 0.35);
  }).catch(() => {
    // sessizce yoksay
  });
}

function sohbetiTemizle() {
  mesajlarKutusu.innerHTML = "";
  const aktif = aktifSohbetObjesi();
  if (aktif) {
    aktif.mesajlar = [];
    aktif.ilkKullaniciMesaji = false;
    aktif.durum = yeniBosSohbetDurumu();
    aktif.guncellenme = new Date();
    if (aktif.varsayilanBaslik) {
      aktif.baslik = aktif.varsayilanBaslik;
    }
    durum.history = aktif.mesajlar;
    durum.entities = aktif.durum.entities;
    durum.lastEntity = aktif.durum.lastEntity;
    durum.lastTopic = aktif.durum.lastTopic;
    durum.topicMemory = aktif.durum.topicMemory;
    durum.pendingOffer = aktif.durum.pendingOffer;
    durum.creativeState = aktif.durum.creativeState;
  } else {
    durum.history = [];
    durum.entities = {};
    durum.lastEntity = null;
    durum.lastTopic = null;
    durum.topicMemory = {};
    durum.pendingOffer = null;
    durum.creativeState = null;
  }
  sohbetListesiniYenile();
}

function oturumDurumunuGuncelle() {
  const aktif = durum.loggedIn;
  if (aktif) {
    oturumFormu.classList.add("gizli");
    oturumBilgisi.classList.remove("gizli");
    aktifEmail.textContent = durum.userEmail;
  } else {
    oturumFormu.classList.remove("gizli");
    oturumBilgisi.classList.add("gizli");
    aktifEmail.textContent = "";
    oturumEmail.value = "";
    oturumSifre.value = "";
  }
  kullaniciMesajiInput.disabled = !aktif;
  gonderButon.disabled = !aktif;
  kilitUyari.classList.toggle("gizli", aktif);
  if (aktif && !mesajlarKutusu.children.length) {
    sistemMesaji("Merhaba! Ben Gai. Matematikten günlük planlamaya kadar aklındaki konularda sana eşlik etmeye hazırım.");
  }
}

if (yeniSohbetButonu) {
  yeniSohbetButonu.addEventListener("click", () => {
    yeniSohbetBaslat();
    if (durum.loggedIn) {
      sistemMesaji("Yeni bir sayfa açtık. Bugün ne konuşmak istersin?");
    } else {
      sistemMesaji("Yeni bir sohbet hazır. Oturum açtığında mesaj gönderebilirsin.");
    }
  });
}

if (oturumFormu) {
  oturumFormu.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = oturumEmail.value.trim();
    const sifre = oturumSifre.value.trim();
    if (!email || !sifre) {
      return;
    }
    durum.loggedIn = true;
    durum.userEmail = email;
    yeniSohbetBaslat();
    oturumDurumunuGuncelle();
    sistemMesaji("Oturum açıldı. Konuşmaya hazırım; bir soruyla başlayabilirsin.");
  });
}

if (oturumKapat) {
  oturumKapat.addEventListener("click", () => {
    durum.loggedIn = false;
    durum.userEmail = null;
    sohbetiTemizle();
    oturumDurumunuGuncelle();
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const girdiHam = kullaniciMesajiInput.value.trim();
  if (!girdiHam) {
    return;
  }
  kullaniciMesaji(girdiHam);
  kullaniciMesajiInput.value = "";
  kullaniciMesajiInput.focus();
  oynatTitremeSesi();
  const dusunmeElemani = dusunmeBaslat();
  const gecikme = 2000 + Math.random() * 900;
  setTimeout(() => {
    if (dusunmeElemani && dusunmeElemani.isConnected) {
      dusunmeElemani.remove();
    }
    dusunmeSatiri = null;
    const yanit = yanitUret(girdiHam);
    sistemMesaji(yanit);
  }, gecikme);
});

window.addEventListener("load", () => {
  if (!durum.sohbetler.length) {
    yeniSohbetBaslat();
  }
  oturumDurumunuGuncelle();
  sistemMesaji("Hoş geldin! Oturum açarak sohbete başlayabilirsin.");
});
