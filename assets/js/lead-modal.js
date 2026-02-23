/* ============================================
   Lead Modal – Multi-step wizard (5 steps)
   Gulvslipingtilbud.no
   ============================================ */
(function () {

  const STORAGE_KEY  = 'gulvsliping_lead';
  const TOTAL_STEPS  = 5;
  const STEP_TIMERS  = { 1: 30, 2: 25, 3: 20, 4: 15, 5: 10 };

  // DOM refs
  const overlay      = document.getElementById('lead-modal');
  const closeBtn     = document.querySelector('.modal-close');
  const triggers     = document.querySelectorAll('[data-modal="lead"]');
  const stepsEls     = document.querySelectorAll('.modal-step');
  const progressFill = document.querySelector('.modal-progress-fill');
  const countdownEl  = document.querySelector('.modal-countdown-text');
  const successEl    = document.querySelector('.modal-success');
  const formBody     = document.querySelector('.modal-form-body');

  if (!overlay) return;

  // Form state
  const formState = {
    step: 1,
    description: '',
    address: '',
    name: '',
    email: '',
    phone: ''
  };

  // Load any persisted data
  loadData();

  // ── Open / Close ──────────────────────────────
  function openModal() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    restoreInputs();
    goToStep(1);
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    saveData();
  }

  triggers.forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeModal();
      return;
    }
    if (e.key === 'Enter' && overlay.classList.contains('is-open')) {
      // Don't trigger next from textarea
      if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') return;
      handleNext();
    }
  });

  // ── Steps ─────────────────────────────────────
  function goToStep(n) {
    formState.step = n;

    stepsEls.forEach(function (el) {
      el.classList.remove('is-active');
    });

    var target = document.querySelector('.modal-step[data-step="' + n + '"]');
    if (target) {
      target.classList.add('is-active');
      // Focus first input/textarea in step
      var firstInput = target.querySelector('input, textarea');
      if (firstInput) {
        setTimeout(function () { firstInput.focus(); }, 50);
      }
    }

    // Progress bar
    var pct = Math.round((n / TOTAL_STEPS) * 100);
    if (progressFill) progressFill.style.width = pct + '%';

    // Fake timer text
    if (countdownEl) {
      countdownEl.textContent = STEP_TIMERS[n] + ' sekunder gjenstår';
    }

    // Back button
    var backBtn = document.querySelector('.btn-modal-back');
    if (backBtn) backBtn.style.display = n === 1 ? 'none' : '';

    // Next button label
    var nextBtn = document.querySelector('.btn-modal-next');
    if (nextBtn) nextBtn.textContent = n === TOTAL_STEPS ? 'Kom i gang' : 'Neste';
  }

  // ── Next / Back ────────────────────────────────
  document.addEventListener('click', function (e) {
    if (e.target.matches('.btn-modal-next')) {
      handleNext();
    }
    if (e.target.matches('.btn-modal-back')) {
      if (formState.step > 1) {
        saveStepData(formState.step);
        goToStep(formState.step - 1);
      }
    }
  });

  function handleNext() {
    if (!validateStep(formState.step)) return;
    saveStepData(formState.step);
    if (formState.step < TOTAL_STEPS) {
      goToStep(formState.step + 1);
    } else {
      submitForm();
    }
  }

  // ── Character counter ─────────────────────────
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'modal-description') {
      var charCount = document.querySelector('.modal-char-count');
      if (charCount) {
        charCount.textContent = e.target.value.length + '/2500';
      }
      formState.description = e.target.value;
    }
  });

  // ── Validation ────────────────────────────────
  function validateStep(step) {
    clearErrors();

    if (step === 2) {
      var addr = document.getElementById('modal-address');
      if (!addr || addr.value.trim().length < 3) {
        showInputError(addr, 'Skriv inn adressen din for å gå videre.');
        return false;
      }
    }

    if (step === 3) {
      var name = document.getElementById('modal-name');
      if (!name || name.value.trim().length < 2) {
        showInputError(name, 'Skriv inn ditt fulle navn.');
        return false;
      }
    }

    if (step === 4) {
      var email = document.getElementById('modal-email');
      if (!email || !email.value.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showInputError(email, 'Skriv inn en gyldig e-postadresse.');
        return false;
      }
    }

    if (step === 5) {
      var phone = document.getElementById('modal-phone');
      if (!phone || !phone.value.trim().match(/^(\+47|0047)?[4-9]\d{7}$/)) {
        showInputError(phone, 'Skriv inn et gyldig norsk mobilnummer.');
        return false;
      }
    }

    return true;
  }

  function showInputError(input, msg) {
    if (!input) return;
    input.classList.add('error');
    var errEl = input.parentElement.querySelector('.modal-error-msg');
    if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
  }

  function clearErrors() {
    document.querySelectorAll('.modal-error-msg.visible').forEach(function (el) {
      el.classList.remove('visible');
    });
    document.querySelectorAll('.modal-input.error').forEach(function (el) {
      el.classList.remove('error');
    });
  }

  // ── Data persistence ──────────────────────────
  function saveStepData(step) {
    if (step === 1) {
      var desc = document.getElementById('modal-description');
      if (desc) formState.description = desc.value;
    }
    if (step === 2) {
      var addr = document.getElementById('modal-address');
      if (addr) formState.address = addr.value;
    }
    if (step === 3) {
      var name = document.getElementById('modal-name');
      if (name) formState.name = name.value;
    }
    if (step === 4) {
      var email = document.getElementById('modal-email');
      if (email) formState.email = email.value;
    }
    if (step === 5) {
      var phone = document.getElementById('modal-phone');
      if (phone) formState.phone = phone.value;
    }
    saveData();
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formState));
    } catch (e) { /* ignore */ }
  }

  function loadData() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        if (saved.description) formState.description = saved.description;
        if (saved.address)     formState.address     = saved.address;
        if (saved.name)        formState.name        = saved.name;
        if (saved.email)       formState.email       = saved.email;
        if (saved.phone)       formState.phone       = saved.phone;
      }
    } catch (e) { /* ignore */ }
  }

  function restoreInputs() {
    var fields = [
      { id: 'modal-description', key: 'description' },
      { id: 'modal-address',     key: 'address' },
      { id: 'modal-name',        key: 'name' },
      { id: 'modal-email',       key: 'email' },
      { id: 'modal-phone',       key: 'phone' }
    ];

    fields.forEach(function (f) {
      if (formState[f.key]) {
        var el = document.getElementById(f.id);
        if (el) {
          el.value = formState[f.key];
          if (f.id === 'modal-description') {
            var charCount = document.querySelector('.modal-char-count');
            if (charCount) charCount.textContent = el.value.length + '/2500';
          }
        }
      }
    });
  }

  // ── Submit ────────────────────────────────────
  function submitForm() {
    saveStepData(formState.step);

    var body = new URLSearchParams({
      'form-name':   'motta-tilbud',
      'bot-field':   '',
      'beskrivelse': formState.description,
      'adresse':     formState.address,
      'navn':        formState.name,
      'epost':       formState.email,
      'telefon':     formState.phone
    });

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    }).catch(function () { /* silent fail */ });

    if (formBody) formBody.style.display = 'none';
    if (successEl) successEl.classList.add('is-active');

    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }

    setTimeout(function () {
      window.location.href = '/takk.html';
    }, 2500);
  }

})();
