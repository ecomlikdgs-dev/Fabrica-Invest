(function(){
  const order=window.fabricaOrder(location.search);
  document.getElementById('osPlan').textContent=order.label;
  document.getElementById('osPrice').textContent=order.price;
  document.getElementById('orderSum').hidden=false;
  const form=document.getElementById('leadForm'),name=document.getElementById('name'),phone=document.getElementById('phone'),code=document.getElementById('countryCode');
  function showError(input,id,show){input.classList.toggle('error',show);input.setAttribute('aria-invalid',String(show));document.getElementById(id).classList.toggle('show',show);input.setAttribute('aria-describedby',id);}
  name.addEventListener('input',()=>showError(name,'nameError',false));
  phone.addEventListener('input',()=>{phone.value=phone.value.replace(/[^\d\s()-]/g,'');showError(phone,'phoneError',false);});
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const validName=name.value.trim().length>=2;
    const digits=phone.value.replace(/\D/g,'');
    const country=code.value.replace(/\D/g,'');
    const validPhone=/^\d{6,14}$/.test(digits) && /^\d{1,4}$/.test(country) && (digits+country).length<=15;
    showError(name,'nameError',!validName);showError(phone,'phoneError',!validPhone);
    if(!validName || !validPhone){(!validName?name:phone).focus();return;}
    if(document.getElementById('hp_nonce').value)return;
    try{sessionStorage.setItem('fabrica_enquiry',JSON.stringify({name:name.value.trim(),phone:'+'+country+' '+digits,order:order}));}catch{}
    location.assign('/payment/'+(order.query?'?'+order.query:''));
  });
})();
