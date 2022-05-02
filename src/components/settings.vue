<template lang='pug'>
#settings(style="border-radius:12px; font-size:28px; \
                 background-color:white;             \
                 margin:20px; padding:20px;")
  div(style="margin-bottom:20px;") Steering Sensitivity
  div(style="position:relative; font-size:25px; display:flex; \
             justifyContent:space-between;                    \
             alignItems:stretch;")
    span Min
    div {{sensVal}}
    span Max

  input(id="sens" type="range" 
        style="width:100%;" @input="sensEvt" 
        min="1" max="9" step="1" value="5")

  div(@click="doneClick"
      style="float:right; font-size:26px;   \
             background-color:#ddd;         \
             border-radius:6px;             \
             padding:5px; margin:20px 5px 0 0") Done
</template>

<script setup>
  import {onMounted, ref, inject} from 'vue';

  const evtBus = inject('evtBus');   

  const sensVal = ref(5);

  const sensEvt = (event) => {
    const val = event.target.value;
    sensVal.value = val;
    evtBus.emit('steeringSens', sensVal.value);
    localStorage.setItem('steeringSens', val);
  }

  onMounted(()=> {
    const sensEle = document.getElementById('sens');
    const val = localStorage.getItem('steeringSens');
    sensVal.value = val;
    sensEle.value = val;
  });

  const doneClick = () => 
          evtBus.emit('menuOpen', false);
</script>

<style>
</style>
