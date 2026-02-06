const chat = document.getElementById("chat");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const quickButtons = document.querySelectorAll(".quick-actions button");

const systemPrompt = "Ben baluk.ai: sıcak, kısa, yaratıcı ve yardımcı bir Türkçe AI asistanıyım.";

const starterMessage =
  "Merhaba, ben baluk.ai 🐟\n" +
  "İstersen slogan, ürün fikri, metin veya kod iskeleti hazırlayabilirim.";

function addMessage(text, role) {
  const node = document.createElement("div");
  node.className = `msg ${role}`;
  node.textContent = text;
  chat.appendChild(node);
  chat.scrollTop = chat.scrollHeight;
}

function buildResponse(input) {
  const lowered = input.toLowerCase();

  if (lowered.includes("slogan")) {
    return "Öneri: ‘baluk.ai — aklın derin sularında hızlı cevaplar.’";
  }

  if (lowered.includes("özellik") || lowered.includes("feature")) {
    return [
      "1) Tek tıkla içerik üretimi",
      "2) Türkçe odaklı ton seçimi",
      "3) Hızlı özetleme ve yeniden yazım",
      "4) Proje planı çıkarma modu",
      "5) Marka diline göre kişiselleştirme"
    ].join("\n");
  }

  if (lowered.includes("pitch")) {
    return "baluk.ai, ekiplerin fikirden çıktıya daha hızlı geçmesini sağlayan, Türkçe odaklı bir üretken yapay zekâ asistanıdır. İçerik üretimi, özetleme ve ürün fikirlerini tek bir sade arayüzde birleştirir.";
  }

  if (lowered.includes("kod")) {
    return "Tabii! Hedefini yaz: teknoloji, dil ve kapsamı belirt; sana hızlı bir başlangıç iskeleti hazırlayayım.";
  }

  return `İsteğini aldım.\n${systemPrompt}\n\nBunu bir üst seviyeye taşıyalım: hedef kitle, amaç ve formatı paylaşırsan sana net bir çıktı hazırlayacağım.`;
}

function processInput(text) {
  addMessage(text, "user");

  setTimeout(() => {
    addMessage(buildResponse(text), "bot");
  }, 280);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  processInput(text);
  userInput.value = "";
  userInput.focus();
});

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const prompt = button.dataset.prompt;
    processInput(prompt);
  });
});

addMessage(starterMessage, "bot");
