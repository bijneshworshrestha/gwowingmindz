/* Old one-page links (#pandas, #trekkers, #get, #about) go to the new pages */
(function(){
  var map={'#pandas':'little-red-pandas.html','#trekkers':'heritage-trekkers.html','#get':'about.html#contact','#contact':'about.html#contact','#about':'about.html'};
  if(map[location.hash]) location.replace(map[location.hash]);
})();
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!window.gsap) return;
  var items=gsap.utils.toArray('.cast-b a');
  gsap.from('.hero .eyebrow,.hero h1,.hero .lead,.hero-actions',{y:18,opacity:0,duration:.7,ease:'power2.out',stagger:.12});
  gsap.set(items,{transformOrigin:'50% 80%'});
  var tl=gsap.timeline({delay:.35});
  tl.from(items,{y:34,scale:.82,opacity:0,duration:.75,ease:'back.out(1.7)',stagger:.09});
  tl.to(items,{y:-14,duration:.26,ease:'power2.out',yoyo:true,repeat:1,stagger:.09},'+=.35');   /* one friendly hop, in turn, same for all */
  tl.add(function(){ items.forEach(function(el,i){ gsap.to(el,{rotation:(i%2?1:-1)*1.6,duration:2.4+(i%5)*.18,ease:'sine.inOut',yoyo:true,repeat:-1}); }); });
})();
