<template lang='pug'>
div(style="min-height: calc(100vh - 100px);          \
              display:flex; width:100vw")
  #accelerator(style="border:1px solid blue; width:25%; \
                      min-height: calc(100vh - 100px);")
  wheel-pane
</template>

<script setup>
  // import {onMounted} from 'vue'
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
</script>

<style>
#wheel{
  width: 60vmin; 
  height:60vmin;
}
</style>
