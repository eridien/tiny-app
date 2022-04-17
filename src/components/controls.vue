<template lang='pug'>
div(style="min-height:calc(100vh-100px);    \
           display:flex; width:100%;       \
           border:1px solid black; ")
  accel-pane(style="border:1px solid black; \
                    width:25%;              \
                    min-height: calc(100vh - 100px);")
  wheel-pane(style="border:1px solid black; \
                    width:75%;              \
                    min-height: calc(100vh - 100px);")
</template>

<script setup>
  import {onMounted} from 'vue'
  import  accelPane from './accelPane.vue';
  import  wheelPane from './wheelPane.vue';

  let clickTO = null;
  const clrClickTO = () => {
    if(clickTO) {
      clearTimeout(clickTO);
      clickTO = null;
    }
  }
  onMounted(async () => { 
    // console.log(`---- controls mounted ----`);
  });
</script>

<style>
#wheel{
  width: 60vmin; 
  height:60vmin;
}
</style>
