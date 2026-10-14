(() => {
 const $ = id => document.getElementById(id);
 const form = $('cardForm'), rows = $('rows'), notice = $('notice');
 const schemes = {visa:{label:'Visa',logo:'VISA',className:'visa'},mastercard:{label:'Mastercard',logo:'mc',className:''},mir:{label:'МИР',logo:'МИР',className:''},unionpay:{label:'UnionPay',logo:'UnionPay',className:''}};
 const yearSelect = $('year'), now = new Date();
 for(let y=now.getFullYear(); y<=now.getFullYear()+15; y++){const o=document.createElement('option');o.value=String(y);o.textContent=String(y);yearSelect.append(o)}
 let cards=[];
 function digits(value){return value.replace(/\D/g,'').slice(0,16)}
 function formatted(value){return (value.match(/.{1,4}/g)||[]).join(' ')}
 function update(){
  const bank=$('bank').value.trim(), number=digits($('number').value), holder=$('holder').value.trim(), scheme=schemes[$('schemeSelect').value];
  $('previewBank').textContent=bank||'НАЗВАНИЕ БАНКА';
  $('previewNumber').textContent=number?formatted(number).padEnd(19,'•').replace(/\s/g,' ').trim():'•••• •••• •••• ••••';
  if(number.length){$('previewNumber').textContent=formatted(number)+(number.length<16?' '+ '•'.repeat(Math.min(4,16-number.length)): '')}
  $('previewHolder').textContent=holder.toUpperCase()||'ИМЯ ДЕРЖАТЕЛЯ';
  $('previewExpiry').textContent=$('month').value&&yearSelect.value?$('month').value+'/'+yearSelect.value.slice(-2):'MM/YY';
  $('summaryScheme').textContent=scheme.label;
  const logo=$('previewScheme');logo.className='scheme '+scheme.className;logo.textContent='';
  if(scheme.logo==='mc'){const circles=document.createElement('span');circles.className='mc';circles.innerHTML='<i></i><i></i>';logo.append(circles)}else logo.textContent=scheme.logo;
  $('summaryStatus').textContent=form.checkValidity()?'Можно добавить':'Заполнение';
 }
 $('number').addEventListener('input',e=>{const d=digits(e.target.value);e.target.value=formatted(d);update()});
 form.addEventListener('input',update);form.addEventListener('change',update);
 function clearForm(){form.reset();notice.classList.remove('show');update()}
 form.addEventListener('reset',()=>setTimeout(()=>{notice.classList.remove('show');update()},0));
 form.addEventListener('submit',e=>{e.preventDefault();notice.classList.remove('show');const n=digits($('number').value);if(n.length!==16){notice.textContent='Номер должен содержать ровно 16 цифр.';notice.classList.add('show');$('number').focus();return}const month=Number($('month').value),year=Number(yearSelect.value);if(!month||!year){notice.textContent='Выберите месяц и год окончания карты.';notice.classList.add('show');return}if(year<now.getFullYear()||(year===now.getFullYear()&&month<now.getMonth()+1)){notice.textContent='Срок действия карты не может быть в прошлом.';notice.classList.add('show');return}
  cards.unshift({id:Date.now()+Math.random(),bank:$('bank').value.trim(),scheme:schemes[$('schemeSelect').value].label,number:n,holder:$('holder').value.trim(),expiry:$('month').value+'/'+yearSelect.value});render();clearForm();$('summaryStatus').textContent='Карта добавлена';
 });
 function render(){ $('count').textContent=cards.length+' '+(cards.length===1?'запись':cards.length>1&&cards.length<5?'записи':'записей');rows.replaceChildren();if(!cards.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=6;td.innerHTML='<div class="empty"><div class="emptyicon">▤</div><strong>Пока нет добавленных карт</strong>Заполните форму выше, чтобы добавить первую запись.</div>';tr.append(td);rows.append(tr);return}cards.forEach(card=>{const tr=document.createElement('tr');[card.bank,card.scheme,'•••• •••• •••• '+card.number.slice(-4),card.holder,card.expiry].forEach((value,i)=>{const td=document.createElement('td');td.textContent=value;if(i===0)td.className='bankcell';if(i===2)td.className='muted';tr.append(td)});const td=document.createElement('td'),btn=document.createElement('button');btn.className='remove';btn.type='button';btn.textContent='Удалить';btn.setAttribute('aria-label','Удалить карту банка '+card.bank);btn.addEventListener('click',()=>{cards=cards.filter(c=>c.id!==card.id);render()});td.append(btn);tr.append(td);rows.append(tr)})}
 update();
})();
