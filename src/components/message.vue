<template lang='pug'>
#message(style="border-radius:12px; font-size:26px;  \
                 background-color:white;             \
                 margin:20px; padding:20px;") 
  div {{messageText}}
  span {{busyChar}}
  div(@click="doneClick"
    style="float:right; font-size:23px;    \
            background-color:#ddd;         \
            border-radius:6px;             \
            padding:5px; margin:20px 5px 0 0") {{buttonText}}
</template>

<script setup>
  import {ref, inject, watch} from 'vue';
  const   evtBus = inject('evtBus');

  const props = defineProps([
          'messageText', 'buttonText', 
          'callbackText','busyIndicator']);

  const busyChar = ref('');
  const busyPattern = "/-\\|";
  let busyIdx = null;
  let busyInt = null;
  
  watch(()=> props.busyIndicator, (state) => {
    if(state == 'on' && busyIdx === null) {
      busyIdx = 0;
      busyInt = setInterval(()=> {
        busyChar.value = busyPattern[busyIdx];
        if(++busyIdx == busyPattern.length)
           busyIdx = 0;
      }, 200);
    }
    if(state == 'off') {
      busyIdx = null;
      clearInterval(busyInt);
      busyInt = null;
      busyChar.value = '';
    }
  });

  const doneClick = () => {
    evtBus.emit('closeMessage');
    evtBus.emit(props.callbackText);
  }
</script>

<style>
</style>
