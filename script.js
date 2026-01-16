const questions = [
  {
    text: "\"Hello\" kelimesinin Türkçe karşılığı nedir?",
    options: ["Merhaba", "Lütfen", "Hoşça kal", "Teşekkürler"],
    correctIndex: 0,
    skill: "Dinleme",
  },
  {
    text: "\"I am a student\" cümlesinin anlamı hangisidir?",
    options: [
      "Ben bir öğrenciyim",
      "Ben bir öğretmenim",
      "Öğrenciler burada",
      "Benim öğrencim var",
    ],
    correctIndex: 0,
    skill: "Okuma",
  },
  {
    text: "\"Good night\" için doğru Türkçe ifade hangisi?",
    options: ["Günaydın", "İyi geceler", "Hoş geldin", "İyi öğlen"],
    correctIndex: 1,
    skill: "Konuşma",
  },
];

const streakEl = document.getElementById("streak");
const heartsEl = document.getElementById("hearts");
const xpEl = document.getElementById("xp");
const goalFill = document.getElementById("goalFill");
const goalValue = document.getElementById("goalValue");
const questionText = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const checkAnswerBtn = document.getElementById("checkAnswer");
const skipQuestionBtn = document.getElementById("skipQuestion");

let currentIndex = 0;
let selectedIndex = null;
let xp = 120;
let streak = 3;
let hearts = 5;
let minutes = 3;
let isAnswered = false;

const updateStats = () => {
  streakEl.textContent = `${streak} gün`;
  heartsEl.textContent = `${hearts} ❤`;
  xpEl.textContent = xp;
  goalValue.textContent = minutes;
  goalFill.style.width = `${Math.min((minutes / 10) * 100, 100)}%`;
};

const renderQuestion = () => {
  const question = questions[currentIndex];
  questionText.textContent = question.text;
  feedbackEl.textContent = "Doğru seçeneği seçip kontrol et.";
  optionsEl.innerHTML = "";
  selectedIndex = null;
  checkAnswerBtn.disabled = true;
  checkAnswerBtn.textContent = "Kontrol Et";
  isAnswered = false;

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => {
      optionsEl.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("selected");
      });
      button.classList.add("selected");
      selectedIndex = index;
      checkAnswerBtn.disabled = false;
    });
    optionsEl.appendChild(button);
  });
};

const revealAnswer = () => {
  const question = questions[currentIndex];
  optionsEl.querySelectorAll(".option").forEach((item, index) => {
    if (index === question.correctIndex) {
      item.classList.add("correct");
    }
    if (index === selectedIndex && selectedIndex !== question.correctIndex) {
      item.classList.add("wrong");
    }
  });
};

checkAnswerBtn.addEventListener("click", () => {
  if (isAnswered) {
    currentIndex = (currentIndex + 1) % questions.length;
    renderQuestion();
    return;
  }

  const question = questions[currentIndex];
  revealAnswer();
  isAnswered = true;

  if (selectedIndex === question.correctIndex) {
    feedbackEl.textContent = "Harika! 10 XP kazandın.";
    xp += 10;
    minutes += 2;
  } else {
    feedbackEl.textContent = "Tekrar dene! Bir can kaybettin.";
    hearts = Math.max(0, hearts - 1);
  }

  checkAnswerBtn.textContent = currentIndex === questions.length - 1 ? "Tamamla" : "Devam";
  checkAnswerBtn.disabled = false;
  updateStats();
});

skipQuestionBtn.addEventListener("click", () => {
  feedbackEl.textContent = "Soru atlandı. Hızlıca diğerine geç.";
  currentIndex = (currentIndex + 1) % questions.length;
  renderQuestion();
});

updateStats();
renderQuestion();
