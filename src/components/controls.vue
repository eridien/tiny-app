<template lang='pug'>
#controls(
    :style="{display:'flex', width:'100vw', \
             minHeight:`calc(100vh - ${HDR_HGT}px)`}"
    @click="stopClick")
    
  accel-pane(
      :reset="reset" 
      :style="{border:'1px solid black', \
               width:'25%',              \
               minHeight:`calc(100vh - ${HDR_HGT}px)`}"
      @accel="accel" @stop="stopEvt")

  wheel-pane(
      :reset="reset"
      :style="{border:'1px solid black', \
              width:'75%',              \
              minHeight:`calc(100vh - ${HDR_HGT}px)`}"
      @angle="angle" @stop="stopEvt")
</template>

<script setup>
  import {ref, watch} from 'vue'
  import  accelPane  from './accelPane.vue';
  import  wheelPane  from './wheelPane.vue';

  const props = defineProps(['HDR_HGT','resetCtrls']);
  const emit  = defineEmits(['stop']);

  const accel   = (accel) => emit('accel', accel);
  const angle   = (angle) => emit('angle', angle);
  const stopEvt = ()      => emit('stop');

  const reset = ref(0);

  watch(() => props.resetCtrls, () => {
    console.log(`ctrls watch resetCtrls`);

    reset.value++; 
  });
  const stopClick = () => { 
    console.log(`ctrls stopClick`);

    reset.value++; 
    emit('stop'); 
  }
</script>

<style>
</style>
