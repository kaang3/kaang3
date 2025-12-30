window.onload = () => {
  initProfil();
  baglantilariKur();
  videolariYukle();
};

function initProfil() {
  const k = localStorage.getItem("kullaniciAdi");
  const p = localStorage.getItem("profilResmi");

  if (k && p) {
    document.getElementById("girisEkrani").classList.add("gizli");
    document.getElementById("anaEkran").classList.remove("gizli");
    setProfilBilgisi(k, p);
  }
}

function setProfilBilgisi(kullanici, foto) {
  document.getElementById("kAdi").innerText = kullanici;
  document.getElementById("kAdiKopya").innerText = kullanici;
  document.getElementById("profilGorsel").src = foto;
  document.getElementById("profilGorselKopya").src = foto;
}

function girisYap() {
  const k = document.getElementById("kullaniciAdi").value.trim();
  const p = document.getElementById("profilResmi").files[0];

  if (!k || !p) {
    alert("Takma ad ve profil görseli olmadan giremeyiz!");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("kullaniciAdi", k);
    localStorage.setItem("profilResmi", reader.result);
    setProfilBilgisi(k, reader.result);
    document.getElementById("girisEkrani").classList.add("gizli");
    document.getElementById("anaEkran").classList.remove("gizli");
  };
  reader.readAsDataURL(p);
}

function baglantilariKur() {
  document.getElementById("profilTrigger").onclick = () => {
    document.getElementById("profilGuncelle").click();
  };

  document.getElementById("profilGuncelle").onchange = (e) => {
    const dosya = e.target.files[0];
    if (!dosya) return;
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("profilResmi", reader.result);
      setProfilBilgisi(localStorage.getItem("kullaniciAdi") || "Misafir", reader.result);
    };
    reader.readAsDataURL(dosya);
  };

  document.getElementById("arama").addEventListener("input", videolariYukle);

  const fab = document.getElementById("actionFab");
  const sheet = document.getElementById("actionSheet");
  const sheetKapat = document.getElementById("sheetKapat");

  fab.onclick = () => {
    sheet.classList.toggle("gizli");
    fab.animate([{ transform: "scale(1)" }, { transform: "scale(0.92)" }, { transform: "scale(1)" }], { duration: 180 });
  };

  sheetKapat.onclick = () => sheet.classList.add("gizli");
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) sheet.classList.add("gizli");
  });
}

function goAnaSayfa() {
  document.getElementById("hesabim").classList.add("gizli");
  document.getElementById("anaSayfa").classList.remove("gizli");
}

function goHesabim() {
  document.getElementById("anaSayfa").classList.add("gizli");
  document.getElementById("hesabim").classList.remove("gizli");
}

function videoYukle() {
  const dosya = document.getElementById("videoDosyasi").files[0];
  const baslik = document.getElementById("videoBaslik").value.trim();
  const kullanici = localStorage.getItem("kullaniciAdi");

  if (!kullanici) {
    alert("Önce giriş yapmalısın!");
    return;
  }

  if (!dosya || !baslik) {
    alert("Video dosyası ve başlık eksik!");
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
  const arama = document.getElementById("arama").value.toLowerCase();
  const liste = document.getElementById("videoListe");
  const hesap = document.getElementById("videolar");
  const kullanici = localStorage.getItem("kullaniciAdi");

  liste.innerHTML = "";
  hesap.innerHTML = "";

  videolar
    .filter((v) => v.baslik.toLowerCase().includes(arama))
    .forEach((v, i) => {
      const kart = document.createElement("div");
      kart.className = "video";
      kart.innerHTML = `
        <video src="${v.url}" controls></video>
        <div class="video-icerik">
          <p class="video-baslik">${v.baslik}</p>
          <p class="video-sahip">${v.sahip || "Anonim"}</p>
        </div>
      `;

      liste.appendChild(kart.cloneNode(true));

      if (v.sahip === kullanici) {
        const kendiKart = kart.cloneNode(true);
        const silBtn = document.createElement("button");
        silBtn.className = "sil-btn";
        silBtn.innerText = "Sil";
        silBtn.onclick = () => {
          videolar.splice(i, 1);
          localStorage.setItem("videolar", JSON.stringify(videolar));
          videolariYukle();
        };
        kendiKart.appendChild(silBtn);
        hesap.appendChild(kendiKart);
      }
    });

  document.getElementById("videoSayisi").innerText = videolar.length;
}
