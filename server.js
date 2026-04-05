const path = require("path");
const express = require("express");
const { buildReply, verifyPremiumCode } = require("./backend/brain");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname)));

app.post("/api/chat", (req, res) => {
  const { message } = req.body || {};
  const reply = buildReply(message);
  res.json({ reply });
});

app.post("/api/premium/verify", (req, res) => {
  const { code } = req.body || {};
  const valid = verifyPremiumCode(code);
  if (!valid) {
    return res.status(400).json({ ok: false, message: "Kod geçersiz." });
  }
  return res.json({ ok: true, message: "Premium kod doğrulandı." });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`baluk.ai server listening on http://localhost:${PORT}`);
});
