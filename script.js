const chat = document.getElementById("chat");
const splash = document.getElementById("splash");
const splashPrompt = document.getElementById("splashPrompt");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const clearChat = document.getElementById("clearChat");
const modelToggle = document.getElementById("modelToggle");
const modelMenu = document.getElementById("modelMenu");
const modelOptions = document.querySelectorAll(".model-option");
const currentModelBadge = document.getElementById("currentModelBadge");
const memoryToggle = document.getElementById("memoryToggle");
const memoryPanel = document.getElementById("memoryPanel");
const memoryList = document.getElementById("memoryList");
const clearMemory = document.getElementById("clearMemory");
const memoryToast = document.getElementById("memoryToast");
const introGate = document.getElementById("introGate");
const appRoot = document.getElementById("appRoot");
const enterAppBtn = document.getElementById("enterAppBtn");
const enterTransition = document.getElementById("enterTransition");
const plusToggle = document.getElementById("plusToggle");
const plusMenu = document.getElementById("plusMenu");
const advancedMathMode = document.getElementById("advancedMathMode");
const webSearchMode = document.getElementById("webSearchMode");
const balukLensMode = document.getElementById("balukLensMode");
const webInputBadge = document.getElementById("webInputBadge");
const lensPanel = document.getElementById("lensPanel");
const lensClose = document.getElementById("lensClose");
const lensDropZone = document.getElementById("lensDropZone");
const lensFileInput = document.getElementById("lensFileInput");
const lensPickBtn = document.getElementById("lensPickBtn");
const lensCanvasWrap = document.getElementById("lensCanvasWrap");
const lensCanvas = document.getElementById("lensCanvas");
const lensAnalyzeBtn = document.getElementById("lensAnalyzeBtn");
const lensStatus = document.getElementById("lensStatus");
const lensResults = document.getElementById("lensResults");
const mathStudioToggle = document.getElementById("mathStudioToggle");
const mathStudioPanel = document.getElementById("mathStudioPanel");
const mathStudioInput = document.getElementById("mathStudioInput");
const mathModeFlash = document.getElementById("mathModeFlash");
const mathTutorOverlay = document.getElementById("mathTutorOverlay");
const mathTutorDone = document.getElementById("mathTutorDone");
const mathTutorNext = document.getElementById("mathTutorNext");
const mathTutorTitle = document.getElementById("mathTutorTitle");
const mathTutorText = document.getElementById("mathTutorText");
const mathTutorFinale = document.getElementById("mathTutorFinale");
const profanityLock = document.getElementById("profanityLock");
const banTimer = document.getElementById("banTimer");
const banReason = document.getElementById("banReason");
const banPassword = document.getElementById("banPassword");
const banUnlockBtn = document.getElementById("banUnlockBtn");
const accountToggle = document.getElementById("accountToggle");
const accountPanel = document.getElementById("accountPanel");
const accountName = document.getElementById("accountName");
const accountGmail = document.getElementById("accountGmail");
const accountPhoto = document.getElementById("accountPhoto");
const accountPhotoPreview = document.getElementById("accountPhotoPreview");
const accountNamePreview = document.getElementById("accountNamePreview");
const accountMailPreview = document.getElementById("accountMailPreview");
const saveAccount = document.getElementById("saveAccount");
const sideDrawer = document.getElementById("sideDrawer");
const drawerClose = document.getElementById("drawerClose");
const drawerAccountOpen = document.getElementById("drawerAccountOpen");
const drawerPremiumOpen = document.getElementById("drawerPremiumOpen");
const drawerBackgroundOpen = document.getElementById("drawerBackgroundOpen");
const premiumOwnedLabel = document.getElementById("premiumOwnedLabel");
const premiumExpiryLabel = document.getElementById("premiumExpiryLabel");
const premiumPendingLabel = document.getElementById("premiumPendingLabel");
const premiumModal = document.getElementById("premiumModal");
const premiumClose = document.getElementById("premiumClose");
const premiumBuyBtn = document.getElementById("premiumBuyBtn");
const premiumPayLinkBtn = document.getElementById("premiumPayLinkBtn");
const premiumConfirmBtn = document.getElementById("premiumConfirmBtn");
const premiumCodeRow = document.getElementById("premiumCodeRow");
const premiumCodeInput = document.getElementById("premiumCodeInput");
const backgroundModal = document.getElementById("backgroundModal");
const backgroundClose = document.getElementById("backgroundClose");
const backgroundThemeSelect = document.getElementById("backgroundThemeSelect");
const backgroundMusicSelect = document.getElementById("backgroundMusicSelect");
const backgroundMusicVolume = document.getElementById("backgroundMusicVolume");
const allowProfanityMode = document.getElementById("allowProfanityMode");
const warningOverlay = document.getElementById("warningOverlay");
const warningText = document.getElementById("warningText");
const safetySurveyModal = document.getElementById("safetySurveyModal");
const safetySurveyOptions = document.getElementById("safetySurveyOptions");
const closeSafetySurveyModal = document.getElementById("closeSafetySurveyModal");
const geometryToolbar = document.getElementById("geometryToolbar");
const geometrySketch = document.getElementById("geometrySketch");
const solveGeometryBtn = document.getElementById("solveGeometryBtn");
const geometryWarn = document.getElementById("geometryWarn");
let currentModel = localStorage.getItem("balukSelectedModel") || "baluk-1.9";
let hasStartedChat = false;
let memoryToastTimer = null;
let lastBotResponse = "";
let introAudioCtx = null;
let introAudioNodes = [];
let introAmbientNodes = [];
let bgAudioCtx = null;
let bgAudioNodes = [];
let advancedMathEnabled = false;
let banUntil = 0;
let banInterval = null;
let lastStudioExplained = "";
let mathFlashTimer = null;
let selectedGeometryShape = "square";
let tutorStep = 0;
let insultWarningCount = 0;
let warningOverlayTimer = null;
let pendingSafetySurvey = null;
let webModeEnabled = false;
let lensModeEnabled = false;
let lensImageDataUrl = "";
let lensSelection = null;
let lensDragStart = null;
let lensAnalyzing = false;
let lensAiLabels = [];
let lensClassifierReady = false;
let lensClassifierLoading = false;
let lensModelRef = null;
let lensDrawTicker = null;
let isPremiumUser = localStorage.getItem("balukPremium") === "1";
let premiumPaymentPending = localStorage.getItem("balukPremiumPending") === "1";
let allowProfanity = localStorage.getItem("balukAllowProfanity") === "1";
let premiumExpiresAt = Number(localStorage.getItem("balukPremiumExpiresAt") || "0");
let usedPremiumCodes = JSON.parse(localStorage.getItem("balukPremiumUsedCodes") || "[]");
const playfulProfanityReplies = [
  "Lan tatlı sert girdin 😄 Kavga yok ama şaka dozunda takılabiliriz kanka.",
  "Aaa küfür modu açıkmış 😅 Ben de hafif atışmayla devam ederim: sen efsane bir manyaksın ama tatlısından.",
  "Tamamdır dostum, premium şaka modu aktif 🤝 Kırmadan dökmeden takılalım; ben buradayım.",
  "Hadi bakalım küfürlü mizah açıldı 😎 Sert değil, eğlenceli devam: enerjin ateş ediyor!"
];
const profanityTokensByIntent = {
  greeting: ["aq", "amk", "mk"],
  mood: ["aq", "amk"],
  question: ["aq", "amk"],
  tech: ["aq", "mk"],
  game: ["amk", "aq"],
  money: ["amk", "aq"],
  math: ["aq", "mk"],
  web: ["aq", "amk"],
  system: ["mk", "aq"],
  default: ["aq", "amk", "mk"]
};
const webAnswerIntroPrompts = [
  "Evet, bu konuyu sana net ve anlaşılır şekilde açayım:",
  "Harika soru, bunu adım adım anlatayım:",
  "Bunu kısa bir girişle başlayıp detaylıca açıklayayım:",
  "Tam yerinden bir konu; işte özlü ama güçlü anlatım:",
  "Sana bu konuyu akıcı bir dille toparlayayım:",
  "Önce ana resmi çizelim, sonra detaya girelim:",
  "Bunu kolay anlaşılır bir çerçevede anlatalım:",
  "Güzel bir başlık seçtin, net açıklaması şöyle:",
  "Bunu konuşma diliyle ama doğru şekilde özetleyeyim:",
  "Hadi başlayalım, bu konunun temel mantığı şu şekilde:"
];
const webAnswerOutroPrompts = [
  "İstersen bir sonraki adımda bunu daha teknik seviyede de açabilirim.",
  "Dilersen bunun pratik örneklerini de tek tek çıkarırım.",
  "İstersen bu konuyu maddeler halinde daha da sadeleştireyim.",
  "Hazırsan şimdi bunun kritik noktalarını ayrıca listelerim.",
  "İstersen bunu kısa-not formatına çevirip kaydedebiliriz.",
  "Dilersen aynı konuyu farklı kaynaklarla da kıyaslayabilirim.",
  "İstersen şimdi bununla ilgili hızlı bir soru-cevap turu yapalım.",
  "Gerekirse bunu 3 dakikalık öğrenme planına da dönüştürürüm.",
  "İstersen bunun yanlış bilinen kısımlarını da ayrıca anlatayım.",
  "Devam etmek istersen konuyu daha derin bir seviyeye taşıyalım."
];
const convoState = {
  awaitingMoodReply: false,
  awaitingGoalPlan: false,
  awaitingGeneralAnswer: false,
  awaitingEpsteinList: false,
  awaitingCreativeTheme: false,
  creativeMode: null,
  awaitingActivityChoice: false
};
const userMemory = JSON.parse(localStorage.getItem("balukMemory") || "{}");
const BAN_STORAGE_KEY = "balukBanState";
const ACCOUNT_STORAGE_KEY = "balukAccountProfile";
const PREMIUM_STORAGE_KEY = "balukPremium";
const PREMIUM_PENDING_KEY = "balukPremiumPending";
const ALLOW_PROFANITY_STORAGE_KEY = "balukAllowProfanity";
const PREMIUM_PAY_LINK = "https://www.paytr.com/link/oAURQZG";
const PREMIUM_VERIFY_CODES = ["324213", "213414", "983243", "372321", "120545"];
const PREMIUM_USED_CODES_KEY = "balukPremiumUsedCodes";
const PREMIUM_EXPIRY_KEY = "balukPremiumExpiresAt";
const PREMIUM_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const MODEL_STORAGE_KEY = "balukSelectedModel";
const BACKGROUND_THEME_KEY = "balukBackgroundTheme";
const BACKGROUND_MUSIC_KEY = "balukBackgroundMusic";
const BACKGROUND_VOLUME_KEY = "balukBackgroundVolume";
const ambientMusicPresets = {
  "1": { base: 180, lfo: 0.08, wave: "sine" },
  "2": { base: 196, lfo: 0.09, wave: "triangle" },
  "3": { base: 174, lfo: 0.06, wave: "sine" },
  "4": { base: 210, lfo: 0.1, wave: "triangle" },
  "5": { base: 165, lfo: 0.07, wave: "sine" },
  "6": { base: 233, lfo: 0.09, wave: "triangle" },
  "7": { base: 152, lfo: 0.05, wave: "sine" },
  "8": { base: 247, lfo: 0.08, wave: "triangle" },
  "9": { base: 187, lfo: 0.1, wave: "sine" },
  "10": { base: 221, lfo: 0.06, wave: "triangle" }
};
const splashPromptTemplates = [
  "Bugün neye dalalım?",
  "Nasıl yardım edebilirim?",
  "Ne zaman hazırsan ben de hazırım.",
  "Bugün ne yapıyoruz?",
  "Nasıl gidiyor {name}?",
  "Hazır mısın?"
];
const geometryShapeMeta = {
  square: { label: "Kare", sides: ["a", "b", "c", "d"], vertexCount: 4 },
  rectangle: { label: "Dikdörtgen", sides: ["uzun", "kısa", "uzun", "kısa"], vertexCount: 4 },
  triangle: { label: "Üçgen", sides: ["a", "b", "c"], vertexCount: 3 },
  circle: { label: "Daire", sides: ["r"], vertexCount: 0 },
  parallelogram: { label: "Paralelkenar", sides: ["a", "b", "a", "b"], vertexCount: 4 },
  trapezoid: { label: "Yamuk", sides: ["a", "b", "c", "d"], vertexCount: 4 },
  pentagon: { label: "Beşgen", sides: ["a", "b", "c", "d", "e"], vertexCount: 5 },
  hexagon: { label: "Altıgen", sides: ["a", "b", "c", "d", "e", "f"], vertexCount: 6 }
};
const merhabaResponses = [
  "Selam dostum 😄 Buradayım ve yardıma hazırım. Sen nasılsın?",
  "Merhaba kanka 🌟 Baluk yanında. Sen nasılsın?",
  "Heyy, hoş geldin 🐟 Güzel bir sohbete var mısın? Sen nasılsın?",
  "Merhabaaa ✨ Enerjim yüksek, senden de iyi haber bekliyorum. Sen nasılsın?",
  "Selamlar 🤝 İstersen birlikte üretelim. Sen nasılsın?",
  "Merhaba dost 💙 Bugün nasıl hissediyorsun, sen nasılsın?",
  "Selam! Hazırım 🚀 Önce bir yoklama: sen nasılsın?",
  "Merhaba kankam 😎 Ben buradayım, sen nasılsın?",
  "Ahooy 🧭 Baluk aktif! Sen nasılsın?",
  "Selammm 🌈 Sohbete başlayalım, sen nasılsın?"
];
const nasilsinResponses = [
  "Ben iyiyim kanka 😄 Sen nasılsın?",
  "Gayet iyiyim dostum 🌟 Sen nasılsın?",
  "Harikayım, enerji full ⚡ Sen nasılsın?",
  "İyiyim ve buradayım 🐟 Sen nasılsın?",
  "Süperim, bugün çok motiveyim 🚀 Sen nasılsın?",
  "Baya iyiyim, sohbet modum açık 💙 Sen nasılsın?",
  "İyiyim vallahi, keyfim yerinde 😎 Sen nasılsın?",
  "Şu an çok iyiyim, birlikte üretmeye hazırım ✨ Sen nasılsın?",
  "İyiyim dost, sana da iyi gelmek isterim 🤝 Sen nasılsın?",
  "İyiyim, teşekkürler! Bugün çok canlıyım 🌈 Sen nasılsın?"
];
const saKeywords = [
  "sa", "selamün aleyküm", "selamun aleyküm", "selamünaleyküm", "selamunaleykum",
  "aleyküm selam", "aleykum selam", "selamun aleykum", "s.a", "a.s", "esselamu aleykum",
  "esselamün aleyküm", "hayırlı sabahlar", "hayırlı akşamlar", "hayırlı geceler", "cümleten selam", "selamlar", "selam", "merhaba"
];
const saResponses = [
  "Aleyküm selam canım dostum 🌙✨ Hoş geldin, nasılsın bugün?",
  "Ve aleyküm selam 🤍 Buradayım, birlikte harika işler çıkaralım!",
  "Selamün aleykümün alındı 🌟 Ruhun sakin, günün bereketli olsun!",
  "Aleyküm selam kankam 😄 İyi ki geldin, sana nasıl yardımcı olayım?",
  "Selam dostum 🐟 Kalpten bir selam da benden, keyifler nasıl?",
  "Aleyküm selam ✨ Modun yüksek olsun, bugün ne üretelim?",
  "Hoş geldin! 🤝 Selamını aldım, enerjin çok güzel geldi.",
  "Selamlarrr 🌈 Buradayım ve hazırım, hadi başlayalım!",
  "Aleyküm selam güzel insan 💙 İstersen sohbet, istersen çözüm modu açalım.",
  "Selamın başım üstüne 🙌 Bugün yanında Baluk var, birlikte hallederiz."
];
const unifiedKeywordCategories = {
  greetings: ["merhaba", "selam", "hey", "günaydın", "iyi akşamlar", "nasılsın", "naber", "görüşürüz", "bye", "hoş geldin"],
  questionStarters: ["neden", "nasıl", "ne", "kim", "kaç", "hangi", "olur mu", "mümkün mü", "gerçekten", "doğru mu"],
  aiTech: ["ai", "yapay zeka", "robot", "algoritma", "kod", "yazılım", "python", "html", "javascript", "veritabanı", "sunucu", "internet", "uygulama", "site", "tarayıcı"],
  game: ["oyun", "level", "boss", "silah", "karakter", "xp", "skor", "görev", "harita", "mod", "pvp", "rank", "kazandım", "kaybettim", "respawn"],
  business: ["para", "satış", "kazanç", "zarar", "yatırım", "müşteri", "ürün", "indirim", "kampanya", "fiyat"],
  emotions: ["mutluyum", "üzgünüm", "sinirliyim", "heyecanlıyım", "korkuyorum", "stres", "boşluk", "motive", "yorgunum", "sıkıldım"],
  creativity: ["tasarım", "logo", "fikir", "proje", "hayal", "çizim", "animasyon", "hikaye", "karakter", "konsept"],
  education: ["matematik", "sınav", "ders", "okul", "ödev", "soru", "çözüm", "formül", "konu", "test"],
  system: ["başlat", "dur", "yeniden", "sıfırla", "kaydet", "yükle", "sil", "aç", "kapat", "yardım"]
};
// ... [content omitted in this transfer exactly as provided by user] ...
async function processWebSearchInput(text) {
  startChatIfNeeded();
  addMessage(text, "user");
  const thinking = addThinkingBubble("web");
  const waitMs = isPremiumUser ? 4500 + Math.floor(Math.random() * 800) : 9000 + Math.floor(Math.random() * 2000);
  const stopProgress = startWebThinkingProgress(thinking, waitMs);
  await new Promise((r) => setTimeout(r, waitMs));
  updateThinkingStatus(thinking, "Web aranıyor...");
  try {
    const items = await fetchWebResults(text);
    const firstWiki = items.find((i) => isWikipediaLink(i.link));
    const wikiExcerpt = supportsWebTextExtractionModel() && firstWiki ? await fetchWikipediaLongExcerpt(firstWiki.link) : "";
    renderWebResults(text, items, wikiExcerpt, firstWiki?.link || "");
    stopProgress();
    const doneText = supportsWebTextExtractionModel()
      ? "Arama tamamlandı. Linkler ve Wikipedia metin alıntısı hazır."
      : "Arama tamamlandı. Linkler hazır (metne dökme özelliği için baluk-1.8+ gerekir).";
    fillThinkingBubble(thinking, applyProfanityFlavor(doneText, text), "Web arandı • sonuç bulundu ✅");
  } catch {
    stopProgress();
    // ikinci yarı gelince devam edecek
  }
}
