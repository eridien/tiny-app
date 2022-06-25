<template lang='pug'>
#settings(style="border-radius:12px; font-size:20px; \
                 background-color:white;             \
                 margin:20px; padding:20px;")
  div(style="margin-bottom:20px;font-size:1em;") 
    | Steering Sensitivity
  div(style="position:relative; font-size:.8em; display:flex; \
             justifyContent:space-between;                    \
             alignItems:stretch;")
    span Min
    div {{dispVal}}
    span Max
  input(id="sens" type="range" 
        style="width:100%;" @input="sensEvt" 
        min="1" max="9" step="1" value="5")

  hr(style="color:black; margin:13px;")

  div(@click="doneClick"
      style="float:right; font-size:1em;            \
             background-color:#ddd;                 \
             border-radius:6px;                     \
             padding:5px; margin:5px 5px 0 0") Done
</template>

<script setup>
  import {onMounted, ref, inject} from 'vue';

  const global = inject('global');
  const evtBus = inject('evtBus');   

  const dispVal = ref(5);

  const sensEvt = (event) => {
    const sens = parseInt(event.target.value);
    console.log({sens});
    dispVal.value        = sens;
    global.steeringSens  = sens
    localStorage.setItem('global.steeringSens', ''+ sens);
  }

  onMounted(()=> {
    const sensEle = document.getElementById('sens');
    global.steeringSens = parseInt(
          localStorage.getItem('global.steeringSens') || 5);
    sensEle.value = global.steeringSens;
    dispVal.value = global.steeringSens;
  });

  const doneClick = () => {
    evtBus.emit('menuOpen', false);
  }
</script>
