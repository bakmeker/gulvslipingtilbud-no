/* ============================================
   FAQ Accordion
   ============================================ */
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all others
      items.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
})();
