// Supply owner-approved contact details here. The preview never uses the
// reference provider's phone number, email, social accounts or payment data.
window.FABRICA = Object.freeze({
  brand: 'Fabrica Invest',
  analyticsId: 'G-Z7F7SVKYRC',
  whatsapp: '212767398411',
  email: '',
  socials: {},
  offerPrices: {"profile-bm": 20, "profile-10": 35, "bm-reinstated-10": 55, "bm-reinstated": 28, "bm-id-50": 20, "bm-new": 10, "bm50-old": 11, "bm-250": 40, "bm-4-250": 129, "bm-4-250-reinstated": 165, "page-new": 12, "page-old": 6, "bm-company-new": 169, "bm-company-old": 219},
  bundlePrices: {"meta-launch": 37, "media-buyer": 62, "growth-stack": 120},
  plans: {
    '1m': {name:'1 Month',mad:'249 DH',usd:'$27'},
    '3m': {name:'3 Months',mad:'599 DH',usd:'$65'},
    '6m': {name:'6 Months',mad:'1,049 DH',usd:'$114'},
    '1y': {name:'1 Year',mad:'1,749 DH',usd:'$190'},
    'lt': {name:'Lifetime',mad:'3,999 DH',usd:'$435'}
  },
  offers: {"facebook": "Facebook Ads account", "instagram": "Instagram Ads account", "whatsapp": "WhatsApp Ads setup", "tiktok": "TikTok Ads account", "snapchat": "Snapchat Ads account", "google": "Google Ads account", "profile-bm": "Profile Reinstated + BM", "profile-10": "Profile \u00b7 10 ad accounts", "bm-reinstated-10": "BM Reinstated \u00b7 10 ad accounts", "bm-reinstated": "BM Reinstated", "bm-id-50": "BM Verified ID \u00b7 $50 limit", "bm-new": "BM New", "bm50-old": "BM50 Old", "bm-250": "BM \u00b7 $250 limit", "bm-4-250": "BM \u00b7 4 ad accounts \u00b7 $250 limit", "bm-4-250-reinstated": "BM Reinstated \u00b7 4 ad accounts \u00b7 $250 limit", "page-new": "New Page Reinstated", "page-old": "Old Page", "bm-company-new": "New BM \u00b7 Company Verified", "bm-company-old": "Old BM \u00b7 Company Verified"},
  bundles: {"meta-launch": "Meta Launch bundle", "media-buyer": "Media Buyer Pack bundle", "growth-stack": "Growth Stack bundle"}
});
window.fabricaOrder = function(search) {
  const params = new URLSearchParams(search);
  const config=window.FABRICA;
  const plan=params.get('plan'),offer=params.get('offer'),bundle=params.get('bundle');
  const cur=localStorage.getItem('fabrica_cur') || 'USD';
  if(plan && config.plans[plan]) return {kind:'plan',id:plan,label:config.plans[plan].name,price:config.plans[plan][cur==='MAD'?'mad':'usd'],query:'plan='+encodeURIComponent(plan)};
  if(offer && config.offers[offer]) return {kind:'offer',id:offer,label:config.offers[offer],price:(config.offerPrices[offer]?'$'+config.offerPrices[offer]:'Price on request'),query:'offer='+encodeURIComponent(offer)};
  if(bundle && config.bundles[bundle]) return {kind:'bundle',id:bundle,label:config.bundles[bundle],price:'$'+config.bundlePrices[bundle],query:'bundle='+encodeURIComponent(bundle)};
  return {kind:'enquiry',id:'',label:'Spy tools & ad accounts',price:'Choose your package',query:''};
};
