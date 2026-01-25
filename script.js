const QUESTIONS = [
  "Sosyal ortamlarda ne söyleyeceğinizi planlamak için ekstra zaman harcarsınız.",
  "Kalabalık veya gürültülü yerler sizi hızla yorabilir.",
  "Mimik ve beden dilini okumakta zorlanırsınız.",
  "Günlük rutinlerin bozulması sizi belirgin şekilde rahatsız eder.",
  "Uzun süre aynı konuya yoğunlaşma eğiliminiz vardır.",
  "İroni veya imayı ilk anda anlamakta zorlanırsınız.",
  "Göz teması kurmak sizin için rahatsız edici olabilir.",
  "Duyusal uyaranlara (ışık, ses, doku) karşı hassassınızdır.",
  "Sosyal ilişkilerde yazılı iletişimi yüz yüze iletişime tercih edersiniz.",
  "Bir ortamda nasıl davranmanız gerektiğini gözlemleyerek öğrenirsiniz.",
  "İnsanların sizden ne beklediğini anlamakta zorlandığınız olur.",
  "Belirli ilgi alanlarına derinlemesine odaklanırsınız.",
  "Beklenmedik değişikliklerde kendinizi yeniden toparlamakta zorlanırsınız.",
  "Sosyal sohbetlerde sırayla konuşmak veya konu değiştirmek zor gelir.",
  "Gün içinde kendinizi aşırı yorgun veya tükenmiş hissettiğiniz olur.",
  "Duygularınızı sözcüklerle ifade etmekte zorlanırsınız.",
  "Toplantı veya ders gibi ortamlarda uzun süre odakta kalmakta güçlük yaşarsınız.",
  "Aynı hareketleri veya alışkanlıkları tekrarlama ihtiyacı hissedersiniz.",
  "Arkadaşlık kurmak için karşı tarafın ilgisini okurken zorlandığınız olur.",
  "Bir işi tamamlamak için adımları planlamak size zor gelir.",
  "Başka insanların esprilerini veya niyetlerini anlamak zaman alır.",
  "Yoğun bir günün ardından yalnız kalmaya ihtiyaç duyarsınız.",
  "Çoklu görevi (birden fazla şeyi aynı anda yapmak) zor bulursunuz."
];

const SCALE = [
  { label: "Hiç değil", value: 0 },
  { label: "Nadiren", value: 1 },
  { label: "Sık sık", value: 2 },
  { label: "Çok sık", value: 3 }
];

const form = document.getElementById("testForm");
const questionsEl = document.getElementById("questions");
const resultEl = document.getElementById("result");
const resetBtn = document.getElementById("resetBtn");

function renderQuestions() {
  QUESTIONS.forEach((text, index) => {
    const wrapper = document.createElement("fieldset");
    wrapper.className = "question";
    wrapper.innerHTML = `
      <legend>${index + 1}. ${text}</legend>
      <div class="options">
        ${SCALE.map(
          (option) => `
            <label>
              <input type="radio" name="q${index}" value="${option.value}" />
              <span>${option.label}</span>
            </label>
          `
        ).join("")}
      </div>
      <p class="error" aria-hidden="true">Lütfen bir seçenek işaretleyin.</p>
    `;
    questionsEl.appendChild(wrapper);
  });
}

function getScore() {
  let score = 0;
  let valid = true;
  const fields = document.querySelectorAll(".question");

  fields.forEach((field, index) => {
    const checked = form.querySelector(`input[name="q${index}"]:checked`);
    const error = field.querySelector(".error");
    if (!checked) {
      valid = false;
      field.classList.add("has-error");
      error.setAttribute("aria-hidden", "false");
    } else {
      field.classList.remove("has-error");
      error.setAttribute("aria-hidden", "true");
      score += Number(checked.value);
    }
  });

  return { score, valid };
}

function renderResult(score) {
  const maxScore = QUESTIONS.length * 3;
  const percentage = Math.round((score / maxScore) * 100);
  let heading = "Düşük";
  let message =
    "Yanıtlarınız otizmle ilişkili özelliklerin düşük düzeyde olduğunu gösteriyor. Yine de kendinizi anlamak için gözlemlerinizi not alabilirsiniz.";

  if (score >= 21 && score <= 32) {
    heading = "Orta";
    message =
      "Yanıtlarınız orta düzeyde otizmle ilişkili özellikler gösterebilir. Günlük yaşamınızı etkilediğini düşünüyorsanız bir uzmandan görüş almak faydalı olabilir.";
  }

  if (score >= 33) {
    heading = "Yüksek";
    message =
      "Yanıtlarınız yüksek düzeyde otizmle ilişkili özellikler gösterebilir. Tanı ve destek için bir uzmana başvurmanız önerilir.";
  }

  resultEl.classList.remove("hidden");
  resultEl.innerHTML = `
    <h2>Sonuç: ${heading}</h2>
    <p class="score">Toplam puanınız: <strong>${score}</strong> / ${maxScore} (%${percentage})</p>
    <p>${message}</p>
    <p class="disclaimer">Bu sonuçlar tıbbi tanı değildir; yalnızca farkındalık amaçlıdır.</p>
  `;
  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const { score, valid } = getScore();
  if (!valid) {
    return;
  }
  renderResult(score);
});

resetBtn.addEventListener("click", () => {
  form.reset();
  resultEl.classList.add("hidden");
  resultEl.innerHTML = "";
  document.querySelectorAll(".question").forEach((field) => {
    field.classList.remove("has-error");
    const error = field.querySelector(".error");
    error.setAttribute("aria-hidden", "true");
  });
});

renderQuestions();
