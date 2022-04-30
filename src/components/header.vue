<template lang='pug'>
#header(style="display:flex; padding:5px;      \
          justifyContent:space-between;        \
          alignItems:stretch;                  \
          fontWeight:bold; backgroundColor:    \
            (batvId < 20 || rssiId < 2 ? 'pink': 'white')") 
  img(src="/images/icon.png" 
      style="width:64px;height:36px;marginTop:5px;")
  img(:src="`/images/wifi-${rssiId}.png`"  
      style="width:40px; height:55px;         \
             marginTop:-6px")
  img(:src="`/images/bat-${batvId}.png`" 
      style="width:15px; height:35px; margin-top:5px;")
      
  img(:src="`/images/hamburger.png`" 
      @click="hamburgerClick"
      style="width:35px; height:35px;         \
             margin-top:8px; margin-right:48px;")

  BurgerMenu(v-if="menuOpen"
             style="position:fixed; z-index:1000;  \
                    top:70px; right:60px;")
</template>

<script setup>
import {ref, inject} from 'vue';
import  BurgerMenu from './burgerMenu.vue'

const evtBus = inject('evtBus');   

const rssiId = ref(2);
evtBus.on('rssi', (rssi) => {
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
evtBus.on('batv', (batv) => {
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

let menuOpen = ref(false);

evtBus.on('menuOpen', (
           open) => menuOpen.value = open);

const hamburgerClick = ()=> {
  menuOpen.value = !menuOpen.value;
  evtBus.emit('menuOpen', menuOpen.value);
}

</script>

<style>
</style>
