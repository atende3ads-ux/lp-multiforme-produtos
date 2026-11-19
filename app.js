'use strict';
const cards=[...document.querySelectorAll('.product')];
const filters=[...document.querySelectorAll('[data-filter]')];
const productSelect=document.getElementById('product');
window.dataLayer=window.dataLayer||[];
function track(event,detail={}){window.dataLayer.push({event,...detail});}
function filterProducts(category){filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));let count=0;cards.forEach(card=>{card.hidden=category!=='Todos'&&card.dataset.category!==category;if(!card.hidden)count++;});document.getElementById('results').textContent=count+(count===1?' produto exibido':' produtos exibidos');}
filters.forEach(b=>b.addEventListener('click',()=>{filterProducts(b.dataset.filter);track('product_filter',{product_category:b.dataset.filter});}));
document.querySelectorAll('[data-product]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();productSelect.value=el.dataset.product;track('quote_intent',{product_name:el.dataset.product});document.getElementById('cotacao').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});setTimeout(()=>productSelect.focus({preventScroll:true}),250);}));
document.querySelectorAll('.product-nav a').forEach(el=>el.addEventListener('click',()=>filterProducts('Todos')));
document.querySelectorAll('[data-whatsapp]').forEach(el=>el.addEventListener('click',()=>track('whatsapp_click',{placement:el.dataset.whatsapp,product_name:productSelect.value||'Não informado'})));
// Preserve campaign attribution locally in memory. Personal details are never sent to dataLayer.
const params=new URLSearchParams(location.search);const attribution={};['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid'].forEach(k=>{if(params.has(k))attribution[k]=params.get(k).slice(0,250);});
const productRoutes={pias:['pias','Pias em inox sob medida.','pia'],bancadas:['bancadas','Bancadas em inox sob medida.','bancada'],coifas:['coifas','Coifas em inox para o seu projeto.','coifa'],fogoes:['fogoes','Fogões industriais para sua cozinha.','fogao'],refrigeracao:['refrigeracao','Balcões refrigerados para sua operação.','balcao'],corrimaos:['corrimaos','Corrimãos em inox sob medida.','corrimao']};
const route=productRoutes[params.get('produto')];if(route){const card=document.getElementById(route[0]);productSelect.value=card.querySelector('h3').textContent;document.querySelector('h1').textContent=route[1];document.getElementById('heroImage').src='assets/'+route[2]+'.webp';document.getElementById('heroImage').alt=productSelect.value+' da Multiforme Inox';document.querySelector('.image-caption strong').textContent=productSelect.value;document.querySelector('.products').prepend(card);}
document.getElementById('quoteForm').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;const city=document.getElementById('city').value.trim();const name=document.getElementById('name').value.trim();const phoneInput=document.getElementById('phone');const phone=phoneInput.value.trim();const digits=phone.replace(/\D/g,'');phoneInput.setCustomValidity(digits.length>=10&&digits.length<=15?'':'Informe um telefone válido com DDD.');if(!phoneInput.reportValidity())return;const message=['Olá! Gostaria de solicitar uma cotação na Multiforme Inox.','Produto: '+productSelect.value,'Nome: '+name,'Telefone: '+phone,'Cidade/UF: '+city,attribution.utm_campaign?'Campanha: '+attribution.utm_campaign:''].filter(Boolean).join('\n');track('whatsapp_click',{placement:'form',product_name:productSelect.value,...attribution});const url='https://wa.me/5562991891986?text='+encodeURIComponent(message);window.open(url,'_blank','noopener');const status=document.getElementById('formStatus');status.replaceChildren(document.createTextNode('Continue no WhatsApp para enviar a mensagem. Se a janela não abrir, '));const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.textContent='abra a conversa aqui';status.append(link);});

document.getElementById('phone').addEventListener('input',e=>e.target.setCustomValidity(''));

// Review anonymized customer screenshots without exposing original attachments.
const testimonialTrack=document.getElementById('testimonialTrack');
function moveTestimonials(direction){const card=testimonialTrack.querySelector('.testimonial-card');testimonialTrack.scrollBy({left:direction*(card.getBoundingClientRect().width+parseFloat(getComputedStyle(testimonialTrack).gap)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
document.getElementById('testimonialsPrev').addEventListener('click',()=>moveTestimonials(-1));
document.getElementById('testimonialsNext').addEventListener('click',()=>moveTestimonials(1));
const testimonialDialog=document.getElementById('testimonialDialog');let testimonialOpener;
document.querySelectorAll('[data-testimonial]').forEach(button=>button.addEventListener('click',()=>{testimonialOpener=button;document.getElementById('testimonialFullImage').src='assets/testimonial-'+button.dataset.testimonial+'.png';testimonialDialog.showModal();}));
document.getElementById('closeTestimonial').addEventListener('click',()=>testimonialDialog.close());
testimonialDialog.addEventListener('click',e=>{if(e.target===testimonialDialog){const box=testimonialDialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)testimonialDialog.close();}});
testimonialDialog.addEventListener('close',()=>{if(testimonialOpener)testimonialOpener.focus({preventScroll:true});});
