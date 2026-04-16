const rooms = {
  deluxe: {
    name:     'Deluxe Room',
    price:    '₹18,000 / night',
    desc:     'Our Deluxe Room is a celebration of understated refinement — king-size bed dressed in 600-thread Egyptian cotton, a marble en-suite bath with soaking tub, and floor-to-ceiling windows framing sweeping city vistas. A private workspace and curated mini-bar complete the experience.',
    features: ['45 m²', 'King Bed', 'City View', 'Marble Bath', 'Butler Service', 'Wi-Fi'],
    panorama: 'room2.jpg',
  },
  premier: {
    name:     'Premier Suite',
    price:    '₹32,000 / night',
    desc:     'The Premier Suite unfolds across three distinct spaces — a grand living room with heritage art, a private dining alcove, and a master bedroom with handcrafted four-poster bed. Step onto the private balcony to inhale the fragrance of manicured gardens below.',
    features: ['85 m²', 'Four-Poster Bed', 'Garden View', 'Private Balcony', 'Personal Butler', 'Lounge Area'],
    panorama: 'room1.jpg',
  },
  royal: {
    name:     'Royal Suite',
    price:    '₹75,000 / night',
    desc:     'An entire floor dedicated to sovereignty. The Royal Suite is a private estate within the hotel — featuring a heated plunge pool terrace, a billiards room, grand piano, and interiors curated by master artisans. Reserved for dignitaries, royalty, and those who expect nothing less.',
    features: ['160 m²', '2 Bedrooms', 'Private Pool', 'Grand Piano', 'Cinema Room', '24h Concierge'],
    panorama: 'room3.jpg',
  },
};

const loader = document.getElementById('loader');

window.addEventListener('load', () => {

  setTimeout(() => {
    loader.classList.add('hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 2800);
});

const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-link');

function highlightActiveNav() {
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 120;
    const sectionBottom = sectionTop + section.offsetHeight;
    const id            = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}

window.addEventListener('scroll', highlightActiveNav, { passive: true });


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    closeMobileMenu();
  });
});

const fadeSections = document.querySelectorAll('.fade-section');

const observerOptions = {
  threshold: 0.12,     
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      sectionObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeSections.forEach(el => sectionObserver.observe(el));



const heroBg = document.querySelector('.hero-bg');

function handleParallax() {
  if (!heroBg) return;
  const offset = window.scrollY;
  
  heroBg.style.transform = `scale(1.08) translateY(${offset * 0.25}px)`;
}

window.addEventListener('scroll', handleParallax, { passive: true });


const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function openMobileMenu()  { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMobileMenu() { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; }

hamburger.addEventListener('click', openMobileMenu);
mobileClose.addEventListener('click', closeMobileMenu);


document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});


const modal     = document.getElementById('roomModal');
const modalBox  = document.getElementById('modalBox');
let   viewer    = null;   


window.openRoomModal = function(roomKey) {
  const room = rooms[roomKey];
  if (!room) return;

  const detailsEl = document.getElementById('modalDetails');
  detailsEl.innerHTML = `
    <h2>${room.name}</h2>
    <p class="modal-price">${room.price}</p>
    <p>${room.desc}</p>
    <div class="modal-features">
      ${room.features.map(f => `<span class="modal-feature-tag">${f}</span>`).join('')}
    </div>
    <a href="#booking" class="btn-gold" onclick="closeRoomModal(); setTimeout(() => document.getElementById('roomType').value='${roomKey}', 400)">
      Reserve This Room
    </a>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (viewer) {
    try { viewer.destroy(); } catch (_) {}
    viewer = null;
  }

  const container = document.getElementById('panoramaContainer');
  container.innerHTML = '';   

  setTimeout(() => {
    viewer = pannellum.viewer('panoramaContainer', {
      type:         'equirectangular',
      panorama:     room.panorama,
      autoLoad:     true,
      autoRotate:   -2,
      compass:      false,
      showControls: true,
      hfov:         100,
      mouseZoom:    true,
      strings: {
        loadButtonLabel: 'Click to Load Panorama',
        loadingLabel:    'Loading 360° View…',
      },
    });
  }, 200);
};


window.closeRoomModal = function() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  
  if (viewer) {
    try { viewer.destroy(); } catch (_) {}
    viewer = null;
  }
};


window.closeModal = function(event) {
  if (event.target === modal) closeRoomModal();
};

// ESC key to close modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeRoomModal();
});



window.handleBooking = function(event) {
  event.preventDefault();

  const name    = document.getElementById('guestName').value.trim();
  const email   = document.getElementById('guestEmail').value.trim();
  const checkIn = document.getElementById('checkIn').value;
  const checkOut= document.getElementById('checkOut').value;


  if (!name || !email || !checkIn || !checkOut) {
    shakeForm();
    return;
  }

  if (new Date(checkOut) <= new Date(checkIn)) {
    alert('Check-out date must be after check-in date.');
    return;
  }

  showToast();


  document.getElementById('bookingForm').reset();
};

function shakeForm() {
  const form = document.getElementById('bookingForm');
  form.style.animation = 'none';

  void form.offsetHeight;
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => (form.style.animation = ''), 400);
}

(function injectShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX( 8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX( 5px); }
    }
  `;
  document.head.appendChild(style);
})();



const toast = document.getElementById('toast');
let toastTimer = null;

function showToast() {
  if (toastTimer) clearTimeout(toastTimer);
  toast.classList.add('show');

  toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
}


(function setMinDates() {
  const today    = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const fmt = date => date.toISOString().split('T')[0];

  const checkInEl  = document.getElementById('checkIn');
  const checkOutEl = document.getElementById('checkOut');

  if (checkInEl)  checkInEl.min  = fmt(today);
  if (checkOutEl) checkOutEl.min = fmt(tomorrow);

  checkInEl && checkInEl.addEventListener('change', () => {
    const selected = new Date(checkInEl.value);
    const next     = new Date(selected);
    next.setDate(selected.getDate() + 1);
    checkOutEl.min   = fmt(next);

    if (checkOutEl.value && new Date(checkOutEl.value) <= selected) {
      checkOutEl.value = fmt(next);
    }
  });
})();



const roomCards = document.querySelectorAll('.room-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {

      const card  = entry.target;
      const index = Array.from(roomCards).indexOf(card);
      card.style.transitionDelay = `${index * 0.12}s`;
      card.style.opacity  = '1';
      card.style.transform = 'translateY(0)';
      cardObserver.unobserve(card);
    }
  });
}, { threshold: 0.1 });

roomCards.forEach(card => {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(36px)';
  card.style.transition = 'opacity 0.7s ease, transform 0.7s ease, box-shadow 0.4s ease, border-color 0.4s ease';
  cardObserver.observe(card);
});



const amenityCards = document.querySelectorAll('.amenity-card');

const amenityObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card  = entry.target;
      const index = Array.from(amenityCards).indexOf(card);
      setTimeout(() => {
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
      }, index * 90);
      amenityObserver.unobserve(card);
    }
  });
}, { threshold: 0.08 });

amenityCards.forEach(card => {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.7s ease, transform 0.7s ease, box-shadow 0.4s ease, border-color 0.4s ease, background 0.4s ease';
  amenityObserver.observe(card);
});



document.addEventListener('DOMContentLoaded', () => {
  handleNavbarScroll();
  highlightActiveNav();
});