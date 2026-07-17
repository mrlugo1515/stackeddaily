/* ============================================================
   STACKEDDAILY v2 — Enhanced Script
   ============================================================ */

// ---- Theme toggle ----
(function () {
  const html = document.documentElement;
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  let theme = null ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    
    document.querySelectorAll('.icon-moon').forEach(el => el.style.display = t === 'dark' ? 'block' : 'none');
    document.querySelectorAll('.icon-sun').forEach(el => el.style.display = t === 'light' ? 'block' : 'none');
  }

  applyTheme(theme);

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
    });
  });
})();

// ---- Sticky header ----
const header = document.getElementById('header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- Hamburger / mobile menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      mobileMenu.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    }
  });
}

// ---- Scroll-reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll(
  '.pillar-card, .product-card, .blog-card, .blog-index-card, .roadmap-card, .about-stat-card, .shop-card, .stat-item'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ---- Income bar animation ----
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.db-bar-fill').forEach((bar, i) => {
        const target = bar.dataset.width + '%';
        setTimeout(() => { bar.style.width = target; }, i * 130 + 250);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.dashboard-card').forEach(el => barObserver.observe(el));

// ---- Counter animation for total ----
function animateCounter(el, target, prefix = '$', duration = 1600) {
  if (!el) return;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(eased * target);
    el.textContent = prefix + val.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(document.getElementById('counter-total'), 5740);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const totalEl = document.getElementById('counter-total');
if (totalEl) counterObserver.observe(totalEl.closest('.dashboard-card') || totalEl);

// ---- Newsletter form handler ----
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('nl-form');
  const success = document.getElementById('nl-success');

  // You can replace this with a real Beehiiv or ConvertKit API call:
  // fetch('https://app.beehiiv.com/subscribe/YOUR_ID', {method:'POST', body: new FormData(form)})

  if (form && success) {
    form.style.display = 'none';
    success.style.display = 'flex';
    success.style.flexDirection = 'column';
  }
}

// ---- Generic subscribe (homepage simple form) ----
function handleSubscribe(e) {
  e.preventDefault();
  const form = e.target;
  const next = form.nextElementSibling;
  form.style.display = 'none';
  if (next) {
    next.style.display = 'block';
    next.textContent = '🎉 You\'re in! Check your inbox for the welcome guide.';
    next.style.cssText = 'display:block;padding:.875rem 1.25rem;background:var(--green-dim);color:var(--green);border-radius:var(--radius-md);font-weight:600;font-size:.9rem';
  }
}

// ---- Smooth active nav link ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.href.includes('#' + current) ? 'var(--green)' : '';
  });
}, { passive: true });

// ---- Pillar card accent color from data attribute ----
document.querySelectorAll('.pillar-card[data-accent]').forEach(card => {
  const color = card.dataset.accent;
  const iconWrap = card.querySelector('.pillar-icon-wrap');
  if (iconWrap) {
    iconWrap.style.setProperty('--accent', color);
    iconWrap.style.background = `color-mix(in oklab, ${color} 12%, transparent)`;
    iconWrap.style.borderColor = `color-mix(in oklab, ${color} 25%, transparent)`;
    iconWrap.style.color = color;
  }
});
