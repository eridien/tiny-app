<template lang='pug'>
#settings(style="border-radius:12px; font-size:28px; \
                 background-color:white;             \
                 margin:20px; padding:20px;")
  div(style="margin-bottom:20px;") Turning Sensitivity
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
  import {ref} from 'vue';

  const emit = defineEmits(['steeringSens', 'closeMenu']);
  const doneClick = () => emit('closeMenu');

  const sensVal = ref(5);

  const sensEvt = (event) => {
    const val = event.target.value;
    console.log("sensitivity", val);
    sensVal.value = val;
    emit('steeringSens', +val);
  }
</script>

<style>
</style>
