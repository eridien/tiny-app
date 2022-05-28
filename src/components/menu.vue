<template lang='pug'>
#menu(style="border-radius:12px; font-size:14px; \
             background-color:#c8c8c8;           \
             display:table;\
             position:relative;cursor:pointer;")
  #buttons
    .button(@click="stopEvt"     )  Stop
    .button(@click="resetEvt"    )  Reset
    .button(@click="pwrOffEvt"   )  Power Off
    .button(@click="settingsEvt" )  Settings 
    .button(@click="calibrateEvt")  Calibrate
    .button(@click="setMotionEvt")  Constants
    .button(@click="closeMenuEvt")  Close 

  #cover(v-show="settingsOpen || motionOpen || statusOpen"
         style="position:absolute;               \
                left:0; top:0;                   \
                border-radius:12px;              \
                width:100%; height:100%;         \
                opacity:0.3;                     \
                background-color:black;          \
                display: table-cell;")

  Settings(v-show="settingsOpen"
           style="position:fixed; z-index:1001;  \
                  top:90px; right:70px;")

  SetMotion(v-show="motionOpen"
            style="position:fixed; z-index:1001;  \
                   top:90px; right:70px;")

</template>

<style scoped>
.button {
  border:1px solid black;
  margin:10px; padding:10px;
  background-color:white;
  border-radius:12px;
}
</style>

<script setup>
  import {ref, inject} from 'vue'
  import Settings  from './settings.vue';
  import SetMotion from './setMotion.vue';

  const evtBus = inject('evtBus');   

  const settingsOpen = ref(false);
  const motionOpen   = ref(false);
  const statusOpen   = ref(false);

  evtBus.on('menuOpen', (open) => {
    if(!open) settingsOpen.value = false;
  });

  const closeMenu = 
    () => evtBus.emit('menuOpen', false);

  const stopEvt = () => {
    evtBus.emit('stop');
    closeMenu();
  }
  const resetEvt = () => {
    evtBus.emit('reset');
    closeMenu();
  }
  const pwrOffEvt = () => {
    evtBus.emit('pwrOff');
    closeMenu();
  }
  const settingsEvt = ()=> {
    settingsOpen.value = true;
  }
  const calibrateEvt = ()=> {
    console.log('emitting calibration message');
    evtBus.emit('showMessage', {
      messageText:  'Keep T-Bot still on a level ' +
                        'surface and press start.',
      buttonText2:  'Cancel',
      callbackText2:'closeMessage',
      buttonText:   'Start',
      callbackText: 'startCalibration',
      busyIndicator: true}
    );
  }
  const setMotionEvt = ()=> {
    motionOpen.value = true;
  }
  const showStatusEvt = ()=> {
    statusOpen.value = true;
  }
  const closeMenuEvt = () => {
    closeMenu();
  }

</script>
