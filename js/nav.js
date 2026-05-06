/* AnnuMakeover – Navbar init (works from file:// – no AJAX) */
(function () {
  'use strict';

  var navbar     = document.getElementById('navbar');
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  /* ── Scroll: add .scrolled when past 40px ── */
  function onScroll() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── Hamburger toggle ── */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    /* Close when any link inside mobile menu is clicked */
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Mark active nav link based on current filename ── */
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('?')[0];
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
