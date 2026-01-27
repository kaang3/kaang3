const sohbetListesi = document.getElementById("sohbetListesi");
const mesajAlani = document.getElementById("mesajAlani");
const mesajInput = document.getElementById("mesajInput");
const gonderBtn = document.getElementById("gonderBtn");
const oneriler = document.getElementById("oneriler");
const sohbetAra = document.getElementById("sohbetAra");
const yeniSohbet = document.getElementById("yeniSohbet");

const quickPrompts = [
  "Mars'a taşınmak mümkün mü?",
  "Türk kahvesi nasıl yapılır?",
  "Bugün motivasyon ver.",
  "Bir iş fikri öner.",
  "Rüyalar neden görülür?",
  "Yapay zeka geleceği nasıl etkileyecek?"
];

const knowledgeBase = [
  {
    keywords: ["evren", "galaksi", "yıldız", "uzay", "mars"],
    answer: "Evren 13,8 milyar yıllık bir hikâye. Mars, ince atmosferi ve su izi sayesinde araştırma üssü için ideal aday. Enerji, yaşam destek sistemleri ve radyasyon kalkanı ana ihtiyaçlar."
  },
  {
    keywords: ["tarih", "osmanlı", "roma", "antik"],
    answer: "Tarih döngüler ve dönüşümlerle ilerler. Osmanlı 600 yıl boyunca çok kültürlü bir imparatorluktu; Roma ise hukuk ve şehircilik temeli attı."
  },
  {
    keywords: ["kahve", "demleme", "türk", "espresso"],
    answer: "Türk kahvesi için ince öğütülmüş kahve, soğuk su ve isteğe bağlı şekerle kısık ateşte köpük alın. İlk köpüğü fincana, kalanını taşırmadan pişir."
  },
  {
    keywords: ["motivasyon", "ilham", "enerji"],
    answer: "Motivasyon, küçük kazanımların bileşik etkisidir. Bugün tek bir küçük adım at ve onu tamamlamak için kendine 20 dakika ver."
  },
  {
    keywords: ["iş", "girişim", "fikir", "start"],
    answer: "Yerel hizmetleri dijitalleştiren mikro-platformlar yükselişte. Mahallende tek bir ihtiyacı seç, hızlı hizmet + şeffaf fiyatla prototip çıkar."
  },
  {
    keywords: ["yapay", "zeka", "ai", "otomasyon"],
    answer: "Yapay zeka tekrarlı işleri devralırken, insan odağı tasarım, strateji ve etik yönetişim daha değerli olacak. Öğrenme hızın en büyük avantajın."
  },
  {
    keywords: ["rüya", "uyku", "bilinç"],
    answer: "Rüyalar, beynin duyguları işlemesi ve hafızayı düzenlemesiyle ilişkilidir. REM uykusu sırasında öğrenilen bilgiler pekişir."
  },
  {
    keywords: ["sağlık", "beslenme", "spor", "fitness"],
    answer: "Dengeli beslenme için tabakta protein, lif ve sağlıklı yağ dengesini hedefle. Haftada 150 dakika orta tempolu hareket önerilir."
  },
  {
    keywords: ["müzik", "sanat", "yaratıcılık"],
    answer: "Yaratıcılık, farklı alanlardan bilgi harmanlamaktır. Yeni bir tür denemek, beynin yeni bağlantılar kurmasına yardımcı olur."
  },
  {
    keywords: ["hava", "iklim", "çevre"],
    answer: "İklim krizinin ana tetikleyicisi sera gazlarıdır. Enerji verimliliği, yenilenebilir kaynaklar ve bireysel tüketim değişimi kritik rol oynar."
  }
];

const sohbetler = [
  { isim: "Evrensel Bilge", sonMesaj: "Her şeyi sorabilirsin.", saat: "Şimdi" },
  { isim: "Astro Arşiv", sonMesaj: "Mars kolonisi planı hazır.", saat: "09:24" },
  { isim: "İdeaLab", sonMesaj: "3 yeni iş fikri var.", saat: "Dün" }
];

const hafiza = JSON.parse(localStorage.getItem("novaMesajlar")) || [
  { role: "npc", text: "Merhaba! Ben Evrensel Bilge. Bana her şeyi sorabilirsin.", time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) }
];

function sohbetleriCiz() {
  sohbetListesi.innerHTML = "";
  sohbetler.forEach((sohbet) => {
    const card = document.createElement("div");
    card.className = "chat-card";
    card.innerHTML = `
      <div>
        <strong>${sohbet.isim}</strong>
        <span>${sohbet.sonMesaj}</span>
      </div>
      <span>${sohbet.saat}</span>
    `;
    sohbetListesi.appendChild(card);
  });
}

function mesajEkle(role, text) {
  const time = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  const mesaj = { role, text, time };
  hafiza.push(mesaj);
  localStorage.setItem("novaMesajlar", JSON.stringify(hafiza));

  const bubble = document.createElement("div");
  bubble.className = `message ${role}`;
  bubble.innerHTML = `${text}<small>${time}</small>`;
  mesajAlani.appendChild(bubble);
  mesajAlani.scrollTop = mesajAlani.scrollHeight;
}

function renderMesajlar() {
  mesajAlani.innerHTML = "";
  hafiza.forEach((mesaj) => {
    const bubble = document.createElement("div");
    bubble.className = `message ${mesaj.role}`;
    bubble.innerHTML = `${mesaj.text}<small>${mesaj.time}</small>`;
    mesajAlani.appendChild(bubble);
  });
  mesajAlani.scrollTop = mesajAlani.scrollHeight;
}

function onerileriCiz() {
  oneriler.innerHTML = "";
  quickPrompts.forEach((prompt) => {
    const button = document.createElement("button");
    button.className = "suggestion-btn";
    button.textContent = prompt;
    button.addEventListener("click", () => {
      mesajInput.value = prompt;
      mesajGonder();
    });
    oneriler.appendChild(button);
  });
}

function analizEt(metin) {
  const temiz = metin.toLowerCase().replace(/[.,!?]/g, "");
  const kelimeler = temiz.split(/\s+/).filter(Boolean);
  return { temiz, kelimeler };
}

function bilgiBul(metin) {
  const { kelimeler } = analizEt(metin);
  let enYuksek = { skor: 0, cevap: null };

  knowledgeBase.forEach((kayit) => {
    const skor = kayit.keywords.reduce((acc, anahtar) => acc + (kelimeler.includes(anahtar) ? 1 : 0), 0);
    if (skor > enYuksek.skor) {
      enYuksek = { skor, cevap: kayit.answer };
    }
  });

  return enYuksek.skor > 0 ? enYuksek.cevap : null;
}

function evrenselCevap(metin) {
  const { temiz } = analizEt(metin);
  const genel = [
    "Konuya sistematik bakalım:",
    "Bu başlık için üç katmanlı bir cevap vereyim:",
    "Bunu en net şekilde özetleyeyim:"
  ];

  const derinlik = [
    "1) Temel gerçek: Konunun çekirdeğini sadeleştir.",
    "2) Bağlam: Etkileyen faktörleri ve bağlantıları düşün.",
    "3) Eylem: Bugün uygulayabileceğin küçük bir adım seç."
  ];

  const kapanis = [
    "İstersen hedefini netleştirelim, sana özel bir yol haritası çıkarırım.",
    "Daha spesifik bir detay verirsen cevabı mikro düzeye indiririm.",
    "Hangi açıdan derine inmeyi istersin?"
  ];

  return `${genel[Math.floor(Math.random() * genel.length)]}<br>${derinlik.join("<br>")}<br><br>"${temiz}" için gerekli tüm bağlantıları kurabilirim. ${kapanis[Math.floor(Math.random() * kapanis.length)]}`;
}

function generateNpcResponse(metin) {
  const selamlar = ["selam", "merhaba", "hi", "hey", "günaydın", "iyi akşamlar"];
  if (selamlar.some((selam) => metin.toLowerCase().includes(selam))) {
    return "Selam! Ben Evrensel Bilge. Dilediğin konuyu aç, tüm yanıtları birleştirip sana net bir yol çıkarayım.";
  }

  const bilgi = bilgiBul(metin);
  if (bilgi) {
    return `${bilgi}<br><br>İstersen bu konuyu örneklerle de derinleştirebilirim.`;
  }

  return evrenselCevap(metin);
}

function mesajGonder() {
  const mesaj = mesajInput.value.trim();
  if (!mesaj) return;

  mesajEkle("user", mesaj);
  mesajInput.value = "";

  setTimeout(() => {
    const cevap = generateNpcResponse(mesaj);
    mesajEkle("npc", cevap);
  }, 600);
}

function sohbetAraIslemi() {
  const arama = sohbetAra.value.toLowerCase();
  const kartlar = Array.from(sohbetListesi.children);
  kartlar.forEach((kart) => {
    const isim = kart.querySelector("strong").textContent.toLowerCase();
    kart.style.display = isim.includes(arama) ? "flex" : "none";
  });
}

function yeniSohbetAc() {
  localStorage.removeItem("novaMesajlar");
  location.reload();
}

sohbetleriCiz();
renderMesajlar();
onerileriCiz();

mesajInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    mesajGonder();
  }
});

gonderBtn.addEventListener("click", mesajGonder);
sohbetAra.addEventListener("input", sohbetAraIslemi);
yeniSohbet.addEventListener("click", yeniSohbetAc);
