var panelIdx = { bw: 0, rp: 0 };
function gotoPanel(id, idx) {
  var car = document.getElementById('carousel-' + id);
  var slides = car.querySelectorAll('.cs-panel');
  var dots = document.getElementById(id + '-dots').querySelectorAll('.cs-dot');
  slides[panelIdx[id]].classList.remove('active');
  dots[panelIdx[id]].classList.remove('active');
  panelIdx[id] = idx;
  slides[idx].classList.add('active');
  dots[idx].classList.add('active');
}
function movePanel(id, dir) {
  var total = parseInt(document.getElementById('carousel-' + id).dataset.total, 10);
  gotoPanel(id, (panelIdx[id] + dir + total) % total);
}
['bw', 'rp'].forEach(function (id) {
  var el = document.getElementById('carousel-' + id), sx = 0;
  el.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', function (e) {
    var dx = sx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) movePanel(id, dx > 0 ? 1 : -1);
  }, { passive: true });
});

/* Subtle reveal only. Everything is visible without it. */
if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-text > *', { opacity: 0, y: 16, duration: .45, stagger: .08, ease: 'power1.out' });
  gsap.from('.hero-cast a', { opacity: 0, y: 12, duration: .45, stagger: .04, ease: 'power1.out' });
  ScrollTrigger.batch('.reveal', {
    start: 'top 90%', once: true,
    onEnter: function (els) { gsap.from(els, { opacity: 0, y: 14, duration: .4, stagger: .06, ease: 'power1.out' }); }
  });
}


/* ---------- contact form ----------
   Set the form's data-endpoint attribute (in index.html) to the address your
   form service gives you. Until then the form says plainly that it is not connected. */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  if (!form.getAttribute('data-endpoint')) {
    form.hidden = true;
    var fb = document.getElementById('contact-fallback');
    if (fb) fb.hidden = false;
    return;
  }
  var status = document.getElementById('f-status');
  var send = document.getElementById('f-send');
  var map = { family: 'Family', school: 'School or library', partner: 'Partner or publisher' };

  document.querySelectorAll('[data-interest]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = document.getElementById('f-interest');
      if (sel && map[a.getAttribute('data-interest')]) sel.value = map[a.getAttribute('data-interest')];
    });
  });

  function show(el, on) { el.hidden = !on; }
  function say(text, cls) { status.textContent = text; status.className = 'status ' + cls; status.hidden = false; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name, email = form.elements.email, consent = form.elements.consent;
    var okName = name.value.trim() !== '';
    var okEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim());
    var okConsent = consent.checked;
    show(document.getElementById('e-name'), !okName);
    show(document.getElementById('e-email'), !okEmail);
    show(document.getElementById('e-consent'), !okConsent);
    name.closest('.field').classList.toggle('invalid', !okName);
    email.closest('.field').classList.toggle('invalid', !okEmail);
    if (!okName) { name.focus(); return; }
    if (!okEmail) { email.focus(); return; }
    if (!okConsent) { consent.focus(); return; }

    if (form.elements.website.value) { say('Thank you, your message has been sent.', 'ok'); form.reset(); return; }
    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint) { say('This form is not connected yet, so nothing was sent.', 'bad'); return; }

    send.disabled = true; say('Sending…', '');
    fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('bad response');
        say('Thank you, your message has been sent.', 'ok'); form.reset();
      })
      .catch(function () { say('That did not go through. Please try again in a moment.', 'bad'); })
      .then(function () { send.disabled = false; });
  });
})();
