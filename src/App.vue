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
  import {initWebsocket,  
          stop, pwrOff, calibrate,
          setYawPk, setYawIk, setMaxYawI, setBoost}
                      from "./websocket.js";

  const global = inject('global');
  const evtBus = inject('evtBus'); 

  global.HDR_HGT = 65;

// status from bot
  const fcBatV      = 'b';
  const fcRssi      = 'w';

// motion state from bot
  const fcAccelOfs  = 'a';
  const fcYawOfs    = 'd';
  const fcVelPwm    = 'v';
  const fcYawRate   = 'y';
  const fcYawErrInt = 'i';
  const fcLeftPwm   = 'l';
  const fcRightPwm  = 'r';

// motion constants from bot
  const fcYawPkC    = 'm';
  const fcYawIkC    = 'n';
  const fcMaxYawIC  = 'o';
  const fcBoostC    = 'q';

  const fcCalibDone = 'c';
  const fcError     = 'e';

  global.curStatus = {};

  evtBus.on('stop',       () =>      { stop();          });
  evtBus.on('pwrOff',     () =>      { pwrOff();        });

  evtBus.on('setYawPk',   (awPk)  => { setYawPk(awPk);  });
  evtBus.on('setYawIk',   (awIk)  => { setYawIk(awIk);  });
  evtBus.on('setMaxYawI', (max)   => { setMaxYawI(max); });
  evtBus.on('setBoost',   (boost) => { setBoost(boost); });

  let calibrating = false;

  evtBus.on('startCalibration', () => { 
    console.log(`startCalibration`);
    evtBus.emit('showMessage', {
      messageText:  'Calibrating...',
      buttonText:   'Cancel',
      callbackText: 'closeCalibration',
      busyIndicator:'on',
    });
    calibrate();
    calibrating = true;
  });

  const calibrationDone = () => {
    if(!calibrating) return;
    calibrating = false;
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
    calibrating = false;
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
      if(websocketOpen && !status.websocketOpen)
        showNoWebsocket();
      if(!websocketOpen &&  status.websocketOpen &&
          global.curMsg == noWsMsg)
        evtBus.emit('closeMessage');
      websocketOpen = status.websocketOpen;
      return;
    }
    if(status?.[fcCalibDone] === 1)
      calibrationDone();
    evtBus.emit('rssi', status?.[fcRssi]);
    evtBus.emit('batv', status?.[fcBatV]);
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