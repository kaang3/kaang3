const topics = [
  {
    title: "1) Tam Sayılarla İşlemler",
    explanation: "Pozitif ve negatif tam sayılarla toplama, çıkarma, çarpma ve bölme yaparken işaret kuralları çok önemlidir. Aynı işaretli sayıların toplamı aynı işaretli olur, farklı işaretlilerde mutlak değeri büyük olanın işareti alınır.",
    example: "Örnek: (-8) + (+3) = -5, (+6) - (-2) = +8, (-4) × (-5) = +20.",
    question: "(-12) + (+7) işleminin sonucu nedir?",
    answer: "-5",
    solution: "İşaretler farklı, mutlak değeri büyük olan 12 kazanır. 12 - 7 = 5, işaret eksi: -5."
  },
  {
    title: "2) Rasyonel Sayılar",
    explanation: "Pay/payda şeklinde yazılabilen sayılara rasyonel sayı denir. Kesirlerde toplama-çıkarma için payda eşitlenir. Çarpma ve bölmede sadeleştirme kullanılır.",
    example: "Örnek: 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2.",
    question: "2/5 + 1/10 işleminin sonucu nedir?",
    answer: "1/2",
    solution: "Payda 10 yapılır: 2/5 = 4/10. 4/10 + 1/10 = 5/10 = 1/2."
  },
  {
    title: "3) Cebirsel İfadeler",
    explanation: "Harf içeren matematiksel ifadelere cebirsel ifade denir. Benzer terimler toplanır/çıkarılır. Bir sayının parantez içine dağılması dağıtma özelliğidir.",
    example: "Örnek: 3x + 2x - x = 4x.",
    question: "5a - 2a + 7a ifadesi kaç a eder?",
    answer: "10a",
    solution: "Benzer terimler toplanır: (5 - 2 + 7)a = 10a."
  },
  {
    title: "4) Oran ve Orantı",
    explanation: "Oran iki çokluğun karşılaştırılmasıdır. Orantı ise iki oranın eşitliğidir. İçler-dışlar çarpımı yöntemiyle bilinmeyen bulunur.",
    example: "Örnek: 3/5 = x/20 ise 3×20 = 5x → x=12.",
    question: "4/7 = x/21 olduğuna göre x kaçtır?",
    answer: "12",
    solution: "İçler-dışlar: 4×21 = 7x, 84 = 7x, x = 12."
  },
  {
    title: "5) Yüzdeler",
    explanation: "Yüzde, bir sayının 100 parçadaki karşılığıdır. Yüzde problemlerinde 'yüzde = oran' mantığıyla işlem yapılır.",
    example: "Örnek: 200'ün %15'i = 200 × 15/100 = 30.",
    question: "160 sayısının %25'i kaçtır?",
    answer: "40",
    solution: "160 × 25/100 = 40."
  },
  {
    title: "6) Doğrular ve Açılar",
    explanation: "Komşu, tümler, bütünler, ters açılar gibi kavramlar sorularda sık geçer. Tümler açılar 90°, bütünler açılar 180° eder.",
    example: "Örnek: Bir açı 35° ise tümleri 55°, bütünleri 145°.",
    question: "Bir açının ölçüsü 68° ise bütünleri kaç derecedir?",
    answer: "112",
    solution: "Bütünler açıların toplamı 180°: 180 - 68 = 112."
  },
  {
    title: "7) Çokgenler ve Çember",
    explanation: "Çokgenlerin iç açıları, kenar özellikleri ve çevre hesapları önemlidir. Çemberde yarıçap, çap ve çevre ilişkisi öğrenilir.",
    example: "Örnek: Karenin çevresi = 4 × kenar.",
    question: "Bir karenin bir kenarı 9 cm ise çevresi kaç cm'dir?",
    answer: "36",
    solution: "Çevre = 4 × 9 = 36 cm."
  },
  {
    title: "8) Veri Analizi",
    explanation: "Sütun grafiği, daire grafiği, çizgi grafiği yorumlama; ortalama, açıklık gibi kavramları içerir.",
    example: "Örnek: 4, 6, 8 sayılarının aritmetik ortalaması (4+6+8)/3 = 6.",
    question: "10, 14, 16, 20 verilerinin aritmetik ortalaması kaçtır?",
    answer: "15",
    solution: "Toplam 60, adet 4. 60/4 = 15."
  }
];

const container = document.getElementById("konular");

function buildTopics() {
  topics.forEach((topic, i) => {
    const card = document.createElement("details");
    card.className = "topic";
    if (i === 0) card.open = true;

    card.innerHTML = `
      <summary>${topic.title}</summary>
      <div class="topic-content">
        <p>${topic.explanation}</p>
        <div class="example"><strong>Adım Adım Örnek:</strong> ${topic.example}</div>
        <div class="quiz">
          <strong>Şimdi Sen Çöz:</strong>
          <p>${topic.question}</p>
          <div class="answer-box">
            <input type="text" id="answer-${i}" placeholder="Cevabın" />
            <button data-index="${i}">Kontrol</button>
          </div>
          <p id="feedback-${i}"></p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  container.addEventListener("click", (event) => {
    if (event.target.tagName !== "BUTTON" || !event.target.dataset.index) return;
    const idx = Number(event.target.dataset.index);
    const input = document.getElementById(`answer-${idx}`);
    const feedback = document.getElementById(`feedback-${idx}`);
    const userAns = input.value.trim().toLowerCase().replaceAll(" ", "");
    const trueAns = topics[idx].answer.toLowerCase().replaceAll(" ", "");

    if (userAns === trueAns) {
      feedback.className = "feedback-ok";
      feedback.textContent = "✅ Harika! Doğru çözdün.";
    } else {
      feedback.className = "feedback-bad";
      feedback.textContent = `❌ Tam olmadı. Çözüm: ${topics[idx].solution}`;
    }
  });
}

function setupRandomQuestion() {
  const randomQuestion = document.getElementById("randomQuestion");
  const randomAnswer = document.getElementById("randomAnswer");
  const randomFeedback = document.getElementById("randomFeedback");
  const checkRandom = document.getElementById("checkRandom");

  let current = topics[Math.floor(Math.random() * topics.length)];
  randomQuestion.textContent = current.question;

  checkRandom.addEventListener("click", () => {
    const value = randomAnswer.value.trim().toLowerCase().replaceAll(" ", "");
    const expected = current.answer.toLowerCase().replaceAll(" ", "");

    if (value === expected) {
      randomFeedback.className = "feedback-ok";
      randomFeedback.textContent = "Süper! Yeni soru geliyor...";
    } else {
      randomFeedback.className = "feedback-bad";
      randomFeedback.textContent = `Doğru cevap: ${current.answer}. ${current.solution}`;
    }

    current = topics[Math.floor(Math.random() * topics.length)];
    randomQuestion.textContent = current.question;
    randomAnswer.value = "";
  });
}

buildTopics();
setupRandomQuestion();
