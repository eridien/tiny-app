<template lang='pug'>
div(id="accelPane" style="position:relative;")
  div(:style="{position:'absolute',                    \
               top:`${barTop}px`, height:`${barHgt}px`, \
               marginLeft:'11%', width:'75%',          \
               backgroundColor:'#c44'}")

  div(:style="{border:`${THUMB_BRDR}px solid black`,            \
               borderRadius:'12%/50%',                          \
               position:'absolute',                             \
               top:`${thumbTop}px`, height:`${THUMB_INNER}px`,  \
               marginLeft:'5%', width:'80%',                    \
               backgroundColor:'gray'}")
</template>

<script setup>
  import {ref, watch, computed, onMounted} from 'vue'

  const props = defineProps(['HDR_HGT', 'stop']);
  const THUMB_BRDR = 5;
  const THUMB_INNER   = 40;
  const THUMB_HGT  = THUMB_INNER + 2*THUMB_BRDR;
  const thumbTop  = ref(0);
  const barTop    = ref(0);
  const barHgt    = ref(0);

  const accel  = ref(0); // 0 to 100%
  watch(() => props.stop, () => accel.value = 0);

  onMounted(async () => { 
    const paneEle = document.getElementById('accelPane');
    const paneHgt = paneEle.offsetHeight;
    const travel  = paneHgt - THUMB_HGT;
    
    const setSlider = (perCent) => {
      barTop.value   = paneHgt - travel*(perCent/100)
                               - THUMB_HGT/2;
      barHgt.value   = paneHgt -  barTop.value;
      thumbTop.value = barTop.value - (THUMB_HGT/2);
    }
    setSlider(100);
  });
</script>

<style>
</style>
