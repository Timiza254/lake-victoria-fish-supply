// ===========================================================
// Lake Victoria Fish Supply — v3 interactions
// Every button here does a real, testable thing:
// - opens WhatsApp with a pre-filled message, or
// - submits the order form as a WhatsApp message.
// ===========================================================

const WHATSAPP_NUMBER = '254790267758'; // business WhatsApp number, already in use on the site

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile menu ---- */
  const toggle = document.querySelector('.nav-toggle');
  const closeBtn = document.querySelector('.mobile-menu .close-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const openMenu = () => mobileMenu.classList.add('open');
  const closeMenu = () => mobileMenu.classList.remove('open');
  toggle?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---- Generic WhatsApp buttons (data-wa-message attribute) ---- */
  document.querySelectorAll('[data-wa-message]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsApp(btn.getAttribute('data-wa-message'));
    });
  });

  /* ---- "Request Price" buttons on product cards ---- */
  document.querySelectorAll('[data-request-price]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const fish = btn.getAttribute('data-request-price');
      openWhatsApp(`Hello Lake Victoria Fish Supply, please share today's price for ${fish}.`);
    });
  });

  /* ---- Order form: builds the full WhatsApp message from every field ---- */
  const form = document.getElementById('orderForm');
  const msg = document.getElementById('formMsg');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const get = (name) => (form.elements[name]?.value || '').trim();

    const fullName = get('fullName');
    const phone = get('phone');
    const fishType = get('fishType');
    const quantity = get('quantity');
    const size = get('size');
    const town = get('town');
    const transport = get('transport');
    const dispatchDate = get('dispatchDate');
    const notes = get('notes');

    // Basic required-field check so we never send an empty/broken order
    if (!fullName || !phone || !fishType || !quantity || !town) {
      msg.textContent = 'Please fill in your name, phone, fish type, quantity, and delivery town before sending.';
      msg.classList.remove('success');
      msg.classList.add('show', 'error');
      return;
    }

    const message =
`Hello Lake Victoria Fish Supply,

I would like to place an order.

Name: ${fullName}
Phone: ${phone}
Fish: ${fishType}
Quantity: ${quantity} kg
Size: ${size || 'Not specified'}
Destination: ${town}
Transport: ${transport || 'Not specified'}
Dispatch Date: ${dispatchDate || 'Not specified'}
Additional Instructions: ${notes || 'None'}

Please confirm today's price and availability.`;

    msg.textContent = 'Opening WhatsApp with your order details — just tap send.';
    msg.classList.remove('error');
    msg.classList.add('show', 'success');

    openWhatsApp(message);

    form.reset();
    setTimeout(() => msg.classList.remove('show'), 7000);
  });

});
