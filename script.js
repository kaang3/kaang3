const chatArea = document.getElementById("chatArea");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const resetChat = document.getElementById("resetChat");
const gaiLogo = document.getElementById("gaiLogo");

let conversationHistory = [];
let lastUserMessage = "";
let lastGaiResponse = "";
let chatMemory = [];
let mathModeActive = false;

const randomPick = (items) => items[Math.floor(Math.random() * items.length)];

const includesAny = (words, text) => words.some((word) => text.includes(word));

const kelimeHavuzu = [
  "merhaba", "selam", "selamlar", "selamun", "günaydın", "iyi", "gece", "akşam", "nasılsın", "naber",
  "iyiyim", "kötüyüm", "mutluyum", "üzgünüm", "heyecanlı", "yorgunum", "sıkıldım", "sinirliyim", "neşeliyim", "keyifliyim",
  "teşekkür", "sağol", "sağolun", "rica", "lütfen", "tamam", "evet", "hayır", "belki", "olur",
  "elma", "armut", "muz", "çilek", "kiraz", "karpuz", "kavun", "portakal", "mandalina", "üzüm",
  "domates", "salatalık", "patates", "biber", "patlıcan", "soğan", "sarımsak", "marul", "ıspanak", "brokoli",
  "pizza", "hamburger", "kebap", "döner", "mantı", "börek", "çorba", "pilav", "makarna", "salata",
  "çay", "kahve", "su", "ayran", "limonata", "meşrubat", "soda", "şerbet", "süt", "kola",
  "hava", "yağmur", "güneş", "bulut", "rüzgar", "kar", "fırtına", "sis", "sıcak", "soğuk",
  "mevsim", "bahar", "yaz", "kış", "sonbahar", "pazartesi", "salı", "çarşamba", "perşembe", "cuma",
  "cumartesi", "pazar", "saat", "dakika", "saniye", "zaman", "takvim", "bugün", "yarın", "dün",
  "şehir", "istanbul", "ankara", "izmir", "bursa", "adana", "antalya", "trabzon", "samsun", "konya",
  "okul", "ders", "ödev", "sınav", "kitap", "defter", "kalem", "silgi", "matematik", "fen",
  "tarih", "coğrafya", "felsefe", "edebiyat", "şiir", "roman", "hikaye", "yazar", "okumak", "yazmak",
  "spor", "futbol", "basketbol", "voleybol", "tenis", "yüzme", "koşu", "bisiklet", "yoga", "dans",
  "müzik", "şarkı", "melodi", "ritim", "gitar", "piyano", "keman", "davul", "konser", "kulaklık",
  "film", "dizi", "sinema", "oyuncu", "yönetmen", "sahne", "kahraman", "komedi", "dram", "aksiyon",
  "teknoloji", "bilgisayar", "telefon", "tablet", "internet", "uygulama", "oyun", "kod", "program", "yapay",
  "zeka", "robot", "algoritma", "veri", "bulut", "sunucu", "tarayıcı", "ekran", "klavye", "fare",
  "ev", "oda", "mutfak", "salon", "balkon", "bahçe", "yatak", "koltuk", "masa", "sandalye",
  "aile", "anne", "baba", "kardeş", "abla", "ağabey", "dede", "nine", "amca", "teyze",
  "arkadaş", "dost", "komşu", "öğretmen", "öğrenci", "çocuk", "bebek", "genç", "yetişkin", "yaşlı",
  "sevgi", "saygı", "umut", "mutluluk", "başarı", "hedef", "hayal", "motivasyon", "sabır", "cesaret",
  "renk", "mavi", "beyaz", "kırmızı", "yeşil", "sarı", "mor", "turuncu", "pembe", "gri",
  "siyah", "ışık", "parlak", "gölge", "desen", "tasarım", "tema", "stil", "estetik", "minimal",
  "soru", "cevap", "neden", "nasıl", "ne", "nerede", "kim", "hangi", "kaç", "yedi",
  "sayı", "hesap", "topla", "çıkar", "çarp", "böl", "eşit", "sonuç", "problem", "mantık",
  "kural", "if", "else", "koşul", "döngü", "değişken", "fonksiyon", "liste", "dizi", "hafıza",
  "hatırla", "unutma", "tekrar", "özet", "detay", "açıkla", "anlat", "kısaca", "uzun", "yavaş",
  "hızlı", "nazik", "samimi", "resmi", "şaka", "ciddi", "güven", "gizli", "açık", "net",
  "yardım", "destek", "öneri", "tavsiye", "ipuç", "rehber", "plan", "listele", "sırala", "seç",
  "başla", "dur", "devam", "bitir", "yeniden", "sıfırla", "temizle", "kapat", "aç", "göster",
  "gizle", "yükle", "indir", "ekle", "sil", "düzenle", "kontrol", "bak", "incele", "ara",
  "bul", "yap", "hazırla", "süsle", "parla", "dön", "bekle", "düşün", "yazdır", "dinle",
  "gör", "oku", "anla", "öğren", "çalış", "oyna", "dinlen", "gül", "ağla", "çiz",
  "boya", "hareket", "animasyon", "parlama", "ışılda", "yumuşak", "sert", "hafif", "yoğun", "derin",
  "uzay", "dünya", "gezegen", "güneş", "ay", "yıldız", "galaksi", "evren", "bulutsu", "meteor",
  "deniz", "okyanus", "göl", "nehir", "şelale", "dağ", "orman", "çöl", "ada", "kıyı",
  "hayvan", "kedi", "köpek", "kuş", "balık", "aslan", "kaplan", "at", "tavşan", "kaplumbağa",
  "araba", "otobüs", "uçak", "tren", "gemi", "bisiklet", "motor", "yol", "köprü", "tünel",
  "para", "ekonomi", "pazar", "alışveriş", "mağaza", "fiyat", "indirim", "bütçe", "maliyet", "kazanç",
  "sağlık", "spor", "egzersiz", "doktor", "hastane", "ilaç", "vitamin", "uyku", "diyet", "enerji",
  "program", "planla", "takip", "hatırlat", "not", "liste", "görev", "hedef", "akış", "süreç",
  "cümle", "kelime", "harf", "ses", "hece", "nokta", "virgül", "soru", "ünlem", "yazı",
  "çözüm", "problem", "konu", "başlık", "özet", "soru", "cevap", "fikir", "yorum", "tahmin",
  "keyif", "mutlu", "mutluluk", "üzüntü", "korku", "heyecan", "şaşkın", "gurur", "sevgi", "nefret",
  "basit", "zor", "kolay", "karmaşık", "sade", "hız", "tempo", "akış", "denge", "uyum",
  "sistem", "model", "taslak", "şema", "harita", "plan", "çerçeve", "yapı", "katman", "düzen",
  "başarı", "ilerleme", "gelişim", "öğrenme", "deneme", "tecrübe", "çaba", "emek", "sonuç", "performans",
  "sakin", "rahat", "huzur", "ferah", "heyecan", "enerji", "moral", "motivasyon", "istek", "odak",
  "şans", "risk", "fırsat", "karar", "seçim", "tercih", "kriter", "değer", "kalite", "ölçü",
  "kültür", "sanat", "mimari", "tasarım", "moda", "tarih", "miras", "gelenek", "adet", "kutlama",
  "bayram", "tatil", "gezi", "seyahat", "yolculuk", "rota", "harita", "rehber", "konaklama", "uçuş",
  "hobi", "koleksiyon", "fotoğraf", "resim", "heykel", "el işi", "bahçe", "balıkçılık", "kamp", "doğa",
  "bilgi", "veri", "istatistik", "sayı", "grafik", "tablo", "analiz", "sonuç", "çıkarım", "yorum",
  "dil", "türkçe", "ingilizce", "almanca", "fransızca", "italyanca", "ispanyolca", "japonca", "korece", "arapça",
  "teknik", "pratik", "örnek", "deney", "araştırma", "keşif", "bulgu", "hipotez", "teori", "kanıt",
  "çevre", "doğa", "iklim", "kirlilik", "geri dönüşüm", "enerji", "tasarruf", "su", "hava", "toprak",
  "güvenlik", "parola", "şifre", "gizlilik", "koruma", "risk", "tehdit", "önlem", "kilit", "kalkan",
  "hayat", "yaşam", "rüya", "hedef", "plan", "yol", "denge", "ritim", "alışkanlık", "rutine",
  "öğle", "sabah", "akşam", "gece", "günün", "hafta", "ay", "yıl", "takvim", "süre",
  "mutfak", "tarif", "yemek", "lezzet", "tat", "tuz", "şeker", "baharat", "sos", "fırın",
  "alışkanlık", "davranış", "tutum", "düşünce", "zihin", "beyin", "hafıza", "odak", "dikkat", "algı",
  "güzellik", "estetik", "renk", "uyum", "kontrast", "çizgi", "doku", "ışık", "gölge", "form",
  "kritik", "analiz", "değerlendirme", "inceleme", "yorumlama", "anlam", "önem", "seviye", "başlangıç", "bitiş",
  "ciddiyet", "eğlence", "şakalaş", "gülümse", "pozitif", "negatif", "denge", "ölçü", "tasarruf", "sadakat",
  "özgür", "bağımsız", "sorumluluk", "görev", "hak", "adalet", "kural", "düzen", "disiplin", "saygı",
  "devam", "başla", "dur", "bekle", "sabret", "acele", "planla", "program", "süre", "zaman",
  "iş", "kariyer", "meslek", "çalışan", "takım", "lider", "toplantı", "rapor", "proje", "sunum",
  "pazar", "müşteri", "satış", "pazarlama", "reklam", "marka", "logo", "kimlik", "strateji", "hedef",
  "kütüphane", "ansiklopedi", "sözlük", "kelime", "anlam", "tanım", "örnek", "metin", "paragraf", "başlık",
  "giriş", "gelişme", "sonuç", "özet", "not", "fikir", "anahtar", "tema", "başlık", "madde",
  "yön", "kuzey", "güney", "doğu", "batı", "harita", "pusula", "rota", "mesafe", "hedef",
  "sev", "sevin", "gül", "güler", "şen", "moral", "enerji", "coşku", "ilham", "heves",
  "kısmet", "nasip", "talih", "şans", "fırsat", "umut", "çaba", "emek", "düş", "hayal",
  "haber", "güncel", "son", "trend", "popüler", "viral", "gündem", "manşet", "duyuru", "bildirim",
  "öner", "tavsiye", "plan", "listele", "sırala", "seç", "seçenek", "alternatif", "kriter", "değer"
];

const greetingWords = ["merhaba", "selam", "selamlar", "günaydın", "iyi akşamlar", "iyi geceler", "selamun"];
const moodWords = ["nasılsın", "naber", "ne haber", "nasılsınız", "nasıl gidiyor", "keyifler", "iyi misin"];
const thanksWords = ["teşekkür", "sağol", "sağ ol", "eyvallah", "minnettar", "çok sağol", "tşk"];
const byeWords = ["görüşürüz", "bay bay", "hoşça kal", "güle güle", "bye", "kendine iyi bak"];
const appleWords = ["elma", "elmanın", "elmalar", "elmacık", "apple"];
const mathKeywords = ["matematik", "hesap", "topla", "çıkar", "çarp", "böl", "işlem", "kaç", "sonuç"];

const responsePools = {
  greeting: [
    "Merhaba! GAI-1.0 burada, nasıl yardımcı olabilirim?",
    "Selam! Bugün hangi konuda konuşalım?",
    "Hey! Seni görmek güzel. Bir soru sorabilirsin.",
    "Merhaba, mavi-beyaz dünyama hoş geldin!"
  ],
  mood: [
    "Ben iyiyim! Sen nasılsın?",
    "Gayet iyi gidiyor. Senin günün nasıl?",
    "Modum yüksek! Senin enerjin nasıl?",
    "İyiyim, teşekkürler! Sen neler yapıyorsun?"
  ],
  thanks: [
    "Rica ederim! Her zaman buradayım.",
    "Ne demek, yardımcı olmak hoşuma gidiyor.",
    "Memnun oldum! Başka bir şey ister misin?",
    "Ben teşekkür ederim!"
  ],
  bye: [
    "Görüşmek üzere! Güzel bir gün dilerim.",
    "Hoşça kal! Tekrar beklerim.",
    "Bay bay! Kendine iyi bak.",
    "Sonra görüşürüz!"
  ],
  apple: [
    "Elma deyince aklıma tazelik geliyor. Bir de kırmızı elma mı, yeşil elma mı?",
    "Elma güzeldir! Tatlı mı ekşi mi seversin?",
    "Elma hakkında sohbet etmek hoş. İstersen tarif öneririm.",
    "Elma kelimesini yakaladım. Meyve sohbeti başlasın!"
  ],
  fallback: [
    "Bunu anladım ama biraz daha detay verir misin?",
    "İlginç! Bir örnekle anlatırsan daha iyi olur.",
    "Bu konuda konuşabiliriz. Neyi hedefliyorsun?",
    "Konu güzel, biraz daha açar mısın?"
  ]
};

const mathResponses = [
  "Hesapladım, sonuç bu gibi görünüyor:",
  "Matematik modu aktif! İşlem sonucu:",
  "Sayılarla konuştuk, cevap:",
  "İşte işlem sonucu:"
];

const addMessage = (text, type, isTyping = false) => {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${type}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  if (isTyping) {
    bubble.classList.add("typing");
  }
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  chatArea.appendChild(wrapper);
  chatArea.scrollTop = chatArea.scrollHeight;
  return bubble;
};

const updateMemory = (message, response) => {
  lastUserMessage = message;
  lastGaiResponse = response;
  conversationHistory.push({ user: message, gai: response });
  const tokens = message.split(/\s+/).map((word) => word.toLowerCase());
  chatMemory = [...new Set([...chatMemory, ...tokens])].slice(-120);
};

const detectMathExpression = (text) => {
  const normalized = text
    .replace(/artı|plus/gi, "+")
    .replace(/eksi|minus/gi, "-")
    .replace(/çarpı|x|carp/gi, "*")
    .replace(/bölü|bol/gi, "/")
    .replace(/[^0-9+\-*/(). ]/g, " ");
  const hasNumbers = /\d/.test(normalized);
  return hasNumbers ? normalized : null;
};

const evaluateMath = (expression) => {
  try {
    const safeExpression = expression.replace(/\s+/g, "");
    if (!/^[0-9+\-*/().]+$/.test(safeExpression)) {
      return null;
    }
    const result = Function(`"use strict"; return (${safeExpression})`)();
    if (Number.isFinite(result)) {
      return result;
    }
    return null;
  } catch {
    return null;
  }
};

const buildResponse = (message) => {
  const soru = message.toLowerCase();
  let response = "";

  if (soru.includes("matematik modu") || soru.includes("math mode")) {
    mathModeActive = true;
    response = "Matematik modu açık! Artık sayıları daha hızlı çözerim.";
  } else if (soru.includes("matematik modu kapat") || soru.includes("math off")) {
    mathModeActive = false;
    response = "Matematik modunu kapattım. Normal sohbet moduna döndüm.";
  } else if (includesAny(greetingWords, soru)) {
    response = randomPick(responsePools.greeting);
  } else if (includesAny(moodWords, soru)) {
    response = randomPick(responsePools.mood);
  } else if (includesAny(thanksWords, soru)) {
    response = randomPick(responsePools.thanks);
  } else if (includesAny(byeWords, soru)) {
    response = randomPick(responsePools.bye);
  } else if (includesAny(appleWords, soru)) {
    response = randomPick(responsePools.apple);
  } else if (soru.includes("hatırla") || soru.includes("hafıza")) {
    if (conversationHistory.length === 0) {
      response = "Henüz bir şey hatırlamıyorum ama şimdi başlayabiliriz.";
    } else {
      response = `En son şunu söyledin: "${lastUserMessage}" ve ben de "${lastGaiResponse}" demiştim.`;
    }
  } else if (soru.includes("son mesaj") || soru.includes("son cevap")) {
    response = `Son kullanıcı mesajı: "${lastUserMessage}". Son GAI cevabı: "${lastGaiResponse}".`;
  } else if (soru.includes("ne biliyorsun") || soru.includes("hafızanda ne var")) {
    response = `Şu an hafızamda ${chatMemory.length} kelime var: ${chatMemory.slice(-15).join(", ")}.`;
  } else if (includesAny(mathKeywords, soru) || mathModeActive) {
    const expression = detectMathExpression(soru);
    const result = expression ? evaluateMath(expression) : null;
    if (result !== null) {
      response = `${randomPick(mathResponses)} ${result}`;
    } else {
      response = "Bir matematik ifadesi yakaladım ama net değil. Örnek: 12 + 4 * 2";
    }
  } else if (soru.includes("renk") || soru.includes("mavi") || soru.includes("beyaz")) {
    response = "Mavi-beyaz temayı seviyorum. İstersen daha açık mavi tonlar ekleyebiliriz.";
  } else if (soru.includes("animasyon") || soru.includes("parla") || soru.includes("dön")) {
    response = "Animasyonlar aktif! Logo parlıyor, artı butonu ışıldıyor ve düşünürken dönüyorum.";
  } else if (includesAny(kelimeHavuzu, soru)) {
    response = `"${message}" hakkında konuşabiliriz. Daha fazla detay verirsen daha iyi yanıtlarım.`;
  } else {
    response = randomPick(responsePools.fallback);
  }

  return response;
};

const typeResponse = (bubble, text) => {
  bubble.textContent = "";
  bubble.classList.add("typing");
  let index = 0;
  const interval = setInterval(() => {
    bubble.textContent += text[index];
    index += 1;
    chatArea.scrollTop = chatArea.scrollHeight;
    if (index >= text.length) {
      clearInterval(interval);
      bubble.classList.remove("typing");
    }
  }, 24);
};

const handleSend = () => {
  const message = userInput.value.trim();
  if (!message) {
    return;
  }
  addMessage(message, "user");
  userInput.value = "";
  gaiLogo.classList.add("thinking");

  const thinkingBubble = addMessage("Düşünüyorum...", "gai", true);
  const response = buildResponse(message);

  setTimeout(() => {
    gaiLogo.classList.remove("thinking");
    thinkingBubble.textContent = "";
    typeResponse(thinkingBubble, response);
    updateMemory(message, response);
  }, 3000);
};

sendButton.addEventListener("click", handleSend);
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSend();
  }
});

resetChat.addEventListener("click", () => {
  chatArea.innerHTML = "";
  conversationHistory = [];
  chatMemory = [];
  lastUserMessage = "";
  lastGaiResponse = "";
  mathModeActive = false;
  addMessage("Sohbet sıfırlandı. Merhaba demek ister misin?", "gai");
});
