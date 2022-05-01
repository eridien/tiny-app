<template lang='pug'>
#app
  Header(:style="{width:'100vw',                   \
                  height:`${global.HDR_HGT-15}px`, \
                  margin:'0 5vw 0 5vw'}")

  Controls(style="width:calc(100vw-20px);")

</template>

<script setup>
  import {onMounted, ref, inject, 
          getCurrentInstance } from 'vue'
  import  Header     from './components/header.vue'
  import  Controls   from './components/controls.vue'
  import {initWebsocket, setVel, setYaw, 
          stop, pwrOff, calibrate} from "./websocket.js";

  const global = inject('global');
  const evtBus = inject('evtBus'); 

  global.HDR_HGT = 65;

// status constants from bot
  const fcTime        = 't';
  const fcElapsedMs   = 'm';
  const fcBatV        = 'b';
  const fcRssi        = 'w';
  const fcVelPwm      = 'v';
  const fcYawRate     = 'y';
  const fcYawErrInt   = 'i';
  const fcLeftPwm     = 'l';
  const fcRightPwm    = 'r';
  const fcCalibDone   = 'c';
  const fcError       = 'e';

  evtBus.on('stop',   () => { stop();   });
  evtBus.on('pwrOff', () => { pwrOff(); });

  evtBus.on('startCalibration', () => { 
    console.log(`startCalibration`);
    evtBus.emit('showMessage', {
      messageText:  'Calibrating...',
      buttonText:   'Cancel',
      callbackText: 'closeCalibration',
      busyIndicator:'on',
    });
    calibrate();
  });

  let calibrating = false;

  const calibrationDone = () => {
    if(!calibrating) return;
    
    console.log('calibration done');
    evtBus.emit('showMessage', {
      messageText:  'Calibrating finished.',
      buttonText:   'Close',
      callbackText: 'closeCalibration',
      busyIndicator: 'off',
    });
  };

  evtBus.on('closeCalibration', () => {
    console.log('closing calibration');
    evtBus.emit('menuOpen', false);
  });

  const noWsMsg = 'No connection to T-Bot.';

  const showNoWebsocket = () => {
    console.log('showNoWebsocket');
    evtBus.emit('menuOpen', false);

    evtBus.emit('showMessage', { messageText:noWsMsg });
  };

  let websocketOpen = false;

  const websocketCB = (status) => {
    if(status.websocketOpen !== undefined) {
      if(websocketOpen  && !status.websocketOpen)
        showNoWebsocket();
      if(!websocketOpen &&  status.websocketOpen &&
          global.curMsg == noWsMsg)
        evtBus.emit('closeMessage');
      websocketOpen = status.websocketOpen;
      return;
    }
    evtBus.emit('rssi', status?.[fcRssi]);
    evtBus.emit('batv', status?.[fcBatV]);
    if(status?.[fcCalibDone]) calibrationDone();
    const err = status?.[fcError];
    if(err) console.log(`BOT ERROR: ${err}`);
  };

  onMounted(async() => { 
    console.log(`---- App Mounted, ` +
                `hostname: ${global.hostname} ---`);
    initWebsocket(global.hostname, websocketCB);
  });
</script>

<style>
</style>