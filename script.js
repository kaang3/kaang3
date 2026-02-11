const glow = document.getElementById('cursorGlow');
const interactiveEls = document.querySelectorAll('.interactive');

const openAnimationBtn = document.getElementById('openAnimation');
const closeAnimationBtn = document.getElementById('closeAnimation');
const animationStage = document.getElementById('animationStage');
const nextFrameBtn = document.getElementById('nextFrame');
const stageTitle = document.getElementById('stageTitle');
const stageSubtitle = document.getElementById('stageSubtitle');

const openPlusBtn = document.getElementById('openPlus');
const closePlusBtn = document.getElementById('closePlus');
const plusStage = document.getElementById('plusStage');
const nextPlusFrameBtn = document.getElementById('nextPlusFrame');
const plusText = document.getElementById('plusText');

const scenes = [
  {
    title: 'baluk.ai',
    text: 'Mor sahnede damla düşerken Baluk.ai parlayarak başlar. Bu etkileşim, ürünün canlı ve modern deneyim dilini temsil eder.'
  },
  {
    title: 'Web Entegrasyonu Aktif',
    text: 'Bu adımda sistem internet bağlantı katmanını açar; sorulara daha güncel, daha zengin ve bağlama uygun cevaplar üretilir.'
  },
  {
    title: 'Bellek & Oturum Yönetimi',
    text: 'Kullanıcı oturumu devam ederken önceki konuşmalar hatırlanır, tercihler korunur ve deneyim her tıklamada daha kişisel hale gelir.'
  },
  {
    title: 'AI Matematik Modu Hazır',
    text: 'Alan-çevre hesaplamaları 10 farklı geometrik cisimde adım adım gösterilir. Tıklayarak ilerleyen akış öğrenmeyi hızlandırır.'
  }
];

const plusScenes = [
  '⚡ Daha hızlı cevap: web arama akışı yaklaşık 10 saniyeden 5 saniye bandına iner.',
  '📝 Daha uzun cevap: Premium modda tüm yanıtlar daha kapsamlı ve detaylı hale gelir.',
  '🧠 Daha geniş bellek: normal sürüme göre daha çok bağlam kaydı saklanır.',
  '🔓 Ban kaldırması: erişim kısıtları daha esnek şekilde yönetilir.',
  '😄 Küfüre izin ver (opsiyonel): açılabilir ayarda mizahi/samimi konuşma tonu aktive edilebilir.',
  '✨ Daha fazlası gelecek...'
];

let sceneIndex = 0;
let plusIndex = 0;
let audioCtx;
let osc;

function renderScene() {
  const scene = scenes[sceneIndex];
  stageTitle.textContent = scene.title;
  stageSubtitle.textContent = scene.text;
}

function renderPlusScene() {
  plusText.textContent = plusScenes[plusIndex];
}

function startAmbientTone() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(196, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.018, audioCtx.currentTime);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
  }
}

function stopAmbientTone() {
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
    osc = null;
  }
}

openAnimationBtn.addEventListener('click', () => {
  animationStage.classList.remove('hidden');
  sceneIndex = 0;
  renderScene();
  startAmbientTone();
});

closeAnimationBtn.addEventListener('click', () => {
  animationStage.classList.add('hidden');
  stopAmbientTone();
});

nextFrameBtn.addEventListener('click', () => {
  sceneIndex = (sceneIndex + 1) % scenes.length;
  renderScene();
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
