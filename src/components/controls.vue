<template lang='pug'>
#controls(
    :style="{display:'flex', width:'100vw', \
             minHeight:`calc(100vh - ${HDR_HGT}px)`}"
    @click="stopClick")
    
  vel-pane(
      :reset="reset" :ctrlDisabled="ctrlDisabled" 
      :style="{border:'1px solid black', \
               width:'25%',              \
               minHeight:`calc(100vh - ${HDR_HGT}px)`}"
      @vel="vel" @stop="stopEvt")

  wheel-pane(
      :reset="reset" :ctrlDisabled="ctrlDisabled" 
      :style="{border:'1px solid black', \
              width:'75%',              \
              minHeight:`calc(100vh - ${HDR_HGT}px)`}"
      @angle="angle" @stop="stopEvt")
</template>

<script setup>
  import {ref, watch} from 'vue'
  import  velPane     from './velPane.vue';
  import  wheelPane   from './wheelPane.vue';

  const props = defineProps([
    'HDR_HGT','ctrlDisabled', 'resetCtrls'
  ]);
  const emit  = defineEmits(['stop']);

  const vel     = (vel) => emit('vel', vel);
  const angle   = (angle) => emit('angle', angle);
  const stopEvt = ()      => emit('stop');

  const reset = ref(0);

  watch(() => props.resetCtrls, () => {
    reset.value++; 
  });

  const stopClick = () => { 
    reset.value++; 
    emit('stop'); 
  }
</script>

<style>
</style>
