const display = document.getElementById("gosterge");
const historyEl = document.getElementById("gecmis");
const tuslar = document.querySelector(".tuslar");
const esittir = document.getElementById("esittir");
const sekmeButonlari = document.querySelectorAll(".sekme");
const paneller = document.querySelectorAll(".panel");
const metin = document.getElementById("metin");
const sonuc = document.getElementById("sonuc");
const cevirBtn = document.getElementById("cevir");
const temizMetin = document.getElementById("temizMetin");
const degistirYonBtn = document.getElementById("degistirYon");
const durum = document.getElementById("durum");
const yonRadio = document.querySelectorAll('input[name="yon"]');

let mevcut = "0";
let gecmis = "";
let operator = null;
let yeniGiris = false;

// ---------- Sekme kontrolü ----------
function sekmeDegistir(hedef) {
  sekmeButonlari.forEach((btn) => {
    const aktif = btn.dataset.sekme === hedef;
    btn.classList.toggle("aktif", aktif);
  });
  paneller.forEach((panel) => {
    panel.classList.toggle("gorunur", panel.id === hedef);
  });
}

sekmeButonlari.forEach((btn) => {
  btn.addEventListener("click", () => sekmeDegistir(btn.dataset.sekme));
});

function goster() {
  display.textContent = mevcut;
  historyEl.textContent = gecmis;
}

function temizle() {
  mevcut = "0";
  gecmis = "";
  operator = null;
  yeniGiris = false;
  goster();
}

function rakamEkle(rakam) {
  if (yeniGiris) {
    mevcut = rakam;
    yeniGiris = false;
  } else {
    mevcut = mevcut === "0" ? rakam : mevcut + rakam;
  }
  goster();
}

function virgulEkle() {
  if (yeniGiris) {
    mevcut = "0.";
    yeniGiris = false;
  } else if (!mevcut.includes(".")) {
    mevcut += ".";
  }
  goster();
}

function islemSec(yeniOperator) {
  if (operator && !yeniGiris) {
    hesapla();
  }
  gecmis = `${mevcut} ${yeniOperator}`;
  operator = yeniOperator;
  yeniGiris = true;
  goster();
}

function backspace() {
  if (yeniGiris) return;
  mevcut = mevcut.length > 1 ? mevcut.slice(0, -1) : "0";
  goster();
}

function hesapla() {
  if (!operator) return;
  const onceki = parseFloat(gecmis);
  const simdiki = parseFloat(mevcut);

  let sonuc;
  switch (operator) {
    case "+":
      sonuc = onceki + simdiki;
      break;
    case "-":
      sonuc = onceki - simdiki;
      break;
    case "*":
      sonuc = onceki * simdiki;
      break;
    case "/":
      if (simdiki === 0) {
        display.textContent = "∞";
        historyEl.innerHTML = `<span class=\"hata\">0'a bölünmez</span>`;
        operator = null;
        mevcut = "0";
        return;
      }
      sonuc = onceki / simdiki;
      break;
    default:
      return;
  }

  mevcut = String(Number(sonuc.toFixed(12)));
  gecmis = "";
  operator = null;
  yeniGiris = true;
  goster();
}

function tusTikla(e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  const sayi = btn.getAttribute("data-sayi");
  const op = btn.getAttribute("data-operator");
  const aksiyon = btn.getAttribute("data-aksiyon");

  if (sayi !== null) {
    rakamEkle(sayi);
  } else if (op) {
    islemSec(op);
  } else if (aksiyon === "temizle") {
    temizle();
  } else if (aksiyon === "sil") {
    backspace();
  } else if (aksiyon === "virgul") {
    virgulEkle();
  }
}

function klavye(e) {
  if (/\d/.test(e.key)) {
    rakamEkle(e.key);
  } else if (["+", "-", "*", "/"].includes(e.key)) {
    islemSec(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    hesapla();
  } else if (e.key === "Backspace") {
    backspace();
  } else if (e.key === "." || e.key === ",") {
    virgulEkle();
  } else if (e.key === "Escape") {
    temizle();
  }
}

tuslar.addEventListener("click", tusTikla);
esittir.addEventListener("click", hesapla);
document.addEventListener("keydown", klavye);

// ---------- Çeviri ----------
function seciliYon() {
  const checked = [...yonRadio].find((r) => r.checked);
  return checked ? checked.value : "tr-en";
}

function tahminYon(metinDegeri) {
  const trChars = /[çğıöşüİ]/i;
  const enChars = /[a-z]/i;
  if (trChars.test(metinDegeri) && !/[wqx]/i.test(metinDegeri)) return "tr-en";
  if (enChars.test(metinDegeri) && !trChars.test(metinDegeri)) return "en-tr";
  return "tr-en";
}

async function ceviriYap() {
  const giris = metin.value.trim();
  if (!giris) {
    durum.textContent = "Metin bekleniyor.";
    sonuc.textContent = "";
    return;
  }

  const yon = seciliYon();
  const otomatikYon = yon === "auto" ? tahminYon(giris) : yon;
  const [source, target] = otomatikYon === "tr-en" ? ["tr", "en"] : ["en", "tr"];

  durum.textContent = `Çeviriliyor (${source.toUpperCase()} → ${target.toUpperCase()})...`;
  sonuc.textContent = "";

  try {
    const yanit = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: giris,
        source,
        target,
        format: "text"
      })
    });

    if (!yanit.ok) {
      throw new Error("Servis hatası");
    }

    const data = await yanit.json();
    sonuc.textContent = data.translatedText || "Çeviri alınamadı.";
    durum.textContent = "Hazır";
  } catch (err) {
    console.error(err);
    durum.textContent = "Çeviri başarısız. Tekrar dene.";
    sonuc.textContent = "Çeviri servisine ulaşılamadı.";
  }
}

cevirBtn.addEventListener("click", ceviriYap);

temizMetin.addEventListener("click", () => {
  metin.value = "";
  sonuc.textContent = "";
  durum.textContent = "Hazır";
  metin.focus();
});

degistirYonBtn.addEventListener("click", () => {
  const suanki = seciliYon();
  const yeni = suanki === "tr-en" ? "en-tr" : "tr-en";
  [...yonRadio].forEach((r) => {
    r.checked = r.value === yeni;
  });
});

metin.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "enter") {
    ceviriYap();
  }
});

metin.addEventListener("input", () => {
  durum.textContent = "Hazır";
});

// Başlangıç
sekmeDegistir("ceviri");
temizle();
