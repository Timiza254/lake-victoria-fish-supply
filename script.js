// ===========================================================
// Lake Victoria Fish Supply — v3 interactions
// Every button here does a real, testable thing:
// - opens WhatsApp with a pre-filled message, or
// - submits the order form as a WhatsApp message.
// ===========================================================

const WHATSAPP_NUMBER = '254790267758'; // business WhatsApp number, already in use on the site

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const win = window.open(url, '_blank', 'noopener');
  // window.open returns null (or undefined) if the browser blocked the popup —
  // in that case WhatsApp did NOT open, so callers must not claim success.
  return !!win;
}

// Accepts Kenyan formats: 07XXXXXXXX, 01XXXXXXXX, or +2547XXXXXXXX / +2541XXXXXXXX
function isValidKenyanPhone(value) {
  const cleaned = value.replace(/[\s-]/g, '');
  return /^(?:\+254|254|0)(7|1)\d{8}$/.test(cleaned);
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

  /* ---- Product card buttons: "Order Now" (fills form) and "WhatsApp" (opens directly) ---- */
  document.querySelectorAll('.product-card').forEach(card => {
    const fishName = card.getAttribute('data-product');
    const qtyInput = card.querySelector('.qty-input');

    card.querySelector('[data-card-order]')?.addEventListener('click', () => {
      const select = document.getElementById('fishType');
      const qtyField = document.getElementById('quantity');
      if (select) select.value = fishName;
      if (qtyField && qtyInput) qtyField.value = qtyInput.value;
      document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
    });

    card.querySelector('[data-card-whatsapp]')?.addEventListener('click', () => {
      const qty = qtyInput ? qtyInput.value : '';
      const opened = openWhatsApp(`Hello Lake Victoria Fish Supply, I would like to order ${qty} kg of ${fishName}. Please confirm availability and today's price.`);
      if (!opened) {
        alert("Your browser blocked WhatsApp from opening. Please allow pop-ups for this site, or message us directly at +254 790 267758.");
      }
    });
  });

  /* ---- Generic WhatsApp buttons: warn (don't silently fail) if the browser blocked the popup ---- */
  document.querySelectorAll('[data-wa-message]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const opened = openWhatsApp(btn.getAttribute('data-wa-message'));
      if (!opened) {
        alert("Your browser blocked WhatsApp from opening. Please allow pop-ups for this site, or message us directly at +254 790 267758.");
      }
    });
  });

  /* ---- Order form: builds the full WhatsApp message from every field ---- */
  const form = document.getElementById('orderForm');
  const msg = document.getElementById('formMsg');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const get = (name) => (form.elements[name]?.value || '').trim();

    const fullName = get('fullName');
    const email = get('email');
    const phone = get('phone');
    const customerType = get('customerType');
    const fishType = get('fishType');
    const quantity = get('quantity');
    const size = get('size');
    const town = get('town');
    const deliveryOption = get('deliveryOption');
    const transport = get('transport');
    const dispatchDate = get('dispatchDate');
    const notes = get('notes');

    const showError = (text) => {
      msg.textContent = text;
      msg.classList.remove('success');
      msg.classList.add('show', 'error');
    };

    // Required-field check so we never send an empty/broken order
    if (!fullName || !phone || !fishType || !quantity || !town) {
      showError('Please fill in your name, phone, fish type, quantity, and delivery town before sending.');
      return;
    }

    // Kenyan phone format check: 07XXXXXXXX, 01XXXXXXXX, or +2547XXXXXXXX / +2541XXXXXXXX
    if (!isValidKenyanPhone(phone)) {
      showError('Please enter a valid Kenyan phone number, e.g. 07XXXXXXXX or +2547XXXXXXXX.');
      return;
    }

    const message =
`Hello Lake Victoria Fish Supply,

I would like to place an order.

Name: ${fullName}
Phone: ${phone}
Customer Type: ${customerType || 'Not specified'}
Fish: ${fishType}
Quantity: ${quantity} kg
Fish Size: ${size || 'Not specified'}
Destination: ${town}
Delivery Option: ${deliveryOption || 'Not specified'}
Transport: ${transport || 'Not specified'}
Dispatch Date: ${dispatchDate || 'Not specified'}
Additional Notes: ${notes || 'None'}

Please confirm availability and today's price.`;

    const opened = openWhatsApp(message);

    if (!opened) {
      // Never claim success if WhatsApp didn't actually open.
      showError("WhatsApp didn't open — your browser may have blocked the pop-up. Please allow pop-ups for this site and try again, or message us directly at +254 790 267758.");
      return;
    }

    msg.textContent = 'WhatsApp opened with your order details — just tap send to complete your order.';
    msg.classList.remove('error');
    msg.classList.add('show', 'success');

    form.reset();
    setTimeout(() => msg.classList.remove('show'), 8000);
  });

});
