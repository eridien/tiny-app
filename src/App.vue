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
          //  getYawPk, getYawIk, getMaxYawIk, getBoostK,}
          from "./websocket.js";

  const SHOW_INIT_WS = false;

  const setYawPkDbg    =    1.0;
  const setYawIkDbg    =    0.0;
  const setMaxYawIkDbg =  255.0;
  const setBoostKDbg   =      0;

  const global = inject('global');
  const evtBus = inject('evtBus'); 

  global.HDR_HGT = 65;

// status from bot
  const fcBatV      = 'b';
  const fcRssi      = 'w';
  const fcName      = 'n';

// motion state from bot
  const fcAccelOfs  = 'a';
  const fcYawOfs    = 'd';
  const fcVelPwm    = 'v';
  const fcYawRate   = 'y';
  const fcYawErrInt = 'i';
  const fcLeftPwm   = 'l';
  const fcRightPwm  = 'r';

// motion constants from bot
  const fcYawPkC    = 'f';
  const fcYawIkC    = 'g';
  const fcMaxYawIC  = 'h';
  const fcBoostKStC = 'j';

  const fcCalibDone = 'c';
  const fcError     = 'e';

  global.fcName=fcName;

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
    console.log('calibration done');
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
    if(status.newerConn !== undefined) {
      evtBus.emit('showMessage',
          {messageText: 'Another controller has connected to ' +
                        'this T-Bot and you have been '   +
                        'disconnected. Reconnecting '     +
                        'will disconnect the other controller.',
          buttonText:   'Reconnect',
          ignoreNoWs:    true,
          callbackText: 'resumeWs'});  
    }
    if(status.websocketOpen !== undefined) {
      if(websocketOpen && !status.websocketOpen)
        showNoWebsocket();
      if(!websocketOpen && status.websocketOpen) {
        evtBus.emit('closeMessage', 'noWsMsg');
        
        evtBus.emit('setYawPk',    setYawPkDbg   );
        evtBus.emit('setYawIk',    setYawIkDbg   );
        evtBus.emit('setMaxYawIk', setMaxYawIkDbg);
        evtBus.emit('setBoostK',   setBoostKDbg  );
      }
      websocketOpen = status.websocketOpen;
      return;
    }
    Object.assign(global.curStatus, status);

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

    if(SHOW_INIT_WS) showNoWebsocket(true);
  });
</script>
