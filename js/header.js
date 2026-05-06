$(document).ready(function () {
  $('#header').load('./components/header.html', function () {
    initHeader();
  });
});

function initHeader() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll: add .scrolled class
  function handleScroll() {
    if (window.scrollY > 40) {
      navbar && navbar.classList.add('scrolled');
    } else {
      navbar && navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Hamburger toggle
  hamburger && hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    mobileMenu && mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav-link, .mobile-wa-btn, .mobile-admin-link').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger && hamburger.classList.remove('active');
      mobileMenu && mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });
}
