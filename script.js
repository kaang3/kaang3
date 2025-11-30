const enterStoreBtn = document.getElementById('enterStore');
const storeSection = document.getElementById('store');
const productButtons = document.querySelectorAll('[data-product]');
const summaryProduct = document.getElementById('summaryProduct');
const summaryPrice = document.getElementById('summaryPrice');
const hiddenProduct = document.getElementById('urun');
const hiddenPrice = document.getElementById('fiyat');

function scrollToStore() {
  storeSection.scrollIntoView({ behavior: 'smooth' });
}

enterStoreBtn?.addEventListener('click', scrollToStore);

productButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const { product, price } = btn.dataset;
    summaryProduct.textContent = product;
    summaryPrice.textContent = price;
    hiddenProduct.value = product;
    hiddenPrice.value = price;
    scrollToStore();
  });
});
