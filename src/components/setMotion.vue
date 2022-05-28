<template lang='pug'>
#set-motion(style="border-radius:12px; font-size:22px; \
                 background-color:white;               \
                 margin:20px; padding:20px;")
  div(style="margin-bottom:20px;") Motion Constants
  div(style="position:relative; margin:5px 0 10px 0;")

  div(v-for="(fcCode,fcCmd) in fcCmds")
    div(style="width:48%;float:left;text-align:right;    \
               margin-right:10px;") {{fcCmd.slice(2)}}
    input(:id="fcCmd" type="number" 
          @change="(e)=>chgVal(e, fcCmd)"
          style="width:40%;height:25px; font-size:1em;  \
                  float:left;" 
         :value="global.curStatus[fcCode.toLowerCase()] / \
                 (fcCode == 'J' ? 1 : 1000)")

  div(@click="doneClick"
      style="float:right; font-size:1em;   \
             background-color:#ddd;         \
             border-radius:6px;             \
             padding:5px; margin:20px 5px 0 0") Done
</template>

<script setup>
  import {reactive, inject} from 'vue';

  const global = inject('global');
  const evtBus = inject('evtBus');   

  const fcCmds = reactive(global.fcCmds);

  const chgVal = (evt, fcCmd) => {
    const inpEle = evt.srcElement;
    const val    = inpEle.value;
    evtBus.emit('set' + fcCmd.slice(2), val);
  }

  const doneClick = () => 
        evtBus.emit('menuOpen', false);
</script>
