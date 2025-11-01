const mesajlarKutusu = document.getElementById("mesajlar");
const form = document.getElementById("girdiFormu");
const kullaniciMesajiInput = document.getElementById("kullaniciMesaji");
const gonderButon = form.querySelector("button[type='submit']");
const sohbetListesi = document.getElementById("sohbetListesi");
const yeniSohbetButonu = document.getElementById("yeniSohbet");

let dusunmeSatiri = null;
let sesContext;

const durum = {
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

const sozlukKayitlari = [
  { kelime: "abide", tanim: "Anıtsal yapı; kalıcı eser." },
  { kelime: "acemi", tanim: "Bir işe yeni başlayan, deneyimsiz kişi." },
  { kelime: "addetmek", tanim: "Saymak, kabul etmek, farzetmek." },
  { kelime: "adeta", tanim: "Sanki, neredeyse." },
  { kelime: "adil", tanim: "Adalete uygun davranan, hakkaniyetli." },
  { kelime: "afaki", tanim: "Yüzeysel, gerçeğe dayanmayan." },
  { kelime: "ahenk", tanim: "Uyum, düzenli ve dengeli birlik." },
  { kelime: "ahval", tanim: "Hâller, durumlar." },
  { kelime: "akıbet", tanim: "Sonuç, son, akı." },
  { kelime: "akil", tanim: "Akıllı, sağduyulu kimse." },
  { kelime: "aksiyon", tanim: "Eylem, hareket." },
  { kelime: "ala", tanim: "Çok güzel, pek iyi." },
  { kelime: "alenî", tanim: "Açıkça yapılan, gizli olmayan." },
  { kelime: "ali", tanim: "Yüksek, yüce." },
  { kelime: "altruist", tanim: "Başkasını düşünen, özgeci." },
  { kelime: "anbean", tanim: "Her an, sürekli." },
  { kelime: "antik", tanim: "Eski çağlara ait." },
  { kelime: "arketip", tanim: "Özgün örnek, ilk model." },
  { kelime: "arsiv", tanim: "Belgelerin saklandığı düzenli yer." },
  { kelime: "arzu", tanim: "İstek, dilek." },
  { kelime: "asayiş", tanim: "Kamu düzeni, güvenlik." },
  { kelime: "asena", tanim: "Cesur ve lider kadın için kullanılan ad." },
  { kelime: "asli", tanim: "Esas, temel." },
  { kelime: "asude", tanim: "Sakin ve huzurlu." },
  { kelime: "ataşe", tanim: "Elçiliklerde görevli uzman personel." },
  { kelime: "avangart", tanim: "Öncü, yenilikçi." },
  { kelime: "ayrıntı", tanim: "Bir bütünü oluşturan küçük parça, teferruat." },
  { kelime: "azim", tanim: "Kararlılık, sebat." },
  { kelime: "bade", tanim: "Sonra, ardından." },
  { kelime: "beyhude", tanim: "Boşuna, yararsız." },
  { kelime: "balistik", tanim: "Fırlatılan cisimlerin hareketini inceleyen bilim." },
  { kelime: "bariz", tanim: "Açık, belirgin." },
  { kelime: "baskın", tanim: "Üstün gelen, belirgin." },
  { kelime: "basmakalıp", tanim: "Ezberlenmiş, klişe." },
  { kelime: "bediî", tanim: "Estetik, güzellikle ilgili." },
  { kelime: "behemehâl", tanim: "Kesinlikle, mutlaka." },
  { kelime: "beyan", tanim: "Açıklama, ifade." },
  { kelime: "bezgin", tanim: "Yılgın, yorgun ve isteksiz." },
  { kelime: "bilhassa", tanim: "Özellikle." },
  { kelime: "binaenaleyh", tanim: "Bu sebeple, sonuç olarak." },
  { kelime: "biyom", tanim: "Belirli iklim koşullarına sahip geniş ekolojik bölge." },
  { kelime: "cazibe", tanim: "Çekicilik, alımlılık." },
  { kelime: "cedel", tanim: "Tartışma, münakaşa." },
  { kelime: "celp", tanim: "Çağırma, davet." },
  { kelime: "cenk", tanim: "Savaş, mücadele." },
  { kelime: "cevval", tanim: "Canlı, atılgan." },
  { kelime: "cüret", tanim: "Cesaret, gözüpeklik." },
  { kelime: "darp", tanim: "Vurma, saldırma eylemi." },
  { kelime: "defa", tanim: "Kez, sefer." },
  { kelime: "defin", tanim: "Toprağa verme, gömme." },
  { kelime: "derakap", tanim: "Hemen, derhal." },
  { kelime: "derinlik", tanim: "Bir şeyin içe doğru uzanan boyutu." },
  { kelime: "derun", tanim: "İç, içsel dünya." },
  { kelime: "destan", tanim: "Kahramanlık hikâyelerini anlatan uzun şiir." },
  { kelime: "devinim", tanim: "Hareket, değişim." },
  { kelime: "diyafram", tanim: "Fotoğraf makinesinde ışığı ayarlayan açıklık." },
  { kelime: "dizge", tanim: "Sistem, düzen." },
  { kelime: "dramatik", tanim: "Heyecan uyandıran, çarpıcı." },
  { kelime: "eda", tanim: "Davranış biçimi, tavır." },
  { kelime: "edim", tanim: "Eylem, yapılan iş." },
  { kelime: "efkâr", tanim: "Üzüntü, kaygı." },
  { kelime: "ehemmiyet", tanim: "Önem, değer." },
  { kelime: "ehven", tanim: "Daha uygun, daha hafif." },
  { kelime: "ekseriyet", tanim: "Çoğunluk." },
  { kelime: "elzem", tanim: "Zorunlu, gerekli." },
  { kelime: "emare", tanim: "Belirti, işaret." },
  { kelime: "emek", tanim: "Çaba, çalışma." },
  { kelime: "emsal", tanim: "Benzer örnek." },
  { kelime: "enlem", tanim: "Yeryüzünde doğu-batı doğrultusunda uzanan çizgiler." },
  { kelime: "entelektüel", tanim: "Düşünsel etkinlikleri önemseyen, aydın." },
  { kelime: "ergime", tanim: "Katı bir maddenin sıvıya dönüşmesi." },
  { kelime: "erkan", tanim: "Kurallar bütünü; ileri gelenler." },
  { kelime: "esans", tanim: "Koku verici yoğun öz." },
  { kelime: "esin", tanim: "İlham, yaratıcı fikir kaynağı." },
  { kelime: "esnek", tanim: "Bükülebilen, uyum sağlayan." },
  { kelime: "eylem", tanim: "Bir amacı gerçekleştirmek için yapılan iş." },
  { kelime: "fehim", tanim: "Anlayış, kavrayış." },
  { kelime: "feodal", tanim: "Derebeylik düzenine ait." },
  { kelime: "feragat", tanim: "Hakkından vazgeçme." },
  { kelime: "fesih", tanim: "Sözleşmenin sona erdirilmesi." },
  { kelime: "figür", tanim: "Şekil, tasvir edilen kişi." },
  { kelime: "fizyoloji", tanim: "Canlıların yaşamsal işlevlerini inceleyen bilim." },
  { kelime: "fütursuz", tanim: "Çekingenlik göstermeyen, cesur." },
  { kelime: "gaip", tanim: "Ortada olmayan, kayıp." },
  { kelime: "gayret", tanim: "Çaba, uğraş." },
  { kelime: "gıybet", tanim: "Dedikodu, çekiştirme." },
  { kelime: "gösterge", tanim: "Belirti, sembol." },
  { kelime: "haiz", tanim: "Sahip olan." },
  { kelime: "hakikat", tanim: "Gerçek, doğruluk." },
  { kelime: "halihazır", tanim: "Şu anki durum." },
  { kelime: "hamle", tanim: "Atılım, hamle." },
  { kelime: "hararet", tanim: "Isı, sıcaklık." },
  { kelime: "hasıl", tanim: "Ortaya çıkan sonuç." },
  { kelime: "haysiyet", tanim: "Onur, saygınlık." },
  { kelime: "hazım", tanim: "Sindirim; olgunlukla karşılama." },
  { kelime: "hedef", tanim: "Amaçlanan nokta." },
  { kelime: "hicap", tanim: "Utanç, çekinme." },
  { kelime: "hikmet", tanim: "Derin anlam, bilgelik." },
  { kelime: "hissiyat", tanim: "Duygular bütünü." },
  { kelime: "hülasâ", tanim: "Özet, kısaca." },
  { kelime: "içgörü", tanim: "Kendi durumunu derinden anlama." },
  { kelime: "ihtimam", tanim: "Özen, dikkat." },
  { kelime: "ikame", tanim: "Yerine koyma, değiştirme." },
  { kelime: "ikna", tanim: "İnanmaya razı etme." },
  { kelime: "iktisat", tanim: "Ekonomi bilimi; tutum." },
  { kelime: "imam", tanim: "Namaz kıldıran din görevlisi." },
  { kelime: "imal", tanim: "Üretme, yapma." },
  { kelime: "imge", tanim: "Zihinde canlanan tasarım." },
  { kelime: "imtina", tanim: "Kaçınma, geri durma." },
  { kelime: "intiba", tanim: "İzlenim, ilk iz." },
  { kelime: "irade", tanim: "Seçme gücü, isteme yetisi." },
  { kelime: "irfan", tanim: "Derin bilgi, irfan." },
  { kelime: "isabet", tanim: "Doğruya rastlama." },
  { kelime: "istiare", tanim: "Benzetme amacıyla bir kelimenin yerine başka birini kullanma." },
  { kelime: "istikbal", tanim: "Gelecek." },
  { kelime: "istimlak", tanim: "Kamulaştırma." },
  { kelime: "itibar", tanim: "Saygınlık, güven." },
  { kelime: "izah", tanim: "Açıklama." },
  { kelime: "izzet", tanim: "Onur, değer." },
  { kelime: "kalibre", tanim: "Çap, seviye." },
  { kelime: "kanaat", tanim: "Görüş, fikir; yetinme." },
  { kelime: "kapasite", tanim: "Sığa, yeterlilik." },
  { kelime: "kıraat", tanim: "Okuma, tilavet." },
  { kelime: "kıymet", tanim: "Değer, önem." },
  { kelime: "kisve", tanim: "Dış görünüş, kılık." },
  { kelime: "kompozit", tanim: "Bileşik, karma malzeme." },
  { kelime: "kuram", tanim: "Teori, açıklayıcı model." },
  { kelime: "kudret", tanim: "Güç, iktidar." },
  { kelime: "kuşatmak", tanim: "Çevrelemek, sarıp sarmalamak." },
  { kelime: "lisan", tanim: "Dil, dil sistemi." },
  { kelime: "maharet", tanim: "Ustalık, beceri." },
  { kelime: "mahfuz", tanim: "Korunmuş, saklı." },
  { kelime: "mahiyet", tanim: "Öz, nitelik." },
  { kelime: "makul", tanim: "Mantıklı, akla uygun." },
  { kelime: "marjinal", tanim: "Sıradışı, ana kitlenin dışında kalan." },
  { kelime: "mecal", tanim: "Güç, takat." },
  { kelime: "meczup", tanim: "Kendinden geçmiş, dalgın kimse." },
  { kelime: "medar", tanim: "Dayanak, merkez." },
  { kelime: "mefhum", tanim: "Kavram, anlam." },
  { kelime: "mehaz", tanim: "Kaynak eser." },
  { kelime: "melez", tanim: "Karışık kökenli." },
  { kelime: "menfi", tanim: "Olumsuz, negatif." },
  { kelime: "meram", tanim: "Anlatılmak istenen düşünce." },
  { kelime: "merhamet", tanim: "Acıma, şefkat." },
  { kelime: "mesabesinde", tanim: "Değerinde, düzeyinde." },
  { kelime: "mesnet", tanim: "Dayanak, temel." },
  { kelime: "mevcudiyet", tanim: "Var oluş, varlık." },
  { kelime: "meyil", tanim: "Eğilim, yönelim." },
  { kelime: "mihenk", tanim: "Bir şeyin değerini sınayan ölçüt." },
  { kelime: "minval", tanim: "Tarz, biçim." },
  { kelime: "muktedir", tanim: "Bir işi yapmaya gücü yeten, kudretli." },
  { kelime: "müdrik", tanim: "Kavrayabilen, anlayan." },
  { kelime: "müessese", tanim: "Kuruluş, kurum." },
  { kelime: "mükellef", tanim: "Yükümlü, sorumluluk sahibi." },
  { kelime: "müktesebat", tanim: "Biriktirilmiş bilgi ve deneyim." },
  { kelime: "mülhem", tanim: "İlham alan veya veren." },
  { kelime: "münasip", tanim: "Uygun, yerinde." },
  { kelime: "münferit", tanim: "Tekil, ayrı." },
  { kelime: "müphem", tanim: "Belirsiz, açık olmayan." },
  { kelime: "müspet", tanim: "Olumlu, yararlı, pozitif." },
  { kelime: "müşkül", tanim: "Güç, zor durum." },
  { kelime: "müteakip", tanim: "Ardından gelen." },
  { kelime: "mütefekkir", tanim: "Düşünür, filozof." },
  { kelime: "mütevazı", tanim: "Alçakgönüllü." },
  { kelime: "nazım", tanim: "Şiir düzeni; şair." },
  { kelime: "nazari", tanim: "Kuramsal, teorik." },
  { kelime: "nezaket", tanim: "İncelik, kibarlık." },
  { kelime: "nispet", tanim: "Oran, ilişki." },
  { kelime: "nizam", tanim: "Düzen, sistem." },
  { kelime: "nüans", tanim: "İnce ayrım." },
  { kelime: "olgun", tanim: "Gelişmiş, kemale ermiş." },
  { kelime: "optimum", tanim: "En uygun, en elverişli." },
  { kelime: "örüntü", tanim: "Tekrarlayan düzen." },
  { kelime: "özgün", tanim: "Kendine has, orijinal." },
  { kelime: "rağbet", tanim: "İlgi, tercih." },
  { kelime: "rağmen", tanim: "Karşıtlığa rağmen gerçekleşen durum." },
  { kelime: "riayet", tanim: "Uyma, saygı gösterme." },
  { kelime: "rüsva", tanim: "Rezalet halinde, utanç verici." },
  { kelime: "sabit", tanim: "Değişmeyen." },
  { kelime: "sadakat", tanim: "Bağlılık, vefa." },
  { kelime: "sahih", tanim: "Gerçek, doğru." },
  { kelime: "sanayi", tanim: "Endüstri, üretim sektörü." },
  { kelime: "sarih", tanim: "Açık, belirgin." },
  { kelime: "sathî", tanim: "Yüzeysel." },
  { kelime: "selamet", tanim: "Esenlik, güvenlik." },
  { kelime: "semptom", tanim: "Belirti, gösterge." },
  { kelime: "serencam", tanim: "Olayların sonu, akıbet." },
  { kelime: "simge", tanim: "Sembol, işaret." },
  { kelime: "sükûnet", tanim: "Sakinlik, dinginlik." },
  { kelime: "tahayyül", tanim: "Hayal etme." },
  { kelime: "tahakkuk", tanim: "Gerçekleşme." },
  { kelime: "tahvil", tanim: "Değiştirme, dönüştürme; finansal kıymet." },
  { kelime: "takdir", tanim: "Beğeni; değer biçme." },
  { kelime: "talep", tanim: "İstek, isteme." },
  { kelime: "tazammun", tanim: "İçinde barındırma." },
  { kelime: "tebessüm", tanim: "Gülümseme." },
  { kelime: "tecelli", tanim: "Belirme, ortaya çıkma." },
  { kelime: "tefekkür", tanim: "Derin düşünme." },
  { kelime: "teferruat", tanim: "Ayrıntı, detay." },
  { kelime: "tefrik", tanim: "Ayırma, ayrım yapma." },
  { kelime: "tekâmül", tanim: "Gelişme, olgunlaşma." },
  { kelime: "tekil", tanim: "Tek, yalnız." },
  { kelime: "temayül", tanim: "Eğilim." },
  { kelime: "temkin", tanim: "İhtiyat, dikkat." },
  { kelime: "temsil", tanim: "Birini ya da bir şeyi başkası adına sunma." },
  { kelime: "teneffüs", tanim: "Nefes alma; kısa mola." },
  { kelime: "tesir", tanim: "Etkileme gücü." },
  { kelime: "tevazu", tanim: "Alçakgönüllülük, kendini olduğundan büyük görmeme." },
  { kelime: "tezahür", tanim: "Belirme, görünme." },
  { kelime: "teşbih", tanim: "Benzetme sanatı." },
  { kelime: "tezlik", tanim: "Hız, sürat." },
  { kelime: "ufuk", tanim: "Düşünce genişliği; görüş alanının sınırı." },
  { kelime: "vakur", tanim: "Ağırbaşlı, ciddiyet sahibi." },
  { kelime: "veciz", tanim: "Az sözle çok anlam ifade eden." },
  { kelime: "vesile", tanim: "Araç, sebep." },
  { kelime: "vukuf", tanim: "Bilgi sahibi olma, vakıf olma." },
  { kelime: "yekpare", tanim: "Tek parça, bütün." },
  { kelime: "yordamak", tanim: "Verilerden sonuç çıkarmak." },
  { kelime: "zaaf", tanim: "Zayıflık, güçsüzlük noktası." },
  { kelime: "zarafet", tanim: "Zariflik, incelik." },
  { kelime: "zihinsel", tanim: "Akla, düşünceye ait." },
  { kelime: "ziyade", tanim: "Fazla, çok." }
];

const sozluk = {};
for (const madde of sozlukKayitlari) {
  const anahtarlar = [madde.kelime];
  if (madde.ekler) {
    anahtarlar.push(...madde.ekler);
  }
  for (const anahtar of anahtarlar) {
    sozluk[degrade(anahtar)] = { kelime: madde.kelime, tanim: madde.tanim };
  }
}

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

const explicitMathAllowedWords = new Set([
  "kac",
  "kactir",
  "nedir",
  "ne",
  "eder",
  "sonuc",
  "sonucu",
  "sonuckac",
  "hesapla",
  "hesaplanir",
  "hesaplayalim",
  "hesaplar",
  "hesaplan",
  "lutfen",
  "lufen",
  "please",
  "cevap",
  "cevapla",
  "soyle",
  "acaba",
  "bir",
  "kez",
  "defa",
  "mi",
  "midir",
  "misin",
  "olsun",
  "olur",
  "olacak"
]);

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

function formatNumberTr(deger) {
  if (!Number.isFinite(deger)) {
    return deger;
  }
  const ayarlar = Number.isInteger(deger)
    ? { maximumFractionDigits: 0 }
    : { minimumFractionDigits: 0, maximumFractionDigits: 6 };
  return Number(deger).toLocaleString("tr-TR", ayarlar);
}

function evaluateExplicitExpression(metin) {
  const temiz = metin
    .toLowerCase("tr-TR")
    .replace(/[^0-9+\-*/()x×÷:,\.\s]/g, " ")
    .replace(/[x×]/g, "*")
    .replace(/[÷:]/g, "/")
    .replace(/,/g, ".");
  const kelimeKalan = metin
    .toLowerCase("tr-TR")
    .replace(/[0-9+\-*/()x×÷:,\.]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((parca) => degrade(parca));
  if (kelimeKalan.length && !kelimeKalan.every((kelime) => explicitMathAllowedWords.has(kelime))) {
    return null;
  }
  const parcali = temiz
    .split(/\s+/)
    .filter((parca) => parca && /[0-9]/.test(parca));
  if (!parcali.length) {
    return null;
  }
  const ifade = parcali.join("");
  if (!/^[0-9+\-*/().]+$/.test(ifade)) {
    return null;
  }
  if (!/[+\-*/]/.test(ifade)) {
    return null;
  }
  try {
    const sonuc = Function("return (" + ifade + ");")();
    if (typeof sonuc === "number" && Number.isFinite(sonuc)) {
      return { ifade, sonuc };
    }
  } catch (err) {
    return null;
  }
  return null;
}

function handleMath(metin, tokens) {
  const explicit = evaluateExplicitExpression(metin);
  if (explicit) {
    const sonuc = Number(explicit.sonuc);
    const duzenli = formatNumberTr(sonuc);
    return `${explicit.ifade} = ${duzenli}`;
  }

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
  const sonucMetni = formatNumberTr(sonuc);
  let yanit;
  const metinKucuk = normalizeMetin(metin);
  if (includesWord(tokens, subtractionSet) || metinKucuk.includes("kald")) {
    yanit = `${ownerAdi} ${itemAdi} ${sonucMetni} kaldı.`;
  } else if (includesWord(tokens, additionSet)) {
    yanit = `${ownerAdi} ${itemAdi} ${sonucMetni} oldu.`;
  } else if (soruVar) {
    yanit = `${ownerAdi} ${itemAdi} ${sonucMetni}.`;
  } else {
    yanit = `${ownerAdi} ${itemAdi} ${sonucMetni} olarak kaydettim.`;
  }

  if ((islemYapildi || (islemler.length && hesapBaslangici != null)) && hesapBaslangici != null) {
    const adimlar = islemler
      .map((adim) => `${adim.tur === "add" ? "+" : "-"} ${formatNumberTr(adim.deger)}`)
      .join(" ");
    if (adimlar) {
      yanit += ` (Başlangıç ${formatNumberTr(hesapBaslangici)} ${adimlar}.)`;
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

if (yeniSohbetButonu) {
  yeniSohbetButonu.addEventListener("click", () => {
    yeniSohbetBaslat();
    sistemMesaji("Yeni bir sayfa açtık. Bugün ne konuşmak istersin?");
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
  sistemMesaji("Merhaba! Ben Gai. Matematikten sanata kadar aklındaki konularda yanında olmaya hazırım.");
});
