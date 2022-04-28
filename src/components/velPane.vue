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
  import {ref, watch, onMounted} from 'vue'

  const props = defineProps(['reset']);
  const emit  = defineEmits(['stop','vel']);

  const THUMB_BRDR  = 5;
  const THUMB_INNER = 40;
  const THUMB_HGT   = THUMB_INNER + 2*THUMB_BRDR;
  const thumbTop    = ref(0);
  const barTop      = ref(0);
  const barHgt      = ref(0);

  // 0 to 100%
  const vel  = ref(0); 

  const stopAllPropogation= (event) => {
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

    window.addEventListener('resize', () => {
      paneHgt = paneEle.offsetHeight;
      travel  = paneHgt - THUMB_HGT;
      vel.value = 0;
      drawSlider();
      emit('stop');
    });      

    paneEle.addEventListener("touchmove", 
      (event) => {
        stopAllPropogation(event);
        
        let touch = null;
        for(let chgdTouch of event.changedTouches) {
          if(chgdTouch.target == paneEle  ||
             chgdTouch.target == barEle ||
             chgdTouch.target == thumbEle) 
            touch = chgdTouch;
        }
        if(touch == null) return;

        vel.value = (paneHgt 
                        - (touch.pageY - THUMB_HGT)) 
                        / paneHgt;
        vel.value = Math.max(0, 
                        Math.min(vel.value, 1));
        drawSlider();
        emit('vel', Math.round(vel.value * 100));
      }
    );

    watch(() => props.reset, () => {
      vel.value = 0;
      drawSlider();
      emit('vel', 0);
    });

    drawSlider(0);
  });
</script>

<style>
</style>
