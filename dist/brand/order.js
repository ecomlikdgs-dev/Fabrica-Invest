(function () {
  'use strict';
  const order = window.fabricaOrder(location.search);
  const needsRequest = order.kind === 'enquiry';
  document.getElementById('osPlan').textContent = needsRequest ? 'Tell us what you need' : order.label;
  document.getElementById('osPrice').textContent = needsRequest ? 'Price on request' : order.price;
  document.getElementById('orderSum').hidden = false;
  const form = document.getElementById('leadForm');
  const name = document.getElementById('name');
  const phone = document.getElementById('phone');
  const code = document.getElementById('countryCode');
  const email = document.getElementById('email');
  const request = document.getElementById('request');
  const payment = document.getElementById('preferredPayment');
  const button = document.getElementById('submitBtn');
  const error = document.getElementById('submitError');
  const ready = document.getElementById('whatsappReady');
  document.getElementById('requestField').hidden = !needsRequest;
  request.required = needsRequest;
  const requestedPayment = new URLSearchParams(location.search).get('payment');
  if (Array.from(payment.options).some(option => option.value === requestedPayment)) payment.value = requestedPayment;
  // Retire the previous checkout's receipt; current contact details stay in this page only.
  try { sessionStorage.removeItem('fabrica_enquiry'); } catch (_) {}
  const reference = 'FI-' + (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  let started = false;
  function showError(input, id, show) {
    input.classList.toggle('error', show);
    input.setAttribute('aria-invalid', String(show));
    input.setAttribute('aria-describedby', id);
    document.getElementById(id).classList.toggle('show', show);
  }
  name.addEventListener('input', () => showError(name, 'nameError', false));
  email.addEventListener('input', () => showError(email, 'emailError', false));
  request.addEventListener('input', () => showError(request, 'requestError', false));
  phone.addEventListener('input', () => { phone.value = phone.value.replace(/[^\d\s()+-]/g, ''); showError(phone, 'phoneError', false); });
  form.addEventListener('focusin', () => {
    if (!started) started = !!window.FabricaAnalytics?.track('form_start', {form_name:'orders', offer_id:order.id, offer_type:order.kind});
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const country = code.value.replace(/\D/g, '');
    let digits = phone.value.replace(/\D/g, '');
    if (phone.value.trim().startsWith('+') && digits.startsWith(country)) digits = digits.slice(country.length);
    else if (digits.startsWith('00' + country)) digits = digits.slice(2 + country.length);
    if (country === '212' && /^0\d{9}$/.test(digits)) digits = digits.slice(1);
    const validName = name.value.trim().length >= 2;
    const validPhone = /^\d{6,14}$/.test(digits) && /^\d{1,4}$/.test(country) && (digits + country).length <= 15;
    const validEmail = !email.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const validRequest = !needsRequest || request.value.trim().length >= 2;
    showError(name, 'nameError', !validName);
    showError(phone, 'phoneError', !validPhone);
    showError(email, 'emailError', !validEmail);
    showError(request, 'requestError', !validRequest);
    if (!validName || !validPhone || !validEmail || !validRequest) { (!validName ? name : !validPhone ? phone : !validEmail ? email : request).focus(); return; }
    if (form.elements.namedItem('hp_nonce').value) return;
    error.hidden = true;
    const recipient = (window.FABRICA.whatsapp || '').replace(/\D/g, '');
    if (!/^\d{7,15}$/.test(recipient)) { error.hidden = false; error.focus(); return; }
    const lines = [
      'Hi Fabrica Invest! I would like to place an order.',
      '',
      'Reference: ' + reference,
      'Package: ' + (needsRequest ? request.value.trim() : order.label),
      'Quoted price: ' + (needsRequest ? 'Price on request' : order.price),
      '',
      'Name: ' + name.value.trim(),
      'WhatsApp: +' + country + ' ' + digits
    ];
    if (email.value.trim()) lines.push('Email: ' + email.value.trim());
    lines.push('Preferred payment: ' + payment.selectedOptions[0].textContent.trim());
    const notes = document.getElementById('notes').value.trim();
    if (notes) lines.push('Notes: ' + notes);
    lines.push('', 'Please confirm availability, the final price, payment instructions and how you will deliver my access.');
    const message = lines.join('\n');
    document.getElementById('orderMessage').textContent = message;
    ready.hidden = false;
    // This measures a WhatsApp handoff, not a sent message or a completed purchase.
    window.FabricaAnalytics?.track('whatsapp_order_start', {form_name:'orders', offer_id:order.id, offer_type:order.kind});
    try {
      // Same-tab navigation works on mobile and avoids popup blockers. WhatsApp requires Send.
      location.assign('https://wa.me/' + recipient + '?text=' + encodeURIComponent(message));
    } catch (_) {
      error.hidden = false;
      error.focus();
    }
  });
  button.disabled = false;
})();
