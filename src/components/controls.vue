<template lang='pug'>
div(style="min-height:calc(100vh-100px);    \
           display:flex; width:100%;       \
           border:1px solid black; "
    @click="ctrlClick")
  accel-pane(style="border:1px solid black; \
                    width:25%;              \
                    min-height: calc(100vh - 100px);")
  wheel-pane(:HEADER_HEIGHT="HEADER_HEIGHT" 
              style="border:1px solid black; \
                     width:75%;              \
                     min-height: calc(100vh - 100px);")
</template>

<script setup>
  import {onMounted} from 'vue'
  import  accelPane  from './accelPane.vue';
  import  wheelPane  from './wheelPane.vue';

  const props = defineProps(['HEADER_HEIGHT']);

  const emit = defineEmits(['stop']);

  const ctrlClick = () => {
    emit('stop');
  }

  // let clickTO = null;
  // const clrClickTO = () => {
  //   if(clickTO) {
  //     clearTimeout(clickTO);
  //     clickTO = null;
  //   }
  // }

  // onMounted(async () => { 
  // });
</script>

<style>
#wheel{
  width: 60vmin; 
  height:60vmin;
}
</style>
