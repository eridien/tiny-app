<template lang='pug'>
#status(style="border-radius:12px; font-size:22px; \
               background-color:white;             \
               margin:20px; padding:20px;")
  div Status
  table
    tr(v-for="(fcCode, name) in global.fcStateCodes")
      td(style="text-align:right;") {{name.slice(2)}}
      td(style="padding:5px; font-size:20px;          \
                text-align:right")  {{status[fcCode]}}

  div(@click="doneClick"
      style="float:right; font-size:13px;     \
                 background-color:#ddd;         \
                 border-radius:6px;                 \
                 padding:5px; margin:20px 5px 0 0") Done
</template>

<script setup>
  import {onMounted, ref, inject} from 'vue';

  const global = inject('global');
  const evtBus = inject('evtBus');

  const status = ref({});

  evtBus.on('stateChg', () => {
    for(const [,fc] of Object.entries(global.fcStateCodes))
      status.value[fc] = global.curStatus[fc];
  })

  const doneClick = () => 
          evtBus.emit('menuOpen', false);
</script>
