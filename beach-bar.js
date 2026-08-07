// ==========================================================================
// Azure Beach Resort — Beach Bar
// ==========================================================================

(function () {
  'use strict';

  const amenityId = 'beach-bar';

  const amenity = {
    eyebrow: 'Beach Bar',
    title: 'The Beach Bar',
    description:
      'Sink your toes into the sand at our handcrafted cocktail bar. As the sun melts into the horizon, our mixologists pour island rum cocktails and pour-over coffee, while live acoustic music sets the mood.',
    features: [
      'Handcrafted tropical cocktails',
      'Sunset happy hour daily',
      'Live acoustic evenings',
      'Small bites & fresh juices',
    ],
    hours: 'Daily · 11:00 AM – Midnight',
    images: [
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=900&q=80',
    ],
  };

  const card = document.querySelector(`.amenity[data-amenity="${amenityId}"]`);
  if (!card) return;

  card.setAttribute('role', 'button');
  card.tabIndex = 0;

  let modal = null;
  let closeBtn = null;
  let track = null;
  let dots = [];
  let slide = 0;

  function goToSlide(index) {
    slide = (index + amenity.images.length) % amenity.images.length;
    track.style.transform = `translateX(-${slide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === slide));
  }

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'amenity-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');

    const panel = document.createElement('div');
    panel.className = 'amenity-modal-panel';

    const gallery = document.createElement('div');
    gallery.className = 'amenity-modal-gallery';
    track = document.createElement('div');
    track.className = 'amenity-modal-track';

    amenity.images.forEach((src, i) => {
      const slideEl = document.createElement('div');
      slideEl.className = 'amenity-modal-slide';
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${amenity.title} — photo ${i + 1}`;
      img.loading = 'lazy';
      slideEl.appendChild(img);
      track.appendChild(slideEl);
    });

    const prevBtn = document.createElement('button');
    prevBtn.className = 'amenity-modal-nav prev';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.textContent = '‹';
    prevBtn.addEventListener('click', () => goToSlide(slide - 1));

    const nextBtn = document.createElement('button');
    nextBtn.className = 'amenity-modal-nav next';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.textContent = '›';
    nextBtn.addEventListener('click', () => goToSlide(slide + 1));

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'amenity-modal-dots';
    amenity.images.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'amenity-modal-dot';
      dot.setAttribute('aria-label', `Go to image ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    gallery.append(track, prevBtn, nextBtn, dotsWrap);

    const content = document.createElement('div');
    content.className = 'amenity-modal-content';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = amenity.eyebrow;

    const title = document.createElement('h3');
    title.textContent = amenity.title;

    const desc = document.createElement('p');
    desc.textContent = amenity.description;

    const features = document.createElement('ul');
    features.className = 'amenity-modal-features';
    amenity.features.forEach((feature) => {
      const li = document.createElement('li');
      const mark = document.createElement('span');
      mark.textContent = '✓';
      li.appendChild(mark);
      li.appendChild(document.createTextNode(feature));
      features.appendChild(li);
    });

    const hours = document.createElement('p');
    hours.className = 'amenity-modal-hours';
    hours.textContent = amenity.hours;

    const cta = document.createElement('a');
    cta.className = 'btn btn-primary';
    cta.href = '#booking';
    cta.textContent = `Book ${amenity.title}`;

    content.append(eyebrow, title, desc, features, hours, cta);

    closeBtn = document.createElement('button');
    closeBtn.className = 'amenity-modal-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', closeModal);

    panel.append(gallery, content, closeBtn);
    modal.appendChild(panel);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    goToSlide(0);
  }

  function openModal() {
    document.querySelectorAll('.amenity-modal.open').forEach((m) => {
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
    });
    if (!modal) buildModal();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    card.focus();
  }

  card.addEventListener('click', openModal);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });
})();
