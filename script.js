const state = { 
history: [], 
index: -1, 
user: JSON.parse(localStorage.getItem("balukUser") || "null"), 
thinkingTimer: null, 
thinkingTicker: null, 
agentModeActive: false, 
agentBusy: false, 



}; 

const THINKING_LINES = [ 
"Baluk.ai düşünüyor...", 
"Web sayfasına bakıyorum...", 
"Arama sonuçlarını inceliyorum...", 
"Kaynaklardan kısa özet çıkarıyorum...", 
"Cevabı netleştiriyorum..." 
]; 

const SITE_HINTS = { 
"youtube.com": { name: "YouTube", purpose: "kullanıcıların video izleyip içerik yüklediği bir video paylaşım platformu", company: "Google / Alphabet", year: "2005", wiki: "YouTube" }, 
"google.com": { name: "Google", purpose: "web araması ve internet servisleri sağlamak", company: "Google / Alphabet", year: "1998", wiki: "Google" }, 
"wikipedia.org": { name: "Wikipedia", purpose: "özgür ansiklopedi içeriği sağlamak", company: "Wikimedia Foundation", year: "2001", wiki: "Wikipedia" }, 
"github.com": { name: "GitHub", purpose: "yazılım projelerini Git tabanlı barındırma ve işbirliği", company: "GitHub (Microsoft)", year: "2008", wiki: "GitHub" }, 
"instagram.com": { name: "Instagram", purpose: "fotoğraf/video paylaşımı ve sosyal etkileşim", company: "Meta", year: "2010", wiki: "Instagram" }, 
"x.com": { name: "X", purpose: "kısa gönderilerle sosyal paylaşım ve haber akışı", company: "X Corp.", year: "2006", wiki: "Twitter" }, 
"twitter.com": { name: "Twitter (X)", purpose: "kısa gönderilerle sosyal paylaşım ve haber akışı", company: "X Corp.", year: "2006", wiki: "Twitter" } 
}; 

const el = { 
contentGrid: document.getElementById("contentGrid"), 
aramaForm: document.getElementById("aramaForm"), 
aramaInput: document.getElementById("aramaInput"), 
sonuclar: document.getElementById("sonuclar"), 
homeView: document.getElementById("homeView"), 
webView: document.getElementById("webView"), 
siteFrame: document.getElementById("siteFrame"), 
adresCubugu: document.getElementById("adresCubugu"), 
geriBtn: document.getElementById("geriBtn"), 
ileriBtn: document.getElementById("ileriBtn"), 
yenileBtn: document.getElementById("yenileBtn"), 
newTabBtn: document.getElementById("newTabBtn"), 
balukPanelBtn: document.getElementById("balukPanelBtn"), 
aiPanel: document.getElementById("aiPanel"), 
closePanelBtn: document.getElementById("closePanelBtn"), 
loginForm: document.getElementById("loginForm"), 
authArea: document.getElementById("authArea"), 
assistantArea: document.getElementById("assistantArea"), 
welcomeText: document.getElementById("welcomeText"), 
profileMail: document.getElementById("profileMail"), 
profileAvatar: document.getElementById("profileAvatar"), 
aiForm: document.getElementById("aiForm"), 
aiSoru: document.getElementById("aiSoru"), 
thinkingBox: document.getElementById("thinkingBox"), 
thinkingText: document.getElementById("thinkingText"), 
spinLogo: document.getElementById("spinLogo"), 
aiCevap: document.getElementById("aiCevap"), 
plusBtn: document.getElementById("plusBtn"), 
agentMenu: document.getElementById("agentMenu"), 
agentModeBtn: document.getElementById("agentModeBtn"), 
introOverlay: document.getElementById("introOverlay"), 
introCard: document.getElementById("introCard"), 
introSubtitle: document.getElementById("introSubtitle"), 
appShell: document.getElementById("appShell"), 
}; 

const agentCursor = document.createElement("div"); 
agentCursor.id = "agentCursor"; 
agentCursor.style.cssText = "position:fixed;width:18px;height:18px;border:2px solid #b78cff;background:radial-gradient(circle,#6b24dd 0%,#141020 75%);border-radius:50%;box-shadow:0 0 18px rgba(141,69,255,.85);z-index:9999;pointer-events:none;opacity:0;transform:translate(-50%,-50%);transition:left .35s ease, top .35s ease, opacity .2s ease;"; 
document.body.appendChild(agentCursor); 


function playIntroSound() { 
try { 
const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
const oscillator = audioCtx.createOscillator(); 
const gain = audioCtx.createGain(); 

oscillator.type = "triangle"; 
oscillator.frequency.setValueAtTime(180, audioCtx.currentTime); 
oscillator.frequency.exponentialRampToValueAtTime(520, audioCtx.currentTime + 0.32); 

gain.gain.setValueAtTime(0.0001, audioCtx.currentTime); 
gain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.12); 
gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.82); 

oscillator.connect(gain); 
gain.connect(audioCtx.destination); 
oscillator.start(); 
oscillator.stop(audioCtx.currentTime + 0.85); 

oscillator.onended = () => audioCtx.close(); 
} catch { 
// Sessiz geçiş fallback 
} 
} 

function runIntro() { 
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; 
const introDuration = reducedMotion ? 2350 : 4800; 

if (!el.introOverlay || !el.appShell) return; 

playIntroSound(); 

setTimeout(() => { 
el.introOverlay.classList.add("hidden"); 
el.appShell.classList.remove("app-hidden"); 
el.appShell.style.pointerEvents = "auto"; 
}, introDuration); 
} 

function escapeHtml(text) { 
return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); 
} 

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); } 
function ensureUrl(value) { return /^https?:\/\//i.test(value) ? value : `https://${value}`; } 

function setPanel(open) { 
el.aiPanel.classList.toggle("hidden", !open); 
el.contentGrid.classList.toggle("with-panel", open); 
} 

function openUrl(url, addToHistory = true) { 
if (!url) return; 
const safe = ensureUrl(url); 
el.siteFrame.src = safe; 
el.adresCubugu.value = safe; 
el.homeView.classList.add("hidden"); 
el.webView.classList.remove("hidden"); 

if (addToHistory) { 
state.history = state.history.slice(0, state.index + 1); 
state.history.push(safe); 
state.index = state.history.length - 1; 
} 
} 

function parseSite(urlCandidate) { 
let url; 
try { url = new URL(ensureUrl(urlCandidate)); } catch { return null; } 
const host = url.hostname.replace(/^www\./, "").toLowerCase(); 
const matchKey = Object.keys(SITE_HINTS).find((key) => host.endsWith(key)); 
if (matchKey) return { ...SITE_HINTS[matchKey], host, url: url.href }; 

const base = host.split(".")[0] || "web sitesi"; 
return { 
name: base.charAt(0).toUpperCase() + base.slice(1), 
purpose: "webde bilgi/hizmet sunmak", 
company: "kesin şirket bilgisi için site hakkında bölümü gerekir", 
year: "kuruluş yılı net değil", 
wiki: base 
}; 

} 

async function fetchWikipediaSnippet(term) { 
try { 
const api = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`; 
const res = await fetch(api); 
if (!res.ok) return ""; 
const data = await res.json(); 
const text = (data.extract || "").trim(); 
if (!text) return ""; 
return text.slice(0, 200); 
} catch { 
return ""; 
} 
} 

function renderAuth() { 
if (state.user) { 
el.authArea.classList.add("hidden"); 
el.assistantArea.classList.remove("hidden"); 
el.welcomeText.textContent = `${state.user.ad} ${state.user.soyad}`; 
el.profileMail.textContent = state.user.email; 
el.profileAvatar.src = state.user.profil || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70'%3E%3Crect width='100%25' height='100%25' fill='%23212a57'/%3E%3Ctext x='50%25' y='53%25' text-anchor='middle' fill='%23fff' font-size='22' font-family='Arial' dy='.3em'%3EB%3C/text%3E%3C/svg%3E"; 
} else { 
el.authArea.classList.remove("hidden"); 
el.assistantArea.classList.add("hidden"); 
} 
} 

function createFallbackResults(query) { 
const q = encodeURIComponent(query); 
return [ 
{ title: `DuckDuckGo: ${query}`, href: `https://duckduckgo.com/?q=${q}`, snippet: "DuckDuckGo sonuç sayfasını açar." }, 
{ title: `Wikipedia araması: ${query}`, href: `https://tr.wikipedia.org/wiki/Özel:Arama?search=${q}`, snippet: "Wikipedia üzerinden hızlı kaynak taraması." } 
]; 
} 

async function getSearchResults(query) { 
const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`); 
if (!response.ok) throw new Error("duckduckgo error"); 
const data = await response.json(); 
const parsed = []; 

if (data.AbstractURL) parsed.push({ title: data.Heading || query, href: data.AbstractURL, snippet: data.AbstractText || "Özet bilgi" }); 

(data.RelatedTopics || []).forEach((item) => { 
if (item.FirstURL && item.Text) parsed.push({ title: item.Text.split(" - ")[0], href: item.FirstURL, snippet: item.Text }); 
(item.Topics || []).forEach((sub) => { 
if (sub.FirstURL && sub.Text) parsed.push({ title: sub.Text.split(" - ")[0], href: sub.FirstURL, snippet: sub.Text }); 
}); 
}); 

return parsed.slice(0, 8); 
} 

function askAboutSite(url, customQuestion = "") { 
setPanel(true); 
if (!state.user) { 
el.aiCevap.textContent = "Bu siteyi analiz etmek için önce giriş yapman gerekiyor."; 
return; 
} 
const q = customQuestion || `Bu web sitesi ne amaçla kurulmuştur? (${url})`; 
el.aiSoru.value = q; 
el.aiForm.requestSubmit(); 
} 

function renderResults(results, query) { 
if (!results.length) results = createFallbackResults(query); 
el.sonuclar.innerHTML = ""; 

results.forEach((item) => { 
const card = document.createElement("article"); 
card.className = "result-item"; 
card.innerHTML = ` 
<h3><a href="#">${escapeHtml(item.title)}</a></h3> 
<p>${escapeHtml(item.snippet || "Açıklama yok")}</p> 
<div class="result-actions"> 
<button type="button" class="open-link">Bağlantıyı Aç</button> 
<button type="button" class="ask-link">✦ Baluk.ai'ye Sor</button> 
</div> 
`; 
card.querySelector("a").addEventListener("click", (e) => { e.preventDefault(); openUrl(item.href); }); 
card.querySelector(".open-link").addEventListener("click", () => openUrl(item.href)); 
card.querySelector(".ask-link").addEventListener("click", () => askAboutSite(item.href, `${item.title} sitesi ne işe yarar, kim tarafından kuruldu ve ne zaman kuruldu?`)); 
el.sonuclar.appendChild(card); 
}); 
} 

function startThinking() { 
el.aiCevap.textContent = ""; 
el.thinkingBox.classList.remove("hidden"); 
el.spinLogo.classList.add("active"); 
document.body.classList.add("web-glow"); 

let idx = 0; 
el.thinkingText.textContent = THINKING_LINES[0]; 
state.thinkingTicker = setInterval(() => { 
idx = (idx + 1) % THINKING_LINES.length; 
el.thinkingText.textContent = THINKING_LINES[idx]; 
}, 2400); 
} 

function stopThinking() { 
clearInterval(state.thinkingTicker); 
el.thinkingBox.classList.add("hidden"); 
el.spinLogo.classList.remove("active"); 
document.body.classList.remove("web-glow"); 
} 

async function buildAiAnswer(q) { 
const currentUrl = el.adresCubugu.value || q.match(/https?:\/\/\S+/)?.[0] || ""; 
const site = parseSite(currentUrl || "example.com"); 
const siteName = site?.name || "Bu site"; 

if (/kaç yılında|ne zaman/i.test(q)) return `${siteName} için bulduğum bilgi: kuruluş yılı ${site.year}.`; 
if (/hangi şirket|kim tarafından/i.test(q)) return `${siteName} için şirket/kurucu bilgisi: ${site.company}.`; 

if (/youtube|wikipedia|github|instagram|google|twitter|x\.com|web sitesi|site hakkında|hakkında bilgi|amaç/i.test(q)) { 
const wiki = await fetchWikipediaSnippet(site.wiki || siteName); 
if (wiki) { 
return `${siteName}: ${site.purpose}.\n\nWikipedia özeti (ilk 200 karakter): ${wiki}`; 
} 
return `${siteName}: ${site.purpose}. Şirket: ${site.company}. Kuruluş: ${site.year}.`; 
} 

return `${siteName} özeti: ${site.year} yılında kurulduğu biliniyor, ${site.company} tarafından geliştirildi/işletiliyor ve ana amacı ${site.purpose}.`; 
} 

function parseAgentCommand(text) { 
const cleaned = text.toLowerCase().trim(); 
const searchMatch = cleaned.match(/(?:arat|ara)\s*:?\s*(.+?)(?:\s+çıkan|$)/i) || cleaned.match(/(.+?)\s+arat/i); 
const query = searchMatch ? searchMatch[1].trim() : text.trim(); 

const indexMatch = cleaned.match(/(\d+)\.?\s*(link|sonuç)/i); 
const index = indexMatch ? Math.max(1, Number(indexMatch[1])) : 1; 

return { query, index }; 
} 

function moveCursorTo(element) { 
const rect = element.getBoundingClientRect(); 
agentCursor.style.opacity = "1"; 
agentCursor.style.left = `${rect.left + rect.width / 2}px`; 
agentCursor.style.top = `${rect.top + rect.height / 2}px`; 
} 

function hideCursor() { 
agentCursor.style.opacity = "0"; 
} 

async function runAgentSearchFlow(commandText) { 
if (state.agentBusy) return "Agent Mode meşgul, işlem bitmesini bekle."; 
state.agentBusy = true; 



try { 
const { query, index } = parseAgentCommand(commandText); 
if (!query) return "Agent Mode: Aratılacak ifadeyi anlayamadım."; 

el.homeView.classList.remove("hidden"); 
el.webView.classList.add("hidden"); 

moveCursorTo(el.aramaInput); 
await sleep(300); 
el.aramaInput.focus(); 
el.aramaInput.value = ""; 

for (const ch of query) { 
el.aramaInput.value += ch; 
await sleep(35); 











} 

await sleep(240); 
el.aramaForm.requestSubmit(); 
await sleep(1300); 

const cards = [...document.querySelectorAll(".result-item")]; 
if (!cards.length) return `"${query}" için sonuç bulunamadı.`; 

const targetCard = cards[Math.min(index - 1, cards.length - 1)]; 
const openBtn = targetCard.querySelector(".open-link"); 
if (!openBtn) return "Hedef bağlantı bulunamadı."; 

moveCursorTo(openBtn); 
await sleep(420); 
openBtn.click(); 
await sleep(420); 

return `Agent Mode tamamlandı: "${query}" aratıldı ve ${Math.min(index, cards.length)}. link açıldı.`; 
} finally { 
hideCursor(); 
state.agentBusy = false; 
state.agentModeActive = false; 
} 
} 

el.aramaForm.addEventListener("submit", async (event) => { 
event.preventDefault(); 
const q = el.aramaInput.value.trim(); 
if (!q) return; 
el.sonuclar.innerHTML = "Aranıyor..."; 

try { 
const results = await getSearchResults(q); 
renderResults(results, q); 
} catch { 
renderResults(createFallbackResults(q), q); 
} 
}); 

el.adresCubugu.addEventListener("keydown", (e) => { if (e.key === "Enter") openUrl(el.adresCubugu.value); }); 
el.geriBtn.addEventListener("click", () => { if (state.index > 0) openUrl(state.history[--state.index], false); }); 
el.ileriBtn.addEventListener("click", () => { if (state.index < state.history.length - 1) openUrl(state.history[++state.index], false); }); 
el.yenileBtn.addEventListener("click", () => { if (el.siteFrame.src) el.siteFrame.src = el.siteFrame.src; }); 
el.newTabBtn.addEventListener("click", () => { el.homeView.classList.remove("hidden"); el.webView.classList.add("hidden"); el.adresCubugu.value = ""; }); 
el.balukPanelBtn.addEventListener("click", () => setPanel(el.aiPanel.classList.contains("hidden"))); 
el.closePanelBtn.addEventListener("click", () => setPanel(false)); 

el.loginForm.addEventListener("submit", (e) => { 
e.preventDefault(); 
const user = { 
email: document.getElementById("mail").value.trim(), 
ad: document.getElementById("ad").value.trim(), 
soyad: document.getElementById("soyad").value.trim() 
}; 
const file = document.getElementById("profil").files[0]; 
if (!user.email || !user.ad || !user.soyad) return; 

if (file) { 
const reader = new FileReader(); 
reader.onload = () => { 
user.profil = reader.result; 
state.user = user; 
localStorage.setItem("balukUser", JSON.stringify(user)); 
renderAuth(); 
}; 
reader.readAsDataURL(file); 
} else { 
state.user = user; 
localStorage.setItem("balukUser", JSON.stringify(user)); 
renderAuth(); 
} 
}); 

el.plusBtn.addEventListener("click", () => el.agentMenu.classList.toggle("hidden")); 
el.agentModeBtn.addEventListener("click", () => { 
state.agentModeActive = true; 
el.agentMenu.classList.add("hidden"); 
el.aiCevap.textContent = "Agent Mode aktif. Komut ver: örn 'youtube arat çıkan 3. linke tıkla'. Link belirtilmezse 1. link açılır."; 
setPanel(true); 
}); 

el.aiForm.addEventListener("submit", async (e) => { 
e.preventDefault(); 
const q = el.aiSoru.value.trim(); 
if (!q) return; 

if (state.agentModeActive) { 
el.aiCevap.textContent = await runAgentSearchFlow(q); 
el.aiSoru.value = ""; 
return; 
} 

startThinking(); 
clearTimeout(state.thinkingTimer); 
state.thinkingTimer = setTimeout(async () => { 
stopThinking(); 
el.aiCevap.textContent = await buildAiAnswer(q); 
el.aiSoru.value = ""; 
}, 20000); 
}); 

el.aiSoru.addEventListener("keydown", (e) => { 
if (e.key === "Enter" && !e.shiftKey) { 
e.preventDefault(); 
el.aiForm.requestSubmit(); 
} 
}); 

renderAuth(); 
setPanel(false); 
runIntro();
const state = { 
history: [], 
index: -1, 
user: JSON.parse(localStorage.getItem("balukUser") || "null"), 
thinkingTimer: null, 
thinkingTicker: null, 
agentModeActive: false, 
agentBusy: false, 



}; 

const THINKING_LINES = [ 
"Baluk.ai düşünüyor...", 
"Web sayfasına bakıyorum...", 
"Arama sonuçlarını inceliyorum...", 
"Kaynaklardan kısa özet çıkarıyorum...", 
"Cevabı netleştiriyorum..." 
]; 

const SITE_HINTS = { 
"youtube.com": { name: "YouTube", purpose: "kullanıcıların video izleyip içerik yüklediği bir video paylaşım platformu", company: "Google / Alphabet", year: "2005", wiki: "YouTube" }, 
"google.com": { name: "Google", purpose: "web araması ve internet servisleri sağlamak", company: "Google / Alphabet", year: "1998", wiki: "Google" }, 
"wikipedia.org": { name: "Wikipedia", purpose: "özgür ansiklopedi içeriği sağlamak", company: "Wikimedia Foundation", year: "2001", wiki: "Wikipedia" }, 
"github.com": { name: "GitHub", purpose: "yazılım projelerini Git tabanlı barındırma ve işbirliği", company: "GitHub (Microsoft)", year: "2008", wiki: "GitHub" }, 
"instagram.com": { name: "Instagram", purpose: "fotoğraf/video paylaşımı ve sosyal etkileşim", company: "Meta", year: "2010", wiki: "Instagram" }, 
"x.com": { name: "X", purpose: "kısa gönderilerle sosyal paylaşım ve haber akışı", company: "X Corp.", year: "2006", wiki: "Twitter" }, 
"twitter.com": { name: "Twitter (X)", purpose: "kısa gönderilerle sosyal paylaşım ve haber akışı", company: "X Corp.", year: "2006", wiki: "Twitter" } 
}; 

const el = { 
contentGrid: document.getElementById("contentGrid"), 
aramaForm: document.getElementById("aramaForm"), 
aramaInput: document.getElementById("aramaInput"), 
sonuclar: document.getElementById("sonuclar"), 
homeView: document.getElementById("homeView"), 
webView: document.getElementById("webView"), 
siteFrame: document.getElementById("siteFrame"), 
adresCubugu: document.getElementById("adresCubugu"), 
geriBtn: document.getElementById("geriBtn"), 
ileriBtn: document.getElementById("ileriBtn"), 
yenileBtn: document.getElementById("yenileBtn"), 
newTabBtn: document.getElementById("newTabBtn"), 
balukPanelBtn: document.getElementById("balukPanelBtn"), 
aiPanel: document.getElementById("aiPanel"), 
closePanelBtn: document.getElementById("closePanelBtn"), 
loginForm: document.getElementById("loginForm"), 
authArea: document.getElementById("authArea"), 
assistantArea: document.getElementById("assistantArea"), 
welcomeText: document.getElementById("welcomeText"), 
profileMail: document.getElementById("profileMail"), 
profileAvatar: document.getElementById("profileAvatar"), 
aiForm: document.getElementById("aiForm"), 
aiSoru: document.getElementById("aiSoru"), 
thinkingBox: document.getElementById("thinkingBox"), 
thinkingText: document.getElementById("thinkingText"), 
spinLogo: document.getElementById("spinLogo"), 
aiCevap: document.getElementById("aiCevap"), 
plusBtn: document.getElementById("plusBtn"), 
agentMenu: document.getElementById("agentMenu"), 
agentModeBtn: document.getElementById("agentModeBtn"), 
introOverlay: document.getElementById("introOverlay"), 
introCard: document.getElementById("introCard"), 
introSubtitle: document.getElementById("introSubtitle"), 
appShell: document.getElementById("appShell"), 
}; 

const agentCursor = document.createElement("div"); 
agentCursor.id = "agentCursor"; 
agentCursor.style.cssText = "position:fixed;width:18px;height:18px;border:2px solid #b78cff;background:radial-gradient(circle,#6b24dd 0%,#141020 75%);border-radius:50%;box-shadow:0 0 18px rgba(141,69,255,.85);z-index:9999;pointer-events:none;opacity:0;transform:translate(-50%,-50%);transition:left .35s ease, top .35s ease, opacity .2s ease;"; 
document.body.appendChild(agentCursor); 


function playIntroSound() { 
try { 
const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
const oscillator = audioCtx.createOscillator(); 
const gain = audioCtx.createGain(); 

oscillator.type = "triangle"; 
oscillator.frequency.setValueAtTime(180, audioCtx.currentTime); 
oscillator.frequency.exponentialRampToValueAtTime(520, audioCtx.currentTime + 0.32); 

gain.gain.setValueAtTime(0.0001, audioCtx.currentTime); 
gain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.12); 
gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.82); 

oscillator.connect(gain); 
gain.connect(audioCtx.destination); 
oscillator.start(); 
oscillator.stop(audioCtx.currentTime + 0.85); 

oscillator.onended = () => audioCtx.close(); 
} catch { 
// Sessiz geçiş fallback 
} 
} 

function runIntro() { 
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; 
const introDuration = reducedMotion ? 2350 : 4800; 

if (!el.introOverlay || !el.appShell) return; 

playIntroSound(); 

setTimeout(() => { 
el.introOverlay.classList.add("hidden"); 
el.appShell.classList.remove("app-hidden"); 
el.appShell.style.pointerEvents = "auto"; 
}, introDuration); 
} 

function escapeHtml(text) { 
return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); 
} 

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); } 
function ensureUrl(value) { return /^https?:\/\//i.test(value) ? value : `https://${value}`; } 

function setPanel(open) { 
el.aiPanel.classList.toggle("hidden", !open); 
el.contentGrid.classList.toggle("with-panel", open); 
} 

function openUrl(url, addToHistory = true) { 
if (!url) return; 
const safe = ensureUrl(url); 
el.siteFrame.src = safe; 
el.adresCubugu.value = safe; 
el.homeView.classList.add("hidden"); 
el.webView.classList.remove("hidden"); 

if (addToHistory) { 
state.history = state.history.slice(0, state.index + 1); 
state.history.push(safe); 
state.index = state.history.length - 1; 
} 
} 

function parseSite(urlCandidate) { 
let url; 
try { url = new URL(ensureUrl(urlCandidate)); } catch { return null; } 
const host = url.hostname.replace(/^www\./, "").toLowerCase(); 
const matchKey = Object.keys(SITE_HINTS).find((key) => host.endsWith(key)); 
if (matchKey) return { ...SITE_HINTS[matchKey], host, url: url.href }; 

const base = host.split(".")[0] || "web sitesi"; 
return { 
name: base.charAt(0).toUpperCase() + base.slice(1), 
purpose: "webde bilgi/hizmet sunmak", 
company: "kesin şirket bilgisi için site hakkında bölümü gerekir", 
year: "kuruluş yılı net değil", 
wiki: base 
}; 

} 

async function fetchWikipediaSnippet(term) { 
try { 
const api = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`; 
const res = await fetch(api); 
if (!res.ok) return ""; 
const data = await res.json(); 
const text = (data.extract || "").trim(); 
if (!text) return ""; 
return text.slice(0, 200); 
} catch { 
return ""; 
} 
} 

function renderAuth() { 
if (state.user) { 
el.authArea.classList.add("hidden"); 
el.assistantArea.classList.remove("hidden"); 
el.welcomeText.textContent = `${state.user.ad} ${state.user.soyad}`; 
el.profileMail.textContent = state.user.email; 
el.profileAvatar.src = state.user.profil || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70'%3E%3Crect width='100%25' height='100%25' fill='%23212a57'/%3E%3Ctext x='50%25' y='53%25' text-anchor='middle' fill='%23fff' font-size='22' font-family='Arial' dy='.3em'%3EB%3C/text%3E%3C/svg%3E"; 
} else { 
el.authArea.classList.remove("hidden"); 
el.assistantArea.classList.add("hidden"); 
} 
} 

function createFallbackResults(query) { 
const q = encodeURIComponent(query); 
return [ 
{ title: `DuckDuckGo: ${query}`, href: `https://duckduckgo.com/?q=${q}`, snippet: "DuckDuckGo sonuç sayfasını açar." }, 
{ title: `Wikipedia araması: ${query}`, href: `https://tr.wikipedia.org/wiki/Özel:Arama?search=${q}`, snippet: "Wikipedia üzerinden hızlı kaynak taraması." } 
]; 
} 

async function getSearchResults(query) { 
const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`); 
if (!response.ok) throw new Error("duckduckgo error"); 
const data = await response.json(); 
const parsed = []; 

if (data.AbstractURL) parsed.push({ title: data.Heading || query, href: data.AbstractURL, snippet: data.AbstractText || "Özet bilgi" }); 

(data.RelatedTopics || []).forEach((item) => { 
if (item.FirstURL && item.Text) parsed.push({ title: item.Text.split(" - ")[0], href: item.FirstURL, snippet: item.Text }); 
(item.Topics || []).forEach((sub) => { 
if (sub.FirstURL && sub.Text) parsed.push({ title: sub.Text.split(" - ")[0], href: sub.FirstURL, snippet: sub.Text }); 
}); 
}); 

return parsed.slice(0, 8); 
} 

function askAboutSite(url, customQuestion = "") { 
setPanel(true); 
if (!state.user) { 
el.aiCevap.textContent = "Bu siteyi analiz etmek için önce giriş yapman gerekiyor."; 
return; 
} 
const q = customQuestion || `Bu web sitesi ne amaçla kurulmuştur? (${url})`; 
el.aiSoru.value = q; 
el.aiForm.requestSubmit(); 
} 

function renderResults(results, query) { 
if (!results.length) results = createFallbackResults(query); 
el.sonuclar.innerHTML = ""; 

results.forEach((item) => { 
const card = document.createElement("article"); 
card.className = "result-item"; 
card.innerHTML = ` 
<h3><a href="#">${escapeHtml(item.title)}</a></h3> 
<p>${escapeHtml(item.snippet || "Açıklama yok")}</p> 
<div class="result-actions"> 
<button type="button" class="open-link">Bağlantıyı Aç</button> 
<button type="button" class="ask-link">✦ Baluk.ai'ye Sor</button> 
</div> 
`; 
card.querySelector("a").addEventListener("click", (e) => { e.preventDefault(); openUrl(item.href); }); 
card.querySelector(".open-link").addEventListener("click", () => openUrl(item.href)); 
card.querySelector(".ask-link").addEventListener("click", () => askAboutSite(item.href, `${item.title} sitesi ne işe yarar, kim tarafından kuruldu ve ne zaman kuruldu?`)); 
el.sonuclar.appendChild(card); 
}); 
} 

function startThinking() { 
el.aiCevap.textContent = ""; 
el.thinkingBox.classList.remove("hidden"); 
el.spinLogo.classList.add("active"); 
document.body.classList.add("web-glow"); 

let idx = 0; 
el.thinkingText.textContent = THINKING_LINES[0]; 
state.thinkingTicker = setInterval(() => { 
idx = (idx + 1) % THINKING_LINES.length; 
el.thinkingText.textContent = THINKING_LINES[idx]; 
}, 2400); 
} 

function stopThinking() { 
clearInterval(state.thinkingTicker); 
el.thinkingBox.classList.add("hidden"); 
el.spinLogo.classList.remove("active"); 
document.body.classList.remove("web-glow"); 
} 

async function buildAiAnswer(q) { 
const currentUrl = el.adresCubugu.value || q.match(/https?:\/\/\S+/)?.[0] || ""; 
const site = parseSite(currentUrl || "example.com"); 
const siteName = site?.name || "Bu site"; 

if (/kaç yılında|ne zaman/i.test(q)) return `${siteName} için bulduğum bilgi: kuruluş yılı ${site.year}.`; 
if (/hangi şirket|kim tarafından/i.test(q)) return `${siteName} için şirket/kurucu bilgisi: ${site.company}.`; 

if (/youtube|wikipedia|github|instagram|google|twitter|x\.com|web sitesi|site hakkında|hakkında bilgi|amaç/i.test(q)) { 
const wiki = await fetchWikipediaSnippet(site.wiki || siteName); 
if (wiki) { 
return `${siteName}: ${site.purpose}.\n\nWikipedia özeti (ilk 200 karakter): ${wiki}`; 
} 
return `${siteName}: ${site.purpose}. Şirket: ${site.company}. Kuruluş: ${site.year}.`; 
} 

return `${siteName} özeti: ${site.year} yılında kurulduğu biliniyor, ${site.company} tarafından geliştirildi/işletiliyor ve ana amacı ${site.purpose}.`; 
} 

function parseAgentCommand(text) { 
const cleaned = text.toLowerCase().trim(); 
const searchMatch = cleaned.match(/(?:arat|ara)\s*:?\s*(.+?)(?:\s+çıkan|$)/i) || cleaned.match(/(.+?)\s+arat/i); 
const query = searchMatch ? searchMatch[1].trim() : text.trim(); 

const indexMatch = cleaned.match(/(\d+)\.?\s*(link|sonuç)/i); 
const index = indexMatch ? Math.max(1, Number(indexMatch[1])) : 1; 

return { query, index }; 
} 

function moveCursorTo(element) { 
const rect = element.getBoundingClientRect(); 
agentCursor.style.opacity = "1"; 
agentCursor.style.left = `${rect.left + rect.width / 2}px`; 
agentCursor.style.top = `${rect.top + rect.height / 2}px`; 
} 

function hideCursor() { 
agentCursor.style.opacity = "0"; 
} 

async function runAgentSearchFlow(commandText) { 
if (state.agentBusy) return "Agent Mode meşgul, işlem bitmesini bekle."; 
state.agentBusy = true; 



try { 
const { query, index } = parseAgentCommand(commandText); 
if (!query) return "Agent Mode: Aratılacak ifadeyi anlayamadım."; 

el.homeView.classList.remove("hidden"); 
el.webView.classList.add("hidden"); 

moveCursorTo(el.aramaInput); 
await sleep(300); 
el.aramaInput.focus(); 
el.aramaInput.value = ""; 

for (const ch of query) { 
el.aramaInput.value += ch; 
await sleep(35); 











} 

await sleep(240); 
el.aramaForm.requestSubmit(); 
await sleep(1300); 

const cards = [...document.querySelectorAll(".result-item")]; 
if (!cards.length) return `"${query}" için sonuç bulunamadı.`; 

const targetCard = cards[Math.min(index - 1, cards.length - 1)]; 
const openBtn = targetCard.querySelector(".open-link"); 
if (!openBtn) return "Hedef bağlantı bulunamadı."; 

moveCursorTo(openBtn); 
await sleep(420); 
openBtn.click(); 
await sleep(420); 

return `Agent Mode tamamlandı: "${query}" aratıldı ve ${Math.min(index, cards.length)}. link açıldı.`; 
} finally { 
hideCursor(); 
state.agentBusy = false; 
state.agentModeActive = false; 
} 
} 

el.aramaForm.addEventListener("submit", async (event) => { 
event.preventDefault(); 
const q = el.aramaInput.value.trim(); 
if (!q) return; 
el.sonuclar.innerHTML = "Aranıyor..."; 

try { 
const results = await getSearchResults(q); 
renderResults(results, q); 
} catch { 
renderResults(createFallbackResults(q), q); 
} 
}); 

el.adresCubugu.addEventListener("keydown", (e) => { if (e.key === "Enter") openUrl(el.adresCubugu.value); }); 
el.geriBtn.addEventListener("click", () => { if (state.index > 0) openUrl(state.history[--state.index], false); }); 
el.ileriBtn.addEventListener("click", () => { if (state.index < state.history.length - 1) openUrl(state.history[++state.index], false); }); 
el.yenileBtn.addEventListener("click", () => { if (el.siteFrame.src) el.siteFrame.src = el.siteFrame.src; }); 
el.newTabBtn.addEventListener("click", () => { el.homeView.classList.remove("hidden"); el.webView.classList.add("hidden"); el.adresCubugu.value = ""; }); 
el.balukPanelBtn.addEventListener("click", () => setPanel(el.aiPanel.classList.contains("hidden"))); 
el.closePanelBtn.addEventListener("click", () => setPanel(false)); 

el.loginForm.addEventListener("submit", (e) => { 
e.preventDefault(); 
const user = { 
email: document.getElementById("mail").value.trim(), 
ad: document.getElementById("ad").value.trim(), 
soyad: document.getElementById("soyad").value.trim() 
}; 
const file = document.getElementById("profil").files[0]; 
if (!user.email || !user.ad || !user.soyad) return; 

if (file) { 
const reader = new FileReader(); 
reader.onload = () => { 
user.profil = reader.result; 
state.user = user; 
localStorage.setItem("balukUser", JSON.stringify(user)); 
renderAuth(); 
}; 
reader.readAsDataURL(file); 
} else { 
state.user = user; 
localStorage.setItem("balukUser", JSON.stringify(user)); 
renderAuth(); 
} 
}); 

el.plusBtn.addEventListener("click", () => el.agentMenu.classList.toggle("hidden")); 
el.agentModeBtn.addEventListener("click", () => { 
state.agentModeActive = true; 
el.agentMenu.classList.add("hidden"); 
el.aiCevap.textContent = "Agent Mode aktif. Komut ver: örn 'youtube arat çıkan 3. linke tıkla'. Link belirtilmezse 1. link açılır."; 
setPanel(true); 
}); 

el.aiForm.addEventListener("submit", async (e) => { 
e.preventDefault(); 
const q = el.aiSoru.value.trim(); 
if (!q) return; 

if (state.agentModeActive) { 
el.aiCevap.textContent = await runAgentSearchFlow(q); 
el.aiSoru.value = ""; 
return; 
} 

startThinking(); 
clearTimeout(state.thinkingTimer); 
state.thinkingTimer = setTimeout(async () => { 
stopThinking(); 
el.aiCevap.textContent = await buildAiAnswer(q); 
el.aiSoru.value = ""; 
}, 20000); 
}); 

el.aiSoru.addEventListener("keydown", (e) => { 
if (e.key === "Enter" && !e.shiftKey) { 
e.preventDefault(); 
el.aiForm.requestSubmit(); 
} 
}); 

renderAuth(); 
setPanel(false); 
runIntro();
