const govde = document.body;
const temaDugmesi = document.querySelector('.tema-dugmesi');
const TEMALAR = {
  LIGHT: 'theme-light',
  DARK: 'theme-dark',
};

function temaUygula(tema) {
  if (!govde) return;
  govde.classList.remove(TEMALAR.LIGHT, TEMALAR.DARK);
  govde.classList.add(tema);
  if (temaDugmesi) {
    temaDugmesi.setAttribute('aria-pressed', tema === TEMALAR.DARK ? 'true' : 'false');
  }
  localStorage.setItem('minance-tema', tema);
}

function temaDegistir() {
  const mevcutTema = govde.classList.contains(TEMALAR.DARK) ? TEMALAR.DARK : TEMALAR.LIGHT;
  const yeniTema = mevcutTema === TEMALAR.DARK ? TEMALAR.LIGHT : TEMALAR.DARK;
  temaUygula(yeniTema);
}

function baslangicTemasiniBelirle() {
  const kayitliTema = localStorage.getItem('minance-tema');
  if (kayitliTema === TEMALAR.LIGHT || kayitliTema === TEMALAR.DARK) {
    temaUygula(kayitliTema);
    return;
  }

  const sistemKoyuMod = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  temaUygula(sistemKoyuMod ? TEMALAR.DARK : TEMALAR.LIGHT);
}

if (temaDugmesi) {
  temaDugmesi.addEventListener('click', temaDegistir);
}

baslangicTemasiniBelirle();
