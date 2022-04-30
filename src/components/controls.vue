<template lang='pug'>
#controls(
    :style="{display:'flex', touchAction:'none',      \
             minWidth: 'calc(100vw-30px)',            \
             minHeight:`calc(100vh - ${global.HDR_HGT}px)`}")
    
  vel-pane(
      :style="{border:'1px solid black',               \
               width:'24%',                            \
               minHeight:`calc(100vh - ${global.HDR_HGT}px)`}")

  wheel-pane(
      :style="{border:'1px solid black', width:'75%',  \
              minHeight:`calc(100vh - ${global.HDR_HGT}px)`}")

  #cover(v-if="menuOpen || messageOpen"
         style="position:absolute; left:0;       \
                width:100%; height:100%;         \
                opacity:0.3;                     \
                background-color:black;          \
                display: table-cell;")

  Message(v-show="messageOpen"
          style="position:fixed; z-index:1001;  \
                top:90px; right:70px;")

</template>

<script setup>
  import {ref, inject} from 'vue'
  import  velPane      from './velPane.vue';
  import  wheelPane    from './wheelPane.vue';
  import  Message      from './message.vue';

  const global = inject('global');
  const evtBus = inject('evtBus');   

  const menuOpen    = ref(false);
  const messageOpen = ref(false)

  evtBus.on('menuOpen', open => {
    menuOpen.value = open;
  });

  evtBus.on('messageOpenState', open => {
    messageOpen.value = open;
  });
 
</script>

<style>
</style>
