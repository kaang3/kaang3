const display = document.getElementById("gosterge");
const historyEl = document.getElementById("gecmis");
const tuslar = document.querySelector(".tuslar");
const esittir = document.getElementById("esittir");

let mevcut = "0";
let gecmis = "";
let operator = null;
let yeniGiris = false;

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

temizle();
