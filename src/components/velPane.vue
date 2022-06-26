<template lang='pug'>
#velPane(style="position:relative;")
  #fwdBar(:style="{position:'absolute',                 \
               top:`${fwdBarTop}px`,                    \
               height:`${fwdBarHgt}px`,                 \
               marginLeft:'11%', width:'75%',           \
               backgroundColor:'green'}")

  #revBar(:style="{position:'absolute',                 \
               top:0,                                   \
               height:`${revBarHgt}px`,                 \
               marginLeft:'11%', width:'75%',           \
               backgroundColor:'#a00'}")

  #fwdThumb(
      :style="{border:`${THUMB_BRDR}px solid  black`,  \
               borderRadius:'12%/50%',                 \
               position:'absolute',                    \
               top:   `${fwdThumbTop}px`,              \
               height:`${THUMB_INNER}px`,              \
               marginLeft:'5%', width:'80%',           \
               backgroundColor:'green',                \
               zIndex:dir}")

  #revThumb(
      :style="{border:`${THUMB_BRDR}px solid  black`,  \
               borderRadius:'12%/50%',                 \
               position:'absolute',                    \
               top:   `${revThumbTop}px`,              \
               height:`${THUMB_INNER}px`,              \
               marginLeft:'5%', width:'80%',           \
               backgroundColor:'#a00',                 \
               zIndex:0}")
</template>

<script setup>
  import {ref, onMounted, inject } from 'vue'

  const evtBus = inject('evtBus'); 
  const global = inject('global');

  const THUMB_BRDR  = 5;
  const THUMB_INNER = 40;
  const THUMB_HGT   = THUMB_INNER + 2*THUMB_BRDR;
  const fwdThumbTop = ref(0);
  const fwdBarTop   = ref(0);
  const fwdBarHgt   = ref(0);
  const revThumbTop = ref(global.HDR_HGT);
  const revBarHgt   = ref(0);

  const vel = ref(0); // 0 to 100%

  // 1 => fwd, 0 => stopped, -1 => rev
  const dir = ref(0); 

  const stopAllPropogation = (event) => {
    if(!event) return;
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  onMounted(async () => { 
    const paneEle     = document.getElementById('velPane');
    const fwdThumbEle = document.getElementById('fwdThumb');
    const revThumbEle = document.getElementById('revThumb');
    const fwdBarEle   = document.getElementById('fwdBar');
    const revBarEle   = document.getElementById('revBar');

    let paneHgt = paneEle.offsetHeight;
    let travel  = paneHgt - THUMB_HGT;
    
    const clrSliders = () => {
      fwdBarTop.value   = paneHgt - THUMB_HGT/2 - THUMB_BRDR/2;
      fwdBarHgt.value   = paneHgt - fwdBarTop.value;
      fwdThumbTop.value = fwdBarTop.value - (THUMB_HGT/2);
      revBarHgt.value   = THUMB_HGT/2;
      revThumbTop.value = 0;
    }

    const drawSliders = () => {
      clrSliders();
      if(dir.value == 1) { // fwd
        fwdBarTop.value   = paneHgt
                            - travel*vel.value
                            - THUMB_HGT/2;
        fwdBarHgt.value   = paneHgt -  fwdBarTop.value;
        fwdThumbTop.value = fwdBarTop.value - THUMB_HGT/2;
      }
      else {        // rev
        revBarHgt.value   = travel * vel.value;
        revThumbTop.value = revBarHgt.value;
      }
    };

    addEventListener('resize', () => {
      paneHgt = paneEle.offsetHeight;
      travel  = paneHgt - THUMB_HGT;
      vel.value = 0;
      clrSliders();
      dir.value = 0;
      evtBus.emit('stop');
    });      

    let moved = false;

    const getTouch = (event) => {
      for(let touch of event.changedTouches) {
        if(touch.target == paneEle) 
          return [touch, 0];

        if(touch.target == fwdBarEle   ||
           touch.target == fwdThumbEle)
          return [touch, +1];

        if(touch.target == revBarEle   ||
           touch.target == revThumbEle) 
          return [touch, -1];
      }
      return [null, null];
    }

    let startY = 0;

    paneEle.addEventListener("touchstart", 
      (event) => {
        stopAllPropogation();
        const [touch, d] = getTouch(event);
        if(touch == null) return;
        startY = touch.pageY;
        if(startY > paneHgt - THUMB_HGT || 
           startY < global.HDR_HGT + THUMB_HGT) 
          dir.value = 0;
        moved = false;
      },
      {passive:false, capture:true}
    );

    paneEle.addEventListener("touchmove", 
      (event) => {
        stopAllPropogation(event);
        moved = true;

        const [touch, d] = getTouch(event);
        if(touch == null) return;
        dir.value = d;

        if(dir.value == 0) 
          dir.value = ((touch.pageY - startY) > 0 ? -1 : +1);
        if(dir.value == 1)
          vel.value = (paneHgt - (touch.pageY - THUMB_HGT)); 
        else
          vel.value = (touch.pageY - global.HDR_HGT); 

        // vel.value is limited to 0..1
        vel.value = Math.max(0, 
                    Math.min(vel.value / paneHgt, 1));
        global.vel = vel.value;
        drawSliders();

        // emitted vel is 0 to 100% (0 to 100000)
        const emVal = dir.value * Math.round(vel.value * 88000 + 12000);
        evtBus.emit('vel', emVal);
      }, 
      {passive:false, capture:true}
    );

    paneEle.addEventListener("touchend", 
      () => {
        stopAllPropogation();
        if(!moved || vel.value == 0) {
          evtBus.emit('stop');
        }
      },
      {passive:false, capture:true}
    );
      
    evtBus.on('stop', () => {
      vel.value = 0;
      dir.value = 0;
      clrSliders();
    });

    clrSliders();
    dir.value = 0;
  });
</script>
