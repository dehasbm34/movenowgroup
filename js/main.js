/* ============================================================
   [BRAND] — MAIN JAVASCRIPT v2.0
   Features: Lang toggle, Counters, Forms
   Calculator · Cart · Crypto copy · Typewriter · Clocks
   ============================================================ */
(function () {
  'use strict';

  /* ── Google Ads conversion hook ─────────────────────────── */
  function trackConversion(type) {
    // Paste your gtag snippet here and uncomment:
    // gtag('event','conversion',{'send_to':'AW-CONVERSION_ID/LABEL_' + type});
    console.log('[ADS] conversion:', type);
  }

  /* ── Body offset for fixed bars ─────────────────────────── */
  function initBodyOffset() {
    function update() {
      const bar = document.getElementById('emergencyBar');
      const nav = document.querySelector('.nav');
      const barH = (bar && bar.offsetHeight) || 0;
      const navH = (nav && nav.offsetHeight) || 0;
      document.body.style.paddingTop = barH + 'px';
      if (nav) nav.style.top = barH + 'px';
    }
    update();
    window.addEventListener('resize', update);

    const closeBtn = document.getElementById('emergencyBarClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        const bar = document.getElementById('emergencyBar');
        if (bar) {
          bar.style.display = 'none';
          sessionStorage.setItem('barDismissed', '1');
          setTimeout(update, 50);
        }
      });
    }
    if (sessionStorage.getItem('barDismissed') === '1') {
      const bar = document.getElementById('emergencyBar');
      if (bar) { bar.style.display = 'none'; setTimeout(update, 50); }
    }
  }

  /* ── Navigation ─────────────────────────────────────────── */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle('nav--scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Active link
    const links = nav.querySelectorAll('a[href]');
    const current = location.pathname.split('/').pop() || 'index.html';
    links.forEach(function (a) {
      if (a.getAttribute('href') === current ||
          a.getAttribute('href') === './' + current ||
          a.getAttribute('href') === '../' + current) {
        a.classList.add('active');
      }
    });
  }

  /* ── Mobile Menu ─────────────────────────────────────────── */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu      = document.getElementById('mobileMenu');
    const closeBtn  = document.getElementById('mobileMenuClose');
    if (!hamburger || !menu) return;
    function open()  { menu.classList.add('is-open'); document.body.style.overflow = 'hidden'; menu.setAttribute('aria-hidden','false'); }
    function close() { menu.classList.remove('is-open'); document.body.style.overflow = ''; menu.setAttribute('aria-hidden','true'); }
    hamburger.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') close(); });
  }

  /* Language toggle is now handled by Google Translate (see <body> script in each page).
     This stub remains so existing initLangToggle() calls don't error. */
  function initLangToggle() { /* no-op, replaced by Google Translate widget */ }

  /* ── Scroll Animations ───────────────────────────────────── */
  function initScrollAnimations() {
    const els = document.querySelectorAll('.fade-in-up');
    if (!els.length) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Counters ────────────────────────────────────────────── */
  function initCounters() {
    const els = document.querySelectorAll('.stat-item__number[data-target], .counter[data-target]');
    if (!els.length) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const raw = el.dataset.target;
        const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
        const sfx = raw.replace(/[0-9.]/g, '');
        const dur = 1800;
        let start = null;
        function step(ts) {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = eased * num;
          el.textContent = (Number.isInteger(num) ? Math.round(val) : val.toFixed(1)) + sfx;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Typewriter (multilingual) ───────────────────────────── */
  function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const phrases = {
      en: ['Evacuation', 'Relocation', 'Safety', 'A New Beginning'],
      ar: ['الإخلاء', 'الانتقال', 'السلامة', 'بداية جديدة'],
      fa: ['تخلیه', 'جابجایی', 'امنیت', 'آغازی نو'],
      ru: ['Эвакуация', 'Переезд', 'Безопасность', 'Новое начало'],
      uk: ['Евакуація', 'Переїзд', 'Безпека', 'Новий початок'],
      tr: ['Tahliye', 'Taşınma', 'Güvenlik', 'Yeni Bir Başlangıç'],
      es: ['Evacuación', 'Reubicación', 'Seguridad', 'Un Nuevo Comienzo'],
      fr: ['Évacuation', 'Réinstallation', 'Sécurité', 'Un Nouveau Départ'],
      ku: ['دەرکردن', 'گوێزرانەوە', 'پاراستن', 'دەستپێکردنێکی نوێ'],
      my: ['ထွက်ပြေး', 'နေရာပြောင်း', 'ဘေးကင်း', 'အသစ်တစ်ဖန်'],
    };
    const browserLang = localStorage.getItem('lang') ||
                        ((window.LANG_MAP || {})[navigator.language.split('-')[0]] || 'en');
    let list = phrases[browserLang] || phrases.en;
    let i = 0; let ci = 0; let deleting = false;
    function tick() {
      const word = list[i];
      if (!deleting) {
        el.textContent = word.slice(0, ci + 1);
        ci++;
        if (ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
      } else {
        el.textContent = word.slice(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; i = (i + 1) % list.length; }
      }
      setTimeout(tick, deleting ? 60 : 100);
    }
    tick();
    /* Allow lang toggle to restart with new phrase list */
    window._typewriterSetLang = function(lang) {
      list = phrases[lang] || phrases.en;
      i = 0; ci = 0; deleting = false;
    };
  }

  /* ── Hero Form Tabs ──────────────────────────────────────── */
  function initHeroFormTabs() {
    const tabs  = document.querySelectorAll('.hero__form-tab');
    const panes = document.querySelectorAll('.hero__form-pane');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panes.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.target);
        if (target) target.classList.add('active');
      });
    });
  }

  /* Live ticker removed — was off-brand for crisis services */
  function initTicker() { /* no-op */ }

  /* ── Transfer Calculator ─────────────────────────────────── */
  function initCalculator() {
    const calcAmount  = document.getElementById('calcAmount');
    const calcFrom    = document.getElementById('calcFrom');
    const calcTo      = document.getElementById('calcTo');
    const calcResult  = document.getElementById('calcResult');
    const calcFee     = document.getElementById('calcFee');
    const calcTime    = document.getElementById('calcTime');
    const calcTotal   = document.getElementById('calcTotal');
    if (!calcAmount || !calcResult) return;

    // Approximate rates to USD
    var toUSD = {
      USD: 1, EUR: 1.08, GBP: 1.27, AED: 0.272, TRY: 0.031,
      IRR: 0.000024, IQD: 0.00076, LBP: 0.000011, USDT: 1
    };
    var feeByMethod = {
      USDT: { pct: 0.5, min: 5, speed: '15–30 min' },
      HAWALA: { pct: 1.5, min: 10, speed: '4–8 hours' },
      WIRE: { pct: 2.0, min: 25, speed: '2–5 days' }
    };

    function calculate() {
      var amount = parseFloat(calcAmount ? calcAmount.value : 0) || 0;
      var from   = calcFrom ? calcFrom.value : 'USD';
      var to     = calcTo   ? calcTo.value   : 'IRR';
      var method = document.getElementById('calcMethod');
      var mKey   = method ? method.value : 'USDT';
      if (!amount || amount <= 0) { if(calcResult) calcResult.textContent = '—'; return; }
      var amtUSD  = amount * (toUSD[from] || 1);
      var fee_obj = feeByMethod[mKey] || feeByMethod.USDT;
      var fee     = Math.max(fee_obj.min, amtUSD * fee_obj.pct / 100);
      var netUSD  = amtUSD - fee;
      var toRate  = toUSD[to] || 1;
      var result  = netUSD / toRate;

      function fmt3(n) {
        if (n >= 1000000) return (n/1000000).toFixed(2) + 'M';
        if (n >= 1000)    return n.toLocaleString('en-US', {maximumFractionDigits: 0});
        return n.toFixed(2);
      }
      if (calcResult) calcResult.textContent = fmt3(result) + ' ' + to;
      if (calcFee)    calcFee.textContent    = '$' + fee.toFixed(2);
      if (calcTime)   calcTime.textContent   = fee_obj.speed;
      if (calcTotal)  calcTotal.textContent  = '$' + amtUSD.toFixed(2);
    }

    [calcAmount, calcFrom, calcTo, document.getElementById('calcMethod')]
      .forEach(function(el){ if(el) el.addEventListener('input', calculate); });
    calculate();
  }

  /* ── Form Handling ───────────────────────────────────────── */
  function initFormHandling() {
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;

        // Validate required fields
        form.querySelectorAll('[required]').forEach(function (field) {
          var group = field.closest('.form-group');
          var err   = group && group.querySelector('.form-error');
          var empty = !field.value.trim();
          if (field.type === 'email' && !empty) {
            empty = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
          }
          if (field.type === 'checkbox') empty = !field.checked;
          if (group) group.classList.toggle('has-error', empty);
          if (err) err.style.display = empty ? 'block' : 'none';
          if (empty) valid = false;
        });

        if (!valid) return;

        var btn = form.querySelector('button[type=submit]');
        if (btn) { btn.classList.add('btn--loading'); btn.disabled = true; }

        trackConversion(form.dataset.form);

        setTimeout(function () {
          if (btn) { btn.classList.remove('btn--loading'); btn.disabled = false; }
          var formEl    = form.querySelector('.form-fields') || form;
          var successEl = form.querySelector('.form-success') || form.nextElementSibling;
          if (successEl && successEl.classList.contains('form-success')) {
            formEl.style.display = 'none';
            successEl.style.display = 'block';
          } else {
            var s = document.createElement('div');
            s.className = 'form-success';
            s.style.display = 'block';
            s.innerHTML = '<div class="form-success__icon">✓</div>'
              + '<h3>Request Received</h3>'
              + '<p>Our team will contact you within <strong>1 hour</strong>. For immediate help call <a href="tel:+18880000000">+1-888-000-0000</a>.</p>';
            form.innerHTML = '';
            form.appendChild(s);
          }
        }, 1200);
      });

      // Clear error on input
      form.querySelectorAll('input, select, textarea').forEach(function (field) {
        field.addEventListener('input', function () {
          var group = field.closest('.form-group');
          if (group) group.classList.remove('has-error');
        });
      });
    });
  }

  /* ── Conditional Fields ──────────────────────────────────── */
  function initConditionalFields() {
    document.querySelectorAll('[data-shows]').forEach(function (trigger) {
      function check() {
        var targetId = trigger.dataset.shows;
        var when     = trigger.dataset.showsWhen || trigger.dataset.shows_when;
        var target   = document.getElementById(targetId);
        if (!target) return;
        var show = when ? trigger.value === when : !!trigger.value;
        target.classList.toggle('is-shown', show);
        target.querySelectorAll('input,select,textarea').forEach(function(f){ f.required = show; });
      }
      trigger.addEventListener('change', check);
      check();
    });
  }

  /* ── Accordion ───────────────────────────────────────────── */
  function initAccordion() {
    document.querySelectorAll('.accordion__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.accordion__item');
        var body = item.querySelector('.accordion__body');
        var isOpen = item.classList.contains('is-open');

        // Close all in same accordion group
        var group = btn.closest('.accordion');
        if (group) {
          group.querySelectorAll('.accordion__item.is-open').forEach(function (open) {
            if (open !== item) {
              open.classList.remove('is-open');
              open.querySelector('.accordion__body').style.maxHeight = '0';
            }
          });
        }

        item.classList.toggle('is-open', !isOpen);
        body.style.maxHeight = isOpen ? '0' : body.scrollHeight + 'px';
      });
    });
  }

  /* ── Product Cart ────────────────────────────────────────── */
  function initProductCart() {
    var cart = [];
    var cartEl = document.getElementById('cartSidebar');
    var cartItemsEl = document.getElementById('cartItems');
    var cartTotalEl = document.getElementById('cartTotal');
    var cartCountEl = document.getElementById('cartCount');

    // Qty buttons
    document.querySelectorAll('.qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var display = btn.parentElement.querySelector('.qty-display');
        var card    = btn.closest('[data-unit-price]');
        var cur     = parseInt(display.textContent) || 0;
        if (btn.dataset.action === 'inc') display.textContent = cur + 1;
        if (btn.dataset.action === 'dec') display.textContent = Math.max(0, cur - 1);
      });
    });

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card    = btn.closest('[data-unit-price]');
        var qty     = parseInt(card.querySelector('.qty-display').textContent) || 1;
        var price   = parseFloat(card.dataset.unitPrice);
        var name    = card.querySelector('.product-card__name') ? card.querySelector('.product-card__name').textContent : 'Item';
        var existing = cart.find(function(i){ return i.name === name; });
        if (existing) { existing.qty += qty; } else { cart.push({ name: name, qty: qty, price: price }); }
        renderCart();
        if (cartEl) cartEl.classList.add('is-open');
      });
    });

    // Open cart
    var cartToggle = document.getElementById('cartToggle');
    if (cartToggle) cartToggle.addEventListener('click', function() { if(cartEl) cartEl.classList.toggle('is-open'); });
    var cartClose = document.getElementById('cartClose');
    if (cartClose) cartClose.addEventListener('click', function() { if(cartEl) cartEl.classList.remove('is-open'); });

    function renderCart() {
      var total = cart.reduce(function(s,i){ return s + i.price * i.qty; }, 0);
      var count = cart.reduce(function(s,i){ return s + i.qty; }, 0);
      if (cartCountEl) cartCountEl.textContent = count || '';
      if (cartTotalEl) cartTotalEl.textContent = '$' + total.toLocaleString('en-US', {minimumFractionDigits: 2});
      if (cartItemsEl) {
        cartItemsEl.innerHTML = cart.length ? cart.map(function(i){
          return '<div class="cart-item"><div class="cart-item__info">'
            + '<div class="cart-item__name">' + i.name + '</div>'
            + '<div class="cart-item__qty">Qty: ' + i.qty + '</div></div>'
            + '<div class="cart-item__price">$' + (i.price * i.qty).toLocaleString('en-US', {minimumFractionDigits: 2}) + '</div></div>';
        }).join('') : '<p style="color:var(--text-muted);text-align:center;padding:2rem">Your cart is empty</p>';
      }
    }
  }

  /* ── Copy Crypto Address ─────────────────────────────────── */
  function initCryptoCopy() {
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var addr = btn.closest('.crypto-address-box__row') || btn.parentElement;
        var text = addr.querySelector('.crypto-address-box__addr');
        if (!text) return;
        navigator.clipboard.writeText(text.textContent.trim()).then(function () {
          var orig = btn.textContent;
          btn.textContent = '✓ Copied';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = orig;
            btn.classList.remove('copied');
          }, 2000);
        }).catch(function() {
          // fallback
          var ta = document.createElement('textarea');
          ta.value = text.textContent.trim();
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          btn.textContent = '✓ Copied';
          setTimeout(function(){ btn.textContent = 'Copy'; }, 2000);
        });
      });
    });
  }

  /* ── Live Clocks ─────────────────────────────────────────── */
  function initClocks() {
    var zones = [
      { id: 'clock-est',      tz: 'America/New_York' },
      { id: 'clock-istanbul', tz: 'Europe/Istanbul'   },
      { id: 'clock-tehran',   tz: 'Asia/Tehran'       },
      { id: 'clock-dubai',    tz: 'Asia/Dubai'        }
    ];
    function update() {
      zones.forEach(function (z) {
        var el = document.getElementById(z.id);
        if (!el) return;
        el.textContent = new Date().toLocaleTimeString('en-US', {
          timeZone: z.tz, hour: '2-digit', minute: '2-digit', hour12: false
        });
      });
    }
    update();
    setInterval(update, 1000);
  }

  /* ── INIT ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initBodyOffset();
    initNav();
    initMobileMenu();
    initLangToggle();
    initScrollAnimations();
    initCounters();
    initTypewriter();
    initHeroFormTabs();
    initTicker();
    initCalculator();
    initFormHandling();
    initConditionalFields();
    initAccordion();
    initProductCart();
    initCryptoCopy();
    initClocks();
  });

})();
