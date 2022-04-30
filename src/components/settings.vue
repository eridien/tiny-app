<template lang='pug'>
#settings(style="border-radius:12px; font-size:28px; \
                 background-color:white;             \
                 margin:20px; padding:20px;")
  div(style="margin-bottom:20px;") Steering Sensitivity
  div(style="position:relative; font-size:25px; display:flex; \
             justifyContent:space-between;                    \
             alignItems:stretch;")
    span Min
    div(style="position:relative; left:-7px;") {{sensVal}}
    span Max

  input(id="sens" type="range" 
        style="width:100%;" @input="sensEvt" 
        min="1" max="10" step="1" value="5")

  div(@click="doneClick"
      style="float:right; font-size:26px;   \
             background-color:#ddd;         \
             border-radius:6px;             \
             padding:5px; margin:20px 5px 0 0") Done
</template>

<script setup>
  import {onMounted, ref} from 'vue';

  const emit = defineEmits(['closeMenu']);

  const sensVal = ref(5);

  const sensEvt = (event) => {
    const val = event.target.value;
    sensVal.value = val;
    // wheelPane.vue uses localStorage
    localStorage.setItem('steeringSens', val);
  }

  onMounted(()=> {
    const sensEle = document.getElementById('sens');
    if(!localStorage.getItem('steeringSens'))
        localStorage.setItem('steeringSens', '5');
    const val = localStorage.getItem('steeringSens');
    sensVal.value = val;
    sensEle.value = val;
  });

  const doneClick = () => emit('closeMenu');
</script>

<style>
</style>
