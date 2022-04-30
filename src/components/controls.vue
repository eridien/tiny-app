<template lang='pug'>
#controls(
    :style="{display:'flex', touchAction:'none',      \
             minWidth: 'calc(100vw-30px)',            \
             minHeight:`calc(100vh - ${HDR_HGT}px)`}")
    
  vel-pane(
      :reset="reset"
      :style="{border:'1px solid black',               \
               width:'24%',                            \
               minHeight:`calc(100vh - ${HDR_HGT}px)`}"
      @vel="vel" @stop="stopEvt")

  wheel-pane(
      :reset="reset"
      :style="{border:'1px solid black', width:'75%',  \
              minHeight:`calc(100vh - ${HDR_HGT}px)`}"
      @angle="angle" @stop="stopEvt")

  #cover(v-if="menuOpenState || messageOpen"
         style="position:absolute; left:0;       \
                width:100%; height:100%;         \
                opacity:0.3;                     \
                background-color:black;          \
                display: table-cell;")

  Message(v-show="messageOpen"
          style="position:fixed; z-index:1001;  \
                top:90px; right:70px;"
          @steering="steeringEvt"
          @closeMenu="closeMenuEvt")

</template>

<script setup>
  import {ref, watch} from 'vue'
  import  velPane     from './velPane.vue';
  import  wheelPane   from './wheelPane.vue';

  const props = defineProps([ 'HDR_HGT', 
          'resetCtrls', 'menuOpenState', 'showMessage' ]);
  const emit  = defineEmits(['vel','angle','stop']);

  const vel     = (vel)   => emit('vel', vel);
  const angle   = (angle) => emit('angle', angle);

  const reset    = ref(0);
  const menuOpen = ref(false);
  const msgText  = ref(null);
  const doneText = ref(null);

  watch(() => props.resetCtrls, () => {
    reset.value++; 
  });

  watch(() => props.showMessage, (text) => {
    msgText.value  = text[0];
    doneText.value = text[1];
  }

  const stopEvt = () => { 
    reset.value++; 
    emit('stop'); 
  }
</script>

<style>
</style>
