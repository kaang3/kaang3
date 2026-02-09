const glow = document.getElementById('cursorGlow');
const interactiveEls = document.querySelectorAll('.interactive');

window.addEventListener('pointermove', (event) => {
  const { clientX, clientY } = event;

  glow.style.left = `${clientX}px`;
  glow.style.top = `${clientY}px`;

  const xRatio = (clientX / window.innerWidth - 0.5) * 2;
  const yRatio = (clientY / window.innerHeight - 0.5) * 2;

  interactiveEls.forEach((el) => {
    const depth = Number(el.dataset.depth || 10);
    const moveX = -(xRatio * depth);
    const moveY = -(yRatio * depth);
    el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
});

window.addEventListener('mouseleave', () => {
  interactiveEls.forEach((el) => {
    el.style.transform = 'translate3d(0, 0, 0)';
  });
});
