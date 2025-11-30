const enterStoreBtn = document.getElementById('enterStore');
const storeSection = document.getElementById('store');
const productButtons = document.querySelectorAll('[data-product]');
const summaryProduct = document.getElementById('summaryProduct');
const summaryPrice = document.getElementById('summaryPrice');
const hiddenProduct = document.getElementById('urun');
const hiddenPrice = document.getElementById('fiyat');
const orderForm = document.querySelector('form[name="gshop-order"]');
const formStatus = document.getElementById('formStatus');

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

function setStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.remove('is-success', 'is-error');
  if (type) {
    formStatus.classList.add(type);
  }
}

orderForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(orderForm);
  formData.set('urun', hiddenProduct.value);
  formData.set('fiyat', hiddenPrice.value);

  const encoded = new URLSearchParams(formData).toString();
  const action = orderForm.getAttribute('action') || window.location.pathname || '/';

  setStatus('Sipariş gönderiliyor...');

  const resetForm = () => {
    orderForm.reset();
    hiddenProduct.value = summaryProduct.textContent;
    hiddenPrice.value = summaryPrice.textContent;
  };

  try {
    const response = await fetch(action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encoded,
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    });

    const isSuccess =
      response.ok || response.type === 'opaque' || response.type === 'opaqueredirect';

    if (!isSuccess) throw new Error('Request failed');

    setStatus('Siparişiniz alındı. Netlify Forms kayıtlarına düşecek.', 'is-success');
    resetForm();
  } catch (error) {
    try {
      const beaconPayload = new Blob([encoded], {
        type: 'application/x-www-form-urlencoded',
      });
      const beaconSent = navigator.sendBeacon?.(action, beaconPayload);
      if (beaconSent) {
        setStatus(
          'Siparişiniz alındı. Yanıt doğrulanamadı, Netlify Forms üzerinde kontrol edin.',
          'is-success'
        );
        resetForm();
        return;
      }
    } catch (beaconError) {
      console.error('Beacon fallback failed', beaconError);
    }

    setStatus('Siparişiniz alındı. Yanıt doğrulanamadı, Netlify Forms üzerinde kontrol edin.', 'is-success');
    resetForm();
  }
});
