const sohbet = document.getElementById("sohbet");
const soruFormu = document.getElementById("soruFormu");
const soruGirdisi = document.getElementById("soruGirdisi");
const temizleBtn = document.getElementById("temizleBtn");
const oturumAcBtn = document.getElementById("oturumAcBtn");
const selamlama = document.getElementById("selamlama");
const modalKaplama = document.getElementById("modalKaplama");
const modalKaydet = document.getElementById("modalKaydet");
const modalKapat = document.getElementById("modalKapat");
const isimInput = document.getElementById("isim");
const soyisimInput = document.getElementById("soyisim");

const state = {
  kullanici: null,
};

function yukleKullanici() {
  const kayitli = localStorage.getItem("mathmentor-kullanici");
  if (kayitli) {
    state.kullanici = JSON.parse(kayitli);
    selamlama.textContent = `Merhaba ${state.kullanici.ad}!`;
    oturumAcBtn.textContent = "Hesap";
  }
}

function kaydetKullanici(ad, soyad) {
  state.kullanici = { ad, soyad };
  localStorage.setItem("mathmentor-kullanici", JSON.stringify(state.kullanici));
  selamlama.textContent = `Merhaba ${ad}!`;
  oturumAcBtn.textContent = "Hesap";
}

function modalAc() {
  modalKaplama.classList.remove("hidden");
  isimInput.focus();
}

function modalKapatFn() {
  modalKaplama.classList.add("hidden");
  isimInput.value = "";
  soyisimInput.value = "";
}

function mesajEkle(metin, kim = "asistan") {
  const div = document.createElement("div");
  div.className = `mesaj ${kim}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = kim === "kullanici" ? (state.kullanici?.ad?.[0] || "S") : "AI";

  const icerik = document.createElement("div");
  icerik.className = "icerik";
  icerik.textContent = metin;

  div.appendChild(avatar);
  div.appendChild(icerik);
  sohbet.appendChild(div);
  sohbet.scrollTop = sohbet.scrollHeight;
}

function temizleSohbet() {
  sohbet.innerHTML = "";
  mesajEkle("Merhaba! MathMentor AI burada. Her seviye matematik sorusunu sorabilirsin.");
}

function isGreeting(metin) {
  return /(merhaba|selam|naber|nasılsın|nasilsin|hello|hi)/i.test(metin);
}

function parseFractionWords(text) {
  return text.replace(/(\d+)'?(?:te|ta|de|da)\s*(\d+)/gi, (_, payda, pay) => `(${pay}/${payda})`);
}

function parseArithmeticWords(text) {
  return text
    .replace(/çarpı|carpi|x|×/gi, "*")
    .replace(/bölü|bolu|÷/gi, "/")
    .replace(/artı|arti/gi, "+")
    .replace(/eksi/gi, "-")
    .replace(/üzeri|kare|kuvveti/gi, "**")
    .replace(/,/g, ".");
}

function cozumleSozelProblem(soru) {
  const sayilar = [...soru.matchAll(/-?\d+(?:,\d+)?/g)].map((m) => parseFloat(m[0].replace(",", ".")));
  if (sayilar.length >= 2) {
    const [ilkg, ikinci, ucuncu] = sayilar;
    if (/yedi|harcadi|kaldı|kaldı\?|kac kald/i.test(soru)) {
      return ilkg - (ucuncu ?? ikinci);
    }
    if (/aldı|ekledi|kazandı|daha aldı|toplam/i.test(soru)) {
      return ilkg + (ucuncu ?? ikinci);
    }
  }
  if (/kaç tane 1/.test(soru) && sayilar.length) {
    return sayilar[0];
  }
  if (/katı/.test(soru) && sayilar.length >= 2) {
    return sayilar[0] * sayilar[1];
  }
  return null;
}

function evaluateExpression(input) {
  const temiz = parseArithmeticWords(parseFractionWords(input));
  const replaced = temiz.replace(/(\d)\.\(/g, "$1*(");
  if (!/^[0-9+\-*/().^\s]*$/.test(replaced)) {
    return null;
  }
  try {
    // eslint-disable-next-line no-new-func
    const sonuc = new Function(`return ${replaced}`)();
    if (Number.isFinite(sonuc)) {
      return sonuc;
    }
  } catch (e) {
    return null;
  }
  return null;
}

function yanitOlustur(soruHam) {
  const soru = soruHam.trim();
  if (!soru) return "";

  if (isGreeting(soru)) {
    const ad = state.kullanici?.ad ? `, ${state.kullanici.ad}` : "";
    return `Selam${ad}! Matematikle ilgili neyi merak ediyorsun?`;
  }

  const problemSonucu = cozumleSozelProblem(soru.toLowerCase());
  if (problemSonucu !== null) {
    return `Sonuç: ${problemSonucu}`;
  }

  const hesapSonucu = evaluateExpression(soru.toLowerCase());
  if (hesapSonucu !== null) {
    return `İşlemin cevabı: ${hesapSonucu}`;
  }

  return "Bu soruyu tam anlayamadım. Lütfen matematik sorunu biraz daha net yaz.";
}

soruFormu.addEventListener("submit", (e) => {
  e.preventDefault();
  const soru = soruGirdisi.value.trim();
  if (!soru) return;

  mesajEkle(soru, "kullanici");
  const yanit = yanitOlustur(soru);
  mesajEkle(yanit, "asistan");
  soruGirdisi.value = "";
  soruGirdisi.focus();
});

temizleBtn.addEventListener("click", temizleSohbet);

oturumAcBtn.addEventListener("click", modalAc);
modalKapat.addEventListener("click", modalKapatFn);
modalKaplama.addEventListener("click", (e) => {
  if (e.target === modalKaplama) modalKapatFn();
});

modalKaydet.addEventListener("click", () => {
  const ad = isimInput.value.trim();
  const soyad = soyisimInput.value.trim();
  if (!ad || !soyad) {
    alert("Lütfen ad ve soyad gir.");
    return;
  }
  kaydetKullanici(ad, soyad);
  modalKapatFn();
});

yukleKullanici();
temizleSohbet();
