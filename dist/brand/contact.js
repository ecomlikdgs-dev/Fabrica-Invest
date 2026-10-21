(function(){
  const cfg=window.FABRICA;
  const dialog=document.createElement('dialog');
  dialog.className='contact-dialog';
  dialog.setAttribute('aria-labelledby','contactTitle');
  dialog.innerHTML='<button class="close-dialog" aria-label="Close contact window" type="button">×</button><span class="dialog-brand">Fabrica Invest</span><h2 id="contactTitle">Let’s talk about your next launch.</h2><p id="contactStatus"></p><textarea aria-label="Your enquiry message" id="contactMessage"></textarea><button type="button" class="btn" id="contactAction"></button>';
  document.body.append(dialog);
  const status=dialog.querySelector('#contactStatus'),message=dialog.querySelector('textarea'),action=dialog.querySelector('#contactAction');
  let lastFocus=null;
  window.openFabricaContact=function(text){
    if(cfg.whatsapp){window.open('https://wa.me/'+cfg.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(text || 'Hi Fabrica Invest! I have a question about your spy tools and advertising accounts.'),'_blank','noopener,noreferrer');return;}
    lastFocus=document.activeElement;
    message.value=text || 'Hi Fabrica Invest! I have a question about your spy tools and advertising accounts.';
    status.textContent=cfg.whatsapp?'Open WhatsApp to review and send your enquiry.':'Our WhatsApp contact details are coming soon. You can copy your enquiry in the meantime.';
    action.textContent=cfg.whatsapp?'Continue to WhatsApp':'Copy enquiry';
    if(!dialog.open) dialog.showModal();
  };
  dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{if(lastFocus && lastFocus.isConnected)lastFocus.focus();});
  action.addEventListener('click',async()=>{
    if(cfg.whatsapp){window.open('https://wa.me/'+cfg.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(message.value),'_blank','noopener,noreferrer');return;}
    try{await navigator.clipboard.writeText(message.value);action.textContent='Enquiry copied';}
    catch{message.focus();message.select();action.textContent='Select and copy the message';}
  });
  document.addEventListener('click',e=>{
    const a=e.target.closest('a');
    if(a && (a.hasAttribute('data-contact') || a.getAttribute('href')?.startsWith('#contact'))){e.preventDefault();window.openFabricaContact();}
  });
  const burger=document.getElementById('burger');
  if(burger){burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-controls','navLinks');burger.addEventListener('click',()=>burger.setAttribute('aria-expanded',document.getElementById('navLinks').classList.contains('show')?'true':'false'));document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>burger.setAttribute('aria-expanded','false')));document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('navLinks').classList.remove('show');burger.setAttribute('aria-expanded','false');}});}
})();
