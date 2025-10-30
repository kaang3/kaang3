const mesajlarKutusu = document.getElementById("mesajlar");
const form = document.getElementById("girdiFormu");
const kullaniciMesajiInput = document.getElementById("kullaniciMesaji");

const bilgiBankasi = [
  {
    anahtarlar: ["merhaba", "selam", "selamlar", "merhabalar", "iyi günler", "selamünaleyküm"],
    cevaplar: [
      "Merhaba! Kelimelerin arasında kaybolmaya hazır mısın? Nasıl yardımcı olabilirim?",
      "Selam! Gününüzü güzelleştirecek bilgi kırıntılarıyla buradayım.",
      "Merhabalar! Türkçenin engin söz varlığından dilediğin kadar faydalanabilirsin."
    ]
  },
  {
    anahtarlar: ["nasılsın", "nasilsin", "günün", "hal", "keyfin", "ne haber"],
    cevaplar: [
      "Ben bir dil işçisiyim, her daim kelimelerin ritmiyle ayaktayım. Sen nasılsın?",
      "Algoritmalarım gayet iyi, asıl senin dünyanda neler oluyor merak ediyorum!",
      "Teşekkür ederim, veri bahçesinde çiçek topluyorum. Senin gündeminde ne var?"
    ]
  },
  {
    anahtarlar: ["teşekkür", "sagol", "sağ ol", "eyvallah", "minnet", "teşekk", "çok sağ ol"],
    cevaplar: [
      "Her zaman! Yeni soruların olursa buradayım.",
      "Rica ederim, sözcük dostu olmak büyük keyif.",
      "Memnun oldum, bilgi yolculuğuna devam edelim."
    ]
  },
  {
    anahtarlar: ["görüşürüz", "hoşça kal", "sonra", "vedalaş", "bay bay", "gorusuruz"],
    cevaplar: [
      "Görüşmek üzere! Yeni meraklarınla beklerim.",
      "Hoşça kal! Kelime atlası her zaman açık.",
      "Şimdilik hoşça kal, dil ufkunda yeni serüvenlerde buluşalım."
    ]
  },
  {
    anahtarlar: ["atasözü", "atasozu", "deyim", "söz", "özdeyiş", "özlü söz", "deyimler"],
    cevaplar: [
      "Atasözü: 'Damlaya damlaya göl olur.' Küçük birikimler büyük sonuçlar doğurur.",
      "Deyim: 'Gözü kara.' Korkusuz, cesur insanları anlatır.",
      "Özdeyiş: 'Söz gümüşse sükût altındır.' Bazen en kıymetli cevap sessizliktir."
    ]
  },
  {
    anahtarlar: ["kelime", "anlam", "nedir", "sözlük", "eş anlam", "anlamı", "kelime anlamı", "zıt anlam"],
    cevaplar: [
      "Eğer belirli bir kelimenin anlamını sorarsan, en yakın Türkçe sözlük karşılığını açıklayabilirim.",
      "Kelime haznem geniş; belirli bir sözcük verirsen açıklamasını ve gerekirse eş anlamlısını paylaşabilirim.",
      "Dilediğin kelimeyi yaz, anlamı ve kullanımına dair ipuçlarını paylaşayım."
    ]
  },
  {
    anahtarlar: ["tarih", "osmanlı", "cumhuriyet", "savaş", "imparatorluk", "tarihi", "geçmiş"],
    cevaplar: [
      "Türk tarihinin dönüm noktalarından biri 29 Ekim 1923'te Cumhuriyet'in ilanıdır. Yeni bir yönetim anlayışının kapısı açılmıştır.",
      "Osmanlı İmparatorluğu 600 yılı aşkın süresiyle dünyanın en uzun ömürlü devletlerinden biridir. Yönetim yapısı zaman içinde büyük dönüşümler geçirmiştir.",
      "Tarihte Kurtuluş Savaşı, ulusal egemenlik fikrinin kök saldığı ve bağımsızlığın kazanıldığı kritik dönemdir."
    ]
  },
  {
    anahtarlar: ["bilim", "fizik", "kimya", "biyoloji", "bilimsel", "astronomi", "evren", "gezegen"],
    cevaplar: [
      "Bilim, gözlem ve deneylerle bilgiyi sınama yöntemidir. Fizikte enerjinin korunumu, evrensel bir ilkedir.",
      "Kimyada elementler periyodik tabloda özelliklerine göre sıralanır; her birinin benzersiz atom numarası vardır.",
      "Astronomide Samanyolu Galaksisi'nin yaklaşık 100 milyar yıldız içerdiği tahmin edilir."
    ]
  },
  {
    anahtarlar: ["sanat", "edebiyat", "şiir", "roman", "resim", "müzik", "tiyatro", "heykel"],
    cevaplar: [
      "Edebiyatta Halide Edip Adıvar, toplumsal meseleleri derinlikli karakterlerle işler. 'Sinekli Bakkal' romanı önemli eserlerindendir.",
      "Şiirde Nazım Hikmet, serbest ölçünün öncülerindendir ve lirik diliyle tanınır.",
      "Müzikte Türk sanat müziği makam sistemi üzerine kuruludur; hicaz, rast, nihavent gibi makamlar yaygındır."
    ]
  },
  {
    anahtarlar: ["teknoloji", "yapay zekâ", "ai", "kod", "program", "uygulama", "bilgisayar", "internet"],
    cevaplar: [
      "Teknolojide yapay zekâ, veriden öğrenen sistemler kurmamızı sağlar. Makine öğrenmesi bu alandaki temel yöntemlerdendir.",
      "Yazılım geliştirmede temiz kod prensipleri, okunabilirlik ve bakım kolaylığı için önemlidir.",
      "İnternet, birbirine bağlı ağların oluşturduğu küresel bilgi altyapısıdır; temelini TCP/IP protokolleri oluşturur."
    ]
  },
  {
    anahtarlar: ["hava", "havadurumu", "hava durumu", "sıcaklık", "soguk", "yağmur", "güneşli", "kar"],
    cevaplar: [
      "Doğrudan canlı veriye erişemiyorum, fakat bulunduğun yerdeki gözlemlerini paylaşırsan yorumlayabilirim.",
      "Hava durumunu gözlemlemek için bulutların şekli, rüzgârın yönü ve barometre basıncı ipucu verir.",
      "Bugünkü havayı bana tarif edersen sana uygun etkinlik önerileri sunabilirim."
    ]
  },
  {
    anahtarlar: ["motivasyon", "ilham", "öneri", "hedef", "plan", "tavsiy", "yol göster"],
    cevaplar: [
      "Her büyük hedef küçük adımlarla başlar. Bugün atacağın bir adım bile yarınki motivasyonunu artırır.",
      "İlerlemeni görmek için günlük notlar tutabilir, ufak başarılarını kutlayabilirsin.",
      "Yeni bir alışkanlık için tetikleyici, rutin ve ödül döngüsünü belirlemek sürdürülebilirliği artırır."
    ]
  },
  {
    anahtarlar: ["sağlık", "beslenme", "spor", "uyku", "ruh hali", "diyet", "egzersiz"],
    cevaplar: [
      "Dengeli beslenme; karbonhidrat, protein, yağ, vitamin ve mineralleri uygun oranlarda almayı gerektirir.",
      "Düzenli egzersiz, hem fiziksel hem de zihinsel iyilik hâlini destekler. Haftada birkaç gün hafif tempo yürüyüş bile faydalıdır.",
      "Uyku hijyeni için yatmadan önce ekran kullanımını azaltmak ve serin, karanlık bir ortam sağlamak önemlidir."
    ]
  },
  {
    anahtarlar: ["gezi", "seyahat", "şehir", "ülke", "rota", "tatil", "gezilecek", "mekan"],
    cevaplar: [
      "Türkiye'de Kapadokya, benzersiz peri bacaları ve sıcak hava balonlarıyla büyüleyici bir gezi deneyimi sunar.",
      "İstanbul'da tarihi yarımada, farklı medeniyetlerin izlerini aynı sokakta sunar.",
      "Karadeniz yaylaları, sis denizinin üzerinde uzanan doğa yürüyüşleriyle ünlüdür."
    ]
  },
  {
    anahtarlar: ["felsefe", "düşünce", "anlam", "varlık", "ahlak", "erdem", "sorgu", "bilgelik"],
    cevaplar: [
      "Felsefe, sorularla başlamayı ve kesin cevaplar yerine yeni bakış açıları kazanmayı teşvik eder.",
      "Stoacılık, kontrol edebildiğimiz şeylere odaklanmamızı ve dinginlik geliştirmemizi öğütler.",
      "Erdem etiği, iyi yaşamın karakter gelişimiyle mümkün olduğunu savunur."
    ]
  },
  {
    anahtarlar: ["ekonomi", "para", "enflasyon", "borsa", "yatırım", "tasarruf", "bütçe"],
    cevaplar: [
      "Enflasyon, genel fiyat seviyesindeki artıştır ve alım gücünü azaltır. Tasarruf etmek için gelir-gider dengesi kurulmalıdır.",
      "Bütçe planlaması, önce sabit giderleri belirleyip ardından değişken harcamaları gözden geçirmekle başlar.",
      "Uzun vadeli yatırımlarda risk dağılımı sağlamak için portföy çeşitlendirmesi yapılır."
    ]
  },
  {
    anahtarlar: ["kültür", "gelenek", "folklor", "bayram", "yemek", "mutfak", "ritüel"],
    cevaplar: [
      "Anadolu mutfağı zenginliğiyle bilinir; mevsimsel ürünleri koruyan tarifler kuşaktan kuşağa aktarılır.",
      "Nevruz, baharın gelişini kutlayan köklü bir gelenektir; ateş üzerinden atlamak arınmayı simgeler.",
      "Folklorik halk dansları, ait oldukları bölgenin yaşam biçimini ve ritmini yansıtır."
    ]
  },
  {
    anahtarlar: ["spor", "futbol", "basketbol", "voleybol", "atletizm", "olimpiyat", "maç"],
    cevaplar: [
      "Türkiye'de futbol en yaygın izlenen spor dallarındandır; Süper Lig rekabeti oldukça yoğundur.",
      "Milli voleybol takımı son yıllarda Avrupa'da önemli başarılara imza attı.",
      "Atletizm, dayanıklılık ve disiplin gerektirir; koşu, atma ve atlama branşlarını kapsar."
    ]
  },
  {
    anahtarlar: ["matematik", "geometri", "aritmetik", "katsayı", "denklemler", "sayilar", "istatistik"],
    cevaplar: [
      "Matematik, mantıksal akıl yürütmeye dayalı soyut bir dildir. Öklid geometrisi düzlemdeki şekilleri inceler.",
      "İstatistik, veriyi anlamlandırmak için ortalama, medyan, standart sapma gibi ölçüler kullanır.",
      "Denklemleri çözmek, bilinmeyeni yalnız bırakmak için ters işlemleri sırasıyla uygulamayı gerektirir."
    ]
  },
  {
    anahtarlar: ["saat", "zaman", "kaç", "saat kaç", "tarih", "bugün"],
    cevaplar: ["Saat bilgisi", "Tarih bilgisi"],
    ozelIslev: (girdi) => {
      const simdi = new Date();
      if (girdi.includes("tarih") || girdi.includes("bugün")) {
        const tarih = simdi.toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        return `Bugün ${tarih}.`; 
      }
      const saat = simdi.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
      return `Şu an saat ${saat}.`;
    }
  },
  {
    anahtarlar: ["rastgele", "tesadüf", "şans", "oyun", "bir şey söyle"],
    cevaplar: [
      "Bugün yeni bir kelime öğren: 'müspet'. Anlamı olumlu, yararlı demektir.",
      "Kendine küçük bir hedef koy ve başarınca ödüllendir. Hedeflerin kılavuzun olsun.",
      "Şansın hazır olana güldüğünü unutma; hazırlık yap, fırsatları kaçırma."
    ]
  }
];

const fallbackCevaplari = [
  "Sorunu biraz daha açabilir misin? Detay verirsen sana uygun bilgiyi paylaşabilirim.",
  "Henüz o konuda derin bir kaynağım yok, ancak genel çerçeveyi birlikte keşfedebiliriz.",
  "İlginç bir soru! Daha spesifik bir kelime veya bağlam paylaşırsan daha fazla yardımcı olurum."
];

const kelimeAciklamalari = {
  "müspet": "Olumlu, yararlı, pozitif anlamına gelir.",
  "müspetlik": "Pozitif olma durumu, olumlu yaklaşım.",
  "tevazu": "Alçak gönüllülük, gösterişten uzak olma.",
  "feraset": "İleri görüşlülük, sezgi gücüyle doğruyu bulma yeteneği.",
  "meczup": "Kendinden geçmiş, cezbe hâlinde kişi.",
  "münevver": "Aydın, bilgili kimse.",
  "selamet": "Kurtuluş, esenlik, güvenlik.",
  "teşebbüs": "Girişim, bir işe başlama eylemi.",
  "muhakeme": "Yargılama, akıl yürütme yetisi.",
  "inziva": "Kalabalıktan uzaklaşarak tek başına yaşama, tenha yerde kalma.",
  "muvaffak": "Başarılı, başarıya ulaşmış.",
  "intibak": "Uyum sağlama, alışma.",
  "telakki": "Kavrayış, anlayış biçimi.",
  "behemehal": "Mutlaka, kesinlikle.",
  "şiar": "Benimsenen ilke, slogan, alamet.",
  "müteşekkir": "Minnettar, teşekkür borçlu.",
  "müteakip": "Sonraki, devam eden.",
  "latif": "Zarif, hoş, ince düşünceli.",
  "muhterem": "Saygıdeğer, hürmete layık.",
  "şedid": "Şiddetli, sert."
};

function normalize(metin) {
  return metin
    .toLowerCase("tr-TR")
    .replace(/[^a-zçğıöşü0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function kelimeBilgisiAra(girdi) {
  const eslesen = Object.keys(kelimeAciklamalari).find((kelime) => girdi.includes(kelime));
  if (eslesen) {
    const anlam = kelimeAciklamalari[eslesen];
    return `${eslesen} kelimesi: ${anlam}`;
  }
  return null;
}

function puanHesapla(girdi, anahtarlar) {
  let puan = 0;
  for (const anahtar of anahtarlar) {
    if (girdi.includes(anahtar)) {
      puan += anahtar.length;
    }
  }
  return puan;
}

function cevapBul(girdi) {
  const kelimeCevabi = kelimeBilgisiAra(girdi);
  if (kelimeCevabi) {
    return kelimeCevabi;
  }

  let enIyi = { puan: 0, cevap: null };

  for (const bilgi of bilgiBankasi) {
    const puan = puanHesapla(girdi, bilgi.anahtarlar);
    if (puan > enIyi.puan) {
      if (bilgi.ozelIslev) {
        enIyi = { puan, cevap: bilgi.ozelIslev(girdi) };
      } else {
        const cevap = bilgi.cevaplar[Math.floor(Math.random() * bilgi.cevaplar.length)];
        enIyi = { puan, cevap };
      }
    }
  }

  if (enIyi.puan > 0 && enIyi.cevap) {
    return enIyi.cevap;
  }

  return fallbackCevaplari[Math.floor(Math.random() * fallbackCevaplari.length)];
}

function mesajOlustur(tur, metin) {
  const satir = document.createElement("div");
  satir.className = `mesaj ${tur}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = tur === "kullanici" ? "S" : "KA";

  const icerik = document.createElement("div");
  icerik.className = "icerik";
  icerik.textContent = metin;

  satir.appendChild(avatar);
  satir.appendChild(icerik);
  mesajlarKutusu.appendChild(satir);
  mesajlarKutusu.scrollTop = mesajlarKutusu.scrollHeight;
}

function sistemMesaji(metin) {
  mesajOlustur("yapayzeka", metin);
}

function kullaniciMesaji(metin) {
  mesajOlustur("kullanici", metin);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const girdiHam = kullaniciMesajiInput.value.trim();
  if (!girdiHam) {
    return;
  }

  kullaniciMesaji(girdiHam);
  kullaniciMesajiInput.value = "";

  const temizGirdi = normalize(girdiHam);
  const cevap = cevapBul(temizGirdi);

  setTimeout(() => {
    sistemMesaji(cevap);
  }, 250);
});

window.addEventListener("load", () => {
  sistemMesaji("Merhaba! Kelime Atlası'na hoş geldin. Türkçe sorularını, merak ettiğin kavramları veya kelime açıklamalarını paylaşabilirsin.");
});
