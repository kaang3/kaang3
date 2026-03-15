const dersler = [
  {
    baslik: "Ders 1: HTML'e Giriş ve Sayfa İskeleti",
    konu: "Bu derste HTML dosyasının temel yapısını öğrenirsin: <!DOCTYPE html>, <html>, <head>, <body>. Tarayıcıya sayfanın ne olduğunu doğru anlatmak için bu yapı zorunludur.",
    uygulama: {
      gorev: "Boş bir HTML dosyası oluştur. Başlıkta 'Benim İlk Sayfam' yazsın. Body kısmına bir h1 ve bir paragraf ekle.",
      anahtarlar: ["<!doctype html>", "<title>", "<h1>", "<p>"]
    },
    sorular: soruUret("HTML Temeli", 1, 11)
  },
  {
    baslik: "Ders 2: Metin Etiketleri ve Liste Yapıları",
    konu: "Başlık etiketleri (h1-h6), paragraf, strong, em, ul/ol/li ile metni anlamlı ve okunabilir hale getirirsin.",
    uygulama: {
      gorev: "Kendini tanıtan bir içerik yaz. En az 2 başlık, 2 paragraf ve bir sıralı + sırasız liste kullan.",
      anahtarlar: ["<h2>", "<p>", "<ul>", "<ol>"]
    },
    sorular: soruUret("Metin ve Liste", 12, 22)
  },
  {
    baslik: "Ders 3: Linkler, Görseller ve Medya",
    konu: "a etiketi ile bağlantı, img ile görsel, audio/video ile medya ekleyebilirsin. alt metni erişilebilirlik için kritik bir detaydır.",
    uygulama: {
      gorev: "Bir hobi sayfası oluştur: bir görsel ekle, başka siteye link ver, bir de video etiketi ile örnek video alanı hazırla.",
      anahtarlar: ["<a ", "<img", "alt=", "<video"]
    },
    sorular: soruUret("Medya", 23, 33)
  },
  {
    baslik: "Ders 4: Formlar ve Kullanıcı Girdisi",
    konu: "Formlar kullanıcıdan veri almak için kullanılır. input türleri, label, textarea, select ve button temel bileşenlerdir.",
    uygulama: {
      gorev: "Kayıt formu yap: ad, e-posta, şifre, doğum tarihi, şehir seçimi ve gönder butonu olsun.",
      anahtarlar: ["<form", "<label", "type=\"email\"", "<select"]
    },
    sorular: soruUret("Form", 34, 44)
  },
  {
    baslik: "Ders 5: Semantik HTML ve Erişilebilirlik",
    konu: "header, nav, main, article, section, footer gibi semantik etiketler kodu okunur ve SEO dostu yapar. aria-label, alt, doğru heading sırası erişilebilirliği artırır.",
    uygulama: {
      gorev: "Blog düzeni kur: header, nav, main, article ve footer kullan. Görsellere alt ekle.",
      anahtarlar: ["<header>", "<nav>", "<main>", "<footer>"]
    },
    sorular: soruUret("Semantik", 45, 55)
  },
  {
    baslik: "Ders 6: CSS Temelleri",
    konu: "Seçiciler, renk, arkaplan, font-size, margin/padding ile sayfanın görünümünü kontrol edersin. CSS dosyasını link ile bağlamak en temiz yöntemdir.",
    uygulama: {
      gorev: "Önceki dersin blog sayfasını renklendir. Başlığı farklı renk yap, kart görünümü ver, butona hover ekle.",
      anahtarlar: ["color:", "background", "padding", ":hover"]
    },
    sorular: soruUret("CSS Temel", 56, 66)
  },
  {
    baslik: "Ders 7: CSS Layout (Flexbox + Grid)",
    konu: "Flexbox tek boyutlu, Grid iki boyutlu yerleşimler için çok güçlüdür. Modern arayüzlerin temelini oluşturur.",
    uygulama: {
      gorev: "3 kartlı bir ürün alanı yap. Masaüstünde 3 sütun, mobilde tek sütun göster.",
      anahtarlar: ["display: grid", "grid-template-columns", "@media", "display: flex"]
    },
    sorular: soruUret("Layout", 67, 77)
  },
  {
    baslik: "Ders 8: Responsive Tasarım ve İleri CSS",
    konu: "media query, clamp, transition, transform ve animation ile hem esnek hem daha canlı arayüzler üretebilirsin.",
    uygulama: {
      gorev: "Bir butona hover animasyonu ekle, kartlara gölge ver, yazı boyutunu clamp ile akıllı hale getir.",
      anahtarlar: ["transition", "transform", "clamp(", "box-shadow"]
    },
    sorular: soruUret("Responsive + İleri CSS", 78, 88)
  },
  {
    baslik: "Ders 9: JavaScript Temelleri",
    konu: "Değişken, koşul, döngü, fonksiyon ve dizi nesneleri JavaScript'in temelidir. HTML ile JS birleşince etkileşim başlar.",
    uygulama: {
      gorev: "Kullanıcının adını alan ve ekranda selamlayan bir fonksiyon yaz. Boşsa uyarı ver.",
      anahtarlar: ["function", "if", "alert", "const"]
    },
    sorular: soruUret("JS Temel", 89, 99)
  },
  {
    baslik: "Ders 10: DOM ve Olay Yönetimi",
    konu: "document.querySelector, addEventListener, classList ile sayfa elemanlarını canlı olarak değiştirebilirsin.",
    uygulama: {
      gorev: "Bir yapılacaklar (todo) mini uygulaması yap: inputa yaz, butona bas, listeye eklensin.",
      anahtarlar: ["querySelector", "addEventListener", "createElement", "appendChild"]
    },
    sorular: soruUret("DOM", 100, 110)
  },
  {
    baslik: "Ders 11: Async JavaScript ve API",
    konu: "fetch, async/await ile dış veri kaynaklarından bilgi çekebilirsin. Hata yönetimi için try/catch gerekir.",
    uygulama: {
      gorev: "Ücretsiz bir JSON API'den veri çekip listele. Yükleniyor ve hata durumlarını ekrana yazdır.",
      anahtarlar: ["fetch(", "async", "await", "try"]
    },
    sorular: soruUret("Async + API", 111, 121)
  },
  {
    baslik: "Ders 12: Mini Proje ve İleri Seviye",
    konu: "Artık HTML, CSS, JS birlikte kullanarak mini projeler yapabilirsin: portföy, quiz, not uygulaması, dashboard gibi. Bu derste mimari düşünme ve temiz kod alışkanlığı odakta.",
    uygulama: {
      gorev: "Kendi mini öğrenme uygulamanı kur: ders kartları, ilerleme çubuğu, localStorage kaydı ve filtreleme olsun.",
      anahtarlar: ["localStorage", "filter(", "progress", "classList"]
    },
    sorular: soruUret("Proje", 122, 132)
  }
];

function soruUret(konu, baslangic, bitis) {
  const kaliplar = [
    `${konu} içinde en çok hangi etiketi/komutu hangi senaryoda kullanırsın?`,
    `${konu} konusunda yaygın yapılan bir hata nedir, nasıl düzeltirsin?`,
    `${konu} ile ilgili kısa bir örnek kod parçası yazar mısın?`,
    `${konu} performansını veya okunabilirliğini artırmak için ne önerirsin?`,
    `${konu} konusunu yeni başlayan birine 2 cümlede nasıl anlatırsın?`
  ];

  const ipuclari = [
    "İpucu: cevapta kullanım amacı + senaryo örneği ver.",
    "İpucu: önce hatayı söyle, sonra nasıl düzelteceğini yaz.",
    "İpucu: kısa bir kod bloğu ve 1 cümle açıklama yeterli.",
    "İpucu: okunabilirlik, yeniden kullanım ve performans kelimelerini düşün.",
    "İpucu: teknik olmayan, sade bir dille anlatmayı dene."
  ];

  return Array.from({ length: bitis - baslangic + 1 }, (_, i) => {
    const no = baslangic + i;
    const idx = i % kaliplar.length;
    const soru = `Soru ${no}: ${kaliplar[idx]}`;
    const kontrolAnahtarlari = [konu.split(" ")[0].toLowerCase(), "örnek"];

    return {
      soru,
      ipucu: ipuclari[idx],
      kontrolAnahtarlari
    };
  });
}

const dersListesi = document.getElementById("dersListesi");
const dersDetay = document.getElementById("dersDetay");
const soruSayisi = document.getElementById("soruSayisi");

const toplamSoru = dersler.reduce((toplam, ders) => toplam + ders.sorular.length, 0);
soruSayisi.textContent = toplamSoru;

function dersleriYukle() {
  dersler.forEach((ders, index) => {
    const buton = document.createElement("button");
    buton.className = "ders-buton";
    buton.textContent = `${index + 1}. ${ders.baslik}`;
    buton.addEventListener("click", () => {
      document.querySelectorAll(".ders-buton").forEach((b) => b.classList.remove("aktif"));
      buton.classList.add("aktif");
      dersiGoster(ders);
    });
    dersListesi.appendChild(buton);
  });
}

function dersiGoster(ders) {
  dersDetay.innerHTML = `
    <h2>${ders.baslik}</h2>
    <p class="konu">${ders.konu}</p>

    <div class="uygulama">
      <h3>Uygulama Görevi</h3>
      <p>${ders.uygulama.gorev}</p>
      <label for="kodAlani">Kodunu buraya yapıştır:</label>
      <textarea id="kodAlani" placeholder="Örnek: <h1>Merhaba</h1>"></textarea>
      <button id="kontrolBtn">Kontrol Et</button>
      <div class="sonuc" id="sonuc"></div>
    </div>

    <h3>Test Soruları (${ders.sorular.length} adet)</h3>
    <p class="not">Soruların cevabı görünmez. Önce sen yanıtla, takılırsan sadece ipucu al.</p>
    <div id="soruAlani"></div>
  `;

  const soruAlani = document.getElementById("soruAlani");
  ders.sorular.forEach((item, index) => {
    const s = document.createElement("div");
    s.className = "soru";
    s.innerHTML = `
      <h4>${item.soru}</h4>
      <textarea class="soru-cevap" placeholder="Cevabını buraya yaz..."></textarea>
      <div class="soru-aksiyonlar">
        <button class="kontrol-yanit">Cevabımı Kontrol Et</button>
        <button class="ipucu-btn" type="button">İpucu Al</button>
      </div>
      <div class="geri-bildirim" id="geri-${index}"></div>
      <div class="ipucu" id="ipucu-${index}"></div>
    `;

    const cevapAlani = s.querySelector(".soru-cevap");
    const geri = s.querySelector(`#geri-${index}`);
    const ipucu = s.querySelector(`#ipucu-${index}`);

    s.querySelector(".kontrol-yanit").addEventListener("click", () => {
      const metin = cevapAlani.value.trim().toLowerCase();

      if (!metin) {
        geri.textContent = "Önce bir cevap yazmalısın.";
        geri.className = "geri-bildirim uyari";
        return;
      }

      const eslesen = item.kontrolAnahtarlari.filter((k) => metin.includes(k));
      if (eslesen.length > 0) {
        geri.textContent = "Güzel! Cevabın doğru yolda. Daha da netleştirmek için bir örnek daha ekleyebilirsin.";
        geri.className = "geri-bildirim basarili";
      } else {
        geri.textContent = "Henüz zayıf görünüyor. İpucu alıp cevabını güçlendirmeyi dene.";
        geri.className = "geri-bildirim uyari";
      }
    });

    s.querySelector(".ipucu-btn").addEventListener("click", () => {
      ipucu.textContent = item.ipucu;
      ipucu.classList.add("acik");
    });

    soruAlani.appendChild(s);
  });

  document.getElementById("kontrolBtn").addEventListener("click", () => {
    const kod = document.getElementById("kodAlani").value.toLowerCase();
    const bulunan = ders.uygulama.anahtarlar.filter((k) => kod.includes(k.toLowerCase()));
    const sonuc = document.getElementById("sonuc");

    if (bulunan.length === ders.uygulama.anahtarlar.length) {
      sonuc.textContent = `Süper! Beklenen tüm anahtarları kullandın: ${bulunan.join(", ")}`;
    } else {
      const eksik = ders.uygulama.anahtarlar.filter((k) => !bulunan.includes(k));
      sonuc.textContent = `İyi gidiyorsun. Eksik görünenler: ${eksik.join(", ")}`;
    }
  });
}

dersleriYukle();
