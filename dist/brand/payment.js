(function(){
  const order=window.fabricaOrder(location.search);
  document.getElementById('checkoutName').textContent=order.label;
  document.getElementById('checkoutPrice').textContent=order.price;
  const methods=[
    ['cih','CIH Bank','/img/pay/cih.png','Moroccan bank transfer.'],
    ['bank','Other banks','/img/pay/bank.svg','Transfer from any Moroccan bank.'],
    ['cashplus','CashPlus','/img/pay/cashplus.png','Local cash payment through CashPlus.'],
    ['wise','Wise','/img/pay/wise.png','International transfer through Wise.'],
    ['cash','Cash pickup','/img/pay/cash-light.svg','Western Union, MoneyGram or Ria.'],
    ['paypal','PayPal','/img/pay/paypal.png','International payment through PayPal.'],
    ['binance','Binance','/img/pay/binance.png','Crypto payment through Binance.'],
    ['usdt','USDT','/img/pay/usdt.png','Confirm the network and address before transferring.'],
    ['redotpay','RedotPay','/img/pay/redotpay.png','Payment through RedotPay.']
  ];
  let selected='Discuss payment with me';
  let selectedId='discuss';
  function message(){return 'Package: '+order.label+'\nQuoted price: '+order.price+'\nPreferred payment: '+selected+'\nNext: add your contact details and send your order in WhatsApp.';}
  function update(){document.getElementById('checkoutMessage').textContent=message();}
  methods.forEach(([id,title,icon,description])=>{
    const b=document.createElement('button');b.type='button';b.className='checkout-method';b.setAttribute('aria-pressed','false');b.innerHTML='<img src="'+icon+'" alt=""><span></span>';b.querySelector('span').textContent=title;
    b.addEventListener('click',()=>{document.querySelectorAll('.checkout-method').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));selected=title;selectedId=id;document.getElementById('methodTitle').textContent=title;document.getElementById('methodDescription').textContent=description+' Fabrica Invest will provide the confirmed payment instructions.';update();});
    document.getElementById('checkoutMethods').append(b);
  });
  document.getElementById('checkoutContact').textContent='Continue with your details';
  document.getElementById('checkoutNotice').textContent='Your package and payment preference will be included in your WhatsApp order.';
  document.getElementById('checkoutContact').addEventListener('click',()=>{
    const params=new URLSearchParams(order.query);
    params.set('payment',selectedId);
    location.assign('/form/?'+params.toString());
  });
  update();
})();
