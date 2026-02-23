/* ============================================
   Navigation – Mobile Toggle
   ============================================ */
(function () {
  const toggle = document.querySelector('.cs-toggle');
  const wrapper = document.querySelector('.cs-ul-wrapper');

  if (!toggle || !wrapper) return;

  toggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    this.classList.toggle('cs-active');
    wrapper.classList.toggle('cs-open');
    document.body.style.overflow = !expanded ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !wrapper.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('cs-active');
      wrapper.classList.remove('cs-open');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('cs-active');
      wrapper.classList.remove('cs-open');
      document.body.style.overflow = '';
    }
  });
})();
