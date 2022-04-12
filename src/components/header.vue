<template lang='pug'>
#hdr(:style="{position:'fixed', width:'100vw', height:'50px',  \
              display:'flex', justifyContent:'space-around',   \
              alignItems:'stretch', padding:'5px',             \
              fontWeight:'bold', backgroundColor:              \
                (batvId < 20 || rssiId < 2 ? 'pink': 'white')}") 
  div(:style="{fontSize:'32px', fontWeight:'normal', paddingTop:'8px'}") 
    | T-bot
  img(:src="`${images}/wifi-${rssiId}.png`" 
      :style="{width:'40px', height:'55px', marginBottom:'30px'}")
  img(:src="`${images}/bat-${batvId}.png`" 
      :style="{width:'15px', height:'35px', margin:'10px 20px 40px 0'}")
  img(:src="`${images}/hamburger.png`" 
      :style="{width:'25px', height:'25px', margin:'15px 20px 40px 0'}")
</template>

<script setup>
import {onMounted, watch, ref} from 'vue'

const props = defineProps(['images','rssi', 'batv'])

const rssiId = ref(2);
watch(()=> props.rssi, (rssi, oldRssi) => {
  // console.log({rssi, oldRssi});
  if(Math.abs(rssi - oldRssi) > 3) {
    let id;
    if(     rssi < -80) id = 1; 
    else if(rssi < -70) id = 2; 
    else if(rssi < -60) id = 3; 
    else if(rssi < -50) id = 4; 
    else                id = 5; 
    rssiId.value = id;
  }
});

const batvId = ref(100);
watch(()=> props.batv, (batv, oldbatv) => {
  // console.log({batv, oldbatv});
  if(Math.abs(batv - oldbatv) > .03) {
    let id;
    // total range 330 to 420
    if(     batv < 340) id =   0;
    else if(batv < 350) id =  20;
    else if(batv < 360) id =  40;
    else if(batv < 370) id =  60;
    else if(batv < 380) id =  80;
    else                id = 100; 
    batvId.value = id;
  }
});

onMounted(async () => { 
  console.log(`\n---- header mounted ----\n`);
});

</script>

<style>
</style>
