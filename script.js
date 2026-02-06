const chat = document.getElementById("chat");
const splash = document.getElementById("splash");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const clearChat = document.getElementById("clearChat");
const modelToggle = document.getElementById("modelToggle");
const modelMenu = document.getElementById("modelMenu");
const modelOptions = document.querySelectorAll(".model-option");

let hasStartedChat = false;
let currentModel = "baluk-1.0";

const merhabaResponses = [
  "Merhaba! Baluk burada, matematikte birlikte harika ilerleriz.",
  "Selam! Sana işlem, denklem ve problem çözümünde yardımcı olmaya hazırım.",
  "Merhaba 👋 Bugün toplama mı, cebir mi, yoksa kesirler mi çalışalım?",
  "Selamlar! İstersen kolaydan zora doğru matematik turu yapalım.",
  "Merhaba! Baluk.ai ile sayıları net ve hızlı çözelim.",
  "Selam! Bana bir soru yaz, adım adım gidelim.",
  "Merhaba, hoş geldin! Bugün hangi konuda destek istersin?",
  "Selam! Hazırsan ilk soruyu gönder, ben buradayım.",
  "Merhaba! Rasyonel sayılar, denklemler ve problemler için hazırım.",
  "Selam, baluk.ai aktif 🐟 Matematik odaklı güçlü mod açıldı!"
];

const nasilsinResponses = [
  "Çok iyiyim, teşekkür ederim! Seninle matematik çözmek moral veriyor.",
  "Harikayım! Bir soru gönder, birlikte çözelim.",
  "İyiyim 😊 Özellikle cebir ve problemlerde hızlıyım.",
  "Gayet iyi! İstersen hemen bir işlem sorusu çözelim.",
  "Süperim! Toplama, çıkarma, çarpma, bölme hepsi hazır.",
  "İyiyim, teşekkürler. Kesirler ve denklemler için de hazırım.",
  "Baluk her zamanki gibi formda! Bugün ne çalışıyoruz?",
  "İyiyim! Bir matematik problemi yaz, adım adım ilerleyelim.",
  "Çok iyiyim, sen nasılsın? Sayılarla devam edelim mi?",
  "Enerjim yüksek! Özellikle sözel problemleri çözmeyi seviyorum."
];

const mathKeywordBank = [
  "matematik", "aritmetik", "cebir", "denklem", "eşitsizlik", "fonksiyon", "grafik", "polinom", "binom", "trinom", "karekök", "küp", "üs", "logaritma", "trigonometri", "sin", "cos", "tan", "cot", "türev", "integral", "limit", "olasılık", "istatistik", "permütasyon", "kombinasyon", "faktöriyel", "matris", "determinant", "vektör", "analitik", "geometri", "üçgen", "kare", "dikdörtgen", "çember", "daire", "alan", "hacim", "çevre", "oran", "orantı", "yüzde", "faiz", "kesir", "pay", "payda", "rasyonel", "irrasyonel", "doğal", "tam", "asal", "bileşik", "mod", "kalan", "bölünebilme", "bölme", "çarpma", "toplama", "çıkarma", "işlem", "işlem önceliği", "parantez", "mutlak", "sayı doğrusu", "dizi", "seri", "ortalama", "medyan", "mod değer", "standart sapma", "varyans", "korelasyon", "regresyon", "lineer", "kuadratik", "kübik", "parabol", "hiperbol", "elips", "doğru", "eğim", "kesişim", "kök", "kat", "katı", "çarpan", "bölen", "ebob", "ekok", "sadeleştirme", "genişletme", "denk", "eşit", "yaklaşık", "yuvarlama", "ondalık", "virgül", "tam kare", "özdeşlik", "çarpanlara ayırma", "sadeleştir", "çöz", "ispat", "kanıt", "problem", "soru", "alma", "verme", "elma", "miktar", "kilo", "metre", "zaman", "hız", "ivme", "iş", "güç", "oranlama", "birim", "birinci derece", "ikinci derece", "üçüncü derece", "lineer denklem", "denklem sistemi", "iki bilinmeyenli", "üç bilinmeyenli", "gauss", "kare tamamlama", "diskriminant", "delta", "katsayı", "sabit terim", "değişken", "x", "y", "z", "sınav", "çalışma", "soru bankası", "pratik", "hızlı çözüm", "adım adım", "mantık", "küme", "alt küme", "birleşim", "kesişim kümesi", "fark kümesi", "kartezyen", "doğrusal", "çizelge", "tablo", "sütun", "çubuk grafik", "pasta grafik", "çizgi grafik", "dağılım", "çokgen", "yamuk", "paralelkenar", "dik üçgen", "hipotenüs", "pisagor", "öklid", "benzerlik", "eşlik", "açı", "radyan", "derece"
];

const topicResponses = {
  kesir: [
    "Kesirlerde önce pay/payda ilişkisini kontrol ederiz, sonra sadeleştiririz.",
    "Kesir toplamada paydaları eşitlemek en güvenli başlangıçtır.",
    "Kesri sadeleştirirken pay ve paydayı ortak bölenlerine ayır.",
    "Bileşik kesri tam sayılıya, tam sayılıyı bileşiğe çevirmeyi deneyelim.",
    "Kesir çarpımında çapraz sadeleştirme hız kazandırır."
  ],
  denklem: [
    "Denklem çözerken amaç bilinmeyeni yalnız bırakmaktır.",
    "Eşitliğin iki tarafına aynı işlemi uygulayarak ilerleriz.",
    "Birinci derece denklemde toplama-çıkarma, sonra çarpma-bölme sırası iyi çalışır.",
    "Parantez varsa önce dağıt, sonra benzer terimleri topla.",
    "Son adımda çözümü yerine yazıp kontrol etmek çok önemlidir."
  ],
  rasyonel: [
    "Rasyonel sayılar a/b biçiminde yazılabilen sayılardır (b ≠ 0).",
    "Rasyonel ifadelerde tanımsızlık için paydayı sıfır yapan değerleri dışlarız.",
    "Sadeleştirme yaparken ortak çarpanları ayırmak işleri hızlandırır.",
    "Rasyonel sayılar sayı doğrusunda tam sayılar arasında da yer alır.",
    "Ondalık gösterimden kesre dönüştürme ile rasyonel kontrolü yapabiliriz."
  ],
  cebir: [
    "Cebirde benzer terimleri toplamak ilk temizlik adımıdır.",
    "Özdeşlikleri bilmek çarpanlara ayırmada çok işine yarar.",
    "x, y gibi değişkenler bilinmeyen değil değişebilir miktarlardır.",
    "Cebirsel ifadelerde işlem önceliği parantezle yönetilir.",
    "Soruyu önce sembolleştirirsen çözüm çok netleşir."
  ]
};

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function playClickSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  if (!window.__balukAudio) {
    window.__balukAudio = new AudioCtx();
  }

  const ctx = window.__balukAudio;
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.value = 1300;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.055);
}

function addMessage(text, role) {
  const node = document.createElement("div");
  node.className = `msg ${role}`;
  node.textContent = text;
  chat.appendChild(node);
  chat.scrollTop = chat.scrollHeight;
}

function addThinkingMessage() {
  const node = document.createElement("div");
  node.className = "msg bot thinking";
  node.innerHTML = `
    <div class="thinking-logo spin-3s">
      <svg class="fish-logo think" viewBox="0 0 520 220" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
        <use href="#baluk-fish"></use>
      </svg>
    </div>
    <div class="thinking-text">Baluk düşünüyor...</div>
  `;
  chat.appendChild(node);
  chat.scrollTop = chat.scrollHeight;
  return node;
}

function finishThinkingMessage(node, answer) {
  const logo = node.querySelector(".thinking-logo");
  const text = node.querySelector(".thinking-text");
  logo.classList.remove("spin-3s");
  text.textContent = answer;
}

function openChatIfNeeded() {
  if (hasStartedChat) return;
  hasStartedChat = true;
  splash.classList.add("hidden");
  chat.classList.remove("hidden");
}

function resetChat() {
  hasStartedChat = false;
  chat.innerHTML = "";
  chat.classList.add("hidden");
  splash.classList.remove("hidden");
  userInput.value = "";
  userInput.focus();
}

function solveSimpleExpression(input) {
  const normalized = input
    .toLowerCase()
    .replaceAll("x", "*")
    .replaceAll("çarpı", "*")
    .replaceAll("kere", "*")
    .replaceAll("bölü", "/")
    .replaceAll("artı", "+")
    .replaceAll("eksi", "-")
    .replace(/[^0-9+\-*/()., ]/g, "")
    .replaceAll(",", ".")
    .trim();

  if (!/[0-9]/.test(normalized) || !/[+\-*/]/.test(normalized)) return null;

  try {
    const value = Function(`"use strict"; return (${normalized});`)();
    if (Number.isFinite(value)) {
      return `Sonuç: ${value}`;
    }
  } catch {
    return null;
  }

  return null;
}

function solveLinearEquation(input) {
  const compact = input.toLowerCase().replace(/\s+/g, "");
  const match = compact.match(/^([+-]?\d*)x([+-]\d+)?=([+-]?\d+)$/);
  if (!match) return null;

  const aRaw = match[1];
  const bRaw = match[2] || "+0";
  const cRaw = match[3];

  const a = aRaw === "" || aRaw === "+" ? 1 : aRaw === "-" ? -1 : Number(aRaw);
  const b = Number(bRaw);
  const c = Number(cRaw);

  if (a === 0) return "Bu denklemde x katsayısı 0 olduğu için klasik çözüm yok.";
  const x = (c - b) / a;
  return `Denklem çözümü: x = ${x}`;
}

function solveAppleProblem(input) {
  const q = input.toLowerCase();
  const nums = (q.match(/\d+/g) || []).map(Number);
  if (!q.includes("elma") || nums.length < 2) return null;

  if (q.includes("yedi") || q.includes("verdi") || q.includes("kaldı")) {
    return `Problem sonucu: ${nums[0] - nums[1]} elma kalır.`;
  }

  if (q.includes("aldı") || q.includes("kaç oldu") || q.includes("toplam")) {
    return `Problem sonucu: ${nums[0] + nums[1]} elma olur.`;
  }

  return null;
}

function buildResponse(input) {
  const lowered = input.toLowerCase();

  if (lowered.includes("merhaba") || lowered.includes("selam")) {
    return chooseRandom(merhabaResponses);
  }

  if (lowered.includes("nasılsın")) {
    return chooseRandom(nasilsinResponses);
  }

  const appleResult = solveAppleProblem(input);
  if (appleResult) return appleResult;

  const linearResult = solveLinearEquation(input);
  if (linearResult) return linearResult;

  const exprResult = solveSimpleExpression(input);
  if (exprResult) return exprResult;

  if (lowered.includes("kesir")) return chooseRandom(topicResponses.kesir);
  if (lowered.includes("denklem") || lowered.includes("x=")) return chooseRandom(topicResponses.denklem);
  if (lowered.includes("rasyonel")) return chooseRandom(topicResponses.rasyonel);
  if (lowered.includes("cebir") || lowered.includes("cebirsel")) return chooseRandom(topicResponses.cebir);

  const mathIntent = mathKeywordBank.some((keyword) => lowered.includes(keyword));
  if (mathIntent) {
    return "Matematik modundayım 🐟 Bana işlemi doğrudan yazabilirsin: örn. (67+34)*2, 3/4 + 5/8, 2x+7=19 veya sözel problem.";
  }

  return `Mesajını aldım: \"${input}\"\nAktif model: ${currentModel}\nİpucu: Matematikte çok güçlüyüm; işlem, kesir, denklem veya sözel problem sorabilirsin.`;
}

function processInput(text) {
  openChatIfNeeded();
  addMessage(text, "user");
  const thinkingNode = addThinkingMessage();

  setTimeout(() => {
    const response = buildResponse(text);
    finishThinkingMessage(thinkingNode, response);
    chat.scrollTop = chat.scrollHeight;
  }, 3000);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  playClickSound();
  processInput(text);
  userInput.value = "";
  userInput.focus();
});

clearChat.addEventListener("click", () => {
  resetChat();
});

modelToggle.addEventListener("click", () => {
  modelMenu.classList.toggle("hidden");
});

document.addEventListener("click", (event) => {
  const clickedInsideMenu = modelMenu.contains(event.target);
  const clickedToggle = modelToggle.contains(event.target);
  if (!clickedInsideMenu && !clickedToggle) {
    modelMenu.classList.add("hidden");
  }
});

modelOptions.forEach((option) => {
  option.addEventListener("click", () => {
    modelOptions.forEach((item) => item.classList.remove("active"));
    option.classList.add("active");
    currentModel = option.dataset.model;
    modelMenu.classList.add("hidden");
  });
});
