/* ============================================================
   Shared site script
   1. Directional page transitions (slide across, multi-page)
   2. Scroll-reveal for card grids
   3. Custom interactive cursor (fine-pointer devices only)
   ============================================================ */
(function () {
  var TRANSITION_MS = 480;

  /* ---------- 1a. Outbound transition on internal links ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-transition]');
    if (!link) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;

    e.preventDefault();
    var dir = link.getAttribute('data-transition') === 'back' ? 'back' : 'forward';
    sessionStorage.setItem('pt-direction', dir);
    document.body.classList.add(dir === 'back' ? 'pt-exit-back' : 'pt-exit-forward');
    setTimeout(function () { window.location.href = href; }, TRANSITION_MS);
  });

  /* ---------- 1b. Entrance animation ----------
     The starting position (pt-enter-forward/back) is applied
     synchronously by an inline script at the top of <body>,
     before first paint, to avoid a flash of the unstyled page.
     Here we just swap to pt-enter-active on the next frame so
     the browser animates from that starting position to rest. */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.remove('pt-enter-forward', 'pt-enter-back');
      document.body.classList.add('pt-enter-active');
    });
  });

  /* ---------- 2. Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 3. Custom cursor (fine pointer only) ---------- */
  if (window.matchMedia && matchMedia('(pointer:fine)').matches) {
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add('has-cursor');

    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });
  }
})();
