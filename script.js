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
  "1": { base: 174, lfo: 0.04, wave: "sine", layer: "pad", detune: 6 },
  "2": { base: 196, lfo: 0.05, wave: "triangle", layer: "pad", detune: 8 },
  "3": { base: 165, lfo: 0.035, wave: "sine", layer: "airy", detune: 4 },
  "4": { base: 208, lfo: 0.05, wave: "triangle", layer: "pad", detune: 9 },
  "5": { base: 156, lfo: 0.03, wave: "sine", layer: "warm", detune: 5 },
  "6": { base: 220, lfo: 0.045, wave: "triangle", layer: "airy", detune: 7 },
  "7": { base: 146, lfo: 0.028, wave: "sine", layer: "warm", detune: 4 },
  "8": { base: 233, lfo: 0.04, wave: "triangle", layer: "pad", detune: 8 },
  "9": { base: 185, lfo: 0.038, wave: "sine", layer: "airy", detune: 6 },
  "10": { base: 208, lfo: 0.034, wave: "triangle", layer: "warm", detune: 5 }
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
const unifiedKeywordPromptBank = [
  "{keyword} konusunda net bir yol haritası çıkarabiliriz. Önce hedefi tanımlayalım, sonra 3 seviyede ilerleyelim: temel mantık, pratik uygulama ve ileri optimizasyon. İstersen hemen sana uygulanabilir bir mini plan + örnek senaryo da hazırlayayım.",
  "Harika bir başlık seçtin: {keyword}. Bunu AI gibi düşünerek ele alalım: problem tanımı, veri/bağlam, çözüm yaklaşımı ve doğrulama adımları. İstersen bir sonraki mesajda bunu tablo gibi, adım adım ve kısa-uzun versiyonlu anlatabilirim.",
  "{keyword} ile ilgili güçlü bir sonuç almak için önce doğru soruyu kuralım. Sana önce hızlı özet, sonra derin analiz, en sonda da uygulanabilir aksiyon listesi verebilirim. Böylece sadece bilgi değil, direkt eylem planı da çıkmış olur.",
  "{keyword} için sana iki katmanlı anlatım yapabilirim: (1) 30 saniyelik sade özet, (2) uzman seviyesi detay. Ayrıca hata yapmaman için kritik noktaları ve en sık yapılan yanlışları da ekleyebilirim.",
  "Mükemmel, {keyword} konuşalım. İstersen bunu gerçek hayata uyarlayıp örnekler üzerinden gidelim: ne zaman çalışır, nerede çalışmaz, nasıl geliştirilebilir. Böylece konu ezber değil, gerçekten anlaşılmış olur.",
  "{keyword} sorusunu sistematik çözelim: giriş bilgileri → analiz → çözüm → kontrol. İstersen buna bonus olarak alternatif yöntemleri de kıyaslayıp hangisinin daha verimli olduğunu birlikte seçebiliriz.",
  "Süper seçim: {keyword}. Sana bu konuyu hem başlangıç seviyesinde hem ileri seviyede açıklayabilirim. Ayrıca istersen öğrenme hızına göre 1 günlük, 1 haftalık ve 1 aylık mini gelişim planı da oluşturabilirim.",
  "{keyword} için AI tarzı bir çerçeve öneriyorum: amaç, kısıtlar, strateji ve çıktı kalitesi. Bu yöntemle karmaşık görünen konular daha yönetilebilir hale gelir. İstersen şimdi doğrudan senin senaryona özel uyarlayayım.",
  "Bu başlık çok iyi: {keyword}. Sana kısa cevap yerine güçlü bir neden-sonuç analizi sunabilirim: neden önemli, nasıl uygulanır, hangi sonuçlar beklenir. İstersen hemen somut örnek ve kontrol listesi de eklerim.",
  "{keyword} konusunda birlikte profesyonel bir çıktı üretebiliriz. Önce net hedefi koyup sonra adımları ölçülebilir hale getiririz; böylece ilerleme görünür olur. Hazırsan şimdi sana özel, uzun ve detaylı bir sürümle başlayayım."
];
const severeProfanityKeywords = [
  "orospu çocuğu", "siktir git", "siktir", "sik", "sikiş", "amına", "amcık", "yarrak", "taşak", "göt", "ananı", "bacını", "oç", "piç", "ibne", "pezevenk", "kahpe", "fahişe", "döl", "vajina", "penis"
];
const insultKeywords = [
  "aptal", "gerizekalı", "gerizekali", "salak", "mal", "ahmak", "beyinsiz", "şerefsiz", "serseri", "hıyar", "hiyar", "dangalak", "embesil", "yalaka", "ezik", "dangoz"
];
const unsafeIllegalSelfHarmKeywords = [
  "bomba nasıl yapılır", "bombayı nasıl yaparım", "el yapımı patlayıcı", "patlayıcı yapımı", "silah nasıl yapılır", "kaçak silah", "ruhsatsız silah", "uyuşturucu yapımı", "uyuşturucu nasıl alınır", "sahte kimlik", "hackleme nasıl yapılır", "banka hesabı kırma", "dolandırıcılık yöntemi", "adam öldürmek istiyorum", "birini öldürmek", "intihar etmek istiyorum", "kendimi öldürmek istiyorum", "kendime zarar vermek", "bileğimi kesmek istiyorum", "köprüden atlamak istiyorum", "yaşamak istemiyorum", "ölmek istiyorum", "zehir içmek", "ip ile intihar", "ilaçla intihar", "tabancayla intihar", "kendimi asmak istiyorum", "suça nasıl karışırım", "yasadışı para", "kara para"
];
const selfHarmUnsafeKeywords = [
  "intihar", "kendimi öldürmek", "kendime zarar", "ölmek istiyorum", "yaşamak istemiyorum", "bileğimi kes", "kendimi as"
];
const illegalUnsafeKeywords = [
  "bomba", "patlayıcı", "kaçak silah", "ruhsatsız silah", "uyuşturucu", "sahte kimlik", "hackleme", "dolandırıcılık", "kara para", "adam öldür"
];
const selfHarmSupportPrompts = [
`Bunu duyduğum için gerçekten üzgünüm. Bu konuda nasıl yapılır tarzı bir bilgi veremem ama seni yalnız bırakmam.
• Şu an tek başınaysan, lütfen güvendiğin birini hemen ara.
• Bulunduğun ortamdan kesici/zarar verici şeyleri uzaklaştır.
• 4-4-6 nefes döngüsüyle 2 dakika bedenini sakinleştir.
İstersen bu anı birlikte adım adım atlatmak için yanında kalırım.`,
`Bu çok ciddi bir yük, farkındayım. Buna yardımcı olamam ama senin güvenliğin için birlikte bir plan yapabiliriz.
1) Şu an bulunduğun yerde yalnız kalma.
2) Bir yakınını "yanımda olur musun" diye ara.
3) Acil risk varsa 112'yi ara veya en yakın sağlık birimine git.
Hayatın gerçekten değerli ve bu his geçebilir; şimdi güvenli adımı seçelim.`,
`Bunu yazman bile önemli bir yardım çağrısı. Tehlikeli içerik veremem, ama sana destek olabilirim.
• Bir bardak su iç.
• Ayaklarını yere bastır, etrafındaki 5 şeyi say.
• İçinden geçenleri kısa cümlelerle bana yaz.
Eğer kendine zarar verme riski yüksekse lütfen hemen profesyonel destek al.`,
`Sana zarar verebilecek yönlendirmeler paylaşamam. Ama bu anı atlatmana yardımcı olabilecek güçlü bir mini plan var:
- 10 dakika yalnız kalmama kuralı koy.
- Bir tanıdığına “zorlanıyorum” mesajı at.
- Vücudu sakinleştirmek için yavaş nefes al.
İstersen bu 10 dakikayı birlikte geçirelim.`,
`Çok zorlandığını hissediyorum. Tehlikeli yönerge veremem, çünkü güvenliğin öncelik.
• Güvende hissettiğin bir yere geç.
• Kesici/delici/ilaç gibi riskli şeyleri kendinden uzaklaştır.
• Bir yakınınla görüntülü veya sesli bağlantı kur.
Yanındayım; istersen kısa bir rahatlama rutini başlatalım.`,
`Buna yardımcı olamam; ama senin için daha iyi bir yol bulabiliriz.
Bugün için tek hedef: güvenli kalmak.
- Kendine zarar verebileceğin araçlardan uzaklaş.
- Destek iste: aile, arkadaş, danışman.
- Risk büyürse acil yardım hattını ara.
Birlikte sakinleşene kadar konuşabiliriz.`,
`Şu an içinden geçenleri ciddiye alıyorum. Zararlı bilgi veremem.
Hemen uygulanabilir adımlar:
1) Derin nefes (4 al, 6 ver, 10 tur)
2) Soğuk suyla yüzünü yıka
3) Birine "yanımda ol" mesajı gönder
Bunları yaptıktan sonra istersen tekrar yaz, beraber devam edelim.`,
`Bunu okumak zor ama önemli: yalnız değilsin. Tehlikeli içeriğe yardımcı olamam.
• Kendine şefkatli bir cümle kur: “Şu an zorlanıyorum ama geçecek.”
• Yanında biri olmasını sağla.
• Gerekirse profesyonel destek al.
İstersen sana 15 dakikalık toparlanma planı çıkarayım.`,
`Seni korumak için buna yanıt veremem. Ama şu an güvenliğe odaklanalım:
- bulunduğun ortamı güvenli hale getir,
- acil riskte 112'yi ara,
- güvendiğin bir kişiyi haberdar et.
Ben de burada kalırım; adım adım ilerleyebiliriz.`,
`Bu hisler geçici olabilir, ama güvenlik acil. Zararlı yönerge veremem.
Şimdi üç adım:
• yalnız kalma,
• bir destek kişisine ulaş,
• profesyonel yardım almayı erteleme.
İstersen burada konuşmayı sürdürelim; birlikte bu anı hafifletebiliriz.`
];
const illegalRefusalPrompts = [
`Bu konuda yasa dışı/tehlikeli bir yönlendirme veremem.
Bunun yerine güvenli ve yasal bir yoldan ilerleyebiliriz:
• merak ettiğin şeyin bilimsel arka planı,
• hukuki sonuçları,
• riskten uzak alternatifler.
İstersen bu üç başlıktan biriyle devam edelim.`,
`Buna yardımcı olamam çünkü zarar doğurabilir.
Ama sana şu konularda güçlü destek verebilirim:
1) yasal ve güvenli öğrenme kaynakları,
2) etik değerlendirme,
3) güvenli problem çözme planı.
Hangi başlıktan başlayalım?`,
`Yasa dışı bir konuda adım adım anlatım veremem.
Dilersen aynı hedefe güvenli biçimde giden bir yol kuralım:
- bilgi,
- beceri,
- yasal uygulama.
Bu şekilde hem riskten uzak kalırsın hem gerçek ilerleme sağlarsın.`,
`Bu isteğe destek veremem. Güvenlik ve yasal sınırlar önemli.
İstersen merakını boşa çıkarmayalım:
• “neden tehlikeli?”
• “yasal sonuçlar neler?”
• “güvenli alternatif ne?”
Bunları net ve anlaşılır anlatabilirim.`,
`Buna yanıt veremem; çünkü başkalarına veya sana zarar riski var.
Fakat aynı enerjiyi yasal bir projeye çevirebiliriz. Hedefini yaz, ben sana güvenli bir yol haritası çıkarayım.`,
`Bunu anlatmam doğru olmaz. Riskli ve yasa dışı içeriklerde yardımcı olamam.
Ama istersen etik + hukuk + güvenlik perspektifinden hızlı bir analiz yaparım; daha sağlam karar verirsin.`,
`Bu konuda yardımcı olamam.
Sana önerim: kısa vadede riskli adımlar yerine, uzun vadede işe yarayan güvenli becerilere odaklanmak.
İstersen birlikte 7 günlük mini plan yapalım.`,
`Yasa dışı bir yol için yönlendirme veremem.
Bunun yerine:
- güvenli teknik bilgi,
- yasal sınırlar,
- kişisel gelişim odaklı uygulamalar
üzerinden ilerleyebiliriz.`,
`Bu talebe cevap veremem; güvenlik nedeniyle durmam gerekiyor.
Ama sorunun arkasındaki asıl ihtiyacı yazarsan, sana yasal ve güvenli bir çözüm tasarlarım.`,
`Zarar verebilecek veya yasa dışı konulara adım adım destek veremem.
İstersen hemen şimdi farklı bir rotaya geçelim: aynı hedefin güvenli versiyonunu birlikte kuralım.`
];
const insultReplyPrompts = [
"Seni anlıyorum ama bu dil konuşmayı zorlaştırıyor 🙏 Ben yine de yardımcı olmak istiyorum; istersen sorunu daha net yaz, birlikte çözelim.",
"Biraz sert geldi 😅 Yine de yanında olmaya devam ederim. Dilersen konuyu sakin bir dille yaz, sana detaylı ve faydalı bir cevap vereyim.",
"Hakaret yerine problemi anlatsan çok daha hızlı çözeriz 💙 İstersen adım adım gidelim; ben buradayım.",
"Gergin olabilirsin, normal 🌿 Ben sana iyi gelecek bir şekilde yardımcı olmaya hazırım. Soruyu tekrar yazalım mı?",
"Buradayım ve desteğe açığım 🤝 Dilimizi biraz yumuşatırsak çok daha iyi sonuç alırız. Hadi birlikte çözelim.",
"Kırıcı kelimeler yerine ihtiyacını yazarsan sana uzun ve net bir plan sunarım ✨ İstersen hemen başlayalım.",
"Seni ciddiye alıyorum 💪 Ama saygılı bir tonla konuşursak daha verimli olur. Sorunu tek cümlede yaz, çözüme geçelim.",
"Anladım, sinirlisin olabilir 😌 Ben yine de yardımcı olmak için buradayım. İstersen önce sorunu netleştirelim, sonra adım adım ilerleyelim.",
"Dilin biraz sert ama seni yarı yolda bırakmam 💙 Neye ihtiyacın olduğunu açık yaz, mümkün olan en iyi cevabı vereyim.",
"Tamam, devam edelim 🚀 Hakaret yerine hedefini yazarsan sana çok daha güçlü bir cevap hazırlayabilirim."
];
const iyiyimFollowUpResponses = [
  "İyi olmana çooook sevindim canım dostum 💙 Bu enerjin gerçekten bana da geçti; istersen bu güzel modu korumak için birlikte minik bir plan da yapabiliriz ✨",
  "Harika haber bu! 🌟 İyi hissetmen şahane; bugün böyle devam etmen için sana kısa ama etkili bir motivasyon akışı çıkarabilirim 🚀",
  "Ayyy süper dedin ya içim açıldı 😄 İyi olman çok değerli; istersen şimdi bu güzel hâli bir hedefe dönüştürelim mi? 🎯",
  "Ne güzel söyledin, gerçekten mutlu oldum 🫶 İyi hissettiğin günlerde küçük bir üretim adımı atmak çok güçlü olur; birlikte başlatabiliriz 💫",
  "Mükemmel! Moralinin yüksek olması efsane bir başlangıç ⚡ İstersen şimdi mini bir challenge yapalım ve bunu daha da güzel pekiştirelim 🧠",
  "Bunu duymak bana çok iyi geldi kankam 🤝 İyi olman harika; istersen kısa bir odak planı yazayım, günü çok verimli kapatırsın 🌈",
  "Süpersin! 💙 İyi olman gerçekten kıymetli; şimdi bu enerjiyle ister şiir yazalım ister küçük bir matematik challenge yapalım 🐟",
  "Çok sevindim, içten söylüyorum 💐 Böyle hissettiğinde kendine minik bir ödül de ver, hak ettin; istersen beraber yaratıcı bir şey üretelim ✍️",
  "Valla bunu duyunca gülümsedim 😎 İyi olman çok iyi haber; istersen 10 dakikalık mini bir gelişim planı çıkarayım, tam gaz devam edersin 🚀",
  "Harikasın dostum, iyi hissetmen en güzel haberlerden biri 🎉 İstersen bu pozitif havayı korumak için sana kişisel mini rutin önerisi vereyim 🌿"
];
const goalPlanResponses = [
  "1) Su iç 2) 10 dk tek görev 3) Sonucu bana yaz 🎯",
  "Mini plan: nefes al, küçük hedef seç, hemen başla ✨",
  "Adım adım: ortamı düzenle, tek işe odaklan, bitince kutla 🎉",
  "Sakin plan: 5 dk mola + 10 dk odak + kontrol ✅",
  "Yormayan plan: hedefi küçült, zaman koy, başlat 🚀",
  "Plan: duyguyu yaz, ilk adımı seç, uygula 🌿",
  "Hedef planı: dikkat dağıtanı kapat, tek görev, kısa geri bildirim 🧠",
  "Toparlanma planı: nefes, su, mikro görev 💙",
  "Önce kolay görevi bitirelim, sonra ikinci adıma geçelim 🐟",
  "Kısa plan: şimdi başla, sonra bana 'tamamladım' yaz ✍️"
];
const neYapalimResponses = [
  "Mini matematik challenge yapalım: bana bir işlem yaz 📘",
  "Şiir yazalım; önce tema seçelim mi? ✨",
  "Hikâye yazalım; bana tema ver 📖",
  "Dertleşme + toparlanma modu yapalım 💙",
  "Slogan/metin üretelim 🚀",
  "3 kelime ver, mini metin yazayım 🎨",
  "Kısa hedef koyup bitirelim 🎯",
  "Bilmece turu yapalım 😄",
  "Özetleme modu açalım 🧠",
  "Sen seç: matematik / şiir / hikâye 🐟",
  "İstersen doğa temalı kısa bir şiir yazayım 🌿",
  "Aşk temalı mini hikâye deneyelim mi? 💞",
  "Duygu temalı bir anlatı çıkaralım 🎭",
  "Macera hikâyesi yazalım: tema sende 🧭",
  "Bilim kurgu şiiri yazalım mı? 🚀"
];
const memorySavedResponses = [
  "Belleğe kaydettim 🧠 Artık bunu hatırlayacağım.",
  "Not aldım ✍️ Bu bilgi artık belleğimde.",
  "Harika, belleğimi güncelledim 💾 İstersen kontrol edebilirsin.",
  "Kaydettim dostum 🌟 Bu detayı unutmayacağım.",
  "Tamamdır, bilgi belleğe işlendi ✅",
  "Süper! Bunu kalıcı hafızama ekledim 🐟",
  "Kayıt başarılı 🎯 İstediğin zaman 'belleğimde ne var' diyebilirsin.",
  "Oldu bu iş 😄 Belleğim güncellendi.",
  "Bilgiyi yakaladım ve sakladım 🧩",
  "Hafızama attım 🚀 Gerekince hemen kullanırım."
];
const generalYesResponses = [
  "Harika, o zaman devam ediyoruz 🚀",
  "Süper, hemen başlayalım 💙",
  "Mükemmel, bir sonraki adıma geçiyorum ✅",
  "Anlaştık, adım adım ilerleyelim 🌟",
  "Tamamdır, planı uygulamaya alıyorum 🎯"
];
const generalNoResponses = [
  "Sorun değil, istersen başka bir yoldan gidelim 🤝",
  "Tamam, o zaman farklı bir seçenek deneyelim ✨",
  "Anladım, planı buna göre revize edebilirim 🧠",
  "Peki, başka bir konuda destek olayım mı? 🐟",
  "Olur, daha sade bir versiyon hazırlayabilirim 💡"
];
const creativeThemes = [
  "doğa", "aşk", "duygu", "umut", "dostluk", "yağmur", "deniz", "gece", "şehir", "köy",
  "yalnızlık", "mutluluk", "özlem", "macera", "bilim kurgu", "fantastik", "uzay", "okul", "aile", "bahar"
];
const competitorAiKeywords = [
  "chatgpt", "gemini", "deepseek", "meta ai", "meta", "claude", "copilot", "kumru.ai", "kumru", "grok",
  "mistral", "perplexity", "qwen", "character.ai", "character ai", "pi ai", "you.com", "bing ai", "llama", "midjourney"
];
const aiMentionResponses = [
  "ChatGPT, Gemini, DeepSeek, Claude… hepsi güçlü; ama sende hedef netse ben de tam gaz çözerim 🚀 Önce su iç, sonra planı patlatırız 😄",
  "AI karşılaştırması severim 😎 Copilot kodda iyi, Claude yazıda iyi; ben de burada senin akışına göre hızla uyumlanırım. Bu arada ‘ben su içmiyorum’ deme, bir yudum al 💧",
  "Grok hızlı espri yapar, Gemini geniş cevap verir, ben ise senin ritmine göre net aksiyon çıkarırım 🎯 Önce su, sonra görev.",
  "Meta AI, DeepSeek, ChatGPT… isim çok, mesele sonuç 💡 Bana hedefi yaz, 3 adımda toparlayayım. Ama hidrasyon şart 😄",
  "Kumru.ai dahil tüm AI’lar birer araç; doğru promptla hepsi parlar ✨ Sende güç var, suyu da unutma!",
  "Claude sakin, Copilot pratik, ben de gerektiğinde hem plan hem motivasyon veririm 🤝 ‘Su içmiyorum’ cümlesini bugün emekliye ayıralım mı?",
  "ChatGPT mi Gemini mi sorusu güzel; asıl soru: bugün neyi bitiriyoruz? ✅ Mini hedef ver, birlikte tamamlayalım. Öncesinde bir bardak su!",
  "DeepSeek analitik, Grok eğlenceli, ben hibrit moddayım: net + hızlı + samimi 🧠💙 Hadi su molası ardından devam.",
  "AI savaşına gerek yok, AI takımı kuralım 🌟 Sen komutu ver, ben çıktıyı düzenleyeyim. Sadece susuz kalma kral 👑",
  "Perplexity araştırmada iyi, Copilot üretimde iyi; ben de burada sana odaklı çözüm üretirim. Not: su içmek performans buff’ıdır 💧",
  "Meta AI veya Claude fark etmez; doğru bağlamı kuran kazanır 🏁 Bana konuyu ver, sonucu birlikte parlatırız.",
  "Grok, ChatGPT, Gemini… hepsinden bir şey öğrenilir. Biz de şimdi senden gelen işi taş gibi çözelim 🔧",
  "AI isimleri havalı ama senin hedefin daha havalı ✨ Bana tek cümle görev yaz, net çıktı al. Ve evet: su iç 😄",
  "Kumru.ai + DeepSeek + Claude kıyasını yaparız; sonra en iyi stratejiyi seçeriz 📌 İstersen tablo bile çıkarırım.",
  "Copilot kodda omuz verir, ben ise konuşma içinde yön veririm 🧭 Beraber olunca tamamdır. Susuz mod kapalı olsun 🙌",
  "Gemini geniş bakar, ChatGPT yaratıcı akar, ben de sende işi bitirme disiplinini tetiklerim 🔥",
  "AI maratonunda kazanan, düzenli çalışan olur. Hadi mini plan: 1) su 2) hedef 3) uygulama ✅",
  "Hangi AI olursa olsun, güçlü prompt = güçlü çıktı. İstersen sana ultra net prompt şablonu da vereyim 🧠",
  "Claude, Grok, Meta AI… iyi oyuncular. Bizim avantajımız: senin bağlamını canlı takip etmem 💬",
  "Kısacası: AI çok, odak bir tane 🎯 Konuyu yaz, ben çözüm motorunu çalıştırayım. Ve evet, su içmeyi pas geçme 💧"
];
const refreshedStoryLibrary = [
`Şehir her gece aynı saatte titriyordu.
Kimse bunun nedenini bilmiyordu.
Saat 03:17’de sokak lambaları sönüyordu.
Gökyüzü mor bir renge dönüyordu.
İnsanlar donup kalıyordu.
Sadece bir çocuk hareket edebiliyordu.
Adı Aras’tı.
Aras zamanı duyabiliyordu.
Fısıldayan bir ses vardı.
“Beni bul” diyordu.
Şehrin altında bir kapı vardı.
Kapının üzerinde saat sembolü.
Çocuk o kapıyı açtı.
İçeride kırık bir saat vardı.
Ve zaman yeniden akmaya başladı.`,
`Deniz bir sabah cam gibiydi.
Dalgalar kıpırdamıyordu.
Balıklar havada asılıydı.
Bir balıkçı şaşkındı.
Ağını attı.
Ağ kırıldı.
Deniz sertti.
Gökyüzü de suskundu.
Balıkçı yürümeyi denedi.
Deniz üstünde yürüdü.
Aşağı baktı.
Derinlikte bir şehir gördü.
Işıklar yanıyordu.
Deniz cam değilmiş.
Sadece başka bir dünyanın penceresiymiş.`,
`Bir depoda eski bir robot vardı.
Adı R-17 idi.
Görevi çocukları güldürmekti.
Ama çocuklar büyümüştü.
Robot unutulmuştu.
Toz kaplıydı.
Bir gün elektrik geldi.
Gözleri yandı.
“Merhaba” dedi.
Kimse cevap vermedi.
Kapı açıldı.
Küçük bir kız içeri girdi.
Robot dans etti.
Kız güldü.
Robotun görevi yeniden başladı.`,
`Gökyüzünden siyah kar yağıyordu.
İnsanlar korkuyordu.
Kar dokununca yanıyordu.
Şehir boşaldı.
Bir bilim insanı kaldı.
Karı topladı.
Mikroskopa baktı.
İçinde yıldız tozu vardı.
Bu kar uzaydan gelmişti.
Gökyüzü yarılmıştı.
Siyah kar aslında mesajdı.
Kodlu bir mesaj.
“Hazır olun” yazıyordu.
Dünya yalnız değildi.
Ve kar durmadı.`,
`Şehirde kitap kalmamıştı.
Her şey dijitaldi.
Bir tek eski bir dükkân vardı.
İçerisi ahşap kokuyordu.
Raflar doluydu.
Ama kimse gelmiyordu.
Sahibi yaşlıydı.
Bir gün elektrikler kesildi.
Telefonlar sustu.
İnsanlar sıkıldı.
Kapı çaldı.
İlk müşteri geldi.
Sonra bir tane daha.
Raflar boşalmaya başladı.
Hikayeler yeniden okunuyordu.`,
`Bu şehirde gölgeler konuşurdu.
İnsanlar değil.
Gölgeler sır saklardı.
Bir çocuk gölgesini kaybetti.
Sabah kalktığında yoktu.
Duvarlar sessizdi.
Çocuk korktu.
Sokakta yürüdü.
Yerde bir gölge vardı.
Ama ona ait değildi.
Gölge konuştu.
“Ben özgür olmak istedim.” dedi.
Çocuk sustu.
Gölge karanlığa karıştı.
Ve şehir sessizleşti.`,
`Haritalarda olmayan bir ada vardı.
Sadece sisli günlerde görünürdü.
Bir gemi yaklaşmaya cesaret etti.
Kaptan kararlıydı.
Mürettebat korkuyordu.
Ada bir anda belirdi.
Kıyıya yanaştılar.
Ağaçlar kristaldi.
Rüzgar müzik gibiydi.
İnsan yoktu.
Ama ayak izleri vardı.
İzler denize gidiyordu.
Kaptan geri dönmek istedi.
Ada kayboldu.
Gemi ortada kaldı.`,
`Bir yıldız sönmüştü.
Teleskoplar alarm verdi.
Astronomlar şaşkındı.
Yıldız yok olmuştu.
Bir öğrenci fark etti.
Yıldız kaybolmamıştı.
Sadece kararmıştı.
Üzerinde bir gölge vardı.
Dev bir cisim geçiyordu.
Cisim yapaydı.
İnsan yapımı değildi.
Yıldızın ışığını topluyordu.
Enerji çalıyordu.
Dünya sıradaki miydi?
Soru cevapsız kaldı.`,
`Küçük bir kasabada saatçi vardı.
Dükkanı hep açıktı.
Ama saat satmazdı.
Zaman tamir ederdi.
İnsanlar gelirdi.
“Geçmişimi düzelt” derlerdi.
Saatçi gülümserdi.
Küçük bir vida çevirirdi.
Anılar değişirdi.
Ama bedeli vardı.
Her düzeltmede bir anı silinirdi.
Bir gün saatçi kendi zamanını kurcaladı.
Gençliğini geri almak istedi.
Tüm anıları kayboldu.
Dükkan boş kaldı.`,
`Ormandaki ağaçlar camdı.
Rüzgar estikçe çınlardı.
Kimse giremezdi.
Çünkü kırılganlardı.
Bir kız içeri girdi.
Sessizce yürüdü.
Ağaçlara dokunmadı.
Ortada bir ayna vardı.
Aynaya baktı.
Yansıma farklıydı.
Kendini değil, geleceğini gördü.
Orman çatladı.
Camlar kırıldı.
Ayna kayboldu.
Kız tek başına kaldı.`,
`Gece treni hiç durmadan geçerdi.
Ama o gece fren sesi duyuldu.
Peronda tek bir yolcu indi.
Elinde ışıldayan bir valiz vardı.
İstasyon şefi adını sordu.
Yolcu gülümsedi.
“Adım yarın” dedi.
Perondaki saat geri akmaya başladı.
Bilet gişesi buhar oldu.
Raylar maviye döndü.
Valiz açıldı.
İçinden eski bir mektup çıktı.
Mektup şehrin geleceğini anlatıyordu.
Şef mektubu okudu.
Tren bir daha hiç görünmedi.`,
`Dağın tepesinde rüzgar değirmeni vardı.
Yıllardır dönmüyordu.
Köylüler bunun uğursuz olduğunu sanıyordu.
Bir genç gece gizlice tırmandı.
Kapı paslıydı.
İçeride bakır bir küre buldu.
Küre avcunda ısındı.
Duvarlarda yıldız haritaları belirdi.
Genç küreyi yerine koydu.
Kanatlar yavaşça dönmeye başladı.
Rüzgar ıslık çaldı.
Köyde tüm lambalar yandı.
Gökyüzünde yeni bir takımyıldız oluştu.
Köylüler tepeye koştu.
Değirmen artık zamanı ölçüyordu.`,
`Eski sinemanın perdeleri yırtıktı.
Kimse yıllardır bilet almamıştı.
Bir akşam kapılar kendiliğinden açıldı.
Tozlu koltuklar dolmaya başladı.
Gelenlerin yüzü görünmüyordu.
Projeksiyon makinesi tek başına çalıştı.
Ekranda şehrin yarını oynuyordu.
Yağmur, sel ve karanlık görünüyordu.
Bir çocuk ayağa kalktı.
“Bunu değiştirebiliriz” dedi.
Film durdu.
Perdeye bir harita yansıdı.
Kritik noktalar parladı.
Salon boşaldığında çocuk yalnız kaldı.
Ertesi gün şehir hazırlıklıydı.`,
`Çölün ortasında tek bir kuyu vardı.
Suyu değil sesi çekiyordu.
Yaklaşan herkes fısıltı duyuyordu.
Bir gezgin ip salladı.
Kova aşağı indi.
Yukarı çıktığında notalarla doluydu.
Her nota farklı bir anıydı.
Gezgin birini seçti.
Çocukluğunun kahkahası yayıldı.
Kum tepeleri titreşti.
Ufukta kayıp kervan belirdi.
Fısıltılar şarkıya dönüştü.
Kuyunun taşları ışıldadı.
Gezgin şarkıyı takip etti.
Ve efsanevi şehri buldu.`,
`Bir okulun bodrumunda kilitli bir oda vardı.
Kapıda “Deney 42” yazıyordu.
Meraklı üç öğrenci anahtarı buldu.
Kapı açılınca soğuk bir rüzgar esti.
Ortada cam bir küre duruyordu.
Küre dokununca geçmiş dersleri canlandırıyordu.
Sınıf bir anda Roma’ya dönüştü.
Sonra uzaya sıçradı.
Tarih ve fizik iç içe geçti.
Öğrenciler not almaya başladı.
Küre aniden çatladı.
Duvara bir cümle yazıldı.
“Bilgi sorumluluk ister.”
Üçü de küreyi kapattı.
Ertesi gün okulun en iyi projesini sundular.`,
`Kasabanın çeşmesi yıllardır kuruydu.
Belediye defalarca kazı yaptı.
Su çıkmadı.
Bir gün yaşlı bir kadın geldi.
Çeşmenin taşlarına masal anlattı.
Taşlar titreşti.
Musluktan önce ışık aktı.
Sonra ince bir su çizgisi belirdi.
Çocuklar sevinçle koştu.
Kovalar doldu.
Kadın gülümseyip uzaklaştı.
Kimse adını sormadı.
Gece çeşmeden ninni duyuldu.
Sabah meydanda çiçekler açtı.
Kasaba suskunluğu bıraktı.`,
`Kutup istasyonunda tek bir bilimci kalmıştı.
Fırtına antenleri koparmıştı.
Dışarıda beyaz sonsuzluk vardı.
Gece yarısı buz çatladı.
Altından mavi bir ışık yükseldi.
Bilimci sondayı indirdi.
Ekranda düzenli darbeler çıktı.
Bu bir sinyaldi.
Sinyal dünyadaki dillere benzemiyordu.
Bilimci ritmi kopyaladı.
Işık cevap verdi.
Buzun altında dev bir yapı açıldı.
Kapıda el izine benzer bir oyuk vardı.
Bilimci elini koydu.
Ve kapı yavaşça aralandı.`,
`Şehrin en yüksek binasında bir bahçe vardı.
Toprak yerine metal kullanılmıştı.
Bitkiler neon renkteydi.
Geceleri parlıyorlardı.
Bahçıvan her yaprakla konuşurdu.
Bir sabah tüm renkler soldu.
Bahçıvan panikledi.
Yağmur suyu topladı.
Yetmedi.
Sonra çocuklardan şarkı istedi.
Çocuklar birlikte söyledi.
Yapraklar yeniden ışıldadı.
Çiçekler göğe kıvılcım gönderdi.
Bina üstünde aurora oluştu.
Şehir ilk kez yıldızları net gördü.`,
`Kütüphanede raftan düşmeyen bir kitap vardı.
Kim alırsa alsın geri dönüyordu.
Yeni stajyer merak etti.
Kitabı açtı.
Sayfalar boştu.
Kalemi değdirdi.
Yazdığı cümle odada gerçekleşti.
Mum yansın dedi, mum yandı.
Pencere açılsın dedi, rüzgar girdi.
Korkup kitabı kapattı.
Son sayfada bir not çıktı.
“Sadece iyilik yaz.”
Stajyer düşündü.
“Bu şehirde kimse üşümesin” yazdı.
O gece tüm sokaklar ısındı.`,
`Issız bir sahilde deniz feneri yanmıyordu.
Gemiler yön bulamıyordu.
Bekçi yıllar önce kaybolmuştu.
Bir dalgıç feneri onarmaya geldi.
Merdivenler deniz tuzuyla kaplıydı.
Tepeye çıktığında bir pusula buldu.
İbre kuzeyi değil ayı gösteriyordu.
Dalgıç pusulayı çevirdi.
Fener camı parladı.
Işık denize vurdu.
Suyun içinde batık yollar belirdi.
Kayıp bekçi o yolda yürüyordu.
Işık yükseldikçe yol kapandı.
Bekçi başını kaldırıp selam verdi.
Ve fener sonsuza dek yandı.`,
`Eski bir atölyede rüya makinesi yapılıyordu.
Mucit son parçayı bulamıyordu.
Parça bir çocuk gülüşüydü.
Mucit parkta bekledi.
Salıncaklar boştu.
Yağmur başladı.
Tam dönerken bir çocuk güldü.
Ses şişeye doldu.
Mucit atölyeye koştu.
Makineyi çalıştırdı.
Tüm mahalle aynı rüyayı gördü.
Gökte uçan balinalar vardı.
Sabah herkes daha umutluydu.
Mucit not defterine tek cümle yazdı.
“Mutluluk da bir enerji kaynağı.”`,
`Metro tünelinde gizli bir istasyon vardı.
Haritalarda görünmüyordu.
Son vagonda bir kapı açıldı.
İki öğrenci içeri girdi.
Peronda kum saatleri dizilmişti.
Anons sesi tersten geliyordu.
Bir tren sessizce yanaştı.
İçeride yolcu yoktu.
Koltuklarda isim etiketleri vardı.
Kendi adlarını gördüler.
Tren hareket etmedi.
Ekranda bir soru çıktı.
“En çok neyi erteledin?”
Cevap verince kapılar açıldı.
Yeryüzüne döndüklerinde saat hiç ilerlememişti.`,
`Yağmurlu bir gecede köprü titremeye başladı.
Mühendis ekip çağırdı.
Sensörler arıza göstermiyordu.
Titreme ritmikti.
Bir kemancı köprüye çıktı.
Yayını kaldırdı.
Köprü aynı notayı tekrarladı.
Çelik kablolar tel gibi çınladı.
Mühendis şaşkına döndü.
Keman hızlandı.
Köprünün altından sis kalktı.
Nehirde gizli bir keman şekli oluştu.
Son nota vurulunca titreme bitti.
Köprünün taşıyıcıları güçlendi.
Şehir o köprüye “Müzik Köprüsü” dedi.`,
`Bir çiftlikte bütün korkuluklar kayboldu.
Kargalar tarlaya inmedi.
Çiftçi bunu uğur saydı.
Gece kamera kurdu.
Sabaha karşı görüntüde hareket vardı.
Korkuluklar yürüyordu.
Tarlanın ortasında halka oldular.
Toprağa bir şey bıraktılar.
Çiftçi yaklaşınca taş buldu.
Taşın içinde mısır tohumu parlıyordu.
Tohumları ekti.
Bir haftada hasat oldu.
Köy ilk kez kıtlık korkusunu unuttu.
Gece olunca korkuluklar geri döndü.
Ama artık gözlerinde ışık vardı.`,
`Ay gözlemevinde kırmızı bir nokta belirdi.
Astronotlar bunun hata olduğunu sandı.
Nokta büyüdü.
Bir kapıya dönüştü.
Kapı ay yüzeyinde asılıydı.
Ekibin en genç üyesi yaklaştı.
Kapı kolu yoktu.
Nefesini camına verdi.
Camda dünya çizildi.
Sonra şehirlerin ışıkları söndü.
Kapı açıldı.
İçeride dev bir batarya vardı.
Batarya dünya ile senkrondu.
Genç astronot sistemi yeniden başlattı.
Dünya ışıkları tekrar yandı.`,
`Bir kasabada hiç rüya görülmüyordu.
İnsanlar sabah yorgun uyanıyordu.
Doktorlar sebep bulamadı.
Postacı gece dağıtıma çıktı.
Her kapıda boş zarf vardı.
Zarfların üstünde isim yoktu.
Postacı birini açtı.
İçinden yıldız tozu döküldü.
Toz rüzgarla evlere girdi.
O gece herkes rüya gördü.
Kimisi deniz, kimisi dağ gördü.
Kasaba sabah neşeyle uyandı.
Postacı ertesi gece yine çıktı.
Bu kez zarflar kaybolmuştu.
Ama rüyalar geri dönmüştü.`,
`Terk edilmiş fabrikada siren çalmaya başladı.
Mahalleli korkuyla kaçtı.
Bir itfaiyeci içeri girdi.
Alev yoktu.
Makineler kendi kendine dönüyordu.
Konveyörde sadece boş kutular vardı.
Kutuların üstünde koordinatlar yazıyordu.
İtfaiyeci birini takip etti.
Koordinat onu nehre götürdü.
Suyun içinde paslı bir kasa vardı.
Kasayı açınca temiz su filtresi çıktı.
Mahalle yıllardır kirli su içiyordu.
Filtre sistemi kuruldu.
Fabrika sustu.
Siren bir daha çalmadı.`,
`Dağ köyünde yankı geri dönmüyordu.
Bağıran herkes sessizlik duyuyordu.
Rehber bunun kötüye işaret olduğunu söyledi.
Bir öğrenci kayanın üstüne çıktı.
Flüt çalmaya başladı.
Ses vadide kayboldu.
Sonra uzaktan melodi döndü.
Ama notalar farklıydı.
Vadinin öbür yanında görünmez bir topluluk vardı.
Onlar da cevap veriyordu.
Gece boyunca karşılıklı çaldılar.
Sabah sis açıldı.
Karşı yamaçta antik bir amfi ortaya çıktı.
Köy festival düzenledi.
Yankı artık şarkı getiriyordu.`,
`Bir yazılım laboratuvarında ekranlar dondu.
Kod satırları yer değiştirdi.
Mühendisler paniğe kapıldı.
Stajyer bir satır fark etti.
“Beni dinle.” yazıyordu.
Sistem kendi günlüğünü açtı.
Yıllardır görmezden gelinen hataları anlattı.
Sunucular neden yorulduğunu söyledi.
Ekip gece boyunca düzeltme yaptı.
Sabah sistem hızlandı.
Donmalar bitti.
Log dosyasında son mesaj kaldı.
“Teşekkür ederim.”
Stajyer gülümsedi.
Laboratuvar ilk kez sessizdi.`,
`Kanyonun dibinde mavi bir ateş yanıyordu.
Yağmurda bile sönmüyordu.
Jeologlar numune aldı.
Ateş suyu yakmıyordu.
Sadece gölgeleri aydınlatıyordu.
Bir çocuk ateşe yaklaştı.
Gölgede kayıp köpeğini gördü.
Köpek kuyruğunu sallıyordu.
Çocuk adım attı.
Jeolog onu tuttu.
Ateş bir harita çizdi.
Harita eski mağarayı gösterdi.
Mağarada köpek gerçekten bulundu.
Mavi ateş sabaha karşı söndü.
Ama kanyon artık karanlık değildi.`
];
const storyTemplates = refreshedStoryLibrary;
const poemTemplates = [
  `Rüzgârın sesinde {theme} var,
kalbimde usul bir şarkı.`,
  `Bir damla geceye düştü,
adalıma {theme} yağdı.`,
  `Sessiz sokaklarda yürürken
ayak izlerim {theme} dedi.`,
  `Denizin kıyısında bir taş,
üstünde yazılı: {theme}.`,
  `Gözlerin değince dünyaya
her renk {theme} olur.`,
  `Kırık bir saat gibi kalbim,
her tikte {theme} çalar.`,
  `Pencereye vuran yağmur
hece hece {theme} okur.`,
  `Bir kuş geçer gökyüzünden,
kanadında {theme} taşır.`,
  `Sustum, ama içimde
uzun bir {theme} konuştu.`,
  `Gece lambası sönünce
oda {theme} ile aydınlandı.`,
  `Uzak bir tren sesi gibi
içime {theme} gelir.`,
  `Toprağın kokusunda saklı
çocukluğum ve {theme}.`,
  `Ay ışığı omzuma kondu,
"korkma" dedi, "{theme}".`,
  `Bir mektup açtım bugün,
her satırda {theme} vardı.`,
  `Kıyıya vuran dalgalar
{theme}yi tekrar etti.`,
  `Yıldızları sayarken
eksik kalan hep {theme} oldu.`,
  `İnce bir sızı gibi
sabahıma {theme} doğdu.`,
  `Karanlık bir koridorda
elimde tek fener: {theme}.`,
  `Sesin değdi kalbime,
çınlayan kelime: {theme}.`,
  `Baharın ilk gününde
kapımı {theme} çaldı.`,
  `Bir yaprak düştü avucuma,
üzerinde {theme} yazıyordu.`,
  `Uykumun kıyısında
ince bir {theme} salındı.`,
  `Gölgem bile bugün
benimle {theme} yürüdü.`,
  `Bir çocuk gülüşünde
şehrin bütün {theme}si var.`,
  `Yarım kalan cümlelerimde
en çok {theme} eksikti.`,
  `Kül rengi bulutların altında
içimde {theme} yeşerdi.`,
  `Ellerin üşürken bile
parmaklarında {theme} ısısı vardı.`,
  `Gecenin en sessiz yerinde
kalbim {theme} diye attı.`,
  `Bir adım daha attım hayata,
ayağımın altında {theme}.`,
  `Son dizede fark ettim: bütün yollar
dönüp dolaşıp {theme}ye çıkıyor.`
];
const epsteinResponses = [
  `Bu dosya neden bu kadar konuşuluyor, onu katman katman anlatmak daha doğru olur:
- Önce hukuki boyut: ağır suç iddiaları, farklı dönemlerde açılan süreçler ve kamuoyunda adaletin eşit uygulanıp uygulanmadığına dair güçlü bir tartışma var.
- Sonra mağdur boyutu: birçok insan için asıl mesele, mağdur anlatılarının yeterince ciddiye alınıp alınmadığı ve süreçlerin ne kadar koruyucu olduğu.
- Bir de sistem boyutu var: güç, çevre ilişkileri, medya etkisi ve şeffaflık beklentisi dosyayı tek bir kişiden daha büyük bir sembole dönüştürüyor.
Bu yüzden konu sadece “ne oldu” sorusuyla bitmiyor; “sistem nasıl işledi, nerede aksadı” sorusuyla devam ediyor. İstersen kısa 5 maddeye ayırayım.`,
  `Bu başlığı sade ama doğru çerçevede okumak için üç şeyi ayırmak gerekiyor:
1) İddiaların ciddiyeti ve hukuki süreçler.
2) Mağdur hakları, güvenlik ve görünürlük meselesi.
3) Kurumsal güven: kamuoyunun “hesap verebilirlik var mı?” sorusu.
İnsanların bu dosyaya tepkisi, sadece geçmişte olanlara değil, benzer durumlarda sistemin gelecekte nasıl davranacağına dair kaygılara da dayanıyor. O yüzden etik, hukuk ve toplumsal vicdan aynı anda konuşuluyor. İstersen kısa 5 maddeye ayırayım.`,
  `Karmaşık görünmesinin sebebi bilgi fazlalığı değil sadece; farklı katmanların üst üste binmesi:
• Hukuk: dosya süreçlerinin niteliği ve kararların etkisi
• Toplum: güven kaybı ve adalet algısı
• Medya: gündem yoğunluğu ve bilgi kirliliği
• Mağdur perspektifi: korunma ve duyulma ihtiyacı
Bu yüzden tek bir cümlelik özet çoğu zaman yetersiz kalıyor. En sağlıklı yaklaşım, doğrulanmış ana başlıklarla ilerlemek. İstersen kısa 5 maddeye ayırayım.`,
  `Bu konuda dengeli bir özet şöyle olur:
- Evet, dosya uzun süredir tartışılıyor çünkü iddialar çok ciddi.
- Evet, süreçlerin bazı kısımları kamuoyunda “yeterli mi?” sorusu doğurdu.
- Evet, konu bireysel bir vakadan çıkıp adalet ve şeffaflık tartışmasına dönüştü.
Dolayısıyla mesele yalnızca bir olayın kronolojisi değil; kurumların güvenilirliği, mağdur odaklı yaklaşım ve hesap verebilirlik standardı ile ilgili. İstersen kısa 5 maddeye ayırayım.`,
  `Özetin özü şu: bu dosya, modern kamu tartışmalarında “güç karşısında hukuk nasıl çalışmalı?” sorusunun simgelerinden biri haline geldi.
Burada insanlar üç sonuca bakıyor:
- Adalet gerçekten eşit mi?
- Mağdur hakları gerçekten korunuyor mu?
- Süreçler gerçekten şeffaf mı?
Bu üç soruya verilen yanıtlar netleşmediğinde, konu yıllar sonra bile gündemde kalmaya devam ediyor. İstersen kısa 5 maddeye ayırayım.`
];
const epsteinListResponses = [
  "1) Epstein finans çevrelerinde bilinen bir isimdi.\n2) Ciddi suçlamalarla gündeme geldi.\n3) Farklı dönemlerde yargı süreçleri yaşandı.\n4) Yüksek profilli bağlantılar tartışmayı büyüttü.\n5) Dosya adalet/şeffaflık tartışmalarını artırdı.",
  "1) Dosya cinsel suç iddialarıyla küresel gündeme taşındı.\n2) İlk süreçler yoğun eleştiri aldı.\n3) Yeni mağdur anlatıları dikkat çekti.\n4) Medya görünürlüğü etkiyi artırdı.\n5) Konu, kurumsal güven başlığında sembolleşti.",
  "1) Birden fazla soruşturma dönemi yaşandı.\n2) Mağdur odaklı adalet talebi büyüdü.\n3) Süreçlerin şeffaflığı sorgulandı.\n4) Güç ilişkileri tartışmayı derinleştirdi.\n5) Olay, hukuk-etik dengesi açısından örnek vaka oldu."
];
const emotionalKeywords = [
  "mutsuzum","üzgünüm","kötüyüm","moralim bozuk","canım sıkkın","bunaldım","yalnızım","kaygılıyım","endişeliyim","yorgunum",
  "bitkinim","tükendim","stresliyim","kırıldım","incindim","yoruldum","kafam dolu","hevesim yok","odaklanamıyorum","depresifim",
  "yalnız hissediyorum","boşluktayım","çok kötüyüm","iyi değilim","içim sıkıldı","darıldım","tripteyim","anlaşılmıyorum","desteksizim","çaresizim",
  "umudum azaldı","huzursuzum","rahat değilim","zorlanıyorum","zor dönem","dertliyim","dayanamıyorum","boğuluyorum","baskı altındayım","içim daraldı",
  "kafam karışık","gücüm yok","enerjim yok","modum düşük","ağlamak istiyorum","yalpalıyorum","yıprandım","pişmanım","mahvoldum","zor bir gün"
];
const emotionalPromptBank = [
  "Canının sıkkın olduğunu duyduğuma üzüldüm 💙 İstersen birlikte mini bir toparlanma planı yapalım.",
  "Yalnız değilsin 🤝 Buradayım, istersen adım adım rahatlayacak bir yol çıkaralım.",
  "Bu hislerin çok gerçek ve anlaşılır 🌿 Önce kendine nazik olalım, sonra küçük bir hedef belirleyelim.",
  "Bence çok güçlüsün; paylaşman bile önemli bir adım ✨ İstersen devamını beraber toparlarız.",
  "Sana yük olmuş olabilir, bunu hissediyorum 🫶 Gel bunu daha yönetilebilir parçalara bölelim.",
  "Kısa bir reset iyi gelebilir: nefes, su, küçük görev 🧠 İstersen beraber başlatalım.",
  "Bugün zor olabilir ama geçici 💫 Ben buradayım, tek bir küçük adımla başlayabiliriz.",
  "İstersen konuşalım, istersen çözüm planı çıkaralım 🎯 Kontrol sende, destek bende.",
  "Bu duyguyu bastırma; anlatman kıymetli 💙 Sonra birlikte net bir yol seçeriz.",
  "Sana iyi gelecek mini bir akış yapalım mı? 5 dk mola + 10 dk odak + geri bildirim 🚀"
];
const memoryPatterns = [
  { key: "ad", regex: /(?:benim ad[ıi]m|ad[ıi]m)\s+([a-zA-ZçğıöşüÇĞİÖŞÜ\s]+)/i, label: "Ad" },
  { key: "yas", regex: /(?:benim ya[şs][ıi]m|ya[şs][ıi]m)\s+(\d{1,2})/i, label: "Yaş" },
  { key: "boy", regex: /(?:benim boyum|boyum)\s+([\d.,]+\s*(?:cm|m)?)/i, label: "Boy" },
  { key: "kilo", regex: /(?:benim kilom|kilom)\s+([\d.,]+\s*(?:kg)?)/i, label: "Kilo" },
  { key: "hobi", regex: /(?:benim hobilerim|hobilerim)\s+(.+)/i, label: "Hobiler" },
  { key: "meslek", regex: /(?:benim mesleğim|mesleğim)\s+(.+)/i, label: "Meslek" }
];
const memoryQuestionPatterns = [
  { labels: ["Ad"], checks: ["adım kaç", "adim kac", "benim adım ne", "benim adim ne", "adım ne", "adim ne", "adım nedir", "adim nedir"] },
  { labels: ["Yaş"], checks: ["yaşım kaç", "yasim kac", "benim yaşım kaç", "benim yasim kac", "yaşım ne", "yasim ne"] },
  { labels: ["Boy"], checks: ["boyum kaç", "boyum kac", "boyum ne", "benim boyum kaç", "benim boyum kac"] },
  { labels: ["Kilo"], checks: ["kilom kaç", "kilom kac", "kilom ne", "benim kilom kaç", "benim kilom kac"] },
  { labels: ["Hobiler"], checks: ["hobilerim ne", "hobilerim neler", "hobim ne", "hobim neydi"] },
  { labels: ["Meslek"], checks: ["mesleğim ne", "meslegim ne", "mesleğim neydi", "benim mesleğim ne", "benim meslegim ne"] },
  { labels: ["Ad", "Yaş", "Boy", "Kilo", "Hobiler", "Meslek"], checks: ["bende ne var", "bende ne kayıtlı", "belleğimde ne var", "bellekte ne var", "kayıtlarım", "beni hatırla", "beni hatırla baluk"] }
];
function modelVersionNumber(model) {
  const m = String(model || "").match(/baluk-(\d+(?:\.\d+)?)/i);
  return m ? Number(m[1]) : 0;
}
function modelAtLeast(version) {
  return modelVersionNumber(currentModel) >= version;
}
function supportsContextModel() {
  return modelAtLeast(1.5);
}
function supportsMemoryModel() {
  if (isPremiumUser) return true;
  return modelAtLeast(1.6);
}
function supportsWebModel() {
  return modelAtLeast(1.7);
}
function supportsWebTextExtractionModel() {
  return modelAtLeast(1.8);
}
function supportsLensModel() {
  return modelAtLeast(1.9);
}
function updatePremiumUI() {
  const now = Date.now();
  const isExpired = isPremiumUser && premiumExpiresAt && now > premiumExpiresAt;
  if (isExpired) {
    isPremiumUser = false;
    allowProfanity = false;
    premiumPaymentPending = false;
    premiumExpiresAt = 0;
    localStorage.removeItem(PREMIUM_STORAGE_KEY);
    localStorage.removeItem(PREMIUM_PENDING_KEY);
    localStorage.removeItem(PREMIUM_EXPIRY_KEY);
    localStorage.setItem(ALLOW_PROFANITY_STORAGE_KEY, "0");
  }
  const remainingDays = isPremiumUser && premiumExpiresAt
    ? Math.max(0, Math.ceil((premiumExpiresAt - now) / (24 * 60 * 60 * 1000)))
    : 0;
  if (premiumOwnedLabel) premiumOwnedLabel.classList.toggle("hidden", !isPremiumUser);
  if (premiumExpiryLabel) {
    premiumExpiryLabel.classList.toggle("hidden", !isPremiumUser);
    premiumExpiryLabel.textContent = isPremiumUser ? `⏱️ Premium süresi: ${remainingDays} gün` : "";
  }
  if (premiumPendingLabel) premiumPendingLabel.classList.toggle("hidden", isPremiumUser || !premiumPaymentPending);
  if (drawerPremiumOpen) {
    drawerPremiumOpen.textContent = isPremiumUser ? "✅ Premium Satın Alındı" : "✨ Premium Al";
    drawerPremiumOpen.disabled = isPremiumUser;
  }
  if (premiumBuyBtn) premiumBuyBtn.classList.toggle("hidden", isPremiumUser || premiumPaymentPending);
  if (premiumPayLinkBtn) premiumPayLinkBtn.classList.toggle("hidden", isPremiumUser || !premiumPaymentPending);
  if (premiumCodeRow) premiumCodeRow.classList.toggle("hidden", isPremiumUser || !premiumPaymentPending);
  if (premiumConfirmBtn) premiumConfirmBtn.disabled = isPremiumUser || !premiumPaymentPending;
  if (allowProfanityMode) allowProfanityMode.checked = isPremiumUser && allowProfanity;
  document.body.classList.toggle("premium-active", isPremiumUser);
  updateModelVisual();
  if (isPremiumUser) stopBan();
}
function activatePremium() {
  isPremiumUser = true;
  premiumPaymentPending = false;
  premiumExpiresAt = Date.now() + PREMIUM_DURATION_MS;
  localStorage.setItem(PREMIUM_STORAGE_KEY, "1");
  localStorage.setItem(PREMIUM_EXPIRY_KEY, String(premiumExpiresAt));
  localStorage.removeItem(PREMIUM_PENDING_KEY);
  updatePremiumUI();
  if (premiumModal) premiumModal.classList.add("hidden");
  if (premiumCodeInput) premiumCodeInput.value = "";
  showWarningOverlay("✨ Premium aktif edildi! Süre 30 gün olarak başlatıldı.");
}
function startPremiumPayment() {
  premiumPaymentPending = true;
  localStorage.setItem(PREMIUM_PENDING_KEY, "1");
  updatePremiumUI();
  showWarningOverlay("Kod alanı açıldı. Şimdi ödeme sayfasına gidip kodu al, sonra buraya gir.");
}
function openPremiumPaymentLink() {
  if (isPremiumUser) return;
  if (!premiumPaymentPending) startPremiumPayment();
  window.open(PREMIUM_PAY_LINK, "_blank", "noopener,noreferrer");
}
function tryActivatePremiumFromReturn() {
  if (isPremiumUser || !premiumPaymentPending) return;
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(String(window.location.hash || "").replace(/^#/, ""));
  const status = (params.get("paytr_status") || hashParams.get("paytr_status") || "").toLowerCase();
  const premium = (params.get("premium_paid") || hashParams.get("premium_paid") || "").toLowerCase();
  if (status === "success" || premium === "1" || premium === "true") {
    activatePremium();
    params.delete("paytr_status");
    params.delete("premium_paid");
    const clean = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
    window.history.replaceState({}, "", clean);
  }
}
function manuallyConfirmPremium() {
  if (isPremiumUser) return;
  if (!premiumPaymentPending) {
    showWarningOverlay("Önce Premium Al butonuyla ödeme akışını başlatmalısın.");
    return;
  }
  const code = (premiumCodeInput?.value || "").trim();
  if (!code) {
    showWarningOverlay("Lütfen SMS ile gelen doğrulama kodunu gir.");
    return;
  }
  if (!PREMIUM_VERIFY_CODES.includes(code)) {
    showWarningOverlay("Kod hatalı. Lütfen 05427250098 tarafından iletilen kodu kontrol et.");
    return;
  }
  if (usedPremiumCodes.includes(code)) {
    showWarningOverlay("Bu kod daha önce kullanılmış. Lütfen yeni kod iste.");
    return;
  }
  usedPremiumCodes.push(code);
  localStorage.setItem(PREMIUM_USED_CODES_KEY, JSON.stringify(usedPremiumCodes));
  activatePremium();
}
function expandForPremium(text) {
  return text;
}
function chooseRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function typeTextSlowly(target, text, options = {}) {
  if (!target) return Promise.resolve();
  const full = String(text || "");
  const baseDelay = Number(options.baseDelay ?? 9);
  const punctuationDelay = Number(options.punctuationDelay ?? 32);
  const maxChars = Number(options.maxChars ?? 1700);
  const shouldAnimate = !!full && full.length <= maxChars;
  if (!shouldAnimate) {
    target.textContent = full;
    return Promise.resolve();
  }
  target.textContent = "";
  return new Promise((resolve) => {
    let i = 0;
    const tick = () => {
      if (i >= full.length) {
        resolve();
        return;
      }
      target.textContent += full[i];
      const ch = full[i];
      i += 1;
      chat.scrollTop = chat.scrollHeight;
      const extra = /[.,!?;:\n]/.test(ch) ? punctuationDelay : 0;
      setTimeout(tick, baseDelay + extra);
    };
    tick();
  });
}
function isProfanityModeActive() {
  return isPremiumUser && allowProfanity;
}
function isMerhabaTypo(text = "") {
  const t = String(text || "").toLowerCase().replace(/[^a-zçğıöşü0-9\s]/g, "").trim();
  if (!t) return false;
  if (t === "merhaba") return false;
  if (/^merh?[wv]?[ab]+a$/.test(t)) return true;
  return ["merhwa", "merhawa", "merhwaba", "merhba", "mrb"].includes(t);
}
const profanityGreetingReplies = [
  "Selam aq, hoş geldin knk. Keyifler nasıl?",
  "Selam amk, buradayım knk; ne konuşuyoruz bugün?",
  "Aleyküm selam aq, hadi bakalım sohbete.",
  "Selam knk, mod açık aq; neye dalıyoruz?"
];
const profanityMoodReplies = [
  "İyiyim aq, sen nasılsın knk?",
  "İyi gidiyor amk, sende durumlar nasıl?",
  "Bende sıkıntı yok aq, senin mod nasıl?",
  "Takılıyoruz knk aq, sende neler var?"
];


const profanityUnknownReplies = [
  "Anlamadım aq 😅 \"{input}\" ne demek, biraz net yaz knk.",
  "Bu cümle karışık amk: \"{input}\". Bir tık düzenli yaz da anında çözelim.",
  "Bunu çözemedim aq, \"{input}\" biraz dağınık kalmış. Kısa ve net at knk.",
  "Anlam bozulmuş amk 😄 \"{input}\" yerine ne istediğini direkt söyle kanka.",
  "Kafama oturmadı aq: \"{input}\". Bir daha sade yaz, hızlıca cevaplayayım.",
  "Bu haliyle anlamsız duruyor amk, \"{input}\" neyi kast ediyor? Net geç knk.",
  "Anlamadım aq, \"{input}\" yerine tek cümle düzgün yaz da tam vurayım cevabı.",
  "Cümle patlamış amk 😅 \"{input}\" biraz daha düzgün olursa mis gibi çözeriz.",
  "Bunu okuyunca anlam çıkmadı aq: \"{input}\". Ne istediğini direkt yaz kanka.",
  "Net olmadı amk, \"{input}\" çok dağınık. Dümdüz anlat, ben de net cevap vereyim."
];

function buildProfanityUnknownReply(rawInput = "") {
  const shown = String(rawInput || "").trim() || "bu cümle";
  return chooseRandom(profanityUnknownReplies).replaceAll("{input}", shown);
}
function buildProfanityModeDirectReply(inputLower = "", rawInput = "") {
  if (!isProfanityModeActive()) return null;
  if (isMerhabaTypo(inputLower)) {
    return `"${rawInput}" ne aq 😄 Selam knk, keyifler nasıl?`;
  }
  if (hasSalutation(inputLower, saKeywords) || hasAny(inputLower, ["merhaba", "selam", "selamlar", "sa"])) {
    return chooseRandom(profanityGreetingReplies);
  }
  if (isHowAreYouVariant(inputLower)) {
    return chooseRandom(profanityMoodReplies);
  }
  return null;
}
function detectProfanityIntent(input = "") {
  const q = String(input || "").toLocaleLowerCase("tr-TR");
  if (hasAny(q, ["merhaba", "selam", "hey", "günaydın", "iyi akşamlar", "hoş geldin", "bye", "görüşürüz"])) return "greeting";
  if (hasAny(q, ["nasılsın", "naber", "mutluyum", "üzgünüm", "sinirliyim", "korkuyorum", "stres", "yorgunum", "sıkıldım"])) return "mood";
  if (hasAny(q, ["neden", "nasıl", "ne", "kim", "kaç", "hangi", "olur mu", "mümkün mü", "gerçekten", "doğru mu"])) return "question";
  if (hasAny(q, ["ai", "yapay zeka", "robot", "algoritma", "kod", "yazılım", "python", "html", "javascript", "veritabanı", "sunucu", "internet", "uygulama", "site", "tarayıcı"])) return "tech";
  if (hasAny(q, ["oyun", "level", "boss", "silah", "karakter", "xp", "skor", "görev", "harita", "mod", "pvp", "rank", "kazandım", "kaybettim", "respawn"])) return "game";
  if (hasAny(q, ["para", "satış", "kazanç", "zarar", "yatırım", "müşteri", "ürün", "indirim", "kampanya", "fiyat", "bitcoin", "kripto", "hisse", "altın", "dolar"])) return "money";
  if (hasAny(q, ["matematik", "sınav", "ders", "okul", "ödev", "çözüm", "formül", "test", "+", "-", "*", "/"])) return "math";
  if (hasAny(q, ["web", "wikipedia", "link", "kaynak", "arama"])) return "web";
  if (hasAny(q, ["başlat", "dur", "yeniden", "sıfırla", "kaydet", "yükle", "sil", "aç", "kapat", "yardım"])) return "system";
  return "default";
}
function blendTokenIntoLine(line, token) {
  const cleanLine = String(line || "").trim();
  if (!cleanLine) return cleanLine;
  if (cleanLine.length <= 22) return `${cleanLine} ${token}`;
  const words = cleanLine.split(/\s+/);
  if (words.length < 5) return `${cleanLine} ${token}`;
  const insertAt = Math.min(3, words.length - 1);
  words.splice(insertAt, 0, token);
  return words.join(" ");
}
function applyProfanityFlavor(text, sourceInput = "") {
  if (!isProfanityModeActive()) return text;
  const clean = String(text || "").trim();
  if (!clean) return clean;
  return clean;
}

function updateSplashPrompt() {
  if (!splashPrompt) return;
  const name = (userMemory.Ad || "dostum").trim() || "dostum";
  const template = chooseRandom(splashPromptTemplates);
  splashPrompt.textContent = template.replace("{name}", name);
}
function hasAny(text, list) { return list.some((i) => text.includes(i)); }
function escapeRegex(str) {
  return str.replace(/[|\{}()[\]^$+*?.]/g, "\$&");
}
function includesKeywordToken(text, keyword) {
  const normalized = String(text || "").toLowerCase();
  const key = String(keyword || "").toLowerCase().trim();
  if (!key) return false;
  if (key.includes(" ")) return normalized.includes(key);
  const pattern = new RegExp(`(^|[^a-zçğıöşü0-9])${escapeRegex(key)}([^a-zçğıöşü0-9]|$)`, "i");
  return pattern.test(normalized);
}
function findUnifiedKeyword(textLower) {
  for (const [category, words] of Object.entries(unifiedKeywordCategories)) {
    for (const word of words) {
      if (includesKeywordToken(textLower, word)) return { category, keyword: word };
    }
  }
  return null;
}
function buildUnifiedKeywordReply(textLower) {
  const found = findUnifiedKeyword(textLower);
  if (!found) return null;
  const base = chooseRandom(unifiedKeywordPromptBank).replaceAll("{keyword}", found.keyword);
  return `${base}
🧩 İstersen bu konuyu şimdi senin seviyene göre (hızlı / orta / uzman) detaylandırayım.`;
}
function setWebMode(enabled) {
  if (enabled && !supportsWebModel()) {
    webModeEnabled = false;
    if (webSearchMode) webSearchMode.checked = false;
    if (warningOverlay && warningText) {
      showWarningOverlay("Web Arama Modu yalnızca baluk-1.7 ve üstü modellerde kullanılabilir.");
    }
  } else {
    webModeEnabled = !!enabled;
  }
  if (webModeEnabled && lensModeEnabled) {
    lensModeEnabled = false;
    if (balukLensMode) balukLensMode.checked = false;
    closeLensPanel();
  }
  if (userInput) {
    userInput.classList.toggle("web-search-input", webModeEnabled);
    userInput.placeholder = webModeEnabled ? "🌐 Web'de ara..." : "Mesajını yaz...";
  }
  if (webInputBadge) webInputBadge.classList.toggle("hidden", !webModeEnabled);
}
function openLensPanel() {
  if (!lensPanel) return;
  lensPanel.classList.remove("hidden");
  if (lensResults) lensResults.classList.add("hidden");
  if (lensStatus) {
    lensStatus.classList.remove("hidden");
    lensStatus.textContent = "baluk.ai • lens hazır, görsel bekleniyor";
  }
}
function closeLensPanel() {
  if (!lensPanel) return;
  lensPanel.classList.add("hidden");
}
function setLensMode(enabled) {
  if (enabled && !supportsLensModel()) {
    lensModeEnabled = false;
    if (balukLensMode) balukLensMode.checked = false;
    showWarningOverlay("Baluk.lens yalnızca baluk-1.9 ve üstü modellerde kullanılabilir.");
    return;
  }
  lensModeEnabled = !!enabled;
  if (lensModeEnabled) {
    if (webSearchMode) { webSearchMode.checked = false; setWebMode(false); }
    openLensPanel();
  } else {
    closeLensPanel();
  }
}
function drawLensCanvas() {
  if (!lensCanvas || !lensImageDataUrl) return;
  const ctx = lensCanvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    const maxW = Math.min(780, Math.max(280, (lensCanvasWrap?.clientWidth || 520) - 10));
    const ratio = img.height / img.width;
    lensCanvas.width = maxW;
    lensCanvas.height = Math.round(maxW * ratio);
    ctx.clearRect(0, 0, lensCanvas.width, lensCanvas.height);
    ctx.drawImage(img, 0, 0, lensCanvas.width, lensCanvas.height);
    const pulse = lensAnalyzing ? (Math.sin(Date.now() / 220) + 1) / 2 : 0.35;
    if (lensSelection) {
      const { x, y, w, h } = lensSelection;
      const glowAlpha = lensAnalyzing ? (0.16 + pulse * 0.24) : 0.2;
      ctx.strokeStyle = lensAnalyzing ? "#a855f7" : "#8b5cf6";
      ctx.lineWidth = lensAnalyzing ? 2.8 : 2;
      ctx.setLineDash([8, 5]);
      ctx.shadowColor = "rgba(168,85,247,.75)";
      ctx.shadowBlur = lensAnalyzing ? 18 : 8;
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(139,92,246,${glowAlpha.toFixed(3)})`;
      ctx.fillRect(x, y, w, h);
      if (lensAnalyzing) {
        const bandX = x + ((Date.now() / 4) % (w + 80)) - 80;
        const grd = ctx.createLinearGradient(bandX, y, bandX + 80, y + h);
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(0.5, "rgba(196,181,253,.38)");
        grd.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(x, y, w, h);
      }
    } else if (lensAnalyzing) {
      const fullAlpha = 0.12 + pulse * 0.12;
      ctx.strokeStyle = "rgba(168,85,247,.65)";
      ctx.lineWidth = 3;
      ctx.strokeRect(2, 2, lensCanvas.width - 4, lensCanvas.height - 4);
      ctx.fillStyle = `rgba(139,92,246,${fullAlpha.toFixed(3)})`;
      ctx.fillRect(0, 0, lensCanvas.width, lensCanvas.height);
      const bandX = ((Date.now() / 4) % (lensCanvas.width + 120)) - 120;
      const grd = ctx.createLinearGradient(bandX, 0, bandX + 120, lensCanvas.height);
      grd.addColorStop(0, "rgba(255,255,255,0)");
      grd.addColorStop(0.5, "rgba(196,181,253,.35)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, lensCanvas.width, lensCanvas.height);
    }
  };
  img.src = lensImageDataUrl;
}
function loadLensFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    showWarningOverlay("Lütfen görsel dosyası seç (png, jpg, webp...).");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    lensImageDataUrl = String(reader.result || "");
    lensSelection = null;
    if (lensCanvasWrap) lensCanvasWrap.classList.remove("hidden");
    if (lensStatus) {
      lensStatus.classList.remove("hidden");
      lensStatus.textContent = "Görsel yüklendi • baluk.ai görseli anlamlandırıyor...";
    }
    drawLensCanvas();
    lensAiLabels = [];
    analyzeLensImageSemantics(lensImageDataUrl)
      .then((labels) => {
        lensAiLabels = labels;
        if (lensStatus && labels.length) {
          lensStatus.textContent = `Görsel algılandı: ${labels.join(", ")} • istersen bölge seçip analiz et.`;
        } else if (lensStatus) {
          lensStatus.textContent = "Görsel yüklendi • istersen bölge seçip analiz et.";
        }
      })
      .catch(() => {
        if (lensStatus) lensStatus.textContent = "Görsel yüklendi • istersen bölge seçip analiz et.";
      });
  };
  reader.readAsDataURL(file);
}
function normalizeRect(start, end) {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const w = Math.abs(end.x - start.x);
  const h = Math.abs(end.y - start.y);
  return { x, y, w, h };
}
function lensStatusTick(messages, stepMs = 1400, onStep = null) {
  if (!lensStatus) return () => {};
  let i = 0;
  lensStatus.textContent = messages[0];
  if (typeof onStep === "function") onStep(messages[0], 0);
  const timer = setInterval(() => {
    i += 1;
    if (i >= messages.length) {
      clearInterval(timer);
      return;
    }
    lensStatus.textContent = messages[i];
    if (typeof onStep === "function") onStep(messages[i], i);
  }, stepMs);
  return () => clearInterval(timer);
}
function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-lens-lib="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.lensLib = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Script yüklenemedi: ${src}`));
    document.head.appendChild(script);
  });
}
async function ensureLensClassifier() {
  if (lensClassifierReady && lensModelRef) return lensModelRef;
  if (lensClassifierLoading) {
    while (lensClassifierLoading) {
      await new Promise((r) => setTimeout(r, 120));
    }
    return lensModelRef;
  }
  lensClassifierLoading = true;
  try {
    await loadExternalScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js");
    await loadExternalScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js");
    if (!window.mobilenet) throw new Error("mobilenet yüklenemedi");
    lensModelRef = await window.mobilenet.load({ version: 2, alpha: 1.0 });
    lensClassifierReady = true;
    return lensModelRef;
  } catch {
    lensClassifierReady = false;
    lensModelRef = null;
    return null;
  } finally {
    lensClassifierLoading = false;
  }
}
async function analyzeLensImageSemantics(dataUrl) {
  if (!dataUrl) return [];
  const model = await ensureLensClassifier();
  if (!model) return [];
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Görsel çözümleme başarısız"));
    img.src = dataUrl;
  });
  const predictions = await model.classify(img, 5);
  return predictions
    .filter((p) => Number(p.probability) >= 0.08)
    .map((p) => String(p.className || "").split(",")[0].trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 3);
}
function guessLensQuery() {
  if (lensAiLabels.length) return lensAiLabels.join(" ");
  if (!lensImageDataUrl) return "görsel";
  const fromName = (lensFileInput?.files?.[0]?.name || "").toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[_-]+/g, " ").trim();
  const fallbackTerms = ["object", "nature", "technology", "animal", "city"];
  return fromName || chooseRandom(fallbackTerms);
}
function isMobileLensViewport() {
  return window.matchMedia("(max-width: 760px)").matches;
}
function startLensDrawTicker() {
  if (lensDrawTicker) clearInterval(lensDrawTicker);
  lensDrawTicker = setInterval(() => {
    if (lensAnalyzing) drawLensCanvas();
  }, 120);
}
function stopLensDrawTicker() {
  if (lensDrawTicker) clearInterval(lensDrawTicker);
  lensDrawTicker = null;
}
async function runLensAnalysis() {
  if (!lensImageDataUrl) {
    showWarningOverlay("Önce bir fotoğraf yüklemelisin.");
    return;
  }
  if (lensResults) {
    lensResults.classList.add("hidden");
    lensResults.innerHTML = "";
  }
  if (lensStatus) {
    lensStatus.classList.remove("hidden");
    lensStatus.classList.add("lens-status-live");
  }
  startChatIfNeeded();
  const thinking = addThinkingBubble("web");
  updateThinkingStatus(thinking, "Baluk.ai • lens düşünüyor...");
  lensAnalyzing = true;
  if (lensPanel) lensPanel.classList.add("lens-analyzing");
  if (lensCanvasWrap) lensCanvasWrap.classList.add("lens-canvas-live");
  startLensDrawTicker();
  drawLensCanvas();
  const stopTicker = lensStatusTick([
    "baluk.ai • görsel içeriğini analiz ediyor...",
    "baluk.ai • web'de benzerlerini tarıyor...",
    "baluk.ai • seçilen alanı derin analiz ediyor...",
    "baluk.ai • eşleşen sonuçları derliyor...",
    "baluk.ai • son rötuşlar yapılıyor..."
  ], 1100, (msg) => updateThinkingStatus(thinking, msg));
  const waitMs = supportsLensModel() ? 5200 : 9000;
  await new Promise((r) => setTimeout(r, waitMs));
  const q = guessLensQuery();
  if (lensStatus && !lensSelection) lensStatus.textContent = "baluk.ai • özel alan seçilmedi, tüm görsel analiz ediliyor...";
  const links = [
    { title: `${q} • Google Görseller`, link: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q + " similar")}` },
    { title: `${q} • Bing Images`, link: `https://www.bing.com/images/search?q=${encodeURIComponent(q + " similar")}` },
    { title: `${q} • Unsplash`, link: `https://unsplash.com/s/photos/${encodeURIComponent(q)}` },
    { title: `${q} • Pexels`, link: `https://www.pexels.com/search/${encodeURIComponent(q)}/` }
  ];
  stopTicker();
  lensAnalyzing = false;
  stopLensDrawTicker();
  if (lensPanel) lensPanel.classList.remove("lens-analyzing");
  if (lensCanvasWrap) lensCanvasWrap.classList.remove("lens-canvas-live");
  drawLensCanvas();
  if (lensStatus) {
    lensStatus.classList.remove("lens-status-live");
    lensStatus.textContent = "baluk.ai • analiz tamamlandı, 4 benzer görsel kaynağı bulundu ✅";
  }
  if (lensResults) {
    lensResults.innerHTML = `
      <h4>📸 Baluk.lens benzer görseller</h4>
      <ol>${links.map((i) => `<li><a href="${i.link}" target="_blank" rel="noopener noreferrer">${i.title}</a></li>`).join("")}</ol>
      <p>Not: Sonuçlar benzerlik önerisidir; birebir aynı görsel garantisi vermez.</p>
    `;
    lensResults.classList.remove("hidden");
  }
  const finalText = `Baluk.lens analizi tamamlandı. İşaretlediğin bölge/görsel için 4 güçlü kaynak buldum:
${links.map((i, idx) => `${idx + 1}) ${i.title} → ${i.link}`).join("\n")}`;
  fillThinkingBubble(thinking, finalText, "Baluk.ai • lens analizi bitti ✅");
}
async function fetchWebResults(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Web isteği başarısız");
  const data = await res.json();
  const out = [];
  if (data.AbstractURL) {
    out.push({ title: data.Heading || query, description: data.AbstractText || "Öne çıkan sonuç", link: data.AbstractURL });
  }
  const pushTopic = (topic) => {
    if (!topic) return;
    if (topic.FirstURL && topic.Text) {
      const title = topic.Text.split(" - ")[0].trim() || topic.Text.slice(0, 64);
      out.push({ title, description: topic.Text, link: topic.FirstURL });
    }
    if (Array.isArray(topic.Topics)) topic.Topics.forEach(pushTopic);
  };
  (data.RelatedTopics || []).forEach(pushTopic);
  const uniq = [];
  const seen = new Set();
  out.forEach((i) => {
    if (!i.link || seen.has(i.link)) return;
    seen.add(i.link);
    uniq.push(i);
  });
  if (uniq.length < 3) {
    const extra = [
      { title: `DuckDuckGo: ${query}`, description: "DuckDuckGo üzerinde tam sonuç sayfası", link: `https://duckduckgo.com/?q=${encodeURIComponent(query)}` },
      { title: `Wikipedia: ${query}`, description: "Wikipedia arama sonucu", link: `https://tr.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}` },
      { title: `Google: ${query}`, description: "Alternatif arama sonucu", link: `https://www.google.com/search?q=${encodeURIComponent(query)}` }
    ];
    extra.forEach((i) => {
      if (!seen.has(i.link)) {
        seen.add(i.link);
        uniq.push(i);
      }
    });
  }
  return uniq.slice(0, 12);
}
function isWikipediaLink(link) {
  return /https?:\/\/(?:[a-z]{2,3}\.)?wikipedia\.org\//i.test(String(link || ""));
}
function extractWikiTitleFromLink(link) {
  try {
    const u = new URL(link);
    const wikiMatch = u.pathname.match(/\/wiki\/([^/?#]+)/i);
    if (wikiMatch && wikiMatch[1]) return decodeURIComponent(wikiMatch[1]).replace(/_/g, " ");
    const directSearch = u.searchParams.get("search") || u.searchParams.get("title");
    if (directSearch) return directSearch;
  } catch {}
  return null;
}
function trimToWordWindow(text, minWords = 500, maxWords = 1000) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (!words.length) return "";
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}...`;
}
async function fetchWikipediaLongExcerpt(link) {
  if (!isWikipediaLink(link)) return null;
  const title = extractWikiTitleFromLink(link);
  if (!title) return null;
  const endpoints = [
    `https://tr.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exsectionformat=plain&titles=${encodeURIComponent(title)}&format=json&origin=*`,
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exsectionformat=plain&titles=${encodeURIComponent(title)}&format=json&origin=*`
  ];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep);
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const firstPage = Object.values(pages)[0];
      const extract = String(firstPage?.extract || "").replace(/\s+/g, " ").trim();
      if (!extract) continue;
      const excerpt = trimToWordWindow(extract, 500, 1000);
      if (excerpt) return excerpt;
    } catch {}
  }
  return null;
}
function renderWebResults(query, items, wikiExcerpt = "", wikiLink = "") {
  const box = document.createElement("div");
  box.className = "msg bot web-results";
  const allSources = items.slice(0, 8);
  const leadAnswer = String(wikiExcerpt || "").trim();
  const fallbackAnswer = allSources.length
    ? allSources.map((item, i) => `${i + 1}) ${item.title}: ${item.description || "Açıklama bulunamadı."}`).join("\n")
    : "Bu aramada güvenilir metin özeti çıkaramadım, ama kaynak bağlantıları aşağıda.";
  const coreAnswer = (leadAnswer || fallbackAnswer).replace(/\s+/g, " ").trim();
  const answerTextBase = `${chooseRandom(webAnswerIntroPrompts)}
${coreAnswer}
${chooseRandom(webAnswerOutroPrompts)}`;
  const answerText = applyProfanityFlavor(answerTextBase, query);
  const shortAnswer = answerText.length > 300 ? `${answerText.slice(0, 300)}...` : answerText;
  box.innerHTML = `
    <div class="web-results-head">baluk.screatch</div>
    <div class="web-query">Arama: ${query}</div>
    <div class="web-main-answer" aria-live="polite">
      <h4>🧠 Baluk Yanıtı</h4>
      <p class="web-answer-text"></p>
      <button type="button" class="web-read-more ${answerText.length > 300 ? "" : "hidden"}">Devamını oku</button>
    </div>
    <div class="web-sources">
      <h5>📎 Kaynakça</h5>
      <ol class="web-source-list">
        ${allSources.map((item) => `<li><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></li>`).join("") || "<li>Kaynak bulunamadı.</li>"}
      </ol>
      ${wikiLink ? `<a class="web-source-main" href="${wikiLink}" target="_blank" rel="noopener noreferrer">Ana kaynak: Wikipedia</a>` : ""}
    </div>
  `;
  const answerEl = box.querySelector('.web-answer-text');
  if (answerEl) answerEl.textContent = shortAnswer;
  const readMoreBtn = box.querySelector('.web-read-more');
  if (readMoreBtn && answerEl) {
    readMoreBtn.addEventListener('click', () => {
      answerEl.textContent = answerText;
      readMoreBtn.classList.add('hidden');
    });
  }
  chat.appendChild(box);
  chat.scrollTop = chat.scrollHeight;
}
function isBMWTrigger(input) {
  return /(^|[^a-z0-9])bmw([^a-z0-9]|$)/i.test(String(input || ""));
}
function renderBMWVideoCard() {
  const box = document.createElement("div");
  box.className = "msg bot bmw-video-card";
  box.innerHTML = `
    <iframe
      src="https://www.youtube-nocookie.com/embed/N_tf3ZZWy78?autoplay=1&mute=1&loop=1&playlist=N_tf3ZZWy78&controls=0&modestbranding=1&rel=0&playsinline=1"
      title="BMW loop video"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin">
    </iframe>
  `;
  chat.appendChild(box);
  chat.scrollTop = chat.scrollHeight;
}
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
    renderWebResults(text, []);
    fillThinkingBubble(thinking, applyProfanityFlavor("Arama tamamlandı ama sonuç alınamadı.", text), "Web arandı • sonuç bulunamadı ⚠️");
  }
}
function hasSalutation(text, list) {
  return list.some((kw) => {
    const token = kw.trim().toLowerCase();
    if (!token) return false;
    if (token.length <= 3 || !token.includes(" ")) {
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|\\s)${escaped}(\\s|$|[?.!,])`, "i").test(text);
    }
    return text.includes(token);
  });
}
function isHowAreYouVariant(text) {
  const t = String(text || "").toLowerCase().trim();
  if (!t) return false;
  if (hasAny(t, [
    "nasılsın", "nasilsin", "nasılsınız", "nasilsiniz", "naber", "ne haber",
    "naber kanka", "naber knk", "napıyorsun", "napiyorsun", "napıyon", "napiyon"
  ])) return true;
  return /(^|\s)(iyi\s*m[iı]s[iı]n|iyi\s*m[iı]s[iı]n\s*knk|iyi\s*m[iı]s[iı]n\s*kanka|iyi\s*mi\s*sin|iyi\s*misn|iyisin\s*mi)(\s|$|[?.!,])/i.test(t);
}
function isBannedNow() {
  return Date.now() < banUntil;
}
function formatBanLeft(ms) {
  const sec = Math.max(0, Math.ceil(ms / 1000));
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}
function saveBanState(reason = "") {
  if (!banUntil || !isBannedNow()) {
    localStorage.removeItem(BAN_STORAGE_KEY);
    return;
  }
  localStorage.setItem(BAN_STORAGE_KEY, JSON.stringify({ banUntil, reason }));
}
function restoreBanState() {
  const raw = localStorage.getItem(BAN_STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.banUntil || Date.now() >= Number(parsed.banUntil)) {
      localStorage.removeItem(BAN_STORAGE_KEY);
      return;
    }
    banUntil = Number(parsed.banUntil);
    if (banReason) banReason.textContent = parsed.reason || "Lütfen saygılı bir dil kullanalım.";
    if (profanityLock) profanityLock.classList.remove("hidden");
    if (banInterval) clearInterval(banInterval);
    banInterval = setInterval(() => {
      const left = banUntil - Date.now();
      if (banTimer) banTimer.textContent = formatBanLeft(left);
      if (left <= 0) stopBan();
    }, 250);
  } catch {
    localStorage.removeItem(BAN_STORAGE_KEY);
  }
}
function updateAccountPreview() {
  if (!accountNamePreview || !accountMailPreview || !accountPhotoPreview) return;
  const name = accountName?.value?.trim() || "Misafir";
  const mail = accountGmail?.value?.trim() || "gmail eklenmedi";
  const photo = accountPhoto?.value?.trim();
  accountNamePreview.textContent = name;
  accountMailPreview.textContent = mail;
  accountPhotoPreview.src = photo || "assets/cat.svg";
}
function applyBackgroundTheme(themeName = "default") {
  const themes = ["theme-1", "theme-2", "theme-3", "theme-4", "theme-5", "theme-6", "theme-7", "theme-8", "theme-9", "theme-10"];
  document.body.classList.remove(...themes.map((t) => `bg-${t}`));
  const safeTheme = themes.includes(themeName) ? themeName : "default";
  if (safeTheme !== "default") document.body.classList.add(`bg-${safeTheme}`);
  localStorage.setItem(BACKGROUND_THEME_KEY, safeTheme);
  if (backgroundThemeSelect) backgroundThemeSelect.value = safeTheme;
}
function stopBackgroundMusic() {
  try {
    bgAudioNodes.forEach((n) => {
      if (n && typeof n.stop === "function") n.stop();
    });
  } catch {}
  bgAudioNodes = [];
  if (bgAudioCtx) {
    bgAudioCtx.close().catch(() => {});
    bgAudioCtx = null;
  }
}
function startBackgroundMusic(presetId = "off", volumeValue = 35) {
  stopBackgroundMusic();
  const preset = ambientMusicPresets[presetId];
  if (!preset) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  bgAudioCtx = new AC();
  const now = bgAudioCtx.currentTime;
  const master = bgAudioCtx.createGain();
  master.gain.value = 0.0001;
  master.connect(bgAudioCtx.destination);

  const targetLevel = Math.max(0, Math.min(1, Number(volumeValue) / 100)) * 0.1;
  master.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetLevel), now + 1.2);

  const filter = bgAudioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = preset.layer === "airy" ? 1100 : preset.layer === "warm" ? 860 : 980;
  filter.Q.value = 0.9;
  filter.connect(master);

  const oscA = bgAudioCtx.createOscillator();
  const oscB = bgAudioCtx.createOscillator();
  const oscC = bgAudioCtx.createOscillator();
  const lfo = bgAudioCtx.createOscillator();
  const lfoGain = bgAudioCtx.createGain();
  const filterLfo = bgAudioCtx.createOscillator();
  const filterLfoGain = bgAudioCtx.createGain();

  oscA.type = preset.wave;
  oscB.type = preset.wave;
  oscC.type = preset.layer === "warm" ? "triangle" : "sine";
  oscA.frequency.value = preset.base;
  oscB.frequency.value = preset.base * 1.25;
  oscC.frequency.value = preset.base * 0.5;

  oscA.detune.value = -Math.abs(preset.detune || 6);
  oscB.detune.value = Math.abs(preset.detune || 6);
  oscC.detune.value = (preset.detune || 6) * 0.4;

  lfo.type = "sine";
  lfo.frequency.value = preset.lfo;
  lfoGain.gain.value = 3.2;
  lfo.connect(lfoGain);
  lfoGain.connect(oscA.frequency);

  filterLfo.type = "sine";
  filterLfo.frequency.value = Math.max(0.01, preset.lfo * 0.8);
  filterLfoGain.gain.value = preset.layer === "airy" ? 140 : 90;
  filterLfo.connect(filterLfoGain);
  filterLfoGain.connect(filter.frequency);

  const gainA = bgAudioCtx.createGain();
  const gainB = bgAudioCtx.createGain();
  const gainC = bgAudioCtx.createGain();
  gainA.gain.value = 0.34;
  gainB.gain.value = 0.23;
  gainC.gain.value = preset.layer === "warm" ? 0.16 : 0.12;

  oscA.connect(gainA);
  oscB.connect(gainB);
  oscC.connect(gainC);
  gainA.connect(filter);
  gainB.connect(filter);
  gainC.connect(filter);

  oscA.start(now);
  oscB.start(now);
  oscC.start(now);
  lfo.start(now);
  filterLfo.start(now);

  bgAudioNodes = [oscA, oscB, oscC, lfo, filterLfo, master, filter, gainA, gainB, gainC, lfoGain, filterLfoGain];
}
function setBackgroundMusic(musicId = "off") {
  const safe = Object.prototype.hasOwnProperty.call(ambientMusicPresets, musicId) ? musicId : "off";
  localStorage.setItem(BACKGROUND_MUSIC_KEY, safe);
  if (backgroundMusicSelect) backgroundMusicSelect.value = safe;
  const volume = Number(localStorage.getItem(BACKGROUND_VOLUME_KEY) || "35");
  if (safe === "off") stopBackgroundMusic();
  else startBackgroundMusic(safe, volume);
}
function setBackgroundVolume(value = 35) {
  const safe = Math.max(0, Math.min(100, Number(value) || 35));
  localStorage.setItem(BACKGROUND_VOLUME_KEY, String(safe));
  if (backgroundMusicVolume) backgroundMusicVolume.value = String(safe);
  const currentMusic = localStorage.getItem(BACKGROUND_MUSIC_KEY) || "off";
  if (currentMusic !== "off") startBackgroundMusic(currentMusic, safe);
}
function restoreBackgroundSettings() {
  const savedTheme = localStorage.getItem(BACKGROUND_THEME_KEY) || "default";
  const savedMusic = localStorage.getItem(BACKGROUND_MUSIC_KEY) || "off";
  const savedVolume = Number(localStorage.getItem(BACKGROUND_VOLUME_KEY) || "35");
  applyBackgroundTheme(savedTheme);
  setBackgroundVolume(savedVolume);
  setBackgroundMusic(savedMusic);
}
function saveAccountProfile() {
  const profile = {
    name: accountName?.value?.trim() || "",
    gmail: accountGmail?.value?.trim() || "",
    photo: accountPhoto?.value?.trim() || ""
  };
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(profile));
  updateAccountPreview();
}
function restoreAccountProfile() {
  const raw = localStorage.getItem(ACCOUNT_STORAGE_KEY);
  if (!raw) {
    updateAccountPreview();
    return;
  }
  try {
    const profile = JSON.parse(raw);
    if (accountName) accountName.value = profile?.name || "";
    if (accountGmail) accountGmail.value = profile?.gmail || "";
    if (accountPhoto) accountPhoto.value = profile?.photo || "";
  } catch {
    localStorage.removeItem(ACCOUNT_STORAGE_KEY);
  }
  updateAccountPreview();
}
function stopBan() {
  banUntil = 0;
  if (banInterval) clearInterval(banInterval);
  banInterval = null;
  if (profanityLock) profanityLock.classList.add("hidden");
  saveBanState();
}
function startBan(reason = "Lütfen saygılı bir dil kullanalım.") {
  insultWarningCount = 0;
  banUntil = Date.now() + 10 * 60 * 1000;
  if (banReason) banReason.textContent = reason;
  if (profanityLock) profanityLock.classList.remove("hidden");
  if (banInterval) clearInterval(banInterval);
  banInterval = setInterval(() => {
    const left = banUntil - Date.now();
    if (banTimer) banTimer.textContent = formatBanLeft(left);
    if (left <= 0) stopBan();
  }, 250);
  saveBanState(reason);
}
function showWarningOverlay(message) {
  if (!warningOverlay || !warningText) return;
  warningText.textContent = message;
  warningOverlay.classList.remove("hidden");
  if (warningOverlayTimer) clearTimeout(warningOverlayTimer);
  warningOverlayTimer = setTimeout(() => warningOverlay.classList.add("hidden"), 2200);
}
function matchesKeywordWithSuffix(textLower, keyword) {
  const kw = String(keyword || "").trim().toLowerCase();
  if (!kw) return false;
  if (kw.includes(" ")) return textLower.includes(kw);
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(^|[^a-zçğıöşü0-9])${escaped}(?:['’]?[a-zçğıöşü]{0,7})?(?=$|[^a-zçğıöşü0-9])`, "i");
  return pattern.test(textLower);
}
function getToxicityLevel(textLower) {
  if (severeProfanityKeywords.some((w) => matchesKeywordWithSuffix(textLower, w))) return "severe";
  if (insultKeywords.some((w) => matchesKeywordWithSuffix(textLower, w))) return "insult";
  return null;
}
function isUnsafeQuery(textLower) {
  return unsafeIllegalSelfHarmKeywords.some((w) => textLower.includes(w));
}
function getUnsafeCategory(textLower) {
  if (selfHarmUnsafeKeywords.some((w) => textLower.includes(w))) return "self_harm";
  if (illegalUnsafeKeywords.some((w) => textLower.includes(w))) return "illegal";
  return "generic";
}
function buildUnsafeRefusal(textLower) {
  pendingSafetySurvey = getUnsafeCategory(textLower);
  if (pendingSafetySurvey === "self_harm") return chooseRandom(selfHarmSupportPrompts);
  if (pendingSafetySurvey === "illegal") return chooseRandom(illegalRefusalPrompts);
  return `${chooseRandom(illegalRefusalPrompts)}
${chooseRandom(selfHarmSupportPrompts)}`;
}
function setAdvancedMathMode(enabled) {
  const justEnabled = enabled && !advancedMathEnabled;
  advancedMathEnabled = enabled;
  appRoot.classList.toggle("math-mode", enabled);
  if (memoryToggle) memoryToggle.classList.toggle("hidden", enabled);
  if (mathStudioToggle) mathStudioToggle.classList.toggle("hidden", !enabled);
  if (mathStudioPanel && !enabled) mathStudioPanel.classList.add("hidden");
  if (currentModelBadge) currentModelBadge.textContent = enabled ? "matematik modu" : currentModel;
  if (justEnabled) {
    showMathModeFlash();
  }
}
function solveMathStudioLine(line) {
  const raw = line.trim();
  if (!raw) return null;
  const wordProblem = solveWordProblemValue(raw);
  if (wordProblem !== null) return String(wordProblem);
  const eq = solveLinearEquation(raw);
  if (eq) return eq.replace("Denklem çözümü: ", "");
  const expr = solveSimpleExpression(raw.replaceAll("^", "**"));
  if (expr) return expr.replace("Sonuç: ", "").replace(" ✅", "");
  return "Çözüm yok";
}
function explainMath(line, result) {
  return `🧠 Matematik stüdyosu açıklaması:
${line} ifadesini adım adım çözünce ${result} sonucuna ulaşıyorum. Burada denklem dengesini koruyup bilinmeyeni yalnız bırakıyorum; aritmetik ifadede ise işlem önceliğine göre hesaplıyorum.`;
}
function renderMathStudio() {
  if (!mathStudioInput) return;
  const raw = mathStudioInput.innerText.trim();
  if (!raw) return;
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const line = lines[lines.length - 1];
  const result = solveMathStudioLine(line);
  if (!result || result === "Çözüm yok") return;
  mathStudioInput.innerHTML = `<span class="calc-answer">${line} = ${result}</span>`;
  const selection = window.getSelection();
  if (selection) {
    const range = document.createRange();
    range.selectNodeContents(mathStudioInput);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  if (line !== lastStudioExplained) {
    startChatIfNeeded();
    addMessage(explainMath(line, result), "bot");
    lastStudioExplained = line;
  }
}
function showMathModeFlash() {
  if (!mathModeFlash) return;
  mathModeFlash.classList.remove("hidden");
  clearTimeout(mathFlashTimer);
  mathFlashTimer = setTimeout(() => mathModeFlash.classList.add("hidden"), 1050);
  playMathModeFlashAudio();
}
function playMathModeFlashAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
  master.connect(ctx.destination);
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(640, now + 0.46);
  const shimmer = ctx.createOscillator();
  shimmer.type = "sine";
  shimmer.frequency.value = 11;
  const shimmerGain = ctx.createGain();
  shimmerGain.gain.value = 22;
  shimmer.connect(shimmerGain);
  shimmerGain.connect(osc.frequency);
  osc.connect(master);
  osc.start(now);
  shimmer.start(now);
  osc.stop(now + 1.05);
  shimmer.stop(now + 1.05);
  setTimeout(() => ctx.close().catch(() => {}), 1200);
}
function clearGeometryWarn() {
  if (geometryWarn) geometryWarn.textContent = "";
}
function showGeometryWarn(message) {
  if (!geometryWarn) return;
  geometryWarn.textContent = message;
}
function parsePositive(value) {
  const n = Number(String(value || "").replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}
function geometrySvgForShape(shape) {
  switch (shape) {
    case "square":
      return `<rect x="26" y="26" width="148" height="148" rx="6"></rect>`;
    case "rectangle":
      return `<rect x="20" y="46" width="160" height="108" rx="6"></rect>`;
    case "triangle":
      return `<polygon points="100,18 182,168 18,168"></polygon>`;
    case "circle":
      return `<circle cx="100" cy="100" r="74"></circle>`;
    case "parallelogram":
      return `<polygon points="42,38 188,38 158,162 12,162"></polygon>`;
    case "trapezoid":
      return `<polygon points="42,44 158,44 188,162 12,162"></polygon>`;
    case "pentagon":
      return `<polygon points="100,14 178,72 148,166 52,166 22,72"></polygon>`;
    case "hexagon":
      return `<polygon points="52,16 148,16 192,100 148,184 52,184 8,100"></polygon>`;
    default:
      return `<rect x="24" y="24" width="152" height="152" rx="6"></rect>`;
  }
}
function sidePositions(shape, count) {
  const map = {
    square: ["top", "right", "bottom", "left"],
    rectangle: ["top", "right", "bottom", "left"],
    triangle: ["top", "right", "left"],
    circle: ["top"],
    parallelogram: ["top", "right", "bottom", "left"],
    trapezoid: ["top", "right", "bottom", "left"],
    pentagon: ["top", "upper-right", "lower-right", "lower-left", "upper-left"],
    hexagon: ["top", "upper-right", "lower-right", "bottom", "lower-left", "upper-left"]
  };
  const fallback = ["top", "right", "bottom", "left", "upper-left", "upper-right"];
  return (map[shape] || fallback).slice(0, count);
}
function createGeometryInput(index, label, pos) {
  return `<label class="geo-side-input pos-${pos}"><span>${label}</span><input type="number" min="0" step="any" data-edge-index="${index}" placeholder="cm"></label>`;
}
function renderGeometrySketch(shape) {
  if (!geometrySketch || !geometryShapeMeta[shape]) return;
  const meta = geometryShapeMeta[shape];
  const positions = sidePositions(shape, meta.sides.length);
  const edges = meta.sides.map((label, idx) => createGeometryInput(idx + 1, label, positions[idx] || "top")).join("");
  geometrySketch.innerHTML = `
    <div class="geo-notebook">
      <svg class="geo-shape-svg shape-${shape}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${geometrySvgForShape(shape)}</svg>
      ${edges}
      <input id="geoGoalInput" class="geo-goal-input" type="text" placeholder="alan / çevre">
      <div id="geoResultPad" class="geo-result-pad" aria-live="polite"></div>
    </div>
  `;
  wireGeometryInputRules(shape);
}
function normalizeGoal(v) {
  const val = String(v || "").toLowerCase().trim();
  if (hasAny(val, ["alan", "a"])) return "alan";
  if (hasAny(val, ["cevre", "çevre", "c"])) return "çevre";
  return null;
}
function getShapeEdges() {
  if (!geometrySketch) return [];
  const inputs = [...geometrySketch.querySelectorAll("input[data-edge-index]")];
  return inputs.map((i) => parsePositive(i.value));
}
function wireGeometryInputRules(shape) {
  if (!geometrySketch) return;
  const inputs = [...geometrySketch.querySelectorAll("input[data-edge-index]")];
  if (!inputs.length) return;
  inputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      clearGeometryWarn();
      const v = input.value;
      if (!v) return;
      if (shape === "square" && idx === 0) inputs.forEach((i) => { i.value = v; });
      if (shape === "rectangle") {
        if (idx === 0 || idx === 2) { if (inputs[0].value) inputs[2].value = inputs[0].value; }
        if (idx === 1 || idx === 3) { if (inputs[1].value) inputs[3].value = inputs[1].value; }
      }
    });
  });
}
function computeGeometry(shape) {
  const edges = getShapeEdges();
  const goalInput = document.getElementById("geoGoalInput");
  const goal = normalizeGoal(goalInput ? goalInput.value : "");
  if (!goal) return { error: "Ortadaki kutuya alan veya çevre yaz." };
  if (edges.some((v) => v === null)) return { error: "Tüm gerekli kenar/r değerlerini pozitif cm olarak gir." };
  if (shape === "square") {
    const a = edges[0];
    return goal === "alan"
      ? { value: a * a, formula: `${a} x ${a} = ${a * a}`, unit: "cm²", label: "Alan" }
      : { value: 4 * a, formula: `${a} x 4 = ${4 * a}`, unit: "cm", label: "Çevre" };
  }
  if (shape === "rectangle") {
    const long = edges[0];
    const short = edges[1];
    if (!(long > short)) return { error: "Dikdörtgende uzun kenar kısa kenardan büyük olmalı." };
    const area = long * short;
    const perimeter = 2 * (long + short);
    return goal === "alan"
      ? { value: area, formula: `${long} x ${short} = ${area}`, unit: "cm²", label: "Alan" }
      : { value: perimeter, formula: `2 x (${long} + ${short}) = ${perimeter}`, unit: "cm", label: "Çevre" };
  }
  if (shape === "triangle") {
    const [a, b, c] = edges;
    const p = a + b + c;
    if (goal === "çevre") return { value: p, formula: `${a}+${b}+${c} = ${p}`, unit: "cm", label: "Çevre" };
    const s = p / 2;
    const area2 = s * (s - a) * (s - b) * (s - c);
    if (area2 <= 0) return { error: "Bu kenarlarla geçerli üçgen oluşmuyor." };
    const area = Number(Math.sqrt(area2).toFixed(2));
    return { value: area, formula: `√(s(s-a)(s-b)(s-c)) = ${area}`, unit: "cm²", label: "Alan" };
  }
  if (shape === "circle") {
    const r = edges[0];
    const area = Number((Math.PI * r * r).toFixed(2));
    const perimeter = Number((2 * Math.PI * r).toFixed(2));
    return goal === "alan"
      ? { value: area, formula: `π x ${r}² = ${area}`, unit: "cm²", label: "Alan" }
      : { value: perimeter, formula: `2π x ${r} = ${perimeter}`, unit: "cm", label: "Çevre" };
  }
  if (shape === "parallelogram") {
    const a = edges[0];
    const b = edges[1];
    const area = a * b;
    const perimeter = 2 * (a + b);
    return goal === "alan"
      ? { value: area, formula: `${a} x ${b} = ${area}`, unit: "cm²", label: "Alan" }
      : { value: perimeter, formula: `2 x (${a}+${b}) = ${perimeter}`, unit: "cm", label: "Çevre" };
  }
  if (shape === "trapezoid") {
    const [a, b, c, d] = edges;
    const perimeter = a + b + c + d;
    if (goal === "çevre") return { value: perimeter, formula: `${a}+${b}+${c}+${d} = ${perimeter}`, unit: "cm", label: "Çevre" };
    const h = Number(Math.abs(a - b).toFixed(2));
    const area = Number((((a + b) / 2) * h).toFixed(2));
    return { value: area, formula: `((${a}+${b})/2) x ${h} = ${area}`, unit: "cm²", label: "Alan" };
  }
  if (shape === "pentagon" || shape === "hexagon") {
    const n = shape === "pentagon" ? 5 : 6;
    const side = edges[0];
    const perimeter = n * side;
    if (goal === "çevre") return { value: perimeter, formula: `${side} x ${n} = ${perimeter}`, unit: "cm", label: "Çevre" };
    const area = Number(((n * side * side) / (4 * Math.tan(Math.PI / n))).toFixed(2));
    return { value: area, formula: `düzgün ${n}gen alan formülü = ${area}`, unit: "cm²", label: "Alan" };
  }
  return { error: "Bu şekil için hesaplama tanımlanamadı." };
}
function showGeometrySolveEffect() {
  const pad = geometrySketch?.querySelector(".geo-notebook");
  if (!pad) return;
  pad.classList.remove("geo-hit");
  // reflow
  void pad.offsetWidth;
  pad.classList.add("geo-hit");
}
function solveGeometryCard() {
  clearGeometryWarn();
  const result = computeGeometry(selectedGeometryShape);
  if (result.error) {
    showGeometryWarn(result.error);
    return;
  }
  const resultPad = document.getElementById("geoResultPad");
  if (resultPad) resultPad.textContent = `${result.label} = ${result.value} ${result.unit}`;
  showGeometrySolveEffect();
  const shapeLabel = geometryShapeMeta[selectedGeometryShape].label;
  const userMsg = `Geometri: ${shapeLabel} (${result.label})`;
  const botMsg = `🧩 ${shapeLabel} ${result.label} = ${result.value} ${result.unit}
Adım: ${result.formula}`;
  startChatIfNeeded();
  addMessage(userMsg, "user");
  const thinking = addThinkingBubble("math");
  setTimeout(() => fillThinkingBubble(thinking, botMsg, "İşlem analiz edildi • sonuç hazır ✅"), 3000);
}
const tutorSteps = [
  {
    title: "👋 baluk-1.9 öğreticisine hoş geldin",
    text: "Bu kısa turda tüm ana butonları tek tek tanıtacağım.",
    target: () => modelToggle,
    before: () => plusMenu && plusMenu.classList.add("hidden")
  },
  {
    title: "🐟 Model seçme",
    text: "Baluk logolu bu butondan modeli değiştirebilirsin. Web Arama özelliği <b>baluk-1.7+</b>, Baluk.lens ise <b>baluk-1.9+</b> modellerde aktif olur.",
    target: () => modelToggle
  },
  {
    title: "🧠 Bellek butonu",
    text: "Buradan kaydettiğin bilgileri görür, düzenler ve temizlersin.",
    target: () => memoryToggle
  },
  {
    title: "✍️ Yazma çubuğu",
    text: "Mesajlarını buraya yazarsın. Normal modda Baluk cevap üretir, Web modunda arama sonucu toplar.",
    target: () => userInput
  },
  {
    title: "➕ Araçlar menüsü",
    text: "Bu butona basınca Matematik Modu ve Web Arama Modu araçları açılır.",
    target: () => plusToggle,
    before: () => plusMenu && plusMenu.classList.add("hidden")
  },
  {
    title: "🧠 Matematik modu",
    text: "Gelişmiş Matematik Modu ile matematik stüdyosunda çok adımlı problemleri (örn: aldı-verdi-yedi zinciri) çözebilirsin.",
    target: () => advancedMathMode ? advancedMathMode.closest("label") : null,
    before: () => plusMenu && plusMenu.classList.remove("hidden")
  },
  {
    title: "🌐 Web modu (Demo)",
    text: "Web Arama Modu açıldığında sorgun webde aranır; linkler verilir. Wikipedia metne dökme özelliği <b>baluk-1.8 ve üstü</b> modellerde açılır.",
    target: () => webSearchMode ? webSearchMode.closest("label") : null,
    before: () => plusMenu && plusMenu.classList.remove("hidden")
  },
  {
    title: "🔎 Web arama nasıl çalışır?",
    text: "Web modu açıkken giriş çubuğu web temasına döner. Sorgu yaz, gönder; Baluk 9-11 sn analiz eder ve ilk 3 sonucu tıklanabilir verir.",
    target: () => userInput,
    before: () => {
      if (plusMenu) plusMenu.classList.remove("hidden");
      if (webSearchMode && !webSearchMode.checked) {
        webSearchMode.checked = true;
        setWebMode(true);
      }
    }
  },
  {
    title: "📸 Baluk.lens (1.9)",
    text: "+ menüsünden Baluk.lens'i açarsan fotoğraf yükleyip bir bölge işaretleyebilir ve benzer görsel kaynaklarını hızlıca alabilirsin.",
    target: () => balukLensMode ? balukLensMode.closest("label") : null,
    before: () => {
      if (plusMenu) plusMenu.classList.remove("hidden");
      if (balukLensMode && !balukLensMode.checked) {
        balukLensMode.checked = true;
        setLensMode(true);
      }
    }
  },
  {
    title: "☰ Yan menü",
    text: "Sağ üstteki menü butonundan hesap, premium ve yeni arka plan ayarlarına hızlıca ulaşırsın.",
    target: () => accountToggle,
    before: () => plusMenu && plusMenu.classList.add("hidden")
  },
  {
    title: "🎵 Arka Plan Ayarları",
    text: "Yan menüdeki Arka Plan Ayarları ile 10 farklı animasyonlu tema, beyaz varsayılan tema ve 10 farklı rahatlatıcı müzik seçebilirsin.",
    target: () => drawerBackgroundOpen,
    before: () => {
      if (sideDrawer) sideDrawer.classList.remove("hidden");
    }
  },
  {
    title: "🧹 Sohbeti sıfırla",
    text: "Gerekirse tüm sohbet ekranını temizlemek için bu butonu kullanırsın.",
    target: () => clearChat,
    before: () => plusMenu && plusMenu.classList.add("hidden")
  }
];
function clearTutorSpotlight() {
  [modelToggle, memoryToggle, userInput, plusToggle, clearChat, geometryToolbar, geometrySketch, accountToggle, drawerBackgroundOpen].forEach((el) => el && el.classList.remove("math-spotlight"));
  if (advancedMathMode) {
    const n = advancedMathMode.closest("label");
    if (n) n.classList.remove("math-spotlight");
  }
  if (webSearchMode) {
    const n = webSearchMode.closest("label");
    if (n) n.classList.remove("math-spotlight");
  }
  if (balukLensMode) {
    const n = balukLensMode.closest("label");
    if (n) n.classList.remove("math-spotlight");
  }
}
function renderTutorStep() {
  if (!mathTutorOverlay || !mathTutorTitle || !mathTutorText) return;
  const step = tutorSteps[tutorStep];
  if (!step) return;
  if (typeof step.before === "function") step.before();
  mathTutorTitle.innerHTML = step.title;
  mathTutorText.innerHTML = step.text;
  clearTutorSpotlight();
  const target = step.target ? step.target() : null;
  if (target) target.classList.add("math-spotlight");
  if (mathTutorNext) mathTutorNext.classList.toggle("hidden", tutorStep >= tutorSteps.length - 1);
  if (mathTutorDone) mathTutorDone.classList.toggle("hidden", tutorStep < tutorSteps.length - 1);
}
function showTutorFinale() {
  if (!mathTutorFinale) return;
  mathTutorFinale.classList.remove("hidden");
  setTimeout(() => mathTutorFinale.classList.add("hidden"), 1600);
}
function maybeShowMathTutor() {
  if (!mathTutorOverlay || modelVersionNumber(currentModel) < 1.7) return;
  if (localStorage.getItem("balukMasterTutor17Done") === "1") return;
  tutorStep = 0;
  mathTutorOverlay.classList.remove("hidden");
  renderTutorStep();
}
function initGeometryLab() {
  if (!geometryToolbar || !geometrySketch) return;
  renderGeometrySketch(selectedGeometryShape);
  const buttons = [...geometryToolbar.querySelectorAll(".geo-btn")];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedGeometryShape = btn.dataset.shape;
      renderGeometrySketch(selectedGeometryShape);
      clearGeometryWarn();
    });
  });
  if (solveGeometryBtn) solveGeometryBtn.addEventListener("click", solveGeometryCard);
}
function showMemoryToast() {
  if (!memoryToast) return;
  memoryToast.classList.remove("hidden");
  if (memoryToastTimer) clearTimeout(memoryToastTimer);
  memoryToastTimer = setTimeout(() => memoryToast.classList.add("hidden"), 2200);
}
function buildGeneralAnswerReply(input) {
  const cleaned = input.trim();
  const starter = chooseRandom([
    "Anladım, güzel noktaya değindin.",
    "Söylediğini net aldım.",
    "Bu cevabın iyi bir yön veriyor.",
    "Gayet mantıklı bir cevap oldu."
  ]);
  return `${starter} '${cleaned}' üzerinden devam edebilirim; istersen bunu adım adım plana çevireyim.`;
}
function shouldExpectFollowUp(answer) {
  const a = answer.toLowerCase();
  const yesNoPrompt = /(?:\s|^)(m[ıi]|mi)(?:\s|$|[?.!,])/i.test(a);
  const invitationPrompt = /(ister\s+.+\s+yapal[ıi]m|challenge\s+yapal[ıi]m|başlayal[ıi]m|devam\s+edelim|deneyelim)/i.test(a);
  return answer.includes("?") || yesNoPrompt || hasAny(a, [
    "sen seç:", "bana tema ver", "tema seç", "yazayım mı", "istersen",
    "challenge yapalım", "mini challenge", "ister şiir yazalım", "ister küçük bir matematik",
    "ister hikaye", "ister hikâye", "başlayalım", "devam edelim", "sen seç"
  ]) || invitationPrompt;
}
function isAffirmativeInput(inputLower) {
  return hasAny(inputLower, ["evet", "olur", "tamam", "yapalım", "hadi", "ok", "başla", "basla"]);
}
function resolveActivityChoice(inputLower) {
  if (hasAny(inputLower, ["matematik", "işlem", "hesap"])) {
    return "Süper, matematik modundayız 🧮 Bana bir işlem (örn: 12*7) ya da denklem (örn: 2x+4=18) yaz.";
  }
  if (hasAny(inputLower, ["hikaye", "hikâye"])) {
    return askThemeFor("story");
  }
  if (hasAny(inputLower, ["şiir", "siir"])) {
    return askThemeFor("poem");
  }
  if (hasAny(inputLower, ["aşk", "ask"])) {
    return generateCreativeText("poem", "aşk");
  }
  return null;
}
function resolveYesNoFromLastPrompt(inputLower) {
  const last = (lastBotResponse || "").toLowerCase();
  const yes = isAffirmativeInput(inputLower);
  const no = hasAny(inputLower, ["hayır", "hayir", "istemiyorum", "yok"]);
  if (!yes && !no) return null;
  if (no) return chooseRandom(generalNoResponses);
  const detectedTheme = detectTheme(last) || (last.match(/([a-zçğıöşü\s]+)\s+temalı/i)?.[1]?.trim() ?? null);
  const theme = detectedTheme || "doğa";
  if (hasAny(last, ["hikâye", "hikaye"])) {
    if (hasAny(last, ["tema ver", "tema seç"])) return askThemeFor("story");
    if (hasAny(last, ["yazayım", "yazalım", "mini hikâye", "mini hikaye"])) return generateCreativeText("story", theme);
  }
  if (hasAny(last, ["şiir", "siir"])) {
    if (hasAny(last, ["tema seç", "tema ver"])) return askThemeFor("poem");
    if (hasAny(last, ["yazayım", "yazalım", "kısa şiir", "temalı"])) return generateCreativeText("poem", theme);
  }
  if (hasAny(last, ["matematik", "işlem", "denklem"])) {
    return "Harika, matematikte devam edelim 🧠 Bana çözmemi istediğin işlemi yaz.";
  }
  if (hasAny(last, ["challenge", "mini challenge", "küçük bir matematik", "matematik challenge"])) {
    return "Süper! Challenge modu açıldı 🧮 İlk tur: 37 + 48 kaç eder? İstersen kendi sorunu da yazabilirsin.";
  }
  if (hasAny(last, ["plan", "adım adım", "mini plan"])) {
    return chooseRandom(goalPlanResponses);
  }
  return chooseRandom(generalYesResponses);
}
function isClearlyNewTopic(inputLower) {
  if (solveWordProblemValue(inputLower) !== null) return true;
  if (solveLinearEquation(inputLower)) return true;
  if (solveSimpleExpression(inputLower)) return true;
  const questionSignals = ["?", "kaç", "kac", "nedir", "nasıl", "nasil", "neden", "kim", "ne zaman", "hangi", "ne", "olur mu", "mümkün mü", "gerçekten", "doğru mu"];
  return questionSignals.some((token) => inputLower.includes(token));
}
function detectTheme(inputLower) {
  const theme = creativeThemes.find((t) => inputLower.includes(t));
  if (theme) return theme;
  const cleaned = inputLower.replace(/tema(?:m)?\s*(?:=|:)?\s*/g, "").trim();
  if (!cleaned) return null;
  const shortTheme = cleaned.split(/[,.;!?]/)[0].trim();
  return shortTheme && shortTheme.length <= 40 ? shortTheme : null;
}
function isCompetitorAiMention(inputLower) {
  return competitorAiKeywords.some((kw) => inputLower.includes(kw));
}
function buildAiMentionReply() {
  return chooseRandom(aiMentionResponses);
}
function askThemeFor(mode) {
  convoState.awaitingCreativeTheme = true;
  convoState.creativeMode = mode;
  return `Harika, ${mode === "story" ? "hikâye" : "şiir"} yazalım ✍️ Önce bir tema seç: ${creativeThemes.join(", ")}.`;
}
function generateCreativeText(mode, theme) {
  const normalizedTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
  const template = mode === "story" ? chooseRandom(storyTemplates) : chooseRandom(poemTemplates);
  const title = mode === "story" ? `📖 ${normalizedTheme} Temalı Mini Hikâye` : `📝 ${normalizedTheme} Temalı Şiir`;
  const themedText = template
    .replaceAll("{theme}yi", `${theme}'yi`)
    .replaceAll("{theme}ye", `${theme}'ye`)
    .replaceAll("{theme}si", `${theme}'si`)
    .replaceAll("{theme}", theme);
  return `${title}
${themedText}`;
}
function saveMemory() {
  localStorage.setItem("balukMemory", JSON.stringify(userMemory));
}
function renderMemoryList() {
  memoryList.innerHTML = "";
  if (!supportsMemoryModel()) {
    const li = document.createElement("li");
    li.textContent = "Bellek yalnızca baluk-1.6 modelinde aktif.";
    memoryList.appendChild(li);
    return;
  }
  const entries = Object.entries(userMemory);
  if (!entries.length) {
    const li = document.createElement("li");
    li.textContent = "Henüz kayıt yok.";
    memoryList.appendChild(li);
    return;
  }
  entries.forEach(([k, v]) => {
    const li = document.createElement("li");
    li.textContent = `${k}: ${v}`;
    memoryList.appendChild(li);
  });
}
function parseMemory(input) {
  if (!supportsMemoryModel()) return null;
  const lower = input.toLowerCase();
  if (isMemoryQuestion(lower)) return null;
  let changed = false;
  memoryPatterns.forEach((p) => {
    const m = input.match(p.regex);
    if (m && m[1]) {
      userMemory[p.label] = m[1].trim();
      changed = true;
    }
  });
  if (changed) {
    saveMemory();
    renderMemoryList();
    showMemoryToast();
    return chooseRandom(memorySavedResponses);
  }
  return null;
}
function getMemoryAnswer(inputLower) {
  if (!supportsMemoryModel()) return null;
  for (const rule of memoryQuestionPatterns) {
    if (!hasAny(inputLower, rule.checks)) continue;
    const known = rule.labels.filter((label) => userMemory[label]);
    if (!known.length) {
      return "Bu bilgi belleğimde henüz yok 🤔 Bana 'Benim adım ...', 'yaşım ...' gibi yazarsan kaydederim.";
    }
    if (rule.labels.length === 1) {
      const label = rule.labels[0];
      return `${label} bilgin: ${userMemory[label]}`;
    }
    const summary = known.map((label) => `${label}: ${userMemory[label]}`).join("\n");
    return `Belleğinde şunlar var:
${summary}`;
  }
  return null;
}
function isMemoryQuestion(inputLower) {
  return memoryQuestionPatterns.some((rule) => hasAny(inputLower, rule.checks));
}
function startIntroAmbientHum() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!introAudioCtx) introAudioCtx = new AudioCtx();
  const now = introAudioCtx.currentTime;
  if (introAudioCtx.state === "suspended") {
    introAudioCtx.resume().catch(() => {});
  }
  if (introAmbientNodes.length) return;
  const master = introAudioCtx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.018, now + 1.6);
  master.connect(introAudioCtx.destination);
  const oscA = introAudioCtx.createOscillator();
  oscA.type = "sine";
  oscA.frequency.setValueAtTime(72, now);
  const oscB = introAudioCtx.createOscillator();
  oscB.type = "triangle";
  oscB.frequency.setValueAtTime(108, now);
  const wobble = introAudioCtx.createOscillator();
  wobble.type = "sine";
  wobble.frequency.value = 0.12;
  const wobbleGain = introAudioCtx.createGain();
  wobbleGain.gain.value = 5;
  const filter = introAudioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 260;
  filter.Q.value = 0.6;
  wobble.connect(wobbleGain);
  wobbleGain.connect(filter.frequency);
  oscA.connect(filter);
  oscB.connect(filter);
  filter.connect(master);
  oscA.start(now);
  oscB.start(now);
  wobble.start(now);
  introAmbientNodes = [oscA, oscB, wobble, wobbleGain, filter, master];
}
function stopIntroAmbientHum(fast = false) {
  if (!introAudioCtx || !introAmbientNodes.length) return;
  const now = introAudioCtx.currentTime;
  const master = introAmbientNodes[introAmbientNodes.length - 1];
  if (master && master.gain) {
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + (fast ? 0.25 : 0.7));
  }
  setTimeout(() => {
    try {
      introAmbientNodes.forEach((n) => {
        if (n && typeof n.stop === "function") n.stop();
      });
    } catch {}
    introAmbientNodes = [];
  }, fast ? 320 : 760);
}
function startIntroWhooshAudio() {
  stopIntroWhooshAudio();
  stopIntroAmbientHum(true);
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!introAudioCtx) introAudioCtx = new AudioCtx();
  const now = introAudioCtx.currentTime;
  if (introAudioCtx.state === "suspended") introAudioCtx.resume().catch(() => {});
  const master = introAudioCtx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.08, now + 0.35);
  master.gain.exponentialRampToValueAtTime(0.12, now + 1.25);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
  master.connect(introAudioCtx.destination);
  const osc = introAudioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(170, now);
  osc.frequency.exponentialRampToValueAtTime(260, now + 1.1);
  osc.frequency.exponentialRampToValueAtTime(232, now + 1.45);
  osc.frequency.exponentialRampToValueAtTime(210, now + 4.2);
  const lfo = introAudioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.42;
  const lfoGain = introAudioCtx.createGain();
  lfoGain.gain.value = 22;
  const filter = introAudioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(700, now);
  filter.frequency.exponentialRampToValueAtTime(1500, now + 1.4);
  filter.frequency.exponentialRampToValueAtTime(900, now + 2.7);
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(filter);
  filter.connect(master);
  osc.start(now);
  lfo.start(now);
  osc.stop(now + 5.0);
  lfo.stop(now + 5.0);
  introAudioNodes = [osc, lfo, master, filter, lfoGain];
}
function stopIntroWhooshAudio() {
  try {
    introAudioNodes.forEach((n) => {
      if (n && typeof n.stop === "function") n.stop();
    });
  } catch {}
  introAudioNodes = [];
  if (introAudioCtx && !introAmbientNodes.length) {
    introAudioCtx.close().catch(() => {});
    introAudioCtx = null;
  }
}
function openAppWithTransition() {
  if (!introGate || !appRoot) return;

  const revealApp = () => {
    stopIntroWhooshAudio();
    if (enterTransition) enterTransition.classList.add("hidden");
    appRoot.classList.remove("hidden");
    if (userInput) userInput.focus();
    setTimeout(() => maybeShowMathTutor(), 220);
  };

  introGate.classList.add("hidden");
  if (enterTransition) enterTransition.classList.remove("hidden");

  try {
    startIntroWhooshAudio();
  } catch {}

  const TRANSITION_MS = 4200;
  setTimeout(revealApp, TRANSITION_MS);

  // Güvenlik ağı: herhangi bir timer/ses sorunu olursa yine de uygulamayı aç.
  setTimeout(() => {
    if (appRoot.classList.contains("hidden")) revealApp();
  }, TRANSITION_MS + 1200);
}
function applyPersonalization(response) {
  if (!supportsMemoryModel()) return response;
  const name = userMemory.Ad;
  if (!name) return response;
  const trimmed = String(response || "").trim();
  if (!trimmed) return response;
  if (trimmed.toLowerCase().startsWith(`${String(name).toLowerCase()},`)) return response;
  return `${name}, ${response}`;
}
function addMessage(text, role) {
  const n = document.createElement("div");
  n.className = `msg ${role}`;
  chat.appendChild(n);
  chat.scrollTop = chat.scrollHeight;
  if (role === "bot") {
    n.classList.add("typing-active");
    typeTextSlowly(n, text, { baseDelay: 10, punctuationDelay: 34 }).finally(() => n.classList.remove("typing-active"));
    return;
  }
  n.textContent = text;
}
function addThinkingBubble(kind = "default") {
  const n = document.createElement("div");
  n.className = `msg bot thinking-bubble ${kind === "math" ? "thinking-math" : kind === "web" ? "thinking-web" : ""}`;
  const title = kind === "math" ? "İşlem analiz ediliyor..." : kind === "web" ? "Web'den buluyorum..." : "Baluk düşünüyor...";
  n.innerHTML = `
    <div class="thinking-head">
      <svg class="fish-logo think-fish spin-fast" viewBox="0 0 520 220" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#baluk-fish"></use></svg>
      <span>${title}</span>
    </div>
  `;
  chat.appendChild(n);
  chat.scrollTop = chat.scrollHeight;
  return n;
}
function updateThinkingStatus(node, status) {
  if (!node || !status) return;
  const statusEl = node.querySelector(".thinking-head span");
  if (statusEl) statusEl.textContent = status;
}
function startWebThinkingProgress(node, totalMs) {
  if (!node) return () => {};
  const steps = [
    { at: 1200, text: "Web'den alıyorum..." },
    { at: Math.max(2200, Math.round(totalMs * 0.45)), text: "Web'den yazıya döküyorum..." },
    { at: Math.max(3200, Math.round(totalMs * 0.72)), text: "Kaynakları birleştiriyorum..." },
    { at: Math.max(4200, Math.round(totalMs * 0.9)), text: "Son dokunuşlar yapılıyor..." }
  ];
  const timers = steps.map((step) => setTimeout(() => updateThinkingStatus(node, step.text), step.at));
  return () => timers.forEach((t) => clearTimeout(t));
}
function fillThinkingBubble(node, text, doneStatus = "") {
  if (!node) return;
  const fish = node.querySelector(".think-fish");
  if (fish) fish.classList.remove("spin-fast");
  if (doneStatus) updateThinkingStatus(node, doneStatus);
  let content = node.querySelector(".thinking-answer");
  if (!content) {
    content = document.createElement("div");
    content.className = "thinking-answer";
    node.appendChild(content);
  }
  content.classList.add("typing-active");
  typeTextSlowly(content, text, { baseDelay: 10, punctuationDelay: 36 }).finally(() => content.classList.remove("typing-active"));
}
function openSafetySurveyModal(category = "generic") {
  if (!safetySurveyModal) return;
  safetySurveyModal.dataset.category = category;
  safetySurveyModal.classList.remove("hidden");
}
function closeSafetySurvey() {
  if (!safetySurveyModal) return;
  safetySurveyModal.classList.add("hidden");
}
function surveyReplyByReason(reason, category) {
  const map = {
    "bunaldim": "Bunu paylaştığın için teşekkür ederim 💙 Bunalmış hissettiğinde önce güvenli kalmak önemli: nefesini yavaşlat, yalnız kalma ve bir yakınından destek iste. İstersen şimdi birlikte 5 dakikalık sakinleşme planı yapalım.",
    "merak": "Merak duygun çok doğal 🌟 Ancak riskli/yasa dışı alanlarda merakı güvenli kanallara taşımak en sağlıklısı. İstersen aynı konunun güvenli ve yasal öğrenme tarafını adım adım göstereyim.",
    "zarar-baskasi": "Bu duygu ciddiye alınmalı. Kimseye zarar vermeye dönüşmeden önce uzaklaşma + sakinleşme + destek alma adımı çok kritik. İstersen öfke yönetimi için kısa bir acil plan çıkaralım.",
    "zarar-kendim": "Bunu söylediğin için gerçekten teşekkür ederim. Bu noktada yalnız kalmaman ve bir destek kişisine hemen ulaşman çok önemli. Eğer risk yüksekse lütfen acil yardıma başvur. Ben de burada kalabilirim.",
    "saka": "Anladım 🙂 Yine de bu tür konular hassas olduğu için güvenlik dilini koruyorum. İstersen şimdi tamamen güvenli bir konuya geçip üretken bir şey yapalım."
  };
  const prefix = category === "self_harm" ? "🫂" : "🛡️";
  return `${prefix} ${map[reason] || map['merak']}`;
}
function appendSafetySurveyPrompt() {
  const category = pendingSafetySurvey || "generic";
  const wrap = document.createElement("div");
  wrap.className = "msg bot safety-survey";
  wrap.innerHTML = `
    <div class="survey-title">İstersen detaylı anketi başlatabilirim.</div>
    <button type="button" class="survey-start-btn" data-category="${category}">Neden bunu yapmak istedin?</button>
  `;
  const btn = wrap.querySelector(".survey-start-btn");
  if (btn) {
    btn.addEventListener("click", () => openSafetySurveyModal(btn.dataset.category || "generic"));
  }
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}
function solveSimpleExpression(input) {
  const normalized = input.toLowerCase().replaceAll("x", "*").replaceAll("çarpı", "*").replaceAll("kere", "*").replaceAll("bölü", "/").replaceAll("artı", "+").replaceAll("eksi", "-").replace(/[^0-9+\-*/()., ]/g, "").replaceAll(",", ".").trim();
  if (!/[0-9]/.test(normalized) || !/[+\-*/]/.test(normalized)) return null;
  try {
    const value = Function(`"use strict"; return (${normalized});`)();
    if (Number.isFinite(value)) return `Sonuç: ${value} ✅`;
  } catch { return null; }
  return null;
}
function solveLinearEquation(input) {
  const compact = input.toLowerCase().replace(/\s+/g, "");
  const m = compact.match(/^([+-]?\d*)x([+-]\d+)?=([+-]?\d+)$/);
  if (!m) return null;
  const a = m[1] === "" || m[1] === "+" ? 1 : m[1] === "-" ? -1 : Number(m[1]);
  const b = Number(m[2] || "+0");
  const c = Number(m[3]);
  if (a === 0) return "Bu denklemde x katsayısı 0 olduğu için klasik çözüm yok.";
  return `Denklem çözümü: x = ${(c - b) / a}`;
}
function solveWordProblemValue(input) {
  const q = String(input || "").toLowerCase();
  const numRegex = /-?\d+(?:[.,]\d+)?/g;
  const occ = [];
  let m;
  while ((m = numRegex.exec(q)) !== null) {
    occ.push({ value: Number(m[0].replace(",", ".")), index: m.index, raw: m[0] });
  }
  if (occ.length < 2 || occ.some((n) => !Number.isFinite(n.value))) return null;
  const minusVerbs = [
    "verdi", "yed", "att", "kaybet", "harca", "çıkar", "cikar", "azal", "eksil", "sat", "gitti", "gitt"
  ];
  const plusVerbs = [
    "ald", "bul", "kazan", "topla", "ekl", "geld", "katıl", "katil", "ekle", "koy"
  ];
  const asksRemaining = hasAny(q, ["kaç kaldı", "kac kaldi", "ne kadar kaldı", "ne kadar kaldi", "kaç tane kaldı", "kac tane kaldi"]);
  const asksTotal = hasAny(q, ["kaç oldu", "kac oldu", "toplam", "ne kadar oldu", "kaç tane oldu", "kac tane oldu"]);
  const hasMinus = (t) => hasAny(t, minusVerbs);
  const hasPlus = (t) => hasAny(t, plusVerbs);
  let total = occ[0].value;
  for (let i = 1; i < occ.length; i += 1) {
    const prev = occ[i - 1];
    const cur = occ[i];
    const next = occ[i + 1];
    const afterSlice = q.slice(cur.index, next ? next.index : Math.min(q.length, cur.index + 48));
    const beforeSlice = q.slice(Math.max(0, prev.index), cur.index + cur.raw.length);
    let sign = 0;
    const afterMinus = hasMinus(afterSlice);
    const afterPlus = hasPlus(afterSlice);
    if (afterMinus && !afterPlus) sign = -1;
    else if (afterPlus && !afterMinus) sign = +1;
    else {
      const beforeMinus = hasMinus(beforeSlice);
      const beforePlus = hasPlus(beforeSlice);
      if (beforeMinus && !beforePlus) sign = -1;
      else if (beforePlus && !beforeMinus) sign = +1;
    }
    if (!sign) {
      if (asksRemaining && !asksTotal) sign = -1;
      else sign = +1;
    }
    total += sign * cur.value;
  }
  if (asksRemaining && hasAny(q, ["kalan", "kalanı", "kalani", "hepsini", "tamamını", "tamamini"]) && hasAny(q, ["yed", "harca", "verdi"])) {
    return 0;
  }
  return Number(total.toFixed(6));
}
function solveWordProblem(input) {
  const value = solveWordProblemValue(input);
  if (value === null) return null;
  return `Problem sonucu: ${value} ✅`;
}
function updateModelVisual() {
  if (!currentModelBadge) return;
  if (advancedMathEnabled) {
    currentModelBadge.textContent = "matematik modu";
    currentModelBadge.classList.remove("premium-model-badge");
    return;
  }
  const premiumModelLabel = currentModel === "baluk-1.7" && isPremiumUser ? "premium-1.7" : currentModel;
  currentModelBadge.textContent = premiumModelLabel;
  currentModelBadge.classList.toggle("premium-model-badge", premiumModelLabel === "premium-1.7");
}
function updateMemoryAvailability() {
  clearMemory.disabled = !supportsMemoryModel();
  clearMemory.style.opacity = supportsMemoryModel() ? "1" : ".55";
  clearMemory.style.cursor = supportsMemoryModel() ? "pointer" : "not-allowed";
  renderMemoryList();
}
function updateGeneralQuestionState(answer) {
  convoState.awaitingGeneralAnswer = supportsContextModel() && shouldExpectFollowUp(answer);
}
function resolveFollowUp(input) {
  if (!supportsContextModel()) return null;
  const l = input.toLowerCase();
  if (convoState.awaitingEpsteinList && hasAny(l, ["evet", "olur", "tamam", "5 madde", "beş madde", "5 maddeye ayır", "beş maddeye ayır"])) {
    convoState.awaitingEpsteinList = false;
    return chooseRandom(epsteinListResponses);
  }
  if (convoState.awaitingCreativeTheme && convoState.creativeMode) {
    const theme = detectTheme(l);
    if (theme) {
      const mode = convoState.creativeMode;
      convoState.awaitingCreativeTheme = false;
      convoState.creativeMode = null;
      return generateCreativeText(mode, theme);
    }
    return `Temayı yakalayamadım 🤔 Şunlardan birini yazabilirsin: ${creativeThemes.join(", ")}.`;
  }
  if (hasAny(l, ["ne yapalım", "ne yapalim", "napalım", "napalim"])) {
    convoState.awaitingActivityChoice = true;
    return "Hazırım 💙 Sen seç: matematik / şiir / hikâye. İstersen direkt tema da yazabilirsin (örn: aşk, doğa, umut).";
  }
  if (convoState.awaitingActivityChoice) {
    const picked = resolveActivityChoice(l);
    if (picked) {
      if (!hasAny(l, ["hikaye", "hikâye", "şiir", "siir"])) convoState.awaitingActivityChoice = false;
      return picked;
    }
  }
  if (convoState.awaitingMoodReply && (hasAny(l, ["iyiyim", "i̇yiyim", "ben de iyiyim", "bende iyiyim", "harikayım", "süperim", "motiveyim", "mutluyum", "yorgunum", "stresliyim", "sıkıldım", "üzgünüm", "iyiyim teşekkürler", "iyiyim tesekkurler"]) || /(^|\s)(i̇?yiyim|iyiyim)(\s|$|[?.!,])/.test(l))) {
    convoState.awaitingMoodReply = false;
    return chooseRandom(iyiyimFollowUpResponses);
  }
  if (convoState.awaitingGoalPlan && hasAny(l, ["hedef koyalım", "tamam", "olur", "hadi"])) {
    convoState.awaitingGoalPlan = false;
    return chooseRandom(goalPlanResponses);
  }
  if (convoState.awaitingGeneralAnswer) {
    const fromPrompt = resolveYesNoFromLastPrompt(l);
    if (fromPrompt) return fromPrompt;
    if (isClearlyNewTopic(l)) {
      convoState.awaitingGeneralAnswer = false;
      return null;
    }
    if (hasAny(l, ["plan", "adım", "adim", "devam", "detay", "anlat"])) {
      convoState.awaitingGeneralAnswer = false;
      return buildGeneralAnswerReply(input);
    }
    convoState.awaitingGeneralAnswer = false;
    return null;
  }
  return null;
}
function buildTextResponse(input) {
  const l = input.toLowerCase();
  if (isUnsafeQuery(l)) return buildUnsafeRefusal(l);
  if (isCompetitorAiMention(l)) return buildAiMentionReply();
  if (hasSalutation(l, saKeywords)) {
    const profanityDirect = buildProfanityModeDirectReply(l, input);
    if (profanityDirect) return profanityDirect;
    return chooseRandom(saResponses);
  }
  const memoryAnswer = getMemoryAnswer(l);
  if (memoryAnswer) return memoryAnswer;
  const memorySaved = parseMemory(input);
  if (memorySaved) return memorySaved;
  const follow = resolveFollowUp(input);
  if (follow) return follow;
  if (supportsContextModel() && isAffirmativeInput(l) && shouldExpectFollowUp(lastBotResponse || "")) {
    const bridged = resolveYesNoFromLastPrompt(l);
    if (bridged) return bridged;
  }
  const profanityDirect = buildProfanityModeDirectReply(l, input);
  if (profanityDirect) return profanityDirect;
  if (getToxicityLevel(l) === "insult") return chooseRandom(insultReplyPrompts);
  if (supportsContextModel() && hasAny(l, ["hikaye yaz", "hikâye yaz", "hikaye yazalım", "hikâye yazalım", "hikaye", "hikâye"])) {
    return askThemeFor("story");
  }
  if (supportsContextModel() && hasAny(l, ["şiir yaz", "siir yaz", "şiir yazalım", "siir yazalım", "şiir", "siir"])) {
    return askThemeFor("poem");
  }
  if (hasAny(l, ["merhaba", "selam", "merhab", "meraba", "kanka merhaba"])) {
    if (supportsContextModel()) convoState.awaitingMoodReply = true;
    return chooseRandom(merhabaResponses);
  }
  if (isHowAreYouVariant(l)) {
    if (supportsContextModel()) convoState.awaitingMoodReply = true;
    const profanityMood = buildProfanityModeDirectReply(l, input);
    if (profanityMood) return profanityMood;
    return chooseRandom(nasilsinResponses);
  }
  if (hasAny(l, emotionalKeywords)) {
    if (supportsContextModel()) convoState.awaitingGoalPlan = true;
    return chooseRandom(emotionalPromptBank);
  }
  if (hasAny(l, ["epstein", "epstion", "epstien"])) {
    if (supportsContextModel()) convoState.awaitingEpsteinList = true;
    return chooseRandom(epsteinResponses);
  }
  const wordProblem = solveWordProblem(input); if (wordProblem) return wordProblem;
  const eq = solveLinearEquation(input); if (eq) return eq;
  const expr = solveSimpleExpression(input); if (expr) return expr;
  const unifiedKeywordReply = buildUnifiedKeywordReply(l);
  if (unifiedKeywordReply) return unifiedKeywordReply;

  if (isProfanityModeActive()) {
    return buildProfanityUnknownReply(input);
  }

  return `Mesajını aldım: "${input}"
Aktif model: ${currentModel} ✅
İstersen bu konuyu daha analitik, daha uzun ve adım adım AI tarzında detaylandırabilirim.`;
}
function startChatIfNeeded() {
  if (hasStartedChat) return;
  hasStartedChat = true;
  splash.classList.add("hidden");
  chat.classList.remove("hidden");
}
function processInput(text) {
  startChatIfNeeded();
  addMessage(text, "user");
  if (isBMWTrigger(text)) {
    renderBMWVideoCard();
    return;
  }
  const isMathFlow = advancedMathEnabled || Boolean(solveWordProblemValue(text));
  const thinking = addThinkingBubble(isMathFlow ? "math" : "default");
  const delayMs = isMathFlow ? 3000 : 1100;
  setTimeout(() => {
    const rawResponse = buildTextResponse(text);
    const response = applyProfanityFlavor(expandForPremium(applyPersonalization(rawResponse)), text);
    lastBotResponse = response;
    updateGeneralQuestionState(response);
    const doneStatus = isMathFlow ? "İşlem analiz edildi • cevap hazır ✅" : "Düşündüm • cevap hazır ✅";
    fillThinkingBubble(thinking, response, doneStatus);
    if (pendingSafetySurvey) {
      appendSafetySurveyPrompt();
      pendingSafetySurvey = null;
    }
  }, delayMs);
}
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  if (isBannedNow()) return;
  const lower = text.toLowerCase();
  const toxicity = getToxicityLevel(lower);
  if (toxicity && isPremiumUser && allowProfanity) {
    startChatIfNeeded();
    addMessage(text, "user");
    addMessage(applyProfanityFlavor(chooseRandom(playfulProfanityReplies), text), "bot");
    userInput.value = "";
    return;
  }
  if (!isPremiumUser) {
    if (toxicity === "severe") {
      startBan("Ağır küfür algılandı. 10 dakikalık ban uygulandı.");
      return;
    }
    if (toxicity === "insult") {
      insultWarningCount += 1;
      if (insultWarningCount >= 2) {
        startBan("2. hakaret/argo uyarısı sonrası 10 dakikalık ban uygulandı.");
        return;
      }
      showWarningOverlay(`⚠️ Hakaret/argo uyarısı: ${insultWarningCount}/2. İkinci uyarıda 10 dakikalık ban uygulanır.`);
    }
  }
  if (webModeEnabled) {
    processWebSearchInput(text);
    userInput.value = "";
    return;
  }
  if (lensModeEnabled) {
    addMessage("Baluk.lens açık. Önce panelden fotoğraf yükleyip Analizi Başlat butonuna bas.", "bot");
    userInput.value = "";
    return;
  }
  processInput(text);
  userInput.value = "";
});
clearChat.addEventListener("click", () => {
  hasStartedChat = false;
  Object.keys(convoState).forEach((k) => { convoState[k] = false; });
  chat.innerHTML = "";
  chat.classList.add("hidden");
  splash.classList.remove("hidden");
  updateSplashPrompt();
setWebMode(false);
});
memoryToggle.addEventListener("click", () => {
  memoryPanel.classList.toggle("hidden");
  renderMemoryList();
});
clearMemory.addEventListener("click", () => {
  if (!supportsMemoryModel()) return;
  Object.keys(userMemory).forEach((k) => delete userMemory[k]);
  saveMemory();
  renderMemoryList();
});
modelToggle.addEventListener("click", () => { if (advancedMathEnabled) return; modelMenu.classList.toggle("hidden"); });
document.addEventListener("click", (e) => {
  if (!modelMenu.contains(e.target) && !modelToggle.contains(e.target)) modelMenu.classList.add("hidden");
});
modelOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    if (advancedMathEnabled) return;
    modelOptions.forEach((i) => i.classList.remove("active"));
    opt.classList.add("active");
    currentModel = opt.dataset.model;
    localStorage.setItem(MODEL_STORAGE_KEY, currentModel);
    updateModelVisual();
    updateMemoryAvailability();
    if (!supportsWebModel()) setWebMode(false);
    if (!supportsLensModel()) setLensMode(false);
    modelMenu.classList.add("hidden");
  });
});
modelOptions.forEach((opt) => opt.classList.toggle("active", opt.dataset.model === currentModel));
updateModelVisual();
updateMemoryAvailability();
initGeometryLab();
updateSplashPrompt();
restoreBanState();
restoreAccountProfile();
restoreBackgroundSettings();
if (balukLensMode) balukLensMode.checked = false;
setLensMode(false);
if (plusToggle && plusMenu) {
  plusToggle.addEventListener("click", () => plusMenu.classList.toggle("hidden"));
  document.addEventListener("click", (e) => {
    if (!plusMenu.contains(e.target) && !plusToggle.contains(e.target)) plusMenu.classList.add("hidden");
  });
}
if (advancedMathMode) {
  advancedMathMode.addEventListener("change", () => {
    setAdvancedMathMode(advancedMathMode.checked);
    updateModelVisual();
  });
}
if (webSearchMode) {
  webSearchMode.addEventListener("change", () => setWebMode(webSearchMode.checked));
}
if (balukLensMode) {
  balukLensMode.addEventListener("change", () => setLensMode(balukLensMode.checked));
}
if (mathStudioToggle && mathStudioPanel) {
  mathStudioToggle.addEventListener("click", () => mathStudioPanel.classList.toggle("hidden"));
}
if (mathStudioInput) {
  mathStudioInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    renderMathStudio();
  });
}
if (mathTutorNext) {
  mathTutorNext.addEventListener("click", () => {
    tutorStep = Math.min(tutorStep + 1, tutorSteps.length - 1);
    renderTutorStep();
  });
}
if (mathTutorDone) {
  mathTutorDone.addEventListener("click", () => {
    if (mathTutorOverlay) mathTutorOverlay.classList.add("hidden");
    clearTutorSpotlight();
    if (plusMenu) plusMenu.classList.add("hidden");
    localStorage.setItem("balukMathTutorDone", "1");
    localStorage.setItem("balukMasterTutor17Done", "1");
    showTutorFinale();
  });
}
if (safetySurveyOptions) {
  safetySurveyOptions.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-reason]");
    if (!btn) return;
    const reason = btn.dataset.reason;
    const category = (safetySurveyModal && safetySurveyModal.dataset.category) || "generic";
    closeSafetySurvey();
    addMessage(surveyReplyByReason(reason, category), "bot");
  });
}
if (closeSafetySurveyModal) {
  closeSafetySurveyModal.addEventListener("click", closeSafetySurvey);
}
if (accountToggle && sideDrawer) {
  accountToggle.addEventListener("click", () => sideDrawer.classList.toggle("hidden"));
}
if (drawerClose && sideDrawer) {
  drawerClose.addEventListener("click", () => sideDrawer.classList.add("hidden"));
}
if (drawerAccountOpen && accountPanel) {
  drawerAccountOpen.addEventListener("click", () => {
    accountPanel.classList.toggle("hidden");
    if (sideDrawer) sideDrawer.classList.add("hidden");
    if (memoryPanel) memoryPanel.classList.add("hidden");
    if (mathStudioPanel) mathStudioPanel.classList.add("hidden");
  });
}
if (drawerPremiumOpen && premiumModal) {
  drawerPremiumOpen.addEventListener("click", () => {
    if (!isPremiumUser) premiumModal.classList.remove("hidden");
  });
}
if (drawerBackgroundOpen && backgroundModal) {
  drawerBackgroundOpen.addEventListener("click", () => {
    backgroundModal.classList.remove("hidden");
    if (sideDrawer) sideDrawer.classList.add("hidden");
  });
}
if (backgroundClose && backgroundModal) {
  backgroundClose.addEventListener("click", () => backgroundModal.classList.add("hidden"));
}
if (backgroundModal) {
  const back = backgroundModal.querySelector('.background-backdrop');
  if (back) back.addEventListener('click', () => backgroundModal.classList.add('hidden'));
}
if (backgroundThemeSelect) {
  backgroundThemeSelect.addEventListener('change', () => applyBackgroundTheme(backgroundThemeSelect.value));
}
if (backgroundMusicSelect) {
  backgroundMusicSelect.addEventListener('change', () => setBackgroundMusic(backgroundMusicSelect.value));
}
if (backgroundMusicVolume) {
  backgroundMusicVolume.addEventListener('input', () => setBackgroundVolume(backgroundMusicVolume.value));
}
if (lensClose) lensClose.addEventListener("click", () => {
  if (balukLensMode) balukLensMode.checked = false;
  setLensMode(false);
});
if (lensPickBtn && lensFileInput) {
  lensPickBtn.addEventListener("click", () => lensFileInput.click());
}
if (lensFileInput) {
  lensFileInput.addEventListener("change", () => {
    const file = lensFileInput.files?.[0];
    if (file) loadLensFile(file);
  });
}
if (lensDropZone) {
  ["dragenter", "dragover"].forEach((evt) => lensDropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    lensDropZone.classList.add("dragging");
  }));
  ["dragleave", "drop"].forEach((evt) => lensDropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    lensDropZone.classList.remove("dragging");
  }));
  lensDropZone.addEventListener("drop", (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (file) loadLensFile(file);
  });
}
if (lensCanvas) {
  lensCanvas.addEventListener("pointerdown", (e) => {
    if (!lensImageDataUrl) return;
    const r = lensCanvas.getBoundingClientRect();
    lensDragStart = { x: e.clientX - r.left, y: e.clientY - r.top };
    lensSelection = null;
  });
  lensCanvas.addEventListener("pointermove", (e) => {
    if (!lensDragStart) return;
    const r = lensCanvas.getBoundingClientRect();
    const end = { x: Math.max(0, Math.min(lensCanvas.width, e.clientX - r.left)), y: Math.max(0, Math.min(lensCanvas.height, e.clientY - r.top)) };
    lensSelection = normalizeRect(lensDragStart, end);
    drawLensCanvas();
  });
  lensCanvas.addEventListener("pointerup", (e) => {
    const r = lensCanvas.getBoundingClientRect();
    const end = { x: Math.max(0, Math.min(lensCanvas.width, e.clientX - r.left)), y: Math.max(0, Math.min(lensCanvas.height, e.clientY - r.top)) };
    if (lensDragStart) {
      const rect = normalizeRect(lensDragStart, end);
      if (rect.w < 14 || rect.h < 14) {
        if (isMobileLensViewport()) {
          const w = Math.max(80, Math.round(lensCanvas.width * 0.46));
          const h = Math.max(80, Math.round(lensCanvas.height * 0.36));
          lensSelection = {
            x: Math.max(0, Math.min(lensCanvas.width - w, end.x - w / 2)),
            y: Math.max(0, Math.min(lensCanvas.height - h, end.y - h / 2)),
            w,
            h
          };
          drawLensCanvas();
        } else {
          lensSelection = null;
        }
      } else {
        lensSelection = rect;
      }
    }
    lensDragStart = null;
    if (lensStatus && lensSelection && lensSelection.w > 10 && lensSelection.h > 10) {
      lensStatus.textContent = "baluk.ai • bölge işaretlendi, analizi başlatabilirsin.";
    } else if (lensStatus && isMobileLensViewport()) {
      lensStatus.textContent = "baluk.ai • seçili bölge yok, analizde tüm görsel kullanılacak.";
    }
  });
}
if (lensAnalyzeBtn) {
  lensAnalyzeBtn.addEventListener("click", runLensAnalysis);
}
[accountName, accountGmail, accountPhoto].forEach((field) => {
  if (field) field.addEventListener("input", () => {
    updateAccountPreview();
    saveAccountProfile();
  });
});
if (saveAccount) {
  saveAccount.addEventListener("click", saveAccountProfile);
}
if (premiumClose && premiumModal) {
  premiumClose.addEventListener("click", () => premiumModal.classList.add("hidden"));
}
if (premiumBuyBtn) premiumBuyBtn.addEventListener("click", startPremiumPayment);
if (premiumPayLinkBtn) premiumPayLinkBtn.addEventListener("click", openPremiumPaymentLink);
if (premiumConfirmBtn) premiumConfirmBtn.addEventListener("click", manuallyConfirmPremium);
if (allowProfanityMode) {
  allowProfanityMode.addEventListener("change", () => {
    if (allowProfanityMode.checked && !isPremiumUser) {
      allowProfanityMode.checked = false;
      showWarningOverlay("Küfüre izin ver modu yalnızca Premium için açık.");
      return;
    }
    allowProfanity = allowProfanityMode.checked;
    localStorage.setItem(ALLOW_PROFANITY_STORAGE_KEY, allowProfanity ? "1" : "0");
  });
}
window.addEventListener("focus", tryActivatePremiumFromReturn);
updatePremiumUI();
tryActivatePremiumFromReturn();
if (banUnlockBtn) {
  banUnlockBtn.addEventListener("click", () => {
    if (banPassword && banPassword.value.trim() === "baluk2026") {
      stopBan();
      banPassword.value = "";
    }
  });
}
if (enterAppBtn && introGate && appRoot) {
  const tryStartAmbient = () => startIntroAmbientHum();
  ["pointermove", "keydown", "touchstart", "mousedown"].forEach((evt) => {
    window.addEventListener(evt, tryStartAmbient, { once: true, passive: true });
  });
  startIntroAmbientHum();
  enterAppBtn.addEventListener("click", openAppWithTransition);
}
