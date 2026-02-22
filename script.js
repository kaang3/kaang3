const glow = document.getElementById('cursorGlow');
const interactiveEls = document.querySelectorAll('.interactive');

const openVoiceBtn = document.getElementById('openVoice');
const closeVoiceBtn = document.getElementById('closeVoice');
const voicePanel = document.getElementById('voicePanel');

const openLensBtn = document.getElementById('openLens');
const closeLensBtn = document.getElementById('closeLens');
const lensPanel = document.getElementById('lensPanel');

const openPlusBtn = document.getElementById('openPlus');
const closePlusBtn = document.getElementById('closePlus');
const plusStage = document.getElementById('plusStage');
const nextPlusFrameBtn = document.getElementById('nextPlusFrame');
const plusText = document.getElementById('plusText');

const plusScenes = [
  '⚡ Daha hızlı cevap: web arama akışı yaklaşık 10 saniyeden 5 saniye bandına iner.',
  '📝 Daha uzun cevap: Premium modda tüm yanıtlar daha kapsamlı ve detaylı hale gelir.',
  '🧠 Daha geniş bellek: normal sürüme göre daha çok bağlam kaydı saklanır.',
  '🔓 Ban kaldırması: erişim kısıtları daha esnek şekilde yönetilir.',
  '😄 Küfüre izin ver (opsiyonel): açılabilir ayarda mizahi/samimi konuşma tonu aktive edilebilir.',
  '✨ Daha fazlası gelecek...'
];

let plusIndex = 0;

function renderPlusScene() {
  plusText.textContent = plusScenes[plusIndex];
}

openVoiceBtn.addEventListener('click', () => {
  voicePanel.classList.remove('hidden');
});

closeVoiceBtn.addEventListener('click', () => {
  voicePanel.classList.add('hidden');
});

openLensBtn.addEventListener('click', () => {
  lensPanel.classList.remove('hidden');
});

closeLensBtn.addEventListener('click', () => {
  lensPanel.classList.add('hidden');
});

openPlusBtn.addEventListener('click', () => {
  plusStage.classList.remove('hidden');
  plusIndex = 0;
  renderPlusScene();
});

closePlusBtn.addEventListener('click', () => {
  plusStage.classList.add('hidden');
});

nextPlusFrameBtn.addEventListener('click', () => {
  plusIndex = (plusIndex + 1) % plusScenes.length;
  renderPlusScene();
});

window.addEventListener('pointermove', (event) => {
  const { clientX, clientY } = event;

  glow.style.left = `${clientX}px`;
  glow.style.top = `${clientY}px`;

  const xRatio = (clientX / window.innerWidth - 0.5) * 2;
  const yRatio = (clientY / window.innerHeight - 0.5) * 2;

  interactiveEls.forEach((el) => {
    const depth = Number(el.dataset.depth || 10);
    const moveX = -(xRatio * depth);
    const moveY = -(yRatio * depth);
    el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
});

window.addEventListener('mouseleave', () => {
  interactiveEls.forEach((el) => {
    el.style.transform = 'translate3d(0, 0, 0)';
  });
});
