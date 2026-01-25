const knowledgeBase = [
  {
    title: "Kuantum Nedir?",
    category: "Bilim",
    answer: "Kuantum, atom altı parçacıkların davranışlarını açıklayan fizik alanıdır. Olasılık, dalga-parçacık ikiliği ve süperpozisyon gibi kavramlara dayanır.",
    tags: ["fizik", "atom", "kuantum"]
  },
  {
    title: "Yapay Zekâ Nasıl Öğrenir?",
    category: "Teknoloji",
    answer: "Yapay zekâ, verilerden örüntü öğrenerek tahmin yapar. Makine öğrenmesi algoritmaları, hatayı azaltacak şekilde ağırlıklarını günceller.",
    tags: ["ai", "ml", "algoritma"]
  },
  {
    title: "İklim Değişikliği Nedir?",
    category: "Çevre",
    answer: "İklim değişikliği, uzun vadeli sıcaklık ve hava düzeni değişimidir. Ana nedeni insan kaynaklı sera gazı salımlarıdır.",
    tags: ["iklim", "çevre", "sera"]
  },
  {
    title: "Girişimcilik İçin İlk Adım",
    category: "İş Dünyası",
    answer: "Girişimcilik için önce problemi tanımlamak ve çözümünüzü küçük bir prototiple doğrulamak gerekir. Hızlı geri bildirim çok önemlidir.",
    tags: ["startup", "ürün", "pazar"]
  },
  {
    title: "Bütçe Planlama Nasıl Yapılır?",
    category: "Finans",
    answer: "Gelir ve gider kalemlerini netleştirip 50/30/20 gibi basit oranlar belirleyin. Düzenli takip sürdürülebilirlik sağlar.",
    tags: ["finans", "bütçe", "tasarruf"]
  },
  {
    title: "Sağlıklı Uyku İçin İpuçları",
    category: "Sağlık",
    answer: "Her gün aynı saatte uyumak, ekran süresini azaltmak ve kafeini sınırlamak kaliteli uyku sağlar.",
    tags: ["uyku", "sağlık", "rutin"]
  },
  {
    title: "Mobil Uyumlu Tasarım Nedir?",
    category: "Tasarım",
    answer: "Mobil uyumlu tasarım, küçük ekranlarda okunabilir ve hızlı deneyim sunan arayüz tasarımıdır. Önce mobil, sonra masaüstü yaklaşımı uygulanır.",
    tags: ["responsive", "ux", "mobil"]
  },
  {
    title: "Veri Görselleştirme Neden Önemli?",
    category: "Analitik",
    answer: "Veri görselleştirme, karmaşık bilgileri hızlıca anlamayı sağlar. Doğru grafik seçimi karar kalitesini artırır.",
    tags: ["data", "grafik", "analiz"]
  },
  {
    title: "Dijital Pazarlama Stratejisi",
    category: "Pazarlama",
    answer: "Hedef kitleyi netleştirip içerik, SEO ve performans reklamlarını entegre ederek çok kanallı bir strateji oluşturulur.",
    tags: ["seo", "reklam", "içerik"]
  },
  {
    title: "Stres Yönetimi",
    category: "Sağlık",
    answer: "Nefes egzersizleri, kısa yürüyüşler ve net öncelikler belirlemek stres seviyesini düşürür.",
    tags: ["stres", "psikoloji", "denge"]
  },
  {
    title: "Uzay Araştırmalarında Güncel Trendler",
    category: "Bilim",
    answer: "Yeniden kullanılabilir roketler, Ay görevleri ve özel şirket yatırımları uzay araştırmalarında hızlı bir ivme sağlıyor.",
    tags: ["uzay", "roket", "mars"]
  },
  {
    title: "Blokzincir Nasıl Çalışır?",
    category: "Teknoloji",
    answer: "Blokzincir, dağıtık defter mantığıyla çalışan ve verileri bloklar halinde zincirleyen bir yapıdır. Güvenliği kriptografi sağlar.",
    tags: ["blockchain", "kripto", "güvenlik"]
  },
  {
    title: "Takım Yönetimi İçin İpuçları",
    category: "İş Dünyası",
    answer: "Net hedefler, düzenli iletişim ve güven kültürü takım verimliliğini artırır.",
    tags: ["takım", "liderlik", "yönetim"]
  },
  {
    title: "Hızlı Öğrenme Teknikleri",
    category: "Eğitim",
    answer: "Aralıklı tekrar, aktif not alma ve kısa çalışma blokları öğrenmeyi hızlandırır.",
    tags: ["öğrenme", "hafıza", "verim"]
  },
  {
    title: "Enerji Verimliliği",
    category: "Çevre",
    answer: "Verimli cihazlar, doğru yalıtım ve akıllı sistemler enerji tüketimini azaltır.",
    tags: ["enerji", "tasarruf", "sürdürülebilir"]
  },
  {
    title: "Ürün Yol Haritası Nasıl Çizilir?",
    category: "Ürün",
    answer: "Kullanıcı ihtiyaçları, iş hedefleri ve teknik kapasiteyi birleştirip net bir zaman planı oluşturmak gerekir.",
    tags: ["roadmap", "ürün", "planlama"]
  },
  {
    title: "Mikro Servis Mimarisi",
    category: "Teknoloji",
    answer: "Uygulamayı küçük bağımsız servisler halinde bölerek ölçeklenebilirlik ve esneklik elde edilir.",
    tags: ["microservice", "mimari", "cloud"]
  },
  {
    title: "İçerik Üretiminde Tutarlılık",
    category: "Pazarlama",
    answer: "Marka sesi ve yayın takvimi oluşturmak uzun vadeli güven sağlar.",
    tags: ["içerik", "marka", "plan"]
  },
  {
    title: "Finansal Risk Yönetimi",
    category: "Finans",
    answer: "Riskleri dağıtmak, acil durum fonu oluşturmak ve senaryo planları yapmak kritik öneme sahiptir.",
    tags: ["risk", "yatırım", "strateji"]
  },
  {
    title: "Kariyer Planlama",
    category: "Eğitim",
    answer: "Yeteneklerinizi belirleyip kısa ve uzun vadeli hedefler koyarak bilinçli bir yol haritası oluşturabilirsiniz.",
    tags: ["kariyer", "hedef", "gelişim"]
  }
];

const categories = [
  "Bilim",
  "Teknoloji",
  "Sağlık",
  "Çevre",
  "İş Dünyası",
  "Finans",
  "Eğitim",
  "Tasarım",
  "Pazarlama",
  "Analitik",
  "Ürün"
];

const chips = [
  "Mobil UX",
  "Yapay zekâ trendleri",
  "Hızlı öğrenme",
  "Sağlık ipuçları",
  "Enerji tasarrufu",
  "Girişimcilik"
];

const qaPrompts = [
  "Kuantum bilgisayarlar ne işe yarar?",
  "Mobilde içerik okunabilirliği nasıl artar?",
  "Yapay zekâ etik kullanımı neden önemli?",
  "Dijital pazarlamada başarıyı nasıl ölçerim?",
  "Uyku düzenimi nasıl güçlendiririm?",
  "Kariyer değişimi için ilk adım nedir?"
];

const normalized = (text) =>
  text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");

const scoreEntry = (query, entry) => {
  const queryNorm = normalized(query);
  const pool = [entry.title, entry.category, entry.answer, ...(entry.tags || [])].join(" ");
  const poolNorm = normalized(pool);
  let score = 0;

  queryNorm.split(" ").forEach((token) => {
    if (token.length < 3) return;
    if (poolNorm.includes(token)) score += 3;
  });

  if (poolNorm.includes(queryNorm)) score += 6;
  return score;
};

const buildCategoryCards = () => {
  const grid = document.getElementById("categoryGrid");
  grid.innerHTML = "";
  categories.forEach((category) => {
    const count = knowledgeBase.filter((item) => item.category === category).length + 12;
    const card = document.createElement("div");
    card.className = "category-card";
    card.innerHTML = `<strong>${category}</strong><span>${count}+ kayıt</span>`;
    card.onclick = () => runSearch(category);
    grid.appendChild(card);
  });
};

const buildChips = () => {
  const chipRow = document.getElementById("chipRow");
  chips.forEach((label) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerText = label;
    chip.onclick = () => runSearch(label);
    chipRow.appendChild(chip);
  });
};

const buildQaList = () => {
  const qaList = document.getElementById("qaList");
  qaList.innerHTML = "";
  qaPrompts.forEach((prompt) => {
    const item = document.createElement("div");
    item.className = "qa-item";
    item.innerHTML = `<strong>${prompt}</strong><p class="muted">Tek dokunuşla yanıt alın.</p>`;
    item.onclick = () => runSearch(prompt);
    qaList.appendChild(item);
  });
};

const updateAnswer = (query, results) => {
  const answerBox = document.getElementById("answerBox");
  const matchCount = document.getElementById("matchCount");
  const relatedBox = document.getElementById("relatedBox");

  if (!query) {
    answerBox.innerHTML = "<h4>Yanıt</h4><p>Bir soru sorarak devasa bilgi haznesini taramaya başla.</p>";
    matchCount.innerText = "0 eşleşme";
    relatedBox.innerHTML = "";
    return;
  }

  if (results.length === 0) {
    answerBox.innerHTML = `
      <h4>Yanıt</h4>
      <p>"${query}" için doğrudan eşleşme bulunamadı. Başlığı farklı ifade etmeyi deneyebilirsin.</p>
    `;
    matchCount.innerText = "0 eşleşme";
    relatedBox.innerHTML = "";
    return;
  }

  const best = results[0];
  answerBox.innerHTML = `
    <h4>${best.title}</h4>
    <p>${best.answer}</p>
    <p class="muted">Kategori: ${best.category} • Etiketler: ${best.tags.join(", ")}</p>
  `;

  matchCount.innerText = `${results.length} eşleşme`;

  relatedBox.innerHTML = "";
  results.slice(1, 4).forEach((item) => {
    const card = document.createElement("div");
    card.className = "related-card";
    card.innerHTML = `<strong>${item.title}</strong><p>${item.answer}</p>`;
    relatedBox.appendChild(card);
  });
};

const runSearch = (query) => {
  document.getElementById("globalSearch").value = query;
  const results = knowledgeBase
    .map((entry) => ({
      ...entry,
      score: scoreEntry(query, entry)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  updateAnswer(query, results);
};

const expandKnowledgeBase = () => {
  const expanded = [...knowledgeBase];
  categories.forEach((category) => {
    for (let i = 1; i <= 4; i += 1) {
      expanded.push({
        title: `${category} Derinlemesine ${i}`,
        category,
        answer:
          "Bu başlık, genişletilmiş bilgi deposunda daha ayrıntılı içeriklere yönlendirir. Kısa özetler ve rehberlik sunar.",
        tags: ["derin", "rehber", "genis", category.toLowerCase()]
      });
    }
  });
  return expanded;
};

const init = () => {
  const expanded = expandKnowledgeBase();
  knowledgeBase.splice(0, knowledgeBase.length, ...expanded);
  document.getElementById("topicCount").innerText = `${knowledgeBase.length}+`;

  buildCategoryCards();
  buildChips();
  buildQaList();

  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("globalSearch").value.trim();
    runSearch(query);
  });

  document.getElementById("globalSearch").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      runSearch(event.target.value.trim());
    }
  });
};

init();
