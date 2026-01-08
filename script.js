const enterStoreBtn = document.getElementById('enterStore');
const storeSection = document.getElementById('store');
const productButtons = document.querySelectorAll('[data-product]');
const summaryProduct = document.getElementById('summaryProduct');
const summaryPrice = document.getElementById('summaryPrice');
const hiddenProduct = document.getElementById('urun');
const hiddenPrice = document.getElementById('fiyat');
const orderForm = document.querySelector('form[name="gshop-order"]');
const formStatus = document.getElementById('formStatus');
const checkoutSection = document.getElementById('checkout');
const submitBtn = document.getElementById('submitBtn');
const selectionHint = document.getElementById('selectionHint');
const hero = document.querySelector('.hero');

function scrollToStore() {
  storeSection.scrollIntoView({ behavior: 'smooth' });
}

enterStoreBtn?.addEventListener('click', scrollToStore);

function activateCheckout(product, price) {
  summaryProduct.textContent = product;
  summaryPrice.textContent = price;
  hiddenProduct.value = product;
  hiddenPrice.value = price;

  checkoutSection?.classList.remove('is-locked');
  submitBtn?.removeAttribute('disabled');

  if (selectionHint) {
    selectionHint.textContent = 'Sepete eklendi';
    selectionHint.classList.add('badge--active');
  }
}

productButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const { product, price } = btn.dataset;
    activateCheckout(product, price);
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

  if (!hiddenProduct.value || !hiddenPrice.value) {
    setStatus('Önce ürünü seçin.', 'is-error');
    return;
  }

  // Ensure Netlify recognizes the form when posting via fetch
  if (!formData.get('form-name')) {
    formData.set('form-name', orderForm.getAttribute('name') || 'gshop-order');
  }

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
    });

    if (!response.ok) {
      throw new Error('Form kaydedilemedi');
    }

    setStatus('Siparişiniz alındı. Netlify Forms kayıtlarına düşecek.', 'is-success');
    resetForm();
  } catch (error) {
    const fallbackSent = navigator.sendBeacon
      ? navigator.sendBeacon(action, new Blob([encoded], { type: 'application/x-www-form-urlencoded' }))
      : false;

    if (fallbackSent) {
      setStatus('Siparişiniz alındı. Netlify Forms kayıtlarına düşecek.', 'is-success');
      resetForm();
      return;
    }

    setStatus('Gönderilemedi. Lütfen yeniden deneyin.', 'is-error');
  }
});

function updateHeroMotion(x, y) {
  if (!hero) return;
  const rect = hero.getBoundingClientRect();
  const relX = (x - rect.left) / rect.width;
  const relY = (y - rect.top) / rect.height;
  const tiltX = (relY - 0.5) * 6;
  const tiltY = (relX - 0.5) * -6;

  hero.style.setProperty('--tilt-x', `${tiltX}deg`);
  hero.style.setProperty('--tilt-y', `${tiltY}deg`);
  hero.style.setProperty('--glow-x', `${relX * 100}%`);
  hero.style.setProperty('--glow-y', `${relY * 100}%`);
}

if (hero) {
  hero.addEventListener('pointermove', (event) => {
    updateHeroMotion(event.clientX, event.clientY);
  });

  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--tilt-x', '0deg');
    hero.style.setProperty('--tilt-y', '0deg');
    hero.style.setProperty('--glow-x', '50%');
    hero.style.setProperty('--glow-y', '50%');
  });
}
