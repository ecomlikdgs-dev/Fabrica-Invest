(function () {
  'use strict';
  const order = window.fabricaOrder(location.search);
  document.getElementById('osPlan').textContent = order.label;
  document.getElementById('osPrice').textContent = order.price;
  document.getElementById('orderSum').hidden = false;
  const form = document.getElementById('leadForm');
  const name = document.getElementById('name');
  const phone = document.getElementById('phone');
  const code = document.getElementById('countryCode');
  const email = document.getElementById('email');
  const button = document.getElementById('submitBtn');
  const label = button.querySelector('.btn-text');
  const error = document.getElementById('submitError');
  const reference = 'FI-' + (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const currency = order.price.includes('DH') ? 'MAD' : order.price.startsWith('$') ? 'USD' : '';
  const metadata = {order_reference:reference, offer_type:order.kind, offer_id:order.id, package_name:order.label, quoted_price:order.price, currency:currency};
  Object.entries(metadata).forEach(([field, value]) => { form.elements.namedItem(field).value = value; });
  let busy = false;
  let started = false;
  function showError(input, id, show) {
    input.classList.toggle('error', show);
    input.setAttribute('aria-invalid', String(show));
    input.setAttribute('aria-describedby', id);
    document.getElementById(id).classList.toggle('show', show);
  }
  name.addEventListener('input', () => showError(name, 'nameError', false));
  email.addEventListener('input', () => showError(email, 'emailError', false));
  phone.addEventListener('input', () => { phone.value = phone.value.replace(/[^\d\s()-]/g, ''); showError(phone, 'phoneError', false); });
  form.addEventListener('focusin', () => {
    if (!started) started = !!window.FabricaAnalytics?.track('form_start', {form_name:'orders', offer_id:order.id, offer_type:order.kind});
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const digits = phone.value.replace(/\D/g, '');
    const country = code.value.replace(/\D/g, '');
    const validName = name.value.trim().length >= 2;
    const validPhone = /^\d{6,14}$/.test(digits) && /^\d{1,4}$/.test(country) && (digits + country).length <= 15;
    const validEmail = !email.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    showError(name, 'nameError', !validName);
    showError(phone, 'phoneError', !validPhone);
    showError(email, 'emailError', !validEmail);
    if (!validName || !validPhone || !validEmail) { (!validName ? name : !validPhone ? phone : email).focus(); return; }
    if (form.elements.namedItem('hp_nonce').value) return;
    error.hidden = true;
    busy = true;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    label.textContent = 'Sending your enquiry…';
    const data = new URLSearchParams(new FormData(form));
    data.set('name', name.value.trim());
    data.set('phone', '+' + country + ' ' + digits);
    data.set('country_code', '+' + country);
    data.set('email', email.value.trim());
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:data.toString(), signal:controller.signal});
      if (!response.ok) throw new Error('Submission rejected');
      try {
        sessionStorage.setItem('fabrica_enquiry', JSON.stringify({order:order, reference:reference, submitted:true, preferredPayment:form.elements.namedItem('preferred_payment').value, createdAt:Date.now()}));
      } catch (_) {}
      location.assign('/order-received/');
    } catch (_) {
      error.hidden = false;
      error.focus();
      busy = false;
      button.disabled = false;
      button.removeAttribute('aria-busy');
      label.textContent = 'Send enquiry';
    } finally { clearTimeout(timer); }
  });
})();
