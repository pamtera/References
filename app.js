const $=s=>document.querySelector(s);let DATA=[],cat='All',tag=null,sel=null;
const norm=s=>s.toLowerCase();const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const catsOf=i=>[...(i.hitman_category?[i.hitman_category]:[]),...i.my_categories].map(norm);
fetch('catalog.json',{cache:'no-cache'}).then(r=>r.json()).then(d=>{DATA=d.sort((x,y)=>(x.id>50?-x.id:x.id)-(y.id>50?-y.id:y.id));build();
 const p=new URLSearchParams(location.hash.slice(1));if(p.get('cat'))cat=p.get('cat');if(p.get('tag'))tag=p.get('tag');if(p.get('q'))$('#q').value=p.get('q');render();
 if(p.get('open')){const i=DATA.find(x=>x.id==p.get('open'));if(i)open(i,p.get('view')||'desktop')}});
function chips(el,list,cur,fn,all){el.innerHTML='';[...(all?[all]:[]),...list].forEach(x=>{const b=document.createElement('button');b.className='chip'+(x===cur?' on':'');b.textContent=x.charAt(0).toUpperCase()+x.slice(1);b.onclick=()=>fn(x);el.append(b)})}
function build(){const c=new Map();DATA.forEach(i=>catsOf(i).forEach(x=>c.set(x,(c.get(x)||0)+1)));
 window.CATS=[...c.entries()].sort((a,b)=>b[1]-a[1]).map(x=>x[0]);window.TAGS=[...new Set(DATA.flatMap(i=>i.my_tags))]}
function render(){chips($('#cats'),CATS,cat==='All'?'All':cat,x=>{cat=(x===cat||x==='All')?'All':x;render()},'All');
 chips($('#tags'),TAGS,tag,x=>{tag=tag===x?null:x;render()});
 const q=norm($('#q').value||'');
 const L=DATA.filter(i=>(cat==='All'||catsOf(i).includes(cat))&&(!tag||i.my_tags.includes(tag))&&(!q||norm(i.title+i.domain+i.my_tags.join(' ')+(i.my_note||'')).includes(q)));
 $('#count').textContent=L.length+' of '+DATA.length+' references';
 $('#grid').innerHTML=L.map(i=>`<button class="card${sel&&sel.id===i.id?' sel':''}" data-id="${i.id}">${i.img.desktop?`<img loading="lazy" src="${i.img.desktop}" alt="Screenshot of ${esc(i.domain)}">`:`<div class="noimg">${esc(i.domain)}</div>`}<div class="m"><b>${esc(i.title)}</b><small>${esc(i.domain)}</small><div class="dots">${i.palette.map(c=>`<i style="background:${c}"></i>`).join('')}</div><div>${i.my_categories.map(t=>`<span class="tag mine">${esc(t)}</span>`).join('')}${i.hitman_category?`<span class="tag">${esc(i.hitman_category)}</span>`:''}</div>${i.my_note?'<div class="mark">has a note</div>':''}</div></button>`).join('');
 document.querySelectorAll('.card').forEach(b=>b.onclick=()=>open(DATA.find(i=>i.id==b.dataset.id)))}
$('#q').oninput=render;
function open(i,view='desktop'){sel=i;const a=$('#detail');a.hidden=false;document.querySelector('.wrap').classList.add('open');
 const can=i.live===true;
 a.innerHTML=`<button class="close" aria-label="Close">×</button><h2>${esc(i.title)}</h2><a href="${i.url}" target="_blank" rel="noopener">${esc(i.domain)} ↗</a>
 <div class="stage"><div class="shot">${i.img.desktop?`<img src="${i.img.desktop}" alt="Screenshot of ${esc(i.domain)}">`:`<div class="noimg">${esc(i.domain)}</div>`}</div>${can&&view!=='shot'?`<iframe src="${i.url}" loading="lazy" referrerpolicy="no-referrer" title="Original site ${esc(i.domain)}"></iframe>`:''}</div>
 ${can?`<div class="tabs"><button data-v="${view==='shot'?'live':'shot'}" class="on">${view==='shot'?'Show live site':'Capture only'}</button></div><p class="small">The original site sits in front of the capture. If it does not load here or looks blank, press “Capture only” or “Open original”.</p>`:'<p class="small">This site is not shown live here (it has not been confirmed to load, or it blocks embedding): you see the capture. To see scrolling and effects, use “Open original”.</p>'}
 ${i.capture_flag?`<p class="mark">${esc(i.capture_flag)}</p>`:''}<p class="small">Thumbnail taken on Oct 27, 2026; the current site may have changed.</p>
 <a class="btn" href="${i.url}" target="_blank" rel="noopener">Open original ↗</a>
 <h3>My categories and tags</h3><div>${i.my_categories.concat(i.my_tags).map(t=>`<span class="tag mine">${esc(t)}</span>`).join('')||'<span class="pend">None chosen yet</span>'}${i.hitman_category?`<span class="tag">Hitman: ${esc(i.hitman_category)}</span>`:''}</div>
 <h3>My note</h3>${i.my_note?`<p class="note">${esc(i.my_note)}</p>`:'<span class="pend">No note yet</span>'}
 <h3>Dominant colors of the capture</h3><div class="sw">${i.palette.map(c=>`<i style="background:${c}" title="${c}"></i>`).join('')}</div><p class="small">Calculated from the capture, approximate. Typeface: not analyzed.</p>`;
 a.querySelector('.close').onclick=()=>{a.hidden=true;sel=null;document.querySelector('.wrap').classList.remove('open');render()};
 a.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>open(i,b.dataset.v));render()}

;(function(){function fit(){document.querySelectorAll('.stage').forEach(function(st){st.style.setProperty('--sc',(st.clientWidth/1280).toFixed(4))})}new MutationObserver(fit).observe(document.body,{childList:true,subtree:true});addEventListener('resize',fit);fit()})();
