<template lang='pug'>
#message(style="border-radius:12px; font-size:26px;  \
                background-color:white;              \
                margin:10px; padding:20px;") 
  div                           {{messageText}}
  div(v-if="messageText2" style="height:15px;")
  div(v-if="messageText2")      {{messageText2}}
  span(v-if="busy")             {{busyChar}}
  .button(v-if="buttonText2" 
          @click="doneClick2"
          style="float:left;")  {{buttonText2}}
  .button(v-if="buttonText" 
          @click="doneClick"
          style="float:right;") {{buttonText}}
</template>

<style>
  .button {
    font-size:23px;
    background-color:#ddd;
    border-radius:6px;
    padding:5px; 
    margin:20px 5px 0 0;
  }
</style>

<script setup>
  import {ref, inject, watch} from 'vue';
  const   evtBus = inject('evtBus');

  const props = defineProps([
          'messageText',   'messageText2',   
          'busy', 
          'buttonText2',   'buttonText',  
          'callbackText2', 'callbackText']);

  const busyChar    = ref('');
  const busyPattern = "/-\\|";
  let   busyIdx     = 0;
  let   busyInt     = null;
  
  watch(()=> props.busy, (busy) => {
    if(!props.busy) return;
    if(busy && busyInt === null) {
      busyInt = setInterval(()=> {
        busyChar.value = busyPattern[busyIdx];
        if(++busyIdx == busyPattern.length)
           busyIdx = 0;
      }, 200);
    }
    if(!busy) {
      clearInterval(busyInt);
      busyInt = null;
      busyChar.value = '';
    }
  });

  const doneClick2 = () => {
    evtBus.emit('closeMessage');
    evtBus.emit(props.callbackText2);
  }
  
  const doneClick = () => {
    evtBus.emit('closeMessage');
    evtBus.emit(props.callbackText);
  }
</script>
