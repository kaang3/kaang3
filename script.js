const chatEl = document.getElementById("chat");
const formEl = document.getElementById("chatForm");
const inputEl = document.getElementById("messageInput");

appendMessage("bot", "Merhaba 👋 Ben baluk.ai. Mesajını backend'e gönderiyorum.");

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = inputEl.value.trim();
  if (!message) return;

  appendMessage("user", message);
  inputEl.value = "";
  inputEl.focus();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    appendMessage("bot", data.reply ?? "Yanıt alınamadı.");
  } catch (error) {
    appendMessage("bot", "Sunucuya ulaşılamadı. Lütfen tekrar dene.");
    console.error(error);
  }
});

function appendMessage(role, text) {
  const item = document.createElement("div");
  item.className = `message message--${role}`;
  item.textContent = text;
  chatEl.appendChild(item);
  chatEl.scrollTop = chatEl.scrollHeight;
}
