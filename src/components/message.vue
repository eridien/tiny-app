<template lang='pug'>
#message(style="border-radius:12px; font-size:28px; \
                 background-color:white;             \
                 margin:20px; padding:20px;") 
  div {{msgText}}
  div(@click="doneClick"
    style="float:right; font-size:26px;   \
            background-color:#ddd;         \
            border-radius:6px;             \
            padding:5px; margin:20px 5px 0 0") {{btnText}}
</template>

<script setup>
  import {inject, ref} from 'vue';

  const evtBus = inject('evtBus');   
  const doneClick = () => evtBus.emit('closeMenu');

  const msgText = ref('');
  const btnText = ref('');

  evtBus.on('message', (msgText, btnText) => {
    msgText.value = msgText;
    btnText.value = btnText;
  });
  
</script>

<style>
</style>
