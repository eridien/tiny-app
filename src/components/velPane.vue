<template lang='pug'>
#velPane(style="position:relative;")
  #bar(:style="{position:'absolute',                    \
               top:`${barTop}px`, height:`${barHgt}px`, \
               marginLeft:'11%', width:'75%',           \
               backgroundColor:'#c44'}")

  #thumb(
      :style="{border:`${THUMB_BRDR}px solid  black`,  \
               borderRadius:'12%/50%',                 \
               position:'absolute',                    \
               top:   `${thumbTop}px`,                 \
               height:`${THUMB_INNER}px`,              \
               marginLeft:'5%', width:'80%',           \
               backgroundColor:'gray'}")
</template>

<script setup>
  import {ref, watch, onMounted, inject } from 'vue'

  const evtBus = inject('evtBus'); 

  const THUMB_BRDR  = 5;
  const THUMB_INNER = 40;
  const THUMB_HGT   = THUMB_INNER + 2*THUMB_BRDR;
  const thumbTop    = ref(0);
  const barTop      = ref(0);
  const barHgt      = ref(0);

  // 0 to 100%
  const vel  = ref(0); 

  const stopAllPropogation = (event) => {
    if(!event) return;
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  onMounted(async () => { 
    const paneEle  = document.getElementById('velPane');
    const barEle   = document.getElementById('bar');
    const thumbEle = document.getElementById('thumb');

    let paneHgt = paneEle.offsetHeight;
    let travel  = paneHgt - THUMB_HGT;
    
    const drawSlider = () => {
      barTop.value   = paneHgt
                         - travel*vel.value
                         - THUMB_HGT/2;
      barHgt.value   = paneHgt -  barTop.value;
      thumbTop.value = barTop.value - (THUMB_HGT/2);
    };

    addEventListener('resize', () => {
      paneHgt = paneEle.offsetHeight;
      travel  = paneHgt - THUMB_HGT;
      vel.value = 0;
      drawSlider();
      evtBus.emit('stop');
    });      

    let clickStarted = false;

    paneEle.addEventListener("touchstart", 
      (event) => {
        stopAllPropogation();
        clickStarted = true;
      },
      {passive:false, capture:true}
    );

    paneEle.addEventListener("touchend", 
      () => {
        stopAllPropogation();
        if(clickStarted) {
          evtBus.emit('stop');
          clickStarted = false;
        }
      },
      {passive:false, capture:true}
    );

    paneEle.addEventListener("touchmove", 
      (event) => {
        stopAllPropogation(event);
        clickStarted = false;

        let touch = null;
        for(let chgdTouch of event.changedTouches) {
          if(chgdTouch.target == paneEle  ||
             chgdTouch.target == barEle ||
             chgdTouch.target == thumbEle) 
            touch = chgdTouch;
        }
        if(touch == null) return;

        vel.value = (paneHgt - (touch.pageY - THUMB_HGT)) 
                             / paneHgt;
        vel.value = Math.max(0, 
                        Math.min(vel.value, 1));
        drawSlider();
        evtBus.emit('vel', Math.round(vel.value * 100));
      }, 
      {passive:false, capture:true}
    );

    evtBus.on('stop', () => {
      vel.value = 0;
      drawSlider();
    });

    drawSlider(0);
  });
</script>
