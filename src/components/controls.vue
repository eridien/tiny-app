<template lang='pug'>
#ctrls(style="min-height: calc(100vh - 100px);  \
              display:flex;")
  #accelerator(style="border:1px solid blue; width:25%; \
                      min-height: calc(100vh - 100px);")
  #wheel(style="border:1px solid red; width:75%; \
                      min-height: calc(100vh - 100px);")
</template>

<script setup>
  import {onMounted} from 'vue'

  // commands to bot
  const setAccel = (accel) => this.$emit('setAccel', accel);
  const setYaw   = (yaw)   => this.$emit('setYaw',   yaw);
  const stop     = ()      => this.$emit('stop');
  const pwrOff   = ()      => this.$emit('pwrOff');

  onMounted(async () => { 

  });
</script>

<style>
</style>
