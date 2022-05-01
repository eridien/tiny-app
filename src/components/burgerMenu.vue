<template lang='pug'>
#burgerMenu(style="border-radius:12px; font-size:28px; \
                   background-color:#c8c8c8;           \
                   display:table;\
                   position:relative;")
  div
    .button(@click="stopEvt"     ) Stop
    .button(@click="pwrOffEvt"   ) Power Off
    .button(@click="settingsEvt" ) Settings 
    .button(@click="calibrateEvt") Calibrate
    .button(@click="setMotionEvt") Constants
    .button(@click="showStatusEvt") Status 
    .button(@click="closeMenuEvt") Close 

  #cover(v-show="settingsOpen"
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
  Status(v-show="statusOpen"
          style="position:fixed; z-index:1001;  \
                top:90px; right:70px;")
</template>

<style>
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
  import Status    from './status.vue';

  const evtBus = inject('evtBus');   

  const settingsOpen = ref(false);
  const motionOpen   = ref(false);
  const statusOpen   = ref(false);

  evtBus.on('menuOpen', (open) => {
    if(!open) settingsOpen.value = false;
  });

  const closeMenu = 
        () => evtBus.emit('menuOpen', false);

  const settingsEvt = ()=> {
    settingsOpen.value = true;
  }
  const calibrateEvt = ()=> {
    console.log('emitting calibration message');
    evtBus.emit('showMessage', {
      messageText:  'Keep T-Bot still and press start.',
      buttonText:   'Start',
      callbackText: 'startCalibration',
      busyIndicator: 'off'}
    );
  }

  const setMotionEvt = ()=> {
    motionOpen.value = true;
  }
  const showStatusEvt = ()=> {
    statusOpen.value = true;
  }

  const stopEvt = () => {
    evtBus.emit('stop');
    closeMenu();
  }

  const pwrOffEvt = () => {
    evtBus.emit('pwrOff');
    closeMenu();
  }

  const closeMenuEvt = () => {
    closeMenu();
  }

</script>
