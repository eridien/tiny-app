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
  import { initWebsocket,  
           setVel, setYaw, stop, pwrOff, calibrate,
           setYawPk, setYawIk,  setMaxYawIk, 
           setName,  setBoostK, resumeWs}
          from "./websocket.js";

  const global = inject('global');
  const evtBus = inject('evtBus'); 

  global.HDR_HGT = 65;

// status from bot
  const fcBatV      = 'b';
  const fcRssi      = 'w';
  const AccelOfs    = 'a';
  const YawOfs      = 'd';
  const fcCalibDone = 'c';
  const fcError     = 'e';

  // wifi ssid suffix from bot
  global.fcName = 'n';
  
  // motion state debug from bot
  global.fcStateCodes = {
    fcBatV          : 'b',
    fcRssi          : 'w',
    fcVelTgt        : 'v',
    fcYawTgt        : 't',
    fcYawRate       : 'y',
    fcYawRateErr    : 'z',
    fcYawRateErrInt : 'i',
    fcLeftPwm       : 'l',
    fcRightPwm      : 'r',
  }

  evtBus.on('vel',         (vel)   => {setVel(vel);      });
  evtBus.on('yaw',         (yaw)   => {setYaw(yaw);      });
  evtBus.on('stop',        ()      => {stop();           });
  evtBus.on('pwrOff',      ()      => {pwrOff();         });
  evtBus.on('setYawPk',    (awPk)  => {setYawPk(awPk);   });
  evtBus.on('setYawIk',    (awIk)  => {setYawIk(awIk);   });
  evtBus.on('setMaxYawIk', (max)   => {setMaxYawIk(max); });
  evtBus.on('setBoostK',   (boost) => {setBoostK(boost); });
  evtBus.on("setWifiName", (name)  => {setName(name);    }); 
  evtBus.on("resumeWs",    ()      => {resumeWs();       }); 

  let calibrating = false;

  evtBus.on('startCalibration', () => { 
    console.log(`startCalibration`);
    stop();
    evtBus.emit('showMessage', {
      messageText:  'Calibrating...',
      buttonText:   'Cancel',
      callbackText: 'closeCalibration',
      busyIndicator:true,
    });
    calibrate();
    calibrating = true;
  });

  const calibrationDone = () => {
    if(!calibrating) return;
    calibrating = false;
    console.log('calibration done', 
      {AccelOfs: global.curStatus[AccelOfs], 
       YawOfs:   global.curStatus[YawOfs]});
    evtBus.emit('showMessage', {
      messageText:  'Calibrating finished.',
      buttonText:   'Close',
      callbackText: 'closeCalibration',
      busyIndicator: false,
    });
  };

  evtBus.on('closeCalibration', () => {
    console.log('closing calibration');
    calibrating = false;
    evtBus.emit('menuOpen', false);
  });

  const showNoWebsocket = (initial = false) => {
    console.log('showNoWebsocket', {initial});
    evtBus.emit('menuOpen', false);
    evtBus.emit('showMessage',
            {messageText:  'Waiting for connection to a T-Bot. ',
             messageText2: 'Turn on the T-Bot and set ' +
                           'your phone wi-fi to ' +
                           'T-Bot-xxx.', 
             id: 'noWsMsg'});  
  };

  let websocketOpen = false;
  global.curStatus  = {};

  const websocketCB = (status) => {
    if(status.fcCmds !== undefined) {
      global.fcCmds = status.fcCmds;
      return;
    }
    if(status.newerConn !== undefined) {
      evtBus.emit('showMessage',
          {messageText: 'Another controller has connected to ' +
                        'this T-Bot and you have been '   +
                        'disconnected. Reconnecting '     +
                        'will disconnect the other controller.',
          buttonText:   'Reconnect',
          ignoreNoWs:    true,
          callbackText: 'resumeWs'});  
      return;
    }
    if(status.websocketOpen !== undefined) {
      if(websocketOpen && !status.websocketOpen)
           showNoWebsocket();
      if(!websocketOpen && status.websocketOpen)
           evtBus.emit('closeMessage', 'noWsMsg');
      websocketOpen = status.websocketOpen;
      return;
    }
    Object.assign(global.curStatus, status);

    let stateChg = false;
    for(const fc in global.fcStateCodes) {
      if(status[global.fcStateCodes[fc]] !== undefined) {
        stateChg = true;
        break;
      }
    }
    if(stateChg) evtBus.emit('stateChg');

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

    setTimeout(() => {
      if(!websocketOpen) showNoWebsocket();
    }, 1000);
  });
</script>
