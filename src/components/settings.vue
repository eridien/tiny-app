<template lang='pug'>
#settings(style="border-radius:12px; font-size:20px; \
                 background-color:white;             \
                 margin:20px; padding:20px;")

  div(style="margin:20px 0 20px 0") Wi-Fi Name
  div(style="position:relative; font-size:1em; display:flex;  \
             justifyContent:left;                             \
             alignItems:stretch;")
    label(for="nameInp" 
          style="font-size:1em; margin-top:0.1em;") T-Bot- 
    input(id="wifiName" type="text" name="nameInp"
          style="width:60%; height:25px; font-size:.9em;      \
                 margin-bottom:20px; font-weight:500;"
         :value="global.curStatus[global.fcName]")

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

  const wifiName = ref(global.wifiName);

  let nameEle;
  let nameAtOpen;

  onMounted(()=> {
    nameEle    = document.getElementById('wifiName');
    nameAtOpen = nameEle.value;
  });

  evtBus.on('savedName', () => {
    evtBus.emit('showMessage', {
      messageText:  'Wifi name was saved. ' +
                    'Please turn T-Bot back on.',
      callbackText: 'closeMessage',
      buttonText:   'Ok'}
    );
  });

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
