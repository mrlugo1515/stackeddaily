/* ============================================================
   STACKEDDAILY — Article Page Script
   ============================================================ */

// Reading progress bar
(function () {
  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop;
    const total = doc.scrollHeight - doc.clientHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
})();

// TOC active link highlighting
(function () {
  const tocLinks = document.querySelectorAll('.toc-list a');
  if (!tocLinks.length) return;

  const headings = [...document.querySelectorAll('.article-content h2[id]')];
  if (!headings.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  headings.forEach(h => observer.observe(h));
})();

// Smooth scroll for TOC links
document.querySelectorAll('.toc-list a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
