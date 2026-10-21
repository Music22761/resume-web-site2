(() => {
  const root = document.documentElement;
  const nav = document.querySelector('[data-nav]');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const toTop = document.querySelector('[data-to-top]');

  // Theme toggle
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Mobile menu
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  menuBtn?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width: 900px)').addEventListener('change', () => setMenu(false));

  // Navbar shadow + back-to-top visibility
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 8);
    toTop.classList.toggle('show', scrollY > 600);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));

    // Highlight the nav link of the section in view
    const links = new Map([...document.querySelectorAll('[data-link]')].map((a) => [a.dataset.link, a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove('active'));
        links.get(entry.target.id)?.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }
})();
