const THEME_KEY = "minance-theme";
const BALANCE_KEY = "minance-balance";
const HOLDINGS_KEY = "minance-holdings";
const CONTRIBUTION_KEY = "minance-net-contribution";
const USED_CODES_KEY = "minance-used-verification-codes";
const LEVERAGE_BALANCE_KEY = "minance-leverage-balance";
const LEVERAGE_POSITIONS_KEY = "minance-leverage-positions";
const LEVERAGE_CONTRIBUTION_KEY = "minance-leverage-contribution";
const LEVERAGE_UNLOCK_KEY = "minance-leverage-unlocked";
const ALLOWED_CARD_NUMBERS = new Set([
  "098",
  "112",
  "114",
  "121",
  "312",
  "514",
  "545",
  "575",
  "614",
  "645",
  "646",
  "676",
  "878",
  "892",
  "899",
  "989",
]);
const VALID_VERIFICATION_CODES = new Set([
  "2409",
  "7171",
  "8898",
  "6421",
  "2232",
  "8184",
  "8591",
  "6475",
  "1011",
]);
const USD_EXCHANGE_RATE = 41.5;
const LOCAL_CURRENCY_CODE = "GP";
const LOCAL_CURRENCY_LABEL = "G Blokistan";
const AI_RESULT_DELAY_MS = 5000;
const MS_IN_MINUTE = 60000;
const MS_IN_DAY = 24 * 60 * MS_IN_MINUTE;
const AI_PERSONA_KEY = "minance-ai-persona";
const AI_PERSONA_BACKUP_KEY = "minance-ai-persona-backup";
const AI_PLUS_SUBSCRIPTION_KEY = "minance-ai-plus-subscription";
const AI_PLUS_HISTORY_KEY = "minance-ai-plus-history";
const AI_PLUS_PROFILE_KEY = "minance-ai-plus-profile";
const AI_HISTORY_KEY = "minance-ai-recommendations";
const APP_UPDATE_KEY = "minance-app-version";
const APP_VERSION = "2024-06-plus-return";
const AI_PLUS_PRICE = 5000;
const AI_PLUS_BILLING_INTERVAL = Infinity;
const AI_PLUS_REMINDER_WINDOW = 0;
const AI_PLUS_HISTORY_LIMIT = 400;
const AI_PLUS_WELCOME_FLAG = "minance-ai-plus-welcome";
const STOP_LOSS_KEY = "minance-stop-loss";
const PLUS_SETTINGS_KEY = "minance-plus-settings";
const USER_COIN_STORAGE_KEY = "minance-user-coins";
const USER_NEWS_STORAGE_KEY = "minance-user-news";
const USER_DEVICE_ID_STORAGE_KEY = "minance-device-id";
const USER_REQUESTS_STORAGE_KEY = "minance-user-requests";
const USER_REQUEST_LOG_STORAGE_KEY = "minance-user-requests-log";
const USER_REQUESTS_LIMIT = 300;
const USER_REQUEST_LOG_LIMIT = 400;
const PLUS_NEWS_LIMIT = 6;
const PLUS_HISTORY_LIMIT = 120;
const PLUS_TICK_INTERVAL = 15000;
const PRICE_INTERVAL = MS_IN_MINUTE;
const MARKET_EPOCH = Date.UTC(2024, 4, 28, 0, 0, 0);
const MIN_PURCHASE_PRICE = 1;
const MIN_PURCHASE_MESSAGE = `Fiyat 1,00 ${LOCAL_CURRENCY_CODE}'nin altındayken satın alma yapılamaz.`;
const HISTORY_LIMIT = 24 * 60; // 24 hours of minute data
const CHART_TIMEFRAMES = [
  {
    key: "TODAY",
    label: "Bugün",
    minutes: 24 * 60,
    mode: "today",
  },
];
const MAX_CHART_POINTS = 240;
const DETAILED_CHART_POINTS = 720;
const TIMEFRAME_PROFILES = [
  {
    id: "day",
    limitMinutes: 24 * 60,
    chartPoints: 220,
    detailPoints: 440,
  },
  {
    id: "week",
    limitMinutes: 7 * 24 * 60,
    chartPoints: 280,
    detailPoints: 520,
  },
  {
    id: "month",
    limitMinutes: 30 * 24 * 60,
    chartPoints: 340,
    detailPoints: 560,
  },
  {
    id: "multi",
    limitMinutes: 5 * 30 * 24 * 60,
    chartPoints: 420,
    detailPoints: 620,
  },
  {
    id: "year",
    limitMinutes: 365 * 24 * 60,
    chartPoints: 520,
    detailPoints: 680,
  },
  {
    id: "long",
    limitMinutes: Infinity,
    chartPoints: 600,
    detailPoints: 720,
  },
];

let aiPlusSubscription = null;
let aiPlusHistory = [];
let aiPlusProfile = null;
let aiRecommendationHistory = [];
let stopLossConfig = {};
let plusSettings = { theme: "default", music: false, alerts: false };
let aiChatProcessing = false;
let plusReminderToken = 0;
const currentUserId = readOrCreateDeviceId();
let userCoins = [];
let userCoinRequests = [];
let userRequestLog = [];
let plusNewsFeed = [];
let plusTickerId = null;
let aiPersona = null;
let pendingAiTrigger = null;

const PLUS_POSITIVE_NEWS = [
  "Kurucu ekip yeni ortaklık duyurdu",
  "Topluluk oylaması %82 destek verdi",
  "Likidite köprüsü canlıya alındı",
  "Geliştirici hibesi onaylandı",
  "Yeni borsa entegrasyonu tamamlandı",
  "Yükseltme planı sorunsuz geçti",
];

const PLUS_NEGATIVE_NEWS = [
  "Doğrulama süreci gecikti",
  "Toplulukta satış baskısı oluştu",
  "Likidite havuzu küçüldü",
  "Hedeflenen sürüm ertelendi",
  "Piyasa hacmi zayıfladı",
  "Kısa vadeli kâr satışları görüldü",
];

const PLUS_NEUTRAL_NEWS = [
  "Haber bekleniyor, yönsüz seyir",
  "Topluluk geri bildirim topluyor",
  "Günlük bakım penceresi başladı",
  "İşbirliği görüşmeleri sürüyor",
];

const VERIFICATION_DATETIME_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "long",
  timeStyle: "short",
});
const SUBSCRIPTION_DATETIME_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "long",
  timeStyle: "short",
});
const CHAT_TIME_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  hour: "2-digit",
  minute: "2-digit",
});

const pseudoRandomFromSeed = (seed) => {
  let state = seed + 0x6d2b79f5;
  state = Math.imul(state ^ (state >>> 15), state | 1);
  state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
  return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
};

const minuteIndexForTimestamp = (timestamp) => {
  if (timestamp <= MARKET_EPOCH) {
    return 0;
  }
  return Math.max(0, Math.floor((timestamp - MARKET_EPOCH) / PRICE_INTERVAL));
};

function safeParseJSON(value, fallback) {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pickRandom(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function normalizeSymbol(input, fallbackBase) {
  const candidate = (input || fallbackBase || "COIN").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!candidate) {
    return "COIN";
  }
  if (candidate.length <= 4) {
    return candidate;
  }
  return candidate.slice(0, 4);
}

function readOrCreateDeviceId() {
  const existing = localStorage.getItem(USER_DEVICE_ID_STORAGE_KEY);
  if (existing && typeof existing === "string" && existing.trim()) {
    return existing;
  }
  const fresh = crypto.randomUUID?.() || `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(USER_DEVICE_ID_STORAGE_KEY, fresh);
  return fresh;
}

function readStoredUserCoins() {
  const stored = localStorage.getItem(USER_COIN_STORAGE_KEY);
  const parsed = safeParseJSON(stored, []);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.map((coin) => {
    return {
      id: coin.id || crypto.randomUUID?.() || String(Date.now()),
      name: coin.name || "Topluluk Coini",
      symbol: normalizeSymbol(coin.symbol, coin.name),
      description: coin.description || "Topluluk tarafından oluşturuldu.",
      image: coin.image || "",
      volatility: "wild",
      role: coin.role || "core",
      cap: Number.isFinite(coin.cap) ? coin.cap : 1500,
      price: Number.isFinite(coin.price) ? coin.price : 1500,
      basePrice: Number.isFinite(coin.basePrice) ? coin.basePrice : coin.price || 1500,
      history: Array.isArray(coin.history) ? coin.history.slice(-PLUS_HISTORY_LIMIT) : [],
      followers: Number.isFinite(coin.followers) ? coin.followers : 0,
      holders: Number.isFinite(coin.holders) ? coin.holders : 0,
      trades: Number.isFinite(coin.trades) ? coin.trades : 0,
      createdAt: coin.createdAt || Date.now(),
      lastReason: coin.lastReason || "",
      ownerId: coin.ownerId || coin.deviceId || currentUserId,
    };
  });
}

function persistUserCoins() {
  localStorage.setItem(USER_COIN_STORAGE_KEY, JSON.stringify(userCoins));
}

function readStoredUserRequests() {
  const stored = localStorage.getItem(USER_REQUESTS_STORAGE_KEY);
  const parsed = safeParseJSON(stored, []);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed
    .map((request) => {
      return {
        id: request.id || crypto.randomUUID?.() || String(Date.now()),
        name: request.name || "Topluluk Coini",
        symbol: normalizeSymbol(request.symbol, request.name),
        description: request.description || "",
        volatility: request.volatility || "balanced",
        role: request.role || "core",
        cap: Number.isFinite(request.cap) ? request.cap : 1500,
        createdAt: request.createdAt || Date.now(),
        image: request.image || "",
      };
    })
    .slice(-USER_REQUESTS_LIMIT);
}

function persistUserRequests() {
  localStorage.setItem(USER_REQUESTS_STORAGE_KEY, JSON.stringify(userCoinRequests.slice(-USER_REQUESTS_LIMIT)));
}

function readStoredRequestLog() {
  const stored = localStorage.getItem(USER_REQUEST_LOG_STORAGE_KEY);
  const parsed = safeParseJSON(stored, []);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed
    .map((entry) => {
      return {
        id: entry.id || crypto.randomUUID?.() || String(Date.now()),
        message: entry.message || "İstek kaydı",
        timestamp: entry.timestamp || Date.now(),
      };
    })
    .slice(-USER_REQUEST_LOG_LIMIT);
}

function persistRequestLog() {
  localStorage.setItem(USER_REQUEST_LOG_STORAGE_KEY, JSON.stringify(userRequestLog.slice(-USER_REQUEST_LOG_LIMIT)));
}

function readStoredNews() {
  const stored = localStorage.getItem(USER_NEWS_STORAGE_KEY);
  const parsed = safeParseJSON(stored, []);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.slice(-PLUS_NEWS_LIMIT);
}

function persistNews() {
  localStorage.setItem(USER_NEWS_STORAGE_KEY, JSON.stringify(plusNewsFeed.slice(-PLUS_NEWS_LIMIT)));
}

function volatilitySteps(volatility) {
  if (volatility === "calm") {
    return [1, 2];
  }
  if (volatility === "wild") {
    return [1, 2, 3, 4, 5, 6, 7];
  }
  return [1, 2, 3, 4];
}

const getStartOfDayTimestamp = (reference) => {
  const date = new Date(reference);
  date.setHours(0, 0, 0, 0);
  const start = date.getTime();
  return Math.max(start, MARKET_EPOCH);
};

const getEndOfDayTimestamp = (reference) => {
  const start = getStartOfDayTimestamp(reference);
  return start + MS_IN_DAY;
};

const roundToCents = (value) => Math.round(value * 100) / 100;

const COIN_DEFINITIONS = [
  {
    symbol: "KMC",
    name: "Karmic GP Chain",
    summary:
      "556 GP başlangıçlı dengeli büyüme: fiyat her dakika 0,50 veya 1,00 GP adımlarla değişir ve sıfırın altına inmez.",
    initialPrice: 556,
    priceSteps: [0.5, 1],
    indicator: {
      label: "Dengeli",
      tone: "steady",
    },
    ai: {
      colorPreferences: ["green", "yellow"],
      horizonPreferences: ["long"],
      minAmount: 500,
      targetPreferences: ["steady", "slow", "medium"],
      riskTolerance: ["low", "medium"],
      strategyPreferences: ["stability", "momentum"],
      rolePreferences: ["core", "shield"],
      sectorFocus: ["infrastructure"],
      liquidityProfile: "calm",
      innovationProfile: ["classic"],
      risk: "Düşük risk, dengeli hareket",
      description: "Uzun vadede istikrarlı büyüme arayan portföyler için güvenli liman.",
    },
  },
  {
    symbol: "LHM",
    name: "Lightning Hyper GP",
    summary:
      "1343 GP tabanlı yüksek hız: her dakika 2, 3, 4 veya 5 GP artış ya da düşüşle agresif dalgalanır.",
    initialPrice: 1343,
    priceSteps: [2, 3, 4, 5],
    indicator: {
      label: "Yüksek hız",
      tone: "surge",
    },
    ai: {
      colorPreferences: ["red", "yellow"],
      horizonPreferences: ["short"],
      minAmount: 100,
      maxAmount: 2000,
      targetPreferences: ["flash", "fast"],
      riskTolerance: ["medium", "high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["energy"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Yüksek risk, agresif dalgalanma",
      description: "Dakikalık fırsatları kovalayan, hızlı giriş çıkış yapan yatırımcılar için.",
    },
  },
  {
    symbol: "AVC",
    name: "Apex Vision Coin",
    summary:
      "1180 GP başlangıçlı dengeli ivme: her dakika 0,25 ile 0,75 GP arası salınım yaparak sakin büyür.",
    initialPrice: 1180,
    priceSteps: [0.25, 0.5, 0.75],
    indicator: {
      label: "Dengeli ivme",
      tone: "steady",
    },
    ai: {
      colorPreferences: ["green", "yellow"],
      horizonPreferences: ["long"],
      minAmount: 250,
      targetPreferences: ["medium", "slow"],
      riskTolerance: ["low", "medium"],
      strategyPreferences: ["stability", "momentum"],
      rolePreferences: ["core"],
      sectorFocus: ["infrastructure", "finance"],
      liquidityProfile: "calm",
      innovationProfile: ["classic", "hybrid"],
      risk: "Düşük risk, dengeli ivme",
      description: "Uzun vadede kontrollü büyüme isteyen portföyler için yumuşak dalgalanma sunar.",
    },
  },
  {
    symbol: "NXC",
    name: "Neon Flux Coin",
    summary:
      "1795 GP başlangıçlı agresif enerji: her dakika 3, 4, 5 veya 6 GP sıçrayarak yoğun volatilite sunar.",
    initialPrice: 1795,
    priceSteps: [3, 4, 5, 6],
    indicator: {
      label: "Alev dalgası",
      tone: "surge",
    },
    ai: {
      colorPreferences: ["red"],
      horizonPreferences: ["short"],
      minAmount: 150,
      maxAmount: 1600,
      targetPreferences: ["flash", "fast"],
      riskTolerance: ["high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["ai", "energy"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Çok yüksek risk, yoğun hareket",
      description: "Hızlı fırsatları kovalayan ve keskin tepkiler arayan yatırımcılar için elektrikli bir seçenek.",
    },
  },
  {
    symbol: "QRC",
    name: "Quartz Rise Coin",
    summary:
      "1045 GP tabanlı düzenli yükseliş: dakikada 0,50, 0,75 ya da 1,00 GP hareketlerle sağlam ilerler.",
    initialPrice: 1045,
    priceSteps: [0.5, 0.75, 1],
    indicator: {
      label: "Sakin yükseliş",
      tone: "steady",
    },
    ai: {
      colorPreferences: ["green"],
      horizonPreferences: ["long"],
      minAmount: 200,
      targetPreferences: ["slow", "steady", "medium"],
      riskTolerance: ["low", "medium"],
      strategyPreferences: ["stability"],
      rolePreferences: ["core", "shield"],
      sectorFocus: ["finance", "infrastructure"],
      liquidityProfile: "calm",
      innovationProfile: ["classic"],
      risk: "Düşük risk, sabırlı büyüme",
      description: "Portföyde çekirdek taşıyıcı arayanlar için kontrollü ve tahmin edilebilir bir ritim sunar.",
    },
  },
  {
    symbol: "STC",
    name: "StormTrack Coin",
    summary:
      "1680 GP fırtına modu: her dakika 4, 5, 6 veya 7 GP değişerek keskin kırılımlar yaratır.",
    initialPrice: 1680,
    priceSteps: [4, 5, 6, 7],
    indicator: {
      label: "Fırtına modu",
      tone: "surge",
    },
    ai: {
      colorPreferences: ["red"],
      horizonPreferences: ["short"],
      minAmount: 200,
      maxAmount: 1800,
      targetPreferences: ["flash", "fast"],
      riskTolerance: ["high"],
      strategyPreferences: ["momentum", "rebound"],
      rolePreferences: ["booster"],
      sectorFocus: ["energy"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Çok yüksek risk, fırtınalı dalga",
      description: "Günün hareketini yakalamak isteyen hızlı karar alıcılar için heyecan verici bir rota.",
    },
  },
  {
    symbol: "MGC",
    name: "Momentum Glide Coin",
    summary:
      "1325 GP başlangıçlı ritimli büyüme: her dakika 1,00 ile 2,00 GP arası adımlarla ivmesini korur.",
    initialPrice: 1325,
    priceSteps: [1, 1.5, 2],
    indicator: {
      label: "Ritimli büyüme",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["yellow", "green"],
      horizonPreferences: ["long", "short"],
      minAmount: 150,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium"],
      strategyPreferences: ["momentum", "stability"],
      rolePreferences: ["booster", "core"],
      sectorFocus: ["ai", "community"],
      liquidityProfile: "balanced",
      innovationProfile: ["hybrid"],
      risk: "Orta risk, kontrollü momentum",
      description: "Hem orta vadeli stratejiler hem de kademeli eklemeler için dengeli dalga sağlar.",
    },
  },
  {
    symbol: "DRC",
    name: "Dynamo Rush Coin",
    summary:
      "1910 GP tabanlı şok hız: dakikada 3,50, 4,50 ya da 5,50 GP sıçrayarak adrenalin dolu hareket sunar.",
    initialPrice: 1910,
    priceSteps: [3.5, 4.5, 5.5],
    indicator: {
      label: "Şok hız",
      tone: "surge",
    },
    ai: {
      colorPreferences: ["red"],
      horizonPreferences: ["short"],
      minAmount: 250,
      maxAmount: 1800,
      targetPreferences: ["flash", "fast"],
      riskTolerance: ["high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["energy"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Çok yüksek risk, ani kırılımlar",
      description: "Kısa vadeli risk yönetimine güvenenler için güçlü enerji patlamaları sağlar.",
    },
  },
  {
    symbol: "EPC",
    name: "Eclipse Prime Coin",
    summary:
      "1505 GP başlangıçlı gölge akışı: her dakika 1,50, 2,00, 2,50 veya 3,00 GP hareketle adaptif kalır.",
    initialPrice: 1505,
    priceSteps: [1.5, 2, 2.5, 3],
    indicator: {
      label: "Gölge akışı",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["yellow"],
      horizonPreferences: ["short", "long"],
      minAmount: 120,
      maxAmount: 1900,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium"],
      strategyPreferences: ["momentum", "rebound"],
      rolePreferences: ["booster", "core"],
      sectorFocus: ["ai"],
      liquidityProfile: "balanced",
      innovationProfile: ["hybrid", "experimental"],
      risk: "Orta risk, esnek ivme",
      description: "Trend değişimlerini sezgisel takip etmek isteyen dengeli yatırımcılar için çok yönlüdür.",
    },
  },
  {
    symbol: "VLC",
    name: "Vortex Leap Coin",
    summary:
      "1725 GP teknolojik momentum: dakikada 2,00, 2,50 ya da 3,00 GP adımlarla çevik dönüşler yapar.",
    initialPrice: 1725,
    priceSteps: [2, 2.5, 3],
    indicator: {
      label: "Tekno momentum",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["green", "yellow"],
      horizonPreferences: ["short"],
      minAmount: 180,
      maxAmount: 2000,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium", "high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["ai", "infrastructure"],
      liquidityProfile: "balanced",
      innovationProfile: ["hybrid"],
      risk: "Orta-yüksek risk, teknolojik momentum",
      description: "Yüksek teknoloji senaryolarına inanan ve çevik dönüşler isteyen yatırımcılar için parlak bir seçenek.",
    },
  },
  {
    symbol: "HBC",
    name: "Harmonic Base Coin",
    summary:
      "1090 GP çekirdek denge: her dakika 0,50, 0,75 veya 1,00 GP adımlarla istikrarını sürdürür.",
    initialPrice: 1090,
    priceSteps: [0.5, 0.75, 1],
    indicator: {
      label: "Çekirdek denge",
      tone: "steady",
    },
    ai: {
      colorPreferences: ["green"],
      horizonPreferences: ["long"],
      minAmount: 180,
      targetPreferences: ["slow", "steady"],
      riskTolerance: ["low"],
      strategyPreferences: ["stability"],
      rolePreferences: ["core", "shield"],
      sectorFocus: ["finance"],
      liquidityProfile: "calm",
      innovationProfile: ["classic"],
      risk: "Düşük risk, temel denge",
      description: "Portföyde istikrar köşesi arayan yatırımcılar için güvenilir bir seçenek.",
    },
  },
  {
    symbol: "ORC",
    name: "Orbit Resonance Coin",
    summary:
      "1980 GP yörünge atılımı: dakikada 2,50, 3,50, 4,50 veya 5,50 GP ile geniş salınımlar yapar.",
    initialPrice: 1980,
    priceSteps: [2.5, 3.5, 4.5, 5.5],
    indicator: {
      label: "Yörünge atılımı",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["yellow", "red"],
      horizonPreferences: ["short", "long"],
      minAmount: 220,
      maxAmount: 2000,
      targetPreferences: ["fast", "flash", "medium"],
      riskTolerance: ["medium", "high"],
      strategyPreferences: ["momentum", "rebound"],
      rolePreferences: ["booster"],
      sectorFocus: ["energy", "community"],
      liquidityProfile: "surge",
      innovationProfile: ["hybrid"],
      risk: "Yüksek risk, geniş salınım",
      description: "Dalga yakalama stratejilerine odaklanan yatırımcılar için çok katmanlı fırsatlar sunar.",
    },
  },
  {
    symbol: "ARC",
    name: "Aurora Relay Coin",
    summary:
      "1150 GP altyapı köprüsü: dakikada 0,60, 0,80 ya da 1,20 GP adımıyla sakin yükseliş izler.",
    initialPrice: 1150,
    priceSteps: [0.6, 0.8, 1.2],
    indicator: {
      label: "Aurora dengesi",
      tone: "steady",
    },
    ai: {
      colorPreferences: ["green", "yellow"],
      horizonPreferences: ["long"],
      minAmount: 220,
      targetPreferences: ["medium", "steady"],
      riskTolerance: ["low"],
      strategyPreferences: ["stability"],
      rolePreferences: ["core", "shield"],
      sectorFocus: ["infrastructure"],
      liquidityProfile: "calm",
      innovationProfile: ["classic"],
      risk: "Düşük risk, altyapı odaklı",
      description: "Temel ağlara yatırım yaparak uzun vadeli büyüme bekleyenler için sükunetli bir seçenek.",
    },
  },
  {
    symbol: "BLC",
    name: "Blaze Line Coin",
    summary:
      "1820 GP enerji kıvılcımı: her dakika 3, 4 veya 5 GP sıçrayarak agresif kırılmalar üretir.",
    initialPrice: 1820,
    priceSteps: [3, 4, 5],
    indicator: {
      label: "Kıvılcım atağı",
      tone: "surge",
    },
    ai: {
      colorPreferences: ["red", "yellow"],
      horizonPreferences: ["short"],
      minAmount: 180,
      maxAmount: 1900,
      targetPreferences: ["flash", "fast"],
      riskTolerance: ["high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["energy"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Çok yüksek risk, alevli dalga",
      description: "Dakikalar içinde sonuç almak isteyen, risk yönetimi kuvvetli yatırımcılar için geliştirildi.",
    },
  },
  {
    symbol: "CXC",
    name: "Cypher Axis Coin",
    summary:
      "1380 GP veri akışı: dakikada 1,00, 1,50 ya da 2,00 GP hareketle çevik tepki verir.",
    initialPrice: 1380,
    priceSteps: [1, 1.5, 2],
    indicator: {
      label: "Şifre akışı",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["yellow", "green"],
      horizonPreferences: ["short", "long"],
      minAmount: 160,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium"],
      strategyPreferences: ["momentum", "rebound"],
      rolePreferences: ["booster", "core"],
      sectorFocus: ["ai"],
      liquidityProfile: "balanced",
      innovationProfile: ["hybrid"],
      risk: "Orta risk, veri odaklı",
      description: "Yapay zekâ temalı trendleri takip ederek tempolu ancak kontrol edilebilir dalga arayanlara uygundur.",
    },
  },
  {
    symbol: "DTC",
    name: "Drift Tempo Coin",
    summary:
      "1490 GP tempo izi: dakikada 1,20, 1,50 veya 1,80 GP değişimle ritmini korur.",
    initialPrice: 1490,
    priceSteps: [1.2, 1.5, 1.8],
    indicator: {
      label: "Tempo izi",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["yellow"],
      horizonPreferences: ["long"],
      minAmount: 140,
      targetPreferences: ["medium", "slow"],
      riskTolerance: ["medium"],
      strategyPreferences: ["stability"],
      rolePreferences: ["core"],
      sectorFocus: ["community", "infrastructure"],
      liquidityProfile: "balanced",
      innovationProfile: ["classic", "hybrid"],
      risk: "Orta risk, ritimli seyir",
      description: "Topluluk projelerinde süreklilik arayan ve kademeli kazançtan hoşlananlar için idealdir.",
    },
  },
  {
    symbol: "EXC",
    name: "Echo Nexus Coin",
    summary:
      "1705 GP yankı ağı: dakikada 2, 3 ya da 4 GP sıçrayarak hız ile istikrarı harmanlar.",
    initialPrice: 1705,
    priceSteps: [2, 3, 4],
    indicator: {
      label: "Yankı modu",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["yellow", "red"],
      horizonPreferences: ["short"],
      minAmount: 190,
      maxAmount: 1950,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium", "high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["ai", "energy"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Yüksek risk, rezonanslı hareket",
      description: "Yeni nesil veri merkezli uygulamaların volatilesinden faydalanmak isteyenler içindir.",
    },
  },
  {
    symbol: "FLC",
    name: "Flux Ladder Coin",
    summary:
      "1275 GP akış merdiveni: dakikada 0,75, 1,00 veya 1,25 GP kademeyle ilerler.",
    initialPrice: 1275,
    priceSteps: [0.75, 1, 1.25],
    indicator: {
      label: "Akış katmanı",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["green", "yellow"],
      horizonPreferences: ["long"],
      minAmount: 180,
      targetPreferences: ["medium", "slow"],
      riskTolerance: ["low", "medium"],
      strategyPreferences: ["stability", "momentum"],
      rolePreferences: ["core", "booster"],
      sectorFocus: ["infrastructure"],
      liquidityProfile: "balanced",
      innovationProfile: ["classic"],
      risk: "Orta risk, düzenli merdiven",
      description: "Sistematik büyüme planlayan ve pozisyonlarını kademeli artırmak isteyen yatırımcılara göredir.",
    },
  },
  {
    symbol: "GPC",
    name: "Gravity Pulse Coin",
    summary:
      "1620 GP çekim alanı: dakikada 2,00, 2,50 ya da 3,00 GP hareketle momentum dalgaları yaratır.",
    initialPrice: 1620,
    priceSteps: [2, 2.5, 3],
    indicator: {
      label: "Çekim darbesi",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["yellow"],
      horizonPreferences: ["short", "long"],
      minAmount: 200,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["infrastructure", "finance"],
      liquidityProfile: "balanced",
      innovationProfile: ["hybrid"],
      risk: "Orta risk, çekim etkisi",
      description: "Likidite kanalları ile teknolojiyi birleştiren projelerde kısa-orta vadeli fırsat arayanlara hitap eder.",
    },
  },
  {
    symbol: "HVC",
    name: "Horizon Vector Coin",
    summary:
      "1205 GP ufuk vektörü: dakikada 0,40, 0,60 ya da 0,80 GP ile stabil kalır.",
    initialPrice: 1205,
    priceSteps: [0.4, 0.6, 0.8],
    indicator: {
      label: "Ufuk hattı",
      tone: "steady",
    },
    ai: {
      colorPreferences: ["green"],
      horizonPreferences: ["long"],
      minAmount: 210,
      targetPreferences: ["slow", "steady"],
      riskTolerance: ["low"],
      strategyPreferences: ["stability"],
      rolePreferences: ["core", "shield"],
      sectorFocus: ["infrastructure"],
      liquidityProfile: "calm",
      innovationProfile: ["classic"],
      risk: "Düşük risk, ufuk dengesi",
      description: "Uzun vadeli yatırımcıların portföy stabilitesine katkı sağlamak için tasarlanmıştır.",
    },
  },
  {
    symbol: "ILC",
    name: "Ion Lattice Coin",
    summary:
      "1755 GP iyon ağı: dakikada 2,50, 3,00 ya da 3,50 GP sıçrayarak enerji üretir.",
    initialPrice: 1755,
    priceSteps: [2.5, 3, 3.5],
    indicator: {
      label: "İyon ağı",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["red"],
      horizonPreferences: ["short"],
      minAmount: 170,
      maxAmount: 1950,
      targetPreferences: ["flash", "fast"],
      riskTolerance: ["high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["energy"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Yüksek risk, iyonik ivme",
      description: "Enerji projelerindeki sert dalgalardan hızla yararlanmak isteyenler için güçlüdür.",
    },
  },
  {
    symbol: "JRC",
    name: "Juniper Rush Coin",
    summary:
      "1410 GP topluluk dalgası: dakikada 1,00, 1,20 veya 1,60 GP adımıyla hareket eder.",
    initialPrice: 1410,
    priceSteps: [1, 1.2, 1.6],
    indicator: {
      label: "Topluluk ritmi",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["yellow", "green"],
      horizonPreferences: ["long"],
      minAmount: 150,
      targetPreferences: ["medium", "slow"],
      riskTolerance: ["medium"],
      strategyPreferences: ["rebound", "stability"],
      rolePreferences: ["core"],
      sectorFocus: ["community"],
      liquidityProfile: "balanced",
      innovationProfile: ["hybrid"],
      risk: "Orta risk, topluluk ivmesi",
      description: "Organik topluluk büyümesini bekleyen ve dengeli getiriden memnun olan kullanıcılar için.",
    },
  },
  {
    symbol: "KLC",
    name: "Kaleido Loop Coin",
    summary:
      "1560 GP halka akışı: dakikada 1,80, 2,20 veya 2,60 GP ile döngüsel momentum sağlar.",
    initialPrice: 1560,
    priceSteps: [1.8, 2.2, 2.6],
    indicator: {
      label: "Kaleido döngüsü",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["yellow", "red"],
      horizonPreferences: ["short"],
      minAmount: 200,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["ai", "community"],
      liquidityProfile: "balanced",
      innovationProfile: ["hybrid", "experimental"],
      risk: "Orta-yüksek risk, döngüsel ivme",
      description: "Renkli veri projelerinde hareketli ama öngörülebilir döngüler arayanlar için.",
    },
  },
  {
    symbol: "LVC",
    name: "Lumen Vault Coin",
    summary:
      "1875 GP ışık kasası: dakikada 3,00, 4,00 ya da 5,00 GP sıçrayarak parlak fırsatlar üretir.",
    initialPrice: 1875,
    priceSteps: [3, 4, 5],
    indicator: {
      label: "Lümen atağı",
      tone: "surge",
    },
    ai: {
      colorPreferences: ["red"],
      horizonPreferences: ["short"],
      minAmount: 250,
      maxAmount: 2000,
      targetPreferences: ["flash", "fast"],
      riskTolerance: ["high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["energy", "finance"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Çok yüksek risk, ışık patlaması",
      description: "Likiditeyi enerji projelerine aktarırken ani yükselişlerden faydalanmak isteyenler için cesur bir tercih.",
    },
  },
  {
    symbol: "MTC",
    name: "Magneto Track Coin",
    summary:
      "1315 GP mıknatıs izi: dakikada 0,90, 1,10 veya 1,30 GP ile orta tempolu ilerler.",
    initialPrice: 1315,
    priceSteps: [0.9, 1.1, 1.3],
    indicator: {
      label: "Mıknatıs izi",
      tone: "steady",
    },
    ai: {
      colorPreferences: ["green"],
      horizonPreferences: ["long"],
      minAmount: 170,
      targetPreferences: ["medium", "slow"],
      riskTolerance: ["low", "medium"],
      strategyPreferences: ["stability", "momentum"],
      rolePreferences: ["core"],
      sectorFocus: ["infrastructure"],
      liquidityProfile: "balanced",
      innovationProfile: ["classic"],
      risk: "Düşük risk, mıknatıs dengesi",
      description: "Orta hızda büyümeyi tercih eden ve portföy çekirdeğini güçlendirmek isteyenlere uygundur.",
    },
  },
  {
    symbol: "NRC",
    name: "Nova Ridge Coin",
    summary:
      "1665 GP nova sırtı: dakikada 2,20, 2,80 veya 3,40 GP ile geniş bantta hareket eder.",
    initialPrice: 1665,
    priceSteps: [2.2, 2.8, 3.4],
    indicator: {
      label: "Nova yolu",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["yellow"],
      horizonPreferences: ["short", "long"],
      minAmount: 200,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium"],
      strategyPreferences: ["momentum", "rebound"],
      rolePreferences: ["booster"],
      sectorFocus: ["energy", "community"],
      liquidityProfile: "surge",
      innovationProfile: ["hybrid"],
      risk: "Orta-yüksek risk, nova ivmesi",
      description: "Topluluk destekli enerji projelerinde orta vadeli fırsat kovalayanlar için esnektir.",
    },
  },
  {
    symbol: "OPC",
    name: "Orbit Pulse Coin",
    summary:
      "1445 GP yörünge nabzı: dakikada 1,10, 1,30 veya 1,70 GP adımıyla çevik manevra yapar.",
    initialPrice: 1445,
    priceSteps: [1.1, 1.3, 1.7],
    indicator: {
      label: "Yörünge nabzı",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["yellow", "green"],
      horizonPreferences: ["long"],
      minAmount: 150,
      targetPreferences: ["medium", "slow"],
      riskTolerance: ["medium"],
      strategyPreferences: ["stability", "rebound"],
      rolePreferences: ["core"],
      sectorFocus: ["infrastructure", "community"],
      liquidityProfile: "balanced",
      innovationProfile: ["classic", "hybrid"],
      risk: "Orta risk, yörünge dengesi",
      description: "Topluluk temelli altyapı girişimlerinde sakin ancak fırsatçı hareket isteyenler içindir.",
    },
  },
  {
    symbol: "PRC",
    name: "Pulse Reef Coin",
    summary:
      "1535 GP mercan darbesi: dakikada 1,50, 1,80 veya 2,10 GP ile nefes alan bir ritme sahiptir.",
    initialPrice: 1535,
    priceSteps: [1.5, 1.8, 2.1],
    indicator: {
      label: "Mercan darbesi",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["yellow"],
      horizonPreferences: ["short", "long"],
      minAmount: 160,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster", "core"],
      sectorFocus: ["community", "energy"],
      liquidityProfile: "balanced",
      innovationProfile: ["hybrid"],
      risk: "Orta risk, mercan akışı",
      description: "Enerji topluluklarında canlı ama kontrol edilebilir fırsat arayanlara uygundur.",
    },
  },
  {
    symbol: "QLC",
    name: "Quantum Lace Coin",
    summary:
      "1905 GP kuantum ağı: dakikada 3,20, 3,60 veya 4,20 GP hareketle dinamik kalır.",
    initialPrice: 1905,
    priceSteps: [3.2, 3.6, 4.2],
    indicator: {
      label: "Kuantum dokusu",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["red", "yellow"],
      horizonPreferences: ["short"],
      minAmount: 240,
      maxAmount: 2000,
      targetPreferences: ["flash", "fast"],
      riskTolerance: ["high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["ai", "finance"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Çok yüksek risk, kuantum atılım",
      description: "Yüksek teknoloji projelerinde yoğun volatiliteye hazır agresif yatırımcılar için.",
    },
  },
  {
    symbol: "RVC",
    name: "Rivera Velocity Coin",
    summary:
      "1365 GP akarsu hızı: dakikada 0,80, 1,00 veya 1,40 GP ile akışkan ilerler.",
    initialPrice: 1365,
    priceSteps: [0.8, 1, 1.4],
    indicator: {
      label: "Nehir hızı",
      tone: "steady",
    },
    ai: {
      colorPreferences: ["green", "yellow"],
      horizonPreferences: ["long"],
      minAmount: 190,
      targetPreferences: ["medium", "slow"],
      riskTolerance: ["low", "medium"],
      strategyPreferences: ["stability"],
      rolePreferences: ["core", "shield"],
      sectorFocus: ["community", "finance"],
      liquidityProfile: "calm",
      innovationProfile: ["classic"],
      risk: "Düşük risk, nehir akışı",
      description: "Topluluk projelerinde istikrarlı nakit akışı arayan yatırımcılar için güvenli limandır.",
    },
  },
  {
    symbol: "SXC",
    name: "Sonic Cross Coin",
    summary:
      "1785 GP ses ötesi: dakikada 4,00, 5,00 veya 6,00 GP ile yüksek frekanslı atak yapar.",
    initialPrice: 1785,
    priceSteps: [4, 5, 6],
    indicator: {
      label: "Ses dalgası",
      tone: "surge",
    },
    ai: {
      colorPreferences: ["red"],
      horizonPreferences: ["short"],
      minAmount: 220,
      maxAmount: 1900,
      targetPreferences: ["flash"],
      riskTolerance: ["high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["ai", "energy"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Çok yüksek risk, ses ötesi hız",
      description: "Kısa vadede maksimum dalga arayan ve volatiliteden çekinmeyen kullanıcılar için tasarlandı.",
    },
  },
  {
    symbol: "TTC",
    name: "Titan Trace Coin",
    summary:
      "1460 GP titan izi: dakikada 1,20, 1,40 veya 1,80 GP ile iz bırakır.",
    initialPrice: 1460,
    priceSteps: [1.2, 1.4, 1.8],
    indicator: {
      label: "Titan izi",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["yellow"],
      horizonPreferences: ["long"],
      minAmount: 180,
      targetPreferences: ["medium", "slow"],
      riskTolerance: ["medium"],
      strategyPreferences: ["stability", "momentum"],
      rolePreferences: ["core"],
      sectorFocus: ["infrastructure", "energy"],
      liquidityProfile: "balanced",
      innovationProfile: ["classic", "hybrid"],
      risk: "Orta risk, titan dengesi",
      description: "Enerji altyapısında kademeli büyüme arayan portföyler için güçlü bir taş.",
    },
  },
  {
    symbol: "UPC",
    name: "Ultra Prism Coin",
    summary:
      "1950 GP prizma etkisi: dakikada 3,50, 4,50 veya 5,50 GP ile yüksek enerjili sıçramalar yapar.",
    initialPrice: 1950,
    priceSteps: [3.5, 4.5, 5.5],
    indicator: {
      label: "Prizma enerjisi",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["red", "yellow"],
      horizonPreferences: ["short"],
      minAmount: 260,
      maxAmount: 2000,
      targetPreferences: ["flash", "fast"],
      riskTolerance: ["high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["ai", "finance"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Çok yüksek risk, prizmatik dalga",
      description: "Yüksek enerji projelerinde ultra hızlı tepki vermek isteyen yatırımcılara hitap eder.",
    },
  },
  {
    symbol: "VRC",
    name: "Vera Rise Coin",
    summary:
      "1340 GP güven katmanı: dakikada 0,70, 0,90 veya 1,10 GP ile yumuşak yükseliş sunar.",
    initialPrice: 1340,
    priceSteps: [0.7, 0.9, 1.1],
    indicator: {
      label: "Güven katmanı",
      tone: "steady",
    },
    ai: {
      colorPreferences: ["green"],
      horizonPreferences: ["long"],
      minAmount: 200,
      targetPreferences: ["slow", "steady"],
      riskTolerance: ["low"],
      strategyPreferences: ["stability"],
      rolePreferences: ["core", "shield"],
      sectorFocus: ["finance"],
      liquidityProfile: "calm",
      innovationProfile: ["classic"],
      risk: "Düşük risk, güvenli yükseliş",
      description: "Fonlarını korumak isteyenler için çekirdek taş görevi gören sakin coin.",
    },
  },
  {
    symbol: "WLC",
    name: "Wave Layer Coin",
    summary:
      "1690 GP dalga katmanı: dakikada 2,20, 2,60 veya 3,00 GP ile katmanlı hareket oluşturur.",
    initialPrice: 1690,
    priceSteps: [2.2, 2.6, 3],
    indicator: {
      label: "Dalga katmanı",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["yellow"],
      horizonPreferences: ["short", "long"],
      minAmount: 210,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium"],
      strategyPreferences: ["momentum", "rebound"],
      rolePreferences: ["booster", "core"],
      sectorFocus: ["community", "energy"],
      liquidityProfile: "balanced",
      innovationProfile: ["hybrid"],
      risk: "Orta risk, dalga katmanı",
      description: "Topluluk enerjisini dalga dalga kullanan projelerde dengeli kazanç arayanlara uygundur.",
    },
  },
  {
    symbol: "XRC",
    name: "Xeno Relay Coin",
    summary:
      "1850 GP xeno aktarımı: dakikada 3,00, 3,80 veya 4,40 GP ile agresif büyür.",
    initialPrice: 1850,
    priceSteps: [3, 3.8, 4.4],
    indicator: {
      label: "Xeno aktarımı",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["red"],
      horizonPreferences: ["short"],
      minAmount: 230,
      maxAmount: 1950,
      targetPreferences: ["flash", "fast"],
      riskTolerance: ["high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["ai"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Çok yüksek risk, xeno hız",
      description: "Yapay zekâ destekli hız yarışında yer almak isteyen deneyimli traderlar için.",
    },
  },
  {
    symbol: "YPC",
    name: "Yield Prism Coin",
    summary:
      "1255 GP getiri prizması: dakikada 0,60, 0,80 veya 1,00 GP ile temkinli büyür.",
    initialPrice: 1255,
    priceSteps: [0.6, 0.8, 1],
    indicator: {
      label: "Getiri prizması",
      tone: "steady",
    },
    ai: {
      colorPreferences: ["green"],
      horizonPreferences: ["long"],
      minAmount: 170,
      targetPreferences: ["slow", "steady"],
      riskTolerance: ["low"],
      strategyPreferences: ["stability"],
      rolePreferences: ["core"],
      sectorFocus: ["finance"],
      liquidityProfile: "calm",
      innovationProfile: ["classic"],
      risk: "Düşük risk, temkinli getiri",
      description: "Getirisini güvenle artırmak isteyen yatırımcıların cüzdan kartı.",
    },
  },
  {
    symbol: "ZTC",
    name: "Zenith Trail Coin",
    summary:
      "1740 GP zirve izi: dakikada 2,40, 2,80 veya 3,20 GP ile yukarı yönlü patikalar çizer.",
    initialPrice: 1740,
    priceSteps: [2.4, 2.8, 3.2],
    indicator: {
      label: "Zirve izi",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["yellow", "red"],
      horizonPreferences: ["short"],
      minAmount: 210,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium", "high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["energy", "ai"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Yüksek risk, zirve avcısı",
      description: "Enerji ve yapay zekâ ortaklığında üst bant arayan hız tutkunlarına uygundur.",
    },
  },
  {
    symbol: "ADC",
    name: "Aero Drift Coin",
    summary:
      "1395 GP aero kayması: dakikada 0,90, 1,10 veya 1,50 GP ile zarif dönüşler yapar.",
    initialPrice: 1395,
    priceSteps: [0.9, 1.1, 1.5],
    indicator: {
      label: "Aero kayması",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["yellow"],
      horizonPreferences: ["long"],
      minAmount: 160,
      targetPreferences: ["medium", "slow"],
      riskTolerance: ["medium"],
      strategyPreferences: ["stability", "rebound"],
      rolePreferences: ["core", "booster"],
      sectorFocus: ["infrastructure"],
      liquidityProfile: "balanced",
      innovationProfile: ["classic", "hybrid"],
      risk: "Orta risk, aero denge",
      description: "Havacılık temalı projelerde kademeli büyüme arayan yatırımcılar için zarif bir çözüm.",
    },
  },
  {
    symbol: "BVC",
    name: "Beryllium Vector Coin",
    summary:
      "1885 GP beryllium vektörü: dakikada 3,20, 3,80 ya da 4,60 GP ile keskin dönüşler yapar.",
    initialPrice: 1885,
    priceSteps: [3.2, 3.8, 4.6],
    indicator: {
      label: "Vektör atağı",
      tone: "surge",
    },
    ai: {
      colorPreferences: ["red"],
      horizonPreferences: ["short"],
      minAmount: 230,
      maxAmount: 2000,
      targetPreferences: ["flash"],
      riskTolerance: ["high"],
      strategyPreferences: ["momentum"],
      rolePreferences: ["booster"],
      sectorFocus: ["energy", "ai"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Çok yüksek risk, vektörel enerji",
      description: "Metal ve enerji bileşimini kullanan hızlı projelerden maksimum fayda sağlamak isteyenlere hitap eder.",
    },
  },
  {
    symbol: "CLC",
    name: "Celestial Loop Coin",
    summary:
      "1430 GP göksel döngü: dakikada 1,00, 1,30 veya 1,60 GP ile uyumlu dalgalar üretir.",
    initialPrice: 1430,
    priceSteps: [1, 1.3, 1.6],
    indicator: {
      label: "Göksel döngü",
      tone: "pulse",
    },
    ai: {
      colorPreferences: ["green", "yellow"],
      horizonPreferences: ["long"],
      minAmount: 150,
      targetPreferences: ["medium", "slow"],
      riskTolerance: ["low", "medium"],
      strategyPreferences: ["stability", "rebound"],
      rolePreferences: ["core"],
      sectorFocus: ["community", "infrastructure"],
      liquidityProfile: "balanced",
      innovationProfile: ["classic", "hybrid"],
      risk: "Düşük risk, göksel ritim",
      description: "Sanatsal ve kültürel projelerde sakin dalga arayan portföyler için tasarlandı.",
    },
  },
  {
    symbol: "DQC",
    name: "Dual Quanta Coin",
    summary:
      "1765 GP çifte kuanta: dakikada 2,60, 3,00 veya 3,60 GP ile çift yönlü momentum sağlar.",
    initialPrice: 1765,
    priceSteps: [2.6, 3, 3.6],
    indicator: {
      label: "Kuanta yolu",
      tone: "glow",
    },
    ai: {
      colorPreferences: ["yellow", "red"],
      horizonPreferences: ["short"],
      minAmount: 210,
      targetPreferences: ["fast", "medium"],
      riskTolerance: ["medium", "high"],
      strategyPreferences: ["momentum", "rebound"],
      rolePreferences: ["booster"],
      sectorFocus: ["ai", "finance"],
      liquidityProfile: "surge",
      innovationProfile: ["experimental"],
      risk: "Yüksek risk, çift kuanta",
      description: "Finansal yapay zekâ uygulamalarında hem yükseliş hem de geri dönüş fırsatı arayanlara uygundur.",
    },
  },
];

const coinConfigs = new Map();
const coinStates = new Map();
const timelineCaches = new Map();
const coinsDirectory = [];
let coinsSortKey = "change";
let coinsFilterKey = "all";
let coinsSearchQuery = "";
let coinsSyncScheduled = false;
const INDICATOR_TONE_CLASS_MAP = {
  steady: "is-steady",
  surge: "is-surge",
  pulse: "is-pulse",
  glow: "is-glow",
};
const COLOR_LABELS = {
  green: "yeşil",
  yellow: "sarı",
  red: "kırmızı",
};
const HORIZON_LABELS = {
  short: "kısa vade",
  long: "uzun vade",
};
const RISK_LABELS = {
  low: "düşük risk",
  medium: "orta risk",
  high: "yüksek risk",
};
const STRATEGY_LABELS = {
  momentum: "trendi sür",
  rebound: "dipten yakala",
  stability: "dengeli kal",
};
const ROLE_LABELS = {
  core: "çekirdek taş",
  booster: "hızlandırıcı",
  shield: "koruyucu",
};
const SECTOR_LABELS = {
  infrastructure: "altyapı",
  ai: "yapay zekâ",
  community: "topluluk",
  energy: "enerji",
  finance: "finans",
};
const LIQUIDITY_LABELS = {
  calm: "sakin akış",
  balanced: "dengeli bant",
  surge: "yüksek hacim",
};
const INNOVATION_LABELS = {
  classic: "klasik yaklaşım",
  hybrid: "hibrit yaklaşım",
  experimental: "deneysel yaklaşım",
};
const TARGET_LABELS = {
  flash: "çok hızlı kazan (10-30 dk)",
  fast: "hızlı kazan (1-2 saat)",
  medium: "orta hız (24-48 saat)",
  slow: "yavaş (3-4 gün)",
  steady: "kararlı kazanç (4+ gün)",
};
const TARGET_EXPECTATIONS = {
  flash: {
    minVolatility: 0.0024,
    preferMomentum: "up",
    preferRebound: true,
  },
  fast: {
    minVolatility: 0.0018,
    preferMomentum: "up",
  },
  medium: {
    minVolatility: 0.001,
    maxVolatility: 0.0022,
    preferMidRange: true,
  },
  slow: {
    maxVolatility: 0.0018,
    preferMidRange: true,
    preferStable: true,
  },
  steady: {
    maxVolatility: 0.0012,
    preferMidRange: true,
    preferStable: true,
  },
};

const RISK_EXPECTATIONS = {
  low: {
    maxVolatility: 0.0016,
    preferStable: true,
  },
  medium: {
    minVolatility: 0.001,
    maxVolatility: 0.0025,
  },
  high: {
    minVolatility: 0.0018,
  },
};

const STRATEGY_EXPECTATIONS = {
  momentum: {
    minChangePct: 0.3,
    minMomentum: 0.5,
    minVolatility: 0.0016,
  },
  rebound: {
    preferDip: true,
    preferMomentum: "up",
    maxPosition: 0.55,
  },
  stability: {
    maxVolatility: 0.0016,
    preferStable: true,
    preferMidRange: true,
  },
};

const ROLE_EXPECTATIONS = {
  core: {
    maxVolatility: 0.0018,
    preferStable: true,
  },
  booster: {
    minVolatility: 0.0015,
    preferMomentum: "up",
  },
  shield: {
    maxVolatility: 0.0015,
    preferStable: true,
    preferLowerRisk: true,
  },
};

COIN_DEFINITIONS.forEach((coin) => {
  coinConfigs.set(coin.symbol, coin);
  coinsDirectory.push({ symbol: coin.symbol, name: coin.name });
});

const coinTotalEls = Array.from(document.querySelectorAll("[data-coin-total]"));
const coinsCountEls = Array.from(document.querySelectorAll("[data-coins-count]"));
const coinsVisibleEls = Array.from(document.querySelectorAll("[data-coins-visible]"));

const updateCoinTotalsDisplay = () => {
  const total = COIN_DEFINITIONS.length;
  coinTotalEls.forEach((element) => {
    if (element) {
      element.textContent = String(total);
    }
  });
  coinsCountEls.forEach((element) => {
    if (element) {
      element.textContent = String(total);
    }
  });
};

updateCoinTotalsDisplay();

const appLoader = document.querySelector("[data-app-loader]");
const appShell = document.querySelector("[data-app-shell]");
const loaderStatusEl = appLoader ? appLoader.querySelector("[data-loader-status]") : null;
const themeToggle = document.querySelector(".theme-toggle");
const searchInput = document.querySelector(".search input");
const topbar = document.querySelector(".topbar");
const topbarToggle = document.querySelector("[data-topbar-toggle]");
const topbarToggleLabel = topbarToggle ? topbarToggle.querySelector("[data-topbar-toggle-label]") : null;
const searchResults = document.querySelector("[data-search-results]");
const portfolioList = document.querySelector("[data-portfolio-list]");
const portfolioEmptyEl = document.querySelector("[data-portfolio-empty]");
const body = document.body;
const root = document.documentElement;
const addFundsButton = document.querySelector(".add-funds");
const withdrawButton = document.querySelector(".withdraw-funds");
const balanceValue = document.querySelector(".balance__value");
const balanceAmountEl = document.querySelector("[data-balance-amount]");
const balanceCurrencyEl = document.querySelector("[data-balance-currency]");
const balanceProfitValueEl = document.querySelector("[data-balance-profit]");
const heroBalanceAmountEl = document.querySelector("[data-hero-balance]");
const heroProfitValueEl = document.querySelector("[data-hero-profit]");
const heroCaptionEl = document.querySelector("[data-hero-caption]");
const plusForm = document.querySelector("[data-plus-form]");
const plusErrorEl = plusForm ? plusForm.querySelector("[data-plus-error]") : null;
const plusGrid = document.querySelector("[data-plus-grid]");
const plusEmptyEl = document.querySelector("[data-plus-empty]");
const plusCountEl = document.querySelector("[data-plus-count]");
const plusFollowersEl = document.querySelector("[data-plus-followers]");
const plusNewsPanel = document.querySelector("[data-plus-news]");
const plusNewsList = document.querySelector("[data-plus-news-list]");
const plusNewsToggle = document.querySelector("[data-plus-news-toggle]");
const plusNewsToggleLabel = plusNewsToggle ? plusNewsToggle.querySelector("[data-plus-news-toggle-label]") : null;
const plusNewsPulse = document.querySelector("[data-plus-news-pulse]");
const plusRequestsList = document.querySelector("[data-plus-requests-list]");
const plusRequestsEmptyEl = document.querySelector("[data-plus-requests-empty]");
const plusRequestsExportButton = document.querySelector("[data-plus-requests-export]");
const plusConsoleList = document.querySelector("[data-plus-console-list]");
const plusConsoleEmptyEl = document.querySelector("[data-plus-console-empty]");
const plusConsoleCopyButton = document.querySelector("[data-plus-console-copy]");
const plusPurchaseButton = document.querySelector("[data-plus-purchase]");
const plusStatusEl = document.querySelector("[data-plus-status]");
const plusThemeSelect = document.querySelector("[data-plus-theme]");
const plusMusicToggle = document.querySelector("[data-plus-music]");
const plusAlertsToggle = document.querySelector("[data-plus-alerts]");
const plusCustomization = document.querySelector("[data-plus-customization]");
const plusLockedMsg = document.querySelector("[data-plus-locked-msg]");
const aiHistoryList = document.querySelector("[data-ai-history]");
const aiHistoryEmpty = document.querySelector("[data-ai-history-empty]");
const radarGainersList = document.querySelector("[data-radar-gainers]");
const radarLosersList = document.querySelector("[data-radar-losers]");
const radarMomentumList = document.querySelector("[data-radar-momentum]");
const radarSnapshotEl = document.querySelector("[data-radar-snapshot]");
const radarNotesList = document.querySelector("[data-radar-notes]");
const radarUpdatedEl = document.querySelector("[data-radar-updated]");

userCoins = readStoredUserCoins();
plusNewsFeed = readStoredNews();
userCoinRequests = readStoredUserRequests();
userRequestLog = readStoredRequestLog();
aiRecommendationHistory = readStoredAiHistory();
stopLossConfig = readStoredStopLoss();
plusSettings = readStoredPlusSettings();
applyPlusThemeChoice(plusSettings.theme);
const aiTriggers = Array.from(document.querySelectorAll("[data-ai-trigger]"));
const aiPrimaryTrigger = document.querySelector("[data-ai-top]");
const aiFab = document.querySelector("[data-ai-fab]");
const aiFabDismissButton = aiFab ? aiFab.querySelector("[data-ai-fab-dismiss]") : null;
const aiProfileStatusEls = Array.from(document.querySelectorAll("[data-ai-profile-status]"));
const aiSetupTriggers = Array.from(document.querySelectorAll("[data-ai-setup-trigger]"));
const aiSetupModal = document.querySelector("[data-ai-setup-modal]");
const aiSetupPanel = aiSetupModal ? aiSetupModal.querySelector(".ai-setup__panel") : null;
const aiSetupForm = aiSetupModal ? aiSetupModal.querySelector("[data-ai-setup-form]") : null;
const aiSetupErrorEl = aiSetupModal ? aiSetupModal.querySelector("[data-ai-setup-error]") : null;
const aiSetupCloseButtons = aiSetupModal
  ? Array.from(aiSetupModal.querySelectorAll("[data-ai-setup-dismiss]"))
  : [];
const systemToast = document.querySelector("[data-system-toast]");
const systemToastText = systemToast ? systemToast.querySelector("[data-system-toast-text]") : null;
const systemToastDismiss = systemToast ? systemToast.querySelector("[data-system-toast-dismiss]") : null;
const coinsViewGrid = document.querySelector("[data-coins-grid]");
const coinsSearchInput = document.querySelector("[data-coins-search]");
const coinsSortSelect = document.querySelector("[data-coins-sort]");
const coinsFilterButtons = Array.from(document.querySelectorAll("[data-coins-filter]"));
const walletCashEl = document.querySelector("[data-wallet-cash]");
const walletInvestedEl = document.querySelector("[data-wallet-invested]");
const walletTotalEl = document.querySelector("[data-wallet-total]");
const walletProfitEl = document.querySelector("[data-wallet-profit]");
const walletContributionEl = document.querySelector("[data-wallet-contribution]");
const walletListEl = document.querySelector("[data-wallet-holdings]");
const walletEmptyEl = document.querySelector("[data-wallet-empty]");
const appViewPanels = new Map();
const appTabButtons = Array.from(document.querySelectorAll("[data-view-target]"));
let activeAppSection = "home";
let aiActiveTrigger = null;
let aiTopHighlightTimeout = null;
let aiPlusScreenActive = false;
let aiPlusScreenTrigger = null;
let aiResultDelayHandle = null;
let aiResultDelayToken = 0;
const aiModal = document.querySelector("[data-ai-modal]");
const aiForm = aiModal ? aiModal.querySelector("[data-ai-form]") : null;
const aiErrorEl = aiModal ? aiModal.querySelector("[data-ai-error]") : null;
const aiResultContainer = aiModal ? aiModal.querySelector("[data-ai-result]") : null;
const aiResultBody = aiModal ? aiModal.querySelector("[data-ai-result-body]") : null;
const aiResultStatusEl = aiModal ? aiModal.querySelector("[data-ai-result-status]") : null;
const aiResultTitleEl = aiModal ? aiModal.querySelector("[data-ai-result-title]") : null;
const aiResultSummaryEl = aiModal ? aiModal.querySelector("[data-ai-result-summary]") : null;
const aiResultReasonsEl = aiModal ? aiModal.querySelector("[data-ai-result-reasons]") : null;
const aiResultCautionsWrapper = aiModal ? aiModal.querySelector("[data-ai-result-cautions]") : null;
const aiResultCautionList = aiModal ? aiModal.querySelector("[data-ai-result-caution-list]") : null;
const aiResultAlternativeEl = aiModal ? aiModal.querySelector("[data-ai-result-alternative]") : null;
const aiOpenCoinButton = aiModal ? aiModal.querySelector("[data-ai-open-coin]") : null;
const aiRestartButton = aiModal ? aiModal.querySelector("[data-ai-restart]") : null;
const aiPromptInput = aiModal ? aiModal.querySelector("[data-ai-prompt]") : null;
const aiModalPanel = aiModal ? aiModal.querySelector(".ai-modal__panel") : null;
const aiFullscreenToggle = aiModal ? aiModal.querySelector("[data-ai-fullscreen-toggle]") : null;
const aiPlusBadge = aiModal ? aiModal.querySelector("[data-ai-plus-badge]") : null;
const aiPlusUpgradeButtons = aiModal ? Array.from(aiModal.querySelectorAll("[data-ai-plus-upgrade]")) : [];
const aiPlusPlaceholder = aiModal ? aiModal.querySelector("[data-ai-plus-placeholder]") : null;
const aiPlusRedirectSection = aiModal ? aiModal.querySelector("[data-ai-plus-redirect]") : null;
const aiChatSection = document.querySelector("[data-ai-chat]");
const aiChatHistoryEl = aiChatSection ? aiChatSection.querySelector("[data-ai-chat-history]") : null;
const aiChatLogEl = aiChatSection ? aiChatSection.querySelector("[data-ai-chat-log]") : null;
const aiChatEmptyEl = aiChatSection ? aiChatSection.querySelector("[data-ai-chat-empty]") : null;
const aiChatForm = aiChatSection ? aiChatSection.querySelector("[data-ai-chat-form]") : null;
const aiChatInput = aiChatSection ? aiChatSection.querySelector("[data-ai-chat-input]") : null;
const aiChatSendButton = aiChatSection ? aiChatSection.querySelector("[data-ai-chat-send]") : null;
const aiChatStatusEl = aiChatSection ? aiChatSection.querySelector("[data-ai-chat-status]") : null;
const aiChatClearButton = aiChatSection ? aiChatSection.querySelector("[data-ai-chat-clear]") : null;
const aiProfileButton = aiChatSection ? aiChatSection.querySelector("[data-ai-profile-open]") : null;
const plusReminderEl = document.querySelector("[data-plus-reminder]");
const plusReminderTextEl = plusReminderEl ? plusReminderEl.querySelector("[data-plus-reminder-text]") : null;
const plusReminderDismissButton = plusReminderEl ? plusReminderEl.querySelector("[data-plus-reminder-dismiss]") : null;
const aiPlusModal = document.querySelector("[data-ai-plus-modal]");
const aiPlusModalPanel = aiPlusModal ? aiPlusModal.querySelector(".ai-plus-modal__panel") : null;
const aiPlusPurchaseButton = aiPlusModal ? aiPlusModal.querySelector("[data-ai-plus-purchase]") : null;
const aiPlusCloseButtons = aiPlusModal ? Array.from(aiPlusModal.querySelectorAll("[data-ai-plus-dismiss]")) : [];
const aiPlusStatusText = aiPlusModal ? aiPlusModal.querySelector("[data-ai-plus-status]") : null;
const aiPlusErrorEl = aiPlusModal ? aiPlusModal.querySelector("[data-ai-plus-error]") : null;
const aiPlusPriceEls = Array.from(document.querySelectorAll("[data-ai-plus-price]"));
const aiPlusScreen = document.querySelector("[data-ai-plus-screen]");
const aiPlusScreenPanel = aiPlusScreen ? aiPlusScreen.querySelector("[data-ai-plus-panel]") : null;
const aiPlusScreenStatusEl = aiPlusScreen ? aiPlusScreen.querySelector("[data-ai-plus-screen-status]") : null;
const aiPlusScreenNextEl = aiPlusScreen ? aiPlusScreen.querySelector("[data-ai-plus-screen-next]") : null;
const aiPlusScreenCloseButtons = aiPlusScreen
  ? Array.from(aiPlusScreen.querySelectorAll("[data-ai-plus-screen-close]"))
  : [];
const aiPlusScreenManageButtons = aiPlusScreen
  ? Array.from(aiPlusScreen.querySelectorAll("[data-ai-plus-manage]"))
  : [];
const aiPlusOpenButtons = Array.from(document.querySelectorAll("[data-ai-plus-open]"));
const aiProfileModal = document.querySelector("[data-ai-profile-modal]");
const aiProfileModalPanel = aiProfileModal ? aiProfileModal.querySelector(".ai-profile-modal__panel") : null;
const aiProfileForm = aiProfileModal ? aiProfileModal.querySelector("[data-ai-profile-form]") : null;
const aiProfileMessageEl = aiProfileModal ? aiProfileModal.querySelector("[data-ai-profile-message]") : null;
const aiProfileCloseButtons = aiProfileModal ? Array.from(aiProfileModal.querySelectorAll("[data-ai-profile-dismiss], [data-ai-profile-cancel]")) : [];
const aiProfileFields = aiProfileForm ? Array.from(aiProfileForm.querySelectorAll("input, textarea")) : [];
const updateOverlay = document.querySelector("[data-update-overlay]");
const updateStartButton = updateOverlay ? updateOverlay.querySelector("[data-update-start]") : null;
const updateProgressEl = updateOverlay ? updateOverlay.querySelector("[data-update-progress]") : null;
const updateBarFill = updateOverlay ? updateOverlay.querySelector("[data-update-bar]") : null;
const updateTimerEl = updateOverlay ? updateOverlay.querySelector("[data-update-timer]") : null;
const currencyToggleButtons = Array.from(
  document.querySelectorAll(".currency-toggle__button")
);
const marketGrid = document.querySelector("[data-market-grid]");
const coinCards = new Map();
const cardEntryLookup = new WeakMap();
const portfolioEntries = new Map();
const timeframeLookup = new Map();
CHART_TIMEFRAMES.forEach((frame) => {
  timeframeLookup.set(frame.key, frame);
});
const viewTabs = Array.from(document.querySelectorAll("[data-view-tab]"));
const viewControls = Array.from(document.querySelectorAll("[data-view-control]"));
const exchangeView = document.querySelector("[data-exchange-view]");
const leverageView = document.querySelector("[data-leverage-view]");
const exchangeHero = document.querySelector("[data-exchange-hero]");
const leverageHero = document.querySelector("[data-leverage-hero]");
const balanceLabelEl = document.querySelector(".balance__label");
const balanceProfitLabelEl = document.querySelector(".balance__profit-label");
const leverageHeroLabelEl = document.querySelector("[data-leverage-hero-label]");
const leverageHeroBalanceEl = document.querySelector("[data-leverage-hero-balance]");
const leverageHeroFreeEl = document.querySelector("[data-leverage-hero-free]");
const leverageHeroOpenEl = document.querySelector("[data-leverage-hero-open]");
const leverageHeroProfitEl = document.querySelector("[data-leverage-hero-profit]");
const leverageHeroProfitLabelEl = document.querySelector("[data-leverage-hero-profit-label]");
const leverageIntro = document.querySelector("[data-leverage-intro]");
const leverageDashboard = document.querySelector("[data-leverage-dashboard]");
const leverageMarketGrid = document.querySelector("[data-leverage-market]");
const leveragePositionsList = document.querySelector("[data-leverage-positions-list]");
const leveragePositionsEmptyEl = document.querySelector("[data-leverage-positions-empty]");
const leverageDepositButtons = Array.from(document.querySelectorAll("[data-leverage-deposit]"));
const leverageWithdrawButtons = Array.from(document.querySelectorAll("[data-leverage-withdraw]"));
const leverageOnboardButton = document.querySelector("[data-leverage-onboard]");
const leverageTransferModals = {
  deposit: document.querySelector("[data-leverage-transfer-modal='deposit']"),
  withdraw: document.querySelector("[data-leverage-transfer-modal='withdraw']"),
};
const inlineLoader = document.querySelector("[data-inline-loader]");
const inlineLoaderStatus = inlineLoader ? inlineLoader.querySelector("[data-inline-loader-status]") : null;
const leverageCards = new Map();
const leveragePositionEntries = new Map();
let inlineLoaderTimeoutId = null;
let inlineLoaderToken = 0;
let inlineLoaderResolve = null;
let aiSetupLastFocus = null;

const showSystemToast = (message) => {
  if (!systemToast || !systemToastText) {
    return;
  }
  systemToastText.textContent = message;
  systemToast.hidden = false;
  systemToast.setAttribute("aria-hidden", "false");
};

const hideSystemToast = () => {
  if (!systemToast) {
    return;
  }
  systemToast.hidden = true;
  systemToast.setAttribute("aria-hidden", "true");
};

const updateAiPersonaUI = () => {
  const complete = Boolean(aiPersona && aiPersona.completed);
  const greeting = complete
    ? `${(aiPersona.salutation || "Sevgili").trim()} ${[aiPersona.firstName, aiPersona.lastName]
        .filter(Boolean)
        .join(" ")}`.trim()
    : null;
  const description = complete
    ? `${greeting} profili hazır. Coin AI 2.0 yanıtları bu stile göre hazırlanacak.`
    : "Henüz kişiselleştirme yapılmadı.";
  aiProfileStatusEls.forEach((el) => {
    el.textContent = description;
    el.classList.toggle("is-ready", complete);
  });
};

const openAiSetupModal = () => {
  if (!aiSetupModal || !aiSetupPanel) {
    return;
  }
  aiSetupLastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (aiSetupForm) {
    if (aiPersona && aiPersona.completed) {
      const fill = (name, value) => {
        const field = aiSetupForm.elements.namedItem(name);
        if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
          field.value = value || "";
        }
      };
      fill("firstName", aiPersona.firstName);
      fill("lastName", aiPersona.lastName);
      fill("salutation", aiPersona.salutation);
      fill("persona", aiPersona.persona);
      fill("investorStyle", aiPersona.investorStyle);
      fill("experience", aiPersona.experience);
      fill("riskComfort", aiPersona.riskComfort);
      fill("pace", aiPersona.pace);
      fill("dailyWindow", aiPersona.dailyWindow);
      fill("focusTheme", aiPersona.focusTheme);
      fill("motivation", aiPersona.motivation);
      fill("learning", aiPersona.learning);
      fill("tone", aiPersona.tone);
    } else {
      aiSetupForm.reset();
    }
  }
  if (aiSetupErrorEl) {
    aiSetupErrorEl.textContent = "";
  }
  aiSetupModal.hidden = false;
  aiSetupModal.setAttribute("aria-hidden", "false");
  focusNextFrame(aiSetupPanel);
};

const closeAiSetupModal = ({ restoreFocus = true } = {}) => {
  if (!aiSetupModal) {
    return;
  }
  aiSetupModal.hidden = true;
  aiSetupModal.setAttribute("aria-hidden", "true");
  if (restoreFocus && aiSetupLastFocus) {
    focusNextFrame(aiSetupLastFocus);
  }
  aiSetupLastFocus = null;
};

const ensureAiPersona = (trigger) => {
  if (aiPersona && aiPersona.completed) {
    return true;
  }
  pendingAiTrigger = trigger || null;
  openAiSetupModal();
  return false;
};

const handleAiSetupSubmit = (event) => {
  event.preventDefault();
  if (!aiSetupForm) {
    return;
  }
  const formData = new FormData(aiSetupForm);
  const read = (name) => String(formData.get(name) || "").trim();
  const requiredFields = [
    "firstName",
    "lastName",
    "salutation",
    "persona",
    "investorStyle",
    "experience",
    "riskComfort",
    "pace",
    "dailyWindow",
    "focusTheme",
    "motivation",
    "learning",
    "tone",
  ];
  const missing = requiredFields.some((field) => !read(field));
  if (missing) {
    if (aiSetupErrorEl) {
      aiSetupErrorEl.textContent = "Lütfen tüm alanları doldur.";
    }
    return;
  }
  aiPersona = {
    firstName: read("firstName"),
    lastName: read("lastName"),
    salutation: read("salutation"),
    persona: read("persona"),
    investorStyle: read("investorStyle"),
    experience: read("experience"),
    riskComfort: read("riskComfort"),
    pace: read("pace"),
    dailyWindow: read("dailyWindow"),
    focusTheme: read("focusTheme"),
    motivation: read("motivation"),
    learning: read("learning"),
    tone: read("tone"),
    completed: true,
    updatedAt: Date.now(),
  };
  safelyPersistAiPersona(aiPersona);
  updateAiPersonaUI();
  if (aiSetupErrorEl) {
    aiSetupErrorEl.textContent = "";
  }
  const followUpTrigger = pendingAiTrigger;
  pendingAiTrigger = null;
  closeAiSetupModal({ restoreFocus: false });
  if (followUpTrigger) {
    openAiModal({ currentTarget: followUpTrigger });
  }
};

document.querySelectorAll("[data-app-view]").forEach((panel) => {
  if (!(panel instanceof HTMLElement)) {
    return;
  }
  const viewName = panel.dataset.appView;
  if (!viewName) {
    return;
  }
  appViewPanels.set(viewName, panel);
  if (panel.classList.contains("is-active")) {
    activeAppSection = viewName;
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
  } else {
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");
  }
});

updateAiPersonaUI();

const setActiveAppSection = (section) => {
  const target = appViewPanels.has(section) ? section : "home";
  if (activeAppSection === target) {
    return;
  }
  activeAppSection = target;
  appViewPanels.forEach((panel, key) => {
    const isActive = key === target;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", isActive ? "false" : "true");
  });
  appTabButtons.forEach((button) => {
    const view = button.dataset.viewTarget || "home";
    const isActive = view === target;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
};

const initialSection = activeAppSection || "home";
activeAppSection = "";
setActiveAppSection(initialSection);

appTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.viewTarget || "home";
    setActiveAppSection(view);
  });
});

const readStoredAppVersion = () => {
  try {
    return localStorage.getItem(APP_UPDATE_KEY);
  } catch (error) {
    return null;
  }
};

const persistAppVersion = (value) => {
  try {
    localStorage.setItem(APP_UPDATE_KEY, value);
  } catch (error) {
    // ignore persistence issues silently
  }
};

let updateSimulationToken = 0;
let updateSimulationInterval = null;

const resetUpdateOverlay = () => {
  if (!updateOverlay) {
    return;
  }
  if (updateStartButton) {
    updateStartButton.disabled = false;
    updateStartButton.textContent = "Güncellemeyi başlat";
  }
  if (updateProgressEl) {
    updateProgressEl.hidden = true;
  }
  if (updateBarFill) {
    updateBarFill.style.width = "0%";
  }
  if (updateTimerEl) {
    updateTimerEl.textContent = "60";
  }
};

const hideUpdateOverlay = () => {
  if (!updateOverlay) {
    return;
  }
  if (updateSimulationInterval !== null) {
    window.clearInterval(updateSimulationInterval);
    updateSimulationInterval = null;
  }
  updateOverlay.hidden = true;
  updateOverlay.setAttribute("aria-hidden", "true");
  resetUpdateOverlay();
};

const showUpdateOverlay = () => {
  if (!updateOverlay) {
    return;
  }
  resetUpdateOverlay();
  updateOverlay.hidden = false;
  updateOverlay.setAttribute("aria-hidden", "false");
};

const startUpdateSimulation = () => {
  if (!updateOverlay) {
    return;
  }
  showUpdateOverlay();
  if (updateStartButton) {
    updateStartButton.disabled = true;
    updateStartButton.textContent = "Güncelleniyor...";
  }
  if (updateProgressEl) {
    updateProgressEl.hidden = false;
  }
  const start = Date.now();
  const duration = 60000;
  const curve = 0.85 + Math.random() * 0.9;
  const easingMode = Math.random() < 0.5 ? "in" : "out";
  const token = updateSimulationToken + 1;
  updateSimulationToken = token;

  const tick = () => {
    if (token !== updateSimulationToken) {
      return;
    }
    const elapsed = Date.now() - start;
    const base = Math.min(1, Math.max(0, elapsed / duration));
    let eased;
    if (easingMode === "in") {
      eased = Math.pow(base, curve);
    } else {
      eased = 1 - Math.pow(1 - base, curve);
    }
    const progress = Math.min(1, Math.max(0, eased));
    if (updateBarFill) {
      updateBarFill.style.width = `${(progress * 100).toFixed(1)}%`;
    }
    const remaining = Math.max(0, duration - elapsed);
    if (updateTimerEl) {
      updateTimerEl.textContent = String(Math.ceil(remaining / 1000));
    }
    if (base >= 1) {
      if (updateSimulationInterval !== null) {
        window.clearInterval(updateSimulationInterval);
        updateSimulationInterval = null;
      }
      persistAppVersion(APP_VERSION);
      window.setTimeout(() => {
        hideUpdateOverlay();
      }, 600);
    }
  };

  if (updateSimulationInterval !== null) {
    window.clearInterval(updateSimulationInterval);
    updateSimulationInterval = null;
  }

  tick();
  updateSimulationInterval = window.setInterval(tick, 240);
};

const maybeShowUpdateGate = () => {
  if (!updateOverlay) {
    return;
  }
  const stored = readStoredAppVersion();
  if (stored === APP_VERSION) {
    hideUpdateOverlay();
    return;
  }
  showUpdateOverlay();
};

const clearAiTopHighlight = () => {
  if (aiTopHighlightTimeout !== null) {
    window.clearTimeout(aiTopHighlightTimeout);
    aiTopHighlightTimeout = null;
  }
  if (aiPrimaryTrigger) {
    aiPrimaryTrigger.classList.remove("ai-launch--highlight");
    aiPrimaryTrigger.removeAttribute("data-ai-hint");
  }
};

const showAiTopHighlight = () => {
  if (!aiPrimaryTrigger) {
    return;
  }
  clearAiTopHighlight();
  aiPrimaryTrigger.setAttribute("data-ai-hint", "true");
  aiPrimaryTrigger.classList.add("ai-launch--highlight");
  aiTopHighlightTimeout = window.setTimeout(() => {
    clearAiTopHighlight();
  }, 4500);
};

if (aiPrimaryTrigger) {
  aiPrimaryTrigger.addEventListener("pointerenter", clearAiTopHighlight);
  aiPrimaryTrigger.addEventListener("focus", clearAiTopHighlight);
  aiPrimaryTrigger.addEventListener("click", clearAiTopHighlight);
}

const getProfileForFrame = (frame) => {
  if (!TIMEFRAME_PROFILES.length) {
    return null;
  }
  if (!frame || frame.minutes === null) {
    return TIMEFRAME_PROFILES[TIMEFRAME_PROFILES.length - 1];
  }
  for (let index = 0; index < TIMEFRAME_PROFILES.length; index += 1) {
    const profile = TIMEFRAME_PROFILES[index];
    if (frame.minutes <= profile.limitMinutes) {
      return profile;
    }
  }
  return TIMEFRAME_PROFILES[TIMEFRAME_PROFILES.length - 1];
};

const getMaxPointsForProfile = (profile, isDetail = false) => {
  if (!profile) {
    return isDetail ? DETAILED_CHART_POINTS : MAX_CHART_POINTS;
  }
  return isDetail ? profile.detailPoints : profile.chartPoints;
};

const applyCanvasProfile = (canvas, profile) => {
  if (!canvas) {
    return;
  }
  const profileId = profile ? profile.id : "long";
  if (canvas.dataset.profile !== profileId) {
    canvas.dataset.profile = profileId;
  }
};

const getAvailableMinuteCount = () => {
  const now = Date.now();
  const startIndex = minuteIndexForTimestamp(getStartOfDayTimestamp(now));
  const currentIndex = minuteIndexForTimestamp(now);
  return Math.max(0, currentIndex - startIndex);
};

const isFrameAvailable = (frame, availableMinutes) => {
  if (!frame) {
    return false;
  }
  if (frame.mode === "today") {
    return availableMinutes >= 0;
  }
  if (frame.minutes === null) {
    return availableMinutes > 0;
  }
  return availableMinutes >= frame.minutes;
};

const sanitizeTimeframeKey = (key, availableMinutes = getAvailableMinuteCount()) => {
  const candidate = timeframeLookup.has(key) ? key : DEFAULT_TIMEFRAME_KEY;
  const frame = timeframeLookup.get(candidate) || null;
  if (frame && isFrameAvailable(frame, availableMinutes)) {
    return candidate;
  }
  for (let index = 0; index < CHART_TIMEFRAMES.length; index += 1) {
    const fallbackFrame = CHART_TIMEFRAMES[index];
    if (isFrameAvailable(fallbackFrame, availableMinutes)) {
      return fallbackFrame.key;
    }
  }
  return DEFAULT_TIMEFRAME_KEY;
};

const refreshTimeframeAvailability = () => {
  const availableMinutes = getAvailableMinuteCount();

  const updateButtons = (buttonsMap, activeKey) => {
    const sanitizedKey = sanitizeTimeframeKey(activeKey, availableMinutes);
    if (buttonsMap && buttonsMap.size) {
      buttonsMap.forEach((button, key) => {
        const frame = timeframeLookup.get(key) || null;
        const usable = isFrameAvailable(frame, availableMinutes);
        button.disabled = !usable;
        button.classList.toggle("is-disabled", !usable);
        if (!usable) {
          button.setAttribute("aria-disabled", "true");
          if (!button.hasAttribute("title")) {
            button.setAttribute("title", "Veri henüz hazır değil");
          }
        } else {
          button.removeAttribute("aria-disabled");
          if (button.getAttribute("title") === "Veri henüz hazır değil") {
            button.removeAttribute("title");
          }
        }
      });
      updateTimeframeButtonStates(buttonsMap, sanitizedKey);
    }
    return sanitizedKey;
  };

  activeTimeframeKey = updateButtons(timeframeButtons, activeTimeframeKey);
  detailActiveTimeframeKey = updateButtons(detailTimeframeButtons, detailActiveTimeframeKey);
};
const seriesCache = new Map();
const timeframeButtons = new Map();
const detailTimeframeButtons = new Map();
const DEFAULT_TIMEFRAME_KEY = CHART_TIMEFRAMES.length ? CHART_TIMEFRAMES[0].key : "1D";
let activeTimeframeKey = DEFAULT_TIMEFRAME_KEY;
let detailActiveTimeframeKey = DEFAULT_TIMEFRAME_KEY;
const createCoinCardElement = (definition) => {
  const formatInitial = (value) => {
    if (!Number.isFinite(value)) {
      return "0,00";
    }
    try {
      return value.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch (error) {
      return value.toFixed(2);
    }
  };

  const card = document.createElement("article");
  card.className = "coin-card";
  card.setAttribute("data-coin", definition.symbol);
  card.innerHTML = `
    <div class="coin-card__header">
      <div class="coin-card__identity">
        <div class="coin-card__title-line">
          <h3 class="coin-card__symbol" data-coin-symbol>${definition.symbol}</h3>
          <span class="coin-card__indicator" data-coin-indicator>${
            (definition.indicator && definition.indicator.label) || ""
          }</span>
        </div>
        <p class="coin-card__name" data-coin-name>${definition.name}</p>
      </div>
      <div class="coin-card__price" aria-live="polite">
        <span class="coin-card__price-value" data-coin-price>${formatInitial(
          definition.initialPrice
        )} GP</span>
        <span class="coin-card__change" data-coin-change>+0,00 GP</span>
      </div>
    </div>
    <div class="coin-card__body">
      <p class="coin-card__summary">${definition.summary}</p>
      <dl class="coin-card__stats">
        <div>
          <dt>Son fiyat</dt>
          <dd data-coin-last>${formatInitial(definition.initialPrice)} GP</dd>
        </div>
        <div>
          <dt>24s yüksek</dt>
          <dd data-coin-high>${formatInitial(definition.initialPrice)} GP</dd>
        </div>
        <div>
          <dt>24s düşük</dt>
          <dd data-coin-low>${formatInitial(definition.initialPrice)} GP</dd>
        </div>
      </dl>
    </div>
    <button class="coin-card__cta" type="button" data-open-coin="${definition.symbol}">
      ${definition.symbol} detayları
    </button>
  `;

  const entry = {
    card,
    symbolEl: card.querySelector("[data-coin-symbol]"),
    nameEl: card.querySelector("[data-coin-name]"),
    priceEl: card.querySelector("[data-coin-price]"),
    changeEl: card.querySelector("[data-coin-change]"),
    lastEl: card.querySelector("[data-coin-last]"),
    highEl: card.querySelector("[data-coin-high]"),
    lowEl: card.querySelector("[data-coin-low]"),
    summaryEl: card.querySelector(".coin-card__summary"),
    indicatorEl: card.querySelector("[data-coin-indicator]"),
    ctaButton: card.querySelector("[data-open-coin]"),
  };
  registerCoinCardEntry(definition.symbol, entry);
  return card;
};

if (marketGrid) {
  const fragment = document.createDocumentFragment();
  COIN_DEFINITIONS.forEach((definition) => {
    const card = createCoinCardElement(definition);
    fragment.appendChild(card);
  });
  marketGrid.appendChild(fragment);
}

if (coinsViewGrid) {
  const fragment = document.createDocumentFragment();
  COIN_DEFINITIONS.forEach((definition) => {
    const card = createCoinCardElement(definition);
    fragment.appendChild(card);
  });
  coinsViewGrid.appendChild(fragment);
  sortCoinsLibrary();
  applyCoinsLibraryFilters();
}

if (leverageMarketGrid) {
  const fragment = document.createDocumentFragment();
  COIN_DEFINITIONS.forEach((definition) => {
    const card = createLeverageCard(definition);
    fragment.appendChild(card);
  });
  leverageMarketGrid.appendChild(fragment);
  updateAllLeverageCards();
}

const coinModal = document.querySelector("[data-coin-modal]");
const coinModalSymbolEl = coinModal
  ? coinModal.querySelector("[data-modal-symbol]")
  : null;
const coinModalIndicatorEl = coinModal
  ? coinModal.querySelector("[data-modal-indicator]")
  : null;
const coinModalNameEl = coinModal ? coinModal.querySelector("[data-modal-name]") : null;
const coinModalPriceEl = coinModal ? coinModal.querySelector("[data-modal-price]") : null;
const coinModalChangeEl = coinModal ? coinModal.querySelector("[data-modal-change]") : null;
const coinModalSummaryEl = coinModal
  ? coinModal.querySelector("[data-modal-summary]")
  : null;
const coinModalHoldingsEl = coinModal ? coinModal.querySelector("[data-modal-holdings]") : null;
const coinModalHoldingsLabelEl = coinModal
  ? coinModal.querySelector("[data-modal-holdings-label]")
  : null;
const coinModalCashEl = coinModal ? coinModal.querySelector("[data-modal-cash]") : null;
const coinModalTotalEl = coinModal ? coinModal.querySelector("[data-modal-total]") : null;
const coinModalUpdatedEl = coinModal ? coinModal.querySelector("[data-modal-updated]") : null;
const coinModalChange24El = coinModal ? coinModal.querySelector("[data-modal-24h-change]") : null;
const coinModalAvg24El = coinModal ? coinModal.querySelector("[data-modal-24h-avg]") : null;
const coinModalTradesEl = coinModal ? coinModal.querySelector("[data-modal-trades]") : null;
const coinModalVolatilityEl = coinModal ? coinModal.querySelector("[data-modal-volatility]") : null;
const coinChartCanvas = coinModal ? coinModal.querySelector("[data-coin-chart]") : null;
const timeframeControls = coinModal
  ? coinModal.querySelector("[data-timeframe-controls]")
  : null;
const tradeForms = coinModal ? Array.from(coinModal.querySelectorAll("[data-trade-form]")) : [];
const buyLabelEl = coinModal ? coinModal.querySelector("[data-buy-label]") : null;
const buyEquivalentEl = coinModal ? coinModal.querySelector("[data-buy-equivalent]") : null;
const sellLabelEl = coinModal ? coinModal.querySelector("[data-sell-label]") : null;
const sellEquivalentEl = coinModal ? coinModal.querySelector("[data-sell-equivalent]") : null;
const tradeFeeNote = coinModal ? coinModal.querySelector("[data-trade-fee-note]") : null;
const stopLossSection = coinModal ? coinModal.querySelector("[data-stop-loss]") : null;
const stopLossToggle = coinModal ? coinModal.querySelector("[data-stop-loss-toggle]") : null;
const stopLossThresholdInput = coinModal ? coinModal.querySelector("[data-stop-loss-threshold]") : null;
const stopLossStatus = coinModal ? coinModal.querySelector("[data-stop-loss-status]") : null;
const buyLockNoteEl = coinModal ? coinModal.querySelector("[data-buy-lock-note]") : null;
const coinModalDetailButton = coinModal
  ? coinModal.querySelector("[data-open-detailed-chart]")
  : null;
const chartModal = document.querySelector("[data-chart-modal]");
const detailTimeframeControls = chartModal
  ? chartModal.querySelector("[data-detail-timeframe-controls]")
  : null;
const detailChartCanvas = chartModal ? chartModal.querySelector("[data-detail-chart]") : null;
const detailTooltip = chartModal ? chartModal.querySelector("[data-detail-tooltip]") : null;
const detailTooltipTimeEl = chartModal ? chartModal.querySelector("[data-tooltip-time]") : null;
const detailTooltipPriceEl = chartModal ? chartModal.querySelector("[data-tooltip-price]") : null;
const detailTooltipChangeEl = chartModal ? chartModal.querySelector("[data-tooltip-change]") : null;
const detailTitleEl = chartModal ? chartModal.querySelector("[data-chart-modal-title]") : null;
const detailSubtitleEl = chartModal ? chartModal.querySelector("[data-chart-modal-subtitle]") : null;
const detailStartEl = chartModal ? chartModal.querySelector("[data-detail-start]") : null;
const detailCurrentEl = chartModal ? chartModal.querySelector("[data-detail-current]") : null;
const detailChangeEl = chartModal ? chartModal.querySelector("[data-detail-change]") : null;
const detailPercentEl = chartModal ? chartModal.querySelector("[data-detail-percent]") : null;
const detailRangeEl = chartModal ? chartModal.querySelector("[data-detail-range]") : null;
const detailHighEl = chartModal ? chartModal.querySelector("[data-detail-high]") : null;
const detailLowEl = chartModal ? chartModal.querySelector("[data-detail-low]") : null;
const detailDescriptionEl = chartModal ? chartModal.querySelector("[data-detail-description]") : null;
let drawChart = () => {};
let drawDetailChart = () => {};
let detailChartSeries = [];
let detailChartPoints = [];
let detailChartFrame = null;
let detailChartSymbol = "";
let detailTooltipVisible = false;
let detailChartBasePrice = 0;

const LOADER_DISPLAY_DURATION = 5000;
const LOADER_EXIT_DELAY = 450;

const revealAppShell = () => {
  if (appShell && appShell.hasAttribute("hidden")) {
    appShell.hidden = false;
  }
  if (appShell) {
    appShell.setAttribute("aria-hidden", "false");
  }
  if (body) {
    body.classList.remove("is-loading");
  }
  maybeShowUpdateGate();
};

const dismissLoader = () => {
  if (!appLoader) {
    return;
  }
  appLoader.classList.add("is-exiting");
  window.setTimeout(() => {
    if (appLoader.parentNode) {
      appLoader.parentNode.removeChild(appLoader);
    }
  }, 600);
};

const runLoaderSequence = () => {
  if (!appLoader) {
    revealAppShell();
    return;
  }
  window.setTimeout(() => {
    appLoader.classList.add("is-ding");
    if (loaderStatusEl) {
      loaderStatusEl.textContent = "Ding!";
    }
    window.setTimeout(() => {
      revealAppShell();
      dismissLoader();
    }, LOADER_EXIT_DELAY);
  }, LOADER_DISPLAY_DURATION);
};

runLoaderSequence();

const safelyPersistTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // storage might be unavailable (private mode, etc.) — ignore silently
  }
};

const safelyPersistBalance = (value) => {
  try {
    localStorage.setItem(BALANCE_KEY, String(value));
  } catch (error) {
    // ignore persistence errors silently
  }
};

const safelyPersistContribution = (value) => {
  try {
    localStorage.setItem(CONTRIBUTION_KEY, String(value));
  } catch (error) {
    // ignore persistence errors silently
  }
};

const safelyPersistLeverageBalance = (value) => {
  try {
    localStorage.setItem(LEVERAGE_BALANCE_KEY, String(value));
  } catch (error) {
    // ignore persistence errors silently
  }
};

const safelyPersistLeverageContribution = (value) => {
  try {
    localStorage.setItem(LEVERAGE_CONTRIBUTION_KEY, String(value));
  } catch (error) {
    // ignore persistence errors silently
  }
};

const safelyPersistLeveragePositions = (positions) => {
  try {
    localStorage.setItem(LEVERAGE_POSITIONS_KEY, JSON.stringify(positions));
  } catch (error) {
    // ignore persistence errors silently
  }
};

const safelyPersistLeverageUnlocked = (value) => {
  try {
    localStorage.setItem(LEVERAGE_UNLOCK_KEY, value ? "true" : "false");
  } catch (error) {
    // ignore persistence errors silently
  }
};

const readAiPlusWelcomeLegacy = () => {
  try {
    return localStorage.getItem(AI_PLUS_WELCOME_FLAG) === "true";
  } catch (error) {
    return false;
  }
};

const persistAiPlusWelcomeLegacy = (value) => {
  try {
    localStorage.setItem(AI_PLUS_WELCOME_FLAG, value ? "true" : "false");
  } catch (error) {
    // ignore persistence issues silently
  }
};

const safelyPersistAiPlusSubscription = (value) => {
  try {
    localStorage.setItem(AI_PLUS_SUBSCRIPTION_KEY, JSON.stringify(value));
  } catch (error) {
    // ignore persistence errors silently
  }
  persistAiPlusWelcomeLegacy(Boolean(value && value.welcomed));
};

const readStoredAiPlusSubscription = () => {
  try {
    const raw = localStorage.getItem(AI_PLUS_SUBSCRIPTION_KEY);
    if (!raw) {
      return {
        active: false,
        startedAt: 0,
        nextBilling: 0,
        reminderSeenFor: 0,
        welcomed: readAiPlusWelcomeLegacy(),
      };
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return {
        active: false,
        startedAt: 0,
        nextBilling: 0,
        reminderSeenFor: 0,
        welcomed: readAiPlusWelcomeLegacy(),
      };
    }
    const subscription = {
      active: Boolean(parsed.active),
      startedAt: Number.isFinite(parsed.startedAt) ? Number(parsed.startedAt) : 0,
      nextBilling: Number.isFinite(parsed.nextBilling) ? Number(parsed.nextBilling) : 0,
      reminderSeenFor: Number.isFinite(parsed.reminderSeenFor) ? Number(parsed.reminderSeenFor) : 0,
      welcomed: Boolean(parsed.welcomed),
    };
    if (!subscription.welcomed) {
      subscription.welcomed = readAiPlusWelcomeLegacy();
    }
    return subscription;
  } catch (error) {
    return {
      active: false,
      startedAt: 0,
      nextBilling: 0,
      reminderSeenFor: 0,
      welcomed: readAiPlusWelcomeLegacy(),
    };
  }
};

const safelyPersistAiPlusHistory = (history) => {
  try {
    const slice = Array.isArray(history)
      ? history.slice(Math.max(0, history.length - AI_PLUS_HISTORY_LIMIT))
      : [];
    localStorage.setItem(AI_PLUS_HISTORY_KEY, JSON.stringify(slice));
  } catch (error) {
    // ignore persistence errors silently
  }
};

const readStoredAiPlusHistory = () => {
  try {
    const raw = localStorage.getItem(AI_PLUS_HISTORY_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const normalized = parsed
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }
        const role = item.role === "assistant" ? "assistant" : "user";
        const content = typeof item.content === "string" ? item.content : "";
        const timestamp = Number.isFinite(item.timestamp) ? Number(item.timestamp) : Date.now();
        if (!content) {
          return null;
        }
        return { role, content, timestamp };
      })
      .filter(Boolean);
    return normalized.slice(Math.max(0, normalized.length - AI_PLUS_HISTORY_LIMIT));
  } catch (error) {
    return [];
  }
};

const safelyPersistAiHistory = (history) => {
  try {
    const slice = Array.isArray(history) ? history.slice(-50) : [];
    localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(slice));
  } catch (error) {
    // ignore
  }
};

function readStoredAiHistory() {
  try {
    const raw = localStorage.getItem(AI_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => ({
        symbol: entry?.symbol || "",
        summary: entry?.summary || "",
        timestamp: Number(entry?.timestamp) || Date.now(),
      }))
      .filter((entry) => entry.symbol && entry.summary)
      .slice(-50);
  } catch (error) {
    return [];
  }
}

const safelyPersistStopLoss = (config) => {
  try {
    localStorage.setItem(STOP_LOSS_KEY, JSON.stringify(config || {}));
  } catch (error) {
    // ignore
  }
};

function readStoredStopLoss() {
  try {
    const raw = localStorage.getItem(STOP_LOSS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch (error) {
    return {};
  }
}

function readStoredPlusSettings() {
  try {
    const raw = localStorage.getItem(PLUS_SETTINGS_KEY);
    if (!raw) return { theme: "default", music: false, alerts: false };
    const parsed = JSON.parse(raw);
    return {
      theme: parsed?.theme || "default",
      music: Boolean(parsed?.music),
      alerts: Boolean(parsed?.alerts),
    };
  } catch (error) {
    return { theme: "default", music: false, alerts: false };
  }
}

const persistPlusSettings = (settings) => {
  try {
    localStorage.setItem(PLUS_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    // ignore
  }
};

const safelyPersistAiPlusProfile = (profile) => {
  try {
    if (!profile) {
      localStorage.removeItem(AI_PLUS_PROFILE_KEY);
      return;
    }
    localStorage.setItem(AI_PLUS_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    // ignore persistence errors silently
  }
};

const readStoredAiPlusProfile = () => {
  try {
    const raw = localStorage.getItem(AI_PLUS_PROFILE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }
    const profile = {
      name: typeof parsed.name === "string" ? parsed.name : "",
      surname: typeof parsed.surname === "string" ? parsed.surname : "",
      age: Number.isFinite(parsed.age) ? Number(parsed.age) : null,
      height: Number.isFinite(parsed.height) ? Number(parsed.height) : null,
      weight: Number.isFinite(parsed.weight) ? Number(parsed.weight) : null,
      city: typeof parsed.city === "string" ? parsed.city : "",
      goal: Number.isFinite(parsed.goal) ? Number(parsed.goal) : null,
      note: typeof parsed.note === "string" ? parsed.note : "",
      updatedAt: Number.isFinite(parsed.updatedAt) ? Number(parsed.updatedAt) : Date.now(),
    };
    return profile;
  } catch (error) {
    return null;
  }
};

const safelyPersistAiPersona = (persona) => {
  try {
    if (!persona) {
      localStorage.removeItem(AI_PERSONA_KEY);
      localStorage.removeItem(AI_PERSONA_BACKUP_KEY);
      return;
    }
    const payload = JSON.stringify(persona);
    localStorage.setItem(AI_PERSONA_KEY, payload);
    localStorage.setItem(AI_PERSONA_BACKUP_KEY, payload);
  } catch (error) {
    console.error("AI persona kaydedilemedi", error);
  }
};

const normalizeAiPersona = (value) => {
  if (!value || typeof value !== "object") {
    return null;
  }
  const clean = {
    firstName: typeof value.firstName === "string" ? value.firstName : "",
    lastName: typeof value.lastName === "string" ? value.lastName : "",
    salutation: typeof value.salutation === "string" ? value.salutation : "",
    persona: typeof value.persona === "string" ? value.persona : "",
    investorStyle: typeof value.investorStyle === "string" ? value.investorStyle : "",
    experience: typeof value.experience === "string" ? value.experience : "",
    riskComfort: typeof value.riskComfort === "string" ? value.riskComfort : "",
    pace: typeof value.pace === "string" ? value.pace : "",
    dailyWindow: typeof value.dailyWindow === "string" ? value.dailyWindow : "",
    focusTheme: typeof value.focusTheme === "string" ? value.focusTheme : "",
    motivation: typeof value.motivation === "string" ? value.motivation : "",
    learning: typeof value.learning === "string" ? value.learning : "",
    tone: typeof value.tone === "string" ? value.tone : "",
    completed: Boolean(value.completed),
    updatedAt: Number.isFinite(value.updatedAt) ? Number(value.updatedAt) : Date.now(),
  };
  if (!clean.completed) {
    return null;
  }
  return clean;
};

const readStoredAiPersona = () => {
  const parsePersona = (raw) => normalizeAiPersona(safeParseJSON(raw, null));
  const primary = parsePersona(localStorage.getItem(AI_PERSONA_KEY));
  const backup = parsePersona(localStorage.getItem(AI_PERSONA_BACKUP_KEY));
  const persona = primary || backup;
  if (persona && !primary) {
    safelyPersistAiPersona(persona);
  }
  return persona;
};

aiPlusSubscription = readStoredAiPlusSubscription();
aiPlusHistory = readStoredAiPlusHistory();
aiPlusProfile = readStoredAiPlusProfile();
aiPersona = readStoredAiPersona();

const readStoredUsedCodes = () => {
  try {
    const raw = localStorage.getItem(USED_CODES_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const filtered = parsed.filter(
        (code) => typeof code === "string" && VALID_VERIFICATION_CODES.has(code)
      );
      return new Set(filtered);
    }
    return new Set();
  } catch (error) {
    return new Set();
  }
};

let usedVerificationCodes = readStoredUsedCodes();

const safelyPersistUsedCodes = () => {
  try {
    localStorage.setItem(
      USED_CODES_KEY,
      JSON.stringify(Array.from(usedVerificationCodes))
    );
  } catch (error) {
    // ignore persistence errors silently
  }
};

const isVerificationCodeRecognised = (code) => VALID_VERIFICATION_CODES.has(code);

const isVerificationCodeAvailable = (code) =>
  isVerificationCodeRecognised(code) && !usedVerificationCodes.has(code);

const markVerificationCodeUsed = (code) => {
  usedVerificationCodes.add(code);
  safelyPersistUsedCodes();
};

const readStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;
  }
};

const readStoredBalance = () => {
  try {
    const raw = localStorage.getItem(BALANCE_KEY);
    const parsed = raw ? parseFloat(raw) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  } catch (error) {
    return 0;
  }
};

const readStoredLeverageBalance = () => {
  try {
    const raw = localStorage.getItem(LEVERAGE_BALANCE_KEY);
    const parsed = raw ? parseFloat(raw) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  } catch (error) {
    return 0;
  }
};

const readStoredLeverageContribution = () => {
  try {
    const raw = localStorage.getItem(LEVERAGE_CONTRIBUTION_KEY);
    const parsed = raw ? parseFloat(raw) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  } catch (error) {
    return 0;
  }
};

const readStoredLeverageUnlocked = () => {
  try {
    const raw = localStorage.getItem(LEVERAGE_UNLOCK_KEY);
    return raw === "true";
  } catch (error) {
    return false;
  }
};

const readStoredLeveragePositions = () => {
  try {
    const raw = localStorage.getItem(LEVERAGE_POSITIONS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((position) => ({
          id: typeof position.id === "string" ? position.id : `${Date.now()}`,
          symbol: typeof position.symbol === "string" ? position.symbol : "",
          margin: Number.isFinite(position.margin) ? parseFloat(position.margin) : 0,
          multiplier: Number.isFinite(position.multiplier)
            ? parseFloat(position.multiplier)
            : 1,
          direction: position.direction === "short" ? "short" : "long",
          entryPrice: Number.isFinite(position.entryPrice)
            ? parseFloat(position.entryPrice)
            : 0,
          openedAt: Number.isFinite(position.openedAt)
            ? parseFloat(position.openedAt)
            : Date.now(),
        }))
        .filter((position) => position.symbol);
    }
    return [];
  } catch (error) {
    return [];
  }
};

const readStoredContribution = () => {
  try {
    const raw = localStorage.getItem(CONTRIBUTION_KEY);
    const parsed = raw ? parseFloat(raw) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  } catch (error) {
    return 0;
  }
};

const setTheme = (mode) => {
  const theme = mode === "dark" ? "dark" : "light";
  body.setAttribute("data-theme", theme);
  root.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    themeToggle.setAttribute("data-theme-state", theme);
  }
  safelyPersistTheme(theme);
};

const getPreferredTheme = () => {
  const stored = readStoredTheme();
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  const prefersDark =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
  return prefersDark ? "dark" : "light";
};

const applyInitialTheme = () => {
  const theme = getPreferredTheme();
  setTheme(theme);
};

const toggleTheme = () => {
  const isDark = body.getAttribute("data-theme") === "dark";
  setTheme(isDark ? "light" : "dark");
};

const setTopbarCollapsed = (collapsed) => {
  if (!topbar) {
    return;
  }
  const shouldCollapse = Boolean(collapsed);
  body.classList.toggle("topbar-collapsed", shouldCollapse);
  if (topbarToggle) {
    topbarToggle.setAttribute("aria-expanded", shouldCollapse ? "false" : "true");
  }
  if (topbarToggleLabel) {
    topbarToggleLabel.textContent = shouldCollapse ? "Üst çubuğu göster" : "Üst çubuğu gizle";
  }
};

const toggleTopbarVisibility = () => {
  const isCollapsed = body.classList.contains("topbar-collapsed");
  setTopbarCollapsed(!isCollapsed);
};

setTopbarCollapsed(false);

applyInitialTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    toggleTheme();
    drawChart();
  });

  const mql =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
  const handleSystemChange = (event) => {
    const stored = readStoredTheme();
    if (!stored) {
      setTheme(event.matches ? "dark" : "light");
      drawChart();
    }
  };

  if (mql) {
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handleSystemChange);
    } else if (typeof mql.addListener === "function") {
      mql.addListener(handleSystemChange);
    }
  }
}

if (topbarToggle) {
  topbarToggle.addEventListener("click", () => {
    toggleTopbarVisibility();
  });
}

const formatMemo = (value) => {
  try {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    return value.toFixed(2);
  }
};

const formatMemoWithSymbol = (value) => `${formatMemo(value)} ${LOCAL_CURRENCY_CODE}`;

const formatUSD = (value) => {
  try {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    return value.toFixed(2);
  }
};

const formatHoldings = (value) => {
  try {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  } catch (error) {
    return value.toFixed(4);
  }
};

const formatSignedMemo = (value) => {
  if (!Number.isFinite(value)) {
    return "+0,00";
  }
  const formatted = formatMemo(Math.abs(value));
  if (value > 0) {
    return `+${formatted}`;
  }
  if (value < 0) {
    return `-${formatted}`;
  }
  return `+${formatted}`;
};

const formatSignedMemoWithSymbol = (value) => `${formatSignedMemo(value)} ${LOCAL_CURRENCY_CODE}`;

const clamp = (value, min, max) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

const formatPercentChange = (value) => {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const magnitude = Math.abs(value);
  const decimals = magnitude >= 1 ? 1 : 2;
  const formatted = magnitude.toFixed(decimals).replace(".", ",");
  return `${sign}${formatted}%`;
};

const convertToCurrency = (value, currency) => {
  if (currency === "USD") {
    return value / USD_EXCHANGE_RATE;
  }
  return value;
};

const describeAmount = (value) => `${formatMemo(value)} ${LOCAL_CURRENCY_CODE}`;

const formatColorChoice = (color) => {
  const label = COLOR_LABELS[color];
  return label || color;
};

const formatHorizonChoice = (horizon) => {
  const label = HORIZON_LABELS[horizon];
  return label || horizon;
};

const formatRiskChoice = (risk) => {
  const label = RISK_LABELS[risk];
  return label || risk;
};

const formatStrategyChoice = (strategy) => {
  const label = STRATEGY_LABELS[strategy];
  return label || strategy;
};

const formatRoleChoice = (role) => {
  const label = ROLE_LABELS[role];
  return label || role;
};

const formatSectorChoice = (sector) => {
  const label = SECTOR_LABELS[sector];
  return label || sector;
};

const formatLiquidityChoice = (liquidity) => {
  const label = LIQUIDITY_LABELS[liquidity];
  return label || liquidity;
};

const formatInnovationChoice = (innovation) => {
  const label = INNOVATION_LABELS[innovation];
  return label || innovation;
};

const formatTargetChoice = (target) => {
  const label = TARGET_LABELS[target];
  return label || target;
};

const capitalizeTr = (text) => {
  if (!text) {
    return "";
  }
  try {
    return text.charAt(0).toLocaleUpperCase("tr-TR") + text.slice(1);
  } catch (error) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
};


const evaluateAiRecommendation = ({
  color,
  amount,
  horizon,
  target,
  risk,
  strategy,
  role,
  sector,
  liquidity,
  innovation,
  sentiment,
  community,
  guard,
}) => {
  const colorLabel = formatColorChoice(color);
  const horizonLabel = formatHorizonChoice(horizon);
  const targetLabel = formatTargetChoice(target);
  const riskLabel = formatRiskChoice(risk);
  const strategyLabel = formatStrategyChoice(strategy);
  const roleLabel = formatRoleChoice(role);
  const sectorLabel = formatSectorChoice(sector);
  const liquidityLabel = formatLiquidityChoice(liquidity);
  const innovationLabel = formatInnovationChoice(innovation);
  const targetConfig = TARGET_EXPECTATIONS[target] || null;
  const riskConfig = RISK_EXPECTATIONS[risk] || null;
  const strategyConfig = STRATEGY_EXPECTATIONS[strategy] || null;
  const roleConfig = ROLE_EXPECTATIONS[role] || null;

  const scored = COIN_DEFINITIONS.map((definition) => {
    const aiProfile = definition.ai || {};
    const indicatorLabel = definition.indicator ? definition.indicator.label : definition.symbol;
    const analysis = analyzeCoinMomentum(definition);
    let score = 0;
    const reasons = [];
    const cautions = [];

    if (Array.isArray(aiProfile.colorPreferences) && aiProfile.colorPreferences.includes(color)) {
      score += 3;
      reasons.push(
        `${capitalizeTr(colorLabel)} sinyali ${indicatorLabel.toLowerCase()} profilini güçlendiriyor.`
      );
    } else if (Array.isArray(aiProfile.colorPreferences) && aiProfile.colorPreferences.length) {
      const preferredColors = aiProfile.colorPreferences
        .map((tone) => capitalizeTr(formatColorChoice(tone)))
        .join(" / ");
      cautions.push(
        `${definition.symbol} genellikle ${preferredColors} sinyallerine daha iyi yanıt verir.`
      );
      score -= 1;
    }

    if (Array.isArray(aiProfile.horizonPreferences) && aiProfile.horizonPreferences.includes(horizon)) {
      score += 2;
      reasons.push(
        `${capitalizeTr(horizonLabel)} hedefi ${definition.symbol} stratejisinin merkezinde.`
      );
    } else if (Array.isArray(aiProfile.horizonPreferences) && aiProfile.horizonPreferences.length) {
      const preferredHorizons = aiProfile.horizonPreferences
        .map((entry) => capitalizeTr(formatHorizonChoice(entry)))
        .join(" / ");
      cautions.push(`${definition.symbol} daha çok ${preferredHorizons} planlarında öne çıkar.`);
    }

    if (typeof aiProfile.minAmount === "number") {
      if (amount >= aiProfile.minAmount) {
        score += 1;
        reasons.push(
          `${describeAmount(amount)} tutarı ${definition.symbol} için önerilen tabanın üzerinde.`
        );
      } else {
        score -= 1;
        cautions.push(
          `${definition.symbol} için en az ${describeAmount(aiProfile.minAmount)} önerilir.`
        );
      }
    }

    if (typeof aiProfile.maxAmount === "number") {
      if (amount <= aiProfile.maxAmount) {
        score += 1;
        reasons.push(
          `${describeAmount(amount)} seviyesi ${definition.symbol} volatilitesine uygun.`
        );
      } else {
        score -= 1;
        cautions.push(
          `${definition.symbol} ${describeAmount(aiProfile.maxAmount)} üzerindeki tutarlarda daha risklidir.`
        );
      }
    }

    if (Array.isArray(aiProfile.targetPreferences) && aiProfile.targetPreferences.includes(target)) {
      score += 2;
      reasons.push(`${capitalizeTr(targetLabel)} temposu ${definition.symbol} için öne çıkan senaryolardan biri.`);
    } else if (Array.isArray(aiProfile.targetPreferences) && aiProfile.targetPreferences.length) {
      const preferredTargets = aiProfile.targetPreferences
        .map((entry) => capitalizeTr(formatTargetChoice(entry)))
        .join(" / ");
      cautions.push(`${definition.symbol} genellikle ${preferredTargets} hedefleriyle daha uyumlu.`);
    }

    if (sentiment === "hyped") {
      if (analysis.momentum > 0) {
        score += 2;
        reasons.push(`${definition.symbol} pozitif momentumla haber odaklı akıma uyuyor.`);
      } else {
        cautions.push(`${definition.symbol} şu an sakin; haber odaklı beklenti için ivme zayıf.`);
      }
    } else if (sentiment === "calm") {
      if (analysis.volatility < 0.0025) {
        score += 1.5;
        reasons.push(`${definition.symbol} haberden bağımsız dengeli bantta.`);
      } else {
        score -= 0.5;
        cautions.push(`${definition.symbol} haber etkisine açık dalga yapıyor.`);
      }
    }

    if (community === "crowd") {
      if (aiProfile.role === "community" || aiProfile.role === "booster" || aiProfile.role === "surge") {
        score += 1.5;
        reasons.push(`${definition.symbol} topluluk etkisi yüksek coinler sınıfında.`);
      } else {
        cautions.push(`${definition.symbol} daha niş; topluluk etkisi sınırlı.`);
      }
    } else if (community === "solo") {
      if (aiProfile.role === "core" || aiProfile.role === "steady") {
        score += 1.2;
        reasons.push(`${definition.symbol} tekil fırsat arayan dengeli profillere uygun.`);
      }
    }

    if (guard === "shield") {
      if (analysis.range <= 2 && analysis.changePct > -1) {
        score += 1.2;
        reasons.push(`${definition.symbol} dar bantta; korumacı stratejiye uyumlu.`);
      } else {
        score -= 0.5;
        cautions.push(`${definition.symbol} korumacı eşik için daha geniş dalga yapıyor.`);
      }
    } else if (guard === "sprint") {
      if (Math.abs(analysis.momentumPct) > 0.4 || analysis.volatility > 0.01) {
        score += 1.2;
        reasons.push(`${definition.symbol} hızlı tepki veren sprint profiline uygun.`);
      }
    }

    if (Array.isArray(aiProfile.riskTolerance) && aiProfile.riskTolerance.includes(risk)) {
      score += 2;
      reasons.push(
        `${capitalizeTr(riskLabel)} profilin ${definition.symbol} volatilite bandıyla örtüşüyor.`
      );
    } else if (Array.isArray(aiProfile.riskTolerance) && aiProfile.riskTolerance.length) {
      const preferredRisks = aiProfile.riskTolerance
        .map((entry) => capitalizeTr(formatRiskChoice(entry)))
        .join(" / ");
      cautions.push(`${definition.symbol} daha çok ${preferredRisks} risk profillerinde dengede.`);
    }

    if (Array.isArray(aiProfile.strategyPreferences) && aiProfile.strategyPreferences.includes(strategy)) {
      score += 2;
      reasons.push(
        `${capitalizeTr(strategyLabel)} yaklaşımın ${indicatorLabel.toLowerCase()} akışına uyuyor.`
      );
    } else if (Array.isArray(aiProfile.strategyPreferences) && aiProfile.strategyPreferences.length) {
      const preferredStrategies = aiProfile.strategyPreferences
        .map((entry) => capitalizeTr(formatStrategyChoice(entry)))
        .join(" / ");
      cautions.push(`${definition.symbol} daha çok ${preferredStrategies} stratejilerinde öne çıkıyor.`);
    }

    if (Array.isArray(aiProfile.rolePreferences) && aiProfile.rolePreferences.includes(role)) {
      score += 1.5;
      reasons.push(
        `${capitalizeTr(roleLabel)} rol beklentin ${definition.symbol} için anlamlı bir eşleşme.`
      );
    } else if (Array.isArray(aiProfile.rolePreferences) && aiProfile.rolePreferences.length) {
      const preferredRoles = aiProfile.rolePreferences
        .map((entry) => capitalizeTr(formatRoleChoice(entry)))
        .join(" / ");
      cautions.push(`${definition.symbol} çoğunlukla ${preferredRoles} rolünde tercih ediliyor.`);
    }

    if (Number.isFinite(analysis.changePct)) {
      if (analysis.changePct > 0.25) {
        score += 1.5;
        reasons.push(
          `${definition.symbol} gün açılışına göre ${formatPercentChange(analysis.changePct)} yükselişte.`
        );
      } else if (analysis.changePct < -0.25) {
        if ((color === "red" || (targetConfig && targetConfig.preferRebound)) && analysis.momentum > 0) {
          score += 1.5;
          reasons.push(
            `${definition.symbol} gün içinde ${formatPercentChange(analysis.changePct)} geri çekildi ancak ${formatMemo(Math.abs(analysis.momentum))} GP toparlanarak tepki veriyor.`
          );
        } else {
          score -= 1;
          cautions.push(
            `${definition.symbol} gün açılışına göre ${formatPercentChange(analysis.changePct)} geride.`
          );
        }
      } else if (color === "yellow" || (targetConfig && targetConfig.preferStable)) {
        score += 1;
        reasons.push(
          `${definition.symbol} günlük bazda ${formatPercentChange(analysis.changePct)} ile dengeli seyrediyor.`
        );
      }
    }

    if (analysis.momentum > 0) {
      score += 0.75;
      reasons.push(`Son dakikada ${formatMemo(analysis.momentum)} GP yukarı ivme yakaladı.`);
    } else if (analysis.momentum < 0) {
      score -= 0.5;
      cautions.push(`Son dakikada ${formatMemo(Math.abs(analysis.momentum))} GP geri çekildi.`);
    }

    if (targetConfig) {
      if (typeof targetConfig.minVolatility === "number") {
        if (analysis.volatility >= targetConfig.minVolatility) {
          score += 1.5;
          reasons.push(
            `${definition.symbol} dakikada ortalama ${formatMemo(analysis.avgStep)} GP oynayarak ${targetLabel} hızına ayak uyduruyor.`
          );
        } else {
          score -= 1.5;
          cautions.push(
            `${definition.symbol} dakikada ortalama ${formatMemo(analysis.avgStep)} GP hareket ediyor; bu ${targetLabel} beklentinden daha sakin.`
          );
        }
      }
      if (typeof targetConfig.maxVolatility === "number") {
        if (analysis.volatility <= targetConfig.maxVolatility) {
          score += 1;
          reasons.push(
            `${definition.symbol} dakikada ${formatMemo(analysis.avgStep)} GP salınım ile ${targetLabel} hedefine uygun dengede.`
          );
        } else {
          score -= 1.5;
          cautions.push(
            `${definition.symbol} dakikada ${formatMemo(analysis.avgStep)} GP salınım ile ${targetLabel} hedefine göre daha agresif.`
          );
        }
      }
      if (targetConfig.preferMomentum === "up") {
        if (analysis.momentum > 0) {
          score += 0.75;
        } else {
          score -= 0.5;
          cautions.push(`Hızlı hedef için anlık ivme henüz yukarı dönmedi.`);
        }
      }
      if (targetConfig.preferMidRange) {
        if (analysis.position > 0.25 && analysis.position < 0.75) {
          score += 0.5;
          reasons.push(`Fiyat gün içi bandının orta diliminde, dengeli giriş fırsatı veriyor.`);
        } else {
          cautions.push(`Fiyat gün içi bandının uçlarında dolaşıyor, ${targetLabel} planında dikkatli ol.`);
        }
      }
      if (targetConfig.preferStable) {
        if (Math.abs(analysis.changePct) < 0.4) {
          score += 0.5;
          reasons.push(`Günlük dalgalanma ${formatPercentChange(analysis.changePct)} ile kontrollü.`);
        } else {
          score -= 0.5;
          cautions.push(`Günlük dalgalanma ${formatPercentChange(analysis.changePct)} ile beklenenden yüksek.`);
        }
      }
      if (targetConfig.preferRebound && analysis.position < 0.35 && analysis.momentum > 0) {
        score += 1;
        reasons.push(
          `${definition.symbol} gün içi dipten ${formatMemo(analysis.reboundGain)} GP toparlanmaya başladı; hızlı dönüş arayanlara hitap ediyor.`
        );
      }
    }

    if (riskConfig) {
      if (typeof riskConfig.maxVolatility === "number") {
        if (analysis.volatility <= riskConfig.maxVolatility) {
          score += 1.1;
          reasons.push(
            `${definition.symbol} dakikadaki ${formatMemo(analysis.avgStep)} GP oynaklık ile ${riskLabel} profilini destekliyor.`
          );
        } else {
          score -= 1;
          cautions.push(
            `${definition.symbol} oynaklığı ${formatMemo(analysis.avgStep)} GP ile ${riskLabel} sınırının üzerinde.`
          );
        }
      }
      if (typeof riskConfig.minVolatility === "number") {
        if (analysis.volatility >= riskConfig.minVolatility) {
          score += 0.8;
          reasons.push(`${definition.symbol} volatilitesi ${riskLabel} beklentini karşılıyor.`);
        } else {
          score -= 0.7;
          cautions.push(`${definition.symbol} volatilitesi ${riskLabel} planına göre düşük kalabilir.`);
        }
      }
      if (riskConfig.preferStable) {
        if (Math.abs(analysis.changePct) <= 0.35) {
          score += 0.5;
          reasons.push(`Günlük değişim ${formatPercentChange(analysis.changePct)} ile sakin.`);
        } else {
          cautions.push(`${definition.symbol} günlük değişimi ${formatPercentChange(analysis.changePct)} ile beklenenden hareketli.`);
        }
      }
    }

    if (strategyConfig) {
      if (typeof strategyConfig.minChangePct === "number") {
        if (analysis.changePct >= strategyConfig.minChangePct) {
          score += 0.9;
          reasons.push(`${definition.symbol} gün içi ${formatPercentChange(analysis.changePct)} performansla ${strategyLabel} planını besliyor.`);
        } else {
          cautions.push(`${definition.symbol} gün içi değişimi ${strategyLabel} hedefin için henüz yeterli değil.`);
        }
      }
      if (typeof strategyConfig.minMomentum === "number") {
        if (analysis.momentum >= strategyConfig.minMomentum) {
          score += 0.9;
          reasons.push(`Son dakikada ${formatMemo(analysis.momentum)} GP artış ${strategyLabel} ivmesini destekliyor.`);
        } else {
          cautions.push(`Anlık ivme ${formatMemo(analysis.momentum)} GP ile ${strategyLabel} arayışın için sınırlı.`);
        }
      }
      if (typeof strategyConfig.minVolatility === "number") {
        if (analysis.volatility >= strategyConfig.minVolatility) {
          score += 0.6;
        } else {
          cautions.push(`${definition.symbol} volatilitesi ${strategyLabel} temposu için yumuşak kalabilir.`);
        }
      }
      if (strategyConfig.preferDip) {
        if (analysis.change < 0 || analysis.position < 0.4) {
          score += 0.8;
          reasons.push(`${definition.symbol} gün içi geri çekilmeden ${formatMemo(analysis.reboundGain)} GP toparlandı.`);
        } else {
          cautions.push(`${definition.symbol} şu an dipten toplama fırsatı sunmuyor.`);
        }
      }
      if (strategyConfig.preferMomentum === "up") {
        if (analysis.momentum > 0) {
          score += 0.5;
        } else {
          cautions.push(`İvme ${strategyLabel} planın için henüz yukarı dönmedi.`);
        }
      }
      if (typeof strategyConfig.maxPosition === "number") {
        if (analysis.position <= strategyConfig.maxPosition) {
          score += 0.4;
        } else {
          cautions.push(`${definition.symbol} gün içi bandında yüksek bölgede; ${strategyLabel} planında dikkatli ol.`);
        }
      }
      if (strategyConfig.preferStable) {
        if (Math.abs(analysis.changePct) <= 0.35) {
          score += 0.4;
        } else {
          cautions.push(`${definition.symbol} hareketi ${strategyLabel} yaklaşımın için beklenenden sert.`);
        }
      }
      if (strategyConfig.preferMidRange) {
        if (analysis.position > 0.25 && analysis.position < 0.75) {
          score += 0.3;
        } else {
          cautions.push(`${definition.symbol} fiyatı gün içi bandının uçlarına yakın.`);
        }
      }
    }

    if (roleConfig) {
      if (typeof roleConfig.maxVolatility === "number") {
        if (analysis.volatility <= roleConfig.maxVolatility) {
          score += 0.9;
          reasons.push(`${definition.symbol} volatilitesi ${roleLabel} rolüne uygun.`);
        } else {
          cautions.push(`${definition.symbol} oynaklığı ${roleLabel} beklentisine göre yüksek.`);
        }
      }
      if (typeof roleConfig.minVolatility === "number") {
        if (analysis.volatility >= roleConfig.minVolatility) {
          score += 0.6;
        } else {
          cautions.push(`${definition.symbol} oynaklığı ${roleLabel} rolünde beklenen enerjiyi sunmayabilir.`);
        }
      }
      if (roleConfig.preferStable) {
        if (Math.abs(analysis.changePct) <= 0.35) {
          score += 0.4;
        } else {
          cautions.push(`${definition.symbol} gün içi değişimi ${roleLabel} rolü için dalgalı.`);
        }
      }
      if (roleConfig.preferMomentum === "up") {
        if (analysis.momentum > 0) {
          score += 0.4;
        } else {
          cautions.push(`${definition.symbol} momentumu ${roleLabel} rolünde beklenen hızda değil.`);
        }
      }
      if (roleConfig.preferLowerRisk && analysis.changePct < -0.4) {
        cautions.push(`${definition.symbol} gün içi kaybı ${formatPercentChange(analysis.changePct)} ile koruma rolünde baskı yaratabilir.`);
      }
    }

    if (Array.isArray(aiProfile.sectorFocus) && aiProfile.sectorFocus.includes(sector)) {
      score += 1.2;
      reasons.push(`${capitalizeTr(sectorLabel)} odağın ${definition.symbol} hikayesiyle uyumlu.`);
    } else if (Array.isArray(aiProfile.sectorFocus) && aiProfile.sectorFocus.length) {
      const preferredSectors = aiProfile.sectorFocus
        .map((entry) => capitalizeTr(formatSectorChoice(entry)))
        .join(" / ");
      cautions.push(`${definition.symbol} daha çok ${preferredSectors} projelerinde öne çıkıyor.`);
    }

    if (aiProfile.liquidityProfile && liquidity) {
      if (aiProfile.liquidityProfile === liquidity) {
        score += 1;
        reasons.push(`${capitalizeTr(liquidityLabel)} beklentin ${definition.symbol} akışına denk düşüyor.`);
      } else {
        cautions.push(`${definition.symbol} ${formatLiquidityChoice(aiProfile.liquidityProfile)} akışını tercih ediyor.`);
      }
    }

    if (Array.isArray(aiProfile.innovationProfile) && aiProfile.innovationProfile.includes(innovation)) {
      score += 0.8;
      reasons.push(`${capitalizeTr(innovationLabel)} yaklaşımın ${definition.symbol} vizyonuyla uyuşuyor.`);
    } else if (Array.isArray(aiProfile.innovationProfile) && aiProfile.innovationProfile.length) {
      const preferredInnovations = aiProfile.innovationProfile
        .map((entry) => capitalizeTr(formatInnovationChoice(entry)))
        .join(" / ");
      cautions.push(`${definition.symbol} genellikle ${preferredInnovations} çerçevesinde değer üretiyor.`);
    }

    if (color === "red") {
      if (analysis.volatility >= 0.002) {
        score += 1;
        reasons.push(`Dakikadaki ${formatMemo(analysis.avgStep)} GP oynaklık kırmızı sinyalinin agresifliğini destekliyor.`);
      } else {
        score -= 0.5;
        cautions.push(`${definition.symbol} kırmızı sinyali için beklenenden daha sakin.`);
      }
    } else if (color === "green") {
      if (analysis.changePct >= 0.3) {
        score += 0.5;
        reasons.push(`Günlük yükseliş ${formatPercentChange(analysis.changePct)} ile yeşil sinyale güven veriyor.`);
      }
      if (analysis.position > 0.85) {
        cautions.push(`Fiyat gün içi zirvesine yakın, yeşil sinyalle girişte dikkatli ol.`);
      }
    } else if (color === "yellow") {
      if (Math.abs(analysis.changePct) <= 0.4) {
        score += 0.5;
        reasons.push(`Nötr yaklaşımınla uyumlu şekilde günlük oynaklık sınırlı.`);
      } else {
        cautions.push(`Sarı sinyaline rağmen ${definition.symbol} bugün ${formatPercentChange(analysis.changePct)} değişim gösterdi.`);
      }
    }

    if (liquidity === "calm" && analysis.volatility > 0.0018) {
      score -= 0.75;
      cautions.push(`${definition.symbol} volatilitesi ${liquidityLabel} beklentinin üzerine çıkıyor.`);
    } else if (liquidity === "surge" && analysis.volatility < 0.0015) {
      score -= 0.5;
      cautions.push(`${definition.symbol} şu an beklediğin kadar hacimli değil.`);
    } else if (liquidity === "balanced") {
      if (analysis.volatility < 0.0012 || analysis.volatility > 0.0024) {
        cautions.push(`${definition.symbol} dalga genişliği dengeli bant dışına taşıyor.`);
      } else {
        score += 0.4;
      }
    }

    if ((target === "flash" || target === "fast") && analysis.position > 0.85) {
      score -= 1;
      cautions.push(`${definition.symbol} gün içi zirvesine çok yakın, hızlı hedef için marj daralmış olabilir.`);
    }
    if ((target === "steady" || target === "slow") && analysis.position < 0.2) {
      score -= 0.75;
      cautions.push(`${definition.symbol} gün içi dip seviyelerine yakın, uzun soluklu planında volatilite artabilir.`);
    }

    score += clamp(analysis.changePct / 2, -3, 3);
    score += Math.sign(analysis.momentum) * 0.3;

    const uniqueReasons = Array.from(new Set(reasons));
    const uniqueCautions = Array.from(new Set(cautions));

    return {
      definition,
      score,
      reasons: uniqueReasons,
      cautions: uniqueCautions,
      summary: aiProfile.description || definition.summary,
      risk: aiProfile.risk || "Risk profili dengeli.",
      analysis,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const alternative = scored.length > 1 ? scored[1] : null;
  return {
    best,
    alternative,
  };
};

const cancelAiResultDelay = (invalidateToken = false) => {
  if (aiResultDelayHandle !== null) {
    window.clearTimeout(aiResultDelayHandle);
    aiResultDelayHandle = null;
  }
  if (invalidateToken) {
    aiResultDelayToken += 1;
  }
};

const setAiResultState = (state, message = "") => {
  if (!aiResultContainer) {
    return;
  }
  aiResultContainer.dataset.state = state;
  const isIdle = state === "idle";
  aiResultContainer.hidden = isIdle;
  if (aiResultStatusEl) {
    aiResultStatusEl.textContent = message;
  }
  if (aiResultBody) {
    const showBody = state === "ready";
    aiResultBody.hidden = !showBody;
    aiResultBody.setAttribute("aria-hidden", showBody ? "false" : "true");
    aiResultBody.classList.toggle("is-visible", showBody);
  }
};

const resetAiModal = () => {
  if (!aiModal) {
    return;
  }
  if (aiForm) {
    aiForm.reset();
  }
  if (aiErrorEl) {
    aiErrorEl.textContent = "";
  }
  cancelAiResultDelay(true);
  setAiResultState("idle");
  if (aiResultTitleEl) {
    aiResultTitleEl.textContent = "Önerin hazır";
  }
  if (aiResultSummaryEl) {
    aiResultSummaryEl.textContent = "";
  }
  if (aiResultReasonsEl) {
    aiResultReasonsEl.innerHTML = "";
  }
  if (aiResultCautionList) {
    aiResultCautionList.innerHTML = "";
  }
  if (aiResultCautionsWrapper) {
    aiResultCautionsWrapper.hidden = true;
  }
  if (aiResultAlternativeEl) {
    aiResultAlternativeEl.textContent = "";
  }
  if (aiOpenCoinButton) {
    aiOpenCoinButton.hidden = true;
    aiOpenCoinButton.dataset.symbol = "";
  }
  syncAiPlusUI();
};

const closeAiModal = () => {
  if (!aiModal) {
    return;
  }
  cancelAiResultDelay(true);
  setAiResultState("idle");
  exitAiFullscreen();
  aiModal.hidden = true;
  aiTriggers.forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
  });
  document.removeEventListener("keydown", handleAiModalKeydown);
  aiChatProcessing = false;
  enableAiChatInputs(isAiPlusActive() && aiPlusScreenActive);
  const returnFocus = aiActiveTrigger;
  aiActiveTrigger = null;
  if (returnFocus) {
    focusNextFrame(returnFocus);
  }
};

const handleAiModalKeydown = (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeAiModal();
  }
};

const openAiModal = (event) => {
  const trigger = event && event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
  if (!ensureAiPersona(trigger)) {
    return;
  }
  if (!aiModal) {
    return;
  }
  aiActiveTrigger = trigger;
  clearAiTopHighlight();
  resetAiModal();
  updateAiPlusModalStatus();
  syncAiPlusUI();
  if (!aiChatProcessing) {
    enableAiChatInputs(isAiPlusActive() && aiPlusScreenActive);
  }
  aiModal.hidden = false;
  aiTriggers.forEach((target) => {
    target.setAttribute("aria-expanded", "true");
  });
  document.addEventListener("keydown", handleAiModalKeydown);
  focusNextFrame(aiPromptInput);
};

const buildAiSummary = (
  best,
  { color, horizon, target, risk, strategy, role, sector, liquidity, innovation }
) => {
  if (!best || !best.definition) {
    return "";
  }
  const personaIntro = aiPersona && aiPersona.completed
    ? `${(aiPersona.salutation || "Sevgili").trim()} ${aiPersona.firstName || ""}, ${
        aiPersona.persona || "tarzını"
      } dikkate alarak konuşuyorum.`
    : null;
  const colorLabel = capitalizeTr(formatColorChoice(color));
  const horizonLabel = capitalizeTr(formatHorizonChoice(horizon));
  const targetLabel = capitalizeTr(formatTargetChoice(target));
  const riskLabel = capitalizeTr(formatRiskChoice(risk));
  const strategyLabel = capitalizeTr(formatStrategyChoice(strategy));
  const roleLabel = capitalizeTr(formatRoleChoice(role));
  const sectorLabel = capitalizeTr(formatSectorChoice(sector));
  const liquidityLabel = capitalizeTr(formatLiquidityChoice(liquidity));
  const innovationLabel = capitalizeTr(formatInnovationChoice(innovation));
  const indicatorLabel = best.definition.indicator ? best.definition.indicator.label : best.definition.symbol;
  const parts = [];
  if (personaIntro) {
    parts.push(personaIntro);
  }
  parts.push(
    `Coin AI 2.0, ${riskLabel} profilin, ${strategyLabel} stratejin ve ${roleLabel} rol hedefinle ${colorLabel} sinyalini ${indicatorLabel.toLowerCase()} çizgide buluşturuyor.`,
    `${sectorLabel} odağın, ${liquidityLabel} akış isteğin ve ${innovationLabel} yaklaşımın ${best.definition.symbol} seçimini güçlendiriyor.`,
    `${capitalizeTr(horizonLabel)} planın ve ${targetLabel} temposu öneriyi şekillendiriyor.`,
  );
  if (best.analysis) {
    const { price, changePct, momentum } = best.analysis;
    const movementVerb = changePct >= 0 ? "yükseldi" : "geriledi";
    parts.push(
      `${best.definition.symbol} şu an ${formatMemo(price)} GP ve gün açılışına göre ${formatPercentChange(changePct)} ${movementVerb}.`
    );
    if (momentum > 0) {
      parts.push(`Son dakikada ${formatMemo(momentum)} GP ek ivme yakaladı.`);
    } else if (momentum < 0) {
      parts.push(`Son dakikada ${formatMemo(Math.abs(momentum))} GP geri adım attı.`);
    }
  }
  parts.push(best.summary);
  parts.push(`Risk profili: ${best.risk}.`);
  return parts.join(" ");
};

const buildAiAlternativeSummary = (entry, answers) => {
  if (!entry || !entry.definition) {
    return "";
  }
  if (entry.analysis) {
    const changeVerb = entry.analysis.changePct >= 0 ? "yükselişte" : "geri çekiliyor";
    return `${entry.definition.symbol} (${entry.definition.name}) şu an ${formatMemo(entry.analysis.price)} GP ve gün açılışına göre ${formatPercentChange(entry.analysis.changePct)} ${changeVerb}. ${entry.summary}`;
  }
  return `${entry.definition.symbol} (${entry.definition.name}) – ${entry.summary}`;
};

const renderAiResult = (answers) => {
  if (!aiResultContainer) {
    return;
  }
  aiResultDelayHandle = null;
  const evaluation = evaluateAiRecommendation(answers);
  const { best, alternative } = evaluation;
  if (!best) {
    setAiResultState("idle");
    return;
  }
  setAiResultState("ready", "Analiz tamamlandı");
  if (aiResultTitleEl) {
    aiResultTitleEl.textContent = `${best.definition.symbol} senin için öne çıkıyor`;
  }
  if (aiResultSummaryEl) {
    aiResultSummaryEl.textContent = buildAiSummary(best, answers);
  }
  if (aiResultReasonsEl) {
    aiResultReasonsEl.innerHTML = "";
    const reasons = best.reasons.length
      ? best.reasons
      : [
          `${capitalizeTr(formatColorChoice(answers.color))} sinyalin, ${capitalizeTr(formatStrategyChoice(answers.strategy))} stratejin, ${capitalizeTr(formatRiskChoice(answers.risk))} profilin, ${capitalizeTr(formatSectorChoice(answers.sector))} odağın, ${capitalizeTr(formatLiquidityChoice(answers.liquidity))} akış isteğin ve ${capitalizeTr(formatInnovationChoice(answers.innovation))} yaklaşımın ${capitalizeTr(formatTargetChoice(answers.target))} temposuyla birleşerek ${best.definition.symbol} eşleşmesini güçlendiriyor.`,
        ];
    reasons.forEach((reason) => {
      const item = document.createElement("li");
      item.textContent = reason;
      aiResultReasonsEl.appendChild(item);
    });
  }
  if (aiResultCautionList && aiResultCautionsWrapper) {
    aiResultCautionList.innerHTML = "";
    const cautionItems = [...best.cautions];
    if (isAiPlusActive() && plusAlertsToggle && plusAlertsToggle.checked && best.analysis) {
      cautionItems.push(
        `Gün içi bant: ${formatMemo(best.analysis.low)} - ${formatMemo(best.analysis.high)} GP (aralık: ${formatMemo(
          best.analysis.range
        )} GP).`
      );
      cautionItems.push(
        `Zirve takibi: ${formatMemo(best.analysis.price)} GP güncel, ${formatMemo(
          best.analysis.reboundGain
        )} GP son dipten toparlandı.`
      );
    }
    if (cautionItems.length) {
      cautionItems.forEach((caution) => {
        const item = document.createElement("li");
        item.textContent = caution;
        aiResultCautionList.appendChild(item);
      });
      aiResultCautionsWrapper.hidden = false;
    } else {
      aiResultCautionsWrapper.hidden = true;
    }
  }
  if (aiResultAlternativeEl) {
    if (alternative) {
      aiResultAlternativeEl.textContent = `Alternatif: ${buildAiAlternativeSummary(alternative, answers)}`;
    } else {
      aiResultAlternativeEl.textContent = "";
    }
  }
  if (aiOpenCoinButton) {
    aiOpenCoinButton.hidden = false;
    aiOpenCoinButton.dataset.symbol = best.definition.symbol;
  }
  aiResultContainer.hidden = false;
  try {
    aiResultContainer.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    aiResultContainer.scrollIntoView();
  }

  const historyEntry = {
    symbol: best.definition.symbol,
    summary: buildAiSummary(best, answers),
    timestamp: Date.now(),
  };
  aiRecommendationHistory = [...aiRecommendationHistory, historyEntry].slice(-50);
  safelyPersistAiHistory(aiRecommendationHistory);
  renderAiHistory();
};

function isAiPlusActive() {
  return Boolean(aiPlusSubscription && aiPlusSubscription.active);
}

function updateAiPlusPriceDisplays() {
  if (!aiPlusPriceEls || !aiPlusPriceEls.length) {
    return;
  }
  const formatted = formatMemoWithSymbol(AI_PLUS_PRICE);
  aiPlusPriceEls.forEach((el) => {
    if (el) {
      el.textContent = formatted;
    }
  });
}

const describeAiPlusNextBilling = () => {
  return "Tek seferlik erişim";
};

function updateAiPlusModalStatus() {
  if (!aiPlusModal) {
    return;
  }
  const active = isAiPlusActive();
  if (aiPlusErrorEl) {
    aiPlusErrorEl.textContent = "";
  }
  if (aiPlusStatusText) {
    if (active) {
      aiPlusStatusText.textContent = "Plus aktif (tek seferlik erişim).";
    } else {
      aiPlusStatusText.textContent = "Coin AI Plus aboneliğiniz henüz aktif değil.";
    }
  }
  if (aiPlusPurchaseButton) {
    if (active) {
      aiPlusPurchaseButton.disabled = true;
      aiPlusPurchaseButton.textContent = "Abonelik aktif";
    } else {
      aiPlusPurchaseButton.disabled = false;
      aiPlusPurchaseButton.textContent = "Satın al";
    }
  }
}

function updateAiChatStatus() {
  if (!aiChatStatusEl) {
    return;
  }
  if (!isAiPlusActive()) {
    aiChatStatusEl.textContent = "Coin AI Plus sohbeti için planı etkinleştir.";
    return;
  }
  if (aiPlusProfile && aiPlusProfile.name) {
    aiChatStatusEl.textContent = `${aiPlusProfile.name} için kişiselleştirilmiş analiz hazır.`;
    return;
  }
  aiChatStatusEl.textContent = "Hazırsan sorularını yaz, canlı analiz paylaşayım.";
}

function renderAiChatHistory() {
  if (!aiChatLogEl) {
    return;
  }
  const active = isAiPlusActive();
  aiChatLogEl.innerHTML = "";
  if (!active) {
    if (aiChatEmptyEl) {
      aiChatEmptyEl.hidden = false;
    }
    if (aiChatClearButton) {
      aiChatClearButton.disabled = true;
    }
    return;
  }
  if (!aiPlusHistory.length) {
    if (aiChatEmptyEl) {
      aiChatEmptyEl.hidden = false;
    }
  } else {
    if (aiChatEmptyEl) {
      aiChatEmptyEl.hidden = true;
    }
    const fragment = document.createDocumentFragment();
    aiPlusHistory.forEach((entry) => {
      if (!entry || !entry.content) {
        return;
      }
      const item = document.createElement("li");
      item.className = `ai-chat__message ai-chat__message--${entry.role === "assistant" ? "assistant" : "user"}`;
      const bubble = document.createElement("div");
      bubble.className = "ai-chat__bubble";
      bubble.textContent = entry.content;
      item.appendChild(bubble);
      if (entry.timestamp) {
        const time = document.createElement("time");
        time.className = "ai-chat__timestamp";
        try {
          time.textContent = CHAT_TIME_FORMATTER.format(new Date(entry.timestamp));
        } catch (error) {
          const date = new Date(entry.timestamp);
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          time.textContent = `${hours}:${minutes}`;
        }
        time.dateTime = new Date(entry.timestamp).toISOString();
        item.appendChild(time);
      }
      fragment.appendChild(item);
    });
    aiChatLogEl.appendChild(fragment);
    aiChatLogEl.scrollTop = aiChatLogEl.scrollHeight;
  }
  if (aiChatClearButton) {
    aiChatClearButton.disabled = aiPlusHistory.length === 0;
  }
}

const renderAiHistory = () => {
  if (!aiHistoryList || !aiHistoryEmpty) {
    return;
  }
  aiHistoryList.innerHTML = "";
  const entries = Array.isArray(aiRecommendationHistory)
    ? aiRecommendationHistory.slice(-10).reverse()
    : [];
  if (!entries.length) {
    aiHistoryEmpty.hidden = false;
    aiHistoryList.hidden = true;
    return;
  }
  aiHistoryEmpty.hidden = true;
  aiHistoryList.hidden = false;
  entries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "ai-history__item";
    const timeLabel = CHAT_TIME_FORMATTER.format(new Date(entry.timestamp));
    li.innerHTML = `
      <span class="ai-history__symbol">${entry.symbol}</span>
      <span class="ai-history__meta">${entry.summary} • ${timeLabel}</span>
    `;
    aiHistoryList.appendChild(li);
  });
};

const appendAiChatMessage = (role, content, timestamp = Date.now()) => {
  const normalized = typeof content === "string" ? content.trim() : "";
  if (!normalized) {
    return;
  }
  const entry = {
    role: role === "assistant" ? "assistant" : "user",
    content: normalized,
    timestamp,
  };
  aiPlusHistory = [...aiPlusHistory, entry];
  safelyPersistAiPlusHistory(aiPlusHistory);
  renderAiChatHistory();
};

const maybeSendPlusWelcome = () => {
  if (!isAiPlusActive()) {
    return;
  }
  if (!aiPlusSubscription.welcomed) {
    appendAiChatMessage(
      "assistant",
      "Coin AI Plus aktif! Tam ekran modu, kayıtlı sohbet geçmişi ve kişisel profil ile yanındayım. İstediğin coin sorusunu yazabilirsin."
    );
    aiPlusSubscription.welcomed = true;
    safelyPersistAiPlusSubscription(aiPlusSubscription);
  }
};

const AI_FREEFORM_DEFAULTS = {
  color: "yellow",
  horizon: "short",
  target: "fast",
  risk: "medium",
  strategy: "stability",
  role: "core",
  sector: "finance",
  liquidity: "balanced",
  innovation: "hybrid",
  sentiment: "balanced",
  community: "crowd",
  guard: "adaptive",
  amount: 1000,
};

const aiIntentKeywords = ["coin", "kripto", "borsa", "yatırım", "fiyat", "gp", "alış", "satış"];

const getAllCoinSymbols = () => {
  const symbols = new Set();
  COIN_DEFINITIONS.forEach((coin) => symbols.add((coin.symbol || "").toLowerCase()));
  userCoins.forEach((coin) => symbols.add((coin.symbol || "").toLowerCase()));
  return symbols;
};

const hasCoinIntent = (prompt) => {
  const text = prompt.toLowerCase();
  if (aiIntentKeywords.some((keyword) => text.includes(keyword))) {
    return true;
  }
  const symbols = getAllCoinSymbols();
  for (const symbol of symbols) {
    if (symbol && text.includes(symbol.toLowerCase())) {
      return true;
    }
  }
  return false;
};

const isGreetingPrompt = (prompt) => {
  const text = prompt.toLowerCase();
  return /merhaba|selam|nasılsın|nasilsin|iyi misin|günaydın|iyi akşamlar/.test(text);
};

const parseAmountFromPrompt = (prompt) => {
  const match = prompt.replace(/,/g, ".").match(/\d+(?:\.\d+)?/);
  if (!match) {
    return null;
  }
  const value = parseFloat(match[0]);
  return Number.isFinite(value) ? value : null;
};

const pickTargetFromPrompt = (prompt) => {
  if (/10-?30|çok hızlı|ani|dakika/.test(prompt)) return "flash";
  if (/1-?2 saat|hızlı/.test(prompt)) return "fast";
  if (/24|48|gün/i.test(prompt) && /orta/.test(prompt)) return "medium";
  if (/3-?4 gün|yavaş/.test(prompt)) return "slow";
  if (/istikrar|kararlı|uzun/.test(prompt)) return "steady";
  return null;
};

const pickRiskFromPrompt = (prompt) => {
  if (/düşük risk|güvenli|temkin/.test(prompt)) return "low";
  if (/yüksek risk|agresif|atak/.test(prompt)) return "high";
  return null;
};

const pickStrategyFromPrompt = (prompt) => {
  if (/trend|ivme|momentum/.test(prompt)) return "momentum";
  if (/dipten|geri çekil|toparlan/.test(prompt)) return "rebound";
  if (/dengeli|stabil|sakin/.test(prompt)) return "stability";
  return null;
};

const pickColorFromPrompt = (prompt) => {
  if (/yeşil/.test(prompt)) return "green";
  if (/kırmızı/.test(prompt)) return "red";
  if (/sarı/.test(prompt)) return "yellow";
  return null;
};

const pickSectorFromPrompt = (prompt) => {
  if (/yapay zek|ai/.test(prompt)) return "ai";
  if (/enerji/.test(prompt)) return "energy";
  if (/topluluk|community|sosyal/.test(prompt)) return "community";
  if (/finans|kredi|likidite/.test(prompt)) return "finance";
  if (/altyap|network|ağ/.test(prompt)) return "infrastructure";
  return null;
};

const buildAiAnswersFromPrompt = (prompt) => {
  const text = prompt.toLowerCase();
  const answers = { ...AI_FREEFORM_DEFAULTS };
  const amount = parseAmountFromPrompt(prompt);
  if (Number.isFinite(amount) && amount > 0) {
    answers.amount = roundToCents(amount);
  }
  answers.target = pickTargetFromPrompt(text) || answers.target;
  answers.risk = pickRiskFromPrompt(text) || answers.risk;
  answers.strategy = pickStrategyFromPrompt(text) || answers.strategy;
  answers.color = pickColorFromPrompt(text) || answers.color;
  answers.sector = pickSectorFromPrompt(text) || answers.sector;
  if (/uzun vade|uzun/.test(text)) {
    answers.horizon = "long";
  } else if (/kısa vade|kısa|hızlı/.test(text)) {
    answers.horizon = "short";
  }
  if (/topluluk|kalabalık/.test(text)) {
    answers.community = "crowd";
  } else if (/tekil|yalnız/.test(text)) {
    answers.community = "solo";
  }
  if (/koru|güvenli|stop/.test(text)) {
    answers.guard = "shield";
  } else if (/hız|sprint/.test(text)) {
    answers.guard = "sprint";
  }
  if (/hacim|volatil/.test(text)) {
    answers.liquidity = "surge";
  } else if (/sakin/.test(text)) {
    answers.liquidity = "calm";
  }
  if (/yenilikçi|deneysel/.test(text)) {
    answers.innovation = "experimental";
  } else if (/klasik|geleneksel/.test(text)) {
    answers.innovation = "classic";
  }
  if (/haber|gündem/.test(text)) {
    answers.sentiment = "hyped";
  } else if (/haber olmasın|bağımsız/.test(text)) {
    answers.sentiment = "calm";
  }
  return answers;
};

const renderAiTextReply = ({ title, summary, reasons = [], cautions = [] }) => {
  if (!aiResultContainer) {
    return;
  }
  if (aiResultTitleEl) {
    aiResultTitleEl.textContent = title;
  }
  if (aiResultSummaryEl) {
    aiResultSummaryEl.textContent = summary;
  }
  if (aiResultReasonsEl) {
    aiResultReasonsEl.innerHTML = "";
    reasons.forEach((reason) => {
      const item = document.createElement("li");
      item.textContent = reason;
      aiResultReasonsEl.appendChild(item);
    });
  }
  if (aiResultCautionList && aiResultCautionsWrapper) {
    aiResultCautionList.innerHTML = "";
    if (cautions.length) {
      cautions.forEach((caution) => {
        const item = document.createElement("li");
        item.textContent = caution;
        aiResultCautionList.appendChild(item);
      });
      aiResultCautionsWrapper.hidden = false;
    } else {
      aiResultCautionsWrapper.hidden = true;
    }
  }
  if (aiResultAlternativeEl) {
    aiResultAlternativeEl.textContent = "";
  }
  if (aiOpenCoinButton) {
    aiOpenCoinButton.hidden = true;
    aiOpenCoinButton.dataset.symbol = "";
  }
  setAiResultState("ready", "Analiz tamamlandı");
};

function enableAiChatInputs(enabled) {
  if (aiChatInput) {
    aiChatInput.disabled = !enabled;
  }
  if (aiChatSendButton) {
    aiChatSendButton.disabled = !enabled;
  }
}

function applyPlusThemeChoice(theme) {
  const normalized = ["default", "dawn", "midnight"].includes(theme) ? theme : "default";
  document.documentElement.dataset.plusTheme = normalized;
}

const updatePlusShelf = () => {
  const active = isAiPlusActive();
  if (plusStatusEl) {
    plusStatusEl.textContent = active
      ? "Plus aktif. Coin AI Turbo ve 0 komisyon hazır."
      : "Plus henüz aktif değil.";
  }
  if (plusPurchaseButton) {
    plusPurchaseButton.disabled = active;
    plusPurchaseButton.textContent = active ? "Plus aktif" : "Plus'ı etkinleştir";
  }
  if (plusCustomization) {
    plusCustomization.hidden = !active;
    plusCustomization.classList.toggle("is-locked", !active);
  }
  if (plusLockedMsg) {
    plusLockedMsg.hidden = active;
  }
  if (plusThemeSelect) {
    plusThemeSelect.disabled = !active;
    plusThemeSelect.value = plusSettings.theme;
  }
  if (plusMusicToggle) {
    plusMusicToggle.disabled = !active;
    plusMusicToggle.checked = !!plusSettings.music;
  }
  if (plusAlertsToggle) {
    plusAlertsToggle.disabled = !active;
    plusAlertsToggle.checked = !!plusSettings.alerts;
  }
  applyPlusThemeChoice(plusSettings.theme);
  updateTradeFeeNote();
  updateStopLossUI();
};

function syncAiPlusUI() {
  updateAiPlusPriceDisplays();
  const active = isAiPlusActive();
  const showChat = active && aiPlusScreenActive;
  if (aiPlusBadge) {
    aiPlusBadge.hidden = !active;
  }
  aiPlusUpgradeButtons.forEach((button) => {
    if (button) {
      button.textContent = active ? "Coin AI Plus (aktif)" : "Coin AI Plus";
    }
  });
  if (aiPlusPlaceholder) {
    aiPlusPlaceholder.hidden = active;
  }
  if (aiPlusRedirectSection) {
    aiPlusRedirectSection.hidden = !active;
    aiPlusRedirectSection.setAttribute("aria-hidden", active ? "false" : "true");
  }
  if (aiForm) {
    aiForm.hidden = active;
    aiForm.setAttribute("aria-hidden", active ? "true" : "false");
  }
  if (aiResultContainer && active) {
    aiResultContainer.hidden = true;
  }
  if (aiChatSection) {
    aiChatSection.hidden = !showChat;
    aiChatSection.setAttribute("aria-hidden", showChat ? "false" : "true");
  }
  if (aiChatInput && !aiChatProcessing) {
    aiChatInput.disabled = !showChat;
  }
  if (aiChatSendButton && !aiChatProcessing) {
    aiChatSendButton.disabled = !showChat;
  }
  if (aiChatClearButton) {
    aiChatClearButton.disabled = !showChat || aiPlusHistory.length === 0;
  }
  if (aiProfileButton) {
    aiProfileButton.disabled = !showChat;
  }
  if (!showChat && aiChatEmptyEl) {
    aiChatEmptyEl.hidden = false;
  }
  renderAiChatHistory();
  updateAiChatStatus();
  updateAiPlusModalStatus();
  updateAiPlusScreenStatus();
  updatePlusShelf();
  renderAiHistory();
  if (active && showChat) {
    maybeSendPlusWelcome();
  }
}

function handleAiPlusScreenKeydown(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeAiPlusScreen();
    syncAiPlusUI();
  }
}

function closeAiPlusScreen(options = {}) {
  const { restoreFocus = true } = options;
  if (!aiPlusScreen) {
    aiPlusScreenActive = false;
    return;
  }
  if (!aiPlusScreenActive && aiPlusScreen.hidden) {
    return;
  }
  aiPlusScreenActive = false;
  aiPlusScreen.hidden = true;
  aiPlusScreen.setAttribute("aria-hidden", "true");
  document.body.classList.remove("ai-plus-screen-open");
  document.removeEventListener("keydown", handleAiPlusScreenKeydown);
  aiChatProcessing = false;
  enableAiChatInputs(false);
  aiTriggers.forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
  });
  if (restoreFocus && aiPlusScreenTrigger) {
    focusNextFrame(aiPlusScreenTrigger);
  }
  aiPlusScreenTrigger = null;
}

function updateAiPlusScreenStatus() {
  if (!aiPlusScreen) {
    return;
  }
  const active = isAiPlusActive();
  if (aiPlusScreenStatusEl) {
    aiPlusScreenStatusEl.textContent = active ? "Abonelik aktif" : "Abonelik pasif";
  }
  if (aiPlusScreenNextEl) {
    aiPlusScreenNextEl.textContent = active
      ? "Tek seferlik Coin AI Plus erişimi aktif."
      : "Aboneliğiniz henüz aktif değil.";
  }
  if (!active && aiPlusScreenActive) {
    closeAiPlusScreen({ restoreFocus: false });
  }
}

function openAiPlusScreen(trigger) {
  if (!aiPlusScreen || !isAiPlusActive()) {
    return;
  }
  const opener = trigger instanceof HTMLElement ? trigger : null;
  aiPlusScreenTrigger = opener || aiPlusScreenTrigger;
  if (aiPlusScreenActive && !aiPlusScreen.hidden) {
    focusNextFrame(aiChatInput || aiPlusScreenPanel || aiPlusScreen);
    return;
  }
  aiPlusScreenActive = true;
  aiPlusScreen.hidden = false;
  aiPlusScreen.setAttribute("aria-hidden", "false");
  document.body.classList.add("ai-plus-screen-open");
  document.addEventListener("keydown", handleAiPlusScreenKeydown);
  aiTriggers.forEach((element) => {
    element.setAttribute("aria-expanded", "true");
  });
  syncAiPlusUI();
  if (!aiChatProcessing) {
    enableAiChatInputs(true);
  }
  focusNextFrame(aiChatInput || aiPlusScreenPanel || aiPlusScreen);
}

function handleAiPlusUpgradeClick(event) {
  const trigger = event && event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
  if (isAiPlusActive()) {
    closeAiModal();
    openAiPlusScreen(trigger);
    return;
  }
  openAiPlusModal();
}

const showPlusReminder = (message) => {
  showSystemToast(message);
};

const hidePlusReminder = () => {
  hideSystemToast();
};

const buildAiPlusAnswersFromMessage = (message) => {
  const normalized = message.toLowerCase();
  let amount = aiPlusProfile && Number.isFinite(aiPlusProfile.goal) ? Number(aiPlusProfile.goal) : 500;
  const numeric = message.replace(/,/g, ".").match(/\d+(?:[.,]\d+)?/);
  if (numeric) {
    const parsedAmount = parseFloat(numeric[0].replace(",", "."));
    if (Number.isFinite(parsedAmount) && parsedAmount > 0) {
      amount = roundToCents(parsedAmount);
    }
  }
  amount = Math.max(10, roundToCents(amount));
  const answers = {
    color: "green",
    horizon: "long",
    target: "steady",
    risk: "medium",
    strategy: "stability",
    role: "core",
    sentiment: "balanced",
    community: "solo",
    guard: "adaptive",
    amount,
  };
  if (/kısa|hemen|hızlı|acil/.test(normalized)) {
    answers.horizon = "short";
    answers.target = normalized.includes("çok") ? "flash" : "fast";
    answers.color = "red";
    answers.risk = "high";
    answers.strategy = "momentum";
    answers.role = "booster";
  }
  if (/uzun|stabil|güvenli|kararlı/.test(normalized)) {
    answers.horizon = "long";
    answers.target = "steady";
    answers.color = "green";
    answers.risk = "low";
    answers.strategy = "stability";
    answers.role = "core";
  }
  if (/orta hız|ortalama/.test(normalized)) {
    answers.target = "medium";
    answers.color = "yellow";
    answers.strategy = "momentum";
  }
  if (/dip|düş|geri/.test(normalized)) {
    answers.strategy = "rebound";
    answers.target = "slow";
  }
  if (/koru|koruma|kalkan/.test(normalized)) {
    answers.role = "shield";
    answers.risk = "low";
    answers.color = "yellow";
  }
  if (/risk/.test(normalized) && /yüksek/.test(normalized)) {
    answers.risk = "high";
    answers.color = "red";
    answers.role = "booster";
  }
  if (/topluluk|kalabalık/.test(normalized)) {
    answers.community = "crowd";
  }
  if (/haber|duyuru/.test(normalized)) {
    answers.sentiment = "hyped";
  }
  if (/koru|stop|zarar/.test(normalized)) {
    answers.guard = "shield";
  }
  return answers;
};

const generateAiPlusReply = (message) => {
  const answers = buildAiPlusAnswersFromMessage(message);
  const evaluation = evaluateAiRecommendation(answers);
  const { best, alternative } = evaluation;
  if (best && best.definition) {
    const lines = [];
    if (aiPlusProfile && aiPlusProfile.name) {
      lines.push(`Merhaba ${aiPlusProfile.name}!`);
    } else if (/merhaba|selam/.test(message.toLowerCase())) {
      lines.push("Merhaba!");
    }
    if (best.analysis) {
      const { price, changePct } = best.analysis;
      const direction = changePct >= 0 ? "yükselişte" : "geri çekiliyor";
      lines.push(
        `${best.definition.symbol} şu an ${formatMemo(price)} GP ve gün açılışına göre ${formatPercentChange(changePct)} ${direction}.`
      );
    } else {
      lines.push(`${best.definition.symbol} ${formatMemo(best.definition.initialPrice)} GP seviyesinden işlem görüyor.`);
    }
    lines.push(
      `${capitalizeTr(formatColorChoice(answers.color))} sinyalin, ${capitalizeTr(formatStrategyChoice(answers.strategy))} stratejin ve ${capitalizeTr(formatRiskChoice(answers.risk))} profilin ile uyum sağlıyor.`
    );
    lines.push(best.summary);
    if (answers.amount) {
      lines.push(`${formatMemo(answers.amount)} GP tutarında bir emir planlıyorsan uygun lotu hesaplamana yardımcı olabilirim.`);
    }
    if (alternative && alternative.definition) {
      const altPrice = alternative.analysis
        ? formatMemo(alternative.analysis.price)
        : formatMemo(alternative.definition.initialPrice);
      lines.push(`Alternatif olarak ${alternative.definition.symbol} ${altPrice} GP seviyesinde takip edilebilir.`);
    }
    lines.push("Başka ne öğrenmek istersin?");
    return { message: lines.join(" "), symbol: best.definition.symbol };
  }
  return {
    message: "Verileri topluyorum, birkaç saniye içinde yeniden sorarsan daha net öneri verebilirim.",
    symbol: null,
  };
};

const handleAiChatSubmit = (event) => {
  if (event) {
    event.preventDefault();
  }
  if (!aiChatInput || !isAiPlusActive() || !aiPlusScreenActive || aiChatProcessing) {
    return;
  }
  const message = aiChatInput.value.trim();
  if (!message) {
    return;
  }
  appendAiChatMessage("user", message);
  aiChatInput.value = "";
  aiChatProcessing = true;
  enableAiChatInputs(false);
  window.setTimeout(() => {
    const response = generateAiPlusReply(message);
    appendAiChatMessage("assistant", response.message);
    aiChatProcessing = false;
    enableAiChatInputs(aiPlusScreenActive);
    if (aiChatInput) {
      aiChatInput.focus();
    }
  }, 420 + Math.random() * 320);
};

const handleAiChatClear = () => {
  if (!isAiPlusActive() || !aiPlusScreenActive) {
    return;
  }
  aiPlusHistory = [];
  safelyPersistAiPlusHistory(aiPlusHistory);
  renderAiChatHistory();
  updateAiChatStatus();
};

const attemptAiPlusPurchase = () => {
  if (isAiPlusActive()) {
    if (aiPlusErrorEl) {
      aiPlusErrorEl.textContent = "Abonelik zaten aktif.";
    }
    return;
  }
  if (cashBalance < AI_PLUS_PRICE) {
    if (aiPlusErrorEl) {
      aiPlusErrorEl.textContent = "Yetersiz bakiye. Coin AI Plus için 5000 GP gerekli.";
    }
    showPlusReminder("Yetersiz bakiye: Coin AI Plus için 5000 GP gerekiyor.");
    return;
  }
  cashBalance = roundToCents(cashBalance - AI_PLUS_PRICE);
  safelyPersistBalance(cashBalance);
  updateBalanceDisplay();
  refreshAllCoinSummaries();
  const now = Date.now();
  const originTrigger = aiActiveTrigger || aiPlusScreenTrigger || null;
  aiPlusSubscription = {
    active: true,
    startedAt: now,
    nextBilling: 0,
    reminderSeenFor: 0,
    welcomed: false,
  };
  safelyPersistAiPlusSubscription(aiPlusSubscription);
  showPlusReminder("Coin AI Plus aktif edildi. 5000 GP bakiyenden düşüldü.");
  syncAiPlusUI();
  updateAiPlusModalStatus();
  closeAiPlusModal();
  if (aiModal && !aiModal.hidden) {
    closeAiModal();
  }
  const focusOrigin = originTrigger || aiPlusPurchaseButton;
  openAiPlusScreen(focusOrigin || undefined);
};

const checkAiPlusRenewal = () => {
  // Tek seferlik modelde yenileme yok
  return;
};

const openAiPlusModal = () => {
  if (!aiPlusModal || !aiPlusModalPanel) {
    return;
  }
  updateAiPlusModalStatus();
  aiPlusModal.hidden = false;
  aiPlusModal.setAttribute("aria-hidden", "false");
  document.addEventListener("keydown", handleAiPlusModalKeydown);
  focusNextFrame(aiPlusPurchaseButton || aiPlusModalPanel);
};

const closeAiPlusModal = () => {
  if (!aiPlusModal) {
    return;
  }
  aiPlusModal.hidden = true;
  aiPlusModal.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", handleAiPlusModalKeydown);
  if (aiPlusErrorEl) {
    aiPlusErrorEl.textContent = "";
  }
};

const handleAiPlusModalClick = (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  if (target === aiPlusModal || target.dataset.aiPlusDismiss === "" || target.dataset.aiPlusDismiss === "true") {
    closeAiPlusModal();
  }
};

function handleAiPlusModalKeydown(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeAiPlusModal();
  }
}

const openAiProfileModal = () => {
  if (!isAiPlusActive()) {
    openAiPlusModal();
    return;
  }
  if (!aiProfileModal || !aiProfileModalPanel) {
    return;
  }
  if (aiProfileForm && aiPlusProfile) {
    const map = new Map([
      ["profile-name", aiPlusProfile.name || ""],
      ["profile-surname", aiPlusProfile.surname || ""],
      ["profile-age", aiPlusProfile.age ?? ""],
      ["profile-height", aiPlusProfile.height ?? ""],
      ["profile-weight", aiPlusProfile.weight ?? ""],
      ["profile-city", aiPlusProfile.city || ""],
      ["profile-goal", aiPlusProfile.goal ?? ""],
      ["profile-note", aiPlusProfile.note || ""],
    ]);
    map.forEach((value, key) => {
      const field = aiProfileForm.elements.namedItem(key);
      if (field && "value" in field) {
        field.value = value === null ? "" : value;
      }
    });
  }
  if (aiProfileMessageEl) {
    aiProfileMessageEl.textContent = "";
  }
  aiProfileModal.hidden = false;
  aiProfileModal.setAttribute("aria-hidden", "false");
  document.addEventListener("keydown", handleAiProfileModalKeydown);
  focusNextFrame(aiProfileFields.length ? aiProfileFields[0] : aiProfileModalPanel);
};

const closeAiProfileModal = () => {
  if (!aiProfileModal) {
    return;
  }
  aiProfileModal.hidden = true;
  aiProfileModal.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", handleAiProfileModalKeydown);
};

function handleAiProfileModalKeydown(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeAiProfileModal();
  }
}

const handleAiProfileSubmit = (event) => {
  event.preventDefault();
  if (!aiProfileForm) {
    return;
  }
  const formData = new FormData(aiProfileForm);
  const profile = {
    name: String(formData.get("profile-name") || "").trim(),
    surname: String(formData.get("profile-surname") || "").trim(),
    age: Number.parseInt(formData.get("profile-age"), 10),
    height: Number.parseInt(formData.get("profile-height"), 10),
    weight: Number.parseInt(formData.get("profile-weight"), 10),
    city: String(formData.get("profile-city") || "").trim(),
    goal: parseFloat(formData.get("profile-goal")),
    note: String(formData.get("profile-note") || "").trim(),
    updatedAt: Date.now(),
  };
  if (!Number.isFinite(profile.age)) profile.age = null;
  if (!Number.isFinite(profile.height)) profile.height = null;
  if (!Number.isFinite(profile.weight)) profile.weight = null;
  if (!Number.isFinite(profile.goal)) profile.goal = null;
  aiPlusProfile = profile;
  safelyPersistAiPlusProfile(aiPlusProfile);
  if (aiProfileMessageEl) {
    aiProfileMessageEl.textContent = "Bilgilerin kaydedildi.";
  }
  syncAiPlusUI();
  window.setTimeout(() => {
    closeAiProfileModal();
  }, 900);
};

const enterAiFullscreen = () => {
  if (!aiModal) {
    return;
  }
  aiModal.classList.add("ai-modal--fullscreen");
  if (aiFullscreenToggle) {
    aiFullscreenToggle.setAttribute("aria-pressed", "true");
  }
  if (body) {
    body.classList.add("ai-fullscreen");
  }
  aiFullscreen = true;
};

function exitAiFullscreen() {
  if (!aiModal) {
    return;
  }
  aiModal.classList.remove("ai-modal--fullscreen");
  if (aiFullscreenToggle) {
    aiFullscreenToggle.setAttribute("aria-pressed", "false");
  }
  if (body) {
    body.classList.remove("ai-fullscreen");
  }
  aiFullscreen = false;
}

const toggleAiFullscreen = () => {
  if (aiFullscreen) {
    exitAiFullscreen();
  } else {
    enterAiFullscreen();
  }
};

const handleAiSubmit = (event) => {
  event.preventDefault();
  const prompt = aiPromptInput ? aiPromptInput.value.trim() : "";
  if (!prompt) {
    if (aiErrorEl) {
      aiErrorEl.textContent = "Lütfen Coin AI'ya sormak istediğin cümleyi yaz.";
    }
    return;
  }
  if (aiErrorEl) {
    aiErrorEl.textContent = "";
  }
  setAiResultState("loading", "Coin AI 2.0 düşünüyor...");
  if (aiOpenCoinButton) {
    aiOpenCoinButton.hidden = true;
    aiOpenCoinButton.dataset.symbol = "";
  }
  cancelAiResultDelay();
  const token = ++aiResultDelayToken;
  aiResultDelayHandle = window.setTimeout(() => {
    if (token !== aiResultDelayToken) {
      return;
    }
    aiResultDelayHandle = null;
    const lowerPrompt = prompt.toLowerCase();
    if (isGreetingPrompt(lowerPrompt) && !hasCoinIntent(lowerPrompt)) {
      renderAiTextReply({
        title: "Selam!",
        summary: "İyiyim, hazır ve nazırız. Coin odaklı sorularını bekliyorum.",
        reasons: ["Coin dışı sohbetlerde kısa yanıt verir, ana uzmanlığı piyasadır."],
      });
      return;
    }
    if (!hasCoinIntent(lowerPrompt)) {
      renderAiTextReply({
        title: "Coin odaklı sorulara geçelim",
        summary: "Coin AI 2.0 en iyi coin hareketleri, al-sat ve strateji sorularında çalışıyor.",
        reasons: ["Sorduğun konuda coin veya piyasa detayı göremedim.", "Coin sembolü, fiyat veya strateji içeren bir soru yazabilirsin."],
        cautions: ["Selamlaşmalar hariç diğer konuları kısa tutar, odağı coin önerisidir."],
      });
      return;
    }
    const answers = buildAiAnswersFromPrompt(prompt);
    renderAiResult(answers);
  }, AI_RESULT_DELAY_MS);
};

const handleAiModalClick = (event) => {
  const target = event.target instanceof HTMLElement ? event.target.closest("[data-close='true']") : null;
  if (target) {
    closeAiModal();
  }
};

const handleAiRestart = () => {
  resetAiModal();
  focusNextFrame(aiPromptInput);
};

const readStoredHoldings = () => {
  try {
    const raw = localStorage.getItem(HOLDINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    }
    return {};
  } catch (error) {
    return {};
  }
};

const safelyPersistHoldings = (value) => {
  try {
    localStorage.setItem(HOLDINGS_KEY, JSON.stringify(value));
  } catch (error) {
    // ignore persistence failures
  }
};

let cashBalance = roundToCents(readStoredBalance());
let netContribution = roundToCents(readStoredContribution());
let holdings = readStoredHoldings();
let activeCurrency = LOCAL_CURRENCY_CODE;
let highlightTimerId = null;
let activeCoinSymbol = COIN_DEFINITIONS.length ? COIN_DEFINITIONS[0].symbol : "";
let leverageBalance = roundToCents(readStoredLeverageBalance());
let leverageContribution = roundToCents(readStoredLeverageContribution());
let leveragePositions = readStoredLeveragePositions().map((position) => ({
  ...position,
  margin: roundToCents(position.margin || 0),
  entryPrice: roundToCents(position.entryPrice || 0),
}));
let leverageUnlocked = readStoredLeverageUnlocked();
let aiFullscreen = false;
let activeView = "";
const ensureHoldingEntry = (symbol) => {
  if (!Object.prototype.hasOwnProperty.call(holdings, symbol)) {
    holdings[symbol] = 0;
  }
};

COIN_DEFINITIONS.forEach(({ symbol }) => {
  ensureHoldingEntry(symbol);
});

const getHoldingAmount = (symbol) => {
  ensureHoldingEntry(symbol);
  return holdings[symbol];
};

const setHoldingAmount = (symbol, value) => {
  holdings[symbol] = value;
  safelyPersistHoldings(holdings);
};

function getCoinDefinition(symbol) {
  return coinConfigs.get(symbol);
}

function getCoinSortValue(symbol, key) {
  const definition = getCoinDefinition(symbol);
  if (!definition) {
    return 0;
  }
  const state = getCoinState(symbol);
  const analysis = analyzeCoinMomentum(definition);
  switch (key) {
    case "price":
      return state.price;
    case "volatility":
      return analysis.volatility || 0;
    case "name":
      return definition.name ? definition.name.toLowerCase().charCodeAt(0) : 0;
    default:
      return analysis.changePct || 0;
  }
}

function sortCoinsLibrary() {
  if (!coinsViewGrid) {
    return;
  }
  const cards = Array.from(coinsViewGrid.querySelectorAll(".coin-card"));
  const key = coinsSortKey;
  cards.sort((a, b) => {
    const symbolA = a.dataset.coin || "";
    const symbolB = b.dataset.coin || "";
    if (key === "name") {
      const nameA = (getCoinDefinition(symbolA)?.name || symbolA).toLowerCase();
      const nameB = (getCoinDefinition(symbolB)?.name || symbolB).toLowerCase();
      return nameA.localeCompare(nameB, "tr");
    }
    const valueA = getCoinSortValue(symbolA, key);
    const valueB = getCoinSortValue(symbolB, key);
    if (valueA === valueB) {
      return symbolA.localeCompare(symbolB, "tr");
    }
    return valueB - valueA;
  });
  cards.forEach((card) => coinsViewGrid.appendChild(card));
}

function applyCoinsLibraryFilters() {
  if (!coinsViewGrid) {
    return;
  }
  const query = coinsSearchQuery.trim().toLowerCase();
  let visibleCount = 0;
  const cards = Array.from(coinsViewGrid.querySelectorAll(".coin-card"));
  cards.forEach((card) => {
    const symbol = card.dataset.coin || "";
    const definition = getCoinDefinition(symbol);
    if (!definition) {
      card.hidden = true;
      card.classList.add("is-hidden");
      return;
    }
    const matchesQuery = !query
      ? true
      : symbol.toLowerCase().includes(query) || definition.name.toLowerCase().includes(query);
    let matchesFilter = true;
    if (coinsFilterKey === "steady") {
      matchesFilter = definition.indicator && definition.indicator.tone === "steady";
    } else if (coinsFilterKey === "surge") {
      matchesFilter = definition.indicator && definition.indicator.tone === "surge";
    } else if (coinsFilterKey === "core") {
      matchesFilter = definition.ai && definition.ai.rolePreferences && definition.ai.rolePreferences.includes("core");
    } else if (coinsFilterKey === "booster") {
      matchesFilter = definition.ai && definition.ai.rolePreferences && definition.ai.rolePreferences.includes("booster");
    }
    const visible = matchesQuery && matchesFilter;
    card.hidden = !visible;
    card.classList.toggle("is-hidden", !visible);
    if (visible) {
      visibleCount += 1;
    }
  });
  coinsVisibleEls.forEach((element) => {
    if (element) {
      element.textContent = String(visibleCount);
    }
  });
}

const scheduleCoinsLibrarySync = () => {
  if (coinsSyncScheduled) {
    return;
  }
  coinsSyncScheduled = true;
  requestAnimationFrame(() => {
    coinsSyncScheduled = false;
    sortCoinsLibrary();
    applyCoinsLibraryFilters();
  });
};

const applyIndicatorTone = (element, tone) => {
  if (!element) {
    return;
  }
  Object.values(INDICATOR_TONE_CLASS_MAP).forEach((className) => {
    element.classList.remove(className);
  });
  if (tone && INDICATOR_TONE_CLASS_MAP[tone]) {
    element.classList.add(INDICATOR_TONE_CLASS_MAP[tone]);
    element.dataset.tone = tone;
  } else {
    delete element.dataset.tone;
  }
};

function registerCoinCardEntry(symbol, entry) {
  if (!coinCards.has(symbol)) {
    coinCards.set(symbol, []);
  }
  const list = coinCards.get(symbol);
  list.push(entry);
  cardEntryLookup.set(entry.card, entry);
}

const getCoinCardEntries = (symbol) => {
  if (!coinCards.has(symbol)) {
    return [];
  }
  return coinCards.get(symbol);
};

const applyDefinitionToCoinCard = (symbol) => {
  const definition = getCoinDefinition(symbol);
  const entries = getCoinCardEntries(symbol);
  if (!definition || !entries.length) {
    return;
  }
  entries.forEach((entry) => {
    if (entry.symbolEl) {
      entry.symbolEl.textContent = definition.symbol;
    }
    if (entry.nameEl) {
      entry.nameEl.textContent = definition.name;
    }
    if (entry.summaryEl) {
      entry.summaryEl.textContent = definition.summary;
    }
    if (entry.indicatorEl) {
      const indicator = definition.indicator || {};
      const label = indicator.label || "";
      entry.indicatorEl.textContent = label;
      entry.indicatorEl.hidden = !label;
      applyIndicatorTone(entry.indicatorEl, indicator.tone || null);
    }
    if (entry.card) {
      entry.card.setAttribute("data-coin", definition.symbol);
      const indicatorTone = definition.indicator ? definition.indicator.tone : null;
      if (indicatorTone) {
        entry.card.dataset.indicatorTone = indicatorTone;
      } else {
        delete entry.card.dataset.indicatorTone;
      }
    }
    if (entry.ctaButton) {
      entry.ctaButton.textContent = `${definition.symbol} detayları`;
      entry.ctaButton.setAttribute("data-open-coin", definition.symbol);
    }
  });
};

COIN_DEFINITIONS.forEach(({ symbol }) => applyDefinitionToCoinCard(symbol));

function getCoinState(symbol) {
  if (!coinStates.has(symbol)) {
    const definition = getCoinDefinition(symbol);
    const initialPrice = definition ? definition.initialPrice : 1;
    coinStates.set(symbol, {
      symbol,
      price: initialPrice,
      previousPrice: initialPrice,
      history: [
        {
          timestamp: MARKET_EPOCH,
          price: initialPrice,
        },
      ],
      trades: 0,
    });
  }
  return coinStates.get(symbol);
}

function analyzeCoinMomentum(definition) {
  const symbol = definition.symbol;
  const state = getCoinState(symbol);
  const now = Date.now();
  const startOfDay = getStartOfDayTimestamp(now);
  const todayHistory = state.history.filter((entry) => entry.timestamp >= startOfDay);
  const openingEntry = todayHistory.length ? todayHistory[0] : state.history[0];
  const openPrice = openingEntry ? openingEntry.price : state.price;
  let high = typeof openPrice === "number" ? openPrice : state.price;
  let low = typeof openPrice === "number" ? openPrice : state.price;
  todayHistory.forEach((entry) => {
    if (typeof entry.price === "number") {
      if (entry.price > high) {
        high = entry.price;
      }
      if (entry.price < low) {
        low = entry.price;
      }
    }
  });
  if (state.price > high) {
    high = state.price;
  }
  if (state.price < low) {
    low = state.price;
  }
  const change = roundToCents(state.price - openPrice);
  const changePct = openPrice > 0 ? (change / openPrice) * 100 : 0;
  const momentum = roundToCents(state.price - state.previousPrice);
  const momentumPct = openPrice > 0 ? (momentum / openPrice) * 100 : 0;
  const range = Math.max(high - low, 0);
  const position = range > 0 ? clamp((state.price - low) / range, 0, 1) : 0.5;
  const steps = definition.priceSteps && definition.priceSteps.length ? definition.priceSteps : [0.5, 1];
  const avgStep = steps.reduce((sum, step) => sum + step, 0) / steps.length;
  const volatilityBase = definition.initialPrice || Math.max(state.price, 1);
  const volatility = avgStep / volatilityBase;
  const reboundGain = roundToCents(state.price - low);
  return {
    price: state.price,
    openPrice,
    change,
    changePct,
    momentum,
    momentumPct,
    high,
    low,
    range,
    position,
    avgStep,
    volatility,
    reboundGain,
  };
}

function renderRadarList(target, items, emptyText) {
  if (!target) {
    return;
  }
  target.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("li");
    empty.className = "radar-empty";
    empty.textContent = emptyText;
    target.appendChild(empty);
    return;
  }
  items.forEach(({ definition, analysis }) => {
    const li = document.createElement("li");
    li.className = "radar-list__item";
    if (analysis.change > 0) {
      li.classList.add("is-up");
    } else if (analysis.change < 0) {
      li.classList.add("is-down");
    }
    li.innerHTML = `
      <div class="radar-list__meta">
        <p class="radar-list__symbol">${definition.symbol}</p>
        <p class="radar-list__name">${definition.name}</p>
      </div>
      <span class="radar-list__badge">${formatMemoWithSymbol(analysis.price)}</span>
      <p class="radar-list__change">${formatSignedPercent(analysis.changePct)}</p>
    `;
    target.appendChild(li);
  });
}

function renderRadar() {
  if (
    !radarGainersList &&
    !radarLosersList &&
    !radarMomentumList &&
    !radarSnapshotEl &&
    !radarNotesList &&
    !radarUpdatedEl
  ) {
    return;
  }
  const analyses = COIN_DEFINITIONS.map((definition) => {
    const analysis = analyzeCoinMomentum(definition);
    return { definition, analysis };
  });

  const gainers = analyses
    .filter((entry) => entry.analysis.change > 0)
    .sort((a, b) => b.analysis.changePct - a.analysis.changePct)
    .slice(0, 3);
  const losers = analyses
    .filter((entry) => entry.analysis.change < 0)
    .sort((a, b) => a.analysis.changePct - b.analysis.changePct)
    .slice(0, 3);
  const movers = [...analyses]
    .sort((a, b) => Math.abs(b.analysis.momentumPct) - Math.abs(a.analysis.momentumPct))
    .slice(0, 4);

  renderRadarList(radarGainersList, gainers, "Bugün henüz belirgin bir yükseliş yok.");
  renderRadarList(radarLosersList, losers, "Düşen bir coin kaydedilmedi.");
  renderRadarList(radarMomentumList, movers, "Günlük momentum verisi bekleniyor.");

  if (radarSnapshotEl) {
    radarSnapshotEl.innerHTML = "";
    const summaryRows = [];
    if (gainers.length) {
      const top = gainers[0];
      summaryRows.push({
        label: "En çok yükselen",
        value: `${top.definition.symbol} ${formatSignedPercent(top.analysis.changePct)} · ${formatMemoWithSymbol(top.analysis.price)}`,
      });
    }
    if (losers.length) {
      const top = losers[0];
      summaryRows.push({
        label: "En çok düşen",
        value: `${top.definition.symbol} ${formatSignedPercent(top.analysis.changePct)} · ${formatMemoWithSymbol(top.analysis.price)}`,
      });
    }
    if (movers.length) {
      const fast = movers[0];
      summaryRows.push({
        label: "En hızlı momentum",
        value: `${fast.definition.symbol} ${formatSignedPercent(fast.analysis.momentumPct)} / dk`,
      });
    }
    if (!summaryRows.length) {
      summaryRows.push({ label: "Durum", value: "Günlük hareket verisi hazırlanıyor." });
    }
    summaryRows.forEach((row) => {
      const item = document.createElement("div");
      item.className = "radar-snapshot__row";
      item.innerHTML = `
        <p class="radar-snapshot__label">${row.label}</p>
        <p class="radar-snapshot__value">${row.value}</p>
      `;
      radarSnapshotEl.appendChild(item);
    });
  }

  if (radarNotesList) {
    radarNotesList.innerHTML = "";
    const notes = [];
    if (gainers.length) {
      notes.push(`${gainers[0].definition.symbol} günün en güçlü çıkışını yapıyor; hacim hareketine dikkat.`);
    }
    if (movers.length > 1) {
      notes.push(`${movers[0].definition.symbol} ivmeyi ${movers[1].definition.symbol} takip ediyor.`);
    }
    const calm = analyses
      .filter((entry) => Math.abs(entry.analysis.momentumPct) < 0.15)
      .sort((a, b) => a.analysis.volatility - b.analysis.volatility)[0];
    if (calm) {
      notes.push(`${calm.definition.symbol} bugün dengede; daha sakin bir seçenek arayanlar için uygun.`);
    }
    if (!notes.length) {
      notes.push("Radar notları hazırlanıyor.");
    }
    notes.slice(0, 3).forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      radarNotesList.appendChild(li);
    });
  }

  if (radarUpdatedEl) {
    radarUpdatedEl.textContent = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  }
}

const getTimelineCache = (symbol) => {
  if (!timelineCaches.has(symbol)) {
    const definition = getCoinDefinition(symbol);
    const initialPrice = definition ? definition.initialPrice : 1;
    timelineCaches.set(symbol, {
      minuteIndex: 0,
      price: initialPrice,
      previousPrice: initialPrice,
      history: [
        {
          timestamp: MARKET_EPOCH,
          price: initialPrice,
        },
      ],
    });
  }
  return timelineCaches.get(symbol);
};

const setTimelineCache = (symbol, cache) => {
  timelineCaches.set(symbol, cache);
};

const resetTimelineCache = (symbol) => {
  const definition = getCoinDefinition(symbol);
  const initialPrice = definition ? definition.initialPrice : 1;
  setTimelineCache(symbol, {
    minuteIndex: 0,
    price: initialPrice,
    previousPrice: initialPrice,
    history: [
      {
        timestamp: MARKET_EPOCH,
        price: initialPrice,
      },
    ],
  });
};

const getHoldingsValue = () => {
  const total = COIN_DEFINITIONS.reduce((accumulator, coin) => {
    const state = getCoinState(coin.symbol);
    const amount = getHoldingAmount(coin.symbol);
    return accumulator + amount * state.price;
  }, 0);
  return roundToCents(total);
};

const getPortfolioTotal = () => roundToCents(cashBalance + getHoldingsValue());
const getTotalProfit = () => roundToCents(getPortfolioTotal() - netContribution);

const updateWalletSummary = () => {
  if (!walletCashEl && !walletInvestedEl && !walletTotalEl && !walletProfitEl && !walletContributionEl) {
    return;
  }
  const holdingsValue = getHoldingsValue();
  const total = getPortfolioTotal();
  const profit = getTotalProfit();
  if (walletCashEl) {
    walletCashEl.textContent = formatMemoWithSymbol(cashBalance);
  }
  if (walletInvestedEl) {
    walletInvestedEl.textContent = formatMemoWithSymbol(holdingsValue);
  }
  if (walletTotalEl) {
    walletTotalEl.textContent = formatMemoWithSymbol(total);
  }
  if (walletProfitEl) {
    walletProfitEl.textContent = formatSignedMemoWithSymbol(profit);
    walletProfitEl.classList.toggle("is-up", profit > 0);
    walletProfitEl.classList.toggle("is-down", profit < 0);
  }
  if (walletContributionEl) {
    walletContributionEl.textContent = formatMemoWithSymbol(netContribution);
  }
};

const updateWalletHoldings = () => {
  if (!walletListEl || !walletEmptyEl) {
    return;
  }
  const entries = COIN_DEFINITIONS.map((definition) => {
    const amount = getHoldingAmount(definition.symbol);
    if (amount <= 0) {
      return null;
    }
    const state = getCoinState(definition.symbol);
    const value = roundToCents(amount * state.price);
    return { definition, amount, value };
  })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);

  walletListEl.innerHTML = "";
  if (!entries.length) {
    walletEmptyEl.hidden = false;
    walletListEl.hidden = true;
    walletListEl.setAttribute("aria-hidden", "true");
    return;
  }

  walletEmptyEl.hidden = true;
  walletListEl.hidden = false;
  walletListEl.setAttribute("aria-hidden", "false");

  entries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "wallet-holding";
    const identity = document.createElement("div");
    identity.className = "wallet-holding__identity";
    const symbolEl = document.createElement("span");
    symbolEl.className = "wallet-holding__symbol";
    symbolEl.textContent = entry.definition.symbol;
    const nameEl = document.createElement("span");
    nameEl.className = "wallet-holding__name";
    nameEl.textContent = entry.definition.name;
    identity.append(symbolEl, nameEl);

    const stats = document.createElement("div");
    stats.className = "wallet-holding__stats";
    const amountEl = document.createElement("span");
    amountEl.className = "wallet-holding__amount";
    amountEl.textContent = `${formatHoldings(entry.amount)} ${entry.definition.symbol}`;
    const valueEl = document.createElement("span");
    valueEl.className = "wallet-holding__value";
    valueEl.textContent = formatMemoWithSymbol(entry.value);
    stats.append(amountEl, valueEl);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "wallet-holding__cta";
    button.textContent = "Detay";
    button.setAttribute("data-open-coin", entry.definition.symbol);

    li.append(identity, stats, button);
    walletListEl.appendChild(li);
  });
};

const describeActiveCurrency = () =>
  activeCurrency === "USD" ? "Amerikan doları karşılığı" : `${LOCAL_CURRENCY_LABEL} birimi`;

const formatDisplayForCurrency = (value) => {
  const converted = convertToCurrency(value, activeCurrency);
  return activeCurrency === "USD" ? formatUSD(converted) : formatMemo(converted);
};

const updateBalanceDisplay = () => {
  if (activeView === "leverage") {
    const equity = getLeverageEquity();
    const formattedEquity = formatDisplayForCurrency(equity);
    if (balanceValue) {
      balanceValue.dataset.balance = String(equity);
    }
    if (balanceAmountEl) {
      balanceAmountEl.textContent = formattedEquity;
    }
    if (balanceCurrencyEl) {
      balanceCurrencyEl.textContent = activeCurrency === "USD" ? "USD" : LOCAL_CURRENCY_CODE;
    }
    if (balanceLabelEl) {
      balanceLabelEl.textContent = "Kaldıraç öz sermaye";
    }
    if (leverageHeroLabelEl) {
      leverageHeroLabelEl.textContent = "Kaldıraç öz sermaye";
    }
    updateLeverageSummary();
  } else {
    const total = getPortfolioTotal();
    const formatted = formatDisplayForCurrency(total);
    if (balanceValue) {
      balanceValue.dataset.balance = String(total);
    }
    if (balanceAmountEl) {
      balanceAmountEl.textContent = formatted;
    }
    if (balanceCurrencyEl) {
      balanceCurrencyEl.textContent = activeCurrency === "USD" ? "USD" : LOCAL_CURRENCY_CODE;
    }
    if (balanceLabelEl) {
      balanceLabelEl.textContent = "Toplam bakiye";
    }
    if (heroBalanceAmountEl) {
      heroBalanceAmountEl.textContent = formatted;
    }
    if (heroCaptionEl) {
      heroCaptionEl.textContent = describeActiveCurrency();
    }
  }
  updateProfitDisplay();
  updateWalletSummary();
};

const updateProfitDisplay = () => {
  if (activeView === "leverage") {
    const profit = getLeverageProfit();
    if (balanceProfitLabelEl) {
      balanceProfitLabelEl.textContent = "Kaldıraç kâr / zarar";
    }
    if (leverageHeroProfitLabelEl) {
      leverageHeroProfitLabelEl.textContent = "Kaldıraç kâr / zarar";
    }
    const signedValue = formatSignedDisplay(profit);
    if (balanceProfitValueEl) {
      balanceProfitValueEl.textContent = signedValue;
      balanceProfitValueEl.classList.toggle("is-positive", profit > 0);
      balanceProfitValueEl.classList.toggle("is-negative", profit < 0);
    }
    if (leverageHeroProfitEl) {
      leverageHeroProfitEl.textContent = signedValue;
      leverageHeroProfitEl.classList.toggle("is-positive", profit > 0);
      leverageHeroProfitEl.classList.toggle("is-negative", profit < 0);
    }
  } else {
    const profit = getTotalProfit();
    const converted = convertToCurrency(profit, activeCurrency);
    const formatted =
      activeCurrency === "USD"
        ? formatUSD(Math.abs(converted))
        : formatMemo(Math.abs(converted));
    const symbol = activeCurrency === "USD" ? "USD" : LOCAL_CURRENCY_CODE;
    const sign = profit >= 0 ? "+" : "-";
    if (balanceProfitLabelEl) {
      balanceProfitLabelEl.textContent = "Toplam kâr / zarar";
    }
    if (leverageHeroProfitLabelEl) {
      leverageHeroProfitLabelEl.textContent = "Kâr / zarar";
    }
    if (heroProfitValueEl) {
      heroProfitValueEl.textContent = `${sign}${formatted} ${symbol}`;
      heroProfitValueEl.classList.toggle("is-positive", profit > 0);
      heroProfitValueEl.classList.toggle("is-negative", profit < 0);
    }
    if (balanceProfitValueEl) {
      balanceProfitValueEl.textContent = `${sign}${formatted} ${symbol}`;
      balanceProfitValueEl.classList.toggle("is-positive", profit > 0);
      balanceProfitValueEl.classList.toggle("is-negative", profit < 0);
    }
  }
};

const getPortfolioSummarySnippet = (summary) => {
  if (typeof summary !== "string") {
    return "";
  }
  const normalized = summary.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }
  const sentenceEnd = normalized.indexOf(".");
  let snippet = sentenceEnd !== -1 ? normalized.slice(0, sentenceEnd + 1) : normalized;
  if (snippet.length > 140) {
    snippet = `${snippet.slice(0, 137).trimEnd()}…`;
  }
  return snippet;
};

const createPortfolioCardEntry = (definition) => {
  const card = document.createElement("article");
  card.className = "portfolio-card";
  card.setAttribute("data-portfolio-item", definition.symbol);
  card.setAttribute("data-symbol", definition.symbol);

  const main = document.createElement("div");
  main.className = "portfolio-card__main";

  const identity = document.createElement("div");
  identity.className = "portfolio-card__identity";

  const symbolEl = document.createElement("span");
  symbolEl.className = "portfolio-card__symbol";
  symbolEl.textContent = definition.symbol;

  const nameEl = document.createElement("span");
  nameEl.className = "portfolio-card__name";
  nameEl.textContent = definition.name;

  const indicatorEl = document.createElement("span");
  indicatorEl.className = "portfolio-card__indicator";
  const indicator = definition.indicator || {};
  if (indicator.label) {
    indicatorEl.textContent = indicator.label;
    applyIndicatorTone(indicatorEl, indicator.tone || null);
  } else {
    indicatorEl.hidden = true;
  }

  identity.append(symbolEl, nameEl, indicatorEl);

  const summaryEl = document.createElement("p");
  summaryEl.className = "portfolio-card__summary";
  summaryEl.textContent = getPortfolioSummarySnippet(definition.summary);

  main.append(identity, summaryEl);

  const meta = document.createElement("div");
  meta.className = "portfolio-card__meta";

  const labelEl = document.createElement("span");
  labelEl.className = "portfolio-card__label";
  labelEl.textContent = "Toplam değer";

  const valueEl = document.createElement("span");
  valueEl.className = "portfolio-card__value";
  valueEl.textContent = "0,00 GP";

  const quantityEl = document.createElement("span");
  quantityEl.className = "portfolio-card__quantity";
  quantityEl.textContent = `0,0000 ${definition.symbol}`;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "portfolio-card__cta";
  button.setAttribute("data-open-coin", definition.symbol);
  button.textContent = "Detaylara bak";

  meta.append(labelEl, valueEl, quantityEl, button);

  card.append(main, meta);

  return {
    card,
    symbolEl,
    nameEl,
    indicatorEl,
    summaryEl,
    valueEl,
    quantityEl,
    button,
  };
};

const updatePortfolioDisplay = () => {
  const hasList = Boolean(portfolioList);
  if (!hasList) {
    if (portfolioEmptyEl) {
      portfolioEmptyEl.hidden = true;
      portfolioEmptyEl.setAttribute("aria-hidden", "true");
    }
    return;
  }

  const activeSymbols = [];

  COIN_DEFINITIONS.forEach((definition) => {
    const symbol = definition.symbol;
    const amount = getHoldingAmount(symbol);
    const existing = portfolioEntries.get(symbol);

    if (amount > 0) {
      activeSymbols.push(symbol);
      const state = getCoinState(symbol);
      const value = roundToCents(amount * state.price);
      let entry = existing;
      if (!entry) {
        entry = createPortfolioCardEntry(definition);
        portfolioEntries.set(symbol, entry);
      }

      entry.card.setAttribute("data-portfolio-item", symbol);
      entry.card.setAttribute("data-symbol", symbol);
      if (entry.symbolEl) {
        entry.symbolEl.textContent = symbol;
      }
      if (entry.nameEl) {
        entry.nameEl.textContent = definition.name;
      }
      if (entry.summaryEl) {
        entry.summaryEl.textContent = getPortfolioSummarySnippet(definition.summary);
      }
      if (entry.indicatorEl) {
        const indicator = definition.indicator || {};
        if (indicator.label) {
          entry.indicatorEl.textContent = indicator.label;
          entry.indicatorEl.hidden = false;
          applyIndicatorTone(entry.indicatorEl, indicator.tone || null);
        } else {
          entry.indicatorEl.textContent = "";
          entry.indicatorEl.hidden = true;
          applyIndicatorTone(entry.indicatorEl, null);
        }
      }
      if (entry.button) {
        entry.button.setAttribute("data-open-coin", symbol);
      }

      if (entry.valueEl) {
        entry.valueEl.textContent = formatMemoWithSymbol(value);
      }
      if (entry.quantityEl) {
        entry.quantityEl.textContent = `${formatHoldings(amount)} ${symbol}`;
      }
    } else if (existing) {
      existing.card.remove();
      portfolioEntries.delete(symbol);
    }
  });

  const hasItems = activeSymbols.length > 0;

  if (hasItems) {
    activeSymbols.forEach((symbol) => {
      const entry = portfolioEntries.get(symbol);
      if (!entry) {
        return;
      }
      if (entry.card.parentElement !== portfolioList) {
        portfolioList.appendChild(entry.card);
      } else {
        portfolioList.appendChild(entry.card);
      }
    });
  } else {
    portfolioList.innerHTML = "";
  }

  portfolioList.hidden = !hasItems;
  portfolioList.setAttribute("aria-hidden", hasItems ? "false" : "true");

  if (portfolioEmptyEl) {
    portfolioEmptyEl.hidden = hasItems;
    portfolioEmptyEl.setAttribute("aria-hidden", hasItems ? "true" : "false");
  }
  updateWalletHoldings();
};

updateBalanceDisplay();
updatePortfolioDisplay();

const focusNextFrame = (element) => {
  if (!element) return;
  requestAnimationFrame(() => {
    element.focus();
  });
};

const LEVERAGE_MULTIPLIERS = [2, 3, 5, 10];
const LEVERAGE_DIRECTION_LABELS = {
  long: "Yükseliş (Long)",
  short: "Düşüş (Short)",
};

const formatDisplayWithSymbol = (value) =>
  activeCurrency === "USD"
    ? formatUSD(convertToCurrency(value, "USD"))
    : formatMemoWithSymbol(value);

const formatSignedDisplay = (value) => {
  if (activeCurrency === "USD") {
    const converted = convertToCurrency(value, "USD");
    const formatted = formatUSD(Math.abs(converted));
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  }
  return formatSignedMemoWithSymbol(value);
};

const createPositionId = (symbol) =>
  `${symbol}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const getLeveragePositionForSymbol = (symbol) =>
  leveragePositions.find((position) => position.symbol === symbol) || null;

const computeLeverageMetrics = (position, currentPrice) => {
  const margin = roundToCents(position.margin || 0);
  const entryPrice = roundToCents(position.entryPrice || 0);
  const multiplier = Number.isFinite(position.multiplier) ? position.multiplier : 1;
  const direction = position.direction === "short" ? "short" : "long";
  if (entryPrice <= 0) {
    return {
      pnl: 0,
      value: margin,
      percent: 0,
    };
  }
  const price = roundToCents(currentPrice);
  const priceDiff = direction === "long" ? price - entryPrice : entryPrice - price;
  const pnl = roundToCents((priceDiff / entryPrice) * multiplier * margin);
  const value = roundToCents(margin + pnl);
  const percent = margin > 0 ? (pnl / margin) * 100 : 0;
  return {
    pnl,
    value,
    percent,
  };
};

const getLeveragePositionsValue = () =>
  roundToCents(
    leveragePositions.reduce((total, position) => {
      const state = getCoinState(position.symbol);
      const metrics = computeLeverageMetrics(position, state ? state.price : position.entryPrice);
      return total + Math.max(0, metrics.value);
    }, 0)
  );

const getLeverageEquity = () => roundToCents(leverageBalance + getLeveragePositionsValue());

const getLeverageProfit = () => roundToCents(getLeverageEquity() - leverageContribution);

const setLeverageStatus = (symbol, message) => {
  const cardEntry = leverageCards.get(symbol);
  if (cardEntry && cardEntry.statusEl) {
    cardEntry.statusEl.textContent = message;
  }
};

const broadcastLeverageStatus = (message, { onlyIdle = false } = {}) => {
  leverageCards.forEach((_, symbol) => {
    if (onlyIdle && getLeveragePositionForSymbol(symbol)) {
      return;
    }
    setLeverageStatus(symbol, message);
  });
};

const resetLeverageForm = (cardEntry) => {
  if (!cardEntry) {
    return;
  }
  if (cardEntry.amountInput) {
    cardEntry.amountInput.value = "";
  }
  if (cardEntry.errorEl) {
    cardEntry.errorEl.textContent = "";
  }
};

const selectLeverageMultiplier = (cardEntry, multiplier) => {
  if (!cardEntry) {
    return;
  }
  cardEntry.selectedMultiplier = multiplier;
  if (cardEntry.multiplierButtons) {
    cardEntry.multiplierButtons.forEach((button) => {
      const value = parseFloat(button.dataset.leverageMultiplier);
      const isActive = value === multiplier;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }
};

const selectLeverageDirection = (cardEntry, direction) => {
  if (!cardEntry) {
    return;
  }
  const normalized = direction === "short" ? "short" : "long";
  cardEntry.selectedDirection = normalized;
  if (cardEntry.directionButtons) {
    cardEntry.directionButtons.forEach((button) => {
      const isActive = button.dataset.direction === normalized;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }
};

const updateLeverageSummary = () => {
  const equity = getLeverageEquity();
  const free = leverageBalance;
  const openValue = getLeveragePositionsValue();
  const profit = getLeverageProfit();

  if (leverageHeroBalanceEl) {
    leverageHeroBalanceEl.textContent = formatDisplayForCurrency(equity);
  }
  if (leverageHeroFreeEl) {
    leverageHeroFreeEl.textContent = formatDisplayWithSymbol(free);
  }
  if (leverageHeroOpenEl) {
    leverageHeroOpenEl.textContent = formatDisplayWithSymbol(openValue);
  }
  if (leverageHeroProfitEl) {
    leverageHeroProfitEl.textContent = formatSignedDisplay(profit);
    leverageHeroProfitEl.classList.toggle("is-positive", profit > 0);
    leverageHeroProfitEl.classList.toggle("is-negative", profit < 0);
  }
};

const refreshLeverageUi = () => {
  if (activeView === "leverage") {
    updateBalanceDisplay();
  } else {
    updateLeverageSummary();
    updateProfitDisplay();
  }
};

const updateLeverageCardMetrics = (position, metrics) => {
  const cardEntry = leverageCards.get(position.symbol);
  if (!cardEntry) {
    return;
  }
  if (cardEntry.entryEl) {
    cardEntry.entryEl.textContent = formatMemoWithSymbol(position.entryPrice);
  }
  if (cardEntry.valueEl) {
    cardEntry.valueEl.textContent = formatDisplayWithSymbol(Math.max(0, metrics.value));
  }
  if (cardEntry.pnlEl) {
    cardEntry.pnlEl.textContent = formatSignedDisplay(metrics.pnl);
    cardEntry.pnlEl.classList.toggle("is-positive", metrics.pnl > 0);
    cardEntry.pnlEl.classList.toggle("is-negative", metrics.pnl < 0);
  }
  if (cardEntry.metaEl) {
    const label = LEVERAGE_DIRECTION_LABELS[position.direction] || "Pozisyon";
    cardEntry.metaEl.textContent = `${label} · x${position.multiplier} · Açılış: ${formatMemoWithSymbol(
      position.entryPrice
    )}`;
  }
  if (cardEntry.statusEl) {
    cardEntry.statusEl.textContent = "Pozisyon açık";
  }
};

const updateLeverageCardState = (symbol) => {
  const cardEntry = leverageCards.get(symbol);
  if (!cardEntry) {
    return;
  }
  const position = getLeveragePositionForSymbol(symbol);
  const hasPosition = Boolean(position);

  if (cardEntry.amountInput) {
    cardEntry.amountInput.disabled = hasPosition;
  }
  if (cardEntry.multiplierButtons) {
    cardEntry.multiplierButtons.forEach((button) => {
      button.disabled = hasPosition;
    });
  }
  if (cardEntry.directionButtons) {
    cardEntry.directionButtons.forEach((button) => {
      button.disabled = hasPosition;
    });
  }
  if (cardEntry.submitButton) {
    cardEntry.submitButton.disabled = hasPosition;
  }
  if (cardEntry.openSection) {
    cardEntry.openSection.hidden = !hasPosition;
    cardEntry.openSection.setAttribute("aria-hidden", hasPosition ? "false" : "true");
  }

  if (hasPosition && position) {
    const state = getCoinState(symbol);
    const metrics = computeLeverageMetrics(position, state ? state.price : position.entryPrice);
    updateLeverageCardMetrics(position, metrics);
  } else {
    if (cardEntry.statusEl) {
      cardEntry.statusEl.textContent = "Hazır";
    }
    resetLeverageForm(cardEntry);
  }
};

const updateAllLeverageCards = () => {
  leverageCards.forEach((_, symbol) => {
    updateLeverageCardState(symbol);
  });
};

const createLeverageCard = (definition) => {
  const card = createCoinCardElement(definition);
  card.classList.add("coin-card--leverage");
  const panel = document.createElement("div");
  const multiplierButtonsMarkup = LEVERAGE_MULTIPLIERS.map((multiplier, index) => {
    const isActive = index === 0;
    return `
      <button
        type="button"
        class="leverage-multiplier__button${isActive ? " is-active" : ""}"
        data-leverage-multiplier="${multiplier}"
        aria-pressed="${isActive ? "true" : "false"}"
      >
        ${multiplier}x
      </button>
    `;
  }).join("");

  panel.className = "leverage-panel";
  panel.innerHTML = `
    <div class="leverage-panel__header">
      <h4 class="leverage-panel__title">Kaldıraç işlemi</h4>
      <span class="leverage-panel__status" data-leverage-status>Hazır</span>
    </div>
    <form class="leverage-form" data-leverage-form>
      <label class="leverage-form__field">
        <span class="leverage-form__label">Marjin (GP)</span>
        <input type="number" min="1" step="0.01" placeholder="Örn. 500" data-leverage-amount required />
      </label>
      <div class="leverage-form__options">
        <span class="leverage-form__label">Kaldıraç katsayısı</span>
        <div class="leverage-multiplier" data-leverage-multipliers>
          ${multiplierButtonsMarkup}
        </div>
      </div>
      <div class="leverage-form__options">
        <span class="leverage-form__label">Yön</span>
        <div class="leverage-direction" data-leverage-direction>
          <button type="button" class="leverage-direction__button is-active" data-direction="long" aria-pressed="true">
            Yükseliş
          </button>
          <button type="button" class="leverage-direction__button" data-direction="short" aria-pressed="false">
            Düşüş
          </button>
        </div>
      </div>
      <p class="leverage-form__error" data-leverage-error></p>
      <button class="leverage-form__submit" type="submit" data-leverage-submit>İşlem aç</button>
    </form>
    <div class="leverage-open" data-leverage-open hidden aria-hidden="true">
      <div class="leverage-open__metrics">
        <p class="leverage-open__metric">
          <span>Özet</span>
          <span data-leverage-meta>${LEVERAGE_DIRECTION_LABELS.long} · x${LEVERAGE_MULTIPLIERS[0]}</span>
        </p>
        <p class="leverage-open__metric">
          <span>Giriş</span>
          <span data-leverage-entry>0,00 GP</span>
        </p>
        <p class="leverage-open__metric">
          <span>Değer</span>
          <span data-leverage-value>0,00 GP</span>
        </p>
        <p class="leverage-open__metric">
          <span>Kâr / zarar</span>
          <span data-leverage-pnl>+0,00 GP</span>
        </p>
      </div>
      <div class="leverage-open__actions">
        <button class="leverage-open__close" type="button" data-leverage-close>Pozisyonu kapat</button>
      </div>
    </div>
  `;
  card.appendChild(panel);

  const cardEntry = {
    symbol: definition.symbol,
    card,
    panel,
    statusEl: panel.querySelector("[data-leverage-status]"),
    form: panel.querySelector("[data-leverage-form]"),
    amountInput: panel.querySelector("[data-leverage-amount]"),
    multiplierButtons: Array.from(panel.querySelectorAll("[data-leverage-multiplier]")),
    directionButtons: Array.from(panel.querySelectorAll("[data-direction]")),
    errorEl: panel.querySelector("[data-leverage-error]"),
    submitButton: panel.querySelector("[data-leverage-submit]"),
    openSection: panel.querySelector("[data-leverage-open]"),
    entryEl: panel.querySelector("[data-leverage-entry]"),
    valueEl: panel.querySelector("[data-leverage-value]"),
    pnlEl: panel.querySelector("[data-leverage-pnl]"),
    metaEl: panel.querySelector("[data-leverage-meta]"),
    closeButton: panel.querySelector("[data-leverage-close]"),
    selectedMultiplier: LEVERAGE_MULTIPLIERS[0],
    selectedDirection: "long",
  };

  leverageCards.set(definition.symbol, cardEntry);

  if (cardEntry.multiplierButtons) {
    cardEntry.multiplierButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = parseFloat(button.dataset.leverageMultiplier);
        if (Number.isFinite(value)) {
          selectLeverageMultiplier(cardEntry, value);
        }
      });
    });
  }

  if (cardEntry.directionButtons) {
    cardEntry.directionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectLeverageDirection(cardEntry, button.dataset.direction);
      });
    });
  }

  if (cardEntry.amountInput) {
    cardEntry.amountInput.addEventListener("input", () => {
      if (cardEntry.errorEl) {
        cardEntry.errorEl.textContent = "";
      }
      setLeverageStatus(definition.symbol, "Hazır");
    });
  }

  if (cardEntry.form) {
    cardEntry.form.addEventListener("submit", (event) => {
      event.preventDefault();
      handleLeverageFormSubmit(definition.symbol, cardEntry);
    });
  }

  if (cardEntry.closeButton) {
    cardEntry.closeButton.addEventListener("click", () => {
      const position = getLeveragePositionForSymbol(definition.symbol);
      if (position) {
        settleLeveragePosition(position.id);
      }
    });
  }

  return card;
};

const createLeveragePositionEntry = (position) => {
  const card = document.createElement("article");
  card.className = "leverage-position-card";
  card.dataset.positionId = position.id;
  card.dataset.symbol = position.symbol;
  card.innerHTML = `
    <div class="leverage-position-card__info">
      <span class="leverage-position-card__symbol">${position.symbol}</span>
      <p class="leverage-position-card__note" data-leverage-position-note>
        ${LEVERAGE_DIRECTION_LABELS[position.direction] || "Pozisyon"} · x${position.multiplier} · Açılış: ${formatMemoWithSymbol(
    position.entryPrice
  )}
      </p>
    </div>
    <div class="leverage-position-card__metrics">
      <p class="leverage-position-card__metric" data-leverage-position-value>Değer: ${formatDisplayWithSymbol(
        position.margin
      )}</p>
      <p class="leverage-position-card__metric" data-leverage-position-pnl>Kâr / zarar: +0,00 GP</p>
    </div>
    <div class="leverage-position-card__actions">
      <button class="leverage-position-card__detail" type="button" data-open-coin="${position.symbol}">Detaylara bak</button>
      <button class="leverage-position-card__close" type="button" data-leverage-position-close="${position.id}">Pozisyonu kapat</button>
    </div>
  `;

  const entry = {
    card,
    noteEl: card.querySelector("[data-leverage-position-note]"),
    valueEl: card.querySelector("[data-leverage-position-value]"),
    pnlEl: card.querySelector("[data-leverage-position-pnl]"),
    detailButton: card.querySelector("[data-open-coin]"),
    closeButton: card.querySelector("[data-leverage-position-close]"),
  };

  if (entry.detailButton) {
    entry.detailButton.addEventListener("click", () => {
      highlightCoinCard(position.symbol);
      openCoinModal(position.symbol);
    });
  }

  if (entry.closeButton) {
    entry.closeButton.addEventListener("click", () => {
      settleLeveragePosition(position.id);
    });
  }

  leveragePositionEntries.set(position.id, entry);
  return entry;
};

const updateLeveragePositionEntry = (position, metrics) => {
  const entry = leveragePositionEntries.get(position.id);
  if (!entry) {
    return;
  }
  if (entry.noteEl) {
    entry.noteEl.textContent = `${LEVERAGE_DIRECTION_LABELS[position.direction] || "Pozisyon"} · x${
      position.multiplier
    } · Açılış: ${formatMemoWithSymbol(position.entryPrice)}`;
  }
  if (entry.valueEl) {
    entry.valueEl.textContent = `Değer: ${formatDisplayWithSymbol(Math.max(0, metrics.value))}`;
  }
  if (entry.pnlEl) {
    entry.pnlEl.textContent = `Kâr / zarar: ${formatSignedDisplay(metrics.pnl)} (${formatSignedPercent(
      metrics.percent
    )})`;
    entry.pnlEl.classList.toggle("is-positive", metrics.pnl > 0);
    entry.pnlEl.classList.toggle("is-negative", metrics.pnl < 0);
  }
};

const updateLeveragePositionsDisplay = () => {
  if (!leveragePositionsList) {
    return;
  }

  if (!leveragePositions.length) {
    leveragePositionEntries.forEach((entry) => {
      entry.card.remove();
    });
    leveragePositionEntries.clear();
    if (leveragePositionsEmptyEl) {
      leveragePositionsEmptyEl.hidden = false;
      leveragePositionsEmptyEl.setAttribute("aria-hidden", "false");
    }
    leveragePositionsList.hidden = true;
    leveragePositionsList.setAttribute("aria-hidden", "true");
    return;
  }

  const seen = new Set();
  leveragePositions.forEach((position) => {
    let entry = leveragePositionEntries.get(position.id);
    if (!entry) {
      entry = createLeveragePositionEntry(position);
    }
    seen.add(position.id);
    leveragePositionsList.appendChild(entry.card);
    const state = getCoinState(position.symbol);
    const metrics = computeLeverageMetrics(position, state ? state.price : position.entryPrice);
    updateLeveragePositionEntry(position, metrics);
  });

  leveragePositionEntries.forEach((entry, id) => {
    if (!seen.has(id)) {
      entry.card.remove();
      leveragePositionEntries.delete(id);
    }
  });

  if (leveragePositionsEmptyEl) {
    leveragePositionsEmptyEl.hidden = true;
    leveragePositionsEmptyEl.setAttribute("aria-hidden", "true");
  }
  leveragePositionsList.hidden = false;
  leveragePositionsList.setAttribute("aria-hidden", "false");
};

const openLeveragePosition = (symbol, { margin, multiplier, direction }) => {
  const state = getCoinState(symbol);
  if (!state) {
    return null;
  }
  const price = roundToCents(state.price);
  if (price <= 0) {
    setLeverageStatus(symbol, "Fiyat sıfırken pozisyon açılamaz.");
    return null;
  }
  const cleanMargin = roundToCents(margin);
  if (cleanMargin <= 0) {
    setLeverageStatus(symbol, "Lütfen geçerli bir tutar girin.");
    return null;
  }
  if (cleanMargin > leverageBalance) {
    setLeverageStatus(symbol, "Kaldıraç cüzdanında yeterli bakiye yok.");
    return null;
  }

  leverageBalance = roundToCents(Math.max(0, leverageBalance - cleanMargin));
  safelyPersistLeverageBalance(leverageBalance);

  const position = {
    id: createPositionId(symbol),
    symbol,
    margin: cleanMargin,
    multiplier: Number.isFinite(multiplier) ? multiplier : LEVERAGE_MULTIPLIERS[0],
    direction: direction === "short" ? "short" : "long",
    entryPrice: price,
    openedAt: Date.now(),
  };

  leveragePositions.push(position);
  safelyPersistLeveragePositions(leveragePositions);
  updateLeverageCardState(symbol);
  updateLeveragePositionsDisplay();
  refreshLeverageUi();
  return position;
};

const settleLeveragePosition = (positionId, { settlementPrice, reason } = {}) => {
  const index = leveragePositions.findIndex((position) => position.id === positionId);
  if (index === -1) {
    return null;
  }
  const position = leveragePositions[index];
  const state = getCoinState(position.symbol);
  const price = Number.isFinite(settlementPrice)
    ? settlementPrice
    : state
    ? state.price
    : position.entryPrice;
  const metrics = computeLeverageMetrics(position, price);
  const payout = Math.max(0, metrics.value);
  leverageBalance = roundToCents(leverageBalance + payout);
  safelyPersistLeverageBalance(leverageBalance);
  leveragePositions.splice(index, 1);
  safelyPersistLeveragePositions(leveragePositions);
  updateLeverageCardState(position.symbol);
  updateLeveragePositionsDisplay();
  refreshLeverageUi();
  if (reason === "liquidation") {
    setLeverageStatus(position.symbol, "Pozisyon tasfiye edildi");
  } else {
    setLeverageStatus(position.symbol, "Pozisyon kapatıldı");
  }
  return { position, metrics };
};

const updateLeverageForSymbol = (symbol) => {
  const position = getLeveragePositionForSymbol(symbol);
  if (!position) {
    return;
  }
  const state = getCoinState(symbol);
  const metrics = computeLeverageMetrics(position, state ? state.price : position.entryPrice);
  if (metrics.value <= 0) {
    settleLeveragePosition(position.id, { settlementPrice: state ? state.price : position.entryPrice, reason: "liquidation" });
    return;
  }
  updateLeverageCardMetrics(position, metrics);
  updateLeveragePositionEntry(position, metrics);
  refreshLeverageUi();
};

const handleLeverageFormSubmit = (symbol, cardEntry) => {
  if (!cardEntry) {
    return;
  }
  const amountInput = cardEntry.amountInput;
  const errorEl = cardEntry.errorEl;
  const rawAmount = amountInput ? parseFloat(amountInput.value) : NaN;
  if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
    if (errorEl) {
      errorEl.textContent = "Lütfen geçerli bir tutar girin.";
    }
    setLeverageStatus(symbol, "Hazır");
    return;
  }
  const margin = roundToCents(rawAmount);
  if (margin > leverageBalance) {
    if (errorEl) {
      errorEl.textContent = "Kaldıraç cüzdanında yeterli bakiye yok.";
    }
    setLeverageStatus(symbol, "Yetersiz bakiye");
    return;
  }
  const state = getCoinState(symbol);
  if (!state || state.price <= 0) {
    if (errorEl) {
      errorEl.textContent = "Fiyat sıfırken pozisyon açılamaz.";
    }
    setLeverageStatus(symbol, "Fiyat sıfır");
    return;
  }
  const multiplier = cardEntry.selectedMultiplier || LEVERAGE_MULTIPLIERS[0];
  const direction = cardEntry.selectedDirection || "long";
  openLeveragePosition(symbol, { margin, multiplier, direction });
  if (cardEntry.amountInput) {
    cardEntry.amountInput.value = "";
  }
  if (errorEl) {
    errorEl.textContent = "";
  }
};

const runInlineLoader = (message, duration = 2000, completionMessage = "Tamamlandı!") =>
  new Promise((resolve) => {
    if (!inlineLoader) {
      window.setTimeout(resolve, duration);
      return;
    }

    inlineLoaderToken += 1;
    const token = inlineLoaderToken;

    if (inlineLoaderTimeoutId !== null) {
      window.clearTimeout(inlineLoaderTimeoutId);
      inlineLoaderTimeoutId = null;
    }
    if (typeof inlineLoaderResolve === "function") {
      inlineLoaderResolve();
      inlineLoaderResolve = null;
    }

    inlineLoader.hidden = false;
    inlineLoader.setAttribute("aria-hidden", "false");
    inlineLoader.classList.remove("is-ding");
    if (inlineLoaderStatus) {
      inlineLoaderStatus.textContent = message;
    }

    inlineLoaderResolve = resolve;

    inlineLoaderTimeoutId = window.setTimeout(() => {
      if (token !== inlineLoaderToken) {
        resolve();
        return;
      }
      inlineLoader.classList.add("is-ding");
      if (inlineLoaderStatus) {
        inlineLoaderStatus.textContent = completionMessage;
      }
      window.setTimeout(() => {
        if (token !== inlineLoaderToken) {
          resolve();
          return;
        }
        inlineLoader.classList.remove("is-ding");
        inlineLoader.hidden = true;
        inlineLoader.setAttribute("aria-hidden", "true");
        if (inlineLoaderStatus) {
          inlineLoaderStatus.textContent = message;
        }
        inlineLoaderTimeoutId = null;
        inlineLoaderResolve = null;
        resolve();
      }, 600);
    }, duration);
  });

const updateLeverageAccessVisibility = () => {
  if (leverageIntro) {
    leverageIntro.hidden = leverageUnlocked;
    leverageIntro.setAttribute("aria-hidden", leverageUnlocked ? "true" : "false");
  }
  if (leverageDashboard) {
    leverageDashboard.hidden = !leverageUnlocked;
    leverageDashboard.setAttribute("aria-hidden", leverageUnlocked ? "false" : "true");
  }
};

const switchView = (view) => {
  const targetView = view === "leverage" ? "leverage" : "exchange";
  if (activeView === targetView) {
    return;
  }
  activeView = targetView;
  viewTabs.forEach((tab) => {
    const tabView = tab.dataset.viewTab;
    const isActive = tabView === targetView;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  if (exchangeView) {
    exchangeView.hidden = targetView !== "exchange";
    exchangeView.setAttribute("aria-hidden", targetView !== "exchange" ? "true" : "false");
  }
  if (leverageView) {
    leverageView.hidden = targetView !== "leverage";
    leverageView.setAttribute("aria-hidden", targetView !== "leverage" ? "true" : "false");
  }
  viewControls.forEach((control) => {
    const controlView = control.dataset.viewControl;
    control.hidden = controlView !== targetView;
  });
  if (targetView === "leverage") {
    updateLeverageSummary();
  }
  updateBalanceDisplay();
};

const createLeverageTransferFlow = (type) => {
  const modal = leverageTransferModals[type];
  if (!modal) {
    return null;
  }
  const backdrop = modal.querySelector(".transfer-modal__backdrop");
  const closeButton = modal.querySelector(".transfer-modal__close");
  const form = modal.querySelector(`[data-leverage-transfer-form='${type}']`);
  const amountInput = form ? form.querySelector("input") : null;
  const errorEl = form ? form.querySelector(".transfer-form__error") : null;

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
  };

  const openModal = () => {
    if (!leverageUnlocked) {
      switchView("leverage");
      if (leverageOnboardButton) {
        leverageOnboardButton.focus({ preventScroll: true });
      }
      return;
    }
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    if (amountInput) {
      amountInput.value = "";
      amountInput.focus({ preventScroll: true });
    }
    if (errorEl) {
      errorEl.textContent = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!amountInput) {
      return;
    }
    const raw = parseFloat(amountInput.value);
    if (!Number.isFinite(raw) || raw <= 0) {
      if (errorEl) {
        errorEl.textContent = "Lütfen geçerli bir tutar girin.";
      }
      return;
    }
    const amount = roundToCents(raw);
    if (type === "deposit" && amount > cashBalance) {
      if (errorEl) {
        errorEl.textContent = "Normal cüzdanda yeterli bakiye yok.";
      }
      return;
    }
    if (type === "withdraw" && amount > leverageBalance) {
      if (errorEl) {
        errorEl.textContent = "Kaldıraç cüzdanında yeterli bakiye yok.";
      }
      return;
    }

    if (errorEl) {
      errorEl.textContent = "";
    }

    await runInlineLoader("Aktarılıyor...", type === "deposit" ? 2000 : 2000, "Tamamlandı!");

    if (type === "deposit") {
      cashBalance = roundToCents(Math.max(0, cashBalance - amount));
      leverageBalance = roundToCents(leverageBalance + amount);
      leverageContribution = roundToCents(leverageContribution + amount);
      safelyPersistBalance(cashBalance);
      safelyPersistLeverageBalance(leverageBalance);
      safelyPersistLeverageContribution(leverageContribution);
    } else {
      leverageBalance = roundToCents(Math.max(0, leverageBalance - amount));
      cashBalance = roundToCents(cashBalance + amount);
      leverageContribution = roundToCents(Math.max(0, leverageContribution - amount));
      safelyPersistLeverageBalance(leverageBalance);
      safelyPersistLeverageContribution(leverageContribution);
      safelyPersistBalance(cashBalance);
    }

    updateAllLeverageCards();
    refreshLeverageUi();
    const statusMessage =
      type === "deposit"
        ? "Bakiye kaldıraç hesabına aktarıldı"
        : "Bakiye normal hesaba aktarıldı";
    broadcastLeverageStatus(statusMessage, { onlyIdle: true });
    closeModal();
  };

  const handleClick = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (target.dataset.close === "true" || target === backdrop) {
      closeModal();
    }
  };

  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
  if (backdrop) {
    backdrop.addEventListener("click", handleClick);
  }
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeModal();
    });
  }

  return {
    open: openModal,
    close: closeModal,
  };
};

const leverageTransferFlows = {
  deposit: createLeverageTransferFlow("deposit"),
  withdraw: createLeverageTransferFlow("withdraw"),
};

const handleLeverageOnboard = async () => {
  if (leverageUnlocked) {
    switchView("leverage");
    return;
  }
  if (leverageOnboardButton) {
    leverageOnboardButton.disabled = true;
  }
  try {
    await runInlineLoader("Doğrulanıyor...", 20000, "Hazır!");
    leverageUnlocked = true;
    safelyPersistLeverageUnlocked(true);
    updateLeverageAccessVisibility();
    updateAllLeverageCards();
    refreshLeverageUi();
    switchView("leverage");
    const primaryDepositButton = leverageDepositButtons.find((button) => !button.hidden);
    if (primaryDepositButton) {
      primaryDepositButton.focus({ preventScroll: true });
    }
  } catch (error) {
    console.error("Kaldıraç erişimi başlatılırken hata oluştu", error);
  } finally {
    if (leverageOnboardButton) {
      leverageOnboardButton.disabled = false;
    }
  }
};

const sanitizeCardNumber = (value) => value.replace(/\s+/g, "");

const isValidCardNumber = (value) => {
  const sanitized = sanitizeCardNumber(value);
  if (!/^\d+$/.test(sanitized)) {
    return false;
  }
  return ALLOWED_CARD_NUMBERS.has(sanitized);
};

const createFundsFlow = ({ modal, trigger, validateAmount, onSuccess }) => {
  if (!modal) {
    return null;
  }

  const detailsForm = modal.querySelector(".funds-form--details");
  const verifyForm = modal.querySelector(".funds-form--verify");
  const detailsError = detailsForm
    ? detailsForm.querySelector(".funds-form__error")
    : null;
  const verifyError = verifyForm
    ? verifyForm.querySelector(".funds-form__error")
    : null;
  const amountInput = detailsForm
    ? detailsForm.querySelector("input[type='number']")
    : null;
  const cardInput = detailsForm
    ? detailsForm.querySelector("input[type='text']")
    : null;
  const codeInput = verifyForm
    ? verifyForm.querySelector("input[type='text']")
    : null;
  const verifyAmountInput = verifyForm
    ? verifyForm.querySelector("[data-verify-amount]")
    : null;
  const verifyTimestamp = modal.querySelector(
    ".funds-step--verify [data-verify-timestamp]"
  );

  let pendingAmount = 0;

  const updateVerifyAmountDisplay = () => {
    if (!verifyAmountInput) {
      return;
    }
    const value = pendingAmount > 0 ? `${formatMemo(pendingAmount)} GP` : "0,00 GP";
    verifyAmountInput.value = value;
  };

  const updateVerifyTimestampDisplay = () => {
    if (!verifyTimestamp) {
      return;
    }
    verifyTimestamp.textContent = VERIFICATION_DATETIME_FORMATTER.format(
      new Date()
    );
  };

  const resetDetailsForm = () => {
    if (!detailsForm) return;
    detailsForm.reset();
    if (detailsError) {
      detailsError.textContent = "";
    }
  };

  const resetVerifyForm = () => {
    if (!verifyForm) return;
    verifyForm.reset();
    if (verifyError) {
      verifyError.textContent = "";
    }
    updateVerifyAmountDisplay();
  };

  const setStep = (step) => {
    modal.setAttribute("data-step", step);
    if (step === "amount") {
      focusNextFrame(amountInput);
    } else if (step === "verify") {
      updateVerifyTimestampDisplay();
      focusNextFrame(codeInput);
    } else if (step === "success") {
      const closeButton = modal.querySelector(
        ".funds-step--success [data-close='true'], .funds-step--success button"
      );
      focusNextFrame(closeButton);
    }
  };

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute("data-step", "amount");
    pendingAmount = 0;
    resetDetailsForm();
    resetVerifyForm();
    document.removeEventListener("keydown", handleKeydown);
  };

  const openModal = () => {
    modal.hidden = false;
    pendingAmount = 0;
    resetDetailsForm();
    resetVerifyForm();
    updateVerifyTimestampDisplay();
    setStep("amount");
    document.addEventListener("keydown", handleKeydown);
  };

  const handleDetailsSubmit = (event) => {
    event.preventDefault();
    if (!amountInput || !cardInput) return;

    const amountValue = parseFloat(amountInput.value);

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      if (detailsError) {
        detailsError.textContent = "Lütfen 0'dan büyük bir tutar girin.";
      }
      return;
    }

    if (!isValidCardNumber(cardInput.value)) {
      if (detailsError) {
        detailsError.textContent = "Kart numarası geçersiz.";
      }
      return;
    }

    const roundedAmount = roundToCents(amountValue);
    const validation = validateAmount(roundedAmount);

    if (!validation.ok) {
      if (detailsError) {
        detailsError.textContent = validation.message;
      }
      return;
    }

    pendingAmount = validation.amount;
    if (detailsError) {
      detailsError.textContent = "";
    }
    resetVerifyForm();
    updateVerifyAmountDisplay();
    setStep("verify");
  };

  const handleVerifySubmit = (event) => {
    event.preventDefault();
    if (!codeInput) return;

    if (pendingAmount <= 0) {
      if (detailsError) {
        detailsError.textContent = "Lütfen önce geçerli bir tutar girin.";
      }
      setStep("amount");
      return;
    }

    const code = codeInput.value.trim();

    if (!isVerificationCodeRecognised(code)) {
      if (verifyError) {
        verifyError.textContent = "Geçerli bir doğrulama kodu girin.";
      }
      return;
    }

    if (!isVerificationCodeAvailable(code)) {
      if (verifyError) {
        verifyError.textContent = "Bu doğrulama kodu zaten kullanıldı.";
      }
      return;
    }

    if (verifyError) {
      verifyError.textContent = "";
    }

    onSuccess(pendingAmount);
    markVerificationCodeUsed(code);
    pendingAmount = 0;
    resetDetailsForm();
    resetVerifyForm();
    updateVerifyAmountDisplay();
    setStep("success");
  };

  const handleModalClick = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.close === "true") {
      closeModal();
    }
  };

  function handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    }
  }

  if (trigger) {
    trigger.addEventListener("click", openModal);
  }

  modal.addEventListener("click", handleModalClick);

  if (detailsForm) {
    detailsForm.addEventListener("submit", handleDetailsSubmit);
  }

  if (verifyForm) {
    verifyForm.addEventListener("submit", handleVerifySubmit);
  }

  return {
    close: closeModal,
    open: openModal,
  };
};

const depositModal = document.querySelector(".funds-modal--deposit");
const withdrawModal = document.querySelector(".funds-modal--withdraw");

createFundsFlow({
  modal: depositModal,
  trigger: addFundsButton,
  validateAmount: (amount) => ({
    ok: true,
    amount,
  }),
  onSuccess: (amount) => {
    const newBalance = roundToCents(cashBalance + amount);
    cashBalance = newBalance;
    safelyPersistBalance(cashBalance);
    netContribution = roundToCents(netContribution + amount);
    safelyPersistContribution(netContribution);
    updateBalanceDisplay();
    refreshAllCoinSummaries();
    if (coinModal && !coinModal.hidden) {
      updateModalSnapshot();
      updateTradeHelpers();
      drawChart();
    }
  },
});

createFundsFlow({
  modal: withdrawModal,
  trigger: withdrawButton,
  validateAmount: (amount) => {
    if (amount > cashBalance) {
      return {
        ok: false,
        message: "Erişilebilir bakiyenizden daha fazla tutar çekemezsiniz.",
      };
    }
    return {
      ok: true,
      amount,
    };
  },
  onSuccess: (amount) => {
    const newBalance = roundToCents(Math.max(0, cashBalance - amount));
    cashBalance = newBalance;
    safelyPersistBalance(cashBalance);
    netContribution = roundToCents(netContribution - amount);
    safelyPersistContribution(netContribution);
    updateBalanceDisplay();
    refreshAllCoinSummaries();
    if (coinModal && !coinModal.hidden) {
      updateModalSnapshot();
      updateTradeHelpers();
      drawChart();
    }
  },
});

const updateCurrencyToggleState = () => {
  currencyToggleButtons.forEach((button) => {
    const currency = button.dataset.currency;
    const isActive = currency === activeCurrency;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
};

const setActiveCurrency = (currency) => {
  activeCurrency = currency === "USD" ? "USD" : LOCAL_CURRENCY_CODE;
  updateCurrencyToggleState();
  updateBalanceDisplay();
};

currencyToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const currency = button.dataset.currency;
    setActiveCurrency(currency);
  });
});

viewTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchView(tab.dataset.viewTab);
  });
});

leverageDepositButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const flow = leverageTransferFlows.deposit;
    if (flow) {
      flow.open();
    }
  });
});

leverageWithdrawButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const flow = leverageTransferFlows.withdraw;
    if (flow) {
      flow.open();
    }
  });
});

if (leverageOnboardButton) {
  leverageOnboardButton.addEventListener("click", handleLeverageOnboard);
}

updateCurrencyToggleState();

const updateTimeframeButtonStates = (buttonsMap, activeKey) => {
  buttonsMap.forEach((button, key) => {
    if (!button) return;
    const isActive = key === activeKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
};

const setActiveTimeframe = (key) => {
  const resolved = sanitizeTimeframeKey(key);
  activeTimeframeKey = resolved;
  updateTimeframeButtonStates(timeframeButtons, resolved);
  drawChart();
};

const setDetailActiveTimeframe = (key) => {
  const resolved = sanitizeTimeframeKey(key);
  detailActiveTimeframeKey = resolved;
  updateTimeframeButtonStates(detailTimeframeButtons, resolved);
  drawDetailChart();
};

const ensureTimeframeControls = () => {
  if (!timeframeControls) {
    return;
  }
  if (!timeframeButtons.size) {
    timeframeControls.innerHTML = "";
    CHART_TIMEFRAMES.forEach((frame) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = frame.label;
      button.dataset.timeframe = frame.key;
      button.setAttribute("aria-pressed", frame.key === activeTimeframeKey ? "true" : "false");
      if (frame.key === activeTimeframeKey) {
        button.classList.add("is-active");
      }
      button.addEventListener("click", () => {
        setActiveTimeframe(frame.key);
      });
      timeframeControls.appendChild(button);
      timeframeButtons.set(frame.key, button);
    });
  }
  refreshTimeframeAvailability();
};

const ensureDetailTimeframeControls = () => {
  if (!detailTimeframeControls) {
    return;
  }
  if (!detailTimeframeButtons.size) {
    detailTimeframeControls.innerHTML = "";
    CHART_TIMEFRAMES.forEach((frame) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = frame.label;
      button.dataset.timeframe = frame.key;
      button.setAttribute(
        "aria-pressed",
        frame.key === detailActiveTimeframeKey ? "true" : "false"
      );
      if (frame.key === detailActiveTimeframeKey) {
        button.classList.add("is-active");
      }
      button.addEventListener("click", () => {
        setDetailActiveTimeframe(frame.key);
      });
      detailTimeframeControls.appendChild(button);
      detailTimeframeButtons.set(frame.key, button);
    });
  }
  refreshTimeframeAvailability();
};

ensureTimeframeControls();
ensureDetailTimeframeControls();

const formatTimestampForFrame = (timestamp, frame) => {
  try {
    const options = (() => {
      if (frame && frame.mode === "today") {
        return { hour: "2-digit", minute: "2-digit" };
      }
      if (!frame || frame.minutes === null) {
        return { year: "numeric", month: "short", day: "2-digit" };
      }
      if (frame.minutes <= 24 * 60) {
        return { hour: "2-digit", minute: "2-digit" };
      }
      if (frame.minutes <= 7 * 24 * 60) {
        return { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" };
      }
      if (frame.minutes <= 365 * 24 * 60) {
        return { day: "2-digit", month: "short", year: "numeric" };
      }
      return { year: "numeric", month: "short" };
    })();
    return new Intl.DateTimeFormat("tr-TR", options).format(new Date(timestamp));
  } catch (error) {
    return new Date(timestamp).toLocaleString();
  }
};

const symbolSeedCache = new Map();

const getSymbolSeed = (symbol) => {
  if (symbolSeedCache.has(symbol)) {
    return symbolSeedCache.get(symbol);
  }
  let hash = 0;
  for (let i = 0; i < symbol.length; i += 1) {
    hash = (hash << 5) - hash + symbol.charCodeAt(i);
    hash |= 0;
  }
  const unsignedHash = hash >>> 0;
  symbolSeedCache.set(symbol, unsignedHash);
  return unsignedHash;
};

const buildDeterministicTimeline = (symbol, timestamp) => {
  const minuteIndex = minuteIndexForTimestamp(timestamp);
  const definition = getCoinDefinition(symbol);
  const steps = definition && definition.priceSteps.length
    ? definition.priceSteps
    : [0.5, 1];
  let cache = getTimelineCache(symbol);

  if (cache.minuteIndex === null || minuteIndex < cache.minuteIndex) {
    resetTimelineCache(symbol);
    cache = getTimelineCache(symbol);
  }

  let { minuteIndex: lastComputedIndex, price, previousPrice, history } = cache;
  const startIndex = typeof lastComputedIndex === "number" ? lastComputedIndex + 1 : 1;
  const seedBase = getSymbolSeed(symbol) || 0;

  for (let index = startIndex; index <= minuteIndex; index += 1) {
    const stepSeed = seedBase ^ Math.imul(index, 0x9e3779b1);
    const directionSeed = seedBase ^ Math.imul(index + 1, 0x85ebca6b);
    const stepIndex = Math.floor(pseudoRandomFromSeed(stepSeed) * steps.length);
    const step = steps[stepIndex] || steps[0];
    let direction = pseudoRandomFromSeed(directionSeed) < 0.5 ? -1 : 1;
    if (price <= 0 && direction === -1) {
      direction = 1;
    }
    const nextPriceRaw = price + direction * step;
    let nextPrice = roundToCents(nextPriceRaw);
    if (nextPrice < 0) {
      nextPrice = 0;
    }
    if (price === 0 && nextPrice === 0) {
      nextPrice = step;
    }
    previousPrice = price;
    price = nextPrice;
    history.push({
      timestamp: MARKET_EPOCH + index * PRICE_INTERVAL,
      price,
    });
    if (history.length > HISTORY_LIMIT) {
      history.shift();
    }
  }

  const updatedCache = {
    minuteIndex,
    price,
    previousPrice,
    history,
  };
  setTimelineCache(symbol, updatedCache);
  return updatedCache;
};

const synchronizeCoinState = (symbol, timestamp = Date.now()) => {
  const state = getCoinState(symbol);
  const { price, previousPrice, history } = buildDeterministicTimeline(symbol, timestamp);
  state.previousPrice = previousPrice;
  state.price = price;
  state.history = history.slice();
  evaluateStopLossForSymbol(symbol);
  updateCoinSummaries(symbol);
  if (activeCoinSymbol === symbol) {
    updateModalSnapshot();
    updateTradeHelpers();
    if (coinModal && !coinModal.hidden) {
      drawChart();
    }
  }
  if (chartModal && !chartModal.hidden && detailChartSymbol === symbol) {
    drawDetailChart();
  }
  updateLeverageForSymbol(symbol);
};

const synchronizeAllCoins = () => {
  const now = Date.now();
  COIN_DEFINITIONS.forEach(({ symbol }) => {
    synchronizeCoinState(symbol, now);
  });
  updateBalanceDisplay();
  updatePortfolioDisplay();
  checkAiPlusRenewal();
};

const getHistoryWindow = (symbol, minutes) => {
  const state = getCoinState(symbol);
  const now = Date.now();
  const cutoffByMinutes = now - minutes * MS_IN_MINUTE;
  const startOfDay = getStartOfDayTimestamp(now);
  const cutoff = Math.max(startOfDay, cutoffByMinutes);
  return state.history.filter((entry) => entry.timestamp >= cutoff);
};

const getSeriesCacheKey = (symbol, timeframeKey, maxPoints) =>
  `${symbol}:${timeframeKey}:${maxPoints}`;

const generateSeries = (symbol, startIndex, endIndex, maxPoints) => {
  const definition = getCoinDefinition(symbol);
  if (!definition) {
    return { series: [], startPrice: 0, endPrice: 0, high: 0, low: 0 };
  }
  if (endIndex < startIndex) {
    const temp = startIndex;
    startIndex = endIndex;
    endIndex = temp;
  }
  const steps = definition.priceSteps.length ? definition.priceSteps : [0.5, 1];
  const seedBase = getSymbolSeed(symbol) || 0;
  let price = definition.initialPrice;
  let startPrice = definition.initialPrice;
  let high = definition.initialPrice;
  let low = definition.initialPrice;
  let rangeStarted = startIndex === 0;
  const series = [];
  const span = Math.max(1, endIndex - startIndex);
  const sampleCount = Math.max(2, Math.min(maxPoints, span + 1));
  const sampleInterval = Math.max(1, Math.floor(span / (sampleCount - 1)));

  if (startIndex === 0) {
    series.push({ timestamp: MARKET_EPOCH, price });
  }

  for (let index = 1; index <= endIndex; index += 1) {
    const stepSeed = seedBase ^ Math.imul(index, 0x9e3779b1);
    const directionSeed = seedBase ^ Math.imul(index + 1, 0x85ebca6b);
    const stepIndex = Math.floor(pseudoRandomFromSeed(stepSeed) * steps.length);
    const step = steps[stepIndex] || steps[0];
    let direction = pseudoRandomFromSeed(directionSeed) < 0.5 ? -1 : 1;
    if (price <= 0 && direction === -1) {
      direction = 1;
    }
    let nextPrice = roundToCents(price + direction * step);
    if (nextPrice < 0) {
      nextPrice = 0;
    }
    if (price === 0 && nextPrice === 0) {
      nextPrice = step;
    }
    price = nextPrice;

    if (index >= startIndex) {
      if (!rangeStarted) {
        startPrice = price;
        high = price;
        low = price;
        rangeStarted = true;
        series.push({ timestamp: MARKET_EPOCH + index * PRICE_INTERVAL, price });
        continue;
      }
      high = Math.max(high, price);
      low = Math.min(low, price);
      if ((index - startIndex) % sampleInterval === 0 || index === endIndex) {
        series.push({ timestamp: MARKET_EPOCH + index * PRICE_INTERVAL, price });
      }
    } else if (!rangeStarted) {
      // track potential range extrema before start for consistency
      high = Math.max(high, price);
      low = Math.min(low, price);
    }
  }

  if (!rangeStarted) {
    rangeStarted = true;
    startPrice = price;
    high = price;
    low = price;
    series.push({ timestamp: MARKET_EPOCH + endIndex * PRICE_INTERVAL, price });
  }

  return {
    series,
    startPrice,
    endPrice: price,
    high,
    low,
  };
};

const getSeriesForTimeframe = (symbol, timeframeKey, maxPoints = MAX_CHART_POINTS) => {
  const frame = timeframeLookup.get(timeframeKey) || timeframeLookup.get(DEFAULT_TIMEFRAME_KEY);
  const now = Date.now();
  const endIndex = minuteIndexForTimestamp(now);
  let startIndex = 0;
  let rangeStartTimestamp = MARKET_EPOCH;
  let rangeEndTimestamp = MARKET_EPOCH + endIndex * PRICE_INTERVAL;
  if (frame && frame.mode === "today") {
    const dayStartTimestamp = getStartOfDayTimestamp(now);
    startIndex = minuteIndexForTimestamp(dayStartTimestamp);
    rangeStartTimestamp = dayStartTimestamp;
    rangeEndTimestamp = getEndOfDayTimestamp(now);
  } else if (frame && typeof frame.minutes === "number" && Number.isFinite(frame.minutes)) {
    startIndex = Math.max(0, endIndex - frame.minutes);
    rangeStartTimestamp = MARKET_EPOCH + startIndex * PRICE_INTERVAL;
  }
  if (rangeEndTimestamp < rangeStartTimestamp) {
    rangeEndTimestamp = rangeStartTimestamp;
  }
  const key = getSeriesCacheKey(symbol, timeframeKey, maxPoints);
  const cached = seriesCache.get(key);
  if (cached && cached.minuteIndex === endIndex) {
    return cached;
  }
  const generated = generateSeries(symbol, startIndex, endIndex, maxPoints);
  const payload = {
    ...generated,
    minuteIndex: endIndex,
    timeframe: frame || null,
    rangeStart: rangeStartTimestamp,
    rangeEnd: rangeEndTimestamp,
    actualEnd: MARKET_EPOCH + endIndex * PRICE_INTERVAL,
  };
  seriesCache.set(key, payload);
  return payload;
};

const getSeriesForMinutes = (symbol, minutes, maxPoints = MAX_CHART_POINTS) => {
  const now = Date.now();
  const endIndex = minuteIndexForTimestamp(now);
  const minTimestamp = Math.max(
    getStartOfDayTimestamp(now),
    now - minutes * MS_IN_MINUTE
  );
  const startIndex = minuteIndexForTimestamp(minTimestamp);
  return generateSeries(symbol, startIndex, endIndex, maxPoints);
};

const formatPercent = (value) => {
  try {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    return value.toFixed(2);
  }
};

const formatSignedPercent = (value) => {
  const formatted = formatPercent(Math.abs(value));
  const sign = value >= 0 ? "+" : "-";
  return `${sign}${formatted}%`;
};

const updateCoinCardStats = (symbol, high, low) => {
  const entries = getCoinCardEntries(symbol);
  if (!entries.length) return;
  entries.forEach((elements) => {
    if (elements.highEl) {
      elements.highEl.textContent = formatMemoWithSymbol(high);
    }
    if (elements.lowEl) {
      elements.lowEl.textContent = formatMemoWithSymbol(low);
    }
  });
};

const updateCoinChangeClasses = (element, value) => {
  if (!element) return;
  element.classList.toggle("is-up", value > 0);
  element.classList.toggle("is-down", value < 0);
};

const updateCoinSummaries = (symbol) => {
  applyDefinitionToCoinCard(symbol);
  const definition = getCoinDefinition(symbol);
  const state = getCoinState(symbol);
  const { price, previousPrice } = state;
  const change = roundToCents(price - previousPrice);
  const historyWindow = getHistoryWindow(symbol, 24 * 60);
  const prices = historyWindow.map((entry) => entry.price);
  const high = prices.length ? Math.max(...prices) : price;
  const low = prices.length ? Math.min(...prices) : price;
  const analysis = definition ? analyzeCoinMomentum(definition) : null;

  const entries = getCoinCardEntries(symbol);
  entries.forEach((elements) => {
    if (elements.priceEl) {
      elements.priceEl.textContent = formatMemoWithSymbol(price);
    }
    if (elements.changeEl) {
      elements.changeEl.textContent = `${formatSignedMemo(change)} GP`;
      updateCoinChangeClasses(elements.changeEl, change);
    }
    if (elements.lastEl) {
      elements.lastEl.textContent = formatMemoWithSymbol(price);
    }
    if (elements.card) {
      elements.card.dataset.price = String(price);
      elements.card.dataset.change = String(change);
      elements.card.dataset.changePct = analysis ? String(analysis.changePct || 0) : "0";
      elements.card.dataset.volatility = analysis ? String(analysis.volatility || 0) : "0";
    }
  });

  updateCoinCardStats(symbol, high, low);
  scheduleCoinsLibrarySync();
};

const refreshAllCoinSummaries = () => {
  COIN_DEFINITIONS.forEach(({ symbol }) => updateCoinSummaries(symbol));
  renderRadar();
};

const updateModalSnapshot = () => {
  if (!coinModal) {
    return;
  }
  const symbol = activeCoinSymbol;
  if (!symbol) {
    return;
  }
  const state = getCoinState(symbol);
  const definition = getCoinDefinition(symbol);
  const holdingsAmount = getHoldingAmount(symbol);

  if (coinModalSymbolEl) {
    coinModalSymbolEl.textContent = symbol;
  }
  if (coinModalNameEl) {
    coinModalNameEl.textContent = definition ? definition.name : symbol;
  }
  if (coinModalIndicatorEl) {
    if (definition && definition.indicator && definition.indicator.label) {
      coinModalIndicatorEl.textContent = definition.indicator.label;
      coinModalIndicatorEl.hidden = false;
      applyIndicatorTone(coinModalIndicatorEl, definition.indicator.tone || null);
    } else {
      coinModalIndicatorEl.textContent = "";
      coinModalIndicatorEl.hidden = true;
      applyIndicatorTone(coinModalIndicatorEl, null);
    }
  }
  if (coinModalSummaryEl) {
    coinModalSummaryEl.textContent = definition ? definition.summary : "";
  }
  if (coinModalHoldingsLabelEl) {
    coinModalHoldingsLabelEl.textContent = `Portföydeki ${symbol}`;
  }
  if (coinModalHoldingsEl) {
    coinModalHoldingsEl.textContent = `${formatHoldings(holdingsAmount)} ${symbol}`;
  }
  if (coinModalCashEl) {
    coinModalCashEl.textContent = formatMemoWithSymbol(cashBalance);
  }
  if (coinModalTotalEl) {
    coinModalTotalEl.textContent = formatMemoWithSymbol(getPortfolioTotal());
  }
  if (coinModalPriceEl) {
    coinModalPriceEl.textContent = formatMemoWithSymbol(state.price);
  }
  if (coinModalChangeEl) {
    const change = roundToCents(state.price - state.previousPrice);
    coinModalChangeEl.textContent = `${formatSignedMemo(change)} GP`;
    updateCoinChangeClasses(coinModalChangeEl, change);
  }
  if (buyLabelEl) {
    buyLabelEl.textContent = "Ne kadarlık satın alınacak? (GP)";
  }
  if (sellLabelEl) {
    sellLabelEl.textContent = `Kaç ${symbol} satılacak?`;
  }
  if (coinModalUpdatedEl) {
    try {
      const formatter = new Intl.DateTimeFormat("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      coinModalUpdatedEl.textContent = `Son güncelleme: ${formatter.format(new Date())}`;
    } catch (error) {
      coinModalUpdatedEl.textContent = "Son güncelleme: şimdi";
    }
  }

  const series24h = getSeriesForMinutes(symbol, 24 * 60, Math.min(24 * 60 + 1, 720));
  const entries24h = series24h.series;
  if (entries24h.length) {
    const first = entries24h[0].price;
    const last = entries24h[entries24h.length - 1].price;
    const change24h = roundToCents(last - first);
    const average =
      entries24h.reduce((accumulator, entry) => accumulator + entry.price, 0) / entries24h.length;

    if (coinModalChange24El) {
      coinModalChange24El.textContent = formatSignedMemoWithSymbol(change24h);
      updateCoinChangeClasses(coinModalChange24El, change24h);
    }
    if (coinModalAvg24El) {
      coinModalAvg24El.textContent = formatMemoWithSymbol(roundToCents(average));
    }

    if (coinModalVolatilityEl) {
      const mean = average;
      const variance =
        entries24h.reduce((accumulator, entry) => {
          const diff = entry.price - mean;
          return accumulator + diff * diff;
        }, 0) / entries24h.length;
      const deviation = Math.sqrt(variance);
      let descriptor = "Düşük";
      if (deviation > 1.5) {
        descriptor = "Yüksek";
      } else if (deviation > 0.75) {
        descriptor = "Orta";
      }
      coinModalVolatilityEl.textContent = descriptor;
    }
  }

  if (!entries24h.length) {
    if (coinModalChange24El) {
      coinModalChange24El.textContent = "+0,00 GP";
      updateCoinChangeClasses(coinModalChange24El, 0);
    }
    if (coinModalAvg24El) {
      coinModalAvg24El.textContent = formatMemoWithSymbol(state.price);
    }
    if (coinModalVolatilityEl) {
      coinModalVolatilityEl.textContent = "-";
    }
  }

  if (coinModalTradesEl) {
    coinModalTradesEl.textContent = String(state.trades);
  }
};

function updateTradeHelpers() {
  if (!coinModal) return;
  const symbol = activeCoinSymbol;
  if (!symbol) {
    return;
  }
  const state = getCoinState(symbol);
  const buyFormElement = coinModal.querySelector("[data-trade-form='buy']");
  const sellFormElement = coinModal.querySelector("[data-trade-form='sell']");
  const buyInput = buyFormElement ? buyFormElement.querySelector("input") : null;
  const sellInput = sellFormElement ? sellFormElement.querySelector("input") : null;
  const buySubmit = buyFormElement ? buyFormElement.querySelector(".trade-form__submit") : null;
  const buyError = buyFormElement ? buyFormElement.querySelector(".trade-form__error") : null;
  const canPurchase = state.price >= MIN_PURCHASE_PRICE;

  if (buyEquivalentEl) {
    if (buyInput) {
      const value = parseFloat(buyInput.value);
      if (Number.isFinite(value) && value > 0 && canPurchase) {
        const quantity = roundHoldings(value / state.price);
        buyEquivalentEl.textContent = `Kazanç: ${formatHoldings(quantity)} ${symbol}`;
      } else {
        buyEquivalentEl.textContent = `Kazanç: 0,0000 ${symbol}`;
      }
    } else {
      buyEquivalentEl.textContent = `Kazanç: 0,0000 ${symbol}`;
    }
  }

  if (buyLockNoteEl) {
    buyLockNoteEl.hidden = canPurchase;
  }

  if (buySubmit) {
    buySubmit.disabled = !canPurchase;
  }

  if (buyError && canPurchase && buyError.textContent === MIN_PURCHASE_MESSAGE) {
    buyError.textContent = "";
  }

  if (sellEquivalentEl) {
    if (sellInput) {
      const value = parseFloat(sellInput.value);
      if (Number.isFinite(value) && value > 0) {
        const result = roundToCents(value * state.price);
        sellEquivalentEl.textContent = `Getiri: ${formatMemo(result)} GP`;
      } else {
        sellEquivalentEl.textContent = "Getiri: 0,00 GP";
      }
    } else {
      sellEquivalentEl.textContent = "Getiri: 0,00 GP";
    }
  }

  updateTradeFeeNote();
  updateStopLossUI();
}

function updateTradeFeeNote() {
  if (!tradeFeeNote) return;
  tradeFeeNote.textContent = "İşlemler ücretsizdir ve zarar etme koruması tüm kullanıcılara açıktır.";
}

function getStopLossState(symbol) {
  const entry = stopLossConfig && stopLossConfig[symbol] ? stopLossConfig[symbol] : {};
  const state = getCoinState(symbol);
  const threshold = clampNumber(Number(entry.threshold) || 5, 1, 25);
  const peak = Math.max(0, Number(entry.peak) || (state ? state.price : 0) || 0);
  return { enabled: Boolean(entry.enabled), threshold, peak };
}

function updateStopLossUI() {
  if (!stopLossSection || !stopLossStatus || !stopLossToggle || !stopLossThresholdInput) {
    return;
  }
  const symbol = activeCoinSymbol;
  if (!symbol) {
    stopLossSection.hidden = true;
    return;
  }
  const state = getStopLossState(symbol);
  stopLossSection.hidden = false;
  stopLossToggle.disabled = false;
  stopLossThresholdInput.disabled = false;
  stopLossThresholdInput.value = state.threshold;
  stopLossToggle.textContent = state.enabled ? "Koruma kapat" : "Zarar etme korumasını aç";
  const holding = symbol ? getHoldingAmount(symbol) : 0;
  const peakLabel = state.peak > 0 ? formatMemoWithSymbol(state.peak) : "-";
  stopLossStatus.textContent = state.enabled
    ? `Aktif: eşik ${state.threshold}% • zirve ${peakLabel} • elde ${formatHoldings(holding)} ${symbol || ""}`
    : "Kapalı. Eşik belirleyip açabilirsin.";
}

function evaluateStopLossForSymbol(symbol) {
  if (!symbol) return;
  const config = getStopLossState(symbol);
  if (!config.enabled) {
    return;
  }
  const state = getCoinState(symbol);
  if (!state) return;
  let peak = Math.max(config.peak || 0, state.price || 0);
  const threshold = clampNumber(config.threshold || 5, 1, 25);
  const trigger = peak * (1 - threshold / 100);
  if (state.price > peak) {
    peak = state.price;
    stopLossConfig[symbol] = { ...config, peak };
    safelyPersistStopLoss(stopLossConfig);
    return;
  }
  if (state.price <= trigger) {
    const quantity = getHoldingAmount(symbol);
    if (quantity > 0) {
      const feeRate = 0;
      const proceeds = roundToCents(quantity * state.price);
      const fee = 0;
      const net = roundToCents(proceeds - fee);
      setHoldingAmount(symbol, 0);
      cashBalance = roundToCents(cashBalance + net);
      safelyPersistBalance(cashBalance);
      updateBalanceDisplay();
      updatePortfolioDisplay();
      updateCoinSummaries(symbol);
      showPlusReminder(
        `Zarar etme koruması ${symbol} için devreye girdi ve ${formatHoldings(quantity)} ${symbol} satıldı.`
      );
    }
    stopLossConfig[symbol] = { enabled: false, threshold, peak: state.price };
    safelyPersistStopLoss(stopLossConfig);
  }
}

function handleStopLossToggle() {
  if (!activeCoinSymbol || !stopLossThresholdInput) {
    return;
  }
  const threshold = clampNumber(parseFloat(stopLossThresholdInput.value) || 5, 1, 25);
  const current = getCoinState(activeCoinSymbol);
  const peak = current ? current.price : threshold;
  const existing = getStopLossState(activeCoinSymbol);
  const nextEnabled = !existing.enabled;
  stopLossConfig = {
    ...stopLossConfig,
    [activeCoinSymbol]: { enabled: nextEnabled, threshold, peak: nextEnabled ? Math.max(existing.peak, peak) : peak },
  };
  safelyPersistStopLoss(stopLossConfig);
  updateStopLossUI();
}

const roundHoldings = (value) => Math.round(value * 10000) / 10000;

const handleTradeSubmit = (event) => {
  event.preventDefault();
  if (!(event.currentTarget instanceof HTMLFormElement)) {
    return;
  }

  const form = event.currentTarget;
  const input = form.querySelector("input");
  const error = form.querySelector(".trade-form__error");
  if (!input) return;

  const rawValue = parseFloat(input.value);
  if (!Number.isFinite(rawValue) || rawValue <= 0) {
    if (error) {
      error.textContent = "Lütfen pozitif bir değer girin.";
    }
    return;
  }

  if (error) {
    error.textContent = "";
  }

  const symbol = activeCoinSymbol;
  if (!symbol) {
    return;
  }
  const state = getCoinState(symbol);

  if (form.dataset.tradeForm === "buy") {
    if (state.price < MIN_PURCHASE_PRICE) {
      if (error) {
        error.textContent = MIN_PURCHASE_MESSAGE;
      }
      return;
    }
    const amount = roundToCents(rawValue);
    const feeRate = 0;
    const fee = 0;
    const totalCost = roundToCents(amount);
    if (totalCost > cashBalance) {
      if (error) {
        error.textContent = "Bakiye yetersiz.";
      }
      return;
    }
    const quantity = roundHoldings(amount / state.price);
    cashBalance = roundToCents(cashBalance - totalCost);
    safelyPersistBalance(cashBalance);
    const newHolding = roundHoldings(getHoldingAmount(symbol) + quantity);
    setHoldingAmount(symbol, newHolding);
    state.trades += 1;
    input.value = "";
  } else if (form.dataset.tradeForm === "sell") {
    const quantity = roundHoldings(rawValue);
    const currentHolding = getHoldingAmount(symbol);
    if (quantity > currentHolding) {
      if (error) {
        error.textContent = `Bu kadar ${symbol} yok.`;
      }
      return;
    }
    const proceeds = roundToCents(quantity * state.price);
    const feeRate = 0;
    const fee = 0;
    const netProceeds = roundToCents(proceeds);
    const newHolding = roundHoldings(currentHolding - quantity);
    setHoldingAmount(symbol, Math.max(0, newHolding));
    cashBalance = roundToCents(cashBalance + netProceeds);
    safelyPersistBalance(cashBalance);
    state.trades += 1;
    input.value = "";
  }

  updateBalanceDisplay();
  updateCoinSummaries(symbol);
  updateModalSnapshot();
  updateTradeHelpers();
  updatePortfolioDisplay();
  if (coinModal && !coinModal.hidden) {
    drawChart();
  }
};

const attachTradeListeners = () => {
  tradeForms.forEach((form) => {
    form.addEventListener("submit", handleTradeSubmit);
    const input = form.querySelector("input");
    if (input) {
      input.addEventListener("input", () => {
        updateTradeHelpers();
        const error = form.querySelector(".trade-form__error");
        if (error) {
          error.textContent = "";
        }
      });
    }
  });
};

const closeCoinModal = () => {
  if (!coinModal) return;
  coinModal.hidden = true;
  document.removeEventListener("keydown", handleCoinModalKeydown);
};

const openCoinModal = (symbol) => {
  if (!coinModal) return;
  if (symbol && coinConfigs.has(symbol)) {
    activeCoinSymbol = symbol;
  }
  ensureTimeframeControls();
  activeTimeframeKey = DEFAULT_TIMEFRAME_KEY;
  updateTimeframeButtonStates(timeframeButtons, activeTimeframeKey);
  coinModal.hidden = false;
  updateModalSnapshot();
  updateTradeHelpers();
  drawChart();
  if (chartModal && !chartModal.hidden) {
    ensureDetailTimeframeControls();
    detailChartSymbol = activeCoinSymbol;
    detailActiveTimeframeKey = activeTimeframeKey;
    updateTimeframeButtonStates(detailTimeframeButtons, detailActiveTimeframeKey);
    drawDetailChart();
  }
  document.addEventListener("keydown", handleCoinModalKeydown);
};

const handleCoinModalKeydown = (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeCoinModal();
  }
};

const handleCoinModalClick = (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  if (target.dataset.close === "true") {
    closeCoinModal();
  }
};

const highlightCoinCard = (symbol) => {
  coinCards.forEach((entries) => {
    entries.forEach(({ card }) => {
      card.classList.remove("is-highlighted");
    });
  });
  const entries = getCoinCardEntries(symbol);
  if (!entries.length) {
    return;
  }
  let preferredEntry = entries[0];
  if (activeView === "leverage" && leverageView) {
    const leverageEntry = entries.find(({ card }) => leverageView.contains(card));
    if (leverageEntry) {
      preferredEntry = leverageEntry;
    }
  } else if (activeAppSection === "coins" && appViewPanels.has("coins")) {
    const coinsPanel = appViewPanels.get("coins");
    const coinsEntry = entries.find(({ card }) => coinsPanel && coinsPanel.contains(card));
    if (coinsEntry) {
      preferredEntry = coinsEntry;
    }
  } else if (exchangeView) {
    const exchangeEntry = entries.find(({ card }) => exchangeView.contains(card));
    if (exchangeEntry) {
      preferredEntry = exchangeEntry;
    }
  }
  const { card } = preferredEntry;
  if (!card) {
    return;
  }
  card.classList.add("is-highlighted");
  if (highlightTimerId !== null) {
    window.clearTimeout(highlightTimerId);
  }
  highlightTimerId = window.setTimeout(() => {
    card.classList.remove("is-highlighted");
    highlightTimerId = null;
  }, 1200);
  try {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    card.scrollIntoView();
  }
};

const clearSearchResults = () => {
  if (!searchResults) {
    return;
  }
  searchResults.innerHTML = "";
  searchResults.hidden = true;
  searchResults.setAttribute("aria-hidden", "true");
  if (searchInput) {
    searchInput.setAttribute("aria-expanded", "false");
  }
};

const renderSearchResults = (matches) => {
  if (!searchResults) {
    return;
  }
  searchResults.innerHTML = "";
  if (!matches.length) {
    const empty = document.createElement("div");
    empty.className = "search__result search__result--empty";
    empty.setAttribute("role", "option");
    empty.setAttribute("aria-disabled", "true");
    empty.textContent = "Sonuç bulunamadı";
    searchResults.appendChild(empty);
  } else {
    matches.forEach((coin) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search__result";
      button.setAttribute("role", "option");
      button.setAttribute("data-symbol", coin.symbol);

      const symbolSpan = document.createElement("span");
      symbolSpan.className = "search__result-symbol";
      symbolSpan.textContent = coin.symbol;

      const nameSpan = document.createElement("span");
      nameSpan.className = "search__result-name";
      nameSpan.textContent = coin.name;

      button.appendChild(symbolSpan);
      button.appendChild(nameSpan);
      searchResults.appendChild(button);
    });
  }
  searchResults.hidden = false;
  searchResults.setAttribute("aria-hidden", "false");
  if (searchInput) {
    searchInput.setAttribute("aria-expanded", "true");
  }
};

const findSearchMatches = (query) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }
  return coinsDirectory.filter((coin) => {
    const symbolMatch = coin.symbol.toLowerCase().indexOf(normalized) !== -1;
    const nameMatch = coin.name.toLowerCase().indexOf(normalized) !== -1;
    return symbolMatch || nameMatch;
  });
};

const handleSearchSelection = (symbol) => {
  if (!symbol || !coinConfigs.has(symbol)) {
    return;
  }
  highlightCoinCard(symbol);
  openCoinModal(symbol);
  clearSearchResults();
  if (searchInput) {
    searchInput.blur();
  }
};

const handleSearchInput = () => {
  if (!searchInput) {
    return;
  }
  const value = searchInput.value || "";
  const matches = findSearchMatches(value);
  if (!value.trim()) {
    clearSearchResults();
    return;
  }
  renderSearchResults(matches);
};

if (searchInput) {
  searchInput.setAttribute("aria-expanded", "false");
  searchInput.addEventListener("input", handleSearchInput);
  searchInput.addEventListener("focus", handleSearchInput);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchResults) {
        const firstResult = searchResults.querySelector("[data-symbol]");
        if (firstResult instanceof HTMLElement) {
          const symbol = firstResult.getAttribute("data-symbol");
          if (symbol) {
            handleSearchSelection(symbol);
          }
        }
      }
    } else if (event.key === "Escape") {
      clearSearchResults();
    }
  });
}

if (searchResults) {
  searchResults.setAttribute("aria-hidden", "true");
  searchResults.addEventListener("click", (event) => {
    const target = event.target instanceof HTMLElement ? event.target.closest("[data-symbol]") : null;
    if (target) {
      const symbol = target.getAttribute("data-symbol");
      if (symbol) {
        handleSearchSelection(symbol);
      }
    }
  });
}

document.addEventListener("click", (event) => {
  if (!searchResults || !searchInput) {
    return;
  }
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }
  if (target === searchInput || searchResults.contains(target)) {
    return;
  }
  clearSearchResults();
});

if (aiTriggers.length && aiModal) {
  aiTriggers.forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", openAiModal);
  });
}

if (aiFullscreenToggle) {
  aiFullscreenToggle.addEventListener("click", () => {
    toggleAiFullscreen();
    if (aiChatInput && isAiPlusActive() && !aiChatProcessing) {
      aiChatInput.focus();
    }
  });
}

aiPlusUpgradeButtons.forEach((button) => {
  if (button) {
    button.addEventListener("click", handleAiPlusUpgradeClick);
  }
});

aiPlusOpenButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const trigger = event && event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    if (isAiPlusActive()) {
      if (aiModal && !aiModal.hidden) {
        closeAiModal();
      }
      openAiPlusScreen(trigger);
    } else {
      openAiPlusModal();
    }
  });
});

aiPlusScreenCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeAiPlusScreen();
    syncAiPlusUI();
  });
});

aiPlusScreenManageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeAiPlusScreen({ restoreFocus: false });
    syncAiPlusUI();
    openAiPlusModal();
  });
});

if (aiPlusModal) {
  aiPlusModal.addEventListener("click", handleAiPlusModalClick);
}

aiPlusCloseButtons.forEach((button) => {
  button.addEventListener("click", closeAiPlusModal);
});

if (aiPlusPurchaseButton) {
  aiPlusPurchaseButton.addEventListener("click", attemptAiPlusPurchase);
}

if (aiProfileButton) {
  aiProfileButton.addEventListener("click", openAiProfileModal);
}

aiProfileCloseButtons.forEach((button) => {
  button.addEventListener("click", closeAiProfileModal);
});

if (aiProfileModal) {
  aiProfileModal.addEventListener("click", (event) => {
    if (event.target === aiProfileModal) {
      closeAiProfileModal();
    }
  });
}

if (aiProfileForm) {
  aiProfileForm.addEventListener("submit", handleAiProfileSubmit);
}

aiSetupTriggers.forEach((button) => {
  button.addEventListener("click", () => openAiSetupModal());
});

aiSetupCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    pendingAiTrigger = null;
    closeAiSetupModal();
  });
});

if (aiSetupModal) {
  aiSetupModal.addEventListener("click", (event) => {
    if (event.target === aiSetupModal || event.target === aiSetupModal.querySelector(".ai-setup__backdrop")) {
      pendingAiTrigger = null;
      closeAiSetupModal();
    }
  });
}

if (aiSetupForm) {
  aiSetupForm.addEventListener("submit", handleAiSetupSubmit);
}

if (systemToastDismiss) {
  systemToastDismiss.addEventListener("click", hideSystemToast);
}

if (aiChatForm) {
  aiChatForm.addEventListener("submit", handleAiChatSubmit);
}

if (aiChatClearButton) {
  aiChatClearButton.addEventListener("click", handleAiChatClear);
}

if (plusReminderDismissButton) {
  plusReminderDismissButton.addEventListener("click", hidePlusReminder);
}

if (updateStartButton) {
  updateStartButton.addEventListener("click", startUpdateSimulation);
}

if (aiFabDismissButton) {
  aiFabDismissButton.addEventListener("click", () => {
    if (aiFab && !aiFab.hidden) {
      aiFab.hidden = true;
      aiFab.setAttribute("aria-hidden", "true");
    }
    showAiTopHighlight();
    if (aiPrimaryTrigger) {
      focusNextFrame(aiPrimaryTrigger);
    }
  });
}

if (aiModal) {
  aiModal.addEventListener("click", handleAiModalClick);
}

if (aiForm) {
  aiForm.addEventListener("submit", handleAiSubmit);
}

if (plusPurchaseButton) {
  plusPurchaseButton.addEventListener("click", attemptAiPlusPurchase);
}

const handlePlusSettingChange = () => {
  if (!isAiPlusActive()) {
    updatePlusShelf();
    return;
  }
  if (plusThemeSelect) {
    plusSettings.theme = plusThemeSelect.value || "default";
  }
  if (plusMusicToggle) {
    plusSettings.music = !!plusMusicToggle.checked;
  }
  if (plusAlertsToggle) {
    plusSettings.alerts = !!plusAlertsToggle.checked;
  }
  persistPlusSettings(plusSettings);
  applyPlusThemeChoice(plusSettings.theme);
  updatePlusShelf();
};

if (plusThemeSelect) {
  plusThemeSelect.addEventListener("change", handlePlusSettingChange);
}
if (plusMusicToggle) {
  plusMusicToggle.addEventListener("change", handlePlusSettingChange);
}
if (plusAlertsToggle) {
  plusAlertsToggle.addEventListener("change", handlePlusSettingChange);
}

if (aiRestartButton) {
  aiRestartButton.addEventListener("click", handleAiRestart);
}

if (aiOpenCoinButton) {
  aiOpenCoinButton.addEventListener("click", () => {
    const symbol = aiOpenCoinButton.dataset.symbol;
    if (!symbol) {
      return;
    }
    closeAiModal();
    highlightCoinCard(symbol);
    openCoinModal(symbol);
  });
}

if (coinModal) {
  coinModal.addEventListener("click", handleCoinModalClick);
}

if (marketGrid) {
  marketGrid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const button = target.closest("[data-open-coin]");
    if (!button || !marketGrid.contains(button)) {
      return;
    }
    const symbol = button.getAttribute("data-open-coin") || activeCoinSymbol;
    if (symbol) {
      highlightCoinCard(symbol);
      openCoinModal(symbol);
    }
  });
}

if (leverageMarketGrid) {
  leverageMarketGrid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const button = target.closest("[data-open-coin]");
    if (!button || !leverageMarketGrid.contains(button)) {
      return;
    }
    const symbol = button.getAttribute("data-open-coin") || activeCoinSymbol;
    if (symbol) {
      highlightCoinCard(symbol);
      openCoinModal(symbol);
    }
  });
}

if (portfolioList) {
  portfolioList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const button = target.closest("[data-open-coin]");
    if (!button || !portfolioList.contains(button)) {
      return;
    }
    const symbol = button.getAttribute("data-open-coin");
    if (!symbol) {
      return;
    }
    highlightCoinCard(symbol);
    openCoinModal(symbol);
  });
}

if (walletListEl) {
  walletListEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const button = target.closest("[data-open-coin]");
    if (!button || !walletListEl.contains(button)) {
      return;
    }
    const symbol = button.getAttribute("data-open-coin");
    if (!symbol) {
      return;
    }
    highlightCoinCard(symbol);
    openCoinModal(symbol);
  });
}

if (coinsSortSelect) {
  coinsSortSelect.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      coinsSortKey = target.value || "change";
      sortCoinsLibrary();
      applyCoinsLibraryFilters();
    }
  });
}

if (coinsSearchInput) {
  coinsSearchInput.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      coinsSearchQuery = target.value || "";
      applyCoinsLibraryFilters();
    }
  });
}

coinsFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    coinsFilterKey = button.dataset.coinsFilter || "all";
    coinsFilterButtons.forEach((entry) => {
      entry.classList.toggle("is-active", entry === button);
    });
    applyCoinsLibraryFilters();
  });
});

const getChartStyles = () => {
  if (!coinChartCanvas) return null;
  const styles = getComputedStyle(coinChartCanvas);
  return {
    grid: styles.getPropertyValue("--chart-grid").trim() || "rgba(255,255,255,0.1)",
    fill: styles.getPropertyValue("--chart-fill").trim() || "rgba(255,255,255,0.05)",
    up: styles.getPropertyValue("--chart-up").trim() || "#16a34a",
    down: styles.getPropertyValue("--chart-down").trim() || "#dc2626",
    text: styles.getPropertyValue("--chart-text").trim() || "rgba(255,255,255,0.6)",
  };
};

const prepareChartContext = () => {
  if (!coinChartCanvas) return null;
  const context = coinChartCanvas.getContext("2d");
  if (!context) return null;
  const dpr = window.devicePixelRatio || 1;
  const width = coinChartCanvas.clientWidth;
  const height = coinChartCanvas.clientHeight;
  coinChartCanvas.width = Math.max(1, Math.floor(width * dpr));
  coinChartCanvas.height = Math.max(1, Math.floor(height * dpr));
  if (typeof context.setTransform === "function") {
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
  if (dpr !== 1) {
    context.scale(dpr, dpr);
  }
  return { context, width, height };
};

const getDetailChartStyles = () => {
  if (!detailChartCanvas) return null;
  const styles = getComputedStyle(detailChartCanvas);
  return {
    grid: styles.getPropertyValue("--chart-grid").trim() || "rgba(148,163,184,0.25)",
    fill: styles.getPropertyValue("--chart-fill").trim() || "rgba(59,130,246,0.08)",
    up: styles.getPropertyValue("--chart-up").trim() || "#22c55e",
    down: styles.getPropertyValue("--chart-down").trim() || "#ef4444",
    text: styles.getPropertyValue("--chart-text").trim() || "rgba(15,23,42,0.65)",
  };
};

const prepareDetailChartContext = () => {
  if (!detailChartCanvas) return null;
  const context = detailChartCanvas.getContext("2d");
  if (!context) return null;
  const dpr = window.devicePixelRatio || 1;
  const width = detailChartCanvas.clientWidth;
  const height = detailChartCanvas.clientHeight;
  detailChartCanvas.width = Math.max(1, Math.floor(width * dpr));
  detailChartCanvas.height = Math.max(1, Math.floor(height * dpr));
  if (typeof context.setTransform === "function") {
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
  if (dpr !== 1) {
    context.scale(dpr, dpr);
  }
  return { context, width, height };
};

drawChart = () => {
  if (!coinChartCanvas) return;
  refreshTimeframeAvailability();
  const frame = timeframeLookup.get(activeTimeframeKey) || null;
  const profile = getProfileForFrame(frame);
  applyCanvasProfile(coinChartCanvas, profile);
  const setup = prepareChartContext();
  if (!setup) return;
  const { context, width, height } = setup;
  context.clearRect(0, 0, width, height);
  if (!activeCoinSymbol) {
    return;
  }
  const maxPoints = getMaxPointsForProfile(profile, false);
  const seriesData = getSeriesForTimeframe(activeCoinSymbol, activeTimeframeKey, maxPoints);
  const entries = seriesData.series;
  if (entries.length < 2) {
    return;
  }

  const styles = getChartStyles();
  if (!styles) return;

  const prices = entries.map((entry) => entry.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const range = Math.max(0.5, maxPrice - minPrice || 1);
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 20;
  const paddingRight = 20;
  const usableHeight = Math.max(1, height - paddingTop - paddingBottom);
  const usableWidth = Math.max(1, width - paddingLeft - paddingRight);

  const rangeStart = typeof seriesData.rangeStart === "number"
    ? seriesData.rangeStart
    : entries[0].timestamp;
  const rangeEnd = typeof seriesData.rangeEnd === "number"
    ? seriesData.rangeEnd
    : entries[entries.length - 1].timestamp;

  const getXFromTimestamp = (timestamp) => {
    if (rangeEnd === rangeStart) {
      return paddingLeft;
    }
    const clamped = Math.min(Math.max(timestamp, rangeStart), rangeEnd);
    const ratio = (clamped - rangeStart) / (rangeEnd - rangeStart);
    return paddingLeft + ratio * usableWidth;
  };
  const getY = (price) => {
    const normalized = (price - minPrice) / range;
    return height - paddingBottom - normalized * usableHeight;
  };

  context.strokeStyle = styles.grid;
  context.lineWidth = 1;
  context.setLineDash([4, 8]);
  for (let i = 0; i <= 4; i += 1) {
    const y = paddingTop + (usableHeight / 4) * i;
    context.beginPath();
    context.moveTo(paddingLeft, y);
    context.lineTo(width - paddingRight, y);
    context.stroke();
  }
  context.setLineDash([]);

  context.beginPath();
  const firstPoint = entries[0];
  context.moveTo(getXFromTimestamp(firstPoint.timestamp), getY(firstPoint.price));
  for (let i = 1; i < entries.length; i += 1) {
    const point = entries[i];
    context.lineTo(getXFromTimestamp(point.timestamp), getY(point.price));
  }
  const lastPoint = entries[entries.length - 1];
  const lastX = getXFromTimestamp(lastPoint.timestamp);
  const firstX = getXFromTimestamp(firstPoint.timestamp);
  context.lineTo(lastX, height - paddingBottom);
  context.lineTo(firstX, height - paddingBottom);
  context.closePath();
  context.fillStyle = styles.fill;
  context.fill();

  for (let i = 1; i < entries.length; i += 1) {
    const previous = entries[i - 1];
    const current = entries[i];
    context.beginPath();
    context.moveTo(getXFromTimestamp(previous.timestamp), getY(previous.price));
    context.lineTo(getXFromTimestamp(current.timestamp), getY(current.price));
    context.strokeStyle = current.price >= previous.price ? styles.up : styles.down;
    context.lineWidth = 2.5;
    context.stroke();
  }

  context.fillStyle = styles.text;
  context.font = "12px 'Inter', 'Segoe UI', sans-serif";
  context.fillText(`${formatMemo(maxPrice)} GP`, 24, paddingTop + 12);
  context.fillText(`${formatMemo(minPrice)} GP`, 24, height - paddingBottom + 20);
};

const updateDetailStats = (symbol, data) => {
  const definition = getCoinDefinition(symbol);
  if (detailStartEl) {
    detailStartEl.textContent = formatMemoWithSymbol(roundToCents(data.startPrice));
  }
  if (detailCurrentEl) {
    detailCurrentEl.textContent = formatMemoWithSymbol(roundToCents(data.endPrice));
  }
  const change = roundToCents(data.endPrice - data.startPrice);
  const percent = data.startPrice === 0 ? 0 : (change / data.startPrice) * 100;
  if (detailChangeEl) {
    detailChangeEl.textContent = formatSignedMemoWithSymbol(change);
    updateCoinChangeClasses(detailChangeEl, change);
  }
  if (detailPercentEl) {
    detailPercentEl.textContent = formatSignedPercent(percent);
    updateCoinChangeClasses(detailPercentEl, percent);
  }
  const frame = data.timeframe || timeframeLookup.get(detailActiveTimeframeKey) || null;
  if (detailRangeEl) {
    detailRangeEl.textContent = frame && frame.label ? frame.label : "Zaman aralığı";
  }
  if (detailHighEl) {
    detailHighEl.textContent = formatMemoWithSymbol(roundToCents(data.high));
  }
  if (detailLowEl) {
    detailLowEl.textContent = formatMemoWithSymbol(roundToCents(data.low));
  }
  if (detailDescriptionEl) {
    detailDescriptionEl.textContent = definition ? definition.summary : "";
  }
  if (detailTitleEl) {
    detailTitleEl.textContent = `${symbol} detaylı grafik`;
  }
  if (detailSubtitleEl) {
    const label = frame && frame.label ? frame.label : "";
    detailSubtitleEl.textContent = label ? `${symbol} fiyat hareketleri • ${label}` : `${symbol} fiyat hareketleri`;
  }
};

const hideDetailTooltip = () => {
  if (!detailTooltip) {
    return;
  }
  detailTooltip.hidden = true;
  detailTooltipVisible = false;
};

const positionDetailTooltip = (point) => {
  if (!detailTooltip || !detailChartCanvas) {
    return;
  }
  const offsetX = detailChartCanvas.offsetLeft || 0;
  const offsetY = detailChartCanvas.offsetTop || 0;
  detailTooltip.style.left = `${offsetX + point.x}px`;
  detailTooltip.style.top = `${offsetY + point.y}px`;
};

const showDetailTooltip = (point) => {
  if (!detailTooltip || !detailTooltipTimeEl || !detailTooltipPriceEl || !detailTooltipChangeEl) {
    return;
  }
  const frame = detailChartFrame || timeframeLookup.get(detailActiveTimeframeKey) || null;
  detailTooltipTimeEl.textContent = formatTimestampForFrame(point.data.timestamp, frame);
  detailTooltipPriceEl.textContent = `${formatMemo(point.data.price)} GP`;
  const change = roundToCents(point.data.price - detailChartBasePrice);
  const percent = detailChartBasePrice === 0 ? 0 : (change / detailChartBasePrice) * 100;
  detailTooltipChangeEl.textContent = `${formatSignedPercent(percent)} / ${formatSignedMemoWithSymbol(change)}`;
  detailTooltipChangeEl.classList.toggle("is-positive", change > 0);
  detailTooltipChangeEl.classList.toggle("is-negative", change < 0);
  positionDetailTooltip(point);
  detailTooltip.hidden = false;
  detailTooltipVisible = true;
};

const handleDetailPointerMove = (event) => {
  if (!detailChartCanvas || !detailChartPoints.length) {
    return;
  }
  const rect = detailChartCanvas.getBoundingClientRect();
  const relativeX = event.clientX - rect.left;
  let nearest = detailChartPoints[0];
  let smallestDistance = Math.abs(nearest.x - relativeX);
  for (let i = 1; i < detailChartPoints.length; i += 1) {
    const point = detailChartPoints[i];
    const distance = Math.abs(point.x - relativeX);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearest = point;
    }
  }
  if (nearest) {
    showDetailTooltip(nearest);
  }
};

drawDetailChart = () => {
  if (!detailChartCanvas || !detailChartSymbol) {
    return;
  }
  refreshTimeframeAvailability();
  const frame = timeframeLookup.get(detailActiveTimeframeKey) || null;
  const profile = getProfileForFrame(frame);
  applyCanvasProfile(detailChartCanvas, profile);
  const setup = prepareDetailChartContext();
  if (!setup) {
    return;
  }
  const { context, width, height } = setup;
  context.clearRect(0, 0, width, height);

  const styles = getDetailChartStyles();
  if (!styles) {
    return;
  }

  const maxPoints = getMaxPointsForProfile(profile, true);
  const data = getSeriesForTimeframe(detailChartSymbol, detailActiveTimeframeKey, maxPoints);
  detailChartSeries = data.series;
  detailChartFrame = data.timeframe || timeframeLookup.get(detailActiveTimeframeKey) || null;
  detailChartBasePrice = detailChartSeries.length ? detailChartSeries[0].price : 0;
  updateDetailStats(detailChartSymbol, { ...data, timeframe: detailChartFrame });

  if (detailChartSeries.length < 2) {
    detailChartPoints = [];
    hideDetailTooltip();
    return;
  }

  const prices = detailChartSeries.map((entry) => entry.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const range = Math.max(0.5, maxPrice - minPrice || 1);
  const paddingTop = 30;
  const paddingBottom = 40;
  const paddingLeft = 30;
  const paddingRight = 30;
  const usableWidth = Math.max(1, width - paddingLeft - paddingRight);
  const usableHeight = Math.max(1, height - paddingTop - paddingBottom);

  const rangeStart = typeof data.rangeStart === "number"
    ? data.rangeStart
    : detailChartSeries[0].timestamp;
  const rangeEnd = typeof data.rangeEnd === "number"
    ? data.rangeEnd
    : detailChartSeries[detailChartSeries.length - 1].timestamp;

  const getXFromTimestamp = (timestamp) => {
    if (rangeEnd === rangeStart) {
      return paddingLeft;
    }
    const clamped = Math.min(Math.max(timestamp, rangeStart), rangeEnd);
    const ratio = (clamped - rangeStart) / (rangeEnd - rangeStart);
    return paddingLeft + ratio * usableWidth;
  };
  const getY = (price) => {
    const normalized = (price - minPrice) / range;
    return height - paddingBottom - normalized * usableHeight;
  };

  context.strokeStyle = styles.grid;
  context.lineWidth = 1;
  context.setLineDash([6, 12]);
  for (let i = 0; i <= 5; i += 1) {
    const y = paddingTop + (usableHeight / 5) * i;
    context.beginPath();
    context.moveTo(paddingLeft, y);
    context.lineTo(width - paddingRight, y);
    context.stroke();
  }
  context.setLineDash([]);

  context.beginPath();
  const firstPoint = detailChartSeries[0];
  context.moveTo(getXFromTimestamp(firstPoint.timestamp), getY(firstPoint.price));
  for (let i = 1; i < detailChartSeries.length; i += 1) {
    const point = detailChartSeries[i];
    context.lineTo(getXFromTimestamp(point.timestamp), getY(point.price));
  }
  const lastPoint = detailChartSeries[detailChartSeries.length - 1];
  const lastX = getXFromTimestamp(lastPoint.timestamp);
  const firstX = getXFromTimestamp(firstPoint.timestamp);
  context.lineTo(lastX, height - paddingBottom);
  context.lineTo(firstX, height - paddingBottom);
  context.closePath();
  context.fillStyle = styles.fill;
  context.fill();

  context.lineWidth = 2.5;
  for (let i = 1; i < detailChartSeries.length; i += 1) {
    const previous = detailChartSeries[i - 1];
    const current = detailChartSeries[i];
    context.beginPath();
    context.moveTo(getXFromTimestamp(previous.timestamp), getY(previous.price));
    context.lineTo(getXFromTimestamp(current.timestamp), getY(current.price));
    context.strokeStyle = current.price >= previous.price ? styles.up : styles.down;
    context.stroke();
  }

  context.fillStyle = styles.text;
  context.font = "12px 'Inter', 'Segoe UI', sans-serif";
  context.fillText(`${formatMemo(maxPrice)} GP`, paddingLeft, paddingTop - 8);
  context.fillText(`${formatMemo(minPrice)} GP`, paddingLeft, height - paddingBottom + 24);

  detailChartPoints = detailChartSeries.map((entry) => ({
    x: getXFromTimestamp(entry.timestamp),
    y: getY(entry.price),
    data: entry,
  }));
  hideDetailTooltip();
};

if (detailChartCanvas) {
  detailChartCanvas.addEventListener("pointermove", handleDetailPointerMove);
  detailChartCanvas.addEventListener("pointerleave", hideDetailTooltip);
}

const handleDetailChartKeydown = (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeDetailChartModal();
  }
};

const closeDetailChartModal = () => {
  if (!chartModal) {
    return;
  }
  chartModal.hidden = true;
  chartModal.setAttribute("aria-hidden", "true");
  hideDetailTooltip();
  detailChartSymbol = "";
  document.removeEventListener("keydown", handleDetailChartKeydown);
};

const openDetailChartModal = (symbol) => {
  if (!chartModal) {
    return;
  }
  const targetSymbol = symbol && coinConfigs.has(symbol) ? symbol : activeCoinSymbol;
  if (!targetSymbol) {
    return;
  }
  ensureDetailTimeframeControls();
  detailChartSymbol = targetSymbol;
  detailActiveTimeframeKey = sanitizeTimeframeKey(activeTimeframeKey);
  refreshTimeframeAvailability();
  chartModal.hidden = false;
  chartModal.setAttribute("aria-hidden", "false");
  hideDetailTooltip();
  drawDetailChart();
  document.addEventListener("keydown", handleDetailChartKeydown);
};

const handleChartModalClick = (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  if (target.dataset.close === "true") {
    closeDetailChartModal();
  }
};

if (chartModal) {
  chartModal.addEventListener("click", handleChartModalClick);
}

if (coinModalDetailButton) {
  coinModalDetailButton.addEventListener("click", () => {
    openDetailChartModal(activeCoinSymbol);
  });
}

if (stopLossToggle) {
  stopLossToggle.addEventListener("click", handleStopLossToggle);
}

if (stopLossThresholdInput) {
  stopLossThresholdInput.addEventListener("input", () => {
    if (isAiPlusActive()) {
      updateStopLossUI();
    }
  });
}

const renderPlusNews = () => {
  if (!plusNewsList) {
    return;
  }
  plusNewsList.innerHTML = "";
  plusNewsFeed.slice(-PLUS_NEWS_LIMIT).forEach((item) => {
    const li = document.createElement("li");
    li.className = "plus-news__item";
    if (item.direction === "positive") {
      li.classList.add("is-positive");
    } else if (item.direction === "negative") {
      li.classList.add("is-negative");
    }
    li.innerHTML = `
      <p class="plus-news__title">${item.title}</p>
      <p class="plus-news__meta">${item.detail} • ${new Date(item.timestamp).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    })}</p>
    `;
    plusNewsList.appendChild(li);
  });
  persistNews();
};

const updateNewsPulseBadge = (pulse) => {
  if (!plusNewsPulse) {
    return;
  }
  plusNewsPulse.classList.remove("is-positive", "is-negative");
  const label = pulse?.direction === "positive" ? "Olumlu" : pulse?.direction === "negative" ? "Olumsuz" : "Tarafsız";
  plusNewsPulse.textContent = label;
  if (pulse?.direction === "positive") {
    plusNewsPulse.classList.add("is-positive");
  } else if (pulse?.direction === "negative") {
    plusNewsPulse.classList.add("is-negative");
  }
};

const emitNewsPulse = () => {
  const roll = Math.random();
  let direction = "neutral";
  if (roll > 0.6) {
    direction = "positive";
  } else if (roll < 0.25) {
    direction = "negative";
  }
  const source = direction === "positive" ? PLUS_POSITIVE_NEWS : direction === "negative" ? PLUS_NEGATIVE_NEWS : PLUS_NEUTRAL_NEWS;
  const title = pickRandom(source) || "Güncelleniyor";
  const detail = direction === "neutral" ? "Yatay seyir" : direction === "positive" ? "Talep artışı" : "Satış baskısı";
  const magnitude = direction === "neutral" ? 0.25 + Math.random() * 0.25 : 0.65 + Math.random() * 0.35;
  const pulse = { direction, title, detail, magnitude, timestamp: Date.now() };
  plusNewsFeed.push(pulse);
  plusNewsFeed = plusNewsFeed.slice(-PLUS_NEWS_LIMIT);
  updateNewsPulseBadge(pulse);
  renderPlusNews();
  return pulse;
};

const buildUserCoinCard = (coin) => {
  const card = document.createElement("article");
  card.className = "user-coin";
  card.setAttribute("data-user-coin", coin.id);
  const changePct = coin.basePrice ? ((coin.price - coin.basePrice) / coin.basePrice) * 100 : 0;
  const changeLabel = `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%`;
  const reason = coin.lastReason || "Haber bekleniyor";
  const latestHistory = coin.history.slice(-3).reverse();
  const isOwner = coin.ownerId === currentUserId;
  card.innerHTML = `
    <div class="user-coin__header">
      <h4 class="user-coin__title">
        ${coin.name}
        <span class="user-coin__symbol">${coin.symbol}</span>
      </h4>
      <span class="user-coin__badge">${isOwner ? "Senin yayının" : "Topluluk"}</span>
    </div>
    <p class="user-coin__desc">${coin.description}</p>
    <p class="user-coin__owner" aria-label="Sahip">${isOwner ? "Bu coin sana ait." : "Sahibi farklı bir kullanıcı."}</p>
    <div class="user-coin__stats">
      <div class="user-coin__stat"><span>Fiyat</span><strong>${coin.price.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} GP</strong></div>
      <div class="user-coin__stat"><span>Değişim</span><strong>${changeLabel}</strong></div>
      <div class="user-coin__stat"><span>Takip</span><strong>${coin.followers.toLocaleString("tr-TR")}</strong></div>
      <div class="user-coin__stat"><span>Toplam alım</span><strong>${coin.holders.toLocaleString("tr-TR")}</strong></div>
    </div>
    <div class="user-coin__actions">
      <button class="user-coin__button" type="button" data-insight-toggle>Analizi aç</button>
      <span class="user-coin__badge">Son sebep: ${reason}</span>
    </div>
    <div class="user-coin__insight" data-insight hidden>
      <p class="user-coin__trend">Güncel haber etkisi: ${reason}</p>
      <ul class="user-coin__history">
        ${latestHistory
          .map(
            (entry) =>
              `<li>${new Date(entry.timestamp).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })} → ${entry.price.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} GP</li>`
          )
          .join("")}
      </ul>
    </div>
  `;
  const toggle = card.querySelector("[data-insight-toggle]");
  const insight = card.querySelector("[data-insight]");
  if (toggle && insight) {
    toggle.addEventListener("click", () => {
      const isHidden = insight.hasAttribute("hidden");
      if (isHidden) {
        insight.hidden = false;
        insight.removeAttribute("hidden");
        toggle.textContent = "Analizi gizle";
      } else {
        insight.hidden = true;
        insight.setAttribute("hidden", "true");
        toggle.textContent = "Analizi aç";
      }
    });
  }
  return card;
};

const renderUserCoins = () => {
  if (!plusGrid || !plusCountEl || !plusFollowersEl) {
    return;
  }
  plusGrid.innerHTML = "";
  if (!Array.isArray(userCoins) || userCoins.length === 0) {
    if (plusEmptyEl) {
      plusEmptyEl.hidden = false;
    }
    plusGrid.setAttribute("aria-busy", "false");
    plusCountEl.textContent = "0";
    plusFollowersEl.textContent = "0";
    return;
  }
  if (plusEmptyEl) {
    plusEmptyEl.hidden = true;
  }
  let followerSum = 0;
  userCoins.forEach((coin) => {
    followerSum += coin.followers || 0;
    plusGrid.appendChild(buildUserCoinCard(coin));
  });
  plusCountEl.textContent = String(userCoins.length);
  plusFollowersEl.textContent = followerSum.toLocaleString("tr-TR");
};

const renderUserRequests = () => {
  if (!plusRequestsList || !plusRequestsEmptyEl) {
    return;
  }
  plusRequestsList.innerHTML = "";
  const hasRequests = Array.isArray(userCoinRequests) && userCoinRequests.length > 0;
  plusRequestsEmptyEl.hidden = hasRequests;
  if (!hasRequests) {
    return;
  }
  const sorted = [...userCoinRequests].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  sorted.forEach((request) => {
    const li = document.createElement("li");
    li.className = "plus-request";
    const createdLabel = new Date(request.createdAt || Date.now()).toLocaleString("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const volatilityLabel = request.volatility === "fast" ? "Hızlı" : request.volatility === "slow" ? "Yavaş" : "Dengeli";
    const roleLabel = request.role === "booster" ? "Hızlandırıcı" : request.role === "experimental" ? "Deneysel" : "Çekirdek";
    li.innerHTML = `
      <div class="plus-request__top">
        <div>
          <div class="plus-request__symbol">${request.symbol}</div>
          <div class="plus-request__name">${request.name}</div>
        </div>
        <div class="plus-request__meta">${createdLabel}</div>
      </div>
      <p class="plus-request__desc">${request.description || "Açıklama yok"}</p>
      <div class="plus-request__tags">
        <span class="plus-request__tag">Dalga: ${volatilityLabel}</span>
        <span class="plus-request__tag">Rol: ${roleLabel}</span>
        <span class="plus-request__tag">Tavan: ${request.cap?.toLocaleString("tr-TR") || "-"} GP</span>
      </div>
    `;
    plusRequestsList.appendChild(li);
  });
};

const renderRequestLog = () => {
  if (!plusConsoleList || !plusConsoleEmptyEl) {
    return;
  }
  plusConsoleList.innerHTML = "";
  if (!Array.isArray(userRequestLog) || userRequestLog.length === 0) {
    plusConsoleEmptyEl.hidden = false;
    return;
  }
  plusConsoleEmptyEl.hidden = true;
  userRequestLog.slice(-USER_REQUEST_LOG_LIMIT).forEach((entry) => {
    const item = document.createElement("li");
    item.className = "plus-console__item";
    const timeLabel = new Date(entry.timestamp).toLocaleString("tr-TR", {
      dateStyle: "short",
      timeStyle: "short",
    });
    item.innerHTML = `
      <span class="plus-console__timestamp">${timeLabel}</span>
      <p class="plus-console__message">${entry.message}</p>
    `;
    plusConsoleList.appendChild(item);
  });
};

const appendRequestLogEntry = (message) => {
  const entry = {
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    message,
    timestamp: Date.now(),
  };
  userRequestLog = [...userRequestLog, entry].slice(-USER_REQUEST_LOG_LIMIT);
  persistRequestLog();
  renderRequestLog();
  console.info(`İstek konsolu >> ${message}`);
};

const updateUserCoinsWithPulse = (pulse) => {
  if (!Array.isArray(userCoins) || userCoins.length === 0) {
    return;
  }
  const biasUp = pulse?.direction === "positive" ? 0.68 : pulse?.direction === "negative" ? 0.32 : 0.5;
  const reason = pulse?.title || "Haber bekleniyor";
  userCoins = userCoins.map((coin) => {
    const steps = volatilitySteps(coin.volatility);
    const step = pickRandom(steps) || 1;
    const directionUp = Math.random() < biasUp;
    const amplitude = step * (1 + (pulse?.magnitude || 0.4));
    const delta = directionUp ? amplitude : -amplitude;
    const nextPrice = Math.max(0, roundToCents(coin.price + delta));
    const historyEntry = { timestamp: Date.now(), price: nextPrice };
    const updatedHistory = [...(coin.history || []), historyEntry].slice(-PLUS_HISTORY_LIMIT);
    const holderDrift = directionUp ? 1 + Math.random() * 3 : -Math.random() * 2;
    const followerDrift = directionUp ? 2 + Math.random() * 4 : -Math.random() * 3;
    const holders = Math.max(0, Math.round((coin.holders || 0) + holderDrift));
    const followers = Math.max(0, Math.round((coin.followers || 0) + followerDrift));
    return {
      ...coin,
      price: nextPrice,
      history: updatedHistory,
      lastReason: reason,
      holders,
      followers,
      trades: Math.max(0, Math.round((coin.trades || 0) + Math.abs(holderDrift))),
    };
  });
  persistUserCoins();
  renderUserCoins();
};

const toggleNewsPanel = () => {
  if (!plusNewsPanel || !plusNewsToggle || !plusNewsToggleLabel) {
    return;
  }
  const isCollapsed = plusNewsPanel.classList.toggle("is-collapsed");
  plusNewsToggle.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  plusNewsToggleLabel.textContent = isCollapsed ? "Haberleri göster" : "Haberleri gizle";
};

const exportUserRequests = () => {
  if (!Array.isArray(userCoinRequests) || userCoinRequests.length === 0) {
    return;
  }
  const payload = JSON.stringify(userCoinRequests.slice(-USER_REQUESTS_LIMIT), null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "minance-coin-istekleri.json";
  document.body.appendChild(anchor);
  anchor.click();
  requestAnimationFrame(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  });
};

const handlePlusFormSubmit = (event) => {
  event.preventDefault();
  if (!plusForm) {
    return;
  }
  const formData = new FormData(plusForm);
  const name = String(formData.get("name") || "").trim();
  const symbolInput = String(formData.get("symbol") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const image = String(formData.get("image") || "").trim();
  const cap = Number(formData.get("cap")) || 0;
  if (!name || !symbolInput || !description || !cap) {
    if (plusErrorEl) {
      plusErrorEl.textContent = "Lütfen isim, kısaltma, açıklama ve tavan değerini doldurun.";
    }
    return;
  }
  const symbol = normalizeSymbol(symbolInput, name);
  const existingSymbols = new Set([...coinsDirectory.map((c) => c.symbol), ...userCoins.map((c) => c.symbol)]);
  if (existingSymbols.has(symbol)) {
    if (plusErrorEl) {
      plusErrorEl.textContent = "Bu kısaltma zaten kullanılıyor.";
    }
    return;
  }
  const startingPrice = clampNumber(cap, 1000, 2000);
  const followers = Math.round(80 + Math.random() * 220);
  const holders = Math.round(20 + Math.random() * 80);
  const newCoin = {
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    symbol,
    description,
    image,
    volatility: "wild",
    role: "community",
    cap: startingPrice,
    price: startingPrice,
    basePrice: startingPrice,
    history: [{ timestamp: Date.now(), price: startingPrice }],
    followers,
    holders,
    trades: 0,
    lastReason: "Başlangıç",
    createdAt: Date.now(),
    ownerId: currentUserId,
  };
  userCoins.push(newCoin);
  persistUserCoins();
  appendRequestLogEntry(`${symbol} (${name}) için yeni topluluk coini oluşturuldu.`);
  renderUserCoins();
  plusForm.reset();
  if (plusErrorEl) {
    plusErrorEl.textContent = "";
  }
};

const startPlusTicker = () => {
  if (plusTickerId !== null) {
    window.clearInterval(plusTickerId);
  }
  const tick = () => {
    const pulse = emitNewsPulse();
    updateUserCoinsWithPulse(pulse);
  };
  tick();
  plusTickerId = window.setInterval(tick, PLUS_TICK_INTERVAL);
};

if (plusNewsToggle) {
  plusNewsToggle.addEventListener("click", toggleNewsPanel);
}

if (plusForm) {
  plusForm.addEventListener("submit", handlePlusFormSubmit);
}

if (plusRequestsExportButton) {
  plusRequestsExportButton.addEventListener("click", exportUserRequests);
}

const handleConsoleCopy = () => {
  if (!navigator.clipboard || !Array.isArray(userRequestLog) || userRequestLog.length === 0) {
    return;
  }
  const text = userRequestLog
    .slice(-USER_REQUEST_LOG_LIMIT)
    .map((entry) => {
      const label = new Date(entry.timestamp).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
      return `[${label}] ${entry.message}`;
    })
    .join("\n");
  navigator.clipboard.writeText(text).catch(() => {});
  if (plusConsoleCopyButton) {
    plusConsoleCopyButton.textContent = "Kopyalandı";
    window.setTimeout(() => {
      plusConsoleCopyButton.textContent = "Kopyala";
    }, 1500);
  }
};

if (plusConsoleCopyButton) {
  plusConsoleCopyButton.addEventListener("click", handleConsoleCopy);
}

updateAiPlusPriceDisplays();
syncAiPlusUI();
renderAiHistory();

let priceUpdateTimeoutId = null;

const scheduleNextPriceUpdate = () => {
  const now = Date.now();
  const elapsed = (now - MARKET_EPOCH) % PRICE_INTERVAL;
  let delay = PRICE_INTERVAL - elapsed;
  if (!Number.isFinite(delay) || delay <= 0) {
    delay = PRICE_INTERVAL;
  }
  priceUpdateTimeoutId = window.setTimeout(() => {
    synchronizeAllCoins();
    scheduleNextPriceUpdate();
  }, delay);
};

const startPriceFeed = () => {
  if (priceUpdateTimeoutId !== null) {
    clearTimeout(priceUpdateTimeoutId);
    priceUpdateTimeoutId = null;
  }
  synchronizeAllCoins();
  scheduleNextPriceUpdate();
};

if (coinCards.size > 0) {
  startPriceFeed();
}

attachTradeListeners();

window.addEventListener("resize", () => {
  drawChart();
  if (chartModal && !chartModal.hidden) {
    drawDetailChart();
  }
});
