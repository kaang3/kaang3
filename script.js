const chat = document.getElementById("chat");
const splash = document.getElementById("splash");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const clearChat = document.getElementById("clearChat");
const modelToggle = document.getElementById("modelToggle");
const modelMenu = document.getElementById("modelMenu");

let hasStartedChat = false;
let currentModel = "baluk-1.0";

function addMessage(text, role) {
  const node = document.createElement("div");
  node.className = `msg ${role}`;
  node.textContent = text;
  chat.appendChild(node);
  chat.scrollTop = chat.scrollHeight;
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

function buildResponse(input) {
  const lowered = input.toLowerCase();

  if (lowered.includes("merhaba") || lowered.includes("selam")) {
    return `Merhaba! Ben ${currentModel} modelindeki baluk.ai. Nasıl yardımcı olayım?`;
  }

  if (lowered.includes("nasılsın")) {
    return "İyiyim, teşekkürler 🐟 Senin için ne üretelim?";
  }

  return `Mesajını aldım: \"${input}\"\nŞu an aktif model: ${currentModel}`;
}

function processInput(text) {
  openChatIfNeeded();
  addMessage(text, "user");

  setTimeout(() => {
    addMessage(buildResponse(text), "bot");
  }, 240);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

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
