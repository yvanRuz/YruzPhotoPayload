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

/* YRUZPHOTO V79 - Mon histoire : lecture progressive et geste vers le bas.
 * Aucun champ Studio n'est modifie. Le paragraphe source est conserve pour
 * les mises a jour CMS et les traductions FR / EN / PT-BR.
 */
(() => {
  const section = document.querySelector('#histoire');
  if (!section || document.getElementById('yruz-story-reader-style')) return;

  const styles = document.createElement('style');
  styles.id = 'yruz-story-reader-style';
  styles.textContent = `
    #histoire .story-copy .story-read-wrap {
      position:relative; width:100%; max-width:475px;
      border-left:1px solid rgba(184,222,244,.49);
      padding:3px 0 3px 19px;
      border-radius:0 9px 9px 0;
      background:linear-gradient(90deg,rgba(168,208,234,.075),rgba(168,208,234,0) 90%);
    }
    #histoire .story-copy .story-read-wrap::before {
      content:"";position:absolute;top:3px;left:-1px;width:2px;height:39px;
      background:#c8e7fa;border-radius:2px;
    }
    #histoire .story-copy .story-read-body {
      position:relative;max-height:var(--story-closed-height,122px);
      overflow:hidden;transition:max-height .55s cubic-bezier(.22,1,.36,1);
    }
    #histoire .story-copy .story-read-body p {
      max-width:unset;margin:0;color:#ecf4fa;
      font-size:clamp(15px,1.15vw,18px);
      font-weight:450;line-height:1.72;letter-spacing:.004em;
      white-space:pre-line;overflow-wrap:break-word;
    }
    #histoire .story-copy .story-read-wrap.has-more:not(.is-expanded) .story-read-body::after {
      content:"";pointer-events:none;position:absolute;bottom:0;left:0;right:0;
      height:28px;background:linear-gradient(0deg,#091d2b 0%,rgba(9,29,43,0) 100%);
      opacity:.91;
    }
    #histoire .story-middle .story-read-wrap.has-more:not(.is-expanded) .story-read-body::after {
      background:linear-gradient(0deg,#0b2b40 0%,rgba(11,43,64,0) 100%);
    }
    #histoire .story-copy .story-read-wrap.is-expanded .story-read-body {
      max-height:min(34vh,265px);overflow-y:auto;
      scrollbar-width:thin;scrollbar-color:#8dbbd4 transparent;
      padding-right:12px;overscroll-behavior:contain;touch-action:pan-y;
    }
    #histoire .story-copy .story-read-wrap.is-expanded .story-read-body::-webkit-scrollbar {width:4px}
    #histoire .story-copy .story-read-wrap.is-expanded .story-read-body::-webkit-scrollbar-thumb {background:#8dbbd4;border-radius:8px}
    #histoire .story-copy .story-read-toggle {
      appearance:none;display:inline-flex;align-items:center;gap:11px;
      margin:13px 0 0;padding:3px 0;background:none;border:0;
      color:#d5ecfb;cursor:pointer;text-align:left;
      font:700 10px/1.2 Inter,Arial,sans-serif;letter-spacing:1.35px;
      transition:color .22s ease;user-select:none;-webkit-tap-highlight-color:transparent;
      touch-action:none;
    }
    #histoire .story-copy .story-read-toggle:hover {color:white}
    #histoire .story-copy .story-read-toggle:focus-visible {outline:2px solid #b1e4ff;outline-offset:5px;border-radius:3px}
    #histoire .story-copy .story-read-toggle-arrow {
      display:grid;place-items:center;flex:none;width:30px;height:30px;
      border-radius:50%;border:1px solid rgba(192,225,243,.49);
      background:rgba(198,230,250,.07);font-size:17px;font-weight:400;
      transform:translateY(var(--story-pull,0px));
      transition:background .25s,transform .25s cubic-bezier(.22,1,.36,1);
    }
    #histoire .story-copy .story-read-toggle:hover .story-read-toggle-arrow {background:rgba(198,230,250,.17);transform:translateY(calc(var(--story-pull,0px) + 3px))}
    #histoire .story-copy .story-read-wrap.is-expanded .story-read-toggle-arrow {transform:rotate(180deg)}
    #histoire .story-copy .story-read-wrap.is-expanded .story-read-toggle:hover .story-read-toggle-arrow {transform:rotate(180deg) translateY(3px)}
    #histoire .story-copy .story-read-toggle[hidden] {display:none!important}
    @media(max-width:767px) {
      #histoire .story-copy .story-read-wrap {max-width:100%;padding-left:14px}
      #histoire .story-copy .story-read-body p {font-size:14px!important;line-height:1.69!important}
      #histoire .story-copy .story-read-wrap.is-expanded .story-read-body {max-height:min(33vh,240px)}
      #histoire .story-copy .story-read-toggle {margin-top:10px;font-size:9px;letter-spacing:1.1px}
      #histoire .story-copy .story-read-toggle-arrow {width:28px;height:28px}
    }
    @media(prefers-reduced-motion:reduce){
      #histoire .story-copy .story-read-body,
      #histoire .story-copy .story-read-toggle-arrow {transition:none!important}
    }
  `;
  document.head.appendChild(styles);

  const labels = {
    fr: {more:'LIRE LA SUITE',less:'RÉDUIRE',hint:'Cliquer ou glisser vers le bas pour lire la suite'},
    en: {more:'READ MORE',less:'SHOW LESS',hint:'Click or drag down to reveal the rest'},
    'pt-BR': {more:'LER MAIS',less:'MOSTRAR MENOS',hint:'Clique ou arraste para baixo para ler o restante'}
  };
  const locale = () => {
    const code = window.YRUZ_LANG?.current?.() || document.documentElement.lang;
    return code === 'pt-BR' || code === 'en' ? code : 'fr';
  };
  const readers = [];
  const request = (() => {
    let ticket = 0;
    const pending = new Set();
    return callback => {
      pending.add(callback);
      if (ticket) return;
      ticket = requestAnimationFrame(() => {
        ticket = 0;
        const callbacks = [...pending];
        pending.clear();
        callbacks.forEach(fn => fn());
      });
    };
  })();

  section.querySelectorAll('.story-copy').forEach((copy, index) => {
    const paragraph = copy.querySelector('p');
    if (!paragraph || paragraph.closest('.story-read-wrap')) return;
    const shell = document.createElement('div');
    shell.className = 'story-read-wrap';
    const body = document.createElement('div');
    body.className = 'story-read-body';
    body.id = `yruz-story-text-${index+1}`;
    paragraph.before(shell);
    shell.appendChild(body);
    body.appendChild(paragraph);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'story-read-toggle';
    button.hidden = true;
    button.setAttribute('aria-controls',body.id);
    button.setAttribute('aria-expanded','false');
    const arrow = document.createElement('span');
    arrow.className = 'story-read-toggle-arrow';
    arrow.textContent = '↓';
    arrow.setAttribute('aria-hidden','true');
    const label = document.createElement('span');
    label.className = 'story-read-toggle-label';
    button.append(arrow,label);
    shell.appendChild(button);

    let expanded = false;
    let downY = null;
    let blockedClickUntil = 0;
    const updateLabel = () => {
      const dictionary=labels[locale()];
      label.textContent=expanded ? dictionary.less : dictionary.more;
      button.setAttribute('aria-label',expanded ? dictionary.less : dictionary.hint);
    };
    const setExpanded = value => {
      expanded=Boolean(value);
      shell.classList.toggle('is-expanded',expanded);
      button.setAttribute('aria-expanded',String(expanded));
      if (!expanded) body.scrollTop=0;
      updateLabel();
    };
    const recalculate = () => {
      const lineHeight = parseFloat(getComputedStyle(paragraph).lineHeight) || 25;
      const closedHeight = Math.ceil(lineHeight * (window.innerWidth <= 767 ? 3 : 4));
      body.style.setProperty('--story-closed-height',`${closedHeight}px`);
      const needsReveal = paragraph.scrollHeight > closedHeight + 7;
      shell.classList.toggle('has-more',needsReveal);
      button.hidden = !needsReveal;
      if (!needsReveal && expanded) setExpanded(false);
      updateLabel();
    };
    button.addEventListener('click',() => {
      if (performance.now() < blockedClickUntil) return;
      setExpanded(!expanded);
    });
    button.addEventListener('pointerdown',event => {
      if (event.button !== 0) return;
      downY=event.clientY;
      button.setPointerCapture?.(event.pointerId);
    });
    button.addEventListener('pointermove',event => {
      if(downY===null)return;
      const dy = Math.max(-34,Math.min(34,event.clientY-downY));
      arrow.style.setProperty('--story-pull',`${Math.max(0,dy)}px`);
    });
    button.addEventListener('pointerup',event => {
      if(downY===null)return;
      const dy=event.clientY-downY;
      downY=null;
      arrow.style.removeProperty('--story-pull');
      if ((!expanded && dy > 26) || (expanded && dy < -26)) {
        blockedClickUntil=performance.now()+350;
        setExpanded(!expanded);
      }
    });
    button.addEventListener('pointercancel',() => {downY=null;arrow.style.removeProperty('--story-pull')});
    const observer=new MutationObserver(() => request(recalculate));
    observer.observe(paragraph,{subtree:true,childList:true,characterData:true});
    readers.push({recalculate,updateLabel});
  });
  if (!readers.length) return;
  window.addEventListener('resize',() => readers.forEach(reader=>request(reader.recalculate)),{passive:true});
  window.addEventListener('yruz:language-change',() => readers.forEach(reader => {
    reader.updateLabel();request(reader.recalculate);
  }));
  request(() => readers.forEach(reader=>reader.recalculate()));
})();
