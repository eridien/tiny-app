<template lang='pug'>
#controls(:style="{display:'flex', width:'100vw', \
                   minHeight:`calc(100vh - ${HDR_HGT}px)`}"
    @click="ctrlClick")
    
  accel-pane(:stop="stop"
            :style="{border:'1px solid black', \
                     width:'25%',              \
                     minHeight:`calc(100vh - ${HDR_HGT}px)`}"
              @accel="accel" @stop="stopEvt")

  wheel-pane(:stop="stop"
            :style="{border:'1px solid black', \
                     width:'75%',              \
                     minHeight:`calc(100vh - ${HDR_HGT}px)`}"
              @angle="angle" @stop="stopEvt")
</template>

<script setup>
  import {ref} from 'vue'
  import  accelPane  from './accelPane.vue';
  import  wheelPane  from './wheelPane.vue';

  const props = defineProps(['HDR_HGT']);
  const emit  = defineEmits(['stop']);

  const accel   = (accel) => emit('accel', accel);
  const angle   = (angle) => emit('angle', angle);
  const stopEvt = ()      => emit('stop');

  let stop = ref(false);
  const ctrlClick = () => { 
    stop.value = !stop.value;  // pass stop to child
    emit('stop');              // pass stop to parent
  }
</script>

<style>
</style>
