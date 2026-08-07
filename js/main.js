// ==========================================================================
// Azure Beach Resort — Interactions
// ==========================================================================

(function () {
  'use strict';

  /* ---------- Navbar: shrink + highlight on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    let current = 'home';
    for (const link of navLinks) {
      const target = document.querySelector(link.getAttribute('href'));
      if (target && window.scrollY >= target.offsetTop - 120) {
        current = link.getAttribute('href').slice(1);
      }
    }
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = mobileLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      mobileLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document
    .querySelectorAll(
      '.section-head, .room-card, .amenity, .gallery-item, .testimonial, .about-text, .about-images'
    )
    .forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 3) * 0.08}s`;
      revealObserver.observe(el);
    });

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.querySelector('img').src;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  dots.forEach((dot) => dot.addEventListener('click', () => goToSlide(Number(dot.dataset.slide))));

  let slideTimer = setInterval(() => {
    goToSlide((currentSlide + 1) % dots.length);
  }, 6000);

  const slider = document.getElementById('testimonialSlider');
  slider.addEventListener('mouseenter', () => clearInterval(slideTimer));
  slider.addEventListener('mouseleave', () => {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide((currentSlide + 1) % dots.length), 6000);
  });

  /* ---------- Booking form validation + mock confirmation ---------- */
  const bookingForm = document.getElementById('bookingForm');
  const formMessage = document.getElementById('formMessage');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.className = 'form-message';
    formMessage.textContent = '';

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const room = document.getElementById('room');
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    let valid = true;

    document.querySelectorAll('.form-group input, .form-group select').forEach((el) => {
      el.classList.remove('error');
    });

    if (!name.value.trim()) { markError(name); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { markError(email); valid = false; }
    if (!room.value) { markError(room); valid = false; }
    if (!checkin.value) { markError(checkin); valid = false; }
    if (!checkout.value) { markError(checkout); valid = false; }
    if (checkin.value && checkout.value && checkout.value <= checkin.value) {
      markError(checkout);
      formMessage.className = 'form-message error';
      formMessage.textContent = 'Check-out must be after check-in.';
      valid = false;
    }

    if (!valid) {
      formMessage.className = 'form-message error';
      if (!formMessage.textContent) formMessage.textContent = 'Please fill in all required fields.';
      return;
    }

    formMessage.className = 'form-message success';
    formMessage.textContent = `Thank you, ${name.value.trim().split(' ')[0]}! Your request for the ${room.value} has been received. Our team will email you shortly.`;
    bookingForm.reset();
  });

  function markError(el) {
    el.classList.add('error');
    el.addEventListener('input', () => el.classList.remove('error'), { once: true });
  }

  /* ---------- Set sensible default dates ---------- */
  const today = new Date().toISOString().split('T')[0];
  const checkoutDefault = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
  const checkinEl = document.getElementById('checkin');
  const checkoutEl = document.getElementById('checkout');
  checkinEl.min = today;
  checkoutEl.min = today;
  checkinEl.value = today;
  checkoutEl.value = checkoutDefault;
})();
