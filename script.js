// ===========================================================
// Lake Victoria Fish Supply — interactions (v2)
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Sticky nav background on scroll ---- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---- Mobile menu ---- */
  const toggle = document.querySelector('.nav-toggle');
  const closeBtn = document.querySelector('.mobile-menu .close-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const openMenu = () => mobileMenu.classList.add('open');
  const closeMenu = () => mobileMenu.classList.remove('open');
  toggle?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---- Scroll reveal animations ---- */
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

  /* ---- "Contact for Today's Price" / product buttons scroll to contact + prefill fish type ---- */
  document.querySelectorAll('[data-order]').forEach(btn => {
    btn.addEventListener('click', () => {
      const fishType = btn.getAttribute('data-order');
      const select = document.getElementById('fishType');
      if (select && fishType) select.value = fishType;
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---- Order form submit -> builds a WhatsApp message ----
     NOTE for future M-Pesa / online ordering integration:
     Replace this handler's WhatsApp redirect with a POST to your
     order-processing backend once one exists, then trigger an
     M-Pesa STK push from there. Keep the form field names as-is
     (name="..." on each input) so the payload structure won't need
     to change when that backend is added. */
  const form = document.getElementById('orderForm');
  const msg = document.getElementById('formMsg');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const waNumber = '254790267758'; // business WhatsApp number
    const text = encodeURIComponent(
      `New order from ${data.get('fullName')}\n` +
      `Phone: ${data.get('phone')}\n` +
      `Fish: ${data.get('fishType')}\n` +
      `Quantity: ${data.get('quantity')} kg\n` +
      `Delivery Town: ${data.get('town')}\n` +
      `Preferred Transport: ${data.get('transport')}\n` +
      `Notes: ${data.get('notes') || 'None'}`
    );

    msg.textContent = "Thanks! Opening WhatsApp so you can send your order directly to us.";
    msg.classList.add('show', 'success');

    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');

    form.reset();
    setTimeout(() => msg.classList.remove('show'), 6000);
  });

});
