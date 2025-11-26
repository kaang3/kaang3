window.onload = () => {
  const k = localStorage.getItem("kullaniciAdi");
  const p = localStorage.getItem("profilResmi");

  if (k && p) {
    document.getElementById("girisEkrani").style.display = "none";
    document.getElementById("anaEkran").classList.remove("gizli");
    document.getElementById("kAdi").innerText = k;
    document.getElementById("profilGorsel").src = p;
    videolariYukle();
  }
};

function girisYap() {
  const k = document.getElementById("kullaniciAdi").value.trim();
  const p = document.getElementById("profilResmi").files[0];

  if (!k || !p) {
    alert("Ad ve profil resmi gerekli kaptan!");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("kullaniciAdi", k);
    localStorage.setItem("profilResmi", reader.result);
    location.reload();
  };
  reader.readAsDataURL(p);
}

function goAnaSayfa() {
  document.getElementById("hesabim").classList.add("gizli");
  document.getElementById("anaSayfa").style.display = "block";
}

function goHesabim() {
  document.getElementById("anaSayfa").style.display = "none";
  document.getElementById("hesabim").classList.remove("gizli");
}

function videoYukle() {
  const dosya = document.getElementById("videoDosyasi").files[0];
  const baslik = document.getElementById("videoBaslik").value;
  const kullanici = localStorage.getItem("kullaniciAdi");

  if (!dosya || !baslik) {
    alert("Video ve başlık eksik!");
    return;
  }

  const videoURL = URL.createObjectURL(dosya);
  const video = { baslik: baslik, url: videoURL, sahip: kullanici };

  const mevcut = JSON.parse(localStorage.getItem("videolar") || "[]");
  mevcut.push(video);
  localStorage.setItem("videolar", JSON.stringify(mevcut));
  videolariYukle();

  document.getElementById("videoDosyasi").value = "";
  document.getElementById("videoBaslik").value = "";
}

function videolariYukle() {
  const videolar = JSON.parse(localStorage.getItem("videolar") || "[]");
  const liste = document.getElementById("videoListe");
  const hesap = document.getElementById("videolar");
  const kullanici = localStorage.getItem("kullaniciAdi");

  liste.innerHTML = "";
  hesap.innerHTML = "";

  videolar.forEach((v, i) => {
    const div = document.createElement("div");
    div.className = "video";
    div.innerHTML = `
      <video src="${v.url}" controls></video>
      <p>${v.baslik}</p>
    `;
    // Ana sayfaya herkesin videoları
    liste.appendChild(div.cloneNode(true));

    // Sadece kendi videolarına silme butonu
    if (v.sahip === kullanici) {
      const divHesap = div.cloneNode(true);
      const silBtn = document.createElement("button");
      silBtn.innerText = "❌";
      silBtn.onclick = () => {
        videolar.splice(i, 1);
        localStorage.setItem("videolar", JSON.stringify(videolar));
        videolariYukle();
      };
      divHesap.appendChild(silBtn);
      hesap.appendChild(divHesap);
    }
  });
}

async function soruSor() {
  const apiKey = document.getElementById("apiKey").value.trim();
  const soru = document.getElementById("soruMetni").value.trim();
  const cevapKutusu = document.getElementById("aiCevap");

  if (!apiKey || !soru) {
    cevapKutusu.textContent = "Anahtar ve soru gerekli.";
    return;
  }

  cevapKutusu.textContent = "Bekleniyor...";

  try {
    const yanit = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: soru }],
        temperature: 0.7,
      }),
    });

    if (!yanit.ok) {
      const hata = await yanit.json();
      throw new Error(hata.error?.message || "API hatası");
    }

    const veri = await yanit.json();
    const mesaj = veri?.choices?.[0]?.message?.content?.trim();
    cevapKutusu.textContent = mesaj || "Cevap alınamadı.";
  } catch (err) {
    console.error(err);
    cevapKutusu.textContent = "Bağlantı kurulamadı. Anahtarını ve interneti kontrol et.";
  }
}
