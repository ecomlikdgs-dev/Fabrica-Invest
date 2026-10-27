(function () {
  'use strict';
  // Old confirmation links lead back to the current WhatsApp ordering flow.
  let previous;
  try {
    previous = JSON.parse(sessionStorage.getItem('fabrica_enquiry') || 'null');
    sessionStorage.removeItem('fabrica_enquiry');
  } catch (_) {}
  const query = previous && previous.order && typeof previous.order.query === 'string'
    ? '?' + previous.order.query : location.search;
  const order = window.fabricaOrder(query);
  document.getElementById('continueOrder').href = '/form/' + (order.query ? '?' + order.query : '');
})();
