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

  div(style="display:flex;")
    input(id="compass" type="checkbox" name="compassChk"
          style="margin:.3em 6px 0 6px; order:1;" 
          @input="compassEvt")
    label(for="compassChk" style="order:2; font-size:.9em;") 
      | Compass Steering Mode

  hr(style="color:black; margin:13px;")

  div(style="margin:20px 0 10px 0") Wi-Fi Name
  div(style="position:relative; font-size:1em; display:flex; \
             justifyContent:left;                             \
             alignItems:stretch;")
    label(for="nameInp" 
          style="font-size:1em; margin-top:0.1em;") T-Bot- 
    input(id="wifiName" type="text" name="nameInp"
          style="width:60%; height:25px; font-size:.7em;" 
         :value="global.curStatus[global.fcName]")

  hr(style="color:black; margin-top:20px;")

  div(@click="doneClick"
      style="float:right; font-size:1em;           \
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
