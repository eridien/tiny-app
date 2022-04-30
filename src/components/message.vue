<template lang='pug'>
#message(style="border-radius:12px; font-size:28px; \
                 background-color:white;             \
                 margin:20px; padding:20px;") 
  div {{messageText}}
  div(@click="doneClick"
    style="float:right; font-size:26px;   \
            background-color:#ddd;         \
            border-radius:6px;             \
            padding:5px; margin:20px 5px 0 0") {{buttonText}}
</template>

<script setup>
  import {inject, ref} from 'vue';

  const props= defineProps([
          'messageText', 'buttonText', 'callbackText']);

  const evtBus = inject('evtBus');

  const doneClick = () => {
    evtBus.emit(callbackText.value);
    evtBus.emit('closeMessage');
  }
</script>

<style>
</style>
