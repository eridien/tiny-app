<template lang='pug'>
div(style="min-height:calc(100vh-100px);     \
           display:flex; width:100%;         \
           border:1px solid black; "
    @click="ctrlClick")
    
  accel-pane(:stop="stop"
              style="border:1px solid black; \
                     width:25%;              \
                     min-height: calc(100vh - 100px);"
              @accel="accel")
  wheel-pane(:HDR_HGT="HDR_HGT" :stop="stop"
              style="border:1px solid black; \
                     width:75%;              \
                     min-height: calc(100vh - 100px);"
              @angle="angle")
</template>

<script setup>
  import {ref} from 'vue'
  import  accelPane  from './accelPane.vue';
  import  wheelPane  from './wheelPane.vue';

  const props = defineProps(['HDR_HGT']);
  const emit  = defineEmits(['stop']);

  const accel = (accel) => emit('accel', accel);
  const angle = (angle) => emit('angle', angle);

  let stop = ref(false);
  const ctrlClick = () => { 
    stop.value = !stop.value;  // pass stop to child
    emit('stop');              // pass stop to parent
  }
</script>

<style>
</style>
