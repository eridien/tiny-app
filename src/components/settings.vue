<template lang='pug'>
#settings(style="border-radius:12px; font-size:14px; \
                 background-color:white;             \
                 margin:20px; padding:20px;")
  div(style="margin-bottom:20px;") Steering Sensitivity
  div(style="position:relative; font-size:12px; display:flex; \
             justifyContent:space-between;                    \
             alignItems:stretch;")
    span Min
    div {{dispVal}}
    span Max
  input(id="sens" type="range" 
        style="width:100%;" @input="sensEvt" 
        min="1" max="9" step="1" value="5")

  hr(style="color:black; margin:26px;")

  div(style="margin:15px 0 15px 0") Wi-Fi Name
  div(style="position:relative; font-size:12px; display:flex; \
             justifyContent:left;                             \
             alignItems:stretch;")
  div(style="position:relative; margin:5px 0 10px 0;")
    div(style="width:25%;float:left") T-Bot-
    input(id="wifiName" type="text" 
          style="width:60%;height:25px; font-size:10px;       \
                  float:left;" 
         :value="global.curStatus[global.fcName]")

  hr(style="color:black; margin-top:56px;")

  div(@click="doneClick"
      style="float:right; font-size:13px;           \
             background-color:#ddd;                 \
             border-radius:6px;                     \
             padding:5px; margin:5px 5px 0 0") Done
</template>

<script setup>
  import {onMounted, ref, inject} from 'vue';

  const global = inject('global');
  const evtBus = inject('evtBus');   

  const dispVal = ref(5);

  const wifiName = ref(global.wifiName);

  const sensEvt = (event) => {
    const val = event.target.value;
    dispVal.value = val;
    global.steeringSens = val;
    localStorage.setItem('steeringSens', val);
  }

  let nameEle;
  let nameAtOpen;

  onMounted(()=> {
    const sensEle = document.getElementById('sens');
    sensEle.value = global.steeringSens;
    dispVal.value = global.steeringSens;
    nameEle       = document.getElementById('wifiName');
    nameAtOpen    = nameEle.value;
  });

  evtBus.on('savedName', () => {
    evtBus.emit('showMessage', {
      messageText:  'Wifi name was saved. ' +
                    'Please turn T-Bot back on.',
      callbackText: 'closeMessage',
      buttonText:   'Ok'}
    );
  });

  // This doesn't work ???
  // const reBadChars = new RegExp(/[{":\\,}?\$\[\]+]/,'g');

  const doneClick = () => {
    evtBus.emit('menuOpen', false);

    let   name    = nameEle.value.trim();
    const newName = name;
    let   strlen  = name.length;
    if(name === nameAtOpen) return;
    
    const hadBadChar = /[{":\\,}?\$\[\]+]/.test(name);
    if(hadBadChar)
      name = name.replace(/[{":\\,}?\$\[\]+]/g, ' ').trim();
    if(name.length == 0) {
      evtBus.emit('showMessage', {
        messageText:  `Invalid name "${newName}" was not saved.`,
        callbackText: 'closeMessage',
        buttonText:   'Ok'}
      );
      return;
    }
    console.log("setting wifiName:", name);
    global.wifiName = name;
    evtBus.emit("setWifiName", name);

    if(hadBadChar) {
      evtBus.emit('showMessage', {
        messageText:  'The characters {}[]":\,?$+ ' +
                      'are not allowed and have '   +
                      'been replaced with spaces.',
        callbackText: 'savedName',
        buttonText:   'Ok'}
      );
    }
    else evtBus.emit("savedName");
  }
</script>
