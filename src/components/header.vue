<template lang='pug'>
div(style="display:flex;                       \
           justifyContent:space-between;       \
           alignItems:stretch;                 \
           fontWeight:bold; backgroundColor:   \
            (batvId < 20 || rssiId < 2 ? 'pink': 'white')") 
  img(src="images/icon.png" 
      style="width:64px;height:36px;marginTop:5px;")
  img(:src="`images/wifi-${rssiId}.png`"  
      style="width:40px; height:55px; \
             marginTop:-6px")
  img(:src="`images/bat-${batvId}.png`" 
      style="width:15px; height:35px; \
               margin:4px 20px 40px 0;")
  hamburger(style="width:25px; height:25px; \
                   margin:10px 20px 40px 0;")
</template>

<script setup>
import {onMounted, watch, ref} from 'vue';
import  hamburger from './hamburger.vue';

const props = defineProps(['rssi', 'batv']);

const rssiId = ref(2);
watch(()=> props.rssi, (rssi, oldRssi) => {
  if(rssi === undefined) return;
  let id;
  if(     rssi < -80) id = 1; 
  else if(rssi < -70) id = 2; 
  else if(rssi < -60) id = 3; 
  else if(rssi < -50) id = 4; 
  else                id = 5; 
  rssiId.value = id;
});

const batvId = ref(100);
watch(()=> props.batv, (batv, oldbatv) => {
  if(batv === undefined) return;
  let id;
  if(     batv < 340) id =   0;
  else if(batv < 350) id =  20;
  else if(batv < 360) id =  40;
  else if(batv < 370) id =  60;
  else if(batv < 380) id =  80;
  else                id = 100; 
  batvId.value = id;
});
</script>

<style>
</style>
