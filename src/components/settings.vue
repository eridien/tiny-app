<template lang='pug'>
#settings(style="border-radius:12px; font-size:28px; \
                 background-color:white;             \
                 margin:20px; padding:20px;")
  div(style="margin-bottom:20px;") Steering Sensitivity
  div(style="position:relative; font-size:25px; display:flex; \
             justifyContent:space-between;                    \
             alignItems:stretch;")
    span Min
    div {{dispVal}}
    span Max

  input(id="sens" type="range" 
        style="width:100%;" @input="sensEvt" 
        min="1" max="9" step="1" value="5")

  div(style="margin:15px 0 15px 0") Wi-Fi Name
  div(style="position:relative; font-size:25px; display:flex; \
             justifyContent:left;                             \
             alignItems:stretch;")
  div(style="position:relative;")
    div(style="width:25%;float:left") T-Bot-

    input(id="wifiName" type="text" 
          style="width:60%;height:25px; font-size:20px;       \
                  float:left;" 
         :value="global.curStatus[global.fcName]")

  div(@click="doneClick"
      style="float:right; font-size:26px;   \
             background-color:#ddd;         \
             border-radius:6px;             \
             padding:5px; margin:20px 5px 0 0") Done
</template>

<script setup>
  import {onMounted, ref, inject} from 'vue';

  const global = inject('global');
  const evtBus = inject('evtBus');   

  const dispVal = ref(5);

  const ILLEGAL_WIFI_NAME_CHARS = '{":,}?$[\\]+';
  const wifiName = ref(global.wifiName);

  const sensEvt = (event) => {
    const val = event.target.value;
    dispVal.value = val;
    global.steeringSens = val;
    localStorage.setItem('steeringSens', val);
  }
  let nameEle;

  onMounted(()=> {
    // input ele
    const sensEle = document.getElementById('sens');
    sensEle.value = global.steeringSens;
    // display
    dispVal.value = global.steeringSens;
    // wifiName text field element
    nameEle = document.getElementById('wifiName');
  });

  const doneClick = () => {
    console.log("doneClick, setting wifiName:", nameEle.value);
    evtBus.emit("wifiName", nameEle.value);
    evtBus.emit('menuOpen', false);
  }
</script>
