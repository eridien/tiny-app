<template lang='pug'>
div(id="accelPane" style="position:relative;")
  #slider(
     :style="{position:'absolute',                    \
              top:`${barTop}px`, height:`${barHgt}px`, \
              marginLeft:'11%', width:'75%',          \
              backgroundColor:'#c44'}")

  #wheel(
      :style="{border:`${THUMB_BRDR}px solid black`,            \
               borderRadius:'12%/50%',                          \
               position:'absolute',                             \
               top:`${thumbTop}px`, height:`${THUMB_INNER}px`,  \
               marginLeft:'5%', width:'80%',                    \
               backgroundColor:'gray'}")
</template>

<script setup>
  import {ref, watch, onMounted} from 'vue'

  const props = defineProps(['stop']);
  const emit  = defineEmits(['accel']);

  const THUMB_BRDR  = 5;
  const THUMB_INNER = 40;
  const THUMB_HGT   = THUMB_INNER + 2*THUMB_BRDR;
  const thumbTop    = ref(0);
  const barTop      = ref(0);
  const barHgt      = ref(0);

  // 0 to 100%
  const accel  = ref(0); 

  onMounted(async () => { 
    const paneEle = document.getElementById('accelPane');
    const paneHgt = paneEle.offsetHeight;
    const travel  = paneHgt - THUMB_HGT;

    const drawSlider = () => {
      barTop.value   = paneHgt
                         - travel*accel.value
                         - THUMB_HGT/2;
      barHgt.value   = paneHgt -  barTop.value;
      thumbTop.value = barTop.value - (THUMB_HGT/2);
    };

    document.getElementById("accelPane")
            .addEventListener("touchmove", (event) => {
      const touch = event.changedTouches[0];
      accel.value = (paneHgt 
                       - (touch.pageY - THUMB_HGT)) 
                       / paneHgt;
      accel.value = Math.max(0, 
                       Math.min(accel.value, 1));
      drawSlider();
      emit('accel',Math.round(accel.value * 100));
    });

    watch(() => props.stop, () => {
      accel.value = 0;
      drawSlider();
    });
    
    drawSlider(0);
  });
</script>

<style>
</style>
