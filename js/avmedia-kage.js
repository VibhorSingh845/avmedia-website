// AVmedia content behavior; ThreeUI owns the authored scene and navigation.
document.querySelectorAll('.stat-box .result-value').forEach(element => {
 const match=element.textContent.trim().match(/^(28|5×|100%)\s+(.+)$/);
 if(match){element.textContent='';const strong=document.createElement('strong');strong.textContent=match[1];element.append(strong,document.createTextNode(match[2]));}
});
document.querySelectorAll('.process-card').forEach((card,i)=>card.dataset.les=String(i));
document.querySelectorAll('[data-chip]').forEach((chip,i)=>{
 chip.tabIndex=0;chip.setAttribute('role','link');
 const ids=['gate','services','system','results'];
 const go=()=>document.getElementById(ids[i])?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 chip.addEventListener('click',go);chip.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go();}});
});
