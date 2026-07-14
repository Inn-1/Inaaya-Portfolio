// ===================== Inaaya Khan Portfolio — interactivity =====================

// Safety net: if anything below fails to run (blocked script, browser quirk,
// slow load), never let content stay permanently invisible/unclickable.
// This forces every .reveal element visible no matter what.
function forceRevealAll() {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
}
window.setTimeout(forceRevealAll, 2500);

document.addEventListener('DOMContentLoaded', () => {
 try {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');

      // "#top" points at the sticky header, which browsers can fail to
      // anchor-scroll to correctly. Force a true scroll-to-top instead.
      if (link.getAttribute('href') === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState(null, '', '#top');
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    // Old/unsupported browser: just show everything immediately.
    forceRevealAll();
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Active nav link highlight ---------- */
  const sections = document.querySelectorAll('main section[id], header#top');
  const navAnchors = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- Cursor glow (desktop only) ---------- */
  const glow = document.querySelector('.cursor-glow');
  const isTouch = matchMedia('(pointer: coarse)').matches;
  if (glow && !isTouch) {
    window.addEventListener('pointermove', (e) => {
      document.documentElement.style.setProperty('--x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--y', `${e.clientY}px`);
    }, { passive: true });
  }

  /* ---------- Header shrink on scroll ---------- */
  const header = document.querySelector('.site-header');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 20 ? '0 8px 24px -12px rgba(0,0,0,.4)' : 'none';
    lastY = window.scrollY;
  }, { passive: true });

  /* ---------- Current year safeguard (footer already static, kept dynamic-ready) ---------- */
  const yearEl = document.querySelector('.site-footer p');
  if (yearEl) {
    const now = new Date();
    yearEl.textContent = yearEl.textContent.replace(/\b\d{4}\b/, now.getFullYear());
  }

 } catch (err) {
   // If anything above throws, don't let the whole page's interactivity die —
   // at minimum make sure every section/button is visible and usable.
   console.error('Portfolio script error:', err);
   forceRevealAll();
 }
});
