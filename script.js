const chat = document.getElementById("chat");
const splash = document.getElementById("splash");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const clearChat = document.getElementById("clearChat");
const modelToggle = document.getElementById("modelToggle");
const modelMenu = document.getElementById("modelMenu");
const modelOptions = document.querySelectorAll(".model-option");
const currentModelBadge = document.getElementById("currentModelBadge");
const plusToggle = document.getElementById("plusToggle");
const plusMenu = document.getElementById("plusMenu");
const imageMode = document.getElementById("imageMode");

let currentModel = "baluk-2.0";
let hasStartedChat = false;
const convoState = { awaitingMoodReply: false, awaitingGoalPlan: false, awaitingGeneralAnswer: false };

const nasilsinResponses = [
  "Ben iyiyim kanka 😄 Sen nasılsın?", "Gayet iyiyim dostum 🌟 Sen nasılsın?", "Harikayım, enerji full ⚡ Sen nasılsın?",
  "İyiyim ve buradayım 🐟 Sen nasılsın?", "Süperim, bugün çok motiveyim 🚀 Sen nasılsın?",
  "Baya iyiyim, sohbet modum açık 💙 Sen nasılsın?", "İyiyim vallahi, keyfim yerinde 😎 Sen nasılsın?",
  "Şu an çok iyiyim, birlikte üretmeye hazırım ✨ Sen nasılsın?", "İyiyim dost, sana da iyi gelmek isterim 🤝 Sen nasılsın?",
  "İyiyim, teşekkürler! Bugün çok canlıyım 🌈 Sen nasılsın?"
];
const iyiyimFollowUpResponses = [
  "İyi olmana sevindim 💙 Harika haber!", "Süper! Buna çok mutlu oldum 🌟", "Ohh çok iyi 😄 Buna sevindim.",
  "Harikasın, iyi hissetmen şahane ✨", "Mükemmel, moralini yüksek tutman güzel 🚀", "Buna sevindim dostum 🤝",
  "Ne güzel söyledin, sevindim 🌈", "Bu çok iyi bir haber 🐟", "İyi olmana gerçekten sevindim 💫", "Çok sevindim, böyle devam! 🎉"
];
const goalPlanResponses = [
  "1) Su iç 2) 10 dk tek görev 3) Sonucu bana yaz 🎯", "Mini plan: nefes al, küçük hedef seç, hemen başla ✨",
  "Adım adım: ortamı düzenle, tek işe odaklan, bitince kutla 🎉", "Sakin plan: 5 dk mola + 10 dk odak + kontrol ✅",
  "Yormayan plan: hedefi küçült, zaman koy, başlat 🚀", "Plan: duyguyu yaz, ilk adımı seç, uygula 🌿",
  "Hedef planı: dikkat dağıtanı kapat, tek görev, kısa geri bildirim 🧠", "Toparlanma planı: nefes, su, mikro görev 💙",
  "Önce kolay görevi bitirelim, sonra ikinci adıma geçelim 🐟", "Kısa plan: şimdi başla, sonra bana 'tamamladım' yaz ✍️"
];
const neYapalimResponses = [
  "Mini matematik challenge yapalım: bir işlem yaz 📘", "Şiir modu açalım mı? 'şiir yaz' de ✨", "Hikâye üretelim: tema ver 📖",
  "Dertleşme + toparlanma yapalım 💙", "Slogan/metin üretelim 🚀", "3 kelime ver, mini metin yazayım 🎨",
  "Kısa hedef koyup bitirelim 🎯", "Bilmece turu yapalım 😄", "Özetleme modu açalım 🧠", "Sen seç: matematik/şiir/hikâye 🐟"
];

const keyword20 = ["odak","hedef","motivasyon","özgüven","cesaret","plan","disiplin","başlangıç","devam","düzen","üretkenlik","yaratıcılık","fikir","özet","slogan","sunum","proje","metin","hikâye","şiir"];
const prompts20x10 = [
  "Bunun için sana hızlı bir mini plan çıkarabilirim 💡", "İstersen 3 adımda çok net ilerleyelim 🚀", "Buna uygun yaratıcı bir içerik üretebilirim ✨",
  "İstersen kısa ve uzun versiyon hazırlayayım 🧠", "Bu konuda örneklerle yardımcı olabilirim 📘", "Hedef odaklı bir yol haritası çıkaralım 🎯",
  "İstersen motivasyon + uygulama planı birlikte yapalım 💙", "Bunu profesyonel tonda da yazabilirim 📝", "Buna uygun 5 fikir atabilirim 🌈", "Bu başlık için hemen güçlü bir taslak verebilirim ⚡"
];

const imageAssets = {
  nature: ["assets/nature-1.svg", "assets/nature-2.svg", "assets/nature-3.svg"],
  steak: "assets/steak.svg",
  lego: "assets/lego.svg",
  cat: "assets/cat.svg",
  ship: "assets/ship.svg",
  unknown: "assets/anlamadim-aw.svg"
};

const imageKeywords = {
  nature: [
    "doğa", "doga", "orman", "nehir", "şelale", "selale", "göl", "gol", "dağ", "dag", "manzara", "vadi", "çiçek", "cicek", "yayla",
    "doğa manzarası", "orman manzarası", "doğa resmi", "nature", "landscape", "forest", "waterfall", "river", "lake", "mountain", "mountains", "valley", "sunset nature", "green nature", "alpine"
  ],
  steak: [
    "biftek", "et", "yemek", "ızgara", "izgara", "mangal", "sulu biftek", "steak", "beef", "meat", "medium rare", "antrikot", "bonfile", "kırmızı et", "kirmizi et"
  ],
  lego: [
    "lego", "oyuncak", "oyuncak araba", "blok", "blocks", "brick", "lego araba", "lego car", "lego set", "lego yarış", "lego yaris", "minifig", "parça", "parca", "plastik blok"
  ],
  cat: [
    "kedi", "cat", "pati", "miyav", "minnoş", "minnos", "tekir", "yavru kedi", "kedicik", "pet", "sokak kedisi", "evcil kedi", "cute cat", "kitten", "feline"
  ],
  ship: [
    "gemi", "ship", "tekne", "vaput", "feribot", "yat", "yacht", "boat", "kargo gemisi", "liman", "deniz", "boğaz", "bogaz", "sail", "vessel"
  ]
};

function chooseRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function hasAny(text, list) { return list.some((i) => text.includes(i)); }

function addMessage(text, role) {
  const n = document.createElement("div");
  n.className = `msg ${role}`;
  n.textContent = text;
  chat.appendChild(n);
  chat.scrollTop = chat.scrollHeight;
}

function addImageLoading() {
  const n = document.createElement("div");
  n.className = "msg bot image-gen-loading";
  n.innerHTML = `
    <div><strong>baluk-2.0 görsel üretiyor...</strong></div>
    <div class="particle-field">
      <span class="particle"></span><span class="particle"></span><span class="particle"></span><span class="particle"></span><span class="particle"></span>
      <div class="canvas-core"><span class="brush-spin">🖌️</span></div>
    </div>
  `;
  chat.appendChild(n);
  chat.scrollTop = chat.scrollHeight;
  return n;
}

function addImageResult(src, caption) {
  const n = document.createElement("div");
  n.className = "msg bot image-output";
  n.innerHTML = `<img src="${src}" alt="${caption}"><div class="caption">${caption}</div>`;
  chat.appendChild(n);
  chat.scrollTop = chat.scrollHeight;
}

function detectImageAsset(input) {
  const l = input.toLowerCase();
  if (hasAny(l, imageKeywords.nature)) return chooseRandom(imageAssets.nature);
  if (hasAny(l, imageKeywords.steak)) return imageAssets.steak;
  if (hasAny(l, imageKeywords.lego)) return imageAssets.lego;
  if (hasAny(l, imageKeywords.cat)) return imageAssets.cat;
  if (hasAny(l, imageKeywords.ship)) return imageAssets.ship;
  return imageAssets.unknown;
}

function updateModelVisual() {
  currentModelBadge.textContent = currentModel;
  if (currentModel === "baluk-2.0") currentModelBadge.classList.add("glow-20");
  else currentModelBadge.classList.remove("glow-20");
}

function updateGeneralQuestionState(answer) {
  convoState.awaitingGeneralAnswer = currentModel === "baluk-1.5" && answer.includes("?");
}

function resolveFollowUp(input) {
  const l = input.toLowerCase();
  if (currentModel !== "baluk-1.5") return null;

  if (hasAny(l, ["ne yapalım", "ne yapalim", "napalım", "napalim"])) return chooseRandom(neYapalimResponses);

  if (convoState.awaitingMoodReply && hasAny(l, ["iyiyim", "ben de iyiyim", "bende iyiyim", "bende iyiyim kanka"])) {
    convoState.awaitingMoodReply = false;
    return chooseRandom(iyiyimFollowUpResponses);
  }

  if (convoState.awaitingGoalPlan && hasAny(l, ["hedef koyalım", "tamam", "olur", "hadi"])) {
    convoState.awaitingGoalPlan = false;
    return chooseRandom(goalPlanResponses);
  }

  if (convoState.awaitingGeneralAnswer && hasAny(l, ["evet", "olur", "tamam", "hayır", "hayir"])) {
    convoState.awaitingGeneralAnswer = false;
    return hasAny(l, ["evet", "olur", "tamam"]) ? "Harika, devam edelim 🚀" : "Tamamdır, başka bir yola geçelim 💙";
  }

  return null;
}

function buildTextResponse(input) {
  const l = input.toLowerCase();

  const follow = resolveFollowUp(input);
  if (follow) return follow;

  if (hasAny(l, ["merhaba", "selam", "merhab"])) return "Selammm! ✨ Buradayım dostum. Sen nasılsın?";
  if (hasAny(l, ["nasılsın", "nasilsin"])) {
    if (currentModel === "baluk-1.5") convoState.awaitingMoodReply = true;
    return chooseRandom(nasilsinResponses);
  }
  if (hasAny(l, ["üzgünüm", "moralim bozuk", "sıkıldım", "kötüyüm"])) {
    if (currentModel === "baluk-1.5") convoState.awaitingGoalPlan = true;
    return "Yanındayım 💙 İstersen kendimize nazik bir plan yapalım mı?";
  }
  if (hasAny(l, ["epstein", "epstion", "epstien"])) {
    return "Epstein konusu çok katmanlı bir başlık 📚 hukuk, etik ve toplumsal güven boyutu var. İstersen daha kısa 5 maddeye ayırayım mı?";
  }

  if (currentModel === "baluk-2.0" && keyword20.some((k) => l.includes(k))) {
    return chooseRandom(prompts20x10);
  }

  return `Mesajını aldım: "${input}"\nAktif model: ${currentModel} ✅`;
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

  if (imageMode.checked && currentModel === "baluk-2.0") {
    const loading = addImageLoading();
    const asset = detectImageAsset(text);
    setTimeout(() => {
      loading.remove();
      addImageResult(asset, `baluk-2.0 görsel çıktısı • ${text}`);
    }, 2200);
    return;
  }

  const thinking = document.createElement("div");
  thinking.className = "msg bot";
  thinking.textContent = "Baluk düşünüyor... 🧠";
  chat.appendChild(thinking);
  chat.scrollTop = chat.scrollHeight;

  setTimeout(() => {
    const response = buildTextResponse(text);
    updateGeneralQuestionState(response);
    thinking.textContent = response;
  }, 900);
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  processInput(text);
  userInput.value = "";
});

clearChat.addEventListener("click", () => {
  hasStartedChat = false;
  convoState.awaitingGoalPlan = false;
  convoState.awaitingMoodReply = false;
  convoState.awaitingGeneralAnswer = false;
  chat.innerHTML = "";
  chat.classList.add("hidden");
  splash.classList.remove("hidden");
});

modelToggle.addEventListener("click", () => modelMenu.classList.toggle("hidden"));
plusToggle.addEventListener("click", () => plusMenu.classList.toggle("hidden"));

document.addEventListener("click", (e) => {
  if (!modelMenu.contains(e.target) && !modelToggle.contains(e.target)) modelMenu.classList.add("hidden");
  if (!plusMenu.contains(e.target) && !plusToggle.contains(e.target)) plusMenu.classList.add("hidden");
});

modelOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    modelOptions.forEach((i) => i.classList.remove("active"));
    opt.classList.add("active");
    currentModel = opt.dataset.model;
    updateModelVisual();
    modelMenu.classList.add("hidden");
    if (currentModel !== "baluk-2.0") imageMode.checked = false;
  });
});

updateModelVisual();
