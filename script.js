window.onload = () => {
  const girisEkrani = document.getElementById("girisEkrani");
  const anaEkran = document.getElementById("anaEkran");
  const kullaniciAdi = document.getElementById("kAdi");
  const profilGorsel = document.getElementById("profilGorsel");

  if (girisEkrani && anaEkran && kullaniciAdi && profilGorsel) {
    const k = localStorage.getItem("kullaniciAdi");
    const p = localStorage.getItem("profilResmi");

    if (k && p) {
      girisEkrani.style.display = "none";
      anaEkran.classList.remove("gizli");
      kullaniciAdi.innerText = k;
      profilGorsel.src = p;
      videolariYukle();
    }
  }

  telefonModeliniBaslat();
};

function telefonModeliniBaslat() {
  const telefon = document.getElementById("telefonModel");
  const sahne = document.getElementById("telefonSahne");
  const gucButonu = document.getElementById("gucButonu");

  if (!telefon || !sahne || !gucButonu) {
    return;
  }

  let rotX = -12;
  let rotY = 20;
  let surukleniyor = false;
  let baslangic = { x: 0, y: 0 };

  const uygulaTransform = () => {
    telefon.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };

  const koordinatOrtalama = (dokunuslar) => {
    const kullanilan = Math.min(dokunuslar.length, 3);
    let toplamX = 0;
    let toplamY = 0;
    for (let i = 0; i < kullanilan; i += 1) {
      toplamX += dokunuslar[i].clientX;
      toplamY += dokunuslar[i].clientY;
    }
    return {
      x: toplamX / kullanilan,
      y: toplamY / kullanilan,
    };
  };

  sahne.addEventListener("mousedown", (event) => {
    surukleniyor = true;
    baslangic = { x: event.clientX, y: event.clientY };
  });

  window.addEventListener("mousemove", (event) => {
    if (!surukleniyor) {
      return;
    }
    const deltaX = event.clientX - baslangic.x;
    const deltaY = event.clientY - baslangic.y;
    baslangic = { x: event.clientX, y: event.clientY };
    rotY += deltaX * 0.4;
    rotX -= deltaY * 0.4;
    uygulaTransform();
  });

  window.addEventListener("mouseup", () => {
    surukleniyor = false;
  });

  sahne.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length < 3) {
        surukleniyor = false;
        return;
      }
      surukleniyor = true;
      baslangic = koordinatOrtalama(event.touches);
    },
    { passive: true }
  );

  sahne.addEventListener(
    "touchmove",
    (event) => {
      if (!surukleniyor || event.touches.length < 3) {
        return;
      }
      event.preventDefault();
      const merkez = koordinatOrtalama(event.touches);
      const deltaX = merkez.x - baslangic.x;
      const deltaY = merkez.y - baslangic.y;
      baslangic = merkez;
      rotY += deltaX * 0.4;
      rotX -= deltaY * 0.4;
      uygulaTransform();
    },
    { passive: false }
  );

  sahne.addEventListener("touchend", () => {
    surukleniyor = false;
  });

  gucButonu.addEventListener("click", () => {
    const kapali = telefon.classList.toggle("is-off");
    gucButonu.setAttribute("aria-pressed", String(kapali));
  });
}

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
