/* ============================================================
   STACKEDDAILY — Email Capture Popup Logic
   Lead magnet: 90-Day AI Income Blueprint
   - Appears after 8s OR after 50% scroll (whichever first)
   - Shows once per session (sessionStorage)
   - No backend required — shows a success message on submit
   ============================================================ */

(function () {
  var STORAGE_KEY = 'sd_popup_shown';
  var TIME_TRIGGER_MS = 8000;
  var SCROLL_TRIGGER_PCT = 0.5;

  // Bail early if already shown this session
  if (sessionStorage.getItem(STORAGE_KEY) === '1') return;

  var overlay, scrollHandler, timeoutId, shown = false;

  function buildPopup() {
    overlay = document.createElement('div');
    overlay.className = 'sd-popup-overlay';
    overlay.id = 'sd-popup-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'sd-popup-title');

    overlay.innerHTML =
      '<div class="sd-popup-card">' +
        '<button class="sd-popup-close" id="sd-popup-close" aria-label="Close popup">&#10005;</button>' +
        '<div class="sd-popup-icon">&#128203;</div>' +
        '<p class="sd-popup-eyebrow">Free Download</p>' +
        '<h3 class="sd-popup-title" id="sd-popup-title">Get the Free 90-Day Blueprint</h3>' +
        '<p class="sd-popup-sub">The exact roadmap to <strong>$1,000/month</strong> — free PDF, no fluff.</p>' +
        '<form class="sd-popup-form" id="sd-popup-form">' +
          '<label class="sr-only" for="sd-popup-email">Email address</label>' +
          '<input class="sd-popup-input" type="email" id="sd-popup-email" name="email" placeholder="your@email.com" required autocomplete="email" />' +
          '<button type="submit" class="sd-popup-btn">Send Me the Blueprint &rarr;</button>' +
          '<p class="sd-popup-disclaimer">No spam, ever. Unsubscribe anytime.</p>' +
        '</form>' +
        '<div class="sd-popup-success" id="sd-popup-success">' +
          '<div class="sd-popup-success-icon">&#127881;</div>' +
          '<h3>Check your email!</h3>' +
          '<p>Your free 90-Day AI Income Blueprint is on its way to your inbox.</p>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // Close handlers
    document.getElementById('sd-popup-close').addEventListener('click', closePopup);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') closePopup();
    });

    // Form submit — no backend, just show success message
    var form = document.getElementById('sd-popup-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = document.getElementById('sd-popup-email');
      if (!emailInput.value || !emailInput.checkValidity()) return;

      // Optional: Formspree integration — set data-formspree-endpoint on <body>
      // to enable a real submission alongside the success UI.
      var endpoint = document.body.getAttribute('data-formspree-endpoint');
      if (endpoint) {
        fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        }).catch(function () {
          /* silently ignore network errors — UX already shows success */
        });
      }

      form.classList.add('sd-hide');
      document.getElementById('sd-popup-success').classList.add('sd-show');

      // Auto-close after a few seconds
      setTimeout(closePopup, 3200);
    });
  }

  function showPopup() {
    if (shown) return;
    shown = true;

    if (!overlay) buildPopup();

    requestAnimationFrame(function () {
      overlay.classList.add('sd-popup-visible');
    });

    sessionStorage.setItem(STORAGE_KEY, '1');
    document.body.style.overflow = 'hidden';

    // Clean up triggers once shown
    clearTimeout(timeoutId);
    window.removeEventListener('scroll', scrollHandler);
  }

  function closePopup() {
    if (!overlay) return;
    overlay.classList.remove('sd-popup-visible');
    document.body.style.overflow = '';
  }

  function getScrollPct() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;
    return scrollTop / docHeight;
  }

  scrollHandler = function () {
    if (getScrollPct() >= SCROLL_TRIGGER_PCT) {
      showPopup();
    }
  };

  function init() {
    timeoutId = setTimeout(showPopup, TIME_TRIGGER_MS);
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
