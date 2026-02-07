const chat = document.getElementById("chat");
const splash = document.getElementById("splash");
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

let currentModel = "baluk-1.6";
let hasStartedChat = false;

const convoState = {
  awaitingMoodReply: false,
  awaitingGoalPlan: false,
  awaitingGeneralAnswer: false,
  awaitingEpsteinList: false
};

const userMemory = JSON.parse(localStorage.getItem("balukMemory") || "{}");

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

const iyiyimFollowUpResponses = [
  "İyi olmana sevindim 💙 Harika haber!",
  "Süper! Buna çok mutlu oldum 🌟",
  "Ohh çok iyi 😄 Buna sevindim.",
  "Harikasın, iyi hissetmen şahane ✨",
  "Mükemmel, moralini yüksek tutman güzel 🚀",
  "Buna sevindim dostum 🤝",
  "Ne güzel söyledin, sevindim 🌈",
  "Bu çok iyi bir haber 🐟",
  "İyi olmana gerçekten sevindim 💫",
  "Çok sevindim, böyle devam! 🎉"
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
  "Şiir modu açalım mı? 'şiir yaz' de ✨",
  "Hikâye üretelim: bana tema ver 📖",
  "Dertleşme + toparlanma modu yapalım 💙",
  "Slogan/metin üretelim 🚀",
  "3 kelime ver, mini metin yazayım 🎨",
  "Kısa hedef koyup bitirelim 🎯",
  "Bilmece turu yapalım 😄",
  "Özetleme modu açalım 🧠",
  "Sen seç: matematik / şiir / hikâye 🐟"
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

const epsteinResponses = [
  "Epstein konusu tek cümleyle geçilecek bir başlık değil 📚 Hukuk süreçleri, mağdur anlatıları, kamuoyu baskısı ve kurumsal güven tartışması birlikte ilerlediği için çok katmanlı görünüyor. İnsanlar bu meseleyi sadece bir kişi odaklı değil; 'adalet eşit işliyor mu?', 'şeffaflık var mı?', 'mağdur hakları korunuyor mu?' gibi sorular üzerinden değerlendiriyor. İstersen daha kısa 5 maddeye de ayırayım mı?",
  "Bu başlıkta en önemli nokta, olayın yalnızca adli dosya olarak kalmaması ⚖️ Medya etkisi, toplumsal hassasiyet ve hesap verebilirlik beklentisiyle konu büyüdü. Bu yüzden insanlar sadece 'ne oldu?'yu değil, 'sistem neden böyle çalıştı?' sorusunu da soruyor. İstersen bunu 5 maddede kısa özet yapabilirim.",
  "Uzun çerçevede bakınca dosya; ağır iddialar, süreç tartışmaları ve kamu güveni krizi ekseninde okunuyor 🌍 Bu birleşim konuyu global ölçekte görünür yaptı. O nedenle yalnız biyografik soru değil, hukuk ve etik tartışmasının sembolik vakalarından biri. İstersen 5 maddelik versiyonu da çıkarayım mı?",
  "Kısa gibi görünen ama derin bir dosya bu 🧠 Çünkü burada hukuk + etik + kamu vicdanı aynı anda devrede. Süreçlerin algısı, mağdur odaklı beklentiler ve güç ilişkileri başlıkları birlikte konuşulunca olay daha büyük bir sistem tartışmasına dönüşüyor. İstersen 5 maddeye indirebilirim.",
  "Bu konuda kafa karışması normal; bilgi çok, gürültü de çok 🔎 En güvenli yöntem ana hatlarla gitmek: ciddi iddialar, dikkat çeken süreçler, mağdur perspektifi ve şeffaflık beklentisi. Olayın etkisi bu yüzden bugün de sürüyor. İstersen 5 maddelik kısa versiyon hazırlayayım."
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

function supportsContextModel() {
  return currentModel === "baluk-1.5" || currentModel === "baluk-1.6";
}

function chooseRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function hasAny(text, list) { return list.some((i) => text.includes(i)); }

function saveMemory() {
  localStorage.setItem("balukMemory", JSON.stringify(userMemory));
}

function renderMemoryList() {
  memoryList.innerHTML = "";
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
    return "Belleğe kaydettim 🧠 İstersen 'belleğimde ne var' diye sorabilirsin.";
  }
  return null;
}

function addMessage(text, role) {
  const n = document.createElement("div");
  n.className = `msg ${role}`;
  n.textContent = text;
  chat.appendChild(n);
  chat.scrollTop = chat.scrollHeight;
}

function addThinkingBubble() {
  const n = document.createElement("div");
  n.className = "msg bot thinking-bubble";
  n.innerHTML = `
    <div class="thinking-head">
      <svg class="fish-logo think-fish spin-fast" viewBox="0 0 520 220" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#baluk-fish"></use></svg>
      <span>Baluk düşünüyor...</span>
    </div>
  `;
  chat.appendChild(n);
  chat.scrollTop = chat.scrollHeight;
  return n;
}

function fillThinkingBubble(node, text) {
  const fish = node.querySelector(".think-fish");
  if (fish) fish.classList.remove("spin-fast");
  const content = document.createElement("div");
  content.className = "thinking-answer";
  content.textContent = text;
  node.appendChild(content);
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

function solveAppleProblem(input) {
  const q = input.toLowerCase();
  const nums = (q.match(/\d+/g) || []).map(Number);
  if (!q.includes("elma") || nums.length < 2) return null;
  if (q.includes("yedi") || q.includes("verdi") || q.includes("kaldı")) return `Problem sonucu: ${nums[0] - nums[1]} elma kalır.`;
  if (q.includes("aldı") || q.includes("kaç oldu") || q.includes("toplam")) return `Problem sonucu: ${nums[0] + nums[1]} elma olur.`;
  return null;
}

function updateModelVisual() {
  currentModelBadge.textContent = currentModel;
}

function updateGeneralQuestionState(answer) {
  convoState.awaitingGeneralAnswer = supportsContextModel() && answer.includes("?");
}

function resolveFollowUp(input) {
  if (!supportsContextModel()) return null;
  const l = input.toLowerCase();

  if (convoState.awaitingEpsteinList && hasAny(l, ["evet", "olur", "tamam", "5 madde", "beş madde", "5 maddeye ayır", "beş maddeye ayır"])) {
    convoState.awaitingEpsteinList = false;
    return chooseRandom(epsteinListResponses);
  }

  if (hasAny(l, ["ne yapalım", "ne yapalim", "napalım", "napalim"])) {
    return chooseRandom(neYapalimResponses);
  }

  if (convoState.awaitingMoodReply && hasAny(l, ["iyiyim", "ben de iyiyim", "bende iyiyim", "harikayım", "süperim"])) {
    convoState.awaitingMoodReply = false;
    return chooseRandom(iyiyimFollowUpResponses);
  }

  if (convoState.awaitingGoalPlan && hasAny(l, ["hedef koyalım", "tamam", "olur", "hadi"])) {
    convoState.awaitingGoalPlan = false;
    return chooseRandom(goalPlanResponses);
  }

  if (convoState.awaitingGeneralAnswer && hasAny(l, ["evet", "olur", "tamam", "hayır", "hayir"])) {
    convoState.awaitingGeneralAnswer = false;
    return hasAny(l, ["evet", "olur", "tamam"]) ? chooseRandom(generalYesResponses) : chooseRandom(generalNoResponses);
  }

  return null;
}

function buildTextResponse(input) {
  const l = input.toLowerCase();

  if (hasAny(l, ["belleğimde ne var", "bellek", "kayıtlarım", "beni hatırla", "beni hatırla baluk"])) {
    const entries = Object.entries(userMemory);
    if (!entries.length) return "Belleğinde kayıt yok. Bana 'Benim adım ...' gibi bilgiler yazabilirsin.";
    const summary = entries.map(([k, v]) => `${k}: ${v}`).join("\n");
    return `Belleğinde şunlar var:\n${summary}`;
  }

  const memorySaved = parseMemory(input);
  if (memorySaved) return memorySaved;

  const follow = resolveFollowUp(input);
  if (follow) return follow;

  if (hasAny(l, ["merhaba", "selam", "merhab", "meraba", "kanka merhaba"])) {
    if (supportsContextModel()) convoState.awaitingMoodReply = true;
    return chooseRandom(merhabaResponses);
  }

  if (hasAny(l, ["nasılsın", "nasilsin"])) {
    if (supportsContextModel()) convoState.awaitingMoodReply = true;
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

  const apple = solveAppleProblem(input); if (apple) return apple;
  const eq = solveLinearEquation(input); if (eq) return eq;
  const expr = solveSimpleExpression(input); if (expr) return expr;

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

  const thinking = addThinkingBubble();
  setTimeout(() => {
    const response = buildTextResponse(text);
    updateGeneralQuestionState(response);
    fillThinkingBubble(thinking, response);
  }, 1100);
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
  Object.keys(convoState).forEach((k) => { convoState[k] = false; });
  chat.innerHTML = "";
  chat.classList.add("hidden");
  splash.classList.remove("hidden");
});

memoryToggle.addEventListener("click", () => {
  memoryPanel.classList.toggle("hidden");
  renderMemoryList();
});

clearMemory.addEventListener("click", () => {
  Object.keys(userMemory).forEach((k) => delete userMemory[k]);
  saveMemory();
  renderMemoryList();
});

modelToggle.addEventListener("click", () => modelMenu.classList.toggle("hidden"));

document.addEventListener("click", (e) => {
  if (!modelMenu.contains(e.target) && !modelToggle.contains(e.target)) modelMenu.classList.add("hidden");
});

modelOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    modelOptions.forEach((i) => i.classList.remove("active"));
    opt.classList.add("active");
    currentModel = opt.dataset.model;
    updateModelVisual();
    modelMenu.classList.add("hidden");
  });
});

renderMemoryList();
updateModelVisual();
