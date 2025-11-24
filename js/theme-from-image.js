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

  function applyFromLogo(){
    const img = document.querySelector('.logo-img');
    if(!img) return;
    // if already loaded, compute immediately
    function compute(){
      const avg = averageColorFromImg(img);
      if(avg){
        // choose a lightened bg by mixing with white
        const bg = avg.map((c)=>Math.round(255 - (255-c)*0.92));
        setCSSVars(avg, bg);
      }
    }
    if(img.complete && img.naturalWidth){ compute(); }
    else img.addEventListener('load', compute);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', applyFromLogo);
  else applyFromLogo();
})();
