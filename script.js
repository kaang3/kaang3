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

const convoState = {
  awaitingMoodReply: false,
  awaitingGoalPlan: false,
  awaitingGeneralAnswer: false,
  awaitingEpsteinList: false
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
  "Evet onayını aldım, devam ✨",
  "Mükemmel, bir sonraki adımı açıyorum ✅",
  "Tamamdır kanka, ilerliyoruz 🌟",
  "Anlaştık, şimdi en iyi şekilde yapalım 🧠",
  "Süper seçim, devam modu açık 🎯",
  "Okey, adım adım gidiyoruz 🤝",
  "Harika! Şimdi net bir planla ilerleyelim 🌈",
  "Evet cevabın geldi, başlıyoruz 🐟"
];

const generalNoResponses = [
  "Tamam, sorun yok 💙 Farklı bir seçenek deneyelim.",
  "Okey, bu yolu kapatıyoruz 🌿 Başka ne yapalım?",
  "Anladım, o zaman alternatif sunayım ✨",
  "Sıkıntı yok, yeni plan açıyorum ✅",
  "Tamamdır, bu değilse başka bir yol var 🤝",
  "Hiç problem değil, birlikte farklı bir rota seçelim 🧭",
  "O zaman daha kolay bir seçenekle devam edelim 🐟",
  "Anlaşıldı, bunu pas geçtik. Başka ne istersin?",
  "Tamam, sana daha uygun bir alternatif çıkarıyorum 💡",
  "Sorun yok, yeni bir öneriyle devam edelim 🚀"
];

const epsteinResponses = [
  "Epstein konusu tek cümleyle geçilecek bir başlık değil 📚 Hukuk süreçleri, mağdur anlatıları, kamuoyu baskısı ve kurumsal güven tartışması birlikte ilerlediği için çok katmanlı görünüyor. İnsanlar bu meseleyi sadece bir kişi odaklı değil; 'adalet eşit işliyor mu?', 'şeffaflık var mı?', 'mağdur hakları yeterince korunuyor mu?' gibi sorular üzerinden değerlendiriyor. Bu yüzden gündemi uzun süre meşgul etti ve etmeye devam ediyor. İstersen daha kısa 5 maddeye de ayırayım mı?",
  "Bu başlıkta en önemli nokta, olayın yalnızca adli dosya olarak kalmaması ⚖️ Medya etkisi, toplumsal hassasiyet ve hesap verebilirlik beklentisiyle konu büyüdü. Bu yüzden insanlar sadece 'ne oldu?'yu değil, 'sistem neden böyle çalıştı?' sorusunu da soruyor. Konu karmaşık görünse de ana hatlarda okunduğunda daha anlaşılır oluyor. İstersen bunu 5 maddede kısa özet yapabilirim.",
  "Uzun çerçevede bakınca Epstein dosyası; ağır iddialar, süreç tartışmaları ve kamu güveni krizi ekseninde okunuyor 🌍 Bu birleşim konuyu global ölçekte görünür yaptı. O nedenle sadece biyografik bir soru değil, modern hukuk ve etik tartışmasının sembolik vakalarından biri hâline geldi. İstersen daha kısa 5 maddelik versiyonunu çıkarayım mı?",
  "Kısa gibi görünen ama derin bir dosya bu 🧠 Çünkü burada hukuk + etik + kamu vicdanı aynı anda devrede. Süreçlerin algısı, mağdur odaklı beklentiler ve güç ilişkileri başlıkları birlikte konuşulunca olay daha büyük bir sistem tartışmasına dönüşüyor. İstersen pratik bir 5 maddelik özetle de anlatabilirim.",
  "Bu konuda kafa karışması normal; bilgi çok, gürültü de çok 🔎 En güvenli yöntem ana hatlarla gitmek: ciddi iddialar, dikkat çeken süreçler, mağdur perspektifi ve şeffaflık beklentisi. Olayın etkisi bu yüzden yalnız geçmişte kalmadı, bugün de tartışılıyor. İstersen 5 maddelik kısa versiyonunu da yapayım."
];

const epsteinListResponses = [
  "1) Epstein, finans çevrelerinde bilinen bir isimdi.\n2) Reşit olmayan mağdurlara ilişkin ciddi suçlamalarla gündeme geldi.\n3) Farklı dönemlerde yargı süreçleri ve tartışmalı adımlar yaşandı.\n4) Yüksek profilli çevre bağlantıları kamuoyunda yankı yarattı.\n5) Dosya, adalet-şeffaflık-hesap verebilirlik tartışmalarını büyüttü.",
  "1) Epstein dosyası cinsel suç iddialarıyla küresel gündeme taşındı.\n2) İlk dönem süreçleri kamuoyunda yoğun eleştiri aldı.\n3) Sonraki yıllarda yeni mağdur anlatıları dikkat çekti.\n4) Medya görünürlüğü dosyanın etkisini artırdı.\n5) Konu, kurumlara güven tartışmasının simgelerinden biri oldu.",
  "1) Birden fazla soruşturma dönemi yaşandı.\n2) Mağdur odaklı adalet talebi büyüdü.\n3) Süreçlerin şeffaflığı sürekli sorgulandı.\n4) Güç ilişkileri tartışmayı daha da derinleştirdi.\n5) Sonuçta olay, hukuk ve etik dengesi açısından örnek vaka hâline geldi."
];

const keyword20 = ["odak","hedef","motivasyon","özgüven","cesaret","plan","disiplin","başlangıç","devam","düzen","üretkenlik","yaratıcılık","fikir","özet","slogan","sunum","proje","metin","hikâye","şiir"];
const prompts20x10 = [
  "Bunun için sana hızlı bir mini plan çıkarabilirim 💡",
  "İstersen 3 adımda çok net ilerleyelim 🚀",
  "Buna uygun yaratıcı bir içerik üretebilirim ✨",
  "İstersen kısa ve uzun versiyon hazırlayayım 🧠",
  "Bu konuda örneklerle yardımcı olabilirim 📘",
  "Hedef odaklı bir yol haritası çıkaralım 🎯",
  "İstersen motivasyon + uygulama planı birlikte yapalım 💙",
  "Bunu profesyonel tonda da yazabilirim 📝",
  "Buna uygun 5 fikir atabilirim 🌈",
  "Bu başlık için hemen güçlü bir taslak verebilirim ⚡"
];

const imageAssets = {
  nature: ["assets/nature-1.svg", "assets/nature-2.svg", "assets/nature-3.svg"],
  steak: "assets/steak.svg", lego: "assets/lego.svg", cat: "assets/cat.svg", ship: "assets/ship.svg", unknown: "assets/anlamadim-aw.svg"
};
const imageKeywords = {
  nature: ["doğa","doga","orman","nehir","şelale","selale","göl","gol","dağ","dag","manzara","vadi","çiçek","cicek","yayla","nature","landscape","forest","waterfall","river","lake"],
  steak: ["biftek","et","yemek","ızgara","izgara","mangal","steak","beef","meat","antrikot","bonfile"],
  lego: ["lego","oyuncak","oyuncak araba","blok","brick","lego car","lego set"],
  cat: ["kedi","cat","pati","miyav","tekir","yavru kedi","kitten"],
  ship: ["gemi","ship","tekne","vaput","feribot","boat","vessel"]
};

function supportsContextModel() { return currentModel === "baluk-1.5" || currentModel === "baluk-2.0"; }
function chooseRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function hasAny(text, list) { return list.some((i) => text.includes(i)); }

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
  const fish = node.querySelector('.think-fish');
  if (fish) fish.classList.remove('spin-fast');
  const content = document.createElement('div');
  content.className = 'thinking-answer';
  content.textContent = text;
  node.appendChild(content);
}

function addImageLoading() {
  const n = document.createElement("div");
  n.className = "msg bot image-gen-loading";
  n.innerHTML = `<div><strong>baluk-2.0 görsel üretiyor...</strong></div>
  <div class="particle-field"><span class="particle"></span><span class="particle"></span><span class="particle"></span><span class="particle"></span><span class="particle"></span><div class="canvas-core"><span class="brush-spin">🖌️</span></div></div>`;
  chat.appendChild(n); chat.scrollTop = chat.scrollHeight; return n;
}
function addImageResult(src, caption) {
  const n = document.createElement("div");
  n.className = "msg bot image-output";
  n.innerHTML = `<img src="${src}" alt="${caption}"><div class="caption">${caption}</div>`;
  chat.appendChild(n); chat.scrollTop = chat.scrollHeight;
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

function solveSimpleExpression(input) {
  const normalized = input.toLowerCase().replaceAll("x","*").replaceAll("çarpı","*").replaceAll("kere","*").replaceAll("bölü","/").replaceAll("artı","+").replaceAll("eksi","-").replace(/[^0-9+\-*/()., ]/g,"").replaceAll(",", ".").trim();
  if (!/[0-9]/.test(normalized) || !/[+\-*/]/.test(normalized)) return null;
  try {
    const value = Function(`"use strict";return (${normalized});`)();
    if (Number.isFinite(value)) return `Sonuç: ${value} ✅`;
  } catch {}
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
  if (q.includes("yedi") || q.includes("verdi") || q.includes("kaldı")) return `Problem sonucu: ${nums[0]-nums[1]} elma kalır.`;
  if (q.includes("aldı") || q.includes("kaç oldu") || q.includes("toplam")) return `Problem sonucu: ${nums[0]+nums[1]} elma olur.`;
  return null;
}

function updateModelVisual() {
  currentModelBadge.textContent = currentModel;
  if (currentModel === "baluk-2.0") currentModelBadge.classList.add("glow-20");
  else currentModelBadge.classList.remove("glow-20");
}
function updateGeneralQuestionState(answer) {
  convoState.awaitingGeneralAnswer = supportsContextModel() && answer.includes("?");
}

function resolveFollowUp(input) {
  if (!supportsContextModel()) return null;
  const l = input.toLowerCase();

  if (convoState.awaitingEpsteinList && hasAny(l,["evet","olur","tamam","5 madde","beş madde","5 maddeye ayır","beş maddeye ayır"])) {
    convoState.awaitingEpsteinList = false;
    return chooseRandom(epsteinListResponses);
  }
  if (hasAny(l, ["ne yapalım", "ne yapalim", "napalım", "napalim"])) return chooseRandom(neYapalimResponses);

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
  if (hasAny(l, ["üzgünüm", "moralim bozuk", "sıkıldım", "kötüyüm", "dertleşmek istiyorum"])) {
    if (supportsContextModel()) convoState.awaitingGoalPlan = true;
    return "Yanındayım 💙 İstersen kendimize nazik bir plan yapalım mı?";
  }
  if (hasAny(l, ["epstein", "epstion", "epstien"])) {
    if (supportsContextModel()) convoState.awaitingEpsteinList = true;
    return chooseRandom(epsteinResponses);
  }

  const apple = solveAppleProblem(input); if (apple) return apple;
  const eq = solveLinearEquation(input); if (eq) return eq;
  const expr = solveSimpleExpression(input); if (expr) return expr;

  if (currentModel === "baluk-2.0" && keyword20.some((k) => l.includes(k))) return chooseRandom(prompts20x10);
  return `Mesajını aldım: "${input}"\nAktif model: ${currentModel} ✅`;
}

function startChatIfNeeded() {
  if (hasStartedChat) return;
  hasStartedChat = true; splash.classList.add("hidden"); chat.classList.remove("hidden");
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
  Object.keys(convoState).forEach((k) => convoState[k] = false);
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
