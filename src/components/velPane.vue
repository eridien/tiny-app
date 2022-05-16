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
               backgroundColor:'green'}")

  #revThumb(
      :style="{border:`${THUMB_BRDR}px solid  black`,  \
               borderRadius:'12%/50%',                 \
               position:'absolute',                    \
               top:   `${revThumbTop}px`,              \
               height:`${THUMB_INNER}px`,              \
               marginLeft:'5%', width:'80%',           \
               backgroundColor:'#a00'}")
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
  let   dir = 0; // 1 => fwd, 0 => stopped, -1 => rev

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
      fwdBarTop.value   = paneHgt - THUMB_HGT/2;
      fwdBarHgt.value   = paneHgt - fwdBarTop.value;
      fwdThumbTop.value = fwdBarTop.value - (THUMB_HGT/2);
      revBarHgt.value   = THUMB_HGT/2;
      revThumbTop.value = 0;
      dir               = 0;
    }

    const drawSliders = () => {
      clrSliders();
      if(dir == 1) { // fwd
        fwdBarTop.value   = paneHgt
                            - travel*vel.value
                            - THUMB_HGT/2;
        fwdBarHgt.value   = paneHgt -  fwdBarTop.value;
        fwdThumbTop.value = fwdBarTop.value - (THUMB_HGT/2);
      }
      else {        // rev
        revBarHgt.value   = travel * vel.value 
                            + global.HDR_HGT;
        revThumbTop.value = global.HDR_HGT - (THUMB_HGT/2);
      }
    };

    addEventListener('resize', () => {
      paneHgt = paneEle.offsetHeight;
      travel  = paneHgt - THUMB_HGT;
      vel.value = 0;
      clrSliders();
      evtBus.emit('stop');
    });      

    let moved = false;

    const getTouch = (event) => {
      for(let chgdTouch of event.changedTouches) {
        if(chgdTouch.target == paneEle     ||
           chgdTouch.target == fwdBarEle   ||
           chgdTouch.target == fwdThumbEle || 
           chgdTouch.target == revBarEle   ||
           chgdTouch.target == revThumbEle) 
          return chgdTouch;
      }
      return null;
    }

    let startY = 0;

    paneEle.addEventListener("touchstart", 
      (event) => {
        stopAllPropogation();
        const touch = getTouch(event);
        if(touch == null) return;
        startY = touch.pageY;
        moved = false;
      },
      {passive:false, capture:true}
    );

    paneEle.addEventListener("touchend", 
      () => {
        stopAllPropogation();
        if(!moved) {
          evtBus.emit('stop');
        }
      },
      {passive:false, capture:true}
    );

    paneEle.addEventListener("touchmove", 
      (event) => {
        stopAllPropogation(event);
        moved = true;

        const touch = getTouch(event);
        if(touch == null) return;

        if(dir == 0) 
          dir = ((touch.pageY - startY) > 0 ? -1 : +1);

        if(dir == 1)
          vel.value = (paneHgt - (touch.pageY - THUMB_HGT)); 
        else
          vel.value = (touch.pageY - global.HDR_HGT); 

        vel.value = Math.max(0, 
                    Math.min(vel.value/paneHgt, 1));

        drawSliders();

        evtBus.emit('vel', 
                     dir * Math.round(vel.value * 1000));
      }, 
      {passive:false, capture:true}
    );

    evtBus.on('stop', () => {
      vel.value = 0;
      clrSliders();
    });

    clrSliders();
  });
</script>
