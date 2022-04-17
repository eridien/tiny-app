<template lang='pug'>
div(style="min-height: calc(100vh - 100px); \
           display:flex; width:100vw;       \
           border:1px solid red;")
  accel-pane
  wheel-pane
</template>

<script setup>
  import {onMounted} from 'vue'
  import  accelPane from './accelPane.vue';
  import  wheelPane from './wheelPane.vue';

  // commands to bot
  const setAccel = (accel) => this.$emit('setAccel', accel);
  const setYaw   = (yaw)   => this.$emit('setYaw',   yaw);
  const stop     = ()      => this.$emit('stop');
  const pwrOff   = ()      => this.$emit('pwrOff');

  let clickTO = null;
  const clrClickTO = () => {
    if(clickTO) {
      clearTimeout(clickTO);
      clickTO = null;
    }
  }
  onMounted(async () => { 
    console.log(`---- controls mounted ----`);
});

</script>

<style>
#wheel{
  width: 60vmin; 
  height:60vmin;
}
</style>
