// ===========================================================
// Lake Victoria Fish Supply — interactions
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky nav background on scroll ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const closeBtn = document.querySelector('.mobile-menu .close-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  const openMenu = () => mobileMenu.classList.add('open');
  const closeMenu = () => mobileMenu.classList.remove('open');

  toggle?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Order Now buttons scroll to contact + prefill fish type ---------- */
  document.querySelectorAll('[data-order]').forEach(btn => {
    btn.addEventListener('click', () => {
      const fishType = btn.getAttribute('data-order');
      const select = document.getElementById('fishType');
      if (select && fishType) {
        select.value = fishType;
      }
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Order form submit (demo — replace action with your backend / formspree / WhatsApp API) ---------- */
  const form = document.getElementById('orderForm');
  const msg = document.getElementById('formMsg');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = data.get('customerName');
    const fish = data.get('fishType');
    const qty = data.get('quantity');
    const transport = data.get('transport');

    // Build a WhatsApp message from the form so orders can be sent instantly.
    const waNumber = '254790267758'; // TODO: replace with your business WhatsApp number
    const text = encodeURIComponent(
      `New order from ${name}\nFish: ${fish}\nQuantity: ${qty} kg\nTransport: ${transport}\nTown: ${data.get('town')}, ${data.get('county')}\nInstructions: ${data.get('instructions') || 'None'}`
    );

    msg.textContent = 'Thanks! Opening WhatsApp so you can send your order directly to us.';
    msg.classList.add('show', 'success');

    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');

    form.reset();
    setTimeout(() => msg.classList.remove('show'), 6000);
  });

});
