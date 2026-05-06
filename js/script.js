/* AnnuMakeover – Core Script */
'use strict';

/* ── Intersection Observer: fade-up animations ── */
(function () {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  function observe() {
    document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
})();

/* ── Hero background Ken Burns ── */
(function () {
  function initHero() {
    var bg = document.getElementById('heroBg');
    if (bg) setTimeout(function () { bg.classList.add('loaded'); }, 80);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero);
  } else {
    initHero();
  }
})();

/* ── Testimonials Slider ── */
(function () {
  function initSlider() {
    var wrapper = document.querySelector('.testimonials-wrapper');
    if (!wrapper) return;

    var track  = wrapper.querySelector('.testimonials-track');
    var cards  = track ? track.querySelectorAll('.testimonial-card') : [];
    var dotsEl = document.getElementById('sliderDots');
    if (!track || !cards.length) return;

    var total   = cards.length;
    var current = 0;
    var timer;

    /* How many cards are visible at current viewport */
    function perView() {
      if (window.innerWidth > 1024) return Math.min(3, total);
      if (window.innerWidth > 640)  return Math.min(2, total);
      return 1;
    }

    /* Set each card's explicit pixel width so % gaps work correctly */
    function setCardWidths() {
      var pv   = perView();
      var gap  = 22;
      var w    = (wrapper.offsetWidth - gap * (pv - 1)) / pv;
      [].forEach.call(cards, function (c) {
        c.style.minWidth  = w + 'px';
        c.style.maxWidth  = w + 'px';
        c.style.flexShrink = '0';
      });
    }

    /* Build dots */
    function buildDots() {
      if (!dotsEl) return;
      var pv  = perView();
      var max = Math.max(0, total - pv);
      dotsEl.innerHTML = '';
      for (var i = 0; i <= max; i++) {
        (function (idx) {
          var btn = document.createElement('button');
          btn.className = 'slider-dot' + (idx === current ? ' active' : '');
          btn.setAttribute('aria-label', 'Slide ' + (idx + 1));
          btn.addEventListener('click', function () {
            goTo(idx);
            clearInterval(timer);
            timer = setInterval(next, 4200);
          });
          dotsEl.appendChild(btn);
        })(i);
      }
    }

    function getDots() { return dotsEl ? dotsEl.querySelectorAll('.slider-dot') : []; }
    function maxIndex() { return Math.max(0, total - perView()); }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxIndex()));
      var pv  = perView();
      var gap = 22;
      var w   = (wrapper.offsetWidth - gap * (pv - 1)) / pv;
      track.style.transform = 'translateX(-' + current * (w + gap) + 'px)';
      getDots().forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }

    function next() { goTo(current >= maxIndex() ? 0 : current + 1); }

    /* Touch / swipe support */
    var touchStartX = 0;
    wrapper.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    wrapper.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        clearInterval(timer);
        goTo(dx < 0 ? current + 1 : current - 1);
        timer = setInterval(next, 4200);
      }
    });

    /* Init */
    setCardWidths();
    buildDots();
    goTo(0);
    timer = setInterval(next, 4200);

    window.addEventListener('resize', function () {
      clearInterval(timer);
      setCardWidths();
      buildDots();
      goTo(0);
      timer = setInterval(next, 4200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
  } else {
    initSlider();
  }
})();

/* ── Services Filter (customer-services page) ── */
(function () {
  function initFilter() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.dataset.cat;

        document.querySelectorAll('.service-card').forEach(function (card) {
          var show = cat === 'all' || card.dataset.cat === cat;
          card.style.transition = 'opacity 0.25s ease';
          if (show) {
            card.style.display = '';
            requestAnimationFrame(function () { card.style.opacity = '1'; });
          } else {
            card.style.opacity = '0';
            setTimeout(function () { card.style.display = 'none'; }, 260);
          }
        });

        document.querySelectorAll('.cat-section').forEach(function (sec) {
          sec.style.display = (cat === 'all' || sec.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilter);
  } else {
    initFilter();
  }
})();

/* ── Smooth scroll for on-page anchors ── */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

/* ── Toast helper (global) ── */
function showToast(msg, type) {
  type = type || 'success';
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = (type === 'success' ? '✓  ' : '✕  ') + msg;
  container.appendChild(toast);
  setTimeout(function () { if (toast.parentNode) toast.remove(); }, 3500);
}
