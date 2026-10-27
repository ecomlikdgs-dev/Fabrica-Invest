(function () {
  'use strict';
  const id = window.FABRICA && window.FABRICA.analyticsId;
  if (!/^G-[A-Z0-9]+$/.test(id || '')) return;
  const storageKey = 'fabrica_privacy_v1';
  const denied = {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'};
  let choice = {analytics:false, demographics:false};
  let saved = false;
  let loaded = false;
  try {
    const previous = JSON.parse(localStorage.getItem(storageKey) || 'null');
    const age = Date.now() - Number(previous && previous.updatedAt);
    if (previous && age >= 0 && age < 180 * 86400000) {
      choice = {analytics:previous.analytics === true, demographics:previous.analytics === true && previous.demographics === true};
      saved = true;
    }
  } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', denied);

  function pageContext() {
    const clean = new URL(location.origin + location.pathname);
    const params = new URLSearchParams(location.search);
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','dclid','gbraid','wbraid'].forEach(key => {
      const value = params.get(key);
      if (value && value.length < 200 && !/@|\d[\d\s()+-]{7,}/.test(value)) clean.searchParams.set(key, value);
    });
    let referrer = '';
    try { const ref = new URL(document.referrer); referrer = ref.origin + ref.pathname; } catch (_) {}
    return {page_location:clean.href, page_referrer:referrer, page_title:document.title};
  }
  function clearCookies() {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)|^_gid$|^_gat/.test(name)) return;
      ['', '; domain=' + location.hostname, '; domain=.' + location.hostname].forEach(domain => {
        document.cookie = name + '=; Max-Age=0; path=/' + domain + '; SameSite=Lax';
      });
    });
  }
  function apply(previousAnalytics) {
    window['ga-disable-' + id] = !choice.analytics;
    const audience = choice.analytics && choice.demographics;
    window.gtag('consent', 'update', {
      analytics_storage:choice.analytics ? 'granted' : 'denied',
      ad_storage:audience ? 'granted' : 'denied',
      ad_user_data:audience ? 'granted' : 'denied',
      ad_personalization:audience ? 'granted' : 'denied'
    });
    if (!choice.analytics) { clearCookies(); return; }
    const config = Object.assign(pageContext(), {allow_google_signals:audience, allow_ad_personalization_signals:audience, cookie_flags:'SameSite=Lax;Secure'});
    if (!loaded) {
      loaded = true;
      window.gtag('js', new Date());
      window.gtag('config', id, config);
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      document.head.append(script);
    } else {
      window.gtag('config', id, Object.assign(config, {send_page_view:false}));
      if (!previousAnalytics) window.gtag('event', 'page_view', pageContext());
    }
    document.dispatchEvent(new Event('fabrica:analytics-ready'));
  }
  const events = new Set(['select_offer','form_start','whatsapp_order_start','whatsapp_click','payment_method_select']);
  window.FabricaAnalytics = Object.freeze({track:function (event, fields) {
    if (!choice.analytics || !loaded || !events.has(event)) return false;
    const source = fields || {};
    const safe = {send_to:id, transport_type:'beacon'};
    if (/^[a-z0-9_-]{1,40}$/i.test(source.offer_id || '')) safe.offer_id = source.offer_id;
    if (['plan','offer','bundle','enquiry'].includes(source.offer_type)) safe.offer_type = source.offer_type;
    if (['USD','MAD'].includes(source.currency)) safe.currency = source.currency;
    if (typeof source.value === 'number' && Number.isFinite(source.value) && source.value >= 0 && source.value <= 1000000) safe.value = source.value;
    if (['cih','bank','cashplus','wise','cash','paypal','binance','usdt','redotpay','discuss'].includes(source.payment_method)) safe.payment_method = source.payment_method;
    if (source.form_name === 'orders') safe.form_name = 'orders';
    window.gtag('event', event, safe);
    return true;
  }});
  const banner = document.createElement('section');
  banner.className = 'analytics-consent';
  banner.setAttribute('aria-labelledby', 'analyticsConsentTitle');
  banner.innerHTML = '<div><h2 id="analyticsConsentTitle">Your privacy choices</h2><p>Optional analytics help us understand visits and countries. Google signals can also provide aggregated audience demographics using Google account advertising data. Choose what to allow. <a href="/privacy/">Privacy policy</a></p></div><div class="consent-actions"><button type="button" data-consent="all">Accept all</button><button type="button" data-consent="none">Reject optional</button><button type="button" data-consent="settings">Choose settings</button></div>';
  banner.hidden = saved;
  document.body.append(banner);
  const dialog = document.createElement('dialog');
  dialog.className = 'privacy-dialog';
  dialog.setAttribute('aria-labelledby', 'privacySettingsTitle');
  dialog.innerHTML = '<h2 id="privacySettingsTitle">Privacy settings</h2><p>The order form works with optional analytics turned off.</p><label><input id="allowAnalytics" type="checkbox"><span><b>Website analytics</b><small>Page views, countries, devices and WhatsApp order starts.</small></span></label><label><input id="allowDemographics" type="checkbox"><span><b>Audience demographics</b><small>Google signals may provide aggregated age ranges, gender and interests using Google account advertising data. This requires website analytics.</small></span></label><div class="privacy-dialog-actions"><button type="button" data-privacy="save">Save choices</button><button type="button" data-privacy="cancel">Cancel</button></div>';
  document.body.append(dialog);
  const analytics = dialog.querySelector('#allowAnalytics');
  const demographics = dialog.querySelector('#allowDemographics');
  let previousFocus = null;
  function openSettings() {
    previousFocus = document.activeElement;
    analytics.checked = choice.analytics;
    demographics.checked = choice.demographics;
    demographics.disabled = !analytics.checked;
    if (!dialog.open) dialog.showModal();
  }
  function save(next) {
    const previousAnalytics = choice.analytics;
    choice = {analytics:!!next.analytics, demographics:!!next.analytics && !!next.demographics};
    try { localStorage.setItem(storageKey, JSON.stringify(Object.assign({}, choice, {updatedAt:Date.now()}))); } catch (_) {}
    banner.hidden = true;
    apply(previousAnalytics);
  }
  analytics.addEventListener('change', () => { demographics.disabled = !analytics.checked; if (!analytics.checked) demographics.checked = false; });
  banner.addEventListener('click', event => {
    const button = event.target.closest('button[data-consent]');
    if (!button) return;
    if (button.dataset.consent === 'settings') { openSettings(); return; }
    const all = button.dataset.consent === 'all';
    save({analytics:all, demographics:all});
  });
  dialog.addEventListener('click', event => {
    const button = event.target.closest('button[data-privacy]');
    if (!button) return;
    if (button.dataset.privacy === 'save') save({analytics:analytics.checked, demographics:demographics.checked});
    dialog.close();
  });
  dialog.addEventListener('close', () => { if (previousFocus && previousFocus.isConnected) previousFocus.focus(); });
  const footer = document.querySelector('footer');
  if (footer) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'privacy-settings-link';
    button.textContent = 'Privacy choices';
    button.addEventListener('click', openSettings);
    footer.append(button);
  }
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;
    try {
      const url = new URL(anchor.href);
      if (url.origin !== location.origin || !/^\/form\/?$/.test(url.pathname)) return;
      const order = window.fabricaOrder(url.search);
      window.FabricaAnalytics.track('select_offer', {offer_id:order.id, offer_type:order.kind});
    } catch (_) {}
  });
  if (saved) apply(false);
})();
