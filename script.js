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
// ... kullanıcı tarafından iletilen ilk yarı içeriği burada devam eder ...
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
  const finalText = `Baluk.lens analizi tamamlandı. İşaretlediğin bölge/görsel için 4 güçlü kaynak buldum:\n${links.map((i, idx) => `${idx + 1}) ${i.title} → ${i.link}`).join("\n")}`;
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
  const answerTextBase = `${chooseRandom(webAnswerIntroPrompts)}\n${coreAnswer}\n${chooseRandom(webAnswerOutroPrompts)}`;
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
  master.gain.value = Math.max(0, Math.min(1, Number(volumeValue) / 100)) * 0.12;
  master.connect(bgAudioCtx.destination);
  const oscA = bgAudioCtx.createOscillator();
  const oscB = bgAudioCtx.createOscillator();
  const lfo = bgAudioCtx.createOscillator();
  const lfoGain = bgAudioCtx.createGain();
  oscA.type = preset.wave;
  oscB.type = preset.wave;
  oscA.frequency.value = preset.base;
  oscB.frequency.value = preset.base * 1.5;
  lfo.type = "sine";
  lfo.frequency.value = preset.lfo;
  lfoGain.gain.value = 8;
  lfo.connect(lfoGain);
  lfoGain.connect(oscA.frequency);
  const gainA = bgAudioCtx.createGain();
  const gainB = bgAudioCtx.createGain();
  gainA.gain.value = 0.5;
  gainB.gain.value = 0.25;
  oscA.connect(gainA);
  oscB.connect(gainB);
  gainA.connect(master);
  gainB.connect(master);
  oscA.start(now);
  oscB.start(now);
  lfo.start(now);
  bgAudioNodes = [oscA, oscB, lfo, master, gainA, gainB, lfoGain];
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
  return `${chooseRandom(illegalRefusalPrompts)}\n${chooseRandom(selfHarmSupportPrompts)}`;
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
  return `🧠 Matematik stüdyosu açıklaması:\n${line} ifadesini adım adım çözünce ${result} sonucuna ulaşıyorum. Burada denklem dengesini koruyup bilinmeyeni yalnız bırakıyorum; aritmetik ifadede ise işlem önceliğine göre hesaplıyorum.`;
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
  const botMsg = `🧩 ${shapeLabel} ${result.label} = ${result.value} ${result.unit}\nAdım: ${result.formula}`;
  startChatIfNeeded();
  addMessage(userMsg, "user");
  const thinking = addThinkingBubble("math");
  setTimeout(() => fillThinkingBubble(thinking, botMsg, "İşlem analiz edildi • sonuç hazır ✅"), 3000);
}
// ... (content continues exactly as provided by user second half)
if (enterAppBtn && introGate && appRoot) {
  const tryStartAmbient = () => startIntroAmbientHum();
  ["pointermove", "keydown", "touchstart", "mousedown"].forEach((evt) => {
    window.addEventListener(evt, tryStartAmbient, { once: true, passive: true });
  });
  startIntroAmbientHum();
  enterAppBtn.addEventListener("click", openAppWithTransition);
}
