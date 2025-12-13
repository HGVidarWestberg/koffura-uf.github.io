// Sample the logo image to derive theme colors and set CSS variables.
(function(){
  function setCSSVars(accentRgb, bgRgb){
    document.documentElement.style.setProperty('--accent', `rgb(${accentRgb.join(',')})`);
    // muted: a desaturated darker variant
    const muted = accentRgb.map((c)=>Math.round(c*0.55));
    document.documentElement.style.setProperty('--muted', `rgb(${muted.join(',')})`);
    // background: mix white with accent lightly for subtle tone
    const bg = bgRgb || accentRgb.map((c)=>Math.round(255 - (255-c)*0.85));
    document.documentElement.style.setProperty('--bg', `rgb(${bg.join(',')})`);
  }

  function averageColorFromImg(img){
    try{
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // small sample size for speed
      const w = 60, h = 60;
      canvas.width = w; canvas.height = h;
      ctx.drawImage(img,0,0,w,h);
      const data = ctx.getImageData(0,0,w,h).data;
      let r=0,g=0,b=0,count=0;
      for(let i=0;i<data.length;i+=4){
        const alpha = data[i+3];
        if(alpha < 125) continue; // skip transparent
        r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++;
      }
      if(!count) return null;
      return [Math.round(r/count), Math.round(g/count), Math.round(b/count)];
    }catch(e){
      return null;
    }
  }

  function parseColorString(s){
    if(!s) return null;
    s = s.trim();
    if(s.startsWith('rgb')){
      return s.replace(/[^\d,]/g,'').split(',').map(Number);
    }
    if(s[0] === '#'){
      let hex = s.slice(1);
      if(hex.length === 3) hex = hex.split('').map(h=>h+h).join('');
      return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];
    }
    return null;
  }

  function applyFromLogo(){
    const img = document.querySelector('.logo-img');
    const logoAnchor = document.querySelector('.logo');
    if(!img) return;
    try{ img.crossOrigin = 'anonymous'; }catch(e){}
    console.debug('theme-from-image: logo src:', img.src, 'complete:', img.complete, 'naturalWidth:', img.naturalWidth);
    // mark loading state on logo
    if(logoAnchor) logoAnchor.classList.add('logo-loading');
    function setLogoLoadedState(loaded){
      if(!logoAnchor) return;
      logoAnchor.classList.remove('logo-loading','logo-no-image','logo-has-image');
      logoAnchor.classList.add(loaded ? 'logo-has-image' : 'logo-no-image');
    }
    // if already loaded, compute immediately
    function compute(){
      // Attempt to sample average color but still mark image as present
      const avg = averageColorFromImg(img);
      if(avg){
        const bg = avg.map((c)=>Math.round(255 - (255-c)*0.92));
        setCSSVars(avg, bg);
      }else{
        // fallback if sampling fails but image exists
        const styles = getComputedStyle(document.documentElement);
        const accentStr = styles.getPropertyValue('--accent') || '';
        const accentRgb = parseColorString(accentStr) || [46,133,85];
        const bg = accentRgb.map((c)=>Math.round(255 - (255-c)*0.92));
        setCSSVars(accentRgb, bg);
      }
      setLogoLoadedState(true);
    }
    function onError(){ setLogoLoadedState(false); }
    if(img.complete && img.naturalWidth){ compute(); }
    else{
      img.addEventListener('load', compute);
      img.addEventListener('error', onError);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', applyFromLogo);
  else applyFromLogo();
})();
