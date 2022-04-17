<template lang='pug'>
#ctrls(style="min-height: calc(100vh - 100px);                   \
              display:flex;")
  #accelerator(style="border:1px solid blue; width:25%;          \
                      min-height: calc(100vh - 100px);")
  #wheel(style="border:1px solid red; width:75%; display:flex;   \
                      min-height: calc(100vh - 100px);            \
                      justify-content:center; align-items:center;")
    img(id="wheel" src="images/steering-wheel.png"
          :style="{ transform:`rotate(${angle}deg)` }")

</template>

<script setup>
  import {onMounted} from 'vue'

  // commands to bot
  const setAccel = (accel) => this.$emit('setAccel', accel);
  const setYaw   = (yaw)   => this.$emit('setYaw',   yaw);
  const stop     = ()      => this.$emit('stop');
  const pwrOff   = ()      => this.$emit('pwrOff');
  const angle    = 90;
  onMounted(async () => { 

  });
</script>

<style>
#wheel{
  width: 60vmin; 
  height:60vmin;
}
</style>
