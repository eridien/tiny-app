<template lang='pug'>
#ctrls(style="border:2px solid black")
  #accelerator
    | hello
  #wheel
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
