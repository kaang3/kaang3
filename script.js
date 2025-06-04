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
