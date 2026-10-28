(() => {
 const section=document.querySelector('#histoire');
 const track=document.querySelector('#storyTrack');
 const meter=document.querySelector('#storyMeter');
 const counter=document.querySelector('#storyNumber');
 if(!section||!track)return;
 const panels=[...track.querySelectorAll('.story-panel')];
 const mq=window.matchMedia('(max-width:767px), (prefers-reduced-motion:reduce)');
 let raf=0,eased=0,target=0;
 function update(){
  raf=0;
  if(mq.matches){track.style.transform='';return}
  const distance=Math.max(1,section.offsetHeight-window.innerHeight);
  target=Math.min(1,Math.max(0,-section.getBoundingClientRect().top/distance));
  eased+=(target-eased)*.095;
  if(Math.abs(target-eased)<.00035)eased=target;
  const progress=eased;
  if(Math.abs(target-eased)>.00035)requestAnimationFrame(schedule);
  track.style.transform=`translate3d(${-progress*(panels.length-1)*window.innerWidth}px,0,0)`;
  if(meter)meter.style.width=`${progress*100}%`;
  if(counter)counter.textContent=`${String(Math.min(panels.length,Math.floor(progress*panels.length)+1)).padStart(2,'0')} / ${String(panels.length).padStart(2,'0')}`;
  panels.forEach((panel,i)=>{
   const offset=i-progress*(panels.length-1);
   const visibility=Math.max(0,1-Math.abs(offset)*.54);
   panel.querySelectorAll('.story-copy h2,.story-copy p,.story-index').forEach((el,j)=>{
    const drift=Math.max(-18,Math.min(18,offset*(j===0?16:10)));
    el.style.opacity=String(.35+visibility*.65);
    el.style.filter=`blur(${((1-visibility)*2.4).toFixed(2)}px)`;
    el.style.transform=`translate3d(0,${(-drift).toFixed(2)}px,0)`;
   });
   panel.querySelectorAll('.story-photo').forEach((el,idx)=>{
    const photoShift=Math.max(-30,Math.min(30,offset*(idx===0?18:14)));
    el.style.setProperty('--story-shift',`${photoShift.toFixed(2)}px`);
    el.style.opacity=String(.48+visibility*.52);
    el.style.filter=`saturate(${(.82+visibility*.18).toFixed(2)}) brightness(${(.82+visibility*.18).toFixed(2)})`;
   });
   panel.querySelectorAll('.story-copy').forEach(el=>el.style.setProperty('--story-text-shift',`${Math.max(-18,Math.min(18,-offset*12)).toFixed(2)}px`));
  });
 }
 const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule);
 mq.addEventListener?.('change',schedule);
 update();
})();
