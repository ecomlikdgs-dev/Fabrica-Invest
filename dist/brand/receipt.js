(function () {
  'use strict';
  let receipt;
  try { receipt = JSON.parse(sessionStorage.getItem('fabrica_enquiry') || 'null'); } catch (_) {}
  if (!receipt || !receipt.submitted || !receipt.reference || !receipt.order) return;
  document.getElementById('receiptTitle').textContent = 'Your enquiry is received.';
  document.getElementById('receiptIntro').textContent = 'Thank you. Fabrica Invest will review your request and contact you to confirm availability, the final price and payment details.';
  document.getElementById('receiptSummary').hidden = false;
  document.getElementById('receiptReference').textContent = receipt.reference;
  document.getElementById('receiptPackage').textContent = receipt.order.label;
  document.getElementById('receiptPrice').textContent = receipt.order.price;
  document.getElementById('paymentOptions').hidden = false;
  document.getElementById('paymentOptions').href = '/payment/' + (receipt.order.query ? '?' + receipt.order.query : '');
  function trackReceipt() {
    const marker = 'fabrica_lead_tracked_' + receipt.reference;
    try { if (sessionStorage.getItem(marker)) return; } catch (_) {}
    const fields = {form_name:'orders', offer_id:receipt.order.id, offer_type:receipt.order.kind};
    if (receipt.order.price.startsWith('$')) { fields.currency = 'USD'; fields.value = Number(receipt.order.price.replace(/[^\d.]/g, '')); }
    else if (receipt.order.price.includes('DH')) { fields.currency = 'MAD'; fields.value = Number(receipt.order.price.replace(/[^\d.]/g, '')); }
    if (window.FabricaAnalytics?.track('generate_lead', fields)) {
      try { sessionStorage.setItem(marker, '1'); } catch (_) {}
    }
  }
  document.addEventListener('fabrica:analytics-ready', trackReceipt);
  trackReceipt();
})();
