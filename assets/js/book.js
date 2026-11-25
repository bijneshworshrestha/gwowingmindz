(function(){
  var root=document.querySelector('[data-bv]'); if(!root) return;
  var book=root.querySelector('[data-book]'), leaves=[].slice.call(root.querySelectorAll('[data-leaf]'));
  var single=root.querySelector('[data-single]'), simg=root.querySelector('[data-single-img]');
  var prev=root.querySelector('[data-prev]'), next=root.querySelector('[data-next]'), count=root.querySelector('[data-count]');
  var mq=window.matchMedia('(max-width:719px)');
  var seq=[
    {s:'assets/img/book1/cover.webp',a:'Front cover: Tales of the Heritage Trekkers, The Find on the High Trail, Book 1',l:'Front cover'},
    {s:'assets/img/book1/blank.webp',a:'Inside front cover, blank',l:'Inside front cover'},
    {s:'assets/img/book1/title.webp',a:'Title page: Tales of the Heritage Trekkers, Book 1, The Find on the High Trail, by Bidur Bhattarai and Bijneshwor Shrestha',l:'Title page'},
    {s:'assets/img/book1/authors.webp',a:'About the authors page',l:'About the authors'},
    {s:'assets/img/book1/blank.webp',a:'Inside back cover, blank',l:'Inside back cover'},
    {s:'assets/img/book1/back.webp',a:'Back cover',l:'Back cover'}
  ];
  var labels=['Front cover','Title page and inside cover','About the authors','Back cover'];
  var state=0, idx=0;
  function render(){
    if(mq.matches){
      single.hidden=false;
      simg.src=seq[idx].s; simg.alt=seq[idx].a; count.textContent=seq[idx].l+' ('+(idx+1)+' of 6)';
      prev.disabled=idx===0; next.disabled=idx===seq.length-1; if(idx===seq.length-1) single.setAttribute('data-last',''); else single.removeAttribute('data-last');
    } else {
      single.hidden=true;
      leaves.forEach(function(l,i){l.classList.toggle('is-flipped',i<state)});
      book.setAttribute('data-state',state);
      count.textContent=['Front cover','Inside pages','Inside pages','Back cover'][state];
      prev.disabled=state===0; next.disabled=state===3;
    }
  }
  function go(d){
    if(mq.matches){var n=Math.max(0,Math.min(seq.length-1,idx+d)); if(n===idx)return;
      var cl=d>0?'is-out':'is-out-prev'; simg.classList.add(cl); setTimeout(function(){idx=n;render();simg.classList.remove(cl)},window.matchMedia('(prefers-reduced-motion:reduce)').matches?0:220);
    } else { state=Math.max(0,Math.min(3,state+d)); render(); }
  }
  prev.addEventListener('click',function(){go(-1)}); next.addEventListener('click',function(){go(1)});
  leaves.forEach(function(l){
    var sx=null,w=1,moved=false,flipped=false;
    l.addEventListener('pointerdown',function(e){ if(e.button>0)return; sx=e.clientX; moved=false; flipped=l.classList.contains('is-flipped'); w=l.getBoundingClientRect().width||1; l.setPointerCapture(e.pointerId); });
    l.addEventListener('pointermove',function(e){
      if(sx===null)return; var dx=e.clientX-sx; if(Math.abs(dx)>6&&!moved){moved=true; l.classList.add('dragging'); l.style.zIndex=10;}
      if(!moved)return;
      var prog=flipped?Math.max(0,Math.min(1,dx/w)):Math.max(0,Math.min(1,-dx/w));
      var ang=flipped?-180+180*prog:-180*prog; l.style.transform='rotateY('+ang+'deg)';
    });
    function end(e){
      if(sx===null)return; var dx=e.clientX-sx; sx=null;
      l.classList.remove('dragging'); l.style.transform=''; l.style.zIndex='';
      if(!moved){ go(flipped?-1:1); return; }
      var prog=Math.abs(dx)/w, toward=flipped?dx>0:dx<0;
      if(toward&&prog>0.25) go(flipped?-1:1); else render();
    }
    l.addEventListener('pointerup',end); l.addEventListener('pointercancel',function(){sx=null;l.classList.remove('dragging');l.style.transform='';l.style.zIndex='';render();});
  });
  single.addEventListener('click',function(e){ if(single._sw&&Date.now()-single._sw<400)return; var r=single.getBoundingClientRect(); go(e.clientX<r.left+r.width/2?-1:1); });
  root.addEventListener('keydown',function(e){ if(e.key==='ArrowRight'){go(1);e.preventDefault()} if(e.key==='ArrowLeft'){go(-1);e.preventDefault()} });
  var x0=null; single.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  single.addEventListener('touchend',function(e){ if(x0===null)return; var dx=e.changedTouches[0].clientX-x0; x0=null; if(Math.abs(dx)>40){ single._sw=Date.now(); go(dx<0?1:-1);} });
  (mq.addEventListener?mq.addEventListener('change',render):mq.addListener(render));
  render();
})();
